import React from 'react'
import { Landmark } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import TradingViewTopStories from '../../../ThirdApi/TradingViewTopStories'

// All images for the marquee rows
const row1Images = [
  {
    img: '/images/img_7.jpg',
    label: 'Forex Markets',
  },
  {
    img: '/images/img_8.jpg',
    label: 'S&P 500 Rally',
  },
  {
    img: '/images/img_21.jpg',
    label: 'Bitcoin Surge',
  },
  {
    img: '/images/img_22.jpg',
    label: 'Bond Markets',
  },
  {
    img: '/images/img_7.jpg',
    label: 'Commodities',
  },
  {
    img: '/images/img_23.jpg',
    label: 'Stock Exchange',
  },
]

const row2Images = [
  {
    img: '/images/img_24.jpg',
    label: 'Crypto Derivatives',
  },
  {
    img: '/images/img_25.jpg',
    label: 'Real Estate',
  },
  {
    img: '/images/img_24.jpg',
    label: 'Market Volatility',
  },
  {
    img: '/images/img_26.jpg',
    label: 'Portfolio Strategy',
  },
  {
    img: '/images/img_27.jpg',
    label: 'Algorithmic Trading',
  },
  {
    img: '/images/img_7.jpg',
    label: 'FX Liquidity',
  },
]

const row3Images = [
  {
    img: '/images/img_28.jpg',
    label: 'Market Analysis',
  },
  {
    img: '/images/img_29.jpg',
    label: 'Investment Banking',
  },
  {
    img: '/images/img_30.jpg',
    label: 'Risk Management',
  },
  {
    img: '/images/img_31.jpg',
    label: 'Global Assets',
  },
  {
    img: '/images/img_32.jpg',
    label: 'Wealth Management',
  },
  {
    img: '/images/img_27.jpg',
    label: 'Capital Markets',
  },
]

// Single image card for the marquee rows
const MarqueeCard = ({ img, label, isDark }) => (
  <div
    className={`relative flex-shrink-0 w-52 h-36 rounded-xl overflow-hidden border cursor-pointer group ${isDark ? 'border-gold-dark/20' : 'border-gold-dark/25'
      }`}
    style={{ margin: '0 6px' }}
  >
    <img
      src={img}
      alt={label}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
    {/* Label */}
    <span className="absolute bottom-2.5 left-3 text-[10px] font-bold text-white uppercase tracking-wider line-clamp-1">
      {label}
    </span>
    {/* Gold accent line on hover */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-dark to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
  </div>
)

const NewsSection = ({ newsRef }) => {
  const { isDark } = useTheme()

  // Duplicate arrays for seamless infinite loop
  const row1Loop = [...row1Images, ...row1Images]
  const row2Loop = [...row2Images, ...row2Images]
  const row3Loop = [...row3Images, ...row3Images]

  return (
    <section
      id="news"
      ref={newsRef}
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
            <Landmark className="w-3.5 h-3.5 text-gold-medium" /> Market Intelligence
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
            Live News &amp; Market Intelligence Feeds
          </h2>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
            Breaking market news in real-time powered by TradingView — all instruments covered.
          </p>
        </div>

        {/* 7 / 5 COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* ─── LEFT 7 cols: Triple-Row Marquee Image Slider ─── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className={`relative rounded-2xl overflow-hidden bor flex-1 flex flex-col justify-between gap-4 py-6 ${isDark ? 'borde bg-dark-900/30' : 'border-gold-dark/25 bg-[#f0e8d0]/40'
              }`}>

              {/* Top label */}
              <div className="px-6 mb-1 flex-shrink-0">
                <div className="inline-flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
                    Live Market Highlights
                  </span>
                </div>
              </div>

              {/* Marquee Container */}
              <div className="flex flex-col gap-4 justify-center flex-1 my-auto">
                {/* ─── ROW 1: slides LEFT (→ left, normal marquee) ─── */}
                <div className="relative w-full overflow-hidden">
                  {/* Left fade */}
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-r from-dark-950/60 to-transparent' : 'bg-gradient-to-r from-[#f0e8d0]/80 to-transparent'
                    }`} />
                  {/* Right fade */}
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-l from-dark-950/60 to-transparent' : 'bg-gradient-to-l from-[#f0e8d0]/80 to-transparent'
                    }`} />

                  <div className="flex animate-marquee" style={{ width: 'max-content' }}>
                    {row1Loop.map((item, i) => (
                      <MarqueeCard key={`r1-${i}`} img={item.img} label={item.label} isDark={isDark} />
                    ))}
                  </div>
                </div>

                {/* ─── ROW 2: slides RIGHT (← right, reverse marquee) ─── */}
                <div className="relative w-full overflow-hidden">
                  {/* Left fade */}
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-r from-dark-950/60 to-transparent' : 'bg-gradient-to-r from-[#f0e8d0]/80 to-transparent'
                    }`} />
                  {/* Right fade */}
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-l from-dark-950/60 to-transparent' : 'bg-gradient-to-l from-[#f0e8d0]/80 to-transparent'
                    }`} />

                  <div className="flex animate-marquee-reverse" style={{ width: 'max-content' }}>
                    {row2Loop.map((item, i) => (
                      <MarqueeCard key={`r2-${i}`} img={item.img} label={item.label} isDark={isDark} />
                    ))}
                  </div>
                </div>

                {/* ─── ROW 3: slides LEFT (→ left, normal marquee) ─── */}
                <div className="relative w-full overflow-hidden">
                  {/* Left fade */}
                  <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-r from-dark-950/60 to-transparent' : 'bg-gradient-to-r from-[#f0e8d0]/80 to-transparent'
                    }`} />
                  {/* Right fade */}
                  <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-l from-dark-950/60 to-transparent' : 'bg-gradient-to-l from-[#f0e8d0]/80 to-transparent'
                    }`} />

                  <div className="flex animate-marquee" style={{ width: 'max-content' }}>
                    {row3Loop.map((item, i) => (
                      <MarqueeCard key={`r3-${i}`} img={item.img} label={item.label} isDark={isDark} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom label strip */}
              <div className="px-6 mt-1 flex items-center justify-between flex-shrink-0">
                <span className={`text-[9px] uppercase tracking-widest font-mono ${isDark ? 'text-gray-600' : 'text-[#b0956a]'}`}>
                  Forex · Stocks · Crypto · Commodities · Bonds
                </span>
                <span className={`text-[9px] font-mono ${isDark ? 'text-gold-dark/50' : 'text-gold-dark/60'}`}>
                  Continuous Feed ↔
                </span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT 5 cols: TradingView Live News Top Stories ─── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className={`relative rounded-2xl overflow-hidden border flex-1 flex flex-col ${isDark ? 'border-gold-dark/20 bg-dark-900/40' : 'border-gold-dark/30 bg-[#fdf8ef]/80'
              }`}>

              {/* Widget header */}
              <div className={`flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0 ${isDark ? 'border-gold-dark/15' : 'border-gold-dark/20'
                }`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                    Live News Feed
                  </span>
                </div>
                <span className="text-[9px] text-gold-medium font-mono uppercase font-bold">All Symbols</span>
              </div>

              {/* TradingView Top Stories widget */}
              <div className="flex-1 overflow-hidden">
                <TradingViewTopStories isDark={isDark} height={510} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default NewsSection
