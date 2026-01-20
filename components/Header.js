import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-black text-white py-6 px-4 pt-20 border-b border-neutral-800">
      <div className="container mx-auto flex flex-col justify-center items-center">
        {/* Judul Utama */}
        <Link href="/" className="text-center cursor-pointer group">
          <h1 className="text-3xl font-bold tracking-wider flex items-center justify-center group-hover:text-neutral-300 transition-colors">
            TukangSeblak
          </h1>
          <h2 className="text-lg font-normal tracking-wide mt-2 flex items-center justify-center text-neutral-400">
            Simple tools for Web3
          </h2>
        </Link>
      </div>
    </header>
  );
}