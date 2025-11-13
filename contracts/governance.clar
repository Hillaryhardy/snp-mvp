;; governance.clar
;; Stacks Nexus Protocol - Governance & Timelock
;; Multi-sig timelock for critical vault operations

;; =============================================================================
;; ERROR CODES
;; =============================================================================
(define-constant ERR-NOT-AUTHORIZED (err u400))
(define-constant ERR-ALREADY-EXECUTED (err u401))
(define-constant ERR-NOT-READY (err u402))
(define-constant ERR-EXPIRED (err u403))
(define-constant ERR-INVALID-THRESHOLD (err u404))
(define-constant ERR-DUPLICATE-SIGNER (err u405))
(define-constant ERR-NOT-PENDING (err u406))

;; =============================================================================
;; CONSTANTS
;; =============================================================================
(define-constant MIN-DELAY u144) ;; ~24 hours
(define-constant MAX-DELAY u4320) ;; ~30 days
(define-constant GRACE-PERIOD u1008) ;; ~7 days after ready
(define-constant MAX-SIGNERS u10)

;; =============================================================================
;; DATA STRUCTURES
;; =============================================================================

;; Proposal structure
(define-map proposals uint {
  target: principal,
  function: (string-ascii 50),
  params: (buff 1024),
  eta: uint, ;; Estimated time of execution (block height)
  executed: bool,
  cancelled: bool,
  proposer: principal
})

(define-map proposal-votes uint (list 10 principal))
(define-data-var proposal-nonce uint u0)

;; Multi-sig configuration
(define-data-var signers (list 10 principal) (list))
(define-data-var threshold uint u2) ;; Number of signatures required
(define-data-var admin principal tx-sender)

;; Timelock configuration
(define-data-var delay uint u144) ;; Default 24 hours

;; =============================================================================
;; ADMIN FUNCTIONS
;; =============================================================================

(define-public (set-signers (new-signers (list 10 principal)) (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) ERR-NOT-AUTHORIZED)
    (asserts! (>= new-threshold u1) ERR-INVALID-THRESHOLD)
    (asserts! (<= new-threshold (len new-signers)) ERR-INVALID-THRESHOLD)
    (asserts! (is-unique-list new-signers) ERR-DUPLICATE-SIGNER)
    
    (var-set signers new-signers)
    (var-set threshold new-threshold)
    (ok true)))

(define-public (set-delay (new-delay uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) ERR-NOT-AUTHORIZED)
    (asserts! (>= new-delay MIN-DELAY) ERR-INVALID-THRESHOLD)
    (asserts! (<= new-delay MAX-DELAY) ERR-INVALID-THRESHOLD)
    (var-set delay new-delay)
    (ok true)))

;; =============================================================================
;; PROPOSAL FUNCTIONS
;; =============================================================================

(define-public (propose 
  (target principal) 
  (function (string-ascii 50))
  (params (buff 1024)))
  (let (
    (nonce (var-get proposal-nonce))
    (current-height burn-block-height)
    (eta (+ current-height (var-get delay)))
  )
    (asserts! (is-signer tx-sender) ERR-NOT-AUTHORIZED)
    
    (map-set proposals nonce {
      target: target,
      function: function,
      params: params,
      eta: eta,
      executed: false,
      cancelled: false,
      proposer: tx-sender
    })
    
    ;; Add proposer as first vote
    (map-set proposal-votes nonce (list tx-sender))
    (var-set proposal-nonce (+ nonce u1))
    
    (ok nonce)))

(define-public (vote (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR-NOT-PENDING))
    (current-votes (default-to (list) (map-get? proposal-votes proposal-id)))
  )
    (asserts! (is-signer tx-sender) ERR-NOT-AUTHORIZED)
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (not (get cancelled proposal)) ERR-NOT-PENDING)
    (asserts! (not (has-voted proposal-id tx-sender)) ERR-ALREADY-EXECUTED)
    
    (map-set proposal-votes proposal-id 
      (unwrap-panic (as-max-len? (append current-votes tx-sender) u10)))
    
    (ok true)))

(define-public (execute (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR-NOT-PENDING))
    (votes (len (default-to (list) (map-get? proposal-votes proposal-id))))
  )
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (not (get cancelled proposal)) ERR-NOT-PENDING)
    (asserts! (>= votes (var-get threshold)) ERR-NOT-AUTHORIZED)
    (asserts! (>= burn-block-height (get eta proposal)) ERR-NOT-READY)
    (asserts! (<= burn-block-height (+ (get eta proposal) GRACE-PERIOD)) ERR-EXPIRED)
    
    ;; Mark as executed
    (map-set proposals proposal-id (merge proposal {executed: true}))
    
    ;; Note: Actual execution would call the target contract
    ;; For MVP, we just mark it as executed
    ;; In production: (try! (contract-call? (get target proposal) ...))
    
    (ok true)))

(define-public (cancel (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR-NOT-PENDING))
  )
    (asserts! (or 
      (is-eq tx-sender (get proposer proposal))
      (is-eq tx-sender (var-get admin))) ERR-NOT-AUTHORIZED)
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    
    (map-set proposals proposal-id (merge proposal {cancelled: true}))
    (ok true)))

;; =============================================================================
;; VIEW FUNCTIONS
;; =============================================================================

(define-read-only (get-proposal (proposal-id uint))
  (ok (map-get? proposals proposal-id)))

(define-read-only (get-proposal-votes (proposal-id uint))
  (ok (default-to (list) (map-get? proposal-votes proposal-id))))

(define-read-only (get-vote-count (proposal-id uint))
  (ok (len (default-to (list) (map-get? proposal-votes proposal-id)))))

(define-read-only (has-voted (proposal-id uint) (signer principal))
  (is-some (index-of (default-to (list) (map-get? proposal-votes proposal-id)) signer)))

(define-read-only (is-ready (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (and
      (not (get executed proposal))
      (not (get cancelled proposal))
      (>= burn-block-height (get eta proposal))
      (<= burn-block-height (+ (get eta proposal) GRACE-PERIOD))
      (>= (len (default-to (list) (map-get? proposal-votes proposal-id))) 
          (var-get threshold))))
    (ok false)))

(define-read-only (get-signers)
  (ok (var-get signers)))

(define-read-only (get-threshold)
  (ok (var-get threshold)))

(define-read-only (get-delay)
  (ok (var-get delay)))

(define-read-only (is-signer (account principal))
  (is-some (index-of (var-get signers) account)))

;; =============================================================================
;; HELPER FUNCTIONS
;; =============================================================================

(define-private (is-unique-list (items (list 10 principal)))
  (is-eq (len items) (len (dedup items))))

(define-private (dedup (items (list 10 principal)))
  (fold dedup-fold items (list)))

(define-private (dedup-fold (item principal) (acc (list 10 principal)))
  (if (is-some (index-of acc item))
    acc
    (unwrap-panic (as-max-len? (append acc item) u10))))
