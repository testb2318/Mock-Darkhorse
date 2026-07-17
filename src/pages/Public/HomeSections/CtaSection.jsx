import React from 'react'
import { ArrowRight } from 'lucide-react'

const CtaSection = ({ onJoinClick }) => {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden border border-gold-medium/20 glass-card p-8 sm:p-12 text-center space-y-6">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('/images/img_4.jpg')` }}></div>
        <div className="absolute inset-0 bg-radial from-transparent to-black pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Ready to Deepen Your Market Knowledge?
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-light">
            Don't learn alone. Sharpen your analytical skills, understand institutional 
market concepts, and grow with the Dark Horse learning community.
          </p>
          <div className="pt-4">
            <button 
              onClick={onJoinClick}
              className="px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/20 transition-all cursor-pointer inline-flex items-center gap-1.5 transform hover:-translate-y-0.5"
            >
             JOIN THE COMMUNITY  <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
