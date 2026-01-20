'use client'

import Head from "next/head";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Home() {
  const chainId = "nillion-1";
  const rpcUrl = "https://rpc-nillion.keplr.app";
  const lcdUrl = "https://lcd-nillion.keplr.app";

  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  async function suggestChain() {
    if (!window.keplr) {
      alert("Keplr extension is not installed!");
      return;
    }
    try {
      await window.keplr.experimentalSuggestChain({
        chainId: chainId,
        chainName: "Nillion",
        rpc: rpcUrl,
        rest: lcdUrl,
        stakeCurrency: {
          coinDenom: "NIL",
          coinMinimalDenom: "unil",
          coinDecimals: 6,
        },
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "nillion",
          bech32PrefixAccPub: "nillionpub",
          bech32PrefixValAddr: "nillionvaloper",
          bech32PrefixValPub: "nillionvaloperpub",
          bech32PrefixConsAddr: "nillionvalcons",
          bech32PrefixConsPub: "nillionvalconspub",
        },
        currencies: [
          {
            coinDenom: "NIL",
            coinMinimalDenom: "unil",
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "NIL",
            coinMinimalDenom: "unil",
            coinDecimals: 6,
          },
        ],
        features: [],
      });
    } catch (error) {
      console.error("Error adding chain:", error);
      alert("Failed to add Nillion chain to Keplr");
    }
  }

  async function connectKeplr() {
    if (!window.keplr) {
      alert("Keplr extension is not installed!");
      return;
    }

    await suggestChain();

    try {
      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const wallet = accounts[0].address;
      setWalletAddress(wallet);

      const response = await fetch(
        `${lcdUrl}/cosmos/bank/v1beta1/balances/${wallet}`
      );
      const data = await response.json();
      const walletBalance =
        data.balances && data.balances.length > 0
          ? data.balances[0].amount + " NIL"
          : "0 NIL";
      setBalance(walletBalance);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to Keplr");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Head>
        <title>Keplr Nillion Wallet</title>
        <meta
          name="description"
          content="Check Keplr wallet balance on Nillion network"
        />
      </Head>

      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Keplr Nillion Wallet</h2>
          <button
            onClick={connectKeplr}
            className={`w-full border border-neutral-700 font-medium py-3 px-4 rounded-lg transition ${isConnected
                ? "bg-white text-black border-white"
                : "hover:bg-white hover:text-black hover:border-white"
              }`}
            disabled={isConnected}
          >
            {isConnected ? "Connected" : "Connect Keplr"}
          </button>
          <div className="mt-6 space-y-4">
            {walletAddress && (
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-sm text-neutral-400">Wallet</p>
                <p id="walletAddress" className="text-sm font-mono text-white break-all">
                  {walletAddress}
                </p>
              </div>
            )}
            {balance && (
              <div className="p-4 bg-black border border-neutral-800 rounded-lg">
                <p className="text-sm text-neutral-400">Balance</p>
                <p id="balance" className="text-lg font-bold text-white">
                  {balance}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
