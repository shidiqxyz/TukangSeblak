'use client'; // Directive untuk client-side rendering

import { useState } from 'react';
import Card from './Card';
import { initialCards } from './initialCards'; // Impor data awal card

export default function Content() {
  // State untuk search query dan kategori terpilih
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fungsi untuk memfilter card
  const filteredCards = initialCards.filter((card) => {
    // Filter berdasarkan search query
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    // Filter berdasarkan kategori
    const matchesCategory =
      selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search airdrop... 🔍"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400 transition-all duration-300"
        />
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('live')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              selectedCategory === 'live'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Live 🟢
          </button>
          <button
            onClick={() => setSelectedCategory('end')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              selectedCategory === 'end'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            End 🔴
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              href={card.href} // Gunakan href dari data card
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No cards found. 😔
          </p>
        )}
      </div>
    </div>
  );
}