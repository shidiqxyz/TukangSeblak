import RandomAnime from './RandomizerAnime'; // Impor komponen client-side

// Metadata untuk halaman Monad Mass Sender
export const metadata = {
  title: "Randomizer Anime- TukangSeblak",
  description: "Randomizer your anime",
};

export default function RandomizerAnime() {
  return (
    <div className="">
     
      {/* Main Content */}
      <main className="">
        <RandomAnime />
      </main>

    </div>
  );
}