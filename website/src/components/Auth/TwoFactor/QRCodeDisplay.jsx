import React, { useState } from 'react';

export default function QRCodeDisplay({ qrCode, manualCode, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(manualCode);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="qr-code-display">
      <h4 className="qr-code-title">Scan the QR code with your authenticator app</h4>
      
      <div className="qr-code-container">
        <div className="qr-code-image">
          {/* QR code would be rendered here using a QR code library */}
          <div className="qr-code-placeholder">
            <div className="qr-code-pattern">QR CODE</div>
          </div>
        </div>
      </div>

      <div className="manual-code-section">
        <p className="manual-code-label">Or enter code manually:</p>
        <div className="manual-code-display">
          <code>{manualCode}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="copy-button"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="qr-code-instructions">
        <h5>Instructions:</h5>
        <ol>
          <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
          <li>Open the app and tap "+" to add a new account</li>
          <li>Scan the QR code above</li>
          <li>Enter the 6-digit code to verify setup</li>
        </ol>
      </div>

      <div className="qr-code-help">
        <p>Can't scan? <button type="button" className="help-link">Enter code manually</button></p>
      </div>
    </div>
  );
}
