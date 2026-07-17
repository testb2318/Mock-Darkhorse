import React from 'react';

const ActionButton = ({ onClick, icon: Icon, className, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 transition-all duration-300 rounded-lg hover:scale-105 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Icon />
    </button>
  );
};

export default ActionButton;