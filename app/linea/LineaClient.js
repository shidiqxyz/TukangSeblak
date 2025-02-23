'use client'; // Directive untuk client-side rendering

import { useState } from 'react';

export default function LineaClient() {
  const [addresses, setAddresses] = useState('');
  const [results, setResults] = useState([]);
  const [totalLxp, setTotalLxp] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk memeriksa status melalui API
  const checkAPI = async () => {
    const trimmedAddresses = addresses.trim();
    if (!trimmedAddresses) {
      alert('⚠️ Please enter at least one address.');
      return;
    }
    const addressList = trimmedAddresses.split('\n').filter(addr => addr.trim() !== '');
    if (addressList.length === 0) {
      alert('❌ No valid addresses found.');
      return;
    }
    setLoading(true);
    setResults([]);
    setTotalLxp(0);
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
      const formattedResults = resultsData.map(({ address, lxpData, checkData }) => {
        const pohClass = lxpData.poh ? 'text-green-400' : 'text-red-400';
        const isFlaggedClass = !lxpData.isFlagged ? 'text-green-400' : 'text-red-400';
        const mapping = { 1: 'Alpha', 2: 'Beta', 3: 'Gamma', 4: 'Delta', 5: 'Omega' };
        const checkResults = Object.entries(checkData)
          .filter(([_, value]) => value)
          .map(([key]) => mapping[key])
          .join(', ') || '-';
        totalLxpValue += parseInt(lxpData.lxp || 0);
        return {
          address,
          poh: lxpData.poh,
          isFlagged: lxpData.isFlagged,
          lxp: lxpData.lxp,
          checkResults,
          pohClass,
          isFlaggedClass,
        };
      });
      setResults(formattedResults);
      setTotalLxp(totalLxpValue);
    } catch (error) {
      console.error('🚨 Error fetching API:', error);
      alert('❌ Error fetching API data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Judul */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r text-white flex items-center justify-center">
          📊 Linea LXP Status Checker 🔍
        </h1>
        <p className="mt-2 text-gray-400">Check multiple addresses at once ✨</p>
      </header>

      {/* Input Area */}
      <div className="mb-6">
        <textarea
          id="addresses"
          placeholder="Enter addresses (one per line) 🌐"
          rows="6"
          value={addresses}
          onChange={(e) => setAddresses(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 resize-none text-white placeholder-gray-500"
        ></textarea>
        <button
          onClick={checkAPI}
          disabled={loading}
          className={`w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {loading ? '⏳ Checking...' : '🚀 Check Status'}
        </button>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div id="results" className="block">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-300 flex items-center">
              📋 Results <span className="ml-2 text-sm text-gray-500">(Total: {results.length})</span>
            </h2>
            <p className="text-lg text-green-400 font-semibold flex items-center">
              💰 Total LXP: {totalLxp} <span className="ml-2 text-sm text-gray-500">(Combined)</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-600 text-gray-300">
                  <th className="py-3 px-4 text-left">📍 Address</th>
                  <th className="py-3 px-4 text-left">✅ POH</th>
                  <th className="py-3 px-4 text-left">🚩 isFlagged</th>
                  <th className="py-3 px-4 text-left">💰 LXP</th>
                  <th className="py-3 px-4 text-left">🌐 Linea Voyager</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="py-3 px-4 text-gray-300">{result.address}</td>
                    <td className={`py-3 px-4 ${result.pohClass}`}>
                      {result.poh ? '✅ True' : '❌ False'}
                    </td>
                    <td className={`py-3 px-4 ${result.isFlaggedClass}`}>
                      {result.isFlagged ? '❌ True' : '✅ False'}
                    </td>
                    <td className="py-3 px-4 text-yellow-400">💰 {result.lxp}</td>
                    <td className="py-3 px-4 text-gray-400">{result.checkResults}</td>
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