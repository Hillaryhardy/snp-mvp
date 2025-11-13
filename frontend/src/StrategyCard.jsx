import { TrendingUp, Shield, AlertCircle, CheckCircle, Activity, Zap } from 'lucide-react';

function StrategyCard({ strategy, onClick, isActive }) {
  const getHealthColor = (health) => {
    if (health >= 95) return 'text-green-400 bg-green-400/10';
    if (health >= 80) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const getApyColor = (apy) => {
    if (apy >= 20) return 'text-green-400';
    if (apy >= 15) return 'text-blue-400';
    return 'text-purple-400';
  };

  const getRiskBadge = (risk) => {
    const badges = {
      'Low': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Low-Medium': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Medium-High': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'High': 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return badges[risk] || badges['Medium'];
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60
        backdrop-blur-sm border rounded-xl p-6
        transition-all duration-300 hover:scale-[1.02]
        ${isActive 
          ? 'border-purple-500 shadow-lg shadow-purple-500/50' 
          : 'border-purple-500/30 hover:border-purple-500/60'
        }
      `}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">{strategy.name}</h3>
            </div>
            <p className="text-sm text-gray-400">{strategy.type}</p>
          </div>
          
          {/* Status indicator */}
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(strategy.health)}`}>
            <Activity className="w-3 h-3" />
            <span>{strategy.health}%</span>
          </div>
        </div>

        {/* APY - Big and Bold */}
        <div className="mb-4 p-4 bg-black/40 rounded-lg border border-purple-500/20">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Current APY</div>
              <div className={`text-3xl font-bold ${getApyColor(strategy.apy)}`}>
                {strategy.apy}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">TVL</div>
              <div className="text-lg font-semibold text-white">
                ${(strategy.tvl / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Allocation</span>
            </div>
            <div className="text-lg font-bold text-white">{strategy.allocation}%</div>
          </div>
          
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Earned</span>
            </div>
            <div className="text-lg font-bold text-white">{strategy.earned} STX</div>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadge(strategy.risk)}`}>
            {strategy.risk} Risk
          </span>
          
          {isActive && (
            <div className="flex items-center space-x-1 text-purple-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Active</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex flex-wrap gap-2">
            {strategy.features.map((feature, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-purple-400 text-sm flex items-center space-x-1">
            <span>View Details</span>
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrategyCard;
