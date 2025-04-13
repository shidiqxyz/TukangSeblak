'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VotePage() {
  const [address, setAddress] = useState('');
  const [peerId, setPeerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchVoteData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, peerId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch data');
      setResult(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-3xl bg-gray-800 rounded-xl p-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text text-white">
              🧠 Check Gensyn Vote and Wins
            </h1>
            <p className="mt-2 text-gray-400 text-lg">
              Check the vote count and total wins for a wallet or peer id.
            </p>
          </header>

          {/* Input Area */}
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Wallet Address (optional)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                placeholder="0x..."
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Peer ID (optional)</label>
              <input
                type="text"
                value={peerId}
                onChange={(e) => setPeerId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                placeholder="Qm..."
              />
            </div>

            <button
              onClick={fetchVoteData}
              disabled={loading || (!address && !peerId)}
              className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-md transition duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {loading ? '⏳ Checking...' : '🚀 Check'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mt-6">
              ⚠️ {error}
            </div>
          )}

          {/* Results Table */}
          {result && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-300">📋 Results</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-gray-700 rounded-lg">
                  <thead>
                    <tr className="bg-gray-600 text-gray-300">
                      {/* <th className="py-3 px-6 text-left">📍 Address</th> */}
                      <th className="py-3 px-6 text-left">✅ Vote Count</th>
                      <th className="py-3 px-6 text-left">💰 Total Wins</th>
                      {/* <th className="py-3 px-6 text-left">🌐 Peer ID</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-600">
                      {/* <td className="py-3 px-6 text-gray-300">{address}</td> */}
                      <td className="py-3 px-6 text-indigo-400 font-semibold">{result.voteCount}</td>
                      <td className="py-3 px-6 text-green-400 font-semibold">{result.totalWins}</td>
                      {/* <td className="py-3 px-6 text-gray-400">{peerId}</td> */}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}