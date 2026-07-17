import React from 'react'
import { Eye, Target, Landmark } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const AboutSection = ({ aboutRef }) => {
  const { isDark } = useTheme()

  return (
    <section
      id="about"
      ref={aboutRef}
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
            <Landmark className="w-3.5 h-3.5 text-gold-medium" /> WHO WE ARE
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
            About Dark Horse
          </h2>
          <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
            Envisioned as a diversified financial education platform, Dark Horse is
            designed to bring together learning resources from multiple market sectors
            under one unified space.
          </p>
        </div>

        {/* Vision & Mission Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Card 1: Our Vision */}
          <div className={`about-card rounded-2xl border p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${isDark
              ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 shadow-xl shadow-black/30'
              : 'border-gold-dark/30 bg-[#fdf8ef]/80 hover:border-gold-medium/50 shadow-xl shadow-gold-dark/5'
            }`}>
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-light">
                <Eye className="w-6 h-6 text-gold-medium" />
              </div>
              <div className="space-y-3">
                <h3 className={`text-2xl font-bold font-display uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                  Our Vision
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#5a4225]'}`}>
                  To become a leading global platform that empowers individuals with
                  knowledge and understanding across real estate, financial markets, and
                  digital assets — helping build a foundation of financial literacy,
                  awareness, and informed decision-making for long-term learning.
                </p>
              </div>
            </div>

            {/* Background vector watermark */}
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-[0.02] pointer-events-none">
              <Eye className="w-48 h-48 text-gold-medium" />
            </div>
          </div>

          {/* Card 2: Our Mission */}
          <div className={`about-card rounded-2xl border p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${isDark
              ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 shadow-xl shadow-black/30'
              : 'border-gold-dark/30 bg-[#fdf8ef]/80 hover:border-gold-medium/50 shadow-xl shadow-gold-dark/5'
            }`}>
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-light">
                <Target className="w-6 h-6 text-gold-medium" />
              </div>
              <div className="space-y-3">
                <h3 className={`text-2xl font-bold font-display uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                  Our Mission
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#5a4225]'}`}>
                 Our mission is to simplify access to financial education by providing a 
trusted, transparent, and user-friendly platform. We aim to help people 
understand real estate, stocks, mutual funds, cryptocurrency, and forex 
markets — promoting clarity, knowledge, and informed thinking for every 
learner.
                </p>
              </div>
            </div>

            {/* Background vector watermark */}
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-[0.02] pointer-events-none">
              <Target className="w-48 h-48 text-gold-medium" />
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default AboutSection
