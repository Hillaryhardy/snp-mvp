;; ========================================
;; PHASE 2: VERIFY ALL ALLOCATIONS
;; ========================================
;; Verify each strategy balance and vault accounting

;; Check vault summary
(contract-call? .vault-stx-v2 get-total-assets)
(contract-call? .vault-stx-v2 get-vault-stx-balance)

;; Check each strategy balance
(contract-call? .strategy-sbtc-v1 get-balance)
(contract-call? .strategy-stable-pool get-balance)
(contract-call? .strategy-alex-stx-usda get-balance)
(contract-call? .strategy-arkadiko-vault get-balance)
(contract-call? .strategy-bitflow-v1 get-balance)
(contract-call? .strategy-granite-v1 get-balance)
(contract-call? .strategy-hermetica-v1 get-balance)
(contract-call? .strategy-stackingdao-v1 get-balance)
(contract-call? .strategy-stackswap-v1 get-balance)
(contract-call? .strategy-velar-farm get-balance)
(contract-call? .strategy-zest-v1 get-balance)

;; Expected Results:
;; ✅ Total assets: u1000000000
;; ✅ Vault balance: u150000000
;; ✅ Each strategy shows correct allocation
;; ✅ All balances sum to 850 STX + 150 vault = 1000 total
