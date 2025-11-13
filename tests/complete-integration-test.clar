# SNP Complete System Integration Testing
# Tests all 12 strategies with real allocations

## PHASE 1: MULTI-STRATEGY PORTFOLIO SETUP
## ========================================

;; Current state: 1000 STX deposited, 50 STX in strategy-sbtc-v1
;; Remaining: 950 STX available for allocation

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

;; Note: strategy-stx-stacking has special deposit signature (amount, num-cycles)
;; Skipping for now - will test separately

;; Total allocated: 50 + 50 + 100 + 75 + 75 + 50 + 75 + 100 + 75 + 100 + 100 = 850 STX
;; Remaining in vault: 150 STX

## PHASE 2: VERIFY ALL ALLOCATIONS
## ========================================

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

;; Check vault state after allocations
(contract-call? .vault-stx-v2 get-total-assets)
(contract-call? .vault-stx-v2 get-vault-stx-balance)

## PHASE 3: HARVEST ALL STRATEGIES
## ========================================

;; Harvest rewards from all strategies
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

;; Check balances after harvest (should show yield)
(contract-call? .strategy-sbtc-v1 get-balance)
(contract-call? .strategy-stable-pool get-balance)

## PHASE 4: PARTIAL WITHDRAWAL TEST
## ========================================

;; Withdraw 200 STX worth of shares
(contract-call? .vault-stx-v2 get-balance tx-sender)
(contract-call? .vault-stx-v2 preview-withdraw u200000000)
(contract-call? .vault-stx-v2 withdraw u200000000 u195000000 u9999999)

;; Check remaining balance
(contract-call? .vault-stx-v2 get-balance tx-sender)
(contract-call? .vault-stx-v2 get-total-assets)

## PHASE 5: EMERGENCY FUNCTIONS TEST
## ========================================

;; Test emergency pause
(contract-call? .vault-stx-v2 emergency-pause)
(contract-call? .vault-stx-v2 is-paused)

;; Try to deposit while paused (should fail)
(contract-call? .vault-stx-v2 deposit u100000000)

;; Resume
(contract-call? .vault-stx-v2 resume)
(contract-call? .vault-stx-v2 is-paused)

## PHASE 6: SHARE PRICE VERIFICATION
## ========================================

;; Check share price after all operations
(contract-call? .vault-stx-v2 get-share-price)
(contract-call? .vault-stx-v2 get-total-supply)
(contract-call? .vault-stx-v2 get-total-assets)
