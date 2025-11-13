;; ========================================
;; COMPLETE PHASE 1 TEST - POST RELOAD
;; ========================================
;; Run this AFTER ::reload to test all fixes

;; STEP 1: Initial deposit (1000 STX)
(contract-call? .vault-stx-v2 deposit u1000000000)

;; STEP 2: Configure strategy-stable-pool
(contract-call? .strategy-stable-pool set-vault .vault-stx-v2)

;; STEP 3: Whitelist all strategies
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

;; STEP 4: Allocate to ALL 11 strategies (previously working + 3 fixed)
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

;; STEP 5: Verify final state
(contract-call? .vault-stx-v2 get-total-assets)
(contract-call? .vault-stx-v2 get-vault-stx-balance)

;; Expected Results:
;; ✅ Total assets: 1000 STX
;; ✅ Total allocated: 850 STX
;; ✅ Vault balance: 150 STX remaining
;; ✅ 11/11 strategies working (100% minus stx-stacking which has special signature)
