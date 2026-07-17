import { useState, useEffect } from "react";
import { ArrowRight, X, Clock, TrendingUp } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
export default function TradeSuccessModal({
  isOpen,
  onClose,
  message,
  coinSymbol,
  tradeAmount,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowConfetti(true);

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const defaultMessage = "Your Mining Reward was executed successfully!";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm">
      {showConfetti && <Confetti />}
      <div className="relative w-full max-w-md bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-md">
              <TrendingUp className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-white">Mining Reward!</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-center flex flex-col items-center">
            <DotLottieReact
            src="https://lottie.host/4e10135e-414d-4861-90c3-09ab818ba484/vim8PySSSG.lottie"
            loop
            autoplay
          />
          <p className="text-gray-300 text-lg my-2">
            {message || defaultMessage}
          </p>
        

          <div className="flex items-center text-sm text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              Mining Reward Completed At {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
          >
            View Portfolio
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Confetti component (same as before)
const Confetti = () => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-cyan-500",
  ];

  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.floor(Math.random() * 8) + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 1.5,
    duration: 1 + Math.random() * 2,
    animation: Math.random() > 0.5 ? "fall" : "float",
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute rounded-sm ${piece.color} ${
            piece.animation === "fall"
              ? "animate-fall-confetti"
              : "animate-float-confetti"
          }`}
          style={{
            left: piece.left,
            top: `-${piece.size}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};
