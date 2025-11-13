;; ========================================
;; PHASE 3: HARVEST ALL STRATEGIES
;; ========================================
;; Test harvesting rewards from all strategies

;; Harvest each strategy (returns yield amount)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-sbtc-v1)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-stable-pool)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-alex-stx-usda)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-arkadiko-vault)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-bitflow-v1)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-granite-v1)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-hermetica-v1)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-stackingdao-v1)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-stackswap-v1)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-velar-farm)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-zest-v1)

;; Check updated balances (should show yield generated)
(contract-call? .strategy-sbtc-v1 get-balance)
(contract-call? .strategy-stable-pool get-balance)
(contract-call? .strategy-granite-v1 get-balance)
(contract-call? .strategy-stackingdao-v1 get-balance)

;; Verify vault total assets increased
(contract-call? .vault-stx-v2 get-total-assets)

;; Expected Results:
;; ✅ Each harvest returns yield amount (ok uint)
;; ✅ Strategy balances show increased net-value
;; ✅ Rewards/interest/yield fields show earned amounts
;; ✅ Total vault assets increased from yield
