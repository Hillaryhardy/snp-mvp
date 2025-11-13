;; Fix strategy-stable-pool - Configure vault address
(contract-call? .strategy-stable-pool set-vault .vault-stx-v2)

;; Now allocate should work
(contract-call? .vault-stx-v2 allocate-to-strategy .strategy-stable-pool u50000000)
