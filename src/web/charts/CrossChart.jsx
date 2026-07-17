// CrossChart.jsx
import React, { useEffect, useRef, memo } from "react";

function CrossChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Cleanup: refresh/re-render hone par purana chart remove ho jaye
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "dark",
        "isTransparent": false,
        "locale": "en",
        "currencies": [
          "EUR",
          "USD",
          "JPY",
          "GBP",
          "CHF",
          "AUD",
          "CAD",
          "NZD",
          "CNY"
        ],
        "backgroundColor": "#0F0F0F",
        "width": "100%",
        "height": "550"
      }`;

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-[#1a1a1a] rounded-xl shadow-[inset_6px_6px_12px_rgba(0,86,162,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)] p-4">
      <div
        className="tradingview-widget-container"
        ref={containerRef}
      >
        <div className="tradingview-widget-container__widget" />
        <div className="text-center text-gray-400 text-xs mt-2">
          <a
            href="https://www.tradingview.com/markets/currencies/cross-rates-overview-prices/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            Forex market by TradingView
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(CrossChart);
