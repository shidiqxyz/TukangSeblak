'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import sss from 'shamirs-secret-sharing';

export default function SecretSharing() {
  const [secret, setSecret] = useState('');
  const [threshold, setThreshold] = useState(2);
  const [totalShares, setTotalShares] = useState(3);
  const [shares, setShares] = useState([]);
  const [error, setError] = useState('');

  const [recoveryShares, setRecoveryShares] = useState('');
  const [recoveredSecret, setRecoveredSecret] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (threshold > totalShares) {
      setError('Minimum shares cannot exceed total shares');
      return;
    }

    if (secret.trim() === '') {
      setError('Secret cannot be empty');
      return;
    }

    try {
      const buffer = Buffer.from(secret, 'utf8');
      const sharesArray = sss.split(buffer, { shares: totalShares, threshold });
      setShares(sharesArray.map(share => share.toString('hex')));
      setError('');
    } catch (err) {
      setError('Error generating shares: ' + err.message);
    }
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoveredSecret('');

    try {
      const shareLines = recoveryShares.split('\n')
        .map(line => line.trim().replace(/Part \d+:\s*/i, ''))
        .filter(line => line !== '');

      if (shareLines.length < threshold) {
        throw new Error(`Need at least ${threshold} valid shares`);
      }

      const buffers = shareLines.map(share => Buffer.from(share, 'hex'));
      const recovered = sss.combine(buffers);
      setRecoveredSecret(recovered.toString('utf8'));
    } catch (err) {
      setRecoveryError('Recovery failed: ' + err.message);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([shares.map((s, i) => `Part ${i + 1}: ${s}`).join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sss_shares.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-900 border border-neutral-800 p-6 mb-6 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">Shamir&apos;s Secret Sharing (SSS)</p>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-4 mb-6 rounded-lg text-center">
          <p className="font-medium text-white">Offline Requirement</p>
          <p className="text-neutral-400">Please disconnect from the internet before proceeding with secret operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Split Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Split Secret</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-neutral-400">
                  Private Key/Mnemonic
                </label>
                <textarea
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="w-full py-2 px-3 bg-black border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  rows="3"
                  placeholder="Enter your secret"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-neutral-400">
                    Minimum Recovery Shares
                  </label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    min="2"
                    max={totalShares}
                    className="w-full py-2 px-3 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-white"
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-neutral-400">
                    Total Shares to Create
                  </label>
                  <input
                    type="number"
                    value={totalShares}
                    onChange={(e) => setTotalShares(parseInt(e.target.value))}
                    min={threshold}
                    className="w-full py-2 px-3 bg-black border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-white"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-neutral-500 text-sm mb-4 text-center">{error}</p>}

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="border border-neutral-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none transition hover:bg-white hover:text-black hover:border-white"
                >
                  Generate Shares
                </button>
              </div>
            </form>

            {shares.length > 0 && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-black border border-neutral-800 rounded-lg">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className="py-2 px-4 text-left font-medium text-neutral-400">Part</th>
                        <th className="py-2 px-4 text-left font-medium text-neutral-400">Share Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shares.map((share, index) => (
                        <tr key={index} className="border-b border-neutral-800">
                          <td className="py-2 px-4 text-white font-medium">Part {index + 1}</td>
                          <td className="py-2 px-4 break-all text-neutral-400 font-mono text-sm">{share}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="bg-white text-black font-medium py-2 px-4 rounded-lg focus:outline-none transition hover:bg-neutral-200"
                  >
                    Download TXT File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recovery Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Recover Secret</h2>

            <form onSubmit={handleRecovery}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-neutral-400">
                  Enter Shares (One per line)
                </label>
                <textarea
                  value={recoveryShares}
                  onChange={(e) => setRecoveryShares(e.target.value)}
                  className="w-full py-2 px-3 bg-black border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  rows="10"
                  placeholder="Paste your shares here..."
                  required
                />
              </div>

              {recoveryError && <p className="text-neutral-500 text-sm mb-4 text-center">{recoveryError}</p>}

              <div className="flex items-center justify-center mb-4">
                <button
                  type="submit"
                  className="border border-neutral-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none transition hover:bg-white hover:text-black hover:border-white"
                >
                  Recover Secret
                </button>
              </div>

              {recoveredSecret && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2 text-center text-white">Recovered Secret:</h3>
                  <textarea
                    value={recoveredSecret}
                    readOnly
                    rows="3"
                    className="w-full py-2 px-3 bg-black border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}