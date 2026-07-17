import React, { useEffect, useRef } from 'react'

/**
 * TradingView Ticker Tape Widget
 * Docs: https://www.tradingview.com/widget/#ticker
 * Shows a scrolling live ticker bar of major symbols
 */
const TradingViewTicker = ({ isDark = true }) => {
  const container = useRef(null)

  useEffect(() => {
    if (!container.current) return

    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'BITSTAMP:BTCUSD', title: 'BTC/USD' },
        { proName: 'BITSTAMP:ETHUSD', title: 'ETH/USD' },
        { proName: 'OANDA:EURUSD',    title: 'EUR/USD' },
        { proName: 'OANDA:GBPUSD',    title: 'GBP/USD' },
        { proName: 'FX:USDJPY',       title: 'USD/JPY' },
        { proName: 'NASDAQ:AAPL',     title: 'AAPL' },
        { proName: 'NASDAQ:NVDA',     title: 'NVDA' },
        { proName: 'NASDAQ:TSLA',     title: 'TSLA' },
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
        { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
        { proName: 'CBOE:VIX',        title: 'VIX' },
        { proName: 'CRYPTO:XRPUSD',   title: 'XRP/USD' }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: isDark ? 'dark' : 'light',
      locale: 'en'
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) container.current.innerHTML = ''
    }
  }, [isDark])

  return (
    <div className="tradingview-widget-container w-full" ref={container} />
  )
}

export default TradingViewTicker
