import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

function AllocationChart({ strategies }) {
  // Prepare data for pie chart
  const chartData = strategies
    .filter(s => s.allocation > 0)
    .map(s => ({
      name: s.name,
      value: s.allocation,
      apy: s.apy,
      tvl: s.tvl,
      color: s.color || getColorForStrategy(s.name)
    }));

  // Color palette for strategies
  function getColorForStrategy(name) {
    const colors = {
      'ALEX': '#8b5cf6',
      'Zest': '#06b6d4',
      'Arkadiko': '#10b981',
      'Bitflow': '#f59e0b',
      'Hermetica': '#ec4899',
      'StackSwap': '#ef4444',
      'Velar': '#3b82f6',
      'STX Stacking': '#6366f1',
      'Wrapped BTC': '#f97316',
      'Stable Pool': '#14b8a6'
    };
    
    for (const [key, color] of Object.entries(colors)) {
      if (name.includes(key)) return color;
    }
    return '#8b5cf6';
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-purple-500/50 rounded-lg p-4 shadow-xl">
          <p className="text-white font-bold mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between space-x-4">
              <span className="text-gray-400">Allocation:</span>
              <span className="text-purple-400 font-semibold">{data.value}%</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-gray-400">APY:</span>
              <span className="text-green-400 font-semibold">{data.apy}%</span>
            </div>
            <div className="flex justify-between space-x-4">
              <span className="text-gray-400">TVL:</span>
              <span className="text-white font-semibold">${(data.tvl / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {payload.map((entry, index) => (
          <div 
            key={index}
            className="flex items-center space-x-2 bg-gray-800/30 px-3 py-2 rounded-lg"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-300">{entry.value}</span>
            <span className="text-xs text-purple-400 font-semibold">
              {chartData[index].value}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  const totalTVL = strategies.reduce((sum, s) => sum + s.tvl, 0);
  const avgAPY = strategies.reduce((sum, s) => sum + s.apy * (s.allocation / 100), 0);

  return (
    <div className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Strategy Allocation</h3>
            <p className="text-sm text-gray-400">Multi-protocol distribution</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="text-right">
          <div className="text-sm text-gray-400">Weighted APY</div>
          <div className="text-2xl font-bold text-green-400">{avgAPY.toFixed(1)}%</div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{strategies.length}</div>
            <div className="text-xs text-gray-400">Strategies</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700/50">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Total TVL</div>
          <div className="text-xl font-bold text-white">
            ${(totalTVL / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Active Strategies</div>
          <div className="text-xl font-bold text-purple-400">
            {strategies.filter(s => s.health >= 80).length}/{strategies.length}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Avg Health</div>
          <div className="text-xl font-bold text-green-400">
            {(strategies.reduce((sum, s) => sum + s.health, 0) / strategies.length).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllocationChart;
