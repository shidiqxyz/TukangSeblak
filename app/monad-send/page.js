import MonadSendClient from './MonadSendClient'; // Impor komponen client-side
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Metadata untuk halaman Monad Mass Sender
export const metadata = {
  title: "Monad Mass Sender",
  description: "Send MON tokens to multiple addresses on the Monad Testnet.",
};

export default function MonadSend() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <MonadSendClient />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}