"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

const nftAbi = [
  "function balanceOf(address owner) view returns (uint256)"
];

const mintAbi = [
  "function mint(address _submissionAddress) public returns (uint256)"
];

const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_NETWORK = {
  chainId: '0x14a34', // 84532 in hex
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['https://sepolia-explorer.base.org']
};

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
  const [isMinting, setIsMinting] = useState({});
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
      // Try to switch to Base Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_NETWORK.chainId }],
      });
    } catch (switchError) {
      // If the chain doesn't exist, add it
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
      
      // Check and switch to correct network first
      const network = await checkNetwork();
      if (network && network.chainId !== BASE_SEPOLIA_CHAIN_ID) {
        const shouldSwitch = confirm(
          `You're connected to ${network.name || 'Unknown Network'}. ` +
          `This app requires Base Sepolia testnet. Would you like to switch networks?`
        );
        
        if (shouldSwitch) {
          await switchToBaseSepolia();
          await checkNetwork(); // Re-check after switching
        }
      }
      
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
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
      
      // Check network
      const network = await provider.getNetwork();
      console.log("Current network:", network.name, "Chain ID:", network.chainId);
      
      if (network.chainId !== BASE_SEPOLIA_CHAIN_ID) {
        alert(`Wrong network! Please switch to Base Sepolia (Chain ID: ${BASE_SEPOLIA_CHAIN_ID}). Currently on Chain ID: ${network.chainId}`);
        setIsCorrectNetwork(false);
        return;
      }
      
      setIsCorrectNetwork(true);

      const results = {};
      
      for (const role of roles) {
        for (const req of role.requirements) {
          try {
            // Validate address format first
            if (!ethers.utils.isAddress(req.address)) {
              console.error(`Invalid address format: ${req.address}`);
              results[req.address] = 0;
              continue;
            }

            const contract = new ethers.Contract(req.address, nftAbi, provider);
            
            // Check if contract exists by getting code
            const code = await provider.getCode(req.address);
            if (code === "0x") {
              console.warn(`No contract found at address ${req.address} on Base Sepolia`);
              results[req.address] = 0;
              continue;
            }

            const balance = await contract.balanceOf(account);
            results[req.address] = balance.toNumber();
            console.log(`Balance for ${req.label}: ${results[req.address]}`);
          } catch (err) {
            console.error(`Error reading balance from ${req.address} (${req.label}):`, err.message);
            results[req.address] = 0;
          }
        }
      }
      
      setBalances(results);
    } catch (error) {
      console.error("Error fetching balances:", error);
      
      // More specific error messages
      if (error.message.includes("network")) {
        alert("Network error. Please check your connection and try again.");
      } else if (error.message.includes("rejected")) {
        alert("Request was rejected. Please try connecting your wallet again.");
      } else {
        alert("Failed to fetch balances. Please make sure you're on Base Sepolia network.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const mintNFT = async (submissionAddress, requirementAddress) => {
    if (!account || !submissionAddress.trim()) {
      alert("Please enter a submission address!");
      return;
    }

    if (!ethers.utils.isAddress(submissionAddress)) {
      alert("Please enter a valid Ethereum address!");
      return;
    }

    try {
      setIsMinting(prev => ({ ...prev, [requirementAddress]: true }));
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Check network
      const network = await provider.getNetwork();
      console.log("Minting on network:", network.name, "Chain ID:", network.chainId);
      
      if (network.chainId !== BASE_SEPOLIA_CHAIN_ID) {
        throw new Error(`Please switch to Base Sepolia network. Currently on Chain ID: ${network.chainId}`);
      }
      
      // Validate mint contract address
      if (!ethers.utils.isAddress(mintContractAddress)) {
        throw new Error("Invalid mint contract address");
      }

      // Check if mint contract exists
      const code = await provider.getCode(mintContractAddress);
      if (code === "0x") {
        throw new Error(`Mint contract not found at ${mintContractAddress} on ${network.name}. Please check you're on the correct network.`);
      }

      const mintContract = new ethers.Contract(mintContractAddress, mintAbi, signer);
      
      // Estimate gas first to catch errors early
      try {
        const gasEstimate = await mintContract.estimateGas.mint(submissionAddress);
        console.log("Estimated gas:", gasEstimate.toString());
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);
        throw new Error("Transaction will likely fail. Please check the submission address and try again.");
      }
      
      const tx = await mintContract.mint(submissionAddress);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        alert("NFT minted successfully! 🎉");
        setSubmissionInputs(prev => ({ 
          ...prev, 
          [requirementAddress]: "" 
        }));
        await fetchBalances();
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Mint error:", error);
      
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        alert("Transaction was rejected by user");
      } else if (error.message.includes("insufficient funds")) {
        alert("Insufficient funds for gas fees");
      } else if (error.message.includes("contract not found")) {
        alert(error.message);
      } else if (error.message.includes("network")) {
        alert("Network error. Please check your connection and network settings.");
      } else {
        alert("Mint failed: " + (error.reason || error.message));
      }
    } finally {
      setIsMinting(prev => ({ ...prev, [requirementAddress]: false }));
    }
  };

  const handleInputChange = (requirementAddress, value) => {
    setSubmissionInputs(prev => ({
      ...prev,
      [requirementAddress]: value
    }));
  };

  const calculateRoleProgress = (role) => {
    const owned = role.requirements.filter(req => balances[req.address] > 0).length;
    return (owned / role.requirements.length) * 100;
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: "eth_accounts" 
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
          
          // Check network on load
          await checkNetwork();
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (account) {
      fetchBalances();
    }
  }, [account]);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setBalances({});
        }
      };

      const handleChainChanged = (chainId) => {
        console.log("Chain changed to:", parseInt(chainId, 16));
        checkNetwork();
        // Reload balances if we have an account
        if (account) {
          setTimeout(fetchBalances, 1000); // Small delay to ensure network switch is complete
        }
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
    {/* Container Utama */}
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-wide text-white mb-4">
          Base Learn Roles
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Complete challenges and mint NFT badges to progress through the Base learning hierarchy
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="text-center mb-12">
        {!account ? (
          <button 
            onClick={connectWallet}
            disabled={isLoading}
            className="group relative px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-emerald-700 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-white rounded border-t-transparent animate-spin hidden group-disabled:block"></div>
              {isLoading ? "Connecting..." : "Connect Wallet"}
              {!isLoading && <span className="text-xl">🔗</span>}
            </div>
          </button>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Wallet Connected</span>
            </div>
            <p className="text-gray-300 font-mono text-sm break-all mb-4">
              {account}
            </p>
            <button 
              onClick={fetchBalances}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white rounded border-t-transparent animate-spin"></div>}
              {isLoading ? "Refreshing..." : "🔄 Refresh Balances"}
            </button>
          </div>
        )}
      </div>

      {/* Network Info */}
      {account && (
        <div className="text-center mb-8">
          {isCorrectNetwork ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
              <span>✅</span>
              <span>Connected to Base Sepolia Testnet</span>
              {currentNetwork && (
                <span className="text-xs opacity-75">(Chain ID: {currentNetwork.chainId})</span>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                <span>⚠️</span>
                <span>Wrong Network! Please switch to Base Sepolia</span>
                {currentNetwork && (
                  <span className="text-xs opacity-75">(Currently: Chain ID {currentNetwork.chainId})</span>
                )}
              </div>
              <button
                onClick={switchToBaseSepolia}
                className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-all duration-200"
              >
                🔄 Switch to Base Sepolia
              </button>
            </div>
          )}
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role, idx) => {
          const progress = calculateRoleProgress(role);
          const isComplete = progress === 100;

          return (
            <div 
              key={idx} 
              className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 transition-all duration-500 hover:border-gray-600 hover:bg-gray-700 hover:scale-105 hover:shadow-2xl"
            >
              {/* Role Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600 mb-4 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {role.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {role.name}
                </h2>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  {Math.round(progress)}% Complete ({role.requirements.filter(req => balances[req.address] > 0).length}/{role.requirements.length})
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                {role.requirements.map((req, i) => {
                  const hasNFT = balances[req.address] > 0;
                  const isCurrentlyMinting = isMinting[req.address];
                  
                  return (
                    <div 
                      key={i}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        hasNFT 
                          ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20 shadow-lg' 
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white text-sm">
                          {req.label}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          hasNFT 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {hasNFT ? '✅ Owned' : '❌ Missing'}
                        </div>
                      </div>

                      {!hasNFT && account && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Enter submission address (0x...)"
                            value={submissionInputs[req.address] || ""}
                            onChange={(e) => handleInputChange(req.address, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors"
                            disabled={isCurrentlyMinting}
                          />
                          <button 
                            onClick={() => mintNFT(submissionInputs[req.address], req.address)}
                            disabled={isCurrentlyMinting || !submissionInputs[req.address]?.trim()}
                            className="w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isCurrentlyMinting && (
                              <div className="w-4 h-4 border-2 border-white rounded border-t-transparent animate-spin"></div>
                            )}
                            {isCurrentlyMinting ? "Minting..." : "🎯 Mint NFT"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isComplete && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  COMPLETE! 🏆
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-gray-400">
        <p className="text-sm">
          Complete all challenges to unlock the next role in your Base learning journey
        </p>
      </div>
    </div>
  </div>
);

}