// Type definitions for SNP Frontend

export type RiskLevel = 'low' | 'medium' | 'high';

export type StrategyCategory = 
  | 'Bitcoin'
  | 'Stacking'
  | 'Lending'
  | 'Stablecoins'
  | 'DEX'
  | 'Vaults'
  | 'Leveraged'
  | 'Farming';

export interface Strategy {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
  targetAPY: number;
  currentAPY: number;
  tvl: number;
  balance: number;
  riskLevel: RiskLevel;
  category: StrategyCategory;
  isActive: boolean;
  allocation: number; // Percentage of total vault
}

export interface StrategyPerformance {
  strategyId: string;
  totalDeposited: number;
  totalYield: number;
  netValue: number;
  lastHarvest: number; // timestamp
  historicalAPY: Array<{
    timestamp: number;
    apy: number;
  }>;
}

export interface Vault {
  address: string;
  totalAssets: number;
  totalShares: number;
  sharePrice: number;
  isPaused: boolean;
  isInitialized: boolean;
}

export interface UserPosition {
  shares: number;
  stxValue: number;
  depositedAmount: number;
  totalReturn: number;
  returnPercentage: number;
  strategies: {
    strategyId: string;
    allocation: number;
    value: number;
  }[];
}

export interface Transaction {
  txid: string;
  type: 'deposit' | 'withdraw' | 'harvest' | 'allocate';
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  strategy?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: number;
  network: 'mainnet' | 'testnet';
}

export interface DepositParams {
  amount: number;
  strategy?: string;
}

export interface WithdrawParams {
  shares: number;
  minAmountOut: number;
  deadline: number;
}

export interface WithdrawPreview {
  shares: number;
  grossAmount: number;
  fee: number;
  netAmount: number;
  currentBlock: number;
}
