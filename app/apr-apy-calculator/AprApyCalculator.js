'use client'; // Directive untuk client-side rendering

import { useState } from 'react';


export default function AprApyCalculator() {
  const [aprInputs, setAprInputs] = useState({ principal: '', days: '', rate: '' });
  const [apyInputs, setApyInputs] = useState({ principal: '', days: '', rate: '' });
  const [aprResult, setAprResult] = useState(null);
  const [apyResult, setApyResult] = useState(null);

  // Fungsi untuk menghitung hasil APR
  const calculateApr = () => {
    const { principal, days, rate } = aprInputs;
    if (!principal || !days || !rate) return;
    const dailyRate = parseFloat(rate) / 100 / 365;
    const earnings = parseFloat(principal) * dailyRate * parseInt(days);
    const total = parseFloat(principal) + earnings;
    setAprResult({ earnings: earnings.toFixed(2), total: total.toFixed(2) });
  };

  // Fungsi untuk menghitung hasil APY
  const calculateApy = () => {
    const { principal, days, rate } = apyInputs;
    if (!principal || !days || !rate) return;
    const dailyRate = Math.pow(1 + parseFloat(rate) / 100 / 365, 365) - 1;
    const earnings = parseFloat(principal) * dailyRate * (parseInt(days) / 365);
    const total = parseFloat(principal) + earnings;
    setApyResult({ earnings: earnings.toFixed(2), total: total.toFixed(2) });
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white">
    

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-7xl bg-gray-800 rounded-lg shadow-2xl p-8 space-y-8">
          {/* Bagian Kiri: APR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-bold text-purple-400 flex items-center">
                <i className="fas fa-calculator mr-2"></i> APR Calculator 💸
              </h2>
              <input
                type="number"
                placeholder="Initial Capital (USD)"
                value={aprInputs.principal}
                onChange={(e) =>
                  setAprInputs({ ...aprInputs, principal: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500 transition duration-300"
              />
              <input
                type="number"
                placeholder="Days"
                value={aprInputs.days}
                onChange={(e) => setAprInputs({ ...aprInputs, days: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500 transition duration-300"
              />
              <input
                type="number"
                placeholder="APR Rate (%)"
                value={aprInputs.rate}
                onChange={(e) => setAprInputs({ ...aprInputs, rate: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500 transition duration-300"
              />
              <button
                onClick={calculateApr}
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded transition duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-coins"></i>
                <span>Calculate Earnings</span>
              </button>
              {aprResult && (
                <div className="space-y-2">
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-calendar-alt text-green-400"></i>
                    <p className="text-lg font-semibold">Days: {aprInputs.days}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-dollar-sign text-green-400"></i>
                    <p className="text-lg font-semibold">Initial Capital: ${aprInputs.principal}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-chart-line text-green-400"></i>
                    <p className="text-lg font-semibold">Earnings: ${aprResult.earnings}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-wallet text-green-400"></i>
                    <p className="text-lg font-semibold">Total: ${aprResult.total}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bagian Kanan: APY */}
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-bold text-green-400 flex items-center">
                <i className="fas fa-chart-line mr-2"></i> APY Calculator 📈
              </h2>
              <input
                type="number"
                placeholder="Initial Capital (USD)"
                value={apyInputs.principal}
                onChange={(e) =>
                  setApyInputs({ ...apyInputs, principal: e.target.value })
                }
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 transition duration-300"
              />
              <input
                type="number"
                placeholder="Days"
                value={apyInputs.days}
                onChange={(e) => setApyInputs({ ...apyInputs, days: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 transition duration-300"
              />
              <input
                type="number"
                placeholder="APY Rate (%)"
                value={apyInputs.rate}
                onChange={(e) => setApyInputs({ ...apyInputs, rate: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 transition duration-300"
              />
              <button
                onClick={calculateApy}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded transition duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-chart-bar"></i>
                <span>Calculate Earnings</span>
              </button>
              {apyResult && (
                <div className="space-y-2">
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-calendar-alt text-green-400"></i>
                    <p className="text-lg font-semibold">Days: {apyInputs.days}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-dollar-sign text-green-400"></i>
                    <p className="text-lg font-semibold">Initial Capital: ${apyInputs.principal}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-chart-line text-green-400"></i>
                    <p className="text-lg font-semibold">Earnings: ${apyResult.earnings}</p>
                  </div>
                  <div className="p-4 bg-gray-700 rounded flex items-center space-x-2">
                    <i className="fas fa-wallet text-green-400"></i>
                    <p className="text-lg font-semibold">Total: ${apyResult.total}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

  
    </div>
  );
}