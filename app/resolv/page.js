import ResolvCheckerClient from './ResolvCheckerClient'; // Impor komponen client-side


// Metadata untuk halaman Resolv Checker
export const metadata = {
  title: "Resolv Points Checker",
  description: "Check your Resolv.im points and daily activities for multiple Ethereum addresses or ENS names.",
};

export default function ResolvChecker() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      

      {/* Main Content */}
     <ResolvCheckerClient />

    </div>
  );
}