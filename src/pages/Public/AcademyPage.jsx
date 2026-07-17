import React from 'react'
import AcademySection from './HomeSections/AcademySection'
import { useTheme } from '../../context/ThemeContext'
import { GraduationCap, ArrowRight, BookOpen, Star, HelpCircle, Shield, Award, Sparkles, Monitor } from 'lucide-react'

const AcademyPage = () => {
  const { isDark } = useTheme()

  const curriculumRoadmap = [
    {
      level: "Level 1: Fundamentals",
      title: "Introduction to Markets",
      desc: "Master key concepts in stock trading, currency pip metrics, asset classifications, and chart navigation layouts.",
      duration: "4 Weeks"
    },
    {
      level: "Level 2: Technicals",
      title: "Price Action & Volume",
      desc: "Analyze candlestick formations, liquidity pools, order block imbalances, and support/resistance structures.",
      duration: "6 Weeks"
    },
    {
      level: "Level 3: Management",
      title: "Risk Parameters & Psychology",
      desc: "Configure target risk-to-reward ratios, portfolio drawdown management parameters, and emotional trading protocols.",
      duration: "4 Weeks"
    },
    {
      level: "Level 4: Masterclass",
      title: "Institutional Strategies",
      desc: "Implement advanced hedging strategies, global macro metrics analysis, algorithmic scripts, and mock simulator trials.",
      duration: "8 Weeks"
    }
  ]

  const studentPerks = [
    {
      title: "Simulator Credentials",
      desc: "Get unlimited trial access to our institutional simulated order matching matching sandbox.",
      icon: <Monitor className="w-5 h-5 text-gold-medium" />
    },
    {
      title: "Daily Technical Reports",
      desc: "Receive premium daily analysis feeds on currency quotes, major indices, and crypto assets.",
      icon: <Award className="w-5 h-5 text-gold-medium" />
    },
    {
      title: "Private Mentors Q&A",
      desc: "Attend weekly live advisory office webinars to dissect active charts and strategies.",
      icon: <GraduationCap className="w-5 h-5 text-gold-medium" />
    },
    {
      title: "Proprietary indicators access",
      desc: "Download all DH custom scripts and overlays directly into your TradingView profile.",
      icon: <Sparkles className="w-5 h-5 text-gold-medium" />
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
                Elite Masterclass
              </span>
              <h1 className={`text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-wide ${
                isDark ? 'text-white' : 'text-[#1a1200]'
              }`}>
                Master the <span className="bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">Art of</span> Market Speculation
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
              }`}>
                We provide retail students with institutional-grade trading modules. Master global indicators, risk management parameters, simulated systems, and real estate ROI assessment rules.
              </p>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                >
                  View Course Syllabus
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
                    src="/images/img_12.jpg"
                    alt="Students Collaborative Learning"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Academy Section */}
      <AcademySection />

      {/* 3. Curriculum Roadmap Timeline */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/20' : 'border-gold-dark/15 bg-[#fdf8ef]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Step-By-Step Journey
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
              isDark ? 'text-white' : 'text-[#1a1200]'
            }`}>
              Curriculum Roadmap Timeline
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              Accelerate your education from basics to institutional trade setups through our structured 4-stage simulator pathway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {curriculumRoadmap.map((step, i) => (
              <div
                key={i}
                className={`rounded-xl border p-6 relative flex flex-col justify-between ${
                  isDark ? 'border-gold-dark/10 bg-dark-900/30' : 'border-gold-dark/20 bg-[#fdf8ef]'
                }`}
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-medium block">
                    {step.level}
                  </span>
                  <div className="space-y-2">
                    <h3 className={`font-bold font-display text-base ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gold-dark/10 pt-4 mt-6 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-semibold text-gold-light">{step.duration}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Student Perks & Benefits (Enrichment Block) */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/40' : 'border-gold-dark/15 bg-[#fdf8ef]/70'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Membership Value
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
              isDark ? 'text-white' : 'text-[#1a1200]'
            }`}>
              Elite Academy Benefits
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              Gain lifetime access to tools and support resources as a Dark Horse student.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {studentPerks.map((perk, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border p-6 relative group ${
                  isDark 
                    ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 shadow-lg' 
                    : 'border-gold-dark/25 bg-[#fdf8ef] hover:border-gold-medium/50 shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-dark/15 border border-gold-medium/20 flex items-center justify-center shrink-0">
                    {perk.icon}
                  </div>
                  <h3 className={`font-bold font-display text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                    {perk.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      
    </div>
  )
}

export default AcademyPage
