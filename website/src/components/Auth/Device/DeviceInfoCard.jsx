import React from 'react';

export default function DeviceInfoCard({ device, location, ip }) {
  return (
    <div className="device-info-card">
      <h4 className="device-info-title">Device Information</h4>
      
      <div className="device-info-list">
        <div className="device-info-item">
          <span className="device-info-label">Device:</span>
          <span className="device-info-value">{device.type} - {device.model}</span>
        </div>
        
        <div className="device-info-item">
          <span className="device-info-label">Browser:</span>
          <span className="device-info-value">{device.browser}</span>
        </div>
        
        <div className="device-info-item">
          <span className="device-info-label">Operating System:</span>
          <span className="device-info-value">{device.os}</span>
        </div>
        
        <div className="device-info-item">
          <span className="device-info-label">Location:</span>
          <span className="device-info-value">{location.city}, {location.country}</span>
        </div>
        
        <div className="device-info-item">
          <span className="device-info-label">IP Address:</span>
          <span className="device-info-value">{ip}</span>
        </div>
      </div>

      <div className="device-trust-indicator">
        <div className={`trust-badge ${device.isTrusted ? 'trusted' : 'untrusted'}`}>
          {device.isTrusted ? '✓ Trusted Device' : '⚠️ New Device'}
        </div>
      </div>
    </div>
  );
}
