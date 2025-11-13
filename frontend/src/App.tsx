import React, { useState } from 'react';
import { formatSTX, formatAPY } from './utils/formatting';
import CONFIG from './config';

function App() {
  const [totalTVL] = useState(1000000000); // 1000 STX
  const [userBalance] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = () => {
    // TODO: Implement @stacks/connect
    console.log('Connect wallet clicked');
    setIsWalletConnected(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-1">
                SNP
              </h1>
              <p className="text-gray-400">
                Bitcoin's Intelligent Yield Aggregator
              </p>
            </div>
            
            <button 
              onClick={connectWallet}
              className="btn-primary"
            >
              {isWalletConnected ? '0x1234...5678' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat-card">
            <div className="stat-label">Total Value Locked</div>
            <div className="stat-value">{formatSTX(totalTVL, 0)} STX</div>
            <div className="text-sm text-gray-400 mt-2">
              Across 12 strategies
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Average APY</div>
            <div className="apy-display">{formatAPY(11.8)}</div>
            <div className="text-sm text-success mt-2">
              ↗ Auto-optimized
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">Your Balance</div>
            <div className="stat-value">
              {isWalletConnected ? formatSTX(userBalance, 0) : '—'}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {isWalletConnected ? 'STX deposited' : 'Connect wallet to view'}
            </div>
          </div>
        </div>

        {/* Strategy Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Available Strategies</h2>
            <div className="text-sm text-gray-400">
              12 strategies • Diversified across DeFi protocols
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(CONFIG.strategyMetadata).map(([key, strategy]) => (
              <StrategyCard key={key} strategy={strategy} isConnected={isWalletConnected} />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 card">
          <div className="flex items-start gap-4">
            <div className="text-4xl">₿</div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Secured by Bitcoin
              </h3>
              <p className="text-gray-400 mb-4">
                SNP is built on Stacks, the leading Bitcoin L2. Your funds benefit from 
                Bitcoin's security while earning optimized yields across 12 DeFi protocols.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="badge badge-success">
                  100% Bitcoin Finality
                </div>
                <div className="badge badge-bitcoin">
                  5-Second Blocks
                </div>
                <div className="badge badge-success">
                  Non-Custodial
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>SNP - First Automated Yield Aggregator on Stacks Bitcoin L2</p>
            <p className="mt-2">Built with ₿ by the SNP team • v2.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Strategy Card Component
function StrategyCard({ strategy, isConnected }: { strategy: any; isConnected: boolean }) {
  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'badge-success';
      case 'medium':
        return 'badge-warning';
      case 'high':
        return 'badge-error';
      default:
        return '';
    }
  };

  return (
    <div className="card hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold mb-1 group-hover:text-bitcoin-orange transition-colors">
            {strategy.name}
          </h3>
          <div className="text-xs text-gray-500">{strategy.category}</div>
        </div>
        <span className={`badge ${getRiskBadgeClass(strategy.riskLevel)}`}>
          {strategy.riskLevel.toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 min-h-[40px]">
        {strategy.description}
      </p>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs text-gray-500 mb-1">Target APY</div>
          <div className="text-2xl font-bold text-bitcoin-orange">
            {formatAPY(strategy.targetAPY)}
          </div>
        </div>
        
        <button 
          className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isConnected}
          onClick={() => console.log('Deposit to', strategy.name)}
        >
          {isConnected ? 'Deposit' : 'Connect First'}
        </button>
      </div>
    </div>
  );
}

export default App;
