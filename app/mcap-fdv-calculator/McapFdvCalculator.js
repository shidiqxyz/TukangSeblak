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

  // Format angka dengan koma
  const formatNumber = (number) => {
    if (!number) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(number);
  };

  // Format input angka dengan koma
  const formatInputNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Parsing input angka (hanya angka dan titik)
  const parseNumber = (value) => {
    return value.replace(/[^0-9.]/g, '');
  };

  // Perhitungan MCAP (menghasilkan 3 output: price, circulatingSupply, marketCap)
  const calculateMcapValues = () => {
    const price = parseFloat(parseNumber(mcapInputs.price));
    const circulatingSupply = parseFloat(parseNumber(mcapInputs.circulatingSupply));
    const marketCap = parseFloat(parseNumber(mcapInputs.marketCap));

    let computedPrice = price;
    let computedCirculatingSupply = circulatingSupply;
    let computedMarketCap = marketCap;

    // Jika price tidak diisi, hitung dari marketCap dan circulatingSupply
    if (!price && marketCap && circulatingSupply) {
      computedPrice = marketCap / circulatingSupply;
    }
    // Jika circulatingSupply tidak diisi, hitung dari marketCap dan price
    if (!circulatingSupply && marketCap && price) {
      computedCirculatingSupply = marketCap / price;
    }
    // Jika marketCap tidak diisi, hitung dari price dan circulatingSupply
    if (!marketCap && price && circulatingSupply) {
      computedMarketCap = price * circulatingSupply;
    }
    return {
      price: computedPrice ? formatInputNumber(formatNumber(computedPrice)) : null,
      circulatingSupply: computedCirculatingSupply ? formatInputNumber(formatNumber(computedCirculatingSupply)) : null,
      marketCap: computedMarketCap ? formatInputNumber(formatNumber(computedMarketCap)) : null,
    };
  };

  // Perhitungan FDV (menghasilkan 3 output: price, totalSupply, fdv)
  const calculateFdvValues = () => {
    const price = parseFloat(parseNumber(fdvInputs.price));
    const totalSupply = parseFloat(parseNumber(fdvInputs.totalSupply));
    const fdv = parseFloat(parseNumber(fdvInputs.fdv));

    let computedPrice = price;
    let computedTotalSupply = totalSupply;
    let computedFdv = fdv;

    // Jika price tidak diisi, hitung dari fdv dan totalSupply
    if (!price && fdv && totalSupply) {
      computedPrice = fdv / totalSupply;
    }
    // Jika totalSupply tidak diisi, hitung dari fdv dan price
    if (!totalSupply && fdv && price) {
      computedTotalSupply = fdv / price;
    }
    // Jika fdv tidak diisi, hitung dari price dan totalSupply
    if (!fdv && price && totalSupply) {
      computedFdv = price * totalSupply;
    }
    return {
      price: computedPrice ? formatInputNumber(formatNumber(computedPrice)) : null,
      totalSupply: computedTotalSupply ? formatInputNumber(formatNumber(computedTotalSupply)) : null,
      fdv: computedFdv ? formatInputNumber(formatNumber(computedFdv)) : null,
    };
  };

  // Handler untuk tombol MCAP
  const handleMcapSubmit = () => {
    setResults({ ...results, mcapResult: calculateMcapValues() });
  };

  // Handler untuk tombol FDV
  const handleFdvSubmit = () => {
    setResults({ ...results, fdvResult: calculateFdvValues() });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-6 mx-auto rounded-lg shadow-lg max-w-7xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          MCAP & FDV Calculator 🧮
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MCAP Section */}
          <div className="bg-gray-700 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Market Cap (MCAP) 📊</h2>
            <input
              type="text"
              placeholder="Token Price (USD) 💵"
              value={formatInputNumber(mcapInputs.price)}
              onChange={(e) =>
                setMcapInputs({ ...mcapInputs, price: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="Circulating Supply 🔄"
              value={formatInputNumber(mcapInputs.circulatingSupply)}
              onChange={(e) =>
                setMcapInputs({ ...mcapInputs, circulatingSupply: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="Market Cap 📈"
              value={formatInputNumber(mcapInputs.marketCap)}
              onChange={(e) =>
                setMcapInputs({ ...mcapInputs, marketCap: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none"
            />
            <button
              onClick={handleMcapSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded transition"
            >
              Calculate MCAP 🧮
            </button>
            {results.mcapResult && (
              <div className="mt-4 space-y-2">
                {results.mcapResult.price && (
                  <p className="text-lg font-semibold">
                    Token Price: 💵 ${results.mcapResult.price}
                  </p>
                )}
                {results.mcapResult.circulatingSupply && (
                  <p className="text-lg font-semibold">
                    Circulating Supply: 🔄 {results.mcapResult.circulatingSupply}
                  </p>
                )}
                {results.mcapResult.marketCap && (
                  <p className="text-lg font-semibold">
                    Market Cap: 📊 ${results.mcapResult.marketCap}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* FDV Section */}
          <div className="bg-gray-700 rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Fully Diluted Valuation (FDV) 💰</h2>
            <input
              type="text"
              placeholder="Token Price (USD) 💵"
              value={formatInputNumber(fdvInputs.price)}
              onChange={(e) =>
                setFdvInputs({ ...fdvInputs, price: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="Total Supply 🔢"
              value={formatInputNumber(fdvInputs.totalSupply)}
              onChange={(e) =>
                setFdvInputs({ ...fdvInputs, totalSupply: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="FDV 💸"
              value={formatInputNumber(fdvInputs.fdv)}
              onChange={(e) =>
                setFdvInputs({ ...fdvInputs, fdv: parseNumber(e.target.value) })
              }
              className="w-full p-3 bg-gray-600 border border-gray-500 rounded focus:outline-none"
            />
            <button
              onClick={handleFdvSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition"
            >
              Calculate FDV 🧮
            </button>
            {results.fdvResult && (
              <div className="mt-4 space-y-2">
                {results.fdvResult.price && (
                  <p className="text-lg font-semibold">
                    Token Price: 💵 ${results.fdvResult.price}
                  </p>
                )}
                {results.fdvResult.totalSupply && (
                  <p className="text-lg font-semibold">
                    Total Supply: 🔢 {results.fdvResult.totalSupply}
                  </p>
                )}
                {results.fdvResult.fdv && (
                  <p className="text-lg font-semibold">
                    FDV: 💸 ${results.fdvResult.fdv}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
