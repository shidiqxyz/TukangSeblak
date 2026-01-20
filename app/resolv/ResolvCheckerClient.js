'use client';

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
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const createBoostBadge = (label, value) => {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded border border-neutral-700 bg-black text-white text-xs font-medium mr-2 mb-2">
        {label}: {value}%
      </span>
    );
  };

  const formatPointsData = (data) => {
    const { points, leaderboard } = data;

    return (
      <div className="bg-black border border-neutral-800 rounded-lg p-6 space-y-4">
        {leaderboard ? (
          <div className="flex items-center space-x-2">
            <h5 className="text-lg font-bold text-white">
              Rank: <strong>{leaderboard.rank}</strong>
            </h5>
          </div>
        ) : (
          <div className="bg-neutral-800 text-neutral-400 rounded-lg p-2">
            Address not found in leaderboard.
          </div>
        )}

        <div className="flex items-center space-x-2">
          <p className="text-lg font-medium text-neutral-400">Daily Points: <strong className="text-white">{formatNumber(points.dailyPoints)}</strong></p>
        </div>
        <div className="flex items-center space-x-2">
          <h5 className="text-lg font-medium text-neutral-400">
            Total Points: <strong className="text-white">{formatNumber(points.totalPoints)}</strong>
          </h5>
        </div>

        <div>
          <h6 className="text-md font-medium flex items-center space-x-2 mb-2 text-white">
            <span>Active Boosts:</span>
          </h6>
          <div className="flex flex-wrap">
            {createBoostBadge(points.boosts.epoch.name, points.boosts.epoch.value)}
            {createBoostBadge('Referee Welcome', points.boosts.refereeWelcomeBoost)}
            {createBoostBadge('Dinero Power', points.boosts.dineroPowerUser)}
            {createBoostBadge('Hyper liquid', points.boosts.hyperliquidPowerUser)}
            {createBoostBadge(`Resolv (${points.boosts.resolvPowerUser.level})`, points.boosts.resolvPowerUser.value)}
          </div>
        </div>

        <div>
          <h6 className="text-md font-medium flex items-center space-x-2 mb-2 text-white">
            <span>Daily Activities:</span>
          </h6>
          <div className="space-y-2">
            {Object.entries(points.dailyActivities)
              .filter(([_, value]) => value > 0)
              .map(([key, value]) => {
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <p className="text-neutral-400">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: <span className="text-white">{formatNumber(value)}</span>
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
      <div className="bg-neutral-800 text-neutral-400 rounded-lg p-4 border border-neutral-700">
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
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
              <h5 className="text-xl font-bold flex items-center space-x-2 text-white">
                <span className="font-mono text-sm">{address}</span>
              </h5>
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center p-6">
        <div className="w-full max-w-7xl bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-white">
            Resolv Points Checker
          </h1>
          <textarea
            id="addresses"
            className="w-full p-4 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white resize-none text-white placeholder-neutral-500"
            rows="5"
            placeholder="Enter EVM addresses or ENS names. Separate multiple addresses with commas or new lines."
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
          />
          <button
            id="callApi"
            className="w-full border border-neutral-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 hover:bg-white hover:text-black hover:border-white"
            onClick={handleCheckPoints}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Check Points'}
          </button>
          {loading && (
            <div className="text-center mt-4">
              <p className="text-neutral-400">Loading...</p>
            </div>
          )}
          <div id="results" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {results}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}