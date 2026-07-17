import React from 'react'
import { Layers } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const EcosystemSection = ({ ecosystemRef }) => {
  const { isDark } = useTheme()

  return (
    <section
      id="ecosystem"
      ref={ecosystemRef}
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

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Content Area */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
                <Layers className="w-3.5 h-3.5 text-gold-medium" /> Platform Structure
              </div>
              <h2 className={`text-3xl sm:text-5xl font-extrabold font-display leading-tight tracking-wide ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                Dark Horse Knowledge Ecosystem
              </h2>
              <p className="text-gold-medium font-bold tracking-wider text-xs sm:text-sm uppercase">
                MULTIPLE SECTORS. ONE LEARNING VISION.
              </p>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'}`}>
                Dark Horse is envisioned as a diversified financial education ecosystem
                designed to bring together learning resources from multiple market sectors
                under one unified platform. The objective is to create a strong knowledge
                foundation that supports understanding across different financial domains
                while providing users with a centralized digital learning experience.
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-6">
              {/* Point 1: Real Estate */}
              <div className="flex gap-4 items-start">
                <div className="mt-2.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-gold-medium shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="space-y-1">
                  <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                    Real Estate
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    A sector focused on residential and commercial property concepts,
                    recognized as one of the most established asset classes for long-term
                    value understanding and market study.
                  </p>
                </div>
              </div>

              {/* Point 2: Online Portal */}
              <div className="flex gap-4 items-start">
                <div className="mt-2.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-gold-medium shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="space-y-1">
                  <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                    Online Portal
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    A digital ecosystem designed by Dark Horse to simplify access to learning
                    resources by bringing together various educational tools and content in
                    one convenient environment, supporting a more connected and streamlined
                    user experience.
                  </p>
                </div>
              </div>

              {/* Point 3: Our Approach */}
              <div className="flex gap-4 items-start">
                <div className="mt-2.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-gold-medium shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="space-y-1">
                  <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                    Our Approach
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                    Rather than focusing on a single market, Dark Horse is built around the
                    concept of diversification in learning — creating resources for
                    understanding multiple financial sectors and their fundamentals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Overlapping Images Stack */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[550px] mt-8 lg:mt-0">
            {/* Box 1: Left-Middle (Real Estate) */}
            <div className={`absolute left-0 top-[20%] w-[55%] aspect-[6/6] rounded-xl p-1 border transition-all duration-300 hover:translate-y-[-4px] hover:z-30 hover:shadow-2xl z-10 ${isDark
              ? 'border-gold-dark/20 bg-dark-900/40 shadow-lg shadow-black/40'
              : 'border-gold-dark/25 bg-[#fdf8ef]/80 shadow-lg shadow-gold-dark/5'
              }`}>
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img
                  src="/images/real_estate.jpg"
                  alt="Real Estate Asset"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Box 2: Top-Right (Investment Chart) */}
            <div className={`absolute right-0 top-0 w-[60%] aspect-[5/4] rounded-xl p-1 border transition-all duration-300 hover:translate-y-[-4px] hover:z-30 hover:shadow-2xl z-20 ${isDark
              ? 'border-gold-dark/20 bg-dark-900/40 shadow-lg shadow-black/40'
              : 'border-gold-dark/25 bg-[#fdf8ef]/80 shadow-lg shadow-gold-dark/5'
              }`}>
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img
                  src="/images/ecosystem.webp"
                  alt="Financial Trading Markets"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Box 3: Bottom-Right/Center (Digital Analytics Portal) */}
            <div className={`absolute  right-[6%] bottom-0 w-[62%] aspect-[5/4] rounded-xl p-1 border transition-all duration-300 hover:translate-y-[-4px] hover:z-30 hover:shadow-2xl z-25 ${isDark
              ? 'border-gold-dark/20 bg-dark-900/40 shadow-xl shadow-black/50'
              : 'border-gold-dark/25 bg-[#fdf8ef]/80 shadow-xl shadow-gold-dark/10'
              }`}>
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img
                  src="/images/finance image.jpg"
                  alt="Digital Portal Platform"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default EcosystemSection
