import LineaClient from './LineaClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: "Linea POH & LXP - TukangSeblak",
  description: "Check POH and LXP status for multiple addresses on Linea.",
};

export default function Linea() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow p-4">
        <LineaClient />
      </main>
      <Footer />
    </div>
  );
}