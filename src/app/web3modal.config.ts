'use client'

import React, { useEffect, useState } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from '@web3modal/ethers/react';
import { BrowserProvider } from 'ethers';
import { CHAINS } from './config/constants/chains'
import { showSuccessToast, showErrorToast, showInfoToast, showLoadingToast } from "./utils/notify";

// Your WalletConnect project ID - get it from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2a82896056cb711d72df1bc4eae0e2d4'

// Metadata for your app
const metadata = {
  name: 'Capy Dapp',
  description: 'Capy Project',
  url: 'https://capy.fun', // Update with your app's URL
  icons: ['https://capy.fun/icon.png'] // Update with your app's icon
}

// Ethers configuration
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: CHAINS[0]?.chainId,
});

// Initialize the Web3Modal
createWeb3Modal({
  ethersConfig,
  chains: [CHAINS[0]], // Use all your configured chains
  projectId,
  metadata,
  enableAnalytics: true, // Optional: Set to false to disable analytics
  themeVariables: {
    "--w3m-color-mix": "#000",
    "--w3m-color-mix-strength": 5,
    "--w3m-border-radius-master": "2px",
    "--w3m-accent": "rgba(81, 252, 139, 0.79)",
  },
})

// Hook to handle chain switching and adding
export const useChainManager = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId, isConnected } = useWeb3ModalAccount();
  const [currentChainId, setCurrentChainId] = useState(999);

  useEffect(() => {
    if (isConnected && chainId) {
      setCurrentChainId(999);
    }
  }, [chainId, isConnected]);

  // Function to add chain to user's wallet
  const addChainToWallet = async (chainConfig: any) => {
    if (!walletProvider) {
      throw new Error('Wallet not connected');
    }

    try {
      const provider = new BrowserProvider(walletProvider);

      // Convert chainId to hex format
      const chainIdHex = `0x${chainConfig.chainId.toString(16)}`;

      // Prepare chain parameters for wallet_addEthereumChain
      const chainParams = {
        chainId: chainIdHex,
        chainName: chainConfig.chainName,
        nativeCurrency: chainConfig.nativeCurrency,
        rpcUrls: chainConfig.rpcUrls,
        blockExplorerUrls: chainConfig.blockExplorerUrls,
      };

      // Request to add the chain
      await provider.send('wallet_addEthereumChain', [chainParams]);

      showSuccessToast(`Successfully added ${chainConfig.chainName} to wallet`);
      return true;
    } catch (error: any) {
      showErrorToast('Failed to add chain:', error);

      // Handle specific error cases
      if (error.code === 4902) {
        showErrorToast('Chain not supported by wallet')
        throw new Error('Chain not supported by wallet');
      } else if (error.code === 4001) {
        showErrorToast('User rejected the request')
        throw new Error('User rejected the request');
      } else {
        showErrorToast(`Failed to add chain: ${error.message}`)
        throw new Error(`Failed to add chain: ${error.message}`);
      }
    }
  };

  // Function to switch to a specific chain
  const switchToChain = async (targetChainId: number) => {
    if (!walletProvider) {
      throw new Error('Wallet not connected');
    }

    try {
      const provider = new BrowserProvider(walletProvider);
      const chainIdHex = `0x${targetChainId.toString(16)}`;

      // Try to switch chain first
      await provider.send('wallet_switchEthereumChain', [
        { chainId: chainIdHex }
      ]);

      showSuccessToast(`Successfully switched to chain ${targetChainId}`);
      return true;
    } catch (error: any) {
      console.error('Failed to switch chain:', error);

      // If chain doesn't exist in wallet (error code 4902), try to add it
      if (error.code === 4902) {
        const chainConfig = CHAINS.find(chain => chain.chainId === targetChainId);
        if (chainConfig) {
          await addChainToWallet(chainConfig);
          // After adding, try to switch again
          return await switchToChain(targetChainId);
        } else {
          throw new Error('Chain configuration not found');
        }
      } else if (error.code === 4001) {
        showErrorToast('User rejected the request')


        throw new Error('User rejected the request');
      } else {
        showErrorToast(`Failed to add chain: ${error.message}`)

        throw new Error(`Failed to switch chain: ${error.message}`);
      }
    }
  };

  // Function to check if current chain is supported
  const isChainSupported = (chainId: number) => {
    return CHAINS.some(chain => chain.chainId === chainId);
  };

  // Function to get chain details
  const getChainDetails = (chainId: number) => {
    return CHAINS.find(chain => chain.chainId === chainId);
  };

  return {
    currentChainId,
    addChainToWallet,
    switchToChain,
    isChainSupported,
    getChainDetails,
    supportedChains: CHAINS,
  };
};
