'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RandomAnime() {
  const [anime, setAnime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedAnimes, setSavedAnimes] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const [hentaiMode, setHentaiMode] = useState(false);
  const [showNsfwButton, setShowNsfwButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    setSavedAnimes(loadFromStorage('savedAnimes'));
  }, []);

  const loadFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const getRandomAnime = async () => {
    setIsLoading(true);
    setIsRevealing(false);

    try {
      const response = await fetch('https://api.jikan.moe/v4/random/anime');
      const data = await response.json();
      const randomAnime = data.data;

      const isNSFW = ['Rx - Hentai', 'R+ - Mild Nudity'].includes(randomAnime.rating);
      if (isNSFW && !nsfwEnabled) {
        setTimeout(() => getRandomAnime(), 300);
        return;
      }

      setTimeout(() => {
        setAnime(randomAnime);
        setIsLoading(false);
        setIsRevealing(true);
      }, 800);

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const getRandomHentai = async () => {
    setIsLoading(true);
    setIsRevealing(false);

    try {
      // Get a random page from hentai list (rx rating)
      const randomPage = Math.floor(Math.random() * 100) + 1;
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?rating=rx&page=${randomPage}&limit=25&sfw=false`
      );

      // Check for rate limiting
      if (response.status === 429) {
        console.log('Rate limited, waiting...');
        setTimeout(() => getRandomHentai(), 2000);
        return;
      }

      const data = await response.json();

      // If no results or empty page, try a lower page number
      if (!data?.data?.length) {
        const fallbackPage = Math.floor(Math.random() * 20) + 1;
        const fallbackResponse = await fetch(
          `https://api.jikan.moe/v4/anime?rating=rx&page=${fallbackPage}&limit=25&sfw=false`
        );
        const fallbackData = await fallbackResponse.json();

        if (fallbackData?.data?.length > 0) {
          const randomIndex = Math.floor(Math.random() * fallbackData.data.length);
          const randomAnime = fallbackData.data[randomIndex];

          setTimeout(() => {
            setAnime(randomAnime);
            setIsLoading(false);
            setIsRevealing(true);
          }, 500);
          return;
        }

        setTimeout(() => getRandomHentai(), 1000);
        return;
      }

      // Pick a random anime from the results
      const randomIndex = Math.floor(Math.random() * data.data.length);
      const randomAnime = data.data[randomIndex];

      setTimeout(() => {
        setAnime(randomAnime);
        setIsLoading(false);
        setIsRevealing(true);
      }, 500);

    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => getRandomHentai(), 1500);
    }
  };

  const handleSaveAnime = () => {
    if (!anime || savedAnimes.some(s => s.mal_id === anime.mal_id)) return;
    const newSaved = [...savedAnimes, anime];
    setSavedAnimes(newSaved);
    saveToStorage('savedAnimes', newSaved);
  };

  const handleRemoveSaved = (mal_id) => {
    const updated = savedAnimes.filter(i => i.mal_id !== mal_id);
    setSavedAnimes(updated);
    saveToStorage('savedAnimes', updated);
  };

  const handleTitleClick = () => {
    setClickCount(prev => {
      if (prev + 1 >= 10) setShowNsfwButton(true);
      return prev + 1;
    });
  };

  const isAnimeSaved = anime && savedAnimes.some(s => s.mal_id === anime.mal_id);

  const getScoreColor = (score) => {
    if (!score) return '#555';
    if (score >= 8) return '#c9a962';
    if (score >= 7) return '#6b9b7a';
    if (score >= 6) return '#6b8bb8';
    return '#777';
  };

  return (
    <div className="cinematic-container">
      {/* Backdrop */}
      <div
        className="cinematic-backdrop"
        style={{
          backgroundImage: anime ? `url(${anime.images.jpg.large_image_url})` : 'none'
        }}
      />
      <div className="cinematic-overlay" />
      <div className="cinematic-vignette" />

      {/* Navigation */}
      <nav className="cinematic-nav">
        <Link href="/" className="nav-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Link>
        <h1
          className="nav-title cursor-pointer select-none"
          onClick={handleTitleClick}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
          </svg>
          Anime Randomizer
        </h1>
        <div className="nav-actions">
          {showNsfwButton && (
            <>
              <button
                className={`nav-btn ${nsfwEnabled ? 'active' : ''}`}
                onClick={() => setNsfwEnabled(!nsfwEnabled)}
              >
                {nsfwEnabled ? 'R18' : '18+'}
              </button>
              <button
                className={`nav-btn ${hentaiMode ? 'hentai-active' : 'hentai'}`}
                onClick={() => setHentaiMode(!hentaiMode)}
              >
                H
              </button>
            </>
          )}
          <button
            className="nav-btn"
            onClick={() => setShowSaved(!showSaved)}
          >
            <span className="saved-count">{savedAnimes.length}</span>
            <span>Saved</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="cinematic-main">
        {/* Loading State */}
        {isLoading && (
          <div className="cinematic-loading">
            <div className="loading-spinner">
              <div className="spinner-ring" />
            </div>
            <p>Discovering</p>
          </div>
        )}

        {/* Empty State */}
        {!anime && !isLoading && (
          <div className="cinematic-empty">
            <h2>Find Your Next Obsession</h2>
            <p>One click to explore thousands of anime</p>
          </div>
        )}

        {/* Anime Display */}
        {anime && !isLoading && (
          <div className={`cinematic-content ${isRevealing ? 'reveal' : ''}`}>
            {/* Poster */}
            <div className="cinematic-poster">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
              />
              <div className="poster-frame" />
            </div>

            {/* Info Panel */}
            <div className="cinematic-info">
              {/* Title Block */}
              <div className="title-block">
                <span className="title-label">Title</span>
                <h1 className="anime-title">{anime.title}</h1>
                {anime.title_japanese && (
                  <p className="anime-title-jp">{anime.title_japanese}</p>
                )}
              </div>

              {/* Stats Row */}
              <div className="stats-row">
                <div className="stat-item featured">
                  <span className="stat-value" style={{ color: getScoreColor(anime.score) }}>
                    {anime.score || '—'}
                  </span>
                  <span className="stat-label">Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{anime.episodes || '—'}</span>
                  <span className="stat-label">Episodes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{anime.year || '—'}</span>
                  <span className="stat-label">Year</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{anime.type || '—'}</span>
                  <span className="stat-label">Format</span>
                </div>
              </div>

              {/* Genres */}
              {anime.genres.length > 0 && (
                <div className="genres-section">
                  <span className="section-label">Genres</span>
                  <div className="genres-row">
                    {anime.genres.slice(0, 4).map(g => (
                      <span key={g.mal_id} className="genre-tag">{g.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              <div className="synopsis-section">
                <span className="section-label">Synopsis</span>
                <p className="synopsis-text">
                  {anime.synopsis || 'No synopsis available for this title.'}
                </p>
              </div>

              {/* Meta Info */}
              <div className="meta-row">
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className="meta-value">{anime.status}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Studios</span>
                  <span className="meta-value">
                    {anime.studios?.map(s => s.name).join(', ') || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-row">
                <a
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cine-btn primary"
                >
                  View on MAL
                </a>
                <button
                  className={`cine-btn ${isAnimeSaved ? 'saved' : 'secondary'}`}
                  onClick={handleSaveAnime}
                  disabled={isAnimeSaved}
                >
                  {isAnimeSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Discover Button */}
      <div className="cinematic-discover">
        <button
          className={`discover-btn ${isLoading ? 'loading' : ''} ${hentaiMode ? 'hentai-mode' : ''}`}
          onClick={hentaiMode ? getRandomHentai : getRandomAnime}
          disabled={isLoading}
        >
          <span className="discover-text">
            {isLoading ? 'Discovering' : hentaiMode ? (anime ? 'Next H' : 'H Mode') : (anime ? 'Next' : 'Discover')}
          </span>
          <svg className="discover-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Saved Drawer */}
      <div className={`saved-drawer ${showSaved ? 'open' : ''}`}>
        <div className="drawer-header">
          <div>
            <h3>Saved</h3>
            <span className="drawer-count">{savedAnimes.length} titles</span>
          </div>
          <button className="drawer-close" onClick={() => setShowSaved(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="drawer-content">
          {savedAnimes.length > 0 ? (
            savedAnimes.map((item) => (
              <div key={item.mal_id} className={`drawer-item ${anime?.mal_id === item.mal_id ? 'active' : ''}`}>
                <div
                  className="drawer-item-clickable"
                  onClick={() => {
                    setAnime(item);
                    setIsRevealing(true);
                    setShowSaved(false);
                  }}
                >
                  <img src={item.images.jpg.small_image_url} alt={item.title} />
                  <div className="drawer-item-info">
                    <span className="drawer-item-title">{item.title}</span>
                    <span className="drawer-item-meta">{item.type} · {item.score || '—'}</span>
                  </div>
                </div>
                <button
                  className="drawer-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSaved(item.mal_id);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="drawer-empty">
              <p>No saved anime</p>
              <span>Save titles to view them here</span>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      {showSaved && (
        <div className="drawer-overlay" onClick={() => setShowSaved(false)} />
      )}
    </div>
  );
}