'use client';

import Link from 'next/link';

export default function Card({ title, href, icon, thumbnail, size = 'normal' }) {
  // Dynamic thumbnail height based on size
  const thumbnailHeightClass = size === 'tall' || size === 'large'
    ? 'h-full'
    : 'h-32 md:h-40';

  return (
    <Link href={href || '/'} className="block h-full">
      <div className="group luxury-card bg-neutral-900 rounded-xl overflow-hidden text-white relative flex flex-col h-full">

        {/* Thumbnail Section - fills available space */}
        <div className={`${thumbnailHeightClass} w-full overflow-hidden relative bg-neutral-800 flex-grow`}>
          {thumbnail ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
              style={{ backgroundImage: `url(${thumbnail})` }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-600">
              <span className="text-4xl text-neutral-700">🖼️</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent opacity-80" />
        </div>

        {/* Content Section */}
        <div className="p-5 flex items-center gap-4 relative z-10 flex-grow">
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* Icon */}
          {icon && (
            <span className="text-2xl filter grayscale brightness-150 contrast-125 z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>
          )}

          {/* Title */}
          <h3 className="text-lg font-medium text-left group-hover:text-white transition-colors flex-1 z-10">
            {title}
          </h3>

          {/* Arrow indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2 z-10">
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}