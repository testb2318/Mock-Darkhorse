import React from 'react'
import { Check, Home, Building } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const PortalSection = ({ portalRef }) => {
  const { isDark } = useTheme()

  const bulletPoints = [
    "Explore thousands of residential & commercial listings for market study",
    "Filter by location, price, and property type to understand market trends",
    "Compare properties side-by-side with detailed analytics for learning purposes",
    "Explore market data and connect with our learning community",
    "Track property value trends and market forecasts for educational insight",
    "Access digital resources and guides on property research fundamentals"
  ]

  return (
    <section
      id="portal"
      ref={portalRef}
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
          
          {/* Left Column: Image Area */}
          <div className="lg:col-span-6 portal-graphic flex justify-center">
            <div className={`relative rounded-2xl p-2 border transition-all duration-300 w-full max-w-lg ${
              isDark 
                ? 'border-gold-dark/20 bg-dark-900/40 shadow-2xl shadow-black/50' 
                : 'border-gold-dark/25 bg-[#fdf8ef]/80 shadow-2xl shadow-gold-dark/10'
            }`}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <img
                  src="/images/real_estate.jpg"
                  alt="Premium Real Estate Investment"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Visual Glassmorphic Label Overlay inside image */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5 text-gold-medium" /> Prime Property Portfolio
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Content Area */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Small Tag */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
              <Home className="w-3.5 h-3.5 text-gold-medium" /> Real Estate &amp; Online Portal
            </div>

            <div className="space-y-3">
              <h2 className={`text-3xl sm:text-5xl font-extrabold font-display leading-tight ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                Real Estate &amp; Online Portal
              </h2>
              <p className="text-gold-medium font-bold tracking-wider text-xs sm:text-sm uppercase">
                PROPERTY EDUCATION, MADE SIMPLE.
              </p>
            </div>

            {/* Bullet points */}
            <ul className="space-y-4">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-gold-dark/15 text-gold-light' : 'bg-gold-medium/15 text-gold-dark'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className={`text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-gray-300 font-normal' : 'text-[#4a3415] font-medium'
                  }`}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>

          </div>

        </div>

      </div>
    </section>
  )
}

export default PortalSection
