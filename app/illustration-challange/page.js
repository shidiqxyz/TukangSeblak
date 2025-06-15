'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Import JSON directly from project root (ensure data.json is in the src or root and configured for import)
import dataFile from './data.json';

export default function HashtagIdeaExplorer() {
  const [tags, setTags] = useState([]);
  const [dataJson, setDataJson] = useState({ general: [], character: [] });
  const [dailyMotivation, setDailyMotivation] = useState('');

  useEffect(() => {
    // Directly load from imported JSON
    const { general = [], character = [] } = dataFile;
    setDataJson({ general, character });

    // Daily motivation logic
    const motivasiAnimeUwu = [
      "Ganbatte ne~! 💪✨ You got this, just like an anime MC who never gives up! 🌸",
      "Yatta! 🎉 One more step toward your dream, keep going~ (≧◡≦) 💖",
      "UwU~ Don't forget to have fun while drawing, okay? 🎨✨",
      "Today is part of an important *arc* in your life~ Don’t skip it~ (｡•̀ᴗ-)✧",
      "Ganbatte! You're the protagonist of your own story—never give up! 🌸📖",
      "Fighto~! Your inner power is just waiting to awaken! 💥💫",
      "Uwaah~ You're doing great already! Just like a hero in training~ 🏃‍♂️🌟",
      "Even small steps make a journey—take your time, senpai~ 🚶‍♀️🍃",
      "Don't be sad, your sparkle hasn't faded~ it's just charging up! ✨(╥﹏╥)",
      "You're not alone, your nakama believe in you too! 🤝💖",
      "Kyaa~ So cool! You're leveling up like an RPG hero! 🗡️📈",
      "If today’s hard, tomorrow is your redemption episode~ hang in there! 🌙🎬",
      "You're shining brighter than a thousand sakura petals~ 🌸(｡♥‿♥｡)",
      "Keep drawing, even messy sketches are part of the magic~ ✍️💞",
      "Nya~! Every mistake is just EXP~ you're grinding IRL! 🐾🎮",
      "Don't worry if it's slow... even Goku needed training arcs! 💪🔥",
      "Your smile is your ultimate weapon! Use it wisely~ 😁🌈",
      "Take a deep breath~ You're in the calm before the climax~ 😌🎵",
      "Never forget... your story matters, and it's worth watching till the end! 📺✨"
    ];
    const today = new Date().toLocaleDateString();
    const hash = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const idx = hash % motivasiAnimeUwu.length;
    setDailyMotivation(motivasiAnimeUwu[idx]);
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
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-1 py-10 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Hashtag Idea Explorer</h1>
          <div className="flex justify-center mb-6">
            <button
              onClick={generateTags}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Generate Tags
            </button>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {tags.map((tag, idx) => (
              <div
                key={idx}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 flex items-center space-x-2 shadow"
              >
                <span className="text-white font-medium">#{tag.label}</span>
                <button
                  onClick={() => shuffleTag(idx)}
                  className="text-gray-400 hover:text-white"
                  title={`Shuffle ${tag.category}`}
                >
                  🔄
                </button>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <h2 className="text-xl font-semibold text-pink-400 mb-2">✨ Daily Motivation ✨</h2>
            <p className="text-gray-300 italic">{dailyMotivation}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
