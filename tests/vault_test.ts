import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Vault: Basic deposit and withdraw flow",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            // Deposit 1000 STX
            Tx.contractCall(
                'vault-stx',
                'deposit',
                [types.uint(1000000000)], // 1000 STX in micro-STX
                wallet1.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        
        // Check balance
        let balance = chain.callReadOnlyFn(
            'vault-stx',
            'get-balance',
            [types.principal(wallet1.address)],
            wallet1.address
        );
        
        assertEquals(balance.result.expectOk(), types.uint(1000000000));
        
        // Withdraw 500 STX worth of shares
        block = chain.mineBlock([
            Tx.contractCall(
                'vault-stx',
                'withdraw',
                [types.uint(500000000)],
                wallet1.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
    },
});

Clarinet.test({
    name: "Vault: Share price calculation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        
        // First deposit
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-stx',
                'deposit',
                [types.uint(1000000000)],
                wallet1.address
            ),
        ]);
        
        // Check initial 1:1 ratio
        let sharePrice = chain.callReadOnlyFn(
            'vault-stx',
            'get-share-price',
            [],
            wallet1.address
        );
        
        assertEquals(sharePrice.result.expectOk(), types.uint(1000000));
    },
});

Clarinet.test({
    name: "Vault: Emergency pause functionality",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        
        // Pause vault
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-stx',
                'emergency-pause',
                [],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        
        // Try to deposit while paused - should fail
        block = chain.mineBlock([
            Tx.contractCall(
                'vault-stx',
                'deposit',
                [types.uint(1000000000)],
                wallet1.address
            ),
        ]);
        
        block.receipts[0].result.expectErr(types.uint(104)); // ERR-PAUSED
    },
});

Clarinet.test({
    name: "Security: Non-owner cannot pause vault",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;
        
        let block = chain.mineBlock([
            Tx.contractCall(
                'vault-stx',
                'emergency-pause',
                [],
                wallet1.address
            ),
        ]);
        
        block.receipts[0].result.expectErr(types.uint(100)); // ERR-NOT-AUTHORIZED
    },
});

Clarinet.test({
    name: "Strategy: Whitelist and activate strategy",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            // Whitelist strategy
            Tx.contractCall(
                'vault-stx',
                'whitelist-strategy',
                [
                    types.principal(deployer.address + '.strategy-alex-farm'),
                    types.bool(true)
                ],
                deployer.address
            ),
            // Set as active
            Tx.contractCall(
                'vault-stx',
                'set-active-strategy',
                [types.principal(deployer.address + '.strategy-alex-farm')],
                deployer.address
            ),
        ]);
        
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
    },
});
