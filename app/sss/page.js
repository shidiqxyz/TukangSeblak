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
  
  // Recovery state
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
        .map(line => line.trim().replace(/Bagian \d+:\s*/i, '')) // Remove part labels
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
    const blob = new Blob([shares.map((s, i) => `Part ${i+1}: ${s}`).join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sss_shares.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-black bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Centered Warning Banner */}
        <div className="bg-white  p-4 mb-6 rounded-lg text-center text-2xl font-bold">
          <p className="font-bold">Shamir's Secret Sharing (SSS)</p>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg text-center">
          <p className="font-bold">Offline Requirement</p>
          <p>Please disconnect from the internet before proceeding with secret operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Split Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Split Secret</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Secret Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Private Key/Mnemonic
                </label>
                <textarea
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Enter your secret"
                  required
                />
              </div>

              {/* Threshold and Shares */}
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                  <label className="block text-sm font-bold mb-2">
                    Minimum Recovery Shares
                  </label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    min="2"
                    max={totalShares}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="w-full md:w-1/2 px-3">
                  <label className="block text-sm font-bold mb-2">
                    Total Shares to Create
                  </label>
                  <input
                    type="number"
                    value={totalShares}
                    onChange={(e) => setTotalShares(parseInt(e.target.value))}
                    min={threshold}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}

              {/* Submit Button */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Generate Shares
                </button>
              </div>
            </form>

            {/* Shares Display */}
            {shares.length > 0 && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Part</th>
                        <th className="py-2 px-4 border-b">Share Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shares.map((share, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b text-center font-bold">Part {index + 1}</td>
                          <td className="py-2 px-4 border-b break-words">{share}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Download TXT File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recovery Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Recover Secret</h2>
            
            <form onSubmit={handleRecovery}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Enter Shares (One per line)
                </label>
                <textarea
                  value={recoveryShares}
                  onChange={(e) => setRecoveryShares(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  rows="10"
                  placeholder="Paste your shares here..."
                  required
                />
              </div>

              {recoveryError && <p className="text-red-500 text-xs italic mb-4 text-center">{recoveryError}</p>}

              <div className="flex items-center justify-center mb-4">
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Recover Secret
                </button>
              </div>

              {recoveredSecret && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2 text-center">Recovered Secret:</h3>
                  <textarea
                    value={recoveredSecret}
                    readOnly
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
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