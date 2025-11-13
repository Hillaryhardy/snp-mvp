;; SNP Devnet Integration Tests
;; Tests all 15 contracts with real transactions

;; Test accounts from Clarinet devnet
;; deployer: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
;; wallet_1: ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
;; wallet_2: ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG

(define-constant deployer 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant wallet-1 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
(define-constant wallet-2 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)

;; ============================================================================
;; TEST 1: VAULT INITIALIZATION
;; ============================================================================

;; Test vault is initialized correctly
(contract-call? .vault-stx-v2 is-initialized)
;; Expected: (ok false)

(contract-call? .vault-stx-v2 get-total-assets)
;; Expected: (ok u0)

(contract-call? .vault-stx-v2 get-total-supply)
;; Expected: (ok u0)

;; ============================================================================
;; TEST 2: FIRST DEPOSIT (Deployer)
;; ============================================================================

;; First deposit must be >= 1000 STX (minimum protection)
(contract-call? .vault-stx-v2 deposit u1000000000) ;; 1000 STX
;; Expected: (ok u1000000000) ;; Returns shares minted

;; Check vault is now initialized
(contract-call? .vault-stx-v2 is-initialized)
;; Expected: (ok true)

;; Check dead shares were minted
(contract-call? .vault-stx-v2 get-total-supply)
;; Expected: (ok u1000001000) ;; 1000 STX + 1000 dead shares

;; Check deployer balance
(contract-call? .vault-stx-v2 get-balance deployer)
;; Expected: (ok u1000000000)
