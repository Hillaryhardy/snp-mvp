;; ========================================
;; PHASE 3 RETRY - HARVEST WITH FIX
;; ========================================
;; After reloading, deposit and allocate again, then harvest

;; Quick setup (after ::reload)
(contract-call? .vault-stx-v2 deposit u1000000000)
(contract-call? .strategy-stable-pool set-vault .vault-stx-v2)

;; Whitelist strategies
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-sbtc-v1 true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-stable-pool true)
(contract-call? .vault-stx-v2 whitelist-strategy .strategy-stackingdao-v1 true)

;; Allocate to 3 key strategies for testing
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-sbtc-v1 u100000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stable-pool u100000000)
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stackingdao-v1 u100000000)

;; Harvest all 3 (stackingdao should work now!)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-sbtc-v1)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-stable-pool)
(contract-call? .vault-stx-v2 harvest-strategy .strategy-stackingdao-v1)

;; Check balances
(contract-call? .strategy-sbtc-v1 get-balance)
(contract-call? .strategy-stable-pool get-balance)
(contract-call? .strategy-stackingdao-v1 get-balance)
