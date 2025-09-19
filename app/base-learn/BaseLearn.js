"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

// ABI untuk mengecek kepemilikan NFT
const nftAbi = [
  "function balanceOf(address owner) view returns (uint256)"
];

// ABI untuk kontrak minting, sekarang termasuk fungsi verifikasi
const mintAbi = [
  // Fungsi verifikasi/prasyarat
  "function testContract(address _submissionAddress) public", 

  // Fungsi-fungsi minting yang mungkin ada
  "function mint(address _submissionAddress) public returns (uint256)",
  "function mintTo(address _to, address _submissionAddress) public returns (uint256)",
  "function safeMint(address _to, address _submissionAddress) public returns (uint256)",
  "function claim(address _submissionAddress) public returns (uint256)",
  "function mintWithSubmission(address _submissionAddress) public returns (uint256)"
];

// Konfigurasi Jaringan Base Sepolia
const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_NETWORK = {
  chainId: '0x14a34', // 84532 dalam hex
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['https://sepolia-explorer.base.org']
};

// Data untuk role dan requirement NFT
const roles = [
  {
    name: "Newcomer",
    icon: "🌱",
    color: "from-green-400 to-blue-500",
    requirements: [
      { label: "Basic Contracts Pin", address: "0x075eb9dc52177aa3492e1d26f0fde3d729625d2f" }
    ]
  },
  {
    name: "Acolyte",
    icon: "⚡",
    color: "from-purple-400 to-pink-500",
    requirements: [
      { label: "Storage Pin", address: "0x567452c6638c0d2d9778c20a3d59749fdcaa7ab3" },
      { label: "Control Structures Pin", address: "0xf4d953a3976f392aa5509612deff395983f22a84" },
      { label: "Arrays Pin", address: "0x5b0f80ca6f5bd60cc3b64f0377f336b2b2a56cdf" }
    ]
  },
  {
    name: "Consul",
    icon: "👑",
    color: "from-yellow-400 to-orange-500",
    requirements: [
      { label: "Mappings Pin", address: "0xd32e3ace3272e2037003ca54ca7e5676f9b8d06c" },
      { label: "Inheritance Pin", address: "0xf90da05e77a33fe6d64bc2df84e7dd0069a2111c" },
      { label: "Structs Pin", address: "0x9eb1fa4cd9bd29ca2c8e72217a642811c1f6176d" }
    ]
  },
  {
    name: "Prefect",
    icon: "🚀",
    color: "from-blue-400 to-purple-600",
    requirements: [
      { label: "Error Triage Pin", address: "0xc1bd0d9a8863f2318001bc5024c7f5f58a2236f7" },
      { label: "New Keyword Pin", address: "0x4f21e69d0cde8c21cf82a6b37dda5444716afa46" },
      { label: "Imports Pin", address: "0x8dd188ec36084d59948f90213afcd04429e33c0c" }
    ]
  },
  {
    name: "Supreme",
    icon: "💎",
    color: "from-indigo-500 to-purple-800",
    requirements: [
      { label: "SCD ERC721 Pin", address: "0x15534ed3d1dba55148695b2ba4164f147e47a10c" },
      { label: "Minimal Token Pin", address: "0x10ce928030e136ecc74d4a4416db9b533e3c694d" },
      { label: "ERC20 Pin", address: "0x4f333c49b820013e5e6fe86634dc4da88039ce50" }
    ]
  }
];

export default function BaseLearn() {
  const [account, setAccount] = useState(null);
  const [balances, setBalances] = useState({});
  const [submissionInputs, setSubmissionInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mintingStatus, setMintingStatus] = useState({}); // State untuk melacak proses: 'idle', 'verifying', 'minting'
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setCurrentNetwork(network);
      setIsCorrectNetwork(network.chainId === BASE_SEPOLIA_CHAIN_ID);
      return network;
    } catch (error) {
      console.error("Error checking network:", error);
      return null;
    }
  };

  const switchToBaseSepolia = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_NETWORK.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_NETWORK],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          alert("Failed to add Base Sepolia network. Please add it manually.");
        }
      } else {
        console.error("Error switching network:", switchError);
        alert("Failed to switch to Base Sepolia network.");
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask or another Web3 wallet");
        return;
      }
      setIsLoading(true);
      const network = await checkNetwork();
      if (network && network.chainId !== BASE_SEPOLIA_CHAIN_ID) {
        if (confirm(`You're on ${network.name}. This app requires Base Sepolia. Switch networks?`)) {
          await switchToBaseSepolia();
        }
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalances = async () => {
    if (!account || !window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== BASE_SEPOLIA_CHAIN_ID) {
        setIsCorrectNetwork(false);
        return;
      }
      setIsCorrectNetwork(true);
      const results = {};
      for (const role of roles) {
        for (const req of role.requirements) {
          try {
            if (!ethers.utils.isAddress(req.address)) {
              console.error(`Invalid address format: ${req.address}`);
              results[req.address] = 0;
              continue;
            }
            const contract = new ethers.Contract(req.address, nftAbi, provider);
            const balance = await contract.balanceOf(account);
            results[req.address] = balance.toNumber();
          } catch (err) {
            console.error(`Error reading balance from ${req.address}:`, err.message);
            results[req.address] = 0;
          }
        }
      }
      setBalances(results);
    } catch (error) {
      console.error("Error fetching balances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndMint = async (submissionAddress, requirementAddress) => {
    if (!account || !submissionAddress.trim() || !ethers.utils.isAddress(submissionAddress)) {
      alert("Please enter a valid submission address!");
      return;
    }

    setMintingStatus(prev => ({ ...prev, [requirementAddress]: 'verifying' }));

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const mintContract = new ethers.Contract(requirementAddress, mintAbi, signer);

      // --- TAHAP 1: VERIFIKASI DENGAN testContract ---
      console.log(`[1/2] Verifying submission with testContract...`);
      try {
        const verifyTx = await mintContract.testContract(submissionAddress);
        const verifyReceipt = await verifyTx.wait(); // Tunggu transaksi verifikasi selesai
        if(verifyReceipt.status === 0){
          throw new Error("Verification transaction failed. Check your submission contract.");
        }
        console.log(`[1/2] Verification successful! Tx: ${verifyTx.hash}`);
      } catch (error) {
        const reason = error.reason || "Check console for details.";
        throw new Error(`Contract verification failed: ${reason}`);
      }
      
      await fetchBalances();

    } catch (error) {
      console.error("Full Process Error:", error);
      alert("Process failed: " + error.message);
    } finally {
      setMintingStatus(prev => ({ ...prev, [requirementAddress]: 'idle' }));
    }
  };

  const handleInputChange = (requirementAddress, value) => {
    setSubmissionInputs(prev => ({ ...prev, [requirementAddress]: value }));
  };

  const calculateRoleProgress = (role) => {
    const owned = role.requirements.filter(req => balances[req.address] > 0).length;
    return (owned / role.requirements.length) * 100;
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) setAccount(accounts[0]);
          await checkNetwork();
        } catch (error) {
          console.error("Error checking initial wallet connection:", error);
        }
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (account) fetchBalances();
  }, [account, isCorrectNetwork]);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => setAccount(accounts.length > 0 ? accounts[0] : null);
      const handleChainChanged = () => {
        checkNetwork();
        fetchBalances();
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [account]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-wide text-white mb-4">Base Learn Roles</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Complete challenges and mint NFT badges to progress through the Base learning hierarchy</p>
        </div>

        <div className="text-center mb-12">
          {!account ? (
            <button onClick={connectWallet} disabled={isLoading} className="group relative px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-emerald-700 hover:scale-105 hover:shadow-2xl disabled:opacity-50">
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Wallet Connected</span>
              </div>
              <p className="text-gray-300 font-mono text-sm break-all mb-4">{account}</p>
              <button onClick={fetchBalances} disabled={isLoading} className="w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading && <div className="w-4 h-4 border-2 border-white rounded border-t-transparent animate-spin"></div>}
                {isLoading ? "Refreshing..." : "🔄 Refresh Balances"}
              </button>
            </div>
          )}
        </div>

        {account && (
          <div className="text-center mb-8">
            {isCorrectNetwork ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                <span>✅</span> Connected to Base Sepolia Testnet
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  <span>⚠️</span> Wrong Network! Please switch to Base Sepolia
                </div>
                <button onClick={switchToBaseSepolia} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-all duration-200">
                  🔄 Switch to Base Sepolia
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const progress = calculateRoleProgress(role);
            const isComplete = progress === 100;
            return (
              <div key={role.name} className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 transition-all duration-500 hover:border-gray-600 hover:bg-gray-700 hover:scale-105">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600 mb-4 text-2xl shadow-lg">{role.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">{role.name}</h2>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-400">{Math.round(progress)}% Complete</p>
                </div>

                <div className="space-y-4">
                  {role.requirements.map((req) => {
                    const hasNFT = balances[req.address] > 0;
                    const status = mintingStatus[req.address] || 'idle';
                    const isProcessing = status === 'verifying' || status === 'minting';

                    const getButtonText = () => {
                      if (status === 'verifying') return "Verifying...";
                      if (status === 'minting') return "Minting...";
                      return "🎯 Verify & Mint";
                    };

                    return (
                      <div key={req.address} className={`p-4 rounded-xl border ${hasNFT ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-700 border-gray-600'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-white text-sm">{req.label}</h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${hasNFT ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                            {hasNFT ? '✅ Owned' : '❌ Missing'}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 font-mono break-all mb-3">Contract: {req.address}</p>

                        {!hasNFT && account && isCorrectNetwork && (
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Enter submission address (0x...)"
                              value={submissionInputs[req.address] || ""}
                              onChange={(e) => handleInputChange(req.address, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              disabled={isProcessing}
                            />
                            <button
                              onClick={() => handleVerifyAndMint(submissionInputs[req.address], req.address)}
                              disabled={isProcessing || !submissionInputs[req.address]?.trim()}
                              className="w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isProcessing && <div className="w-4 h-4 border-2 border-white rounded border-t-transparent animate-spin"></div>}
                              {getButtonText()}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                 {isComplete && <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">COMPLETE! 🏆</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}