'use client';

import { useState } from 'react';

export default function AprApyCalculator() {
  const [aprInputs, setAprInputs] = useState({ principal: '', days: '', rate: '' });
  const [apyInputs, setApyInputs] = useState({ principal: '', days: '', rate: '' });
  const [aprResult, setAprResult] = useState(null);
  const [apyResult, setApyResult] = useState(null);

  const calculateApr = () => {
    const { principal, days, rate } = aprInputs;
    if (!principal || !days || !rate) return;
    const dailyRate = parseFloat(rate) / 100 / 365;
    const earnings = parseFloat(principal) * dailyRate * parseInt(days);
    const total = parseFloat(principal) + earnings;
    setAprResult({ earnings: earnings.toFixed(2), total: total.toFixed(2) });
  };

  const calculateApy = () => {
    const { principal, days, rate } = apyInputs;
    if (!principal || !days || !rate) return;
    const dailyRate = Math.pow(1 + parseFloat(rate) / 100 / 365, 365) - 1;
    const earnings = parseFloat(principal) * dailyRate * (parseInt(days) / 365);
    const total = parseFloat(principal) + earnings;
    setApyResult({ earnings: earnings.toFixed(2), total: total.toFixed(2) });
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-8">
      {/* Grid for APR and APY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* APR Calculator */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-white">
            APR Calculator
          </h2>
          <input
            type="number"
            placeholder="Initial Capital (USD)"
            value={aprInputs.principal}
            onChange={(e) =>
              setAprInputs({ ...aprInputs, principal: e.target.value })
            }
            className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition duration-300 text-white placeholder-neutral-500"
          />
          <input
            type="number"
            placeholder="Days"
            value={aprInputs.days}
            onChange={(e) => setAprInputs({ ...aprInputs, days: e.target.value })}
            className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition duration-300 text-white placeholder-neutral-500"
          />
          <input
            type="number"
            placeholder="APR Rate (%)"
            value={aprInputs.rate}
            onChange={(e) => setAprInputs({ ...aprInputs, rate: e.target.value })}
            className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition duration-300 text-white placeholder-neutral-500"
          />
          <button
            onClick={calculateApr}
            className="w-full border border-neutral-700 px-4 py-3 rounded-lg transition duration-300 hover:bg-white hover:text-black hover:border-white font-medium"
          >
            Calculate Earnings
          </button>
          {aprResult && (
            <div className="space-y-2">
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Days: <span className="text-white">{aprInputs.days}</span></p>
              </div>
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Initial Capital: <span className="text-white">${aprInputs.principal}</span></p>
              </div>
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Earnings: <span className="text-white">${aprResult.earnings}</span></p>
              </div>
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Total: <span className="text-white font-bold">${aprResult.total}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* APY Calculator */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-white">
            APY Calculator
          </h2>
          <input
            type="number"
            placeholder="Initial Capital (USD)"
            value={apyInputs.principal}
            onChange={(e) =>
              setApyInputs({ ...apyInputs, principal: e.target.value })
            }
            className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition duration-300 text-white placeholder-neutral-500"
          />
          <input
            type="number"
            placeholder="Days"
            value={apyInputs.days}
            onChange={(e) => setApyInputs({ ...apyInputs, days: e.target.value })}
            className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition duration-300 text-white placeholder-neutral-500"
          />
          <input
            type="number"
            placeholder="APY Rate (%)"
            value={apyInputs.rate}
            onChange={(e) => setApyInputs({ ...apyInputs, rate: e.target.value })}
            className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white transition duration-300 text-white placeholder-neutral-500"
          />
          <button
            onClick={calculateApy}
            className="w-full border border-neutral-700 px-4 py-3 rounded-lg transition duration-300 hover:bg-white hover:text-black hover:border-white font-medium"
          >
            Calculate Earnings
          </button>
          {apyResult && (
            <div className="space-y-2">
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Days: <span className="text-white">{apyInputs.days}</span></p>
              </div>
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Initial Capital: <span className="text-white">${apyInputs.principal}</span></p>
              </div>
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Earnings: <span className="text-white">${apyResult.earnings}</span></p>
              </div>
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">Total: <span className="text-white font-bold">${apyResult.total}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}