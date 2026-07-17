import React from 'react'
import { Shield, Coins, BarChart3, Users2, Cpu, GraduationCap, Award } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const WhyChooseSection = ({ whyChooseRef }) => {
  const { isDark } = useTheme()

  const advantages = [
    {
      icon: <Shield className="w-6 h-6 text-gold-medium" />,
      title: "Secure & Regulated",
      desc: "Enterprise-grade security protocols, encryption keys, and custody structures safeguarding all digital assets and property deeds."
    },
    {
      icon: <Coins className="w-6 h-6 text-gold-medium" />,
      title: "Multi-Asset Ecosystem",
      desc: "A unified portal connecting Forex, Stocks, Cryptocurrencies, and Real Estate under a single, highly efficient investment gateway."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-gold-medium" />,
      title: "Transparent Metrics",
      desc: "Audited ROI performance history, real-time visual charts, and complete ledger transparency for all matching commissions."
    },
    {
      icon: <Users2 className="w-6 h-6 text-gold-medium" />,
      title: "Binary Network Power",
      desc: "Earn consistent dividends via binary matching overrides, rank achievements, and sponsor commissions linked worldwide."
    },
    {
      icon: <Cpu className="w-6 h-6 text-gold-medium" />,
      title: "Smart Trade Terminals",
      desc: "Access automated ticker feeds, indicators, custom compounding calculators, and live TradingView analytics panels."
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-gold-medium" />,
      title: "Institutional Mentorship",
      desc: "Accelerate your career through professional trading modules, masterclass curriculum, and interactive simulator labs."
    }
  ]

  return (
    <section
      id="whychoose"
      ref={whyChooseRef}
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Watermark/Logo styling */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <img
          src="/logo.jpeg"
          alt="Watermark Logo"
          className="w-[600px] h-[600px] object-cover rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-gold-medium" /> Advantages
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
            Why Choose Dark Horse
          </h2>
          <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
            Discover the structural and financial advantages that position our platform as a global leader in diversified asset ecosystems.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((item, index) => (
            <div 
              key={index}
              className={`whychoose-card rounded-2xl border p-8 transition-all duration-300 relative group overflow-hidden ${
                isDark 
                  ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 hover:translate-y-[-4px] shadow-lg shadow-black/20' 
                  : 'border-gold-dark/25 bg-[#fdf8ef]/80 hover:border-gold-medium/50 hover:translate-y-[-4px] shadow-lg shadow-gold-dark/5'
              }`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-light group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <h3 className={`text-lg font-bold font-display uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
              
              {/* Subtle gold line on card hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default WhyChooseSection
