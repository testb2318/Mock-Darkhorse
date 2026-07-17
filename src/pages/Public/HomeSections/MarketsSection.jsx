import React, { useState, useRef } from 'react'
import Tilt from 'react-parallax-tilt'
import { BarChart3, TrendingUp, TrendingDown, Activity, Globe, Landmark, Coins } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import TradingViewTicker from '../../../ThirdApi/TradingViewTicker'
import TradingViewSingleTicker from '../../../ThirdApi/TradingViewSingleTicker'

// Standalone TradingView Advanced Chart Component
const TradingViewChart = ({ isDark }) => {
  const container = useRef()

  React.useEffect(() => {
    if (container.current) {
      container.current.innerHTML = ''

      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: 'NASDAQ:AAPL',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: isDark ? 'dark' : 'light',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        backgroundColor: isDark ? 'rgba(3, 3, 3, 0.7)' : 'rgba(253, 248, 239, 0.95)',
        gridColor: 'rgba(142, 111, 62, 0.15)',
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: 'tradingview_advanced_chart',
        calendar: false,
        support_host: 'https://www.tradingview.com'
      })
      container.current.appendChild(script)
    }
  }, [isDark])

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div id="tradingview_advanced_chart" className="w-full h-full"></div>
    </div>
  )
}

const cardImages = {
  forex:  '/images/img_4.jpg',
  stocks: '/images/img_1.jpg',
  crypto: '/images/img_19.jpg',
}

const MarketsSection = ({ marketsRef }) => {
  const [notification, setNotification] = useState(null)
  const { isDark } = useTheme()

  const triggerOrder = (symbol, action) => {
    setNotification(`Mock Order Dispatched: ${action} ${symbol} @ Market price. Executing...`)
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <section
      id="markets"
      ref={marketsRef}
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
            <BarChart3 className="w-3.5 h-3.5 text-gold-medium" /> Live Markets Feed
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
            Real-Time Asset Classes &amp; Advanced Live Terminal
          </h2>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
Track live price movements across Forex, Stocks, and Crypto — and explore 
market behavior interactively on our live-data terminal, built for 
learning and analysis.          </p>
        </div>

        {/* ─── TRADINGVIEW LIVE TICKER TAPE ─── */}
        <div className={`relative w-full rounded-xl overflow-hidden border mb-12 ${
          isDark ? 'bg-dark-900/50 border-gold-dark/15' : 'bg-[#f0e8d0]/60 border-gold-dark/20'
        }`}>
          <TradingViewTicker isDark={isDark} />
        </div>

        {/* Floating order notification */}
        {notification && (
          <div className="fixed top-24 right-8 z-50 p-4 rounded-xl border border-gold-medium/40 bg-dark-950/95 text-gold-light text-xs font-bold shadow-2xl animate-bounce flex items-center gap-2 glow-gold">
            <Activity className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
            {notification}
          </div>
        )}

        {/* ─── THREE CARDS: TRADINGVIEW SINGLE TICKER LIVE DATA ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {/* Card 1: Forex — EUR/USD Single Ticker */}
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} className="h-full">
            <div className={`relative rounded-2xl overflow-hidden border border-gold-medium/25 flex flex-col h-[400px] glow-gold ${isDark ? 'bg-dark-950' : 'bg-[#fdf8ef]'}`}>
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                style={{ backgroundImage: `url('${cardImages.forex}')`, opacity: isDark ? 0.55 : 0.65 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1] pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-gold-dark/20">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gold-medium" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Forex Liquidity</h3>
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-mono font-bold">24/5 Live</span>
              </div>

              {/* Live Widget: EUR/USD — scrollable container */}
              <div className="relative z-10 flex-1 flex flex-col px-4 py-3 gap-2 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.35) transparent' }}>
                <p className="text-[9px] text-gold-medium/70 uppercase tracking-widest font-bold mb-1 flex-shrink-0">Live Single Quote</p>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="OANDA:EURUSD" isDark={isDark} />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="OANDA:GBPUSD" isDark={isDark} />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="FX:USDJPY" isDark={isDark} />
                </div>
              </div>

              <button
                onClick={() => triggerOrder('EUR/USD', 'BUY')}
                className="relative z-10 mx-4 mb-4 py-2.5 bg-gradient-to-r from-gold-dark to-gold-medium text-black text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Order FX Instant
              </button>
            </div>
          </Tilt>

          {/* Card 2: Stocks — AAPL Single Ticker */}
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} className="h-full">
            <div className={`relative rounded-2xl overflow-hidden border border-gold-medium/25 flex flex-col h-[400px] glow-gold ${isDark ? 'bg-dark-950' : 'bg-[#fdf8ef]'}`}>
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                style={{ backgroundImage: `url('${cardImages.stocks}')`, opacity: isDark ? 0.7 : 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1] pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-gold-dark/20">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-gold-medium" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Equity Sectors</h3>
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-mono font-bold">Exchange Hours</span>
              </div>

              <div className="relative z-10 flex-1 flex flex-col px-4 py-3 gap-2 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.35) transparent' }}>
                <p className="text-[9px] text-gold-medium/70 uppercase tracking-widest font-bold mb-1 flex-shrink-0">Live Single Quote</p>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="NASDAQ:AAPL" isDark={isDark} />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="NASDAQ:NVDA" isDark={isDark} />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="NASDAQ:TSLA" isDark={isDark} />
                </div>
              </div>

              <button
                onClick={() => triggerOrder('AAPL', 'BUY')}
                className="relative z-10 mx-4 mb-4 py-2.5 bg-gradient-to-r from-gold-dark to-gold-medium text-black text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Order Equities
              </button>
            </div>
          </Tilt>

          {/* Card 3: Crypto — BTC/USD Single Ticker */}
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} className="h-full sm:col-span-2 lg:col-span-1">
            <div className={`relative rounded-2xl overflow-hidden border border-gold-medium/25 flex flex-col h-[400px] glow-gold ${isDark ? 'bg-dark-950' : 'bg-[#fdf8ef]'}`}>
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                style={{ backgroundImage: `url('${cardImages.crypto}')`, opacity: isDark ? 0.55 : 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1] pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-gold-dark/20">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-gold-medium" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Digital Assets</h3>
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-mono font-bold">24/7/365</span>
              </div>

              <div className="relative z-10 flex-1 flex flex-col px-4 py-3 gap-2 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.35) transparent' }}>
                <p className="text-[9px] text-gold-medium/70 uppercase tracking-widest font-bold mb-1 flex-shrink-0">Live Single Quote</p>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="BITSTAMP:BTCUSD" isDark={isDark} />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="BITSTAMP:ETHUSD" isDark={isDark} />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="CRYPTO:XRPUSD" isDark={isDark} />
                </div>
              </div>

              <button
                onClick={() => triggerOrder('BTC/USD', 'BUY')}
                className="relative z-10 mx-4 mb-4 py-2.5 bg-gradient-to-r from-gold-dark to-gold-medium text-black text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Order Cryptos
              </button>
            </div>
          </Tilt>
        </div>

        {/* FULL WIDTH TRADINGVIEW ADVANCED CHART */}
        <div className={`w-full rounded-2xl overflow-hidden shadow-2xl border border-gold-medium/20 p-1.5 backdrop-blur-md glow-gold ${isDark ? 'bg-dark-950/80' : 'bg-[#fdf8ef]/90'}`}>
          <h3 className={`text-xs uppercase font-bold tracking-widest border-b p-4 flex items-center justify-between ${isDark ? 'text-gold-light border-gold-dark/15' : 'text-gold-dark border-gold-dark/20'}`}>
            <span>TradingView Advanced Terminal (Live Stream)</span>
            <span className={`px-2 py-0.5 rounded border text-[9px] ${isDark ? 'bg-gold-dark/10 border-gold-medium/25 text-gold-light' : 'bg-gold-dark/8 border-gold-medium/30 text-gold-dark'}`}>Live Charts</span>
          </h3>
          <div className="h-[600px] w-full">
            <TradingViewChart isDark={isDark} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketsSection
