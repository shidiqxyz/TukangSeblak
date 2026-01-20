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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Check Gensyn Vote and Wins
            </h1>
            <p className="mt-2 text-neutral-400 text-lg">
              Check the vote count and total wins for a wallet or peer id.
            </p>
          </header>

          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm text-neutral-400 mb-2">Wallet Address (optional)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
                placeholder="0x..."
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-neutral-400 mb-2">Peer ID (optional)</label>
              <input
                type="text"
                value={peerId}
                onChange={(e) => setPeerId(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
                placeholder="Qm..."
              />
            </div>

            <button
              onClick={fetchVoteData}
              disabled={loading || (!address && !peerId)}
              className={`w-full px-6 py-3 border border-neutral-700 text-white font-medium rounded-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-white'
                }`}
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>

          {error && (
            <div className="text-neutral-500 text-center mt-6">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Results</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-black border border-neutral-800 rounded-lg">
                  <thead>
                    <tr className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                      <th className="py-3 px-6 text-left font-medium">Vote Count</th>
                      <th className="py-3 px-6 text-left font-medium">Total Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-800">
                      <td className="py-3 px-6 text-white font-medium">{result.voteCount}</td>
                      <td className="py-3 px-6 text-white font-medium">{result.totalWins}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}