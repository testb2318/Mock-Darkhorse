// ViewChart.jsx
import React, { useEffect, useRef, memo } from "react";
import { Activity, ShieldCheck, Gauge, Zap, ChevronRight } from "lucide-react";

function ViewChart() {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1m",
        "width": "100%",
        "isTransparent": true,
        "height": "420",
        "symbol": "BITSTAMP:BTCUSD",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
      }`;

    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full px-1 py-4">
      {/* --- Outer Neon Frame --- */}
      <div className="relative group p-[1px] rounded-[2.5rem] bg-gradient-to-tr from-blue-600/30 via-transparent to-blue-400/20 shadow-2xl transition-all duration-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]">
        
        {/* Inner Glass Container */}
        <div className="relative bg-[#020617] rounded-[2.45rem] overflow-hidden">
          
          {/* Header Area: Tactical Display */}
          <div className="relative px-8 py-6 border-b border-white/5 bg-gradient-to-b from-blue-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] group-hover:scale-110 transition-transform duration-500">
                  <Gauge className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">
                    Asset <span className="text-blue-500">Verdict</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap size={10} className="text-yellow-500 fill-yellow-500" /> XAUUSD Intelligence
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Live Node</span>
              </div>
            </div>
          </div>

          {/* Analysis Area: The Gauge Widget */}
          <div className="p-6 relative">
            {/* Background Glow behind the gauge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 blur-[80px] pointer-events-none"></div>
            
            <div className="relative rounded-[2rem] bg-black/40 border border-white/5 p-4 shadow-inner group/gauge">
              <div
                className="tradingview-widget-container w-full"
                ref={container}
              >
                <div className="tradingview-widget-container__widget"></div>
              </div>
            </div>
          </div>

          {/* Tactical Bottom Bar */}
          <div className="px-8 py-5 border-t border-white/5 bg-[#01040a] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Accuracy</span>
                <span className="text-[10px] font-bold text-blue-500 italic">Neural Sync v.1</span>
              </div>
              <div className="w-[px] h-6 bg-white/5"></div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Feed</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase">1M Scale</span>
              </div>
            </div>

            <div className="flex items-center gap-2 group/btn cursor-pointer">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover/btn:text-blue-400 transition-all">Details</span>
              <ChevronRight size={14} className="text-slate-600 group-hover/btn:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Futuristic Corner Guards */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-blue-600/30 rounded-tl-[2.5rem] pointer-events-none group-hover:border-blue-600 transition-all"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-blue-600/30 rounded-br-[2.5rem] pointer-events-none group-hover:border-blue-600 transition-all"></div>

        </div>
      </div>
    </div>
  );
}

export default memo(ViewChart);