import LineaClient from './LineaClient'; // Impor komponen client-side
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Metadata untuk halaman Linea
export const metadata = {
  title: "Linea POH & LXP",
  description: "Check POH and LXP status for multiple addresses on Linea.",
};

export default function Linea() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-4">
        <LineaClient />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}