import React, { useState, useEffect } from "react";

export const has72HoursPassed = (startDate) => {
  const start = new Date(startDate).getTime();
  const now = new Date().getTime();
  const seventyTwoHours = 72 * 60 * 60 * 1000; 

  return now - start >= seventyTwoHours;
};
const Timer = ({ startDate = new Date() }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 72,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const end = start + 72 * 60 * 60 * 1000;
      const totalDuration = 72 * 60 * 60 * 1000;
      const difference = end - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const progressPercent = (difference / totalDuration) * 100;

        setTimeLeft({ hours, minutes, seconds });
        setProgress(progressPercent);
      } else {
        // Timer completed - restart automatically
        const newStart = new Date();
        setTimeLeft({ hours: 72, minutes: 0, seconds: 0 });
        setProgress(100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <div className="flex">
      <div className="relative">
        {/* Animated background circles */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "20s" }}
        >
          <div className="w-72 h-72 rounded-full border-4 border-dashed border-white/20"></div>
        </div>
        <div
          className="absolute inset-4 animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        >
          <div className="w-64 h-64 rounded-full border-2 border-dotted border-purple-300/30"></div>
        </div>

        {/* Main timer container */}
        <div className="relative bg-white/10 backdrop-blur-xl rounded-full w-72 h-72 flex flex-col items-center justify-center shadow-2xl border border-white/20">
          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="50%" stopColor="#4ecdc4" />
                <stop offset="100%" stopColor="#45b7d1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer content */}
          <div className="text-center z-10">
            <div className="text-white/60 text-sm font-medium mb-2 tracking-wider uppercase">
              Time Remaining
            </div>

            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-mono font-bold text-white animate-pulse">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="text-xs text-white/70">HRS</div>
              </div>

              <div
                className="text-white/50 text-xl font-bold animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                :
              </div>

              <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-mono font-bold text-white animate-pulse">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="text-xs text-white/70">MIN</div>
              </div>

              <div
                className="text-white/50 text-xl font-bold animate-bounce"
                style={{ animationDuration: "2s", animationDelay: "1s" }}
              >
                :
              </div>

              <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-mono font-bold text-white animate-pulse">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="text-xs text-white/70">SEC</div>
              </div>
            </div>

            {/* Progress percentage */}
            <div className="text-white/40 text-xs font-medium">
              {progress.toFixed(1)}% remaining
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-8 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
            <div
              className="absolute top-12 right-6 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-pink-300/30 rounded-full animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-16 right-8 w-1 h-1 bg-purple-300/40 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        </div>

        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default Timer;
