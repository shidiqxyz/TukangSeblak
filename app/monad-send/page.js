import MonadSendClient from './MonadSendClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: "Monad Mass Sender - TukangSeblak",
  description: "Send MON tokens to multiple addresses on the Monad Testnet.",
};

export default function MonadSend() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow p-6">
        <MonadSendClient />
      </main>
      <Footer />
    </div>
  );
}