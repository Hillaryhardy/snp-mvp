import { useState, useEffect } from 'react';
import { Shield, Wallet, TrendingUp, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
import { uintCV } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import StrategyGrid from './StrategyGrid';
import AllocationChart from './AllocationChart';
import StrategyCategories from './StrategyCategories';
import CurrencyToggle from './CurrencyToggle';
import { 
  fetchAllStrategiesData, 
  getVaultBalance, 
  getVaultShares, 
  getVaultTotalValue,
  getTotalTVL 
} from './services/stacksService';

// Contract details
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'vault-stx-v2';

function App() {
  // Initialize UserSession safely with error handling
  const [userSession] = useState(() => {
    try {
      const appConfig = new AppConfig(['store_write', 'publish_data']);
      return new UserSession({ appConfig });
    } catch (error) {
      console.warn('UserSession initialization warning:', error);
      return new UserSession({ appConfig: new AppConfig(['store_write', 'publish_data']) });
    }
  });
  
  const [userData, setUserData] = useState(null);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [vaultShares, setVaultShares] = useState(0);
  const [totalTVL, setTotalTVL] = useState(0);
  const [sharePrice, setSharePrice] = useState(1);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawShares, setWithdrawShares] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currencyMode, setCurrencyMode] = useState('stx');
  const [strategies, setStrategies] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch real blockchain data on component mount
  useEffect(() => {
    async function loadBlockchainData() {
      try {
        setDataLoading(true);
        console.log('🔗 Fetching real blockchain data...');
        
        // Fetch all strategies from blockchain
        const realStrategies = await fetchAllStrategiesData();
        setStrategies(realStrategies);
        
        // Calculate total TVL from strategies
        const tvl = realStrategies.reduce((sum, strategy) => sum + strategy.tvl, 0);
        setTotalTVL(tvl);
        
        console.log('✅ Loaded', realStrategies.length, 'strategies from blockchain');
        console.log('📊 Total TVL:', tvl, 'STX');
      } catch (error) {
        console.error('❌ Error loading blockchain data:', error);
        // Fallback to empty strategies if blockchain fetch fails
        console.warn('⚠️ Using empty strategy list. Deploy contracts to testnet to see real data.');
        setStrategies([]);
      } finally {
        setDataLoading(false);
      }
    }

    loadBlockchainData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadBlockchainData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() {
    try {
      if (userSession && userSession.isUserSignedIn && userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        setUserData(data);
        loadVaultData(data.profile.stxAddress.testnet);
      }
    } catch (error) {
      console.warn('Error loading user session:', error);
      // User not signed in or session error - this is ok, show connect wallet
    }
  }, [userSession]);

  const loadVaultData = async (address) => {
    try {
      console.log('📊 Loading vault data for:', address);
      
      // Fetch real vault data from blockchain
      const [balance, shares, totalValue, tvl] = await Promise.all([
        getVaultBalance(address),
        getVaultShares(address),
        getVaultTotalValue(),
        getTotalTVL()
      ]);
      
      // Convert from micro-STX to STX
      setVaultBalance(Number(balance) / 1000000);
      setVaultShares(Number(shares));
      setTotalTVL(Number(tvl) / 1000000);
      
      // Calculate share price
      if (Number(shares) > 0) {
        setSharePrice(Number(totalValue) / Number(shares) / 1000000);
      }
      
      console.log('✅ Vault data loaded:', {
        balance: Number(balance) / 1000000,
        shares: Number(shares),
        tvl: Number(tvl) / 1000000
      });
    } catch (error) {
      console.error('❌ Error loading vault data:', error);
      // Keep current values on error
    }
  };

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'SNP MVP - Stacks Nexus Protocol',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
        loadVaultData(data.profile.stxAddress.testnet);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut('/');
    setUserData(null);
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }

    setLoading(true);
    try {
      const amountInMicroSTX = Math.floor(parseFloat(depositAmount) * 1000000);
      
      await openContractCall({
        network: new StacksTestnet(),
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'deposit',
        functionArgs: [uintCV(amountInMicroSTX)],
        onFinish: (data) => {
          console.log('Deposit successful!', data);
          setDepositAmount('');
          setTimeout(() => loadVaultData(userData.profile.stxAddress.testnet), 3000);
        },
        onCancel: () => {
          console.log('Deposit cancelled');
        },
      });
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawShares || parseFloat(withdrawShares) <= 0) {
      alert('Please enter valid shares to withdraw');
      return;
    }

    setLoading(true);
    try {
      const sharesAmount = Math.floor(parseFloat(withdrawShares));
      const minAmountOut = Math.floor(sharesAmount * sharePrice * 1000000 * 0.98);
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await openContractCall({
        network: new StacksTestnet(),
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'withdraw',
        functionArgs: [uintCV(sharesAmount), uintCV(minAmountOut), uintCV(deadline)],
        onFinish: (data) => {
          console.log('Withdrawal successful!', data);
          setWithdrawShares('');
          setTimeout(() => loadVaultData(userData.profile.stxAddress.testnet), 3000);
        },
        onCancel: () => {
          console.log('Withdrawal cancelled');
        },
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStrategyClick = (strategy) => {
    setSelectedStrategy(selectedStrategy?.name === strategy.name ? null : strategy);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCurrencyModeChange = (mode) => {
    setCurrencyMode(mode);
  };

  const getFilteredStrategies = () => {
    if (activeCategory === 'all') return strategies;
    
    switch (activeCategory) {
      case 'lp-farming':
        return strategies.filter(s => 
          s.type.includes('LP') || s.type.includes('Farming') || s.type.includes('DEX')
        );
      case 'lending':
        return strategies.filter(s => 
          s.type.includes('Lending') || s.type.includes('Stability') || s.type.includes('Stablecoin')
        );
      case 'btc-native':
        return strategies.filter(s => 
          s.type.includes('BTC') || s.type.includes('Bitcoin') || s.name.includes('BTC') || s.name.includes('Stacking')
        );
      case 'high-yield':
        return strategies.filter(s => s.apy > 15);
      default:
        return strategies;
    }
  };

  const filteredStrategies = getFilteredStrategies();

  const weightedAPY = strategies.reduce((sum, s) => sum + (s.apy * s.allocation / 100), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  SNP MVP
                </h1>
                <p className="text-xs text-gray-400">Diversified Bitcoin DeFi Vault</p>
              </div>
            </div>
            
            {!userData ? (
              <button
                onClick={connectWallet}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Connect Wallet</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Connected</div>
                  <div className="text-white font-mono text-sm">
                    {userData.profile.stxAddress.testnet.slice(0, 6)}...{userData.profile.stxAddress.testnet.slice(-4)}
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Your Balance</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{vaultBalance.toFixed(2)} STX</div>
            <div className="text-sm text-green-400">+5.8% this month</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Weighted APY</h3>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{weightedAPY.toFixed(1)}%</div>
            <div className="text-sm text-purple-400">Across 12 strategies</div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Total TVL</h3>
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">${(totalTVL / 1000).toFixed(0)}K</div>
            <div className="text-sm text-blue-400">All protocols</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Active Strategies</h3>
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{strategies.length}</div>
            <div className="text-sm text-orange-400">Fully diversified</div>
          </div>
        </div>

        {/* Deposit/Withdraw Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Card */}
          <div className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>Deposit STX</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (STX)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.1"
                  disabled={!userData || loading}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-2">Auto-allocated across {strategies.length} protocols</p>
              </div>
              <button
                onClick={handleDeposit}
                disabled={!userData || loading || !depositAmount}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Processing...' : 'Deposit & Earn'}
              </button>
            </div>
          </div>

          {/* Withdraw Card */}
          <div className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span>Withdraw</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Shares to Withdraw</label>
                <input
                  type="number"
                  value={withdrawShares}
                  onChange={(e) => setWithdrawShares(e.target.value)}
                  placeholder="0"
                  disabled={!userData || loading}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-2">Available: {vaultShares} shares (~{(vaultShares * sharePrice / 1000000).toFixed(2)} STX)</p>
              </div>
              <button
                onClick={handleWithdraw}
                disabled={!userData || loading || !withdrawShares}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>

        {/* Currency Toggle */}
        <CurrencyToggle mode={currencyMode} onModeChange={handleCurrencyModeChange} />

        {/* Allocation Chart */}
        <AllocationChart strategies={strategies} />

        {/* Strategy Categories */}
        <StrategyCategories 
          strategies={strategies}
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
        />

        {/* Strategy Grid */}
        <StrategyGrid 
          strategies={filteredStrategies} 
          onStrategyClick={handleStrategyClick}
        />

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Diversified Yield Strategy</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your STX is intelligently distributed across {strategies.length} battle-tested DeFi protocols. 
                Our automated vault handles rebalancing, harvesting, and compounding - maximizing returns while minimizing risk through diversification.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">16.9% Avg APY</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">12 Protocols</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Auto-Optimized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Bitcoin Secured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Wallet Prompt */}
        {!userData && (
          <div className="text-center py-16 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl">
            <div className="inline-block p-4 bg-purple-600/20 rounded-full mb-6">
              <Wallet className="w-16 h-16 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Start Earning Diversified Yields</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              One deposit. Ten protocols. Automated optimization. Built on Bitcoin security.
            </p>
            <button
              onClick={connectWallet}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-purple-500/50"
            >
              Connect Wallet to Start
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
