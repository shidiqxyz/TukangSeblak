'use client';
import { useState } from 'react';

export default function LineaClient() {
  const [addresses, setAddresses] = useState('');
  const [results, setResults] = useState([]);
  const [totalLxp, setTotalLxp] = useState(0);
  const [totalProbability, setTotalProbability] = useState(0);
  const [loading, setLoading] = useState(false);

  // LAM Tier Mapping
  const lamTiers = [
    { tier: 'Tier 1', value: 0.000000001491 },
    { tier: 'Tier 2', value: 0.000000001640 },
    { tier: 'Tier 3', value: 0.000000001789 },
    { tier: 'Tier 4', value: 0.000000001938 },
    { tier: 'Tier 5', value: 0.000000002461 },
    { tier: 'Tier 6', value: 0.000000002640 },
    { tier: 'Tier 7', value: 0.000000002684 },
    { tier: 'Tier 8', value: 0.000000003132 },
    { tier: 'Tier 9', value: 0.000000004474 },
    { tier: 'Tier 10', value: 0.000000004847 },
    { tier: 'Tier 11', value: 0.000000007605 },
    { tier: 'Tier 12', value: 0.000000008053 },
    { tier: 'Tier 13', value: 0.000000008547 },
    { tier: 'Tier 14', value: 0.000000008724 },
    { tier: 'Tier 15', value: 0.000000009209 },
  ];

  const getLamTier = (lamValue) => {
    if (!lamValue) return '-';
    let foundTier = '-';
    for (let i = lamTiers.length - 1; i >= 0; i--) {
      if (lamValue >= lamTiers[i].value) {
        foundTier = lamTiers[i].tier;
        break;
      }
    }
    return foundTier;
  };

  const calculateProbability = (lxp, lam) => {
    if (!lxp || !lam) return 0;
    return lxp * lam * 1_000_000_000;
  };

  const checkAPI = async () => {
    const trimmedAddresses = addresses.trim();
    if (!trimmedAddresses) {
      alert('Please enter at least one address.');
      return;
    }
    const addressList = trimmedAddresses.split('\n').filter(addr => addr.trim() !== '');
    if (addressList.length === 0) {
      alert('No valid addresses found.');
      return;
    }

    setLoading(true);
    setResults([]);
    setTotalLxp(0);
    setTotalProbability(0);

    try {
      const promises = addressList.map(async (address) => {
        const [lxpData, checkData] = await Promise.all([
          fetch(`https://lxp-ceker.vercel.app/api/?address=${encodeURIComponent(address)}`).then(res => res.json()),
          fetch(`https://linea-voyager-api.vercel.app/api/?address=${encodeURIComponent(address)}`).then(res => res.json()),
        ]);
        return { address, lxpData, checkData };
      });

      const resultsData = await Promise.all(promises);
      let totalLxpValue = 0;
      let totalProbabilityValue = 0;

      const formattedResults = resultsData.map(({ address, lxpData, checkData }) => {
        const mapping = { 1: 'Alpha', 2: 'Beta', 3: 'Gamma', 4: 'Delta', 5: 'Omega' };

        const checkResults = Object.entries(checkData)
          .filter(([key, value]) => value === true)
          .map(([key]) => mapping[key])
          .join(', ') || '-';

        totalLxpValue += parseInt(lxpData.lxp || 0);

        const lam = parseFloat(lxpData.lam || 0);
        const lamTier = getLamTier(lam);
        const probability = calculateProbability(lxpData.lxp, lam);

        totalProbabilityValue += probability;

        return {
          address,
          poh: lxpData.poh,
          isFlagged: lxpData.isFlagged,
          lxp: lxpData.lxp,
          lxpL: lxpData['lxp-l'],
          lamTier,
          probability: probability.toFixed(2),
          checkResults,
        };
      });

      setResults(formattedResults);
      setTotalLxp(totalLxpValue);
      setTotalProbability(totalProbabilityValue);
    } catch (error) {
      console.error('Error fetching API:', error);
      alert('Error fetching API data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      {/* Title */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Linea LXP Status Checker
        </h1>
        <p className="mt-2 text-neutral-400">Check multiple addresses at once</p>
      </header>

      {/* Input Area */}
      <div className="mb-6">
        <textarea
          id="addresses"
          placeholder="Enter addresses (one per line)"
          rows="6"
          value={addresses}
          onChange={(e) => setAddresses(e.target.value)}
          className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white resize-none text-white placeholder-neutral-500"
        ></textarea>
        <button
          onClick={checkAPI}
          disabled={loading}
          className={`w-full mt-4 px-6 py-3 border border-neutral-700 text-white font-medium rounded-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-white'
            }`}
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div id="results" className="block">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Results <span className="ml-2 text-sm text-neutral-500">(Total: {results.length})</span>
            </h2>
            <div className="text-right">
              <p className="text-lg text-white font-medium">Total LXP: {totalLxp}</p>
              <p className="text-lg text-neutral-400 font-medium">Total Probability: {totalProbability.toFixed(2)}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-black border border-neutral-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                  <th className="py-3 px-4 text-left font-medium">Address</th>
                  <th className="py-3 px-4 text-left font-medium">POH</th>
                  <th className="py-3 px-4 text-left font-medium">Flagged</th>
                  <th className="py-3 px-4 text-left font-medium">LXP</th>
                  <th className="py-3 px-4 text-left font-medium">LXP-L</th>
                  <th className="py-3 px-4 text-left font-medium">LAM Tier</th>
                  <th className="py-3 px-4 text-left font-medium">Probability</th>
                  <th className="py-3 px-4 text-left font-medium">Voyager</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-neutral-800">
                    <td className="py-3 px-4 text-neutral-300 font-mono text-sm">{result.address.slice(0, 10)}...</td>
                    <td className={`py-3 px-4 ${result.poh ? 'text-white' : 'text-neutral-500'}`}>{result.poh ? 'Yes' : 'No'}</td>
                    <td className={`py-3 px-4 ${result.isFlagged ? 'text-neutral-500' : 'text-white'}`}>{result.isFlagged ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-4 text-white">{result.lxp}</td>
                    <td className="py-3 px-4 text-neutral-400">{result.lxpL}</td>
                    <td className="py-3 px-4 text-neutral-400">{result.lamTier}</td>
                    <td className="py-3 px-4 text-neutral-400">{result.probability}</td>
                    <td className="py-3 px-4 text-neutral-500">{result.checkResults}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
