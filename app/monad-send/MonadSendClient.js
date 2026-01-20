'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function MonadSendClient() {
  const [inputTx, setInputTx] = useState('');
  const [result, setResult] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const CHAIN_ID = '0x279F';
  const RPC_ENDPOINT = 'https://testnet-rpc.monad.xyz';

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setCurrentAccount(address);

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
            console.error('Error adding chain:', err);
            alert('Failed to switch to Monad Testnet.');
          }
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

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

  const sendBatchTransaction = async (transactions) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const signer = provider.getSigner();

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

      let addresses = [];
      let amounts = [];
      let totalValue = ethers.BigNumber.from(0);

      transactions.forEach((tx) => {
        addresses.push(tx.address);
        const weiAmount = ethers.utils.parseEther(tx.amount.toString());
        amounts.push(weiAmount);
        totalValue = totalValue.add(weiAmount);
      });

      const txResponse = await contract.multisend(addresses, amounts, { value: totalValue });
      return txResponse;
    } catch (error) {
      console.error('Error sending batch transaction:', error);
      throw error;
    }
  };

  const handleSend = () => {
    try {
      const transactions = parseTransactions(inputTx);
      if (transactions.length === 0) {
        alert('Please enter at least one transaction!');
        return;
      }

      let contentHTML = '<ul class="space-y-2">';
      transactions.forEach((tx) => {
        contentHTML += `<li class="border border-neutral-700 p-2 rounded bg-black">Address: <span class="text-white">${tx.address}</span> | Amount: <span class="text-white">${tx.amount}</span></li>`;
      });
      contentHTML += '</ul>';

      setModalContent(contentHTML);
      setIsModalOpen(true);
    } catch (error) {
      alert(`Error parsing transactions: ${error.message}`);
    }
  };

  const confirmTransaction = async () => {
    setIsModalOpen(false);
    setResult('<p>Sending batch transaction...</p>');

    try {
      const transactions = parseTransactions(inputTx);
      const txResponse = await sendBatchTransaction(transactions);
      setResult(`<p class="text-white">Batch transaction sent: <a href="https://testnet.monadexplorer.com/tx/${txResponse.hash}" target="_blank" rel="noopener noreferrer" class="underline hover:text-neutral-400">View on Explorer</a></p>`);
    } catch (error) {
      setResult(`<p class="text-neutral-500">Error: ${error.message}</p>`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Monad Mass Sender
        </h1>
        <button
          onClick={connectWallet}
          className="border border-neutral-700 font-medium px-6 py-3 rounded-lg transition duration-300 hover:bg-white hover:text-black hover:border-white"
        >
          {currentAccount ? (
            <span>Connected: {`${currentAccount.slice(0, 7)}...`}</span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <label htmlFor="inputTx" className="block text-lg font-medium mb-2 text-neutral-400">
          Enter address and amount (format: address, amount)
        </label>
        <textarea
          id="inputTx"
          value={inputTx}
          onChange={(e) => setInputTx(e.target.value)}
          className="w-full p-4 bg-black border border-neutral-700 rounded-lg focus:outline-none focus:border-white resize-none font-mono text-sm text-white placeholder-neutral-500"
          rows="6"
          placeholder={`0xABC123..., 10\n0xDEF456..., 5`}
        ></textarea>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="w-full border border-neutral-700 px-6 py-4 rounded-lg font-medium transition duration-300 hover:bg-white hover:text-black hover:border-white"
      >
        Send Coins
      </button>

      {/* Result Container */}
      <div
        id="result"
        className="mt-6 space-y-4 text-neutral-400"
        dangerouslySetInnerHTML={{ __html: result }}
      ></div>

      {/* Modal Popup for Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg w-11/12 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Confirm Transaction
            </h2>
            <div
              id="modalContent"
              className="max-h-60 overflow-y-auto mb-4 space-y-2 text-neutral-400"
              dangerouslySetInnerHTML={{ __html: modalContent }}
            ></div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="border border-neutral-700 px-4 py-2 rounded-lg transition duration-300 hover:border-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransaction}
                className="bg-white text-black px-4 py-2 rounded-lg transition duration-300 hover:bg-neutral-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}