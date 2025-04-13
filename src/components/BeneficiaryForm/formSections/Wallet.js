import { useState } from 'react';
import { ethers } from 'ethers';

export default function WalletSection({ formData, setFormData }) {
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (!window.ethereum) {
        window.open('https://metamask.io/download.html', '_blank');
        return;
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setFormData(prev => ({
        ...prev,
        walletAddress: address
      }));
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="form-section">
      <h3>Wallet Connection</h3>
      <div className="form-group">
        <label>Your Wallet Address</label>
        <input
          type="text"
          value={formData.walletAddress || ""}
          readOnly
          placeholder="0x..."
        />
        <button 
          onClick={connectWallet}
          disabled={connecting || formData.walletAddress}
        >
          {connecting ? 'Connecting...' : 
           formData.walletAddress ? `Connected: ${formData.walletAddress.slice(0,6)}...` : 
           'Connect Metamask'}
        </button>
      </div>
    </div>
  );
}