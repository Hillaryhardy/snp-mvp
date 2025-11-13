;; Bitflow Tests
(define-constant deployer tx-sender)

(define-public (test-deployment)
    (let ((info (unwrap-panic (contract-call? .strategy-bitflow-v1 get-strategy-info))))
        (asserts! (is-eq (get total-deployed info) u0) (err "Init fail"))
        (ok "Deployment passed")))

(define-public (test-deposit)
    (begin
        (unwrap-panic (contract-call? .strategy-bitflow-v1 deposit u10000000))
        (let ((bal (unwrap-panic (contract-call? .strategy-bitflow-v1 get-balance))))
            (asserts! (is-eq bal u10000000) (err "Bal wrong"))
            (ok "Deposit passed"))))

(define-public (test-harvest)
    (begin
        (unwrap-panic (contract-call? .strategy-bitflow-v1 deposit u100000000))
        (let ((result (contract-call? .strategy-bitflow-v1 harvest)))
            (asserts! (is-ok result) (err "Harvest fail"))
            (ok "Harvest passed"))))

(define-public (test-compound)
    (begin
        (unwrap-panic (contract-call? .strategy-bitflow-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-bitflow-v1 harvest))
        (let ((result (contract-call? .strategy-bitflow-v1 compound)))
            (asserts! (is-ok result) (err "Compound fail"))
            (ok "Compound passed"))))

(define-public (run-all-tests)
    (begin
        (print "==== Bitflow Tests ====")
        (print (unwrap-panic (test-deployment)))
        (print (unwrap-panic (test-deposit)))
        (print (unwrap-panic (test-harvest)))
        (print (unwrap-panic (test-compound)))
        (print "==== 4 Tests Complete ====")
        (ok "Passed")))
