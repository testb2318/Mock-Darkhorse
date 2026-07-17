import React from 'react'
import CandleChart from '../../web/charts/CandleChart'
import TradingViewSingleTicker from '../../ThirdApi/TradingViewSingleTicker'
import { Globe } from 'lucide-react'
import Tilt from 'react-parallax-tilt';
import TradingViewTicker from '../../ThirdApi/TradingViewTicker';


const Markets = () => {

    const cardImages = {
//   forex:  '/images/img_4.jpg',
  stocks: '/images/img_1.jpg',
//   crypto: '/images/img_19.jpg',
}
  return (
    <div>

         <section className={`py-20 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Info */}
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
                Live Data Feeds
              </span>
              <h1 className={`text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-wide`}>
                Real-Time <span className="bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">Market</span> Execution
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed `}>
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
           <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} className="lg:col-span-4 flex justify-center">
            <div className={`relative rounded-2xl overflow-hidden border border-gold-medium/25 flex flex-col h-[400px] glow-gold`}>
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                style={{ backgroundImage: `url('${cardImages.forex}')`, }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[1] pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-gold-dark/20">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gold-medium" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Forex Liquidity</h3>
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-mono font-bold">24/5 Live</span>
              </div>

              {/* Live Widget: EUR/USD — scrollable container */}
              <div className="relative z-10 flex-1 flex flex-col px-4 py-3 gap-2 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.35) transparent' }}>
                <p className="text-[9px] text-gold-medium/70 uppercase tracking-widest font-bold mb-1 flex-shrink-0">Live Single Quote</p>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="OANDA:EURUSD"  />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="OANDA:GBPUSD"  />
                </div>
                <div className="rounded-xl overflow-hidden border border-gold-dark/20 flex-shrink-0">
                  <TradingViewSingleTicker symbol="FX:USDJPY"  />
                </div>
              </div>

           

              {/* <button
                onClick={() => triggerOrder('EUR/USD', 'BUY')}
                className="relative z-10 mx-4 mb-4 py-2.5 bg-gradient-to-r from-gold-dark to-gold-medium text-black text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Order FX Instant
              </button> */}
            </div>
          </Tilt>
         
          </div>
        </div>
      </section>
                <div className={`relative w-full rounded-xl overflow-hidden  mb-12 `}>
          <TradingViewTicker />
        </div>
      <CandleChart height={480} />
    </div>
  )
}

export default Markets
