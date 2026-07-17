// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "displayMode": "regular",
        "feedMode": "market",
        "colorTheme": "dark",
        "isTransparent": false,
        "locale": "en",
        "market": "crypto",
        "width": "100%",
        "height": 650
      }`;
    container.current.appendChild(script);
  }, []);

  return (
    <div
      className="w-full bg-[#1a1a1a] rounded-xl 
        shadow-[inset_6px_6px_12px_rgba(0,255,0,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)] 
        hover:shadow-[inset_6px_6px_12px_rgba(255,0,0,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)] 
        transition-all duration-300 
        p-4"
    >
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
