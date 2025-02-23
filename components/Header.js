import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-6 px-4 pt-20">
      <div className="container mx-auto flex flex-col justify-center items-center">
        {/* Judul Utama */}
        <Link href="/" className="text-center cursor-pointer">
          <h1 className="text-3xl font-bold tracking-wider flex items-center justify-center">
             TukangSeblak 🍜
          </h1>
          <h2 className="text-xl font-semibold tracking-wide mt-2 flex items-center justify-center">
            Just making a Simple tools 🔧
          </h2>
        </Link>
      </div>
    </header>
  );
}