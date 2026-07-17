import React from 'react'
import Tilt from 'react-parallax-tilt'
import { DollarSign, ShieldAlert, Award, ArrowUpRight } from 'lucide-react'

const CalculatorSection = ({ 
  calcRef, 
  capital: propCapital, setCapital: propSetCapital, 
  referrals: propReferrals, setReferrals: propSetReferrals, 
  teamSize: propTeamSize, setTeamSize: propSetTeamSize,
  calculatedDailyPayout: propCalculatedDailyPayout,
  calculatedDirectBonus: propCalculatedDirectBonus,
  calculatedTeamVolumeBonus: propCalculatedTeamVolumeBonus,
  totalMonthlyPotential: propTotalMonthlyPotential
}) => {
  // Local fallback states if not provided as props
  const [localCapital, setLocalCapital] = React.useState(1000)
  const [localReferrals, setLocalReferrals] = React.useState(3)
  const [localTeamSize, setLocalTeamSize] = React.useState(10)

  const capital = propCapital !== undefined ? propCapital : localCapital
  const setCapital = propSetCapital !== undefined ? propSetCapital : setLocalCapital

  const referrals = propReferrals !== undefined ? propReferrals : localReferrals
  const setReferrals = propSetReferrals !== undefined ? propSetReferrals : setLocalReferrals

  const teamSize = propTeamSize !== undefined ? propTeamSize : localTeamSize
  const setTeamSize = propSetTeamSize !== undefined ? propSetTeamSize : setLocalTeamSize

  const calculatedDailyPayout = propCalculatedDailyPayout !== undefined 
    ? propCalculatedDailyPayout 
    : (capital * 0.015).toFixed(2)

  const calculatedDirectBonus = propCalculatedDirectBonus !== undefined 
    ? propCalculatedDirectBonus 
    : (referrals * 500 * 0.10).toFixed(2)

  const calculatedTeamVolumeBonus = propCalculatedTeamVolumeBonus !== undefined 
    ? propCalculatedTeamVolumeBonus 
    : (teamSize * 300 * 0.08).toFixed(2)

  const totalMonthlyPotential = propTotalMonthlyPotential !== undefined 
    ? propTotalMonthlyPotential 
    : (parseFloat(calculatedDirectBonus) + (parseFloat(calculatedDailyPayout) * 30) + parseFloat(calculatedTeamVolumeBonus)).toFixed(2)

  // Compute basic percentages for the dynamic radial progress ring
  // Monthly multiplier calculation: (Monthly returns / Capital) * 100
  const monthlyReturnVal = parseFloat(calculatedDailyPayout) * 30
  const returnPercentage = Math.min(((monthlyReturnVal / capital) * 100), 100).toFixed(1)
  const networkGrowthMultiplier = Math.min(((parseFloat(totalMonthlyPotential) / capital) * 100), 400).toFixed(0)

  // Radial progress offset: 2 * PI * r (r = 40) => ~251.2
  const strokeDashoffset = 251.2 - (251.2 * Math.min(parseFloat(networkGrowthMultiplier), 100)) / 100

  return (
    <section 
      id="calculator" 
      ref={calcRef}
      className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-dark-900/40 border-y border-gold-dark/10 overflow-hidden"
    >
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 rounded-full bg-gold-medium/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-light text-[10px] font-bold uppercase tracking-widest">
            <DollarSign className="w-3.5 h-3.5 text-gold-medium" /> Estimator Tool
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Network Wealth Estimator
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Input hypothetical metrics to simulate daily algorithmic returns and compounding partner rewards.
          </p>
        </div>

        {/* Wrap Entire Calculator Panel in Tilt */}
        <Tilt 
          tiltMaxAngleX={3} 
          tiltMaxAngleY={3} 
          perspective={1500} 
          scale={1.01}
          className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="calc-panel w-full rounded-2xl glass-card border border-gold-medium/20 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 glow-gold">
            
            {/* Left Inputs (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Slider 1: Capital */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">Acquisition Package (Capital)</span>
                  <span className="font-bold text-gold-medium font-mono text-md">${capital.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100" 
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full accent-gold-medium h-1.5 bg-dark-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-600 font-semibold uppercase">
                  <span>$100 Starter</span>
                  <span>$10k Executive</span>
                </div>
              </div>

              {/* Slider 2: Referrals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">Direct Partners Referred</span>
                  <span className="font-bold text-gold-medium font-mono text-md">{referrals} Partners</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  step="1" 
                  value={referrals}
                  onChange={(e) => setReferrals(Number(e.target.value))}
                  className="w-full accent-gold-medium h-1.5 bg-dark-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-600 font-semibold uppercase">
                  <span>0 Members</span>
                  <span>15 Members</span>
                </div>
              </div>

              {/* Slider 3: Team size */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">Total Network Size (Binary)</span>
                  <span className="font-bold text-gold-medium font-mono text-md">{teamSize} Members</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5" 
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-gold-medium h-1.5 bg-dark-900 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-600 font-semibold uppercase">
                  <span>0 Team</span>
                  <span>100 Team</span>
                </div>
              </div>

              {/* Dynamic Warning Alert */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gold-dark/5 border border-gold-dark/10 text-[11px] text-gray-500 leading-normal">
                <ShieldAlert className="w-5 h-5 text-gold-medium shrink-0" />
                <span>Simulated values assume network members buy educational modules equal to your course tier size. The binary Matching commission balance is calculated based on even splits between your dual channels. Commissions are calculated based on module acquisitions only. No trading deposits are utilized.</span>
              </div>
            </div>

            {/* Right Outputs (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-dark-900/60 rounded-xl border border-gold-dark/15 p-6 flex flex-col justify-between space-y-6">
              <h3 className="text-xs uppercase font-bold tracking-widest text-gold-light border-b border-gold-dark/10 pb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-medium" /> Simulated Yield Metrics
              </h3>

              {/* Simulated Price Lists */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-gold-dark/5 pb-2">
                  <span className="text-gray-500">Daily Trading ROI (1.2%):</span>
                  <span className="font-bold text-white font-mono">${calculatedDailyPayout}/day</span>
                </div>
                
                <div className="flex justify-between items-center text-xs border-b border-gold-dark/5 pb-2">
                  <span className="text-gray-500">Direct Referred Bonus (10%):</span>
                  <span className="font-bold text-white font-mono">${calculatedDirectBonus} Instant</span>
                </div>

                <div className="flex justify-between items-center text-xs border-b border-gold-dark/5 pb-2">
                  <span className="text-gray-500">Binary Matching Comm. (8%):</span>
                  <span className="font-bold text-white font-mono">${calculatedTeamVolumeBonus} Team</span>
                </div>
              </div>

              {/* Circular Gauge and Growth Index */}
              <div className="flex items-center gap-5 pt-2">
                {/* SVG Progress Circle */}
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-dark-700 stroke-[8px] fill-transparent"
                    />
                    <circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-gold-medium stroke-[8px] fill-transparent transition-all duration-300"
                      strokeDasharray="251.2"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                    {networkGrowthMultiplier}%
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide block font-semibold">Compounded Network Yield</span>
                  <p className="text-xs text-gray-400 leading-normal">
                    This setup yields <strong className="text-gold-light font-bold font-mono">{networkGrowthMultiplier}%</strong> of your initial course costs within standard marketing cycles.
                  </p>
                </div>
              </div>

              {/* Total Monthly Projection */}
              <div className="pt-4 border-t-2 border-dashed border-gold-dark/20 text-center space-y-2">
                <span className="text-[10px] text-gold-light uppercase tracking-wider block font-bold">Estimated Monthly Potentials</span>
                <div className="text-3xl font-extrabold font-display bg-gradient-to-r from-gold-light to-gold-dark bg-clip-text text-transparent flex items-center justify-center gap-1">
                  ${Number(totalMonthlyPotential).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  <ArrowUpRight className="w-5 h-5 text-gold-medium animate-pulse" />
                </div>
                <span className="text-[9px] text-gray-600 block leading-tight">Monthly returns include 30 days of trading dividends and active overrides.</span>
              </div>

            </div>

          </div>
        </Tilt>

      </div>
    </section>
  )
}

export default CalculatorSection
