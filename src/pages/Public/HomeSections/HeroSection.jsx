import React, { useState, useEffect } from 'react'
import Tilt from 'react-parallax-tilt'
import { Zap, TrendingUp, TrendingDown, CheckCircle2, Activity, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import TradingViewMarketOverview from '../../../ThirdApi/TradingViewMarketOverview'

// Animated sparkline path
const SparkLine = ({ color = '#d4af37', animDelay = '0s' }) => (
  <svg viewBox="0 0 120 40" className="w-full h-8" preserveAspectRatio="none">
    <defs>
      <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0,35 L15,28 L30,32 L45,18 L60,22 L75,10 L90,14 L105,5 L120,8"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0,35 L15,28 L30,32 L45,18 L60,22 L75,10 L90,14 L105,5 L120,8 L120,40 L0,40 Z"
      fill={`url(#grad-${color})`}
    />
  </svg>
)

// Floating animated ticker item
const TickerItem = ({ symbol, price, change, isUp, delay = 0, isDark = true }) => (
  <div
    className={`flex items-center justify-between px-3 py-2 rounded-lg border backdrop-blur-sm ${isDark
      ? 'bg-black/40 border-gold-dark/20'
      : 'bg-[#f5ead0]/60 border-gold-dark/30'
      }`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
      <span className={`text-[11px] font-bold font-mono ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>{symbol}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-mono ${isDark ? 'text-gray-300' : 'text-[#5a4a20]'}`}>{price}</span>
      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isUp ? '+' : ''}{change}%
      </span>
    </div>
  </div>
)

const HeroSection = ({ heroRef, onJoinClick }) => {
  const { isDark } = useTheme()
  const [portfolioValue, setPortfolioValue] = useState(142500)
  const [gainPct, setGainPct] = useState(1.24)
  const [barHeights, setBarHeights] = useState([30, 45, 60, 50, 80, 95])

  // Animate portfolio value & bars
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => {
        const delta = (Math.random() - 0.45) * 500
        return Math.max(140000, Math.round(prev + delta))
      })
      setGainPct(prev => {
        const delta = (Math.random() - 0.45) * 0.08
        return Math.max(0.5, Math.min(3.5, +(prev + delta).toFixed(2)))
      })
      setBarHeights(prev => prev.map(h => {
        const delta = (Math.random() - 0.5) * 15
        return Math.max(15, Math.min(98, h + delta))
      }))
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const tickers = [
    { symbol: 'EUR/USD', price: '1.0924', change: '0.12', isUp: true },
    { symbol: 'BTC/USD', price: '67,845', change: '1.25', isUp: true },
    { symbol: 'NVDA', price: '$946.30', change: '4.86', isUp: true },
    { symbol: 'GBP/USD', price: '1.2742', change: '0.05', isUp: false },
  ]

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
        style={{
          backgroundImage: `url('/images/img_12.jpg')`,
          opacity: isDark ? 0.8 : 0.8
        }}
      />
      {/* Gradient overlay */}
      <div className={`absolute inset-0 z-[1] pointer-events-none ${isDark
        ? 'bg-gradient-to-r from-dark-950/95 via-dark-950/70 to-dark-950/40'
        : 'bg-gradient-to-r from-[#f5f0e8]/95 via-[#f5f0e8]/70 to-[#f5f0e8]/30'
        }`} />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/20 text-gold-dark text-xs font-semibold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-gold-dark animate-pulse" />THINK SHARPER. TRADE SMARTER.
          </div>

          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1]">
            <span className={`block ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>Unlock Your</span>
            <span className="block bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent py-1">
              Financial Potential
            </span>
            <span className={`block ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>With Dark Horse</span>
          </h1>

          <p className={`hero-desc text-md sm:text-lg max-w-xl leading-relaxed font-light ${isDark ? 'text-gray-400' : 'text-[#6a5a38]'}`}>
          Accelerate your market understanding across Real Estate, Forex, Crypto, and 
Stock markets. Access research-driven insights, strategic learning resources, 
and a growing community focused on financial literacy — for informational 
and educational purposes only.
          </p>

          <div className="hero-ctas flex flex-wrap gap-4 pt-2">
            <button
              onClick={onJoinClick}
              className="px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('academy')
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs border transition-all transform hover:-translate-y-0.5 cursor-pointer ${isDark
                ? 'text-gold-light border-gold-medium/30 bg-dark-900/50 hover:bg-dark-900/80 hover:border-gold-medium'
                : 'text-gold-dark border-gold-dark/40 bg-white/50 hover:bg-white/80 hover:border-gold-medium'
                }`}
            >
              Explore INSIGHTS
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 pt-4">
            {['EDUCATIONAL CONTENT ONLY ', 'LIVE MARKET DATA (Powered by TradingView)', '10,000+ Members'].map(badge => (
              <div key={badge} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: TradingView Market Overview Widget */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end hero-graphic z-10">
          <div className={`relative w-full max-w-[460px] rounded-2xl border overflow-hidden backdrop-blur-xl glow-gold-lg transition-all duration-300 ${
            isDark
              ? 'border-gold-medium/30 bg-black/60'
              : 'border-gold-dark/40 bg-[#fdf8ef]/95 shadow-xl shadow-gold-dark/10'
          }`}>

            {/* Animated background glows */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold-medium/10 blur-[60px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-emerald-500/8 blur-[50px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            {/* Header bar */}
            <div className={`relative z-10 flex items-center justify-between px-5 py-3 border-b ${isDark ? 'border-gold-dark/20' : 'border-gold-dark/25'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                  Live Market Overview
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-gold-medium animate-pulse" />
                <span className="text-[9px] text-gold-light font-mono uppercase">TradingView</span>
              </div>
            </div>

            {/* TradingView Market Overview Widget */}
            <div className="relative z-10 w-full" style={{ height: 460 }}>
              <TradingViewMarketOverview isDark={isDark} height={460} />
            </div>

            {/* Footer */}
            <div className={`relative z-10 px-5 py-2.5 border-t flex items-center justify-between ${isDark ? 'border-gold-dark/15' : 'border-gold-dark/25'}`}>
              <span className={`text-[9px] uppercase tracking-widest font-mono ${isDark ? 'text-gray-600' : 'text-[#9a8060]'}`}>Powered by TradingView</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-bold text-gold-medium uppercase tracking-wider">Live Data</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection
