import React from 'react'
import EcosystemSection from './HomeSections/EcosystemSection'
import PortalSection from './HomeSections/PortalSection'
import { useTheme } from '../../context/ThemeContext'
import { Landmark, Globe, Activity, CheckCircle2, Milestone, Calendar } from 'lucide-react'

const EcosystemPage = () => {
  const { isDark } = useTheme()

  const sectors = [
    {
      icon: <Landmark className="w-6 h-6 text-gold-medium" />,
      title: "Real Estate Portfolios",
      desc: "Our real estate pipeline targets prime residential, commercial, and student housing developments. Each property undergoes rigorous feasibility studies, yielding stable long-term ROI parameters.",
      features: ["Sponsor matching deeds", "ROI yield metrics estimation", "Direct ownership registry"]
    },
    {
      icon: <Globe className="w-6 h-6 text-gold-medium" />,
      title: "Online Digital Portal",
      desc: "A centralized gateway linking learning dashboards, simulator credentials, global community channels, and transaction registries under a secure matching environment.",
      features: ["Single sign-on access", "Real-time indicators feed", "Audited transaction safety"]
    },
    {
      icon: <Activity className="w-6 h-6 text-gold-medium" />,
      title: "Algorithmic Market Intelligence",
      desc: "Access proprietary indicators, market trend scripts, live pricing cards, and compound calculators tailored to currency derivatives, blue-chip stocks, and major crypto assets.",
      features: ["TradingView indicators integration", "Simulated trade simulator", "Live quote feeds"]
    }
  ]

  const milestones = [
    {
      year: "2023",
      title: "Platform Foundation",
      desc: "Launched Dark Horse Academy with focus on Forex markets and technical indicator analysis."
    },
    {
      year: "2024",
      title: "Ecosystem Expansion",
      desc: "Acquired first commercial properties pipeline in the UK and set up simulated asset matching."
    },
    {
      year: "2025",
      title: "Integrated Portal v2",
      desc: "Introduced advanced compound interest models, TradingView API integrations, and community feeds."
    },
    {
      year: "2026",
      title: "Multi-Asset Gateway",
      desc: "Synced Forex, Stocks, Crypto, and Real Estate under a single, responsive routed web terminal."
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
                Platform Framework
              </span>
              <h1 className={`text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-wide ${
                isDark ? 'text-white' : 'text-[#1a1200]'
              }`}>
                A Diversified <span className="bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">Financial</span> Gateway
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
              }`}>
                We provide a comprehensive framework connecting multiple asset classes under a single educational and transaction network. Spreading resources across indices, real estate pipelines, and digital portals preserves user capital and provides consistent value.
              </p>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                >
                  View Ecosystem Map
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
                    alt="Global Ecosystem Analytics"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Ecosystem Section */}
      <EcosystemSection />

      {/* 3. Sectors Grid */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/20' : 'border-gold-dark/15 bg-[#fdf8ef]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Diversification Pillars
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
              isDark ? 'text-white' : 'text-[#1a1200]'
            }`}>
              Ecosystem Sector Framework
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              By spreading risk parameters across physical real estate, digital learning structures, and live trading terminals, we preserve capital and accelerate user results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectors.map((sector, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-8 transition-all duration-300 relative group overflow-hidden ${
                  isDark 
                    ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 shadow-lg' 
                    : 'border-gold-dark/25 bg-[#fdf8ef] hover:border-gold-medium/50 shadow-lg'
                }`}
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-light">
                    {sector.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className={`text-lg font-bold font-display uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                      {sector.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                      {sector.desc}
                    </p>
                  </div>
                  <ul className="space-y-2 border-t border-gold-dark/10 pt-4">
                    {sector.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-medium shrink-0" />
                        <span className={isDark ? 'text-gray-400' : 'text-[#7a5e3c]'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Real Estate Split Section */}
      <PortalSection />

      {/* 5. Ecosystem Growth Timeline (Enrichment Block) */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/40' : 'border-gold-dark/15 bg-[#fdf8ef]/70'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Development Path
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
              isDark ? 'text-white' : 'text-[#1a1200]'
            }`}>
              Ecosystem Growth Timeline
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              Track the developmental checkpoints that transformed Dark Horse from a simple trading academy to a diversified ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {milestones.map((milestone, idx) => (
              <div 
                key={idx}
                className={`rounded-xl border p-6 relative flex flex-col justify-between ${
                  isDark ? 'border-gold-dark/10 bg-dark-900/30' : 'border-gold-dark/20 bg-[#fdf8ef]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold font-mono text-gold-medium">
                      {milestone.year}
                    </span>
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-bold font-display text-sm tracking-wider uppercase ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                      {milestone.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      
    </div>
  )
}

export default EcosystemPage
