import React from 'react';
import LoginMethodCard from './LoginMethodCard';

export default function LoginMethodSelector({ selectedMethod, onMethodChange, availableMethods }) {
  return (
    <div className="login-method-selector">
      <h3 className="login-method-title">Select Login Method</h3>
      <div className="login-method-grid">
        {availableMethods.map((method) => (
          <LoginMethodCard
            key={method}
            method={method}
            selected={selectedMethod === method}
            onSelect={onMethodChange}
          />
        ))}
      </div>
    </div>
  );
}
