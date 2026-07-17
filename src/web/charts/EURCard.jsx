


// EURCard.jsx
import React, { useEffect, useRef, memo } from "react";

function EURCard() {
  const container = useRef();

  useEffect(() => {
    // Purane widget ko clear karna zaroori hai memory leak bachane ke liye
    if (container.current) {
      container.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": "FX:EURUSD",
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en",
      "width": "100%",
      "height": "126" // Fixed inner height
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="relative bg-[#05070a] rounded-[2rem] border border-blue-500/20 shadow-2xl overflow-hidden transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group">
      
      {/* Blue Accent Line - Animated on Hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 group-hover:via-blue-400 transition-all duration-700" />
        
      <div className="p-5">
        <div 
          className="tradingview-widget-container flex flex-col items-center" 
          ref={container}
          style={{ 
            height: "150px", // Exact container height
            overflow: "hidden" // Forcefully hide any scrollbars
          }}
        >
          <div className="tradingview-widget-container__widget"></div>
        </div>

        {/* Attribution Link Styled - Slightly pulled up to avoid overflow */}
        <div className="text-center mt-[-10px] relative z-10">
          <a
            href="https://www.tradingview.com/symbols/FX-EURUSD/"
            rel="noopener nofollow"
            target="_blank"
            className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-blue-500 transition-colors duration-300"
          >
            Market <span className="text-blue-600/50">Live</span> Terminal
          </a>
        </div>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-600/5 blur-[40px] pointer-events-none" />

      {/* Extra CSS to ensure the widget's iframe doesn't scroll */}
      <style>{`
        .tradingview-widget-container iframe {
          overflow: hidden !important;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default memo(EURCard);