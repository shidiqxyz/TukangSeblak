'use client'; // Directive untuk client-side rendering

import { useState } from 'react';
import { ethers } from 'ethers';

export default function MonadSendClient() {
  const [inputTx, setInputTx] = useState('');
  const [result, setResult] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null); // Menyimpan alamat wallet yang terhubung

  const CHAIN_ID = '0x279F'; // 10143 in hex for Monad Testnet
  const RPC_ENDPOINT = 'https://testnet-rpc.monad.xyz';

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0]; // Ambil alamat wallet pertama
        setCurrentAccount(address); // Simpan alamat wallet

        // Ensure the user is on the correct network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: CHAIN_ID,
                  chainName: 'Monad Testnet',
                  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
                  rpcUrls: [RPC_ENDPOINT],
                  blockExplorerUrls: [],
                },
              ],
            });
          } catch (err) {
            console.error('🚨 Error adding chain:', err);
            alert('Failed to switch to Monad Testnet. Please check your wallet settings.');
          }
        }
      } catch (error) {
        console.error('⚠️ Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('❌ Please install MetaMask!');
    }
  };

  // Parse Transactions
  const parseTransactions = (input) => {
    const lines = input.split('\n').filter((line) => line.trim() !== '');
    return lines.map((line) => {
      const [address, amount] = line.split(',').map((item) => item.trim());
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error(`Invalid address: ${address}`);
      }
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error(`Invalid amount: ${amount}`);
      }
      return { address, amount: parseFloat(amount) };
    });
  };

  // Send Batch Transaction
  const sendBatchTransaction = async (transactions) => {
    try {
      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const signer = provider.getSigner();

      // Replace with your deployed MultiSend contract address
      const MULTISENDER_ADDRESS = '0xf0D6342753E3A4aB9BA1A087aF7867B3d416BaAC';
      const MULTISENDER_ABI = [
        {
          inputs: [
            { internalType: 'address[]', name: 'recipients', type: 'address[]' },
            { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
          ],
          name: 'multisend',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ];

      const contract = new ethers.Contract(MULTISENDER_ADDRESS, MULTISENDER_ABI, signer);

      // Build arrays and compute the total amount (in wei)
      let addresses = [];
      let amounts = [];
      let totalValue = ethers.BigNumber.from(0);

      transactions.forEach((tx) => {
        addresses.push(tx.address);
        const weiAmount = ethers.utils.parseEther(tx.amount.toString());
        amounts.push(weiAmount);
        totalValue = totalValue.add(weiAmount);
      });

      // Call the multisend function in one transaction
      const txResponse = await contract.multisend(addresses, amounts, { value: totalValue });
      return txResponse;
    } catch (error) {
      console.error('🚨 Error sending batch transaction:', error);
      throw error;
    }
  };

  // Handle Send Button Click
  const handleSend = () => {
    try {
      const transactions = parseTransactions(inputTx);
      if (transactions.length === 0) {
        alert('⚠️ Please enter at least one transaction!');
        return;
      }

      let contentHTML = '<ul class="space-y-2">';
      transactions.forEach((tx) => {
        contentHTML += `<li class="border p-2 rounded bg-gray-800">📍 Address: <span class="text-green-400">${tx.address}</span> | 💰 Amount: <span class="text-blue-400">${tx.amount}</span></li>`;
      });
      contentHTML += '</ul>';

      setModalContent(contentHTML);
      setIsModalOpen(true);
    } catch (error) {
      alert(`⚠️ Error parsing transactions: ${error.message}`);
    }
  };

  // Confirm Transaction
  const confirmTransaction = async () => {
    setIsModalOpen(false);
    setResult('<p>⏳ Sending batch transaction...</p>');

    try {
      const transactions = parseTransactions(inputTx);
      const txResponse = await sendBatchTransaction(transactions);
      setResult(`<p class="text-green-400">✅ Batch transaction sent: <a href="https://testnet.monadexplorer.com/tx/${txResponse.hash}" target="_blank" rel="noopener noreferrer" class="underline">View on Explorer</a></p>`);
    } catch (error) {
      setResult(`<p class="text-red-400">❌ Error: ${error.message}</p>`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r text-white flex items-center">
          🚀 Monad Mass Sender 🔥
        </h1>
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r font-bold from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-6 py-3 rounded-lg flex items-center transition duration-300"
        >
          {currentAccount ? (
            <span>
              <i className="fab fa-metamask mr-2"></i> Connected: {`${currentAccount.slice(0, 7)}...`}
            </span>
          ) : (
            <span>
              <i className="fab fa-metamask mr-2"></i> Connect Wallet 🤝
            </span>
          )}
        </button>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <label htmlFor="inputTx" className="block text-lg font-semibold mb-2 text-gray-300">
          Enter address and amount (format: address, amount) 📝
        </label>
        <textarea
          id="inputTx"
          value={inputTx}
          onChange={(e) => setInputTx(e.target.value)}
          className="w-full p-4 bg-gray-700 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none font-mono text-sm text-gray-200 placeholder-gray-500"
          rows="6"
          placeholder={`0xABC123..., 10\n0xDEF456..., 5`}
        ></textarea>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 px-6 py-4 rounded-lg flex items-center justify-center transition duration-300"
      >
        <i className="fas fa-paper-plane mr-2"></i> Send Coins 💸
      </button>

      {/* Result Container */}
      <div
        id="result"
        className="mt-6 space-y-4"
        dangerouslySetInnerHTML={{ __html: result }}
      ></div>

      {/* Modal Popup for Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-11/12 max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
              Confirm Transaction ✅
            </h2>
            <div
              id="modalContent"
              className="max-h-60 overflow-y-auto mb-4 space-y-2"
              dangerouslySetInnerHTML={{ __html: modalContent }}
            ></div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-300"
              >
                Cancel ❌
              </button>
              <button
                onClick={confirmTransaction}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition duration-300"
              >
                Confirm ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}