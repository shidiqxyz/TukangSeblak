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

      // Fetch saldo dari LCD
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
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Keplr Nillion Wallet</title>
        <meta
          name="description"
          content="Cek saldo wallet Keplr pada jaringan Nillion"
        />
      </Head>

      <Header />

      <main className="bg-gray-900 text-gray-300 flex-grow flex flex-col items-center justify-center px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Keplr Nillion Wallet</h2>
        <button
          onClick={connectKeplr}
          className={`${
            isConnected ? "bg-white text-gray-900" : "bg-blue-500 hover:bg-blue-600 text-white"
          } font-bold py-2 px-4 rounded`}
          disabled={isConnected}
        >
          {isConnected ? "Connected" : "Connect Keplr"}
        </button>
        <div className="mt-4">
          {walletAddress && (
            <p id="walletAddress" className="text-lg mb-2">
              Wallet: {walletAddress}
            </p>
          )}
          {balance && (
            <p id="balance" className="text-lg">
              Balance: {balance}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
