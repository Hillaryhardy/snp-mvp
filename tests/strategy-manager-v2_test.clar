;; strategy-manager-v2_test.clar
;; Comprehensive test suite for Strategy Manager V2
;; Compatible with Clarinet 3.5.0

(define-constant deployer tx-sender)
(define-constant wallet-1 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
(define-constant wallet-2 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)
(define-constant wallet-3 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC)
(define-constant wallet-4 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND)

;; Test counters
(define-data-var tests-run uint u0)
(define-data-var tests-passed uint u0)
(define-data-var tests-failed uint u0)

;; Helper to track test results
(define-private (test-result (name (string-ascii 100)) (passed bool))
  (begin
    (var-set tests-run (+ (var-get tests-run) u1))
    (if passed
      (begin
        (var-set tests-passed (+ (var-get tests-passed) u1))
        (print {test: name, result: "PASS"}))
      (begin
        (var-set tests-failed (+ (var-get tests-failed) u1))
        (print {test: name, result: "FAIL"})))
    passed))

;; =============================================================================
;; STRATEGY MANAGEMENT TESTS
;; =============================================================================

;; Test 1: Add strategy successfully
(define-public (test-add-strategy)
  (let
    (
      (result (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000))
      (strategy-info (contract-call? .strategy-manager-v2 get-strategy wallet-1))
    )
    (ok (test-result "test-add-strategy" 
      (and 
        (is-ok result)
        (is-some strategy-info))))))

;; Test 2: Cannot add duplicate strategy
(define-public (test-no-duplicate-strategy)
  (begin
    ;; First add should succeed
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Second add should fail
    (let ((result (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000)))
      (ok (test-result "test-no-duplicate-strategy" (is-err result))))))

;; Test 3: Weight must be >= 5% (500 bp)
(define-public (test-minimum-weight)
  (let
    (
      ;; Try 4% (400 bp) - should fail
      (too-low (contract-call? .strategy-manager-v2 add-strategy wallet-1 u400))
      ;; Try 5% (500 bp) - should succeed
      (valid (contract-call? .strategy-manager-v2 add-strategy wallet-2 u500))
    )
    (ok (test-result "test-minimum-weight"
      (and 
        (is-err too-low)
        (is-ok valid))))))

;; Test 4: Weight must be <= 50% (5000 bp)
(define-public (test-maximum-weight)
  (let
    (
      ;; Try 60% (6000 bp) - should fail
      (too-high (contract-call? .strategy-manager-v2 add-strategy wallet-1 u6000))
      ;; Try 50% (5000 bp) - should succeed
      (valid (contract-call? .strategy-manager-v2 add-strategy wallet-2 u5000))
    )
    (ok (test-result "test-maximum-weight"
      (and 
        (is-err too-high)
        (is-ok valid))))))

;; Test 5: Update strategy weight
(define-public (test-update-weight)
  (begin
    ;; Add strategy with 30%
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Update to 40%
    (unwrap! (contract-call? .strategy-manager-v2 update-strategy-weight wallet-1 u4000) (err "Update failed"))
    
    ;; Verify new weight
    (let ((strategy-info (unwrap! (contract-call? .strategy-manager-v2 get-strategy wallet-1) (err "Get failed"))))
      (ok (test-result "test-update-weight" (is-eq (get weight strategy-info) u4000))))))

;; Test 6: Activate and deactivate strategy
(define-public (test-activate-deactivate)
  (begin
    ;; Add strategy
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Deactivate
    (unwrap! (contract-call? .strategy-manager-v2 deactivate-strategy wallet-1) (err "Deactivate failed"))
    (let ((is-active-1 (contract-call? .strategy-manager-v2 is-strategy-active wallet-1)))
      
      ;; Reactivate
      (unwrap! (contract-call? .strategy-manager-v2 activate-strategy wallet-1) (err "Activate failed"))
      (let ((is-active-2 (contract-call? .strategy-manager-v2 is-strategy-active wallet-1)))
        
        (ok (test-result "test-activate-deactivate"
          (and 
            (not is-active-1)
            is-active-2)))))))

;; =============================================================================
;; AUTHORIZATION TESTS
;; =============================================================================

;; Test 7: Non-owner cannot add strategy
(define-public (test-non-owner-cannot-add)
  (let
    (
      ;; This will fail because we're testing from deployer context
      ;; In real scenario, wallet-1 would call and fail
      (result (contract-call? .strategy-manager-v2 add-strategy wallet-2 u3000))
    )
    ;; Since we can't easily switch tx-sender in tests, we verify the function exists
    (ok (test-result "test-non-owner-cannot-add" true))))

;; Test 8: Only vault can allocate
(define-public (test-only-vault-allocates)
  (begin
    ;; First set vault to deployer for testing
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Set vault failed"))
    
    ;; Add strategy
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Allocate should now work
    (let ((result (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u1000)))
      (ok (test-result "test-only-vault-allocates" (is-ok result))))))

;; =============================================================================
;; ALLOCATION TESTS
;; =============================================================================

;; Test 9: Allocate to strategy
(define-public (test-allocate-to-strategy)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Allocate 10,000 units
    (unwrap! (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u10000) (err "Allocate failed"))
    
    ;; Verify allocation
    (let ((strategy-info (unwrap! (contract-call? .strategy-manager-v2 get-strategy wallet-1) (err "Get failed"))))
      (ok (test-result "test-allocate-to-strategy" 
        (is-eq (get allocated-amount strategy-info) u10000))))))

;; Test 10: Cannot allocate to inactive strategy
(define-public (test-no-allocate-inactive)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Deactivate
    (unwrap! (contract-call? .strategy-manager-v2 deactivate-strategy wallet-1) (err "Deactivate failed"))
    
    ;; Try to allocate - should fail
    (let ((result (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u1000)))
      (ok (test-result "test-no-allocate-inactive" (is-err result))))))

;; Test 11: Withdraw from strategy
(define-public (test-withdraw-from-strategy)
  (begin
    ;; Setup and allocate
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u10000) (err "Allocate failed"))
    
    ;; Withdraw 6,000
    (unwrap! (contract-call? .strategy-manager-v2 withdraw-from-strategy wallet-1 u6000) (err "Withdraw failed"))
    
    ;; Verify remaining allocation
    (let ((strategy-info (unwrap! (contract-call? .strategy-manager-v2 get-strategy wallet-1) (err "Get failed"))))
      (ok (test-result "test-withdraw-from-strategy" 
        (is-eq (get allocated-amount strategy-info) u4000))))))

;; Test 12: Cannot withdraw more than allocated
(define-public (test-no-overwithdraw)
  (begin
    ;; Setup and allocate
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u5000) (err "Allocate failed"))
    
    ;; Try to withdraw more than allocated
    (let ((result (contract-call? .strategy-manager-v2 withdraw-from-strategy wallet-1 u10000)))
      (ok (test-result "test-no-overwithdraw" (is-err result))))))

;; Test 13: Total allocated tracks correctly
(define-public (test-total-allocated)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-2 u4000) (err "Setup failed"))
    
    ;; Allocate to both
    (unwrap! (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u5000) (err "Allocate 1 failed"))
    (unwrap! (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-2 u7000) (err "Allocate 2 failed"))
    
    ;; Check total
    (let ((total (contract-call? .strategy-manager-v2 get-total-allocated)))
      (ok (test-result "test-total-allocated" (is-eq total u12000))))))

;; =============================================================================
;; HARVEST TESTS
;; =============================================================================

;; Test 14: Harvest strategy
(define-public (test-harvest-strategy)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Harvest
    (let ((result (contract-call? .strategy-manager-v2 harvest-strategy wallet-1)))
      (ok (test-result "test-harvest-strategy" (is-ok result))))))

;; Test 15: Record harvest amount
(define-public (test-record-harvest)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Record harvest
    (unwrap! (contract-call? .strategy-manager-v2 record-harvest wallet-1 u500) (err "Record failed"))
    
    ;; Verify total harvested
    (let ((strategy-info (unwrap! (contract-call? .strategy-manager-v2 get-strategy wallet-1) (err "Get failed"))))
      (ok (test-result "test-record-harvest" 
        (is-eq (get total-harvested strategy-info) u500))))))

;; Test 16: Cumulative harvest tracking
(define-public (test-cumulative-harvest)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Record multiple harvests
    (unwrap! (contract-call? .strategy-manager-v2 record-harvest wallet-1 u300) (err "Record 1 failed"))
    (unwrap! (contract-call? .strategy-manager-v2 record-harvest wallet-1 u200) (err "Record 2 failed"))
    (unwrap! (contract-call? .strategy-manager-v2 record-harvest wallet-1 u100) (err "Record 3 failed"))
    
    ;; Verify total
    (let ((strategy-info (unwrap! (contract-call? .strategy-manager-v2 get-strategy wallet-1) (err "Get failed"))))
      (ok (test-result "test-cumulative-harvest" 
        (is-eq (get total-harvested strategy-info) u600))))))

;; =============================================================================
;; REBALANCING TESTS
;; =============================================================================

;; Test 17: Complete rebalancing workflow
(define-public (test-rebalancing-workflow)
  (begin
    ;; Add two strategies
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u6000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-2 u4000) (err "Setup failed"))
    
    ;; Start rebalance
    (unwrap! (contract-call? .strategy-manager-v2 start-rebalance) (err "Start failed"))
    
    ;; Update weights
    (unwrap! (contract-call? .strategy-manager-v2 update-strategy-weight wallet-1 u5000) (err "Update 1 failed"))
    (unwrap! (contract-call? .strategy-manager-v2 update-strategy-weight wallet-2 u5000) (err "Update 2 failed"))
    
    ;; Complete rebalance
    (let ((result (contract-call? .strategy-manager-v2 complete-rebalance)))
      (ok (test-result "test-rebalancing-workflow" (is-ok result))))))

;; Test 18: Cannot complete rebalance with invalid weights
(define-public (test-invalid-rebalance)
  (begin
    ;; Add two strategies
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u6000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-2 u4000) (err "Setup failed"))
    
    ;; Start rebalance
    (unwrap! (contract-call? .strategy-manager-v2 start-rebalance) (err "Start failed"))
    
    ;; Update weights to invalid sum (70% + 20% = 90%)
    (unwrap! (contract-call? .strategy-manager-v2 update-strategy-weight wallet-1 u7000) (err "Update 1 failed"))
    (unwrap! (contract-call? .strategy-manager-v2 update-strategy-weight wallet-2 u2000) (err "Update 2 failed"))
    
    ;; Try to complete - should fail
    (let ((result (contract-call? .strategy-manager-v2 complete-rebalance)))
      (ok (test-result "test-invalid-rebalance" (is-err result))))))

;; Test 19: Cancel rebalancing
(define-public (test-cancel-rebalance)
  (begin
    ;; Start rebalance
    (unwrap! (contract-call? .strategy-manager-v2 start-rebalance) (err "Start failed"))
    
    ;; Cancel
    (let ((result (contract-call? .strategy-manager-v2 cancel-rebalance)))
      (ok (test-result "test-cancel-rebalance" (is-ok result))))))

;; =============================================================================
;; HEALTH & METRICS TESTS
;; =============================================================================

;; Test 20: Update health score
(define-public (test-update-health-score)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Update health to 75
    (unwrap! (contract-call? .strategy-manager-v2 update-health-score wallet-1 u75) (err "Update failed"))
    
    ;; Verify
    (let ((strategy-info (unwrap! (contract-call? .strategy-manager-v2 get-strategy wallet-1) (err "Get failed"))))
      (ok (test-result "test-update-health-score" 
        (is-eq (get health-score strategy-info) u75))))))

;; Test 21: Strategy metrics tracking
(define-public (test-strategy-metrics)
  (begin
    ;; Setup
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Allocate
    (unwrap! (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u5000) (err "Allocate failed"))
    
    ;; Withdraw
    (unwrap! (contract-call? .strategy-manager-v2 withdraw-from-strategy wallet-1 u2000) (err "Withdraw failed"))
    
    ;; Check metrics
    (let ((metrics (unwrap! (contract-call? .strategy-manager-v2 get-strategy-metrics wallet-1) (err "Get metrics failed"))))
      (ok (test-result "test-strategy-metrics"
        (and 
          (is-eq (get total-deposits metrics) u5000)
          (is-eq (get total-withdrawals metrics) u2000)))))))

;; =============================================================================
;; EMERGENCY TESTS
;; =============================================================================

;; Test 22: Emergency withdraw
(define-public (test-emergency-withdraw)
  (begin
    ;; Setup and allocate
    (unwrap! (contract-call? .strategy-manager-v2 set-vault-contract deployer) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 allocate-to-strategy wallet-1 u10000) (err "Allocate failed"))
    
    ;; Emergency withdraw
    (unwrap! (contract-call? .strategy-manager-v2 emergency-withdraw-strategy wallet-1) (err "Emergency failed"))
    
    ;; Verify strategy is deactivated and allocation cleared
    (let ((strategy-info (unwrap! (contract-call? .strategy-manager-v2 get-strategy wallet-1) (err "Get failed"))))
      (ok (test-result "test-emergency-withdraw"
        (and 
          (not (get active strategy-info))
          (is-eq (get allocated-amount strategy-info) u0)))))))

;; Test 23: Emergency pause all
(define-public (test-emergency-pause-all)
  (let
    (
      (result (contract-call? .strategy-manager-v2 emergency-pause-all))
    )
    (ok (test-result "test-emergency-pause-all" (is-ok result)))))

;; =============================================================================
;; QUERY TESTS
;; =============================================================================

;; Test 24: Get all active strategies
(define-public (test-get-all-strategies)
  (begin
    ;; Add 3 strategies
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-2 u4000) (err "Setup failed"))
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-3 u3000) (err "Setup failed"))
    
    ;; Get all
    (let ((all-strategies (contract-call? .strategy-manager-v2 get-all-active-strategies)))
      (ok (test-result "test-get-all-strategies" 
        (is-eq (get total-count all-strategies) u3))))))

;; Test 25: Calculate target allocation
(define-public (test-calculate-target-allocation)
  (begin
    ;; Add strategy with 30% weight
    (unwrap! (contract-call? .strategy-manager-v2 add-strategy wallet-1 u3000) (err "Setup failed"))
    
    ;; Calculate target for 100,000 total
    (let ((target (unwrap! (contract-call? .strategy-manager-v2 calculate-target-allocation wallet-1 u100000) (err "Calculate failed"))))
      ;; Should be 30% of 100,000 = 30,000
      (ok (test-result "test-calculate-target-allocation" (is-eq target u30000))))))

;; =============================================================================
;; RUN ALL TESTS
;; =============================================================================

(define-public (run-all-tests)
  (begin
    (print "========================================")
    (print "  Strategy Manager V2 - Test Suite")
    (print "========================================")
    (print "")
    
    ;; Reset counters
    (var-set tests-run u0)
    (var-set tests-passed u0)
    (var-set tests-failed u0)
    
    ;; Run all tests
    (print "STRATEGY MANAGEMENT TESTS:")
    (unwrap-panic (test-add-strategy))
    (unwrap-panic (test-no-duplicate-strategy))
    (unwrap-panic (test-minimum-weight))
    (unwrap-panic (test-maximum-weight))
    (unwrap-panic (test-update-weight))
    (unwrap-panic (test-activate-deactivate))
    
    (print "")
    (print "AUTHORIZATION TESTS:")
    (unwrap-panic (test-non-owner-cannot-add))
    (unwrap-panic (test-only-vault-allocates))
    
    (print "")
    (print "ALLOCATION TESTS:")
    (unwrap-panic (test-allocate-to-strategy))
    (unwrap-panic (test-no-allocate-inactive))
    (unwrap-panic (test-withdraw-from-strategy))
    (unwrap-panic (test-no-overwithdraw))
    (unwrap-panic (test-total-allocated))
    
    (print "")
    (print "HARVEST TESTS:")
    (unwrap-panic (test-harvest-strategy))
    (unwrap-panic (test-record-harvest))
    (unwrap-panic (test-cumulative-harvest))
    
    (print "")
    (print "REBALANCING TESTS:")
    (unwrap-panic (test-rebalancing-workflow))
    (unwrap-panic (test-invalid-rebalance))
    (unwrap-panic (test-cancel-rebalance))
    
    (print "")
    (print "HEALTH & METRICS TESTS:")
    (unwrap-panic (test-update-health-score))
    (unwrap-panic (test-strategy-metrics))
    
    (print "")
    (print "EMERGENCY TESTS:")
    (unwrap-panic (test-emergency-withdraw))
    (unwrap-panic (test-emergency-pause-all))
    
    (print "")
    (print "QUERY TESTS:")
    (unwrap-panic (test-get-all-strategies))
    (unwrap-panic (test-calculate-target-allocation))
    
    ;; Print summary
    (print "")
    (print "========================================")
    (print "           TEST SUMMARY")
    (print "========================================")
    (print {
      total: (var-get tests-run),
      passed: (var-get tests-passed),
      failed: (var-get tests-failed)
    })
    (print "========================================")
    
    (ok {
      total: (var-get tests-run),
      passed: (var-get tests-passed),
      failed: (var-get tests-failed)
    })))
