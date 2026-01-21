import { useState, useCallback } from 'react';
import {
  makeStandardSTXPostCondition,
  makeContractFungiblePostCondition,
  FungibleConditionCode,
  PostConditionMode,
  AnchorMode,
  uintCV,
  createAssetInfo,
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { UserSession } from '@stacks/connect';
import { openContractCall } from '@stacks/connect';

const network = new StacksTestnet();

const CONTRACT_ADDRESS = 'ST2H682D5RWFBHS1W3ASG3WVP5ARQVN0QABEG9BEA';

export interface DepositParams {
  vaultContract: string;
  amount: number;
}

export interface WithdrawParams {
  vaultContract: string;
  shares: number;
  minAssets: number;
  deadline: number;
}

export function useVaultContract(userSession: UserSession) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  // Helper to get user's share balance
  const getShareBalance = useCallback(async (vaultContract: string): Promise<number> => {
    if (!userSession.isUserSignedIn()) {
      return 0;
    }

    try {
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress.testnet;

      // Determine asset name
      let assetName = 'vault-shares-conservative';
      if (vaultContract.includes('stx-v2')) {
        assetName = 'vault-shares';
      } else if (vaultContract.includes('growth')) {
        assetName = 'vault-shares-growth';
      }

      const response = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`
      );
      const data = await response.json();

      // Find the fungible token balance
      const contractId = `${CONTRACT_ADDRESS}.${vaultContract}`;
      const assetId = `${contractId}::${assetName}`;
      
      if (data.fungible_tokens && data.fungible_tokens[assetId]) {
        return parseInt(data.fungible_tokens[assetId].balance);
      }

      return 0;
    } catch (err) {
      console.error('Error fetching share balance:', err);
      return 0;
    }
  }, [userSession]);

  const deposit = useCallback(async (params: DepositParams) => {
    if (!userSession.isUserSignedIn()) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      const userData = userSession.loadUserData();
      const userAddress = userData.profile.stxAddress.testnet;

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: params.vaultContract,
        functionName: 'deposit',
        functionArgs: [
          uintCV(params.amount),
        ],
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardSTXPostCondition(
            userAddress,
            FungibleConditionCode.Equal,
            params.amount
          ),
        ],
        onFinish: (data: any) => {
          console.log('Transaction broadcast!', data.txId);
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setError('Transaction cancelled');
          setLoading(false);
        },
      });
    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.message || 'Failed to deposit');
      setLoading(false);
    }
  }, [userSession]);

  const withdraw = useCallback(async (params: WithdrawParams) => {
    if (!userSession.isUserSignedIn()) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      const userData = userSession.loadUserData();
      const userAddress = userData.profile.stxAddress.testnet;

      // Get contract asset name based on vault
      let assetName = 'vault-shares-conservative';
      if (params.vaultContract.includes('stx-v2')) {
        assetName = 'vault-shares';
      } else if (params.vaultContract.includes('growth')) {
        assetName = 'vault-shares-growth';
      }

      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: params.vaultContract,
        functionName: 'withdraw',
        functionArgs: [
          uintCV(params.shares),
          uintCV(params.minAssets),
          uintCV(params.deadline),
        ],
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          // User burns their shares
          makeContractFungiblePostCondition(
            CONTRACT_ADDRESS,
            params.vaultContract,
            FungibleConditionCode.Equal,
            params.shares,
            createAssetInfo(CONTRACT_ADDRESS, params.vaultContract, assetName)
          ),
        ],
        onFinish: (data: any) => {
          console.log('Withdrawal broadcast!', data.txId);
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setError('Transaction cancelled');
          setLoading(false);
        },
      });
    } catch (err: any) {
      console.error('Withdraw error:', err);
      setError(err.message || 'Failed to withdraw');
      setLoading(false);
    }
  }, [userSession]);

  return {
    deposit,
    withdraw,
    getShareBalance,
    loading,
    error,
    txId,
  };
}
