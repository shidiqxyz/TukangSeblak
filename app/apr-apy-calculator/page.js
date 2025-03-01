import AprApyCalculator from './AprApyCalculator'; // Impor komponen client-side
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Metadata untuk halaman Linea
// Metadata Dinamis
export const metadata = {
    title: "APR & APY Calculator - TukangSeblak",
    description: "Calculate your APR and APY returns easily with this tool. Perfect for crypto and investment enthusiasts!",
  };

export default function ApyApr() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-4">
        <AprApyCalculator />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}