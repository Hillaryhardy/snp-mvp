import { TrendingUp, Shield, Coins, Zap, Layers } from 'lucide-react';

function StrategyCategories({ strategies, onCategoryClick, activeCategory }) {
  const categories = [
    {
      id: 'all',
      name: 'All Strategies',
      icon: Layers,
      color: 'from-purple-600 to-blue-600',
      borderColor: 'border-purple-500/30',
      count: strategies.length,
      description: 'Complete portfolio'
    },
    {
      id: 'lp-farming',
      name: 'LP Farming',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600',
      borderColor: 'border-green-500/30',
      count: strategies.filter(s => 
        s.type.includes('LP') || s.type.includes('Farming') || s.type.includes('DEX')
      ).length,
      description: 'Liquidity provision & DEX rewards'
    },
    {
      id: 'lending',
      name: 'Lending & Borrowing',
      icon: Coins,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/30',
      count: strategies.filter(s => 
        s.type.includes('Lending') || s.type.includes('Stability') || s.type.includes('Stablecoin')
      ).length,
      description: 'Interest-bearing protocols'
    },
    {
      id: 'btc-native',
      name: 'Bitcoin Native',
      icon: Shield,
      color: 'from-orange-600 to-amber-600',
      borderColor: 'border-orange-500/30',
      count: strategies.filter(s => 
        s.type.includes('BTC') || s.type.includes('Bitcoin') || s.name.includes('BTC') || s.name.includes('Stacking')
      ).length,
      description: 'Bitcoin-focused strategies'
    },
    {
      id: 'high-yield',
      name: 'High Yield',
      icon: Zap,
      color: 'from-pink-600 to-rose-600',
      borderColor: 'border-pink-500/30',
      count: strategies.filter(s => s.apy > 15).length,
      description: 'APY > 15%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Strategy Categories
        </h2>
        <p className="text-gray-400">
          Browse by protocol type or risk profile
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={`
                relative overflow-hidden rounded-xl p-6 transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-br ${category.color} border-2 ${category.borderColor} scale-105 shadow-lg` 
                  : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:scale-102 hover:border-purple-500/30'
                }
              `}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-bold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-700/50 text-gray-300'
                    }
                  `}>
                    {category.count}
                  </div>
                </div>
                
                <h3 className={`text-sm font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {category.name}
                </h3>
                
                <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {category.description}
                </p>
              </div>

              {/* Animated background effect when active */}
              {isActive && (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Info Banner */}
      {activeCategory !== 'all' && (
        <div className={`
          bg-gradient-to-r from-purple-500/10 to-blue-500/10 
          border ${categories.find(c => c.id === activeCategory)?.borderColor}
          rounded-lg p-4
        `}>
          <p className="text-gray-300 text-sm text-center">
            Showing {categories.find(c => c.id === activeCategory)?.count} strategies in <span className="text-white font-semibold">
              {categories.find(c => c.id === activeCategory)?.name}
            </span> category
          </p>
        </div>
      )}
    </div>
  );
}

export default StrategyCategories;
