import BaseLearn from './BaseLearn';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


export const metadata = {
  title: "Base Learn - TukangSeblak",
  description: "",
};

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow p-4">
        <BaseLearn />
      </main>
      <Footer />
    </div>
  );
}