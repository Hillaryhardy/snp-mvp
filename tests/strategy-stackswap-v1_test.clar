;; StackSwap Strategy V1 - Test Suite
;; 25 comprehensive tests covering all functionality

(define-constant deployer tx-sender)
(define-constant vault-address 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant user-1 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)

;; Test 1: Deployment
(define-public (test-deployment)
    (let
        (
            (info (unwrap-panic (contract-call? .strategy-stackswap-v1 get-strategy-info)))
        )
        (asserts! (is-eq (get total-deployed info) u0) (err "Initial deployed should be 0"))
        (asserts! (is-eq (get is-active info) true) (err "Should be active"))
        (ok "Deployment test passed")
    )
)

;; Test 2: Strategy name
(define-public (test-strategy-name)
    (let
        (
            (name (unwrap-panic (contract-call? .strategy-stackswap-v1 get-name)))
        )
        (asserts! (is-eq name "StackSwap STX Liquidity Provider") (err "Name mismatch"))
        (ok "Strategy name test passed")
    )
)

;; Test 3: Deposit success
(define-public (test-deposit-success)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u10000000))
        (let
            (
                (balance (unwrap-panic (contract-call? .strategy-stackswap-v1 get-balance)))
            )
            (asserts! (is-eq balance u10000000) (err "Balance should be 10 STX"))
            (ok "Deposit success test passed")
        )
    )
)

;; Test 4: Deposit below minimum
(define-public (test-deposit-below-minimum)
    (let
        (
            (deposit-result (contract-call? .strategy-stackswap-v1 deposit u100000))
        )
        (asserts! (is-err deposit-result) (err "Should fail"))
        (asserts! (is-eq (unwrap-err-panic deposit-result) u5004) (err "Wrong error"))
        (ok "Deposit below minimum test passed")
    )
)

;; Test 5: Withdraw success
(define-public (test-withdraw-success)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u10000000))
        (let
            (
                (withdraw-result (contract-call? .strategy-stackswap-v1 withdraw u5000000))
            )
            (asserts! (is-ok withdraw-result) (err "Withdraw should succeed"))
            (ok "Withdraw success test passed")
        )
    )
)

;; Test 6: Withdraw insufficient balance
(define-public (test-withdraw-insufficient-balance)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u5000000))
        (let
            (
                (withdraw-result (contract-call? .strategy-stackswap-v1 withdraw u10000000))
            )
            (asserts! (is-err withdraw-result) (err "Should fail"))
            (ok "Withdraw insufficient test passed")
        )
    )
)

;; Test 7: Harvest success
(define-public (test-harvest-success)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u100000000))
        (let
            (
                (harvest-result (contract-call? .strategy-stackswap-v1 harvest))
            )
            (asserts! (is-ok harvest-result) (err "Harvest should succeed"))
            (ok "Harvest success test passed")
        )
    )
)

;; Test 8: Multiple harvests
(define-public (test-multiple-harvests)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (let
            (
                (info (unwrap-panic (contract-call? .strategy-stackswap-v1 get-strategy-info)))
            )
            (asserts! (is-eq (get harvest-count info) u2) (err "Should have 2 harvests"))
            (ok "Multiple harvests test passed")
        )
    )
)

;; Test 9: Compound success
(define-public (test-compound-success)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (let
            (
                (compound-result (contract-call? .strategy-stackswap-v1 compound))
            )
            (asserts! (is-ok compound-result) (err "Compound should succeed"))
            (ok "Compound success test passed")
        )
    )
)

;; Test 10: Compound no rewards
(define-public (test-compound-no-rewards)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u10000000))
        (let
            (
                (compound-result (contract-call? .strategy-stackswap-v1 compound))
            )
            (asserts! (is-err compound-result) (err "Should fail"))
            (ok "Compound no rewards test passed")
        )
    )
)

;; Test 11: Emergency withdraw
(define-public (test-emergency-withdraw)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u50000000))
        (let
            (
                (emergency-result (contract-call? .strategy-stackswap-v1 emergency-withdraw))
            )
            (asserts! (is-ok emergency-result) (err "Emergency should succeed"))
            (ok "Emergency withdraw test passed")
        )
    )
)

;; Test 12: Deposit after emergency
(define-public (test-deposit-after-emergency)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 emergency-withdraw))
        (let
            (
                (deposit-result (contract-call? .strategy-stackswap-v1 deposit u5000000))
            )
            (asserts! (is-err deposit-result) (err "Should fail"))
            (ok "Deposit after emergency test passed")
        )
    )
)

;; Test 13: Toggle active
(define-public (test-toggle-active)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 toggle-active false))
        (let
            (
                (is-active (unwrap-panic (contract-call? .strategy-stackswap-v1 is-strategy-active)))
            )
            (asserts! (is-eq is-active false) (err "Should be inactive"))
            (ok "Toggle active test passed")
        )
    )
)

;; Test 14: Get user position
(define-public (test-get-user-position)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u50000000))
        (let
            (
                (position (unwrap-panic (contract-call? .strategy-stackswap-v1 get-user-position deployer)))
            )
            (asserts! (is-eq (get deposited position) u50000000) (err "Position mismatch"))
            (ok "Get user position test passed")
        )
    )
)

;; Test 15: Estimate APY
(define-public (test-estimate-apy)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (let
            (
                (apy (unwrap-panic (contract-call? .strategy-stackswap-v1 estimate-apy)))
            )
            (asserts! (> apy u0) (err "APY should be positive"))
            (ok "Estimate APY test passed")
        )
    )
)

;; Test 16: Full workflow
(define-public (test-full-workflow)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u100000000))
        (let ((balance-1 (unwrap-panic (contract-call? .strategy-stackswap-v1 get-balance))))
            (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
            (unwrap-panic (contract-call? .strategy-stackswap-v1 compound))
            (let ((balance-2 (unwrap-panic (contract-call? .strategy-stackswap-v1 get-balance))))
                (asserts! (> balance-2 balance-1) (err "Balance should increase"))
                (ok "Full workflow test passed")
            )
        )
    )
)

;; Test 17: Multiple deposits
(define-public (test-multiple-deposits)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u10000000))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u20000000))
        (let
            (
                (balance (unwrap-panic (contract-call? .strategy-stackswap-v1 get-balance)))
            )
            (asserts! (is-eq balance u30000000) (err "Balance should be 30 STX"))
            (ok "Multiple deposits test passed")
        )
    )
)

;; Test 18: Set vault address
(define-public (test-set-vault-address)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 set-vault-address user-1))
        (ok "Set vault address test passed")
    )
)

;; Test 19: Clear emergency mode
(define-public (test-clear-emergency-mode)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 emergency-withdraw))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 clear-emergency-mode))
        (let
            (
                (info (unwrap-panic (contract-call? .strategy-stackswap-v1 get-strategy-info)))
            )
            (asserts! (is-eq (get emergency-mode info) false) (err "Emergency should be cleared"))
            (ok "Clear emergency test passed")
        )
    )
)

;; Test 20: Total assets with rewards
(define-public (test-total-assets-with-rewards)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (let
            (
                (total-assets (unwrap-panic (contract-call? .strategy-stackswap-v1 get-total-assets)))
            )
            (asserts! (> total-assets u100000000) (err "Total should include rewards"))
            (ok "Total assets test passed")
        )
    )
)

;; Test 21-25: Additional edge cases
(define-public (test-zero-withdraw)
    (let
        (
            (result (contract-call? .strategy-stackswap-v1 withdraw u0))
        )
        (asserts! (is-err result) (err "Zero withdraw should fail"))
        (ok "Zero withdraw test passed")
    )
)

(define-public (test-strategy-info-structure)
    (let
        (
            (info (unwrap-panic (contract-call? .strategy-stackswap-v1 get-strategy-info)))
        )
        (asserts! (>= (get total-deployed info) u0) (err "Info structure invalid"))
        (ok "Strategy info structure test passed")
    )
)

(define-public (test-harvest-increments-count)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u50000000))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (let
            (
                (info (unwrap-panic (contract-call? .strategy-stackswap-v1 get-strategy-info)))
            )
            (asserts! (is-eq (get harvest-count info) u3) (err "Harvest count wrong"))
            (ok "Harvest count test passed")
        )
    )
)

(define-public (test-compound-clears-pending)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u100000000))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 harvest))
        (unwrap-panic (contract-call? .strategy-stackswap-v1 compound))
        (let
            (
                (info (unwrap-panic (contract-call? .strategy-stackswap-v1 get-strategy-info)))
            )
            (asserts! (is-eq (get pending-stsw-rewards info) u0) (err "Should clear rewards"))
            (ok "Compound clears pending test passed")
        )
    )
)

(define-public (test-lp-token-tracking)
    (begin
        (unwrap-panic (contract-call? .strategy-stackswap-v1 deposit u10000000))
        (let
            (
                (info (unwrap-panic (contract-call? .strategy-stackswap-v1 get-strategy-info)))
            )
            (asserts! (> (get total-lp-tokens info) u0) (err "Should have LP tokens"))
            (ok "LP token tracking test passed")
        )
    )
)

;; Test Runner
(define-public (run-all-tests)
    (begin
        (print "==== StackSwap Strategy V1 Test Suite ====")
        (print (unwrap-panic (test-deployment)))
        (print (unwrap-panic (test-strategy-name)))
        (print (unwrap-panic (test-deposit-success)))
        (print (unwrap-panic (test-deposit-below-minimum)))
        (print (unwrap-panic (test-withdraw-success)))
        (print (unwrap-panic (test-withdraw-insufficient-balance)))
        (print (unwrap-panic (test-harvest-success)))
        (print (unwrap-panic (test-multiple-harvests)))
        (print (unwrap-panic (test-compound-success)))
        (print (unwrap-panic (test-compound-no-rewards)))
        (print (unwrap-panic (test-emergency-withdraw)))
        (print (unwrap-panic (test-deposit-after-emergency)))
        (print (unwrap-panic (test-toggle-active)))
        (print (unwrap-panic (test-get-user-position)))
        (print (unwrap-panic (test-estimate-apy)))
        (print (unwrap-panic (test-full-workflow)))
        (print (unwrap-panic (test-multiple-deposits)))
        (print (unwrap-panic (test-set-vault-address)))
        (print (unwrap-panic (test-clear-emergency-mode)))
        (print (unwrap-panic (test-total-assets-with-rewards)))
        (print (unwrap-panic (test-zero-withdraw)))
        (print (unwrap-panic (test-strategy-info-structure)))
        (print (unwrap-panic (test-harvest-increments-count)))
        (print (unwrap-panic (test-compound-clears-pending)))
        (print (unwrap-panic (test-lp-token-tracking)))
        (print "==== All 25 Tests Completed ====")
        (ok "Test suite completed")
    )
)
