import React, { useEffect, useRef, memo } from 'react';

function TickerTape() {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    // Remove existing widget script to avoid duplicates
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
    {
      "symbols": [
        {"proName":"FOREXCOM:SPXUSD","title":"S&P 500 Index"},
        {"proName":"FOREXCOM:NSXUSD","title":"US 100 Cash CFD"},
        {"proName":"FX_IDC:EURUSD","title":"EUR to USD"},
        {"proName":"BITSTAMP:BTCUSD","title":"Bitcoin"},
        {"proName":"BITSTAMP:ETHUSD","title":"Ethereum"}
      ],
      "colorTheme":"dark",
      "locale":"en",
      "largeChartUrl":"",
      "isTransparent":false,
      "showSymbolLogo":true,
      "displayMode":"adaptive"
    }`;
    
    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container rounded-xl shadow-[inset_6px_6px_12px_rgba(0,86,162,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)]" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="text-blue-500">Ticker tape by TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TickerTape);
