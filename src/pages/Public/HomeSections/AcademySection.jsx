import React from 'react'
import Tilt from 'react-parallax-tilt'
import { BookOpen, ChevronRight } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const AcademySection = ({ academyRef }) => {
  const { isDark } = useTheme()
  return (
    <section
      id="academy"
      ref={academyRef}
      className={`relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-y ${isDark ? 'bg-dark-900/40 border-gold-dark/10' : 'bg-[#f0e8d0]/40 border-gold-dark/15'}`}
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-gold-medium" /> STRUCTURED LEARNING PATH
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
            Dark Horse Learning Modules
          </h2>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
            Step-by-step educational content designed to build your understanding of 
market structure, one module at a time.
          </p>
        </div>

        {/* Grid Layout of Courses with Parallax Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1 */}
          <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} perspective={1000} scale={1.03} className="academy-card">
            <div className="rounded-2xl overflow-hidden glass-card flex flex-col justify-between h-[390px] glow-gold-hover transition-shadow duration-300">
              <div className="h-44 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10"></div>
                <img
                  src="/images/img_1.jpg"
                  alt="Forex Trading Fundamentals"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gold-medium">Module I</span>
                  <h3 className="text-md font-bold text-white leading-snug">Forex Structure & Liquidity Concepts</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    Learn about order book flow, banking liquidity concepts, interbank 
spreads, and risk allocation fundamentals.
                  </p>
                </div>
                <div className="pt-4 border-t border-gold-dark/10 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase">12 Lessons</span>
                  <span className="text-xs font-bold text-gold-light flex items-center gap-1 cursor-pointer">
                    Unlock <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Tilt>

          {/* Card 2 */}
          <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} perspective={1000} scale={1.03} className="academy-card">
            <div className="rounded-2xl overflow-hidden glass-card flex flex-col justify-between h-[390px] glow-gold-hover transition-shadow duration-300">
              <div className="h-44 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10"></div>
                <img
                  src="/images/img_2.jpg"
                  alt="Stock Market Trading"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gold-medium">Module II</span>
                  <h3 className="text-md font-bold text-white leading-snug">Equities & Stock Market Mechanics</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    Understand market capitalization, corporate earnings basics, options 
volatility, and growth stock indicators.
                  </p>
                </div>
                <div className="pt-4 border-t border-gold-dark/10 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase">15 Lessons</span>
                  <span className="text-xs font-bold text-gold-light flex items-center gap-1 cursor-pointer">
                    Unlock <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Tilt>

          {/* Card 3 */}
          <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} perspective={1000} scale={1.03} className="academy-card">
            <div className="rounded-2xl overflow-hidden glass-card flex flex-col justify-between h-[390px] glow-gold-hover transition-shadow duration-300">
              <div className="h-44 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10"></div>
                <img
                  src="/images/img_1.jpg"
                  alt="Algorithmic Trading Strategies"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gold-medium">Module III</span>
                  <h3 className="text-md font-bold text-white leading-snug">Quantitative Algorithms & Indicators</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    Introduction to scripting strategies, volume profiles, momentum 
oscillators, and automated analysis tools.
                  </p>
                </div>
                <div className="pt-4 border-t border-gold-dark/10 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase">18 Lessons</span>
                  <span className="text-xs font-bold text-gold-light flex items-center gap-1 cursor-pointer">
                    Unlock <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Tilt>

          {/* Card 4 */}
          <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} perspective={1000} scale={1.03} className="academy-card">
            <div className="rounded-2xl overflow-hidden glass-card flex flex-col justify-between h-[390px] glow-gold-hover transition-shadow duration-300">
              <div className="h-44 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10"></div>
                <img
                  className="w-full h-full object-cover"
                  src="/images/img_3.jpg"
                  alt="Capital Management"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gold-medium">Module IV</span>
                  <h3 className="text-md font-bold text-white leading-snug">Risk Awareness & Capital Principles</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    Understand drawdown limits, leverage concepts, compounding principles, 
and portfolio risk fundamentals.
                  </p>
                </div>
                <div className="pt-4 border-t border-gold-dark/10 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase">10 Lessons</span>
                  <span className="text-xs font-bold text-gold-light flex items-center gap-1 cursor-pointer">
                    Unlock <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Tilt>

        </div>
      </div>
    </section>
  )
}

export default AcademySection
