import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, X } from 'lucide-react';

export default function UsageLimitModal({totalLimit, usedLimit}) {
  
  const [showModal, setShowModal] = useState(false);

  const usagePercentage = (usedLimit / totalLimit) * 100;
  const shouldShowWarning = usagePercentage >= 90;

  useEffect(() => {
    if (shouldShowWarning) {
      setShowModal(true);
    }
  }, [shouldShowWarning]);

  const handleUpgrade = () => {
    alert('Redirecting to upgrade page...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
 

      {/* Warning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse">
                    <AlertTriangle className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold">Limit Warning</h3>
                    <p className="text-white/90 text-sm font-medium">Action Required</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Usage Stats */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-semibold text-sm">Usage Status</span>
                  <span className="text-orange-600 font-bold text-lg">{usagePercentage.toFixed(1)}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-4 bg-white rounded-full overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-gray-600 font-medium">{usedLimit.toLocaleString()} used</span>
                  <span className="text-gray-600 font-medium">{totalLimit.toLocaleString()} total</span>
                </div>
              </div>

              {/* Warning Message */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-gray-900 font-bold text-lg mb-1">
                      90% Limit Reached!
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      You've used {usagePercentage.toFixed(1)}% of your plan limit. 
                      Upgrade now to ensure uninterrupted service and unlock additional features.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-purple-900 font-semibold text-sm mb-2">Upgrade Benefits:</p>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    <span>Higher usage limits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    <span>Priority support access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    <span>Advanced features unlocked</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}