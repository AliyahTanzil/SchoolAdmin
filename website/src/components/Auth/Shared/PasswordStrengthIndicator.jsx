import React, { useEffect } from 'react';

export default function PasswordStrengthIndicator({ password, onStrengthChange }) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback([]);
      onStrengthChange?.(0);
      return;
    }

    let score = 0;
    const newFeedback = [];

    // Length check
    if (password.length >= 8) {
      score += 25;
      newFeedback.push('8+ characters');
    } else {
      newFeedback.push('Minimum 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 25;
      newFeedback.push('Uppercase letter');
    } else {
      newFeedback.push('Uppercase letter');
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 25;
      newFeedback.push('Number');
    } else {
      newFeedback.push('Number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 25;
      newFeedback.push('Special character');
    } else {
      newFeedback.push('Special character');
    }

    setStrength(score);
    setFeedback(newFeedback);
    onStrengthChange?.(score);
  }, [password, onStrengthChange]);

  const getStrengthLabel = () => {
    if (strength === 0) return 'Very Weak';
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength === 0) return '#e53e3e';
    if (strength <= 25) return '#ed8936';
    if (strength <= 50) return '#ecc94b';
    if (strength <= 75) return '#48bb78';
    return '#38a169';
  };

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div 
          className="strength-fill" 
          style={{ 
            width: `${strength}%`, 
            backgroundColor: getStrengthColor() 
          }}
        />
      </div>
      <div className="strength-info">
        <span className="strength-label">Strength: {getStrengthLabel()}</span>
        <div className="strength-requirements">
          {feedback.map((item, index) => (
            <span key={index} className={`requirement ${password && /[A-Z]/.test(item) ? 'met' : ''}`}>
              {item.startsWith('Minimum') || item.startsWith('Uppercase') || item.startsWith('Number') || item.startsWith('Special') ? '✓' : '•'} {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
