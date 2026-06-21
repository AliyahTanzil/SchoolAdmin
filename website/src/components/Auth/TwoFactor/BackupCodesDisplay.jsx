import React, { useState } from 'react';

export default function BackupCodesDisplay({ codes, onDownload, onCopy }) {
  const [copied, setCopied] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  return (
    <div className="backup-codes-display">
      <div className="backup-codes-warning">
        <div className="warning-icon">⚠️</div>
        <div className="warning-content">
          <h4>Important: Save your backup codes</h4>
          <p>These codes can be used to access your account if you lose your authenticator device. Save them in a secure location.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowCodes(!showCodes)}
        className="reveal-codes-button"
      >
        {showCodes ? 'Hide Codes' : 'Reveal Backup Codes'}
      </button>

      {showCodes && (
        <div className="backup-codes-list">
          {codes.map((code, index) => (
            <div key={index} className="backup-code-item">
              <code>{code}</code>
            </div>
          ))}
        </div>
      )}

      <div className="backup-codes-actions">
        <button type="button" onClick={handleCopyAll} className="action-button">
          {copied ? 'Copied!' : 'Copy All Codes'}
        </button>
        <button type="button" onClick={handleDownload} className="action-button">
          Download Codes
        </button>
      </div>

      <div className="backup-codes-info">
        <p>Each code can only be used once. Keep them safe and don't share them with anyone.</p>
      </div>
    </div>
  );
}
