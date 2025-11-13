;; ========================================
;; COMPLETE EMERGENCY WITHDRAW TEST
;; ========================================
;; After ::reload

;; Setup: Deposit and allocate
(contract-call? .vault-stx-v2 deposit u1000000000)
(contract-call? .strategy-stable-pool set-vault .vault-stx-v2)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-sbtc-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-alex-stx-usda true)

;; Allocate leaving only 150 STX in vault
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-sbtc-v1 u400000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-alex-stx-usda u450000000)

;; Verify state
(contract-call? .vault-stx-v2 get-vault-stx-balance)

;; Emergency sequence
(contract-call? .vault-stx-v2 emergency-pause)
(contract-call? .vault-stx-v2 emergency-withdraw-from-strategy .strategy-sbtc-v1 u50000000)
(contract-call? .vault-stx-v2 resume)

;; Verify vault liquidity increased
(contract-call? .vault-stx-v2 get-vault-stx-balance)

;; Now withdraw 200 STX (should work!)
(contract-call? .vault-stx-v2 withdraw u200000000 u190000000 u9999999)

;; Final verification
(contract-call? .vault-stx-v2 get-balance tx-sender)
(contract-call? .vault-stx-v2 get-vault-stx-balance)
(contract-call? .vault-stx-v2 get-total-assets)

;; Expected Results:
;; ✅ Initial vault balance: 150 STX
;; ✅ After emergency withdraw: 200 STX (150 + 50)
;; ✅ Withdrawal succeeds!
;; ✅ User receives ~199 STX
;; ✅ User shares reduced to 800M
;; ✅ Vault balance: ~1 STX remaining
