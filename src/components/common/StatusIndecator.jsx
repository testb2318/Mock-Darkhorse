import React from 'react';

const StatusIndicator = ({ status, activeText, inactiveText }) => {
  const isActive = status === 'active' || status === 'unblock';
  
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${
        isActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-rose-400 shadow-sm shadow-rose-400/50'
      }`} />
      <span className={`text-sm font-medium ${
        isActive ? 'text-emerald-400' : 'text-rose-400'
      }`}>
        {isActive ? activeText : inactiveText}
      </span>
    </div>
  );
};

export default StatusIndicator;