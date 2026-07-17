import React from 'react'
import AboutSection from './HomeSections/AboutSection'
import TestimonialsSection from './HomeSections/TestimonialsSection'
import { useTheme } from '../../context/ThemeContext'
import { CheckCircle2, History, Users, Award, ShieldAlert, BadgeCheck } from 'lucide-react'

const AboutPage = () => {
  const { isDark } = useTheme()

  const boardMembers = [
    {
      name: "Marcus Vance",
      role: "Chief Trading Mentor",
      bio: "Former London FX desk supervisor with 18+ years managing capital portfolios and currency derivatives.",
      icon: <Award className="w-5 h-5 text-gold-medium" />
    },
    {
      name: "Elena Rostova",
      role: "Director of Real Estate Development",
      bio: "Acquisition specialist leading residential and corporate property analysis across high-yield European markets.",
      icon: <BadgeCheck className="w-5 h-5 text-gold-medium" />
    },
    {
      name: "Devon Sinclair",
      role: "Platform Tech Architect",
      bio: "Blockchain systems expert structuring secure wallet safeguards, data keys, and simulated trading engines.",
      icon: <Users className="w-5 h-5 text-gold-medium" />
    }
  ]

  return (
    <div className="pt-20 min-h-screen">
      
      {/* 1. Visual Subpage Hero */}

      {/* 3. Core Principles & History */}


        <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/20' : 'border-gold-dark/15 bg-[#fdf8ef]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Image Stack */}
            <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px]">
              {/* Box 1 (Background Office Image) */}
              <div className={`absolute left-0 top-0 w-[70%] aspect-[4/3] rounded-xl p-1 border ${
                isDark ? 'border-gold-dark/20 bg-dark-900/60 shadow-lg' : 'border-gold-dark/25 bg-[#fdf8ef] shadow-lg'
              }`}>
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img
                    src="/images/img_1.jpg"
                    alt="Corporate Office Workspace"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Box 2 (Foreground Meeting Image) */}
              <div className={`absolute right-0 bottom-4 w-[70%] aspect-[4/3] rounded-xl p-1 border z-10 shadow-2xl ${
                isDark ? 'border-gold-dark/20 bg-dark-900/80' : 'border-gold-dark/25 bg-[#fdf8ef]'
              }`}>
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img
                    src="/images/img_12.jpg"
                    alt="Team Collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Text */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
                  <History className="w-3.5 h-3.5 text-gold-medium" /> Core Legacy &amp; Ethos
                </div>
                <h2 className={`text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-wide ${
                  isDark ? 'text-white' : 'text-[#1a1200]'
                }`}>
                  How We Formed Our Educational Standards
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
                }`}>
                  Founded by a consortium of institutional asset managers, professional traders, and real estate developers, Dark Horse was created to bridge the gap between retail market speculation and institutional-grade risk management systems.
                </p>
              </div>

              {/* Pillars Grid */}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-medium" />
                    <h3 className={`font-bold font-display uppercase tracking-wider text-sm ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                      Academic Rigor
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    Every module, from binary options simulated logic to real estate ROI evaluation metrics, undergoes audited validation by industry mentors.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-medium" />
                    <h3 className={`font-bold font-display uppercase tracking-wider text-sm ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                      Global Standards
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    We align our curriculum structure directly with modern global financial licensing expectations, empowering students with verified knowledge.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-medium" />
                    <h3 className={`font-bold font-display uppercase tracking-wider text-sm ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                      Algorithmic Testing
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    We train students to program and evaluate backtesting indicators, ensuring they make trades using objective historical metrics.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-medium" />
                    <h3 className={`font-bold font-display uppercase tracking-wider text-sm ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                      Active Community
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    Join peer groups sharing daily analysis charts, trade logs, and properties pipeline insights in real time.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${
        isDark ? 'border-gold-dark/15 bg-dark-950/30' : 'border-gold-dark/20 bg-[#fdf8ef]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Info */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
                Learn Who We Are
              </span>
              <h1 className={`text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-wide ${
                isDark ? 'text-white' : 'text-[#1a1200]'
              }`}>
                Pioneering <span className="bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">Institutional</span> Education
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
              }`}>
                Dark Horse Finance Academy is structured to deliver objective, clear, and comprehensive market intelligence. We train traders with algorithmic frameworks, simulated calculators, and audited property criteria.
              </p>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                >
                  Explore Legacy
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
                    src="/images/img_1.jpg"
                    alt="Institutional Board Room"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main About Section */}
      <AboutSection />

    

      {/* 4. Executive Advisory Board (Enrichment Block) */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/40' : 'border-gold-dark/15 bg-[#fdf8ef]/70'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Expert Mentors
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
              isDark ? 'text-white' : 'text-[#1a1200]'
            }`}>
              Executive Advisory Board
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              Meet the specialists leading our curriculum developments, risk management compliance, and physical property acquisitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boardMembers.map((member, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border p-8 transition-all duration-300 relative group overflow-hidden ${
                  isDark 
                    ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 shadow-lg' 
                    : 'border-gold-dark/25 bg-[#fdf8ef] hover:border-gold-medium/50 shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-dark/15 border border-gold-medium/20 flex items-center justify-center shrink-0">
                    {member.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                      {member.name}
                    </h3>
                    <p className="text-xs text-gold-medium font-bold tracking-wider uppercase">
                      {member.role}
                    </p>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                    {member.bio}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Testimonials Section */}
      <TestimonialsSection />
      
    </div>
  )
}

export default AboutPage
