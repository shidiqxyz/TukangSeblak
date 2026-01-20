import Link from 'next/link';

export default function Card({ title, href }) {
  return (
    <Link href={href || '/'}>
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg text-white transition-all duration-300 hover:bg-neutral-800 hover:border-neutral-700">
        <h3 className="text-lg font-medium text-left">{title}</h3>
      </div>
    </Link>
  );
}