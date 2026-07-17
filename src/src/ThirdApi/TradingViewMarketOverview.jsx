import React, { useEffect, useRef } from 'react'

/**
 * TradingView Market Overview Widget
 * Docs: https://www.tradingview.com/widget-docs/widgets/watchlists/market-overview/
 * Shows: Indices, Stocks, Crypto, Forex tabs with live prices
 */
const TradingViewMarketOverview = ({ isDark = true, height = 550 }) => {
  const container = useRef(null)

  useEffect(() => {
    if (!container.current) return

    // Clear previous widget
    container.current.innerHTML = ''

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    container.current.appendChild(widgetDiv)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: isDark ? 'dark' : 'light',
      dateRange: '12M',
      showChart: true,
      locale: 'en',
      largeChartUrl: '',
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      width: '100%',
      height: height,
      plotLineColorGrowing: 'rgba(41, 196, 115, 1)',
      plotLineColorFalling: 'rgba(255, 74, 104, 1)',
      gridLineColor: 'rgba(142, 111, 62, 0.1)',
      scaleFontColor: 'rgba(212, 175, 55, 0.6)',
      belowLineFillColorGrowing: 'rgba(41, 196, 115, 0.12)',
      belowLineFillColorFalling: 'rgba(255, 74, 104, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(41, 196, 115, 0)',
      belowLineFillColorFallingBottom: 'rgba(255, 74, 104, 0)',
      symbolActiveColor: 'rgba(212, 175, 55, 0.15)',
      tabs: [
        {
          title: 'Indices',
          symbols: [
            { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
            { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
            { s: 'FOREXCOM:DJI',    d: 'Dow Jones' },
            { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100' },
            { s: 'OANDA:EURUSD',    d: 'EUR/USD' }
          ],
          originalTitle: 'Indices'
        },
        {
          title: 'Stocks',
          symbols: [
            { s: 'NASDAQ:AAPL', d: 'Apple' },
            { s: 'NASDAQ:ADBE', d: 'Adobe' },
            { s: 'NASDAQ:NVDA', d: 'NVIDIA' },
            { s: 'NASDAQ:TSLA', d: 'Tesla' }
          ],
          originalTitle: 'Stocks'
        },
        {
          title: 'Crypto',
          symbols: [
            { s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
            { s: 'BITSTAMP:ETHUSD', d: 'Ethereum' },
            { s: 'CRYPTO:XRPUSD',  d: 'XRP' }
          ],
          originalTitle: 'Crypto'
        },
        {
          title: 'Forex',
          symbols: [
            { s: 'OANDA:EURUSD',       d: 'EUR/USD' },
            { s: 'OANDA:GBPUSD',       d: 'GBP/USD' },
            { s: 'FX:USDJPY',          d: 'USD/JPY' },
            { s: 'OANDA:NZDUSD',       d: 'NZD/USD' },
            { s: 'OANDA:EURGBP',       d: 'EUR/GBP' },
            { s: 'PEPPERSTONE:NAS100', d: 'NAS100' },
            { s: 'CBOE:VIX',           d: 'VIX' }
          ],
          originalTitle: 'Forex'
        }
      ]
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) container.current.innerHTML = ''
    }
  }, [isDark, height])

  return (
    <div
      className="tradingview-widget-container w-full"
      ref={container}
      style={{ minHeight: height }}
    />
  )
}

export default TradingViewMarketOverview
