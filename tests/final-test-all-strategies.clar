;; ========================================
;; FINAL TEST - ALL 11 STRATEGIES + strategy-sbtc-v1
;; ========================================
;; Run after ::reload

;; 1. Deposit 1000 STX
(contract-call? .vault-stx-v2 deposit u1000000000)

;; 2. Configure stable-pool
(contract-call? .strategy-stable-pool set-vault .vault-stx-v2)

;; 3. Whitelist all strategies
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-sbtc-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-stable-pool true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-alex-stx-usda true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-arkadiko-vault true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-bitflow-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-granite-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-hermetica-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-stackingdao-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-stackswap-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-velar-farm true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-zest-v1 true)

;; 4. Allocate to ALL 11 strategies
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-sbtc-v1 u50000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stable-pool u50000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-alex-stx-usda u100000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-arkadiko-vault u75000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-bitflow-v1 u75000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-granite-v1 u50000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-hermetica-v1 u75000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stackingdao-v1 u100000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stackswap-v1 u75000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-velar-farm u100000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-zest-v1 u100000000)

;; 5. Verify final state
(contract-call? .vault-stx-v2 get-total-assets)
(contract-call? .vault-stx-v2 get-vault-stx-balance)

;; 🎯 EXPECTED RESULTS:
;; ✅ All 11 allocations: (ok true)
;; ✅ Total assets: u1000000000 (1000 STX)
;; ✅ Vault balance: u100000000 (100 STX remaining)
;; ✅ Total allocated: 900 STX across 11 strategies
;; ✅ SUCCESS RATE: 11/11 = 92% (100% minus stx-stacking special signature)
