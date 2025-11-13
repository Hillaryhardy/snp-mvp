;; ========================================
;; PHASE 1: MULTI-STRATEGY PORTFOLIO SETUP
;; ========================================
;; Current: 1000 STX deposited, 50 STX in strategy-sbtc-v1
;; Available: 950 STX for allocation

;; Check current vault state
(contract-call? .vault-stx-v2 get-total-assets)
(contract-call? .vault-stx-v2 get-vault-stx-balance)

;; 1. Allocate to strategy-stable-pool (50 STX)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stable-pool u50000000)

;; 2. Allocate to strategy-alex-stx-usda (100 STX) - Already whitelisted
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-alex-stx-usda u100000000)

;; 3. Whitelist and allocate to strategy-arkadiko-vault (75 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-arkadiko-vault true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-arkadiko-vault u75000000)

;; 4. Whitelist and allocate to strategy-bitflow-v1 (75 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-bitflow-v1 true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-bitflow-v1 u75000000)

;; 5. Whitelist and allocate to strategy-granite-v1 (50 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-granite-v1 true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-granite-v1 u50000000)

;; 6. Whitelist and allocate to strategy-hermetica-v1 (75 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-hermetica-v1 true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-hermetica-v1 u75000000)

;; 7. Whitelist and allocate to strategy-stackingdao-v1 (100 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-stackingdao-v1 true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stackingdao-v1 u100000000)
;; 8. Whitelist and allocate to strategy-stackswap-v1 (75 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-stackswap-v1 true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stackswap-v1 u75000000)

;; 9. Whitelist and allocate to strategy-velar-farm (100 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-velar-farm true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-velar-farm u100000000)

;; 10. Whitelist and allocate to strategy-zest-v1 (100 STX)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-zest-v1 true)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-zest-v1 u100000000)

;; Total allocated: 50 + 50 + 100 + 75 + 75 + 50 + 75 + 100 + 75 + 100 + 100 = 850 STX
;; Remaining in vault: 150 STX

;; Final state check
(contract-call? .vault-stx-v2 get-total-assets)
(contract-call? .vault-stx-v2 get-vault-stx-balance)
