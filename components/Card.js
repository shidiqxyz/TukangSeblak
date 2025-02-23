import Link from 'next/link';

export default function Card({ title, description, buttonText, href }) {
  return (
      <Link href={href || '/'}>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md text-white transition-all duration-300 hover:bg-gray-600">
        <h3 className="text-xl font-bold text-center ">{title}</h3>
        </div>
      </Link>
  );
}