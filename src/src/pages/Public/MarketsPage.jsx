import React from 'react'
import MarketsSection from './HomeSections/MarketsSection'
import CalculatorSection from './HomeSections/CalculatorSection'
import { useTheme } from '../../context/ThemeContext'
import { Landmark, TrendingUp, Cpu, Award, BadgeAlert, Sparkles, Activity } from 'lucide-react'

const MarketsPage = () => {
  const { isDark } = useTheme()

  const scriptSuite = [
    {
      title: "DH Momentum Rider",
      desc: "Traces market momentum across stock indices and major forex quote pairs, generating simulated alerts.",
      type: "Trend Tracker"
    },
    {
      title: "Volatility Radar",
      desc: "Monitors daily drawdown limits and provides real-time warnings on simulated order matching.",
      type: "Risk Manager"
    },
    {
      title: "Volume Block Tracker",
      desc: "Detects order block imbalances and overlays support/resistance lines dynamically on the charts.",
      type: "Liquidity Analysis"
    }
  ]

  return (
    <div className="pt-20 min-h-screen">
      
      {/* 1. Visual Subpage Hero */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${
        isDark ? 'border-gold-dark/15 bg-dark-950/30' : 'border-gold-dark/20 bg-[#fdf8ef]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Info */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
                Live Data Feeds
              </span>
              <h1 className={`text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-wide ${
                isDark ? 'text-white' : 'text-[#1a1200]'
              }`}>
                Real-Time <span className="bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">Market</span> Execution
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
              }`}>
                Monitor raw currency spreads, stock indices, crypto rates, and simulation terminals. Our layout provides real-time indicators integration, custom calculators, and clean charts to evaluate strategies.
              </p>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                >
                  Launch Terminal
                </button>
              </div>
            </div>

            {/* Right Column: Glowing Framed Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className={`relative rounded-2xl p-2 border transition-all duration-300 w-full max-w-md ${
                isDark 
                  ? 'border-gold-dark/20 bg-dark-900/40 shadow-2xl shadow-black/50' 
                  : 'border-gold-dark/25 bg-[#fdf8ef]/85 shadow-2xl shadow-gold-dark/10'
              }`}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <img
                    src="/images/img_9.jpg"
                    alt="Active Markets Execution Screen"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Live Markets Terminal Section */}
      <MarketsSection />

      {/* 3. Interactive Compound Interest Calculator */}
      <CalculatorSection />

      {/* 4. Proprietary Script Suite (Enrichment Block) */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/40' : 'border-gold-dark/15 bg-[#fdf8ef]/70'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Scripting Engine
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
              isDark ? 'text-white' : 'text-[#1a1200]'
            }`}>
              Proprietary Analytical Scripts
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              Apply our custom volume and momentum indicators directly onto your TradingView layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scriptSuite.map((script, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border p-8 transition-all duration-300 relative group overflow-hidden ${
                  isDark 
                    ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 shadow-lg' 
                    : 'border-gold-dark/25 bg-[#fdf8ef] hover:border-gold-medium/50 shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-medium block">
                      {script.type}
                    </span>
                    <Sparkles className="w-4 h-4 text-gold-medium animate-pulse" />
                  </div>
                  <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                    {script.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                    {script.desc}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Additional Analytics Guide Block */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/20' : 'border-gold-dark/15 bg-[#fdf8ef]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className={`rounded-xl border p-6 ${
              isDark ? 'border-gold-dark/10 bg-dark-900/30' : 'border-gold-dark/20 bg-[#fdf8ef]'
            }`}>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-medium shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-bold font-display text-sm tracking-wider uppercase ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                    Audited Pricing Quotes
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                    Our charting layout renders raw feed feeds using TradingView WebSockets, eliminating retail broker bid-ask markups.
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-6 ${
              isDark ? 'border-gold-dark/10 bg-dark-900/30' : 'border-gold-dark/20 bg-[#fdf8ef]'
            }`}>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-medium shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-bold font-display text-sm tracking-wider uppercase ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                    Simulator Orders Matching
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                    Submit mock orders to evaluate transaction matching speeds and slippage parameters under volatile markets.
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-xl border p-6 ${
              isDark ? 'border-gold-dark/10 bg-dark-900/30' : 'border-gold-dark/20 bg-[#fdf8ef]'
            }`}>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-medium shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-bold font-display text-sm tracking-wider uppercase ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                    Diversified Indicators
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                    Apply custom support and resistance indicators directly to currency quotes, stock indices, or digital tokens.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default MarketsPage
