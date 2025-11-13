;; Hermetica Tests
(define-constant deployer tx-sender)

(define-public (test-deployment)
    (let ((info (unwrap-panic (contract-call? .strategy-hermetica-v1 get-strategy-info))))
        (asserts! (is-eq (get total-deposited info) u0) (err "Init fail"))
        (ok "Deployment passed")))

(define-public (test-deposit)
    (begin
        (unwrap-panic (contract-call? .strategy-hermetica-v1 deposit u10000000))
        (let ((bal (unwrap-panic (contract-call? .strategy-hermetica-v1 get-balance))))
            (asserts! (is-eq bal u10000000) (err "Bal wrong"))
            (ok "Deposit passed"))))

(define-public (test-collateral-ratio)
    (begin
        (unwrap-panic (contract-call? .strategy-hermetica-v1 deposit u15000000))
        (let ((ratio (unwrap-panic (contract-call? .strategy-hermetica-v1 get-collateral-ratio))))
            (asserts! (> ratio u0) (err "Ratio wrong"))
            (ok "Ratio passed"))))

(define-public (test-harvest)
    (begin
        (unwrap-panic (contract-call? .strategy-hermetica-v1 deposit u100000000))
        (let ((result (contract-call? .strategy-hermetica-v1 harvest)))
            (asserts! (is-ok result) (err "Harvest fail"))
            (ok "Harvest passed"))))

(define-public (run-all-tests)
    (begin
        (print "==== Hermetica Tests ====")
        (print (unwrap-panic (test-deployment)))
        (print (unwrap-panic (test-deposit)))
        (print (unwrap-panic (test-collateral-ratio)))
        (print (unwrap-panic (test-harvest)))
        (print "==== 4 Tests Complete ====")
        (ok "Passed")))
