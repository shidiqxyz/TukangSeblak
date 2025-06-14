'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categories = {
  character: [
    "High school girl", "Magical girl", "Shy transfer student", "Delinquent boy", "Kendo club ace",
    "Cheerful childhood friend", "Kuudere sniper", "Yandere nurse", "Chuunibyou boy", "Tomboy mechanic",
    "Traditional shrine maiden", "Android classmate", "Virtual idol", "Space bounty hunter", "Elf archer",
    "Knight in armor", "Modern witch", "Fox spirit (kitsune)", "Vampire noble", "Street samurai",
    "Lonely librarian", "Overconfident gamer", "Battle-scarred soldier", "Alien exchange student",
    "Fashion model", "Zombie idol", "Dragon tamer", "Hero from another world", "Catgirl barista",
    "Mysterious wanderer", "Mecha pilot", "Ghost in a school uniform", "Rebellious prince/princess"
  ],

  location: [
    "Crowded train station", "Dim-lit café", "Japanese school festival", "Library with floating books",
    "Futuristic metropolis", "Abandoned theme park", "Cherry blossom park", "Steamy onsen bath",
    "Tatami-floored room", "Floating islands in the sky", "Moonlit lake", "Clocktower overlooking the city",
    "Festival street at night", "Rainy convenience store", "Sacred mountain shrine",
    "Dungeon with glowing crystals", "Rooftop garden", "Suburban alleyway", "Underground lab",
    "Post-apocalyptic city ruins", "Winding bamboo forest", "Digital world", "Cyberpunk district",
    "Mystical forest glade", "RPG-style town square", "Train running through snow", "Sky harbor for airships"
  ],

  expression: [
    "Smiling softly", "Crying with joy", "Eyes full of sorrow", "Shouting in rage", "Laughing nervously",
    "Deadpan stare", "Eyes wide in shock", "Cheeks puffed in frustration", "Winking playfully",
    "Eyes glowing with power", "Blushing intensely", "Sweating nervously", "Tears streaming down face",
    "Screaming in despair", "Dazed or hypnotized", "Sleepy eyes", "Sneering smugly",
    "Gritting teeth", "Panicking", "Looking away shyly", "Heart-shaped pupils", "Lost in thought",
    "Crying while smiling", "Fake smile hiding sadness", "Eyes sparkling with admiration"
  ],

  weather: [
    "Heavy rain with thunder", "Gentle snowfall", "Golden hour light", "Mist rolling over hills",
    "Cloudless sunny day", "Snowstorm with howling wind", "Lightning in the distance",
    "Drizzle on umbrella", "Wind blowing cherry blossoms", "Red sky before storm",
    "Star-filled sky", "Rainbow after rain", "Thick fog", "Glowing moonlight", "Burning sunset",
    "Sky filled with meteors", "Sudden downpour", "Blue sky with floating clouds",
    "Stormy night", "Warm morning haze"
  ],

  time: [
    "5 AM sunrise jog", "School lunch break", "After-school cleanup duty", "Evening club meeting",
    "Late-night stargazing", "Fireworks festival night", "Just before final battle", "Afternoon tea",
    "First snow of the year", "Midnight during exam week", "Noon at summer camp",
    "Twilight walk home", "Dawn before the journey", "Moment time stops", "Birthday surprise",
    "Graduation ceremony", "Valentine's confession", "Tanabata evening", "Cultural festival performance",
    "New Year countdown"
  ],

  attribute: [
    "Wearing sailor uniform", "Flowing magical cape", "Fox ears and tail", "Cybernetic arm", "Eye patch",
    "Hair blowing in wind", "Holding umbrella", "Holding sword longer than body", "Wearing headphones",
    "Transparent jacket", "Bandages on arms", "Floating upside down", "Surrounded by petals",
    "Holding bento box", "Standing in water", "With dragon companion", "Glowing wings", "Back turned",
    "With floating holograms", "Arm glowing with magic", "Holding a paper charm",
    "Carrying plushie", "In bunny hoodie", "With glowing tattoos", "Hovering above ground",
    "Shoes off", "Scarf flowing in wind", "Eyes covered by hair", "Mouth covered by mask",
    "With camera in hand", "Wearing oversized coat", "Covered in sparkles", "Glitching body parts"
  ]
};

const modeRules = {
  easy: ['character', 'location', 'expression'],
  normal: ['character', 'location', 'expression', 'weather', 'time'],
  hard: ['character', 'location', 'expression', 'weather', 'time', 'attribute'],
};

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


export default function HashtagIdeaExplorer() {
  const [mode, setMode] = useState('easy');
  const [tags, setTags] = useState([]);
  const [dailyMotivation, setDailyMotivation] = useState('');

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateTags = () => {
    const selected = modeRules[mode].map(category => ({
      category,
      label: getRandomItem(categories[category]),
    }));
    setTags(selected);
  };

  const shuffleTag = (index) => {
    setTags(prev => {
      const newTags = [...prev];
      const category = newTags[index].category;
      newTags[index] = {
        category,
        label: getRandomItem(categories[category]),
      };
      return newTags;
    });
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const hash = [...today].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % motivasiAnimeUwu.length;
    setDailyMotivation(motivasiAnimeUwu[index]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="flex-1 py-10 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">
            Hashtag Idea Explorer
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-1 rounded"
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>

            <button
              onClick={generateTags}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            >
              Generate
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
