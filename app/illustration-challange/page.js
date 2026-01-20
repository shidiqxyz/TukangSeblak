'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dataFile from './data.json';

export default function HashtagIdeaExplorer() {
  const [tags, setTags] = useState([]);
  const [dataJson, setDataJson] = useState({ general: [], character: [] });
  const [dailyMotivation, setDailyMotivation] = useState('');

  useEffect(() => {
    if (dataFile && typeof dataFile === 'object') {
      const { general = [], character = [] } = dataFile;
      setDataJson({ general, character });
    }

    const motivations = [
      "Keep pushing forward. Progress is progress, no matter how small.",
      "One step at a time. Consistency beats intensity.",
      "Your creative journey is unique. Embrace it.",
      "Today's effort becomes tomorrow's skill.",
      "Start where you are. Use what you have. Do what you can.",
      "The only way to do great work is to love what you do.",
      "Every expert was once a beginner.",
      "Small daily improvements lead to remarkable results.",
      "Create something today, even if it's imperfect.",
      "Your potential is limitless. Keep exploring.",
    ];
    const today = new Date().toLocaleDateString();
    const hash = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const idx = hash % motivations.length;
    setDailyMotivation(motivations[idx]);
  }, []);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateTags = () => {
    const { general, character } = dataJson;
    if (!general.length || !character.length) return;

    const generalTags = shuffleArray(general)
      .slice(0, 10)
      .map((label) => ({ category: 'general', label }));

    const characterTag = {
      category: 'character',
      label: character[Math.floor(Math.random() * character.length)],
    };

    setTags([...generalTags, characterTag]);
  };

  const shuffleTag = (index) => {
    setTags((prev) => {
      const newTags = [...prev];
      const { category } = newTags[index];
      if (category === 'general') {
        const used = prev.map((t) => t.label);
        const remaining = dataJson.general.filter((item) => !used.includes(item));
        if (remaining.length) {
          newTags[index].label = remaining[Math.floor(Math.random() * remaining.length)];
        }
      } else if (category === 'character') {
        newTags[index].label =
          dataJson.character[Math.floor(Math.random() * dataJson.character.length)];
      }
      return newTags;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Hashtag Idea Explorer</h1>
          <div className="flex justify-center mb-6">
            <button
              onClick={generateTags}
              className="border border-neutral-700 text-white px-6 py-2 rounded-lg transition hover:bg-white hover:text-black hover:border-white font-medium"
            >
              Generate Tags
            </button>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {tags.map((tag, idx) => (
              <div
                key={idx}
                className="bg-black border border-neutral-700 rounded px-3 py-1 flex items-center space-x-2"
              >
                <span className="text-white font-medium">#{tag.label}</span>
                <button
                  onClick={() => shuffleTag(idx)}
                  className="text-neutral-500 hover:text-white transition"
                  title={`Shuffle ${tag.category}`}
                >
                  ↻
                </button>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center border-t border-neutral-800 pt-6">
            <h2 className="text-xl font-medium text-white mb-2">Daily Motivation</h2>
            <p className="text-neutral-400 italic">{dailyMotivation}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
