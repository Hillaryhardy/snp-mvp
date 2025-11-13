import { useState } from 'react';
import { Shield, Filter, Search, Grid, List } from 'lucide-react';
import StrategyCard from './StrategyCard';

function StrategyGrid({ strategies, onStrategyClick }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('apy'); // 'apy', 'tvl', 'name', 'health'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort strategies
  const filteredStrategies = strategies
    .filter(s => {
      if (filterRisk !== 'all' && s.risk !== filterRisk) return false;
      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'apy': return b.apy - a.apy;
        case 'tvl': return b.tvl - a.tvl;
        case 'health': return b.health - a.health;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                All Strategies
              </h2>
              <p className="text-sm text-gray-400">
                {filteredStrategies.length} of {strategies.length} protocols
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Risk Filter */}
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Low-Medium">Low-Medium</option>
              <option value="Medium">Medium</option>
              <option value="Medium-High">Medium-High</option>
              <option value="High">High</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="apy">Sort by APY</option>
              <option value="tvl">Sort by TVL</option>
              <option value="health">Sort by Health</option>
              <option value="name">Sort by Name</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Avg APY</div>
            <div className="text-xl font-bold text-green-400">
              {(filteredStrategies.reduce((sum, s) => sum + s.apy, 0) / filteredStrategies.length).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Total TVL</div>
            <div className="text-xl font-bold text-white">
              ${(filteredStrategies.reduce((sum, s) => sum + s.tvl, 0) / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Healthy</div>
            <div className="text-xl font-bold text-purple-400">
              {filteredStrategies.filter(s => s.health >= 80).length}/{filteredStrategies.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Active</div>
            <div className="text-xl font-bold text-blue-400">
              {filteredStrategies.filter(s => s.isActive).length}
            </div>
          </div>
        </div>
      </div>

      {/* Strategies Grid/List */}
      {filteredStrategies.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredStrategies.map((strategy, index) => (
            <StrategyCard
              key={index}
              strategy={strategy}
              onClick={() => onStrategyClick && onStrategyClick(strategy)}
              isActive={strategy.isActive}
            />
          ))}
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-12 text-center">
          <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No strategies found</h3>
          <p className="text-gray-400">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
}

export default StrategyGrid;
