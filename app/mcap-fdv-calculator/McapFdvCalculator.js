'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function McapFdvCalculator() {
  const [mcapInputs, setMcapInputs] = useState({
    price: '',
    circulatingSupply: '',
    marketCap: '',
  });
  const [fdvInputs, setFdvInputs] = useState({
    price: '',
    totalSupply: '',
    fdv: '',
  });
  const [results, setResults] = useState({
    mcapResult: null,
    fdvResult: null,
  });

  const formatNumber = (number) => {
    if (!number) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(number);
  };

  const formatInputNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value) => {
    return value.replace(/[^0-9.]/g, '');
  };

  const calculateMcapValues = () => {
    const price = parseFloat(parseNumber(mcapInputs.price));
    const circulatingSupply = parseFloat(parseNumber(mcapInputs.circulatingSupply));
    const marketCap = parseFloat(parseNumber(mcapInputs.marketCap));

    let computedPrice = price;
    let computedCirculatingSupply = circulatingSupply;
    let computedMarketCap = marketCap;

    if (!price && marketCap && circulatingSupply) {
      computedPrice = marketCap / circulatingSupply;
    }
    if (!circulatingSupply && marketCap && price) {
      computedCirculatingSupply = marketCap / price;
    }
    if (!marketCap && price && circulatingSupply) {
      computedMarketCap = price * circulatingSupply;
    }
    return {
      price: computedPrice ? formatInputNumber(formatNumber(computedPrice)) : null,
      circulatingSupply: computedCirculatingSupply ? formatInputNumber(formatNumber(computedCirculatingSupply)) : null,
      marketCap: computedMarketCap ? formatInputNumber(formatNumber(computedMarketCap)) : null,
    };
  };

  const calculateFdvValues = () => {
    const price = parseFloat(parseNumber(fdvInputs.price));
    const totalSupply = parseFloat(parseNumber(fdvInputs.totalSupply));
    const fdv = parseFloat(parseNumber(fdvInputs.fdv));

    let computedPrice = price;
    let computedTotalSupply = totalSupply;
    let computedFdv = fdv;

    if (!price && fdv && totalSupply) {
      computedPrice = fdv / totalSupply;
    }
    if (!totalSupply && fdv && price) {
      computedTotalSupply = fdv / price;
    }
    if (!fdv && price && totalSupply) {
      computedFdv = price * totalSupply;
    }
    return {
      price: computedPrice ? formatInputNumber(formatNumber(computedPrice)) : null,
      totalSupply: computedTotalSupply ? formatInputNumber(formatNumber(computedTotalSupply)) : null,
      fdv: computedFdv ? formatInputNumber(formatNumber(computedFdv)) : null,
    };
  };

  const handleMcapSubmit = () => {
    setResults({ ...results, mcapResult: calculateMcapValues() });
  };

  const handleFdvSubmit = () => {
    setResults({ ...results, fdvResult: calculateFdvValues() });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow p-6 mx-auto max-w-7xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          MCAP & FDV Calculator
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MCAP Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white">Market Cap (MCAP)</h2>
            <input
              type="text"
              placeholder="Token Price (USD)"
              value={formatInputNumber(mcapInputs.price)}
              onChange={(e) =>
                setMcapInputs({ ...mcapInputs, price: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
            />
            <input
              type="text"
              placeholder="Circulating Supply"
              value={formatInputNumber(mcapInputs.circulatingSupply)}
              onChange={(e) =>
                setMcapInputs({ ...mcapInputs, circulatingSupply: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
            />
            <input
              type="text"
              placeholder="Market Cap"
              value={formatInputNumber(mcapInputs.marketCap)}
              onChange={(e) =>
                setMcapInputs({ ...mcapInputs, marketCap: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
            />
            <button
              onClick={handleMcapSubmit}
              className="w-full border border-neutral-700 text-white font-medium py-3 px-6 rounded-lg transition hover:bg-white hover:text-black hover:border-white"
            >
              Calculate MCAP
            </button>
            {results.mcapResult && (
              <div className="mt-4 space-y-2">
                {results.mcapResult.price && (
                  <p className="text-neutral-400">Token Price: <span className="text-white">${results.mcapResult.price}</span></p>
                )}
                {results.mcapResult.circulatingSupply && (
                  <p className="text-neutral-400">Circulating Supply: <span className="text-white">{results.mcapResult.circulatingSupply}</span></p>
                )}
                {results.mcapResult.marketCap && (
                  <p className="text-neutral-400">Market Cap: <span className="text-white font-bold">${results.mcapResult.marketCap}</span></p>
                )}
              </div>
            )}
          </div>

          {/* FDV Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white">Fully Diluted Valuation (FDV)</h2>
            <input
              type="text"
              placeholder="Token Price (USD)"
              value={formatInputNumber(fdvInputs.price)}
              onChange={(e) =>
                setFdvInputs({ ...fdvInputs, price: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
            />
            <input
              type="text"
              placeholder="Total Supply"
              value={formatInputNumber(fdvInputs.totalSupply)}
              onChange={(e) =>
                setFdvInputs({ ...fdvInputs, totalSupply: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
            />
            <input
              type="text"
              placeholder="FDV"
              value={formatInputNumber(fdvInputs.fdv)}
              onChange={(e) =>
                setFdvInputs({ ...fdvInputs, fdv: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-neutral-500"
            />
            <button
              onClick={handleFdvSubmit}
              className="w-full border border-neutral-700 text-white font-medium py-3 px-6 rounded-lg transition hover:bg-white hover:text-black hover:border-white"
            >
              Calculate FDV
            </button>
            {results.fdvResult && (
              <div className="mt-4 space-y-2">
                {results.fdvResult.price && (
                  <p className="text-neutral-400">Token Price: <span className="text-white">${results.fdvResult.price}</span></p>
                )}
                {results.fdvResult.totalSupply && (
                  <p className="text-neutral-400">Total Supply: <span className="text-white">{results.fdvResult.totalSupply}</span></p>
                )}
                {results.fdvResult.fdv && (
                  <p className="text-neutral-400">FDV: <span className="text-white font-bold">${results.fdvResult.fdv}</span></p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
