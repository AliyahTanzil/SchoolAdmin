import React from 'react';

export default function ProgressBar({ currentStep, totalSteps, showLabel = true, className = '' }) {
  const progress = (currentStep / totalSteps) * 100;
  const percentage = Math.round(progress);

  return (
    <div className={`progress-bar-container ${className}`}>
      {showLabel && (
        <div className="progress-label">
          Step {currentStep} of {totalSteps}
        </div>
      )}
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <div className="progress-percentage">{percentage}%</div>
      )}
    </div>
  );
}
