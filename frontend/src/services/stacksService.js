// Stacks Contract Integration Service
// Connects frontend to real Clarity smart contracts

import {
  callReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

// Configuration
const NETWORK = new StacksTestnet(); // Change to StacksMainnet() for production
const CONTRACT_DEPLOYER = 'STQKNVNB5XBSADFSVWAHYH4BXKAMYE9FS1GFEMS7'; // Update with your deployer address

// Contract names
const CONTRACTS = {
  VAULT: 'vault-stx-v2',
  STRATEGY_MANAGER: 'strategy-manager-v2',
  ALEX_STRATEGY: 'strategy-alex-stx-usda',
  ARKADIKO_STRATEGY: 'strategy-arkadiko-vault',
  ZEST_STRATEGY: 'strategy-zest-v1',
  STACKSWAP_STRATEGY: 'strategy-stackswap-v1',
  BITFLOW_STRATEGY: 'strategy-bitflow-v1',
  HERMETICA_STRATEGY: 'strategy-hermetica-v1',
  VELAR_STRATEGY: 'strategy-velar-farm',
  STX_STACKING: 'strategy-stx-stacking',
  SBTC_STRATEGY: 'strategy-sbtc-v1',
  STABLE_POOL: 'strategy-stable-pool',
  STACKINGDAO_STRATEGY: 'strategy-stackingdao-v1',
  GRANITE_STRATEGY: 'strategy-granite-v1'
};

// Helper function to call read-only contract functions
async function callContract(contractName, functionName, functionArgs = []) {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: contractName,
      functionName: functionName,
      functionArgs: functionArgs,
      network: NETWORK,
      senderAddress: CONTRACT_DEPLOYER,
    });

    return cvToJSON(result);
  } catch (error) {
    console.error(`Error calling ${contractName}.${functionName}:`, error);
    return null;
  }
}

// ============================================================================
// Vault Functions
// ============================================================================

export async function getVaultBalance(userAddress) {
  const result = await callContract(
    CONTRACTS.VAULT,
    'get-balance',
    [standardPrincipalCV(userAddress)]
  );
  return result?.value || 0;
}

export async function getVaultShares(userAddress) {
  const result = await callContract(
    CONTRACTS.VAULT,
    'get-shares',
    [standardPrincipalCV(userAddress)]
  );
  return result?.value || 0;
}

export async function getVaultTotalValue() {
  const result = await callContract(
    CONTRACTS.VAULT,
    'get-total-value',
    []
  );
  return result?.value || 0;
}

export async function getSharePrice() {
  const result = await callContract(
    CONTRACTS.VAULT,
    'get-share-price',
    []
  );
  return result?.value || 1000000; // Default 1:1 ratio
}

// ============================================================================
// Strategy Manager Functions
// ============================================================================

export async function getAllStrategies() {
  const result = await callContract(
    CONTRACTS.STRATEGY_MANAGER,
    'get-all-strategies',
    []
  );
  return result?.value || [];
}

export async function getStrategyInfo(strategyAddress) {
  const result = await callContract(
    CONTRACTS.STRATEGY_MANAGER,
    'get-strategy',
    [standardPrincipalCV(strategyAddress)]
  );
  return result?.value || null;
}

export async function getTotalTVL() {
  const result = await callContract(
    CONTRACTS.STRATEGY_MANAGER,
    'get-total-value',
    []
  );
  return result?.value || 0;
}

// ============================================================================
// Individual Strategy Functions
// ============================================================================

export async function getStrategyBalance(contractName) {
  const result = await callContract(
    contractName,
    'get-balance',
    []
  );
  return result?.value || { 'total-stx-deposited': 0 };
}

export async function getStrategyAPY(contractName) {
  const result = await callContract(
    contractName,
    'estimate-apy',
    []
  );
  return result?.value || 0;
}

export async function getStrategyInfo(contractName) {
  const result = await callContract(
    contractName,
    'get-strategy-info',
    []
  );
  return result?.value || null;
}

// ============================================================================
// Fetch All Strategy Data
// ============================================================================

export async function fetchAllStrategiesData() {
  // Define all strategies with their metadata
  const strategiesConfig = [
    {
      contractName: CONTRACTS.ALEX_STRATEGY,
      name: 'ALEX STX-USDA LP',
      type: 'LP Farming',
      risk: 'Medium',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.ALEX_STRATEGY}`,
      features: ['Trading Fees', 'ALEX Rewards', 'Auto-compound']
    },
    {
      contractName: CONTRACTS.ARKADIKO_STRATEGY,
      name: 'Arkadiko Vault',
      type: 'Stability Pool',
      risk: 'Medium',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.ARKADIKO_STRATEGY}`,
      features: ['DIKO Rewards', 'USDA Support', 'Stable Returns']
    },
    {
      contractName: CONTRACTS.ZEST_STRATEGY,
      name: 'Zest Lending',
      type: 'BTC-Backed Lending',
      risk: 'Low-Medium',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.ZEST_STRATEGY}`,
      features: ['BTC Collateral', 'Stable Income', 'Low Risk']
    },
    {
      contractName: CONTRACTS.STACKSWAP_STRATEGY,
      name: 'StackSwap',
      type: 'DEX Farming',
      risk: 'Medium-High',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.STACKSWAP_STRATEGY}`,
      features: ['High APY', 'STSW Tokens', 'LP Rewards']
    },
    {
      contractName: CONTRACTS.BITFLOW_STRATEGY,
      name: 'Bitflow',
      type: 'Bitcoin DeFi',
      risk: 'Medium',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.BITFLOW_STRATEGY}`,
      features: ['Bitcoin Native', 'LP Fees', 'Low Slippage']
    },
    {
      contractName: CONTRACTS.HERMETICA_STRATEGY,
      name: 'Hermetica',
      type: 'BTC Assets',
      risk: 'Low-Medium',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.HERMETICA_STRATEGY}`,
      features: ['USDh Integration', 'BTC-Pegged', 'Protocol Fees']
    },
    {
      contractName: CONTRACTS.VELAR_STRATEGY,
      name: 'Velar Farm',
      type: 'Concentrated LP',
      risk: 'Medium',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.VELAR_STRATEGY}`,
      features: ['Concentrated Liquidity', 'VELAR Tokens', 'Active Management']
    },
    {
      contractName: CONTRACTS.STX_STACKING,
      name: 'STX Stacking',
      type: 'Native Yield',
      risk: 'Low',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.STX_STACKING}`,
      features: ['BTC Rewards', 'Consensus', 'Native Protocol']
    },
    {
      contractName: CONTRACTS.SBTC_STRATEGY,
      name: 'sBTC Yield',
      type: 'Bitcoin Native',
      risk: 'Low',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.SBTC_STRATEGY}`,
      features: ['Trust-Minimized', 'Zero Fees', 'Native Bitcoin']
    },
    {
      contractName: CONTRACTS.STABLE_POOL,
      name: 'Stable Pool',
      type: 'Stablecoin LP',
      risk: 'Low',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.STABLE_POOL}`,
      features: ['Low Risk', 'Predictable', 'Low IL']
    },
    {
      contractName: CONTRACTS.STACKINGDAO_STRATEGY,
      name: 'StackingDAO',
      type: 'DAO Stacking',
      risk: 'Very Low',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.STACKINGDAO_STRATEGY}`,
      features: ['DAO Managed', 'Higher Yields', 'Pooled Benefits']
    },
    {
      contractName: CONTRACTS.GRANITE_STRATEGY,
      name: 'Granite Lending',
      type: 'Lending',
      risk: 'Medium',
      address: `${CONTRACT_DEPLOYER}.${CONTRACTS.GRANITE_STRATEGY}`,
      features: ['Lending Markets', 'Competitive Rates', 'Diversified']
    }
  ];

  // Fetch real data from contracts in parallel
  const strategiesPromises = strategiesConfig.map(async (config) => {
    try {
      const [balance, apy, info] = await Promise.all([
        getStrategyBalance(config.contractName),
        getStrategyAPY(config.contractName),
        getStrategyInfo(config.contractName)
      ]);

      return {
        name: config.name,
        type: config.type,
        apy: Number(apy) / 100 || 0, // Convert from basis points
        tvl: Number(balance['total-stx-deposited']) || 0,
        health: info?.['health-score'] || 100,
        risk: config.risk,
        allocation: info?.weight / 100 || 0, // Convert from basis points
        earned: info?.['total-earned'] || 0,
        isActive: info?.active || false,
        address: config.address,
        features: config.features
      };
    } catch (error) {
      console.error(`Error fetching strategy ${config.name}:`, error);
      // Return default data if contract call fails
      return {
        name: config.name,
        type: config.type,
        apy: 0,
        tvl: 0,
        health: 0,
        risk: config.risk,
        allocation: 0,
        earned: 0,
        isActive: false,
        address: config.address,
        features: config.features
      };
    }
  });

  return Promise.all(strategiesPromises);
}

// ============================================================================
// Export configuration for direct use
// ============================================================================

export const STACK_CONFIG = {
  NETWORK,
  CONTRACT_DEPLOYER,
  CONTRACTS
};
