'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import tasksData from './tasks.json';

const motivasiAnimeUwu = [
  "Ganbatte ne~! 💪✨ Kamu itu protagonist-nya hidupmu sendiri, jangan nyerah yaa~! 🌸📖",
  "Yattaaa~! 🎉 Sedikit lagi, impianmu bakal jadi kenyataan! Teruskan semangatnya~ (≧◡≦) 💖",
  "UwU~ Jangan lupa nyengir pas gambar, biar energinya masuk ke tiap garisnya~ 🎨🖌️",
  "Mode shounen: ON! 💥🔥 Lawan rasa malas kayak lagi duel lawan boss terakhir!",
  "Hari ini juga bagian dari *arc penting* kisah hidupmu~ Jangan skip yaa~ (｡•̀ᴗ-)✧",
  "Henshin~! 💫 Biarkan kreativitasmu bersinar kayak transformasi magical girl~ 🌈✨",
  "Kawaii effort is still effort, desu~ 💕👊 Teruslah berjuang, senpai!",
  "Kalau lelah, istirahat sebentar, tapi jangan stop, ne~ 🛌🌙",
  "Mimpi itu nggak akan mengkhianati usaha! ✍️💭 Jadi ayo gambar lagiii~!! 🐣",
  "Bayangkan kamu di anime slice of life — tiap gambar bikin ending makin manis~ 🍱🎬",
  "Nani!? Kamu udah sejauh ini? Sugoiii~!! Teruskan langkahmu, nakama~ 🚀🌟",
  "Chotto matte... jangan biarkan rasa malas jadi villain-nya harimu! 😤⚔️",
  "Satu gambar, satu langkah ke dunia impianmu~ ✨💞 Ganbareeee!",
  "Tiap guratan tuh spell sihir loh! 🔮 Jadi gambarlah dengan cinta dan semangat uwu~ 💖",
  "Jangan bandingin dirimu sama orang lain yaa~ Kamu itu satu-satunya karakter utama di cerita ini 💫📜",
  "Walau lambat, kamu tetap berjalan. Dan itu luar biasa! 🐢💪",
  "Setiap harimu itu seperti episode baru, jadi bikin yang terbaik~! 🎬🍀",
  "Kamu nggak sendirian kok! Kami semua di party ini dukung kamu~ 🧙‍♀️🧝‍♂️⚔️",
  "Jangan lupa senyum, biar energimu recharge kayak healing spell! 🌸😊",
  "Kalau gagal? Ya coba lagi dong~ Itu biasa di anime! 💥💫",
  "Bangkit dari kegagalan itu lebih keren daripada menang terus~ 😎🔥",
  "Jangan ragu buat jadi unik! Karakter paling memorable itu yang beda! 🌈🦄",
  "Satu langkah kecil hari ini bisa jadi awal kisah besar esok! 👣📖",
  "Ayo kita kumpulkan EXP bareng-bareng~ ✨🎮",
  "Kerja kerasmu hari ini = arc power-up esok hari 💪📈",
  "Mager? Coba bayangin ada OST epic mengiringi kamu bersih-bersih 😆🎵",
  "Ayo gambar kayak kamu sedang menyelamatkan dunia! 🎨⚡",
  "Hujan boleh turun, tapi semangatmu harus tetap cerah~ ☔🌈",
  "Senpai percaya kamu pasti bisa~ 💌 Jangan menyerah ne~",
  "Gambarlah seperti kamu lagi confess ke waifu kamu~ UwU~ 💞",
  "Kamu itu ibarat hidden gem dalam anime~ Berkilau kalau terus diasah 💎✨",
  "Nggak perlu perfect, cukup tulus dan konsisten~ 🧸🌷",
  "Kalau hari ini gagal, anggap aja filler episode, besok naik lagi~ 🎭📈",
  "Jangan terlalu keras ke diri sendiri, anime MC juga kadang nangis kok~ 😭🌧️",
  "Biar lambat asal *no skip*, prosesmu itu berharga banget! 🐌💖",
  "Coba pikirin ini: kamu gambar hari ini bisa nyentuh hati orang lain suatu saat nanti 💌✨",
  "Gambarlah seperti kamu sedang summon spirit animal kamu! 🐺🎨",
  "Nggak ada garis yang sia-sia — semua itu bagian dari training arc kamu! 📖✍️",
  "Kamu itu gabungan antara si genius dan si ulet~ Keren banget kan? 😎💥",
  "Kalau dunia nyata berat, setidaknya dunia gambarmu bisa kamu kendalikan~ 🎨💭",
  "Napas dulu... tarik... hembus... oke, lanjut push lagi! 😮‍💨💥",
  "Keraguanmu cuma efek status sementara. Kamu bisa recover, percayalah~ 💫🛡️",
  "Kamu itu kayak karakter yang bakal jadi legenda... asal terus lanjut! 🏆🌟",
  "Hobi ini bukan cuma hobi. Ini jalan ninjamu~ 👊🔥",
  "Hari yang berat bukan akhir dari segalanya. Kadang cuma episode sad doang 🥺💧",
  "Waktu kamu menggambar, dunia jadi tempat yang lebih indah~ 🖌️🌍",
  "Lelah itu wajar, tapi jangan sampai kehilangan alasan kenapa kamu mulai ✨📓",
  "Jangan tunggu mood! Kadang kamu harus nyerang dulu kayak turn-based RPG~ 💥🎮",
  "Kamu itu seperti bunga yang mekar perlahan, tapi pasti wangi dan indah~ 🌸🍃",
  "Ulangi terus kayak grinding monster, nanti EXP-mu juga naik! 🧠📈",
  "Suaramu penting, karyamu berharga, dan semangatmu... luar biasa! 🌟🎶"
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function QuestPage() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [quest, setQuest] = useState(null);
  const [motivasi, setMotivasi] = useState('');

  useEffect(() => {
    setMounted(true);
    setToday(
      new Date().toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
    setQuest(getRandomItem(tasksData));
    setMotivasi(getRandomItem(motivasiAnimeUwu));
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">🎨 Quest Ilustrasi Harian</h1>
        <p className="text-gray-400 mb-6">{today}</p>

        {quest && (
          <div className="bg-gray-800 text-white px-6 py-4 rounded-md shadow mb-6 w-full max-w-xl">
            <p className="text-lg">{quest.task}</p>
          </div>
        )}

        <p className="text-pink-400 italic text-lg mb-6 max-w-xl">💬 {motivasi}</p>

        <button
          onClick={() => {
            setQuest(getRandomItem(tasksData));
            setMotivasi(getRandomItem(motivasiAnimeUwu));
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
        >
          🎲 Ambil Ulang Quest
        </button>
      </main>
      <Footer />
    </div>
  );
}
