'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <header className="relative bg-black text-white py-16 px-4 pt-24 border-b border-neutral-800 overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-neutral-800" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-neutral-800" />

      <div className="container mx-auto flex flex-col justify-center items-center relative z-10">
        {/* Main Title with animation */}
        <Link href="/" className="text-center cursor-pointer group">
          <h1
            className={`text-5xl md:text-6xl font-bold tracking-wider flex items-center justify-center group-hover:text-neutral-300 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            TukangSeblak
          </h1>
          <h2
            className={`text-xl font-normal tracking-wide mt-4 flex items-center justify-center text-neutral-400 transition-all duration-500 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Just making simple tools for myself
          </h2>
        </Link>
      </div>
    </header>
  );
}