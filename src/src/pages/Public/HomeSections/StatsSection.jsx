import React from 'react'

const StatsSection = ({ statsRef }) => {
  return (
    <section 
      ref={statsRef}
      className="relative z-10 py-12 bg-dark-900 border-y border-gold-dark/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          
          <div className="stat-card space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold font-display text-white">$12.4M+</span>
            <span className="block text-xs uppercase tracking-widest text-gold-medium font-semibold">Volume Exchanged</span>
          </div>
          
          <div className="stat-card space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold font-display text-white">18,500+</span>
            <span className="block text-xs uppercase tracking-widest text-gold-medium font-semibold">Active Partners</span>
          </div>
          
          <div className="stat-card space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold font-display text-white">94.2%</span>
            <span className="block text-xs uppercase tracking-widest text-gold-medium font-semibold">Student Accuracy</span>
          </div>
          
          <div className="stat-card space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold font-display text-white">1.2% - 1.8%</span>
            <span className="block text-xs uppercase tracking-widest text-gold-medium font-semibold">Daily Algorithmic ROI</span>
          </div>

        </div>
      </div>
    </section>
  )
}

export default StatsSection
