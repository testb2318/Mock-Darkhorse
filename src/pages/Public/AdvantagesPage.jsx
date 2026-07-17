import React from 'react'
import AdvantagesSection from './HomeSections/AdvantagesSection'
import { useTheme } from '../../context/ThemeContext'
import { ShieldCheck, CheckCircle2, Award, Lock, FileCheck, HelpCircle } from 'lucide-react'

const AdvantagesPage = () => {
  const { isDark } = useTheme()

  const complianceStandards = [
    {
      icon: <Lock className="w-5 h-5 text-gold-medium" />,
      title: "AES-256 Custody Safeguards",
      desc: "All client training profiles, exam milestones, and deed registries are protected behind hardware security keys and multi-signature protocol keys."
    },
    {
      icon: <Award className="w-5 h-5 text-gold-medium" />,
      title: "FCA-Aligned Curriculum Layout",
      desc: "Our trade simulation criteria and training blueprints align directly with European and UK regulatory standards for retail financial products."
    },
    {
      icon: <FileCheck className="w-5 h-5 text-gold-medium" />,
      title: "Quarterly Third-Party Audits",
      desc: "We commission independent security audits on our ledger contracts and property ROI reports to ensure absolute transparency."
    }
  ]

  const comparisons = [
    { feature: "Real-Time Charts Feed", Mock: "Raw WebSocket data (no markups)", retailBrokers: "Broker-spread marked up data" },
    { feature: "Simulated Compounding tool", Mock: "Interactive radial radar compounding", retailBrokers: "Static manual formulas" },
    { feature: "Multi-Asset Options", Mock: "Forex, Stocks, Crypto, Real Estate", retailBrokers: "Single asset focus only" },
    { feature: "Structured Roadmap levels", Mock: "4-Stage levels with certifications", retailBrokers: "Random unsorted articles" },
    { feature: "Uptime and Latency", Mock: "99.98% uptime, <12ms API speed", retailBrokers: "Varies, highly lagging feeds" }
  ]

  return (
    <div className="pt-20 min-h-screen">

      {/* 1. Visual Subpage Hero */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${isDark ? 'border-gold-dark/15 bg-dark-950/30' : 'border-gold-dark/20 bg-[#fdf8ef]/50'
        }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Bold Info */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
                Competitive Advantages
              </span>
              <h1 className={`text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-wide ${isDark ? 'text-white' : 'text-[#1a1200]'
                }`}>
                Designed for <span className="bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">Optimal</span> Performance
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
                }`}>
                Discover the technical infrastructure, structural benefits, and transparent auditing processes that give our students and partners a decisive edge over traditional retail structures.
              </p>
              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                >
                  View Advantages Grid
                </button>
              </div>
            </div>

            {/* Right Column: Glowing Framed Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className={`relative rounded-2xl p-2 border transition-all duration-300 w-full max-w-md ${isDark
                  ? 'border-gold-dark/20 bg-dark-900/40 shadow-2xl shadow-black/50'
                  : 'border-gold-dark/25 bg-[#fdf8ef]/85 shadow-2xl shadow-gold-dark/10'
                }`}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <img
                    src="/images/img_28.jpg"
                    alt="Platform Advantage Statistics"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Advantages Section */}
      <AdvantagesSection />

      {/* 3. Platform Compliance & Safety Audit */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-gold-dark/10 bg-dark-950/20' : 'border-gold-dark/15 bg-[#fdf8ef]/50'
        }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Security Details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-medium" /> Integrity Standards
                </div>
                <h2 className={`text-3xl sm:text-4xl font-extrabold font-display leading-tight tracking-wide ${isDark ? 'text-white' : 'text-[#1a1200]'
                  }`}>
                  Enterprise-Grade Security &amp; Auditing
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
                  }`}>
                  To support retail traders worldwide, Dark Horse adheres to top international risk management standards. We safeguard simulator metrics, platform uptimes, and private portfolios.
                </p>
              </div>

              {/* Compliance list */}
              <div className="space-y-6">
                {complianceStandards.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-9 h-9 rounded-lg bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className={`font-bold font-display text-sm tracking-wider uppercase ${isDark ? 'text-white' : 'text-[#2a1b00]'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#6a5030]'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual compliance banner */}
            <div className="lg:col-span-5 flex justify-center">
              <div className={`relative rounded-2xl p-6 border w-full max-w-sm transition-all duration-300 ${isDark
                  ? 'border-gold-dark/20 bg-dark-900/60 shadow-2xl'
                  : 'border-gold-dark/25 bg-[#fdf8ef] shadow-2xl'
                }`}>
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gold-dark/15 border border-gold-medium/30 flex items-center justify-center text-gold-medium mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className={`text-lg font-bold font-display uppercase tracking-widest ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                      System Verified
                    </h3>
                    <p className={`text-xs leading-normal ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
                      Platform infrastructure matches global security keys and SSL registries.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-gold-dark/10 pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Encryption Layer</span>
                      <span className="font-mono text-gold-light font-bold">AES-256</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">API Response Speed</span>
                      <span className="font-mono text-gold-light font-bold">&lt; 12ms</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Data Feed Uptime</span>
                      <span className="font-mono text-gold-light font-bold">99.98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Comparison Table Section (Enrichment Block) */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-gold-dark/10 bg-dark-950/40' : 'border-gold-dark/15 bg-[#fdf8ef]/70'
        }`}>
        <div className="max-w-7xl mx-auto">

          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Feature Comparison
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'
              }`}>
              Platform Comparison Matrix
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              Contrast our system features directly against standard retail broker structures.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gold-dark/25 shadow-2xl">
            <table className={`w-full text-left text-sm border-collapse ${isDark ? 'bg-dark-900/40 text-gray-300' : 'bg-white text-[#4a3a20]'
              }`}>
              <thead>
                <tr className={`border-b ${isDark ? 'border-gold-dark/25 bg-dark-950' : 'border-gold-dark/30 bg-[#fdf8ef]'
                  }`}>
                  <th className="p-4 font-bold font-display uppercase tracking-wider text-xs">System Feature</th>
                  <th className="p-4 font-bold font-display uppercase tracking-wider text-xs text-gold-medium">Dark Horse System</th>
                  <th className="p-4 font-bold font-display uppercase tracking-wider text-xs">Standard Retail Broker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-dark/10">
                {comparisons.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-gold-dark/5 transition-all duration-200`}
                  >
                    <td className="p-4 font-semibold text-xs">{item.feature}</td>
                    <td className="p-4 font-bold text-xs text-gold-light">{item.Mock}</td>
                    <td className="p-4 text-xs text-gray-500">{item.retailBrokers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

    </div>
  )
}

export default AdvantagesPage
