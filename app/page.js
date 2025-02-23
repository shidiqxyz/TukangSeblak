import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content (flex-grow agar mengisi ruang tersisa) */}
      <main className="flex-grow p-4">
        <Content />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}