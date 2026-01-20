'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { initialCards } from './initialCards';

export default function Content() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('live');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredCards = initialCards.filter((card) => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const liveCount = initialCards.filter(c => c.category === 'live').length;
  const endCount = initialCards.filter(c => c.category === 'end').length;

  return (
    <div
      className={`container mx-auto bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-12 border border-neutral-700 rounded-lg focus:outline-none focus:border-white bg-black text-white placeholder-neutral-500 transition-all duration-300"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories with counts */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('live')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 border flex items-center gap-2 ${selectedCategory === 'live'
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live
            <span className="text-xs opacity-60">({liveCount})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('end')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 border flex items-center gap-2 ${selectedCategory === 'end'
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
          >
            <span className="w-2 h-2 bg-neutral-500 rounded-full"></span>
            End
            <span className="text-xs opacity-60">({endCount})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-lg transition-all duration-300 border ${selectedCategory === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
          >
            All
            <span className="text-xs opacity-60 ml-2">({initialCards.length})</span>
          </button>
        </div>
      </div>

      {/* Cards with stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCards.length > 0 ? (
          filteredCards.map((card, index) => (
            <div
              key={card.id}
              className="transition-all duration-500"
              style={{
                transitionDelay: `${index * 50}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <Card
                title={card.title}
                href={card.href}
                icon={card.icon}
                thumbnail={card.thumbnail}
              />
            </div>
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