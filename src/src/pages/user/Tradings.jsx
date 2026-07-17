// import React from "react";
// import CandleChart from "../../web/charts/CandleChart";
// const Tradings = () => {
//   return (
//     <div className="w-full bg-[#111111] rounded-xl p-4">
//       <h2 className="text-xl font-bold text-white mb-1">Gold Price Chart</h2>
//       <p className="text-base text-gray-300 mb-4">
//         This chart shows the historical daily price movement of XAU/USD (Gold vs
//         USD). You can change intervals, view details, and analyze trends.
//       </p>
//       <div className="w-full">
//         <CandleChart height={500} />
//       </div>
//     </div>
//   );
// };
// export default Tradings;













import React, { useState, useEffect } from "react";
import CandleChart from "../../web/charts/CandleChart";
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, Maximize2, Minimize2 } from "lucide-react";

const Tradings = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartHeight, setChartHeight] = useState(400);
  const [isMobile, setIsMobile] = useState(false);
  const [activeInterval, setActiveInterval] = useState("1D");

  // Check screen size for responsive adjustments
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Adjust chart height based on screen size
      if (mobile) {
        setChartHeight(300);
      } else if (window.innerWidth < 1024) {
        setChartHeight(380);
      } else {
        setChartHeight(450);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const intervals = ["1D", "1W", "1M", "3M", "1Y", "ALL"];
  
  const handleIntervalChange = (interval) => {
    setActiveInterval(interval);
    // You can pass this to your CandleChart component if it supports interval change
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Sample current price data (you can fetch from API)
  const currentPrice = 2350.75;
  const priceChange = 15.30;
  const priceChangePercent = 0.65;
  const isPositive = priceChange > 0;

  return (
    <div className={`w-full glass-card animated-border-gold rounded-xl sm:rounded-2xl transition-all duration-300 p-0.5 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
    }`}>
      <div className="bg-black/40 w-full h-full rounded-xl sm:rounded-[1.4rem] overflow-hidden flex flex-col">
      {/* Header Section - Responsive */}
      <div className="p-3 sm:p-4 md:p-5 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
              Gold Price Chart
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              XAU/USD - Live Price Movement
            </p>
          </div>
          
          {/* Price Stats - Responsive */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                ${currentPrice.toFixed(2)}
              </div>
              <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent}%)</span>
              </div>
            </div>
            
            {/* Fullscreen Button - Mobile Optimized */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all active:scale-95"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
        
        {/* Price Description - Hidden on very small screens */}
        <p className="text-xs sm:text-sm text-gray-400 mt-3 hidden sm:block">
          This chart shows the historical daily price movement of XAU/USD (Gold vs USD). 
          You can change intervals, view details, and analyze trends.
        </p>
      </div>
      
      {/* Interval Selection - Horizontal Scroll on Mobile */}
      <div className="px-3 sm:px-4 md:px-5 pt-3 sm:pt-4">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 custom-scroll">
          {intervals.map((interval) => (
            <button
              key={interval}
              onClick={() => handleIntervalChange(interval)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeInterval === interval
                  ? 'bg-gradient-to-r from-gold-dark to-gold-light text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-gold-medium hover:text-black hover:opacity-90'
              }`}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart Container - Responsive */}
      <div className="p-3 sm:p-4 md:p-5">
        <div className="w-full bg-black/40 rounded-xl overflow-hidden">
          <CandleChart height={chartHeight} interval={activeInterval} />
        </div>
      </div>
      
      {/* Chart Stats - Mobile Responsive Grid */}
      <div className="px-3 sm:px-4 md:px-5 pb-4 sm:pb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: "Open", value: "$2,345.20", change: "+0.2%" },
            { label: "High", value: "$2,365.80", change: "+0.8%" },
            { label: "Low", value: "$2,340.50", change: "-0.3%" },
            { label: "Volume", value: "24.5K", change: "+12%" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-2 sm:p-3">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-sm sm:text-base font-bold text-white">{item.value}</p>
              <p className={`text-[9px] sm:text-[10px] font-semibold ${
                item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.change}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Update Time - Footer */}
      <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
            <Calendar size={12} />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500">
            Data source: Live Market Feed
          </div>
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          height: 3px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,0.5);
          border-radius: 10px;
        }
        
        @media (max-width: 640px) {
          .custom-scroll::-webkit-scrollbar {
            height: 2px;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Tradings;