// Metadata untuk halaman
export const metadata = {
    title: "MCAP & FDV Calculator - TukangSeblak",
    description: "Calculate Market Cap (MCAP) and Fully Diluted Valuation (FDV) instantly with real-time updates.",
  };
  
  import McapFdvCalculator from './McapFdvCalculator';
  
  export default function McapFdvPage() {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
       
        <main className="">
          <McapFdvCalculator />
        </main>
      
      </div>
    );
  }