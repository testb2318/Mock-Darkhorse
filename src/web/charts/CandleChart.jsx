// CandleChart.jsx
import React, { useEffect, useRef, memo } from "react";
import { Activity, TrendingUp, BarChart3, Maximize2, ShieldCheck } from "lucide-react";

function CandleChart({ height }) {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": "BITSTAMP:BTCUSD",
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#05070a",
        "gridColor": "rgba(59, 130, 246, 0.05)",
        "watchlist": [],
        "withdateranges": true,
        "studies": ["RSI@tv-basicstudies"],
        "autosize": true,
        "height": "${height}"
      }`;

    container.current.appendChild(script);
  }, [height]);

  return (
    <div className="w-full px-2 py-4">
      <div className="relative rounded-[2.5rem] bg-[#05070a] border border-yellow-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-yellow-500/40 group">
        
        {/* 1. Animated Glow Background */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-600/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-yellow-600/15 transition-all duration-700"></div>

        {/* 2. Cyberpunk Header Section */}
        <div className="relative px-6 py-5 border-b border-white/5 bg-gradient-to-b from-yellow-500/5 to-transparent">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-yellow-600/20 flex items-center justify-center border border-yellow-500/40 shadow-[0_0_15px_rgba(223, 217, 46, 0.2)]">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#05070a] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_#c0ae0c]"></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  Market <span className="text-gold-light">Intelligence</span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-[10px] font-black text-yellow-400 border border-yellow-500/20 tracking-widest">GOLD / USD</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">D1 Analysis</span>
                </div>
              </div>
            </div>

            {/* Right Side Stats/Badges */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                <ShieldCheck size={14} className="text-yellow-500" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified Feed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gold-medium600 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-105 transition-transform">
                <Maximize2 size={14} className="text-white" />
                <span className="text-[10px] font-black text-white uppercase">Fullscreen</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Chart Container */}
        <div className="p-4">
          <div className="relative rounded-3xl bg-black/40 border border-white/5 overflow-hidden shadow-inner">
            <div
              className="tradingview-widget-container w-full"
              ref={container}
            >
              <div className="tradingview-widget-container__widget"></div>
            </div>
            
            {/* Custom Overlay Bottom Right */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#05070a]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 z-10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-white uppercase tracking-tighter">Engine: TV-Advanced</span>
            </div>
          </div>
        </div>

        {/* 4. Footer Info Bar */}
        <div className="px-8 pb-6 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Timeframe</span>
                <span className="text-[10px] font-bold text-yellow-400">24H / Daily</span>
             </div>
             <div className="w-[1px] h-6 bg-white/10"></div>
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Indicators</span>
                <span className="text-[10px] font-bold text-yellow-400">RSI / Volume</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-slate-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Analytics Stream</span>
          </div>
        </div>

        {/* Futuristic Corner Corner Guards */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-yellow-600/30 rounded-tl-[2.5rem] pointer-events-none group-hover:border-yellow-600 transition-all"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-yellow-600/30 rounded-br-[2.5rem] pointer-events-none group-hover:border-yellow-600 transition-all"></div>
      </div>
    </div>
  );
}

export default memo(CandleChart);