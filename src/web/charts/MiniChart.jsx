// MiniChart.jsx
import React, { useEffect, useRef, memo } from "react";

function MiniChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Cleanup old script before adding a new one
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "dark",
        "dateRange": "12M",
        "locale": "en",
        "isTransparent": false,
        "showFloatingTooltip": false,
        "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
        "plotLineColorFalling": "rgba(41, 98, 255, 1)",
        "gridLineColor": "rgba(240, 243, 250, 0)",
        "scaleFontColor": "#DBDBDB",
        "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
        "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
        "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
        "tabs": [
          {
            "title": "Forex",
            "symbols": [
              {
                "s": "CMCMARKETS:USDJPY",
                "d": "USDJPY",
                "base-currency-logoid": "country/US",
                "currency-logoid": "country/JP"
              },
              {
                "s": "FX:EURUSD",
                "d": "EURUSD",
                "base-currency-logoid": "country/EU",
                "currency-logoid": "country/US"
              },
              {
                "s": "OANDA:GBPUSD",
                "d": "GBPUSD",
                "base-currency-logoid": "country/GB",
                "currency-logoid": "country/US"
              },
              {
                "s": "OANDA:NZDJPY",
                "d": "NZDJPY",
                "base-currency-logoid": "country/NZ",
                "currency-logoid": "country/JP"
              },
              {
                "s": "BITSTAMP:BTCUSD",
                "d": "Gold",
                "logoid": "metal/gold",
                "currency-logoid": "country/US"
              }
            ],
            "originalTitle": "Forex"
          }
        ],
        "support_host": "https://www.tradingview.com",
        "backgroundColor": "#0f0f0f",
        "width": "100%",
        "height": "550",
        "showSymbolLogo": true,
        "showChart": true
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
            href="https://www.tradingview.com/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            Market data by TradingView
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(MiniChart);
