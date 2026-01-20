'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RandomAnime() {
  const [anime, setAnime] = useState(null);
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const [previousAnimes, setPreviousAnimes] = useState([]);
  const [savedAnimes, setSavedAnimes] = useState([]);
  const [showNsfwButton, setShowNsfwButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const itemsPerPage = 4;
  const [prevPage, setPrevPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);

  useEffect(() => {
    const loadState = () => {
      setPreviousAnimes(loadFromStorage('previousAnimes'));
      setSavedAnimes(loadFromStorage('savedAnimes'));
    };

    loadState();
    getRandomAnime();
  }, []);

  const loadFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading from storage:', error);
      return [];
    }
  };

  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const getRandomAnime = async () => {
    try {
      const response = await fetch('https://api.jikan.moe/v4/random/anime');
      const data = await response.json();
      const randomAnime = data.data;

      const isNSFW = ['Rx - Hentai', 'R+ - Mild Nudity'].includes(randomAnime.rating);

      if (isNSFW && !nsfwEnabled) {
        alert('NSFW content detected. Enable NSFW filter to view.');
        return;
      }

      setAnime(randomAnime);
      updatePreviousAnimes(randomAnime);
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
  };

  const updatePreviousAnimes = (anime) => {
    const newHistory = [...previousAnimes, anime];
    setPreviousAnimes(newHistory);
    saveToStorage('previousAnimes', newHistory);
  };

  const handleSaveAnime = () => {
    if (!anime || savedAnimes.some(saved => saved.mal_id === anime.mal_id)) {
      alert('Anime already saved!');
      return;
    }

    const newSaved = [...savedAnimes, anime];
    setSavedAnimes(newSaved);
    saveToStorage('savedAnimes', newSaved);
  };

  const handleRemovePrevious = (mal_id) => {
    const updated = previousAnimes.filter(item => item.mal_id !== mal_id);
    setPreviousAnimes(updated);
    saveToStorage('previousAnimes', updated);
  };

  const handleRemoveSaved = (mal_id) => {
    const updated = savedAnimes.filter(item => item.mal_id !== mal_id);
    setSavedAnimes(updated);
    saveToStorage('savedAnimes', updated);
  };

  const handleHeaderClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 10) {
        setShowNsfwButton(true);
        alert('Secret NSFW button unlocked!');
      }
      return newCount;
    });
  };

  const toggleNsfw = () => {
    setNsfwEnabled(prev => {
      const newState = !prev;
      alert(newState ? 'NSFW enabled' : 'NSFW disabled');
      return newState;
    });
  };

  const paginatedPrevious = previousAnimes.slice(
    (prevPage - 1) * itemsPerPage,
    prevPage * itemsPerPage
  );

  const paginatedSaved = savedAnimes.slice(
    (savedPage - 1) * itemsPerPage,
    savedPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 md:grid-cols-[70%_30%] gap-6">
        <div className="space-y-6">
          <h1
            className="text-3xl font-bold text-center md:text-left my-6 cursor-pointer hover:text-neutral-400 transition"
            onClick={handleHeaderClick}
          >
            Random Anime Picker
          </h1>

          {showNsfwButton && (
            <button
              className={`mb-4 block mx-auto md:mx-0 px-4 py-2 rounded-lg border transition ${nsfwEnabled ? 'bg-white text-black border-white' : 'border-neutral-700 hover:border-white'
                }`}
              onClick={toggleNsfw}
            >
              {nsfwEnabled ? 'NSFW Enabled' : 'NSFW Disabled'}
            </button>
          )}

          <button
            className="w-full py-3 px-6 rounded-lg text-lg font-medium border border-neutral-700 transition hover:bg-white hover:text-black hover:border-white mb-4"
            onClick={getRandomAnime}
          >
            Get Random Anime
          </button>

          {anime && (
            <div className="anime-card bg-neutral-900 border border-neutral-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-[30%_70%] gap-4">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">{anime.title}</h2>
                <p className="text-neutral-400 line-clamp-3">{anime.synopsis || 'No synopsis available'}</p>

                <div className="grid grid-cols-2 gap-4 text-neutral-400">
                  <div>Genre: {anime.genres.map(g => g.name).join(', ')}</div>
                  <div>Score: {anime.score || 'N/A'}</div>
                  <div>Episodes: {anime.episodes || 'N/A'}</div>
                  <div>Status: {anime.status}</div>
                </div>

                <button
                  className="border border-neutral-700 text-white px-4 py-2 rounded-lg transition hover:bg-white hover:text-black hover:border-white"
                  onClick={handleSaveAnime}
                >
                  Save Anime
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-hidden">
            <h3 className="text-lg font-bold mb-4 text-white">Previously Viewed</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {paginatedPrevious.length > 0 ? (
                paginatedPrevious.map((anime) => (
                  <div key={anime.mal_id} className="bg-black border border-neutral-800 p-2 rounded flex justify-between items-center">
                    <span className="truncate text-neutral-400">{anime.title}</span>
                    <button
                      className="text-neutral-500 hover:text-white ml-2"
                      onClick={() => handleRemovePrevious(anime.mal_id)}
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">No previous animes</p>
              )}
            </div>
            <Pagination
              currentPage={prevPage}
              totalPages={Math.ceil(previousAnimes.length / itemsPerPage)}
              onPageChange={setPrevPage}
            />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-hidden">
            <h3 className="text-lg font-bold mb-4 text-white">Saved Anime</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {paginatedSaved.length > 0 ? (
                paginatedSaved.map((anime) => (
                  <div key={anime.mal_id} className="bg-black border border-neutral-800 p-2 rounded flex justify-between items-center">
                    <span className="truncate text-neutral-400">{anime.title}</span>
                    <button
                      className="text-neutral-500 hover:text-white ml-2"
                      onClick={() => handleRemoveSaved(anime.mal_id)}
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">No saved animes</p>
              )}
            </div>
            <Pagination
              currentPage={savedPage}
              totalPages={Math.ceil(savedAnimes.length / itemsPerPage)}
              onPageChange={setSavedPage}
            />
          </div>
        </div>
      </main>

      <Footer className="mt-auto" />
    </div>
  );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-between items-center mt-4">
    <button
      className="border border-neutral-700 text-white px-3 py-1 rounded disabled:opacity-50 hover:border-white transition"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span className="text-neutral-500">
      Page {currentPage} of {totalPages}
    </span>
    <button
      className="border border-neutral-700 text-white px-3 py-1 rounded disabled:opacity-50 hover:border-white transition"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
);