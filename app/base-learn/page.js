import BaseLearn from './BaseLearn'; // Impor komponen client-side
import Header from '../../components/Header';
import Footer from '../../components/Footer';


export const metadata = {
    title: "Base Learn - TukangSeblak",
    description: "Calculate your APR and APY returns easily with this tool. Perfect for crypto and investment enthusiasts!",
  };

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-4">
        <BaseLearn />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}