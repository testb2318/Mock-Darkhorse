import React, { useEffect, useRef } from 'react'

/**
 * TradingView Single Ticker Widget
 * Docs: https://www.tradingview.com/widget-docs/widgets/tickers/single-ticker/
 * Shows one symbol's live price, change, and mini sparkline
 */
const TradingViewSingleTicker = ({ symbol = 'OANDA:EURUSD', isDark = true }) => {
  const container = useRef(null)

  useEffect(() => {
    if (!container.current) return

    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol,
      width: '100%',
      isTransparent: true,
      colorTheme: isDark ? 'dark' : 'light',
      locale: 'en'
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) container.current.innerHTML = ''
    }
  }, [symbol, isDark])

  return (
    <div className="tradingview-widget-container w-full" ref={container} />
  )
}

export default TradingViewSingleTicker
