import AprApyCalculator from './AprApyCalculator';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: "APR & APY Calculator - TukangSeblak",
  description: "Calculate your APR and APY returns easily with this tool. Perfect for crypto and investment enthusiasts!",
};

export default function ApyApr() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow p-4">
        <AprApyCalculator />
      </main>
      <Footer />
    </div>
  );
}