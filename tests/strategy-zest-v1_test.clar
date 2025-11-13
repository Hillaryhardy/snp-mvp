;; Zest Strategy V1 - Test Suite

(define-constant deployer tx-sender)
(define-constant vault 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

(define-public (test-deployment)
    (let ((info (unwrap-panic (contract-call? .strategy-zest-v1 get-strategy-info))))
        (asserts! (is-eq (get total-lent info) u0) (err "Initial should be 0"))
        (ok "Deployment passed")))

(define-public (test-strategy-name)
    (let ((name (unwrap-panic (contract-call? .strategy-zest-v1 get-name))))
        (asserts! (is-eq name "Zest Protocol BTC-Backed Lending") (err "Name mismatch"))
        (ok "Name passed")))

(define-public (test-deposit-success)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u10000000))
        (let ((balance (unwrap-panic (contract-call? .strategy-zest-v1 get-balance))))
            (asserts! (is-eq balance u10000000) (err "Balance wrong"))
            (ok "Deposit passed"))))

(define-public (test-deposit-below-minimum)
    (let ((result (contract-call? .strategy-zest-v1 deposit u1000000)))
        (asserts! (is-err result) (err "Should fail"))
        (ok "Below min passed")))

(define-public (test-withdrawal-request)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u50000000))
        (let ((result (contract-call? .strategy-zest-v1 request-withdrawal u10000000)))
            (asserts! (is-ok result) (err "Request should succeed"))
            (ok "Request passed"))))

(define-public (test-harvest-success)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u100000000))
        (let ((result (contract-call? .strategy-zest-v1 harvest)))
            (asserts! (is-ok result) (err "Harvest should succeed"))
            (ok "Harvest passed"))))

(define-public (test-compound-success)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-zest-v1 harvest))
        (let ((result (contract-call? .strategy-zest-v1 compound)))
            (asserts! (is-ok result) (err "Compound should succeed"))
            (ok "Compound passed"))))

(define-public (test-emergency-withdraw)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u50000000))
        (let ((result (contract-call? .strategy-zest-v1 emergency-withdraw)))
            (asserts! (is-ok result) (err "Emergency should succeed"))
            (ok "Emergency passed"))))

(define-public (test-estimate-apy)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-zest-v1 harvest))
        (let ((apy (unwrap-panic (contract-call? .strategy-zest-v1 estimate-apy))))
            (asserts! (> apy u0) (err "APY should be positive"))
            (ok "APY passed"))))

(define-public (test-pool-stats)
    (let ((stats (unwrap-panic (contract-call? .strategy-zest-v1 get-pool-stats))))
        (asserts! (>= (get utilization stats) u0) (err "Stats invalid"))
        (ok "Pool stats passed")))

(define-public (test-user-position)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u50000000))
        (let ((pos (unwrap-panic (contract-call? .strategy-zest-v1 get-user-position deployer))))
            (asserts! (is-eq (get lent pos) u50000000) (err "Position wrong"))
            (ok "Position passed"))))

(define-public (test-multiple-harvests)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-zest-v1 harvest))
        (unwrap-panic (contract-call? .strategy-zest-v1 harvest))
        (let ((info (unwrap-panic (contract-call? .strategy-zest-v1 get-strategy-info))))
            (asserts! (is-eq (get harvest-count info) u2) (err "Count wrong"))
            (ok "Multiple harvests passed"))))

(define-public (test-total-assets-with-interest)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-zest-v1 harvest))
        (let ((assets (unwrap-panic (contract-call? .strategy-zest-v1 get-total-assets))))
            (asserts! (> assets u100000000) (err "Should include interest"))
            (ok "Total assets passed"))))

(define-public (test-toggle-active)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 toggle-active false))
        (let ((active (unwrap-panic (contract-call? .strategy-zest-v1 is-strategy-active))))
            (asserts! (is-eq active false) (err "Should be inactive"))
            (ok "Toggle passed"))))

(define-public (test-full-workflow)
    (begin
        (unwrap-panic (contract-call? .strategy-zest-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-zest-v1 harvest))
        (unwrap-panic (contract-call? .strategy-zest-v1 compound))
        (let ((balance (unwrap-panic (contract-call? .strategy-zest-v1 get-balance))))
            (asserts! (> balance u100000000) (err "Balance should grow"))
            (ok "Workflow passed"))))

(define-public (run-all-tests)
    (begin
        (print "==== Zest Strategy V1 Tests ====")
        (print (unwrap-panic (test-deployment)))
        (print (unwrap-panic (test-strategy-name)))
        (print (unwrap-panic (test-deposit-success)))
        (print (unwrap-panic (test-deposit-below-minimum)))
        (print (unwrap-panic (test-withdrawal-request)))
        (print (unwrap-panic (test-harvest-success)))
        (print (unwrap-panic (test-compound-success)))
        (print (unwrap-panic (test-emergency-withdraw)))
        (print (unwrap-panic (test-estimate-apy)))
        (print (unwrap-panic (test-pool-stats)))
        (print (unwrap-panic (test-user-position)))
        (print (unwrap-panic (test-multiple-harvests)))
        (print (unwrap-panic (test-total-assets-with-interest)))
        (print (unwrap-panic (test-toggle-active)))
        (print (unwrap-panic (test-full-workflow)))
        (print "==== 15 Tests Complete ====")
        (ok "All tests passed")))
