import React, { useEffect, useRef } from 'react'

/**
 * TradingView Top Stories (News) Widget
 * Docs: https://www.tradingview.com/widget-docs/widgets/news/top-stories/
 * Shows live market news from TradingView — all symbols feed
 */
const TradingViewTopStories = ({ isDark = true, height = 550 }) => {
  const container = useRef(null)

  useEffect(() => {
    if (!container.current) return

    container.current.innerHTML = ''

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      feedMode: 'all_symbols',    // All symbols news feed
      isTransparent: true,
      displayMode: 'regular',
      width: '100%',
      height: height,
      colorTheme: isDark ? 'dark' : 'light',
      locale: 'en'
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

export default TradingViewTopStories
