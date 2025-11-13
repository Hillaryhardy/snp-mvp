import { Bitcoin, Wallet } from 'lucide-react';

function CurrencyToggle({ mode, onModeChange }) {
  return (
    <div className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your Earning Mode
        </h2>
        <p className="text-gray-400">
          Flexible yield options to match your investment strategy
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* STX Mode */}
        <button
          onClick={() => onModeChange('stx')}
          className={`
            flex-1 relative overflow-hidden rounded-xl p-6 transition-all duration-300
            ${mode === 'stx'
              ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-2 border-purple-400 scale-105 shadow-xl shadow-purple-500/50'
              : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:border-purple-500/30 hover:scale-102'
            }
          `}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`
                p-3 rounded-lg ${mode === 'stx' ? 'bg-white/20' : 'bg-gray-700/50'}
              `}>
                <Wallet className={`w-8 h-8 ${mode === 'stx' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              {mode === 'stx' && (
                <div className="px-3 py-1 bg-white/20 rounded-full">
                  <span className="text-white text-xs font-bold">ACTIVE</span>
                </div>
              )}
            </div>

            <h3 className={`text-xl font-bold mb-2 ${mode === 'stx' ? 'text-white' : 'text-gray-300'}`}>
              Earn in STX
            </h3>
            
            <p className={`text-sm mb-4 ${mode === 'stx' ? 'text-white/80' : 'text-gray-500'}`}>
              Receive all yields directly in Stacks tokens
            </p>

            <div className="space-y-2">
              <div className={`flex items-center space-x-2 text-sm ${mode === 'stx' ? 'text-white' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${mode === 'stx' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span>No conversion fees</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${mode === 'stx' ? 'text-white' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${mode === 'stx' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span>Instant rewards</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${mode === 'stx' ? 'text-white' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${mode === 'stx' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span>Full APY: 16.9%</span>
              </div>
            </div>
          </div>

          {mode === 'stx' && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            </div>
          )}
        </button>

        {/* BTC Mode */}
        <button
          onClick={() => onModeChange('btc')}
          className={`
            flex-1 relative overflow-hidden rounded-xl p-6 transition-all duration-300
            ${mode === 'btc'
              ? 'bg-gradient-to-br from-orange-600 to-amber-600 border-2 border-orange-400 scale-105 shadow-xl shadow-orange-500/50'
              : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:border-orange-500/30 hover:scale-102'
            }
          `}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`
                p-3 rounded-lg ${mode === 'btc' ? 'bg-white/20' : 'bg-gray-700/50'}
              `}>
                <Bitcoin className={`w-8 h-8 ${mode === 'btc' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              {mode === 'btc' ? (
                <div className="px-3 py-1 bg-white/20 rounded-full">
                  <span className="text-white text-xs font-bold">ACTIVE</span>
                </div>
              ) : (
                <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <span className="text-blue-300 text-xs font-bold">COMING SOON</span>
                </div>
              )}
            </div>

            <h3 className={`text-xl font-bold mb-2 ${mode === 'btc' ? 'text-white' : 'text-gray-300'}`}>
              Earn in BTC
            </h3>
            
            <p className={`text-sm mb-4 ${mode === 'btc' ? 'text-white/80' : 'text-gray-500'}`}>
              Auto-convert yields to Bitcoin (sBTC)
            </p>

            <div className="space-y-2">
              <div className={`flex items-center space-x-2 text-sm ${mode === 'btc' ? 'text-white' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${mode === 'btc' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span>Accumulate Bitcoin</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${mode === 'btc' ? 'text-white' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${mode === 'btc' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span>Auto-conversion</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${mode === 'btc' ? 'text-white' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${mode === 'btc' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <span>APY: ~15.8%* (after fees)</span>
              </div>
            </div>
          </div>

          {mode === 'btc' && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            </div>
          )}
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-white">Flexible Earning:</span> Choose STX mode for maximum yield, 
          or BTC mode to automatically build your Bitcoin holdings over time.
        </p>
        {mode === 'btc' && (
          <p className="text-gray-400 text-xs mt-2">
            * BTC mode launching Q1 2026. APY adjusted for conversion fees (~1-1.2%).
          </p>
        )}
      </div>
    </div>
  );
}

export default CurrencyToggle;
