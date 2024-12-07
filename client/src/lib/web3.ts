import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function checkMetaMask(): boolean {
  if (!window.ethereum) {
    return false;
  }
  return true;
}

export async function connectWallet(): Promise<string> {
  if (!checkMetaMask()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // Handle disconnection
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
      } else {
        // Handle account change
        window.dispatchEvent(new CustomEvent('walletAccountChanged', {
          detail: { account: accounts[0] }
        }));
      }
    });

    // Listen for chain changes
    window.ethereum.on('chainChanged', (_chainId: string) => {
      // Handle chain change by reloading the page as recommended by MetaMask
      window.location.reload();
    });

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("User rejected the connection request");
    }
    throw new Error("Failed to connect wallet: " + (error.message || "Unknown error"));
  }
}

export async function getAccount(): Promise<string | null> {
  if (!checkMetaMask()) return null;

  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting account:", error);
    return null;
  }
}

export function getProvider() {
  if (!checkMetaMask()) throw new Error("MetaMask is not installed");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function disconnectWallet(): Promise<void> {
  if (window.ethereum) {
    // Remove event listeners
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
    
    // Clear any cached provider state
    window.ethereum = null;
    
    // Dispatch disconnection event
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  }
}
