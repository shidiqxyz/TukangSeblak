'use client'; // Directive untuk client-side rendering

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ResolvChecker() {
  const [addresses, setAddresses] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const isValidAddress = (address) => {
    return address.endsWith('.eth') || /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const createBoostBadge = (label, value) => {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-medium mr-2 mb-2">
        {label}: {value}%
      </span>
    );
  };

  const formatPointsData = (data) => {
    return (
      <div className="bg-gray-700 rounded-lg p-6 space-y-4">
        {/* Total Points */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">🏆</span>
          <h5 className="text-lg font-bold">
            Total Points: <strong>{formatNumber(data.totalPoints)}</strong>
          </h5>
        </div>

        {/* Daily Points */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">📅</span>
          <p>Daily Points: {formatNumber(data.dailyPoints)}</p>
        </div>

        {/* Active Boosts */}
        <div>
          <h6 className="text-md font-semibold flex items-center space-x-2 mb-2">
            <span className="text-lg">⚡</span>
            <span>Active Boosts:</span>
          </h6>
          <div className="flex flex-wrap">
            {createBoostBadge(data.boosts.epoch.name, data.boosts.epoch.value)}
            {createBoostBadge('Referee Welcome', data.boosts.refereeWelcomeBoost)}
            {createBoostBadge('Dinero Power', data.boosts.dineroPowerUser)}
            {createBoostBadge('Hyper liquid', data.boosts.hyperliquidPowerUser)}
            {createBoostBadge(`Resolv (${data.boosts.resolvPowerUser.level})`, data.boosts.resolvPowerUser.value)}
          </div>
        </div>

        {/* Daily Activities */}
        <div>
          <h6 className="text-md font-semibold flex items-center space-x-2 mb-2">
            <span className="text-lg">📊</span>
            <span>Daily Activities:</span>
          </h6>
          <div className="space-y-2">
            {Object.entries(data.dailyActivities)
              .filter(([_, value]) => value > 0)
              .map(([key, value]) => {
                // Emoji mapping for activities
                const activityEmoji = {
                  referralPoints: '👥',
                  holdUsrEth: '💎',
                  holdUsrBase: '💰',
                  holdStUsrEth: '📈',
                  holdRlpEth: '📊',
                  holdRlpBase: '📊',
                  pendleLiquidity: '💧',
                  pendleHoldYt: '📈',
                  pendleHoldUsrYt: '📈',
                  pendleUsrLiquidity: '💧',
                  spectraLiquidity: '💧',
                  spectraHoldYt: '📈',
                  spectraHoldRlpYt: '📈',
                  spectraRlpLiquidity: '💧',
                  spectraHoldUsdcYt: '📈',
                  spectraUsdcLiquidity: '💧',
                  spectraWstUsrLiquidity: '💧',
                  spectraWstUsrYt: '📈',
                  spectraUsrLiquidity: '💧',
                  spectraUsrYt: '📈',
                  eulerUsdcSupplyEth: '🏦',
                  eulerUsrSupplyEth: '🏦',
                  eulerWstUsrSupplyEth: '🏦',
                  eulerRlpSupplyEth: '🏦',
                  curveUsrLiquidity: '💧',
                  curveRlpLiquidity: '💧',
                  curveUsrRlpLiquidity: '💧',
                  curveUsrGhoLiquidity: '💧',
                  curveUsrDolaLiquidity: '💧',
                  aerodromeUsrUsdcLiquidity: '💧',
                  aerodromeUsrRlpLiquidity: '💧',
                  uniswapUsrUsdcLiquidity: '💧',
                  levelDepositUsr: '📥',
                  levelDepositRlp: '📥',
                };
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <span className="text-lg">{activityEmoji[key] || '✨'}</span>
                    <p>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {formatNumber(value)}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const showError = (message, details = null) => {
    return (
      <div className="bg-red-600 text-white rounded-lg p-4">
        <strong>Error:</strong> {message}
        {details && <p>{details}</p>}
      </div>
    );
  };

  const fetchAddressPoints = async (address) => {
    try {
      const response = await fetch(`/api/points?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { success: false, error: error.message || 'Failed to fetch data' };
    }
  };

  const handleCheckPoints = async () => {
    const inputAddresses = addresses
      .split(/[\n,]+/)
      .map(addr => addr.trim())
      .filter(addr => addr !== '');

    if (inputAddresses.length === 0) {
      setResults([showError('Please enter at least one address')]);
      return;
    }

    const invalidAddresses = inputAddresses.filter(addr => !isValidAddress(addr));
    if (invalidAddresses.length > 0) {
      setResults([showError('Invalid addresses:', invalidAddresses.join(', '))]);
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const resultsArray = [];
      for (const address of inputAddresses) {
        const result = await fetchAddressPoints(address);
        const addressCard = (
          <div key={address} className="mb-6">
            <div className="bg-gray-700 rounded-lg shadow-md p-6 space-y-4">
              {/* Address Header */}
              <h5 className="text-xl font-bold flex items-center space-x-2">
                <span className="text-lg">🔗</span>
                <span>{address}</span>
              </h5>
              {/* Result or Error */}
              {result.success ? formatPointsData(result.data) : showError(result.error)}
            </div>
          </div>
        );
        resultsArray.push(addressCard);
      }
      setResults(resultsArray);
    } catch (error) {
      setResults([showError('An unexpected error occurred', error.message)]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center p-6">
        <div className="w-full max-w-7xl bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r text-white">
            Resolv Points Checker 🧮
          </h1>
          <textarea
            id="addresses"
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500 resize-none"
            rows="5"
            placeholder="Enter EVM addresses or ENS names (e.g., vitalik.eth). Separate multiple addresses with commas or new lines."
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
          />
          <button
            id="callApi"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded transition duration-300"
            onClick={handleCheckPoints}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Check Points'}
          </button>
          {loading && (
            <div className="text-center mt-4">
              <div className="spinner-border text-purple-500" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p>Loading...</p>
            </div>
          )}
          <div id="results" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {results}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}