;; ========================================
;; REDEPLOY FIXED STRATEGIES & TEST
;; ========================================

;; Step 1: Deploy fixed contracts
;; Run: clarinet console
;; Then: ::reload

;; Step 2: Configure strategy-stable-pool vault
(contract-call? .strategy-stable-pool set-vault .vault-stx-v2)

;; Step 3: Test all 3 previously failing strategies

;; 3a. Test strategy-stable-pool (should work now)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stable-pool u50000000)

;; 3b. Test strategy-granite-v1 (should work now)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-granite-v1 u50000000)

;; 3c. Test strategy-stackingdao-v1 (should work now)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stackingdao-v1 u100000000)

;; Step 4: Verify final vault state
(contract-call? .vault-stx-v2 get-total-assets)
(contract-call? .vault-stx-v2 get-vault-stx-balance)

;; Expected Results:
;; - All 3 allocations should succeed (ok true)
;; - Total allocated: 850 STX (previous) + 200 STX (new) = 1050 STX
;; - Vault balance: 350 STX - 200 STX = 150 STX remaining
;; - Success rate: 11/11 strategies (100%)! 🎉
