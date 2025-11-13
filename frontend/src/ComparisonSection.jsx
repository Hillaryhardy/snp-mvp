import { Check, X, Shield, TrendingUp, Eye, GitBranch } from 'lucide-react';

function ComparisonSection() {
  const comparisons = [
    {
      feature: 'Number of Strategies',
      snp: '10 Protocols',
      hermetica: '5 Categories',
      snpWins: true,
      icon: GitBranch
    },
    {
      feature: 'Blockchain',
      snp: 'Stacks (Bitcoin L2)',
      hermetica: 'Multi-chain',
      snpWins: true,
      icon: Shield
    },
    {
      feature: 'Return Options',
      snp: 'STX or BTC',
      hermetica: 'BTC only',
      snpWins: true,
      icon: TrendingUp
    },
    {
      feature: 'Transparency',
      snp: 'High (all protocols visible)',
      hermetica: 'Medium (abstracted)',
      snpWins: true,
      icon: Eye
    },
    {
      feature: 'Average APY',
      snp: '16.9%',
      hermetica: '~10%',
      snpWins: true,
      icon: TrendingUp
    },
    {
      feature: 'Auto-rebalancing',
      snp: 'Yes',
      hermetica: 'Yes',
      snpWins: false,
      icon: Check
    }
  ];

  return (
    <div className="bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          How SNP Compares to Competitors
        </h2>
        <p className="text-gray-400">
          We're building on the success of proven models like Hermetica, with unique advantages
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/30">
              <th className="text-left py-4 px-4 text-gray-300 font-semibold">Feature</th>
              <th className="text-center py-4 px-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span className="text-white font-bold">SNP</span>
                </div>
              </th>
              <th className="text-center py-4 px-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg">
                  <span className="text-gray-300 font-semibold">Hermetica hBTC</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((item, index) => {
              const Icon = item.icon;
              return (
                <tr 
                  key={index} 
                  className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">{item.feature}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg ${
                      item.snpWins 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-gray-700/50'
                    }`}>
                      {item.snpWins && <Check className="w-4 h-4 text-green-400" />}
                      <span className="text-white text-sm font-medium">{item.snp}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-gray-400 text-sm">{item.hermetica}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Check className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Better Diversification</h3>
          </div>
          <p className="text-gray-400 text-sm">
            10 protocols vs 5 means lower risk through broader exposure
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Higher Returns</h3>
          </div>
          <p className="text-gray-400 text-sm">
            16.9% average APY vs ~10% with active optimization
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Bitcoin Native</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Built on Stacks - full Bitcoin security without compromise
          </p>
        </div>
      </div>
    </div>
  );
}

export default ComparisonSection;
