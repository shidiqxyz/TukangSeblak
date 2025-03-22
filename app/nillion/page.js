import NillionRPC from './NillionWallet'; 

// Impor komponen client-side
// Metadata untuk halaman Monad Mass Sender
export const metadata = {
    title: "Nillion Wallet - TukangSeblak",
    description: "Check Keplr wallet balance on the Nillion network",
  };  

export default function nillionWallet() {
  return (
    <div className="">
     
      {/* Main Content */}
      <main className="">
        <NillionRPC />
      </main>

    </div>
  );
}