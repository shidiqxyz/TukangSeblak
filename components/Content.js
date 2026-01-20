'use client'; // Directive untuk client-side rendering

import { useState } from 'react';
import Card from './Card';
import { initialCards } from './initialCards'; // Impor data awal card

export default function Content() {
  // State untuk search query dan kategori terpilih
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('live');

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
    <div className="container mx-auto bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-8">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 border border-neutral-700 rounded-lg focus:outline-none focus:border-white bg-black text-white placeholder-neutral-500 transition-all duration-300"
        />
      </div>

      {/* Categories - Order: Live, End, All */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedCategory('live')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 border ${selectedCategory === 'live'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
          >
            Live
          </button>
          <button
            onClick={() => setSelectedCategory('end')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 border ${selectedCategory === 'end'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
          >
            End
          </button>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 border ${selectedCategory === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
          >
            All
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
          <p className="col-span-full text-center text-neutral-500">
            No tools found.
          </p>
        )}
      </div>
    </div>
  );
}