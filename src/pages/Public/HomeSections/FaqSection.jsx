import React, { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { HelpCircle, ChevronDown, ShieldQuestion } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const FaqSection = ({ faqRef }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const { isDark } = useTheme()

  // const faqs = [
  //   {
  //     q: "What is Dark Horse Finance and how does it work?",
  //     a: "Dark Horse Finance is a high-performance quantitative educational institute. We provide modular, institutional-grade modules in Forex, Stock Markets, and Algo trading indicators. Members can additionally participate in our voluntary Elite Partner Network to refer other students and earn residual network overrides."
  //   },
  //   {
  //     q: "How does the Elite Partner Network referral commissions calculate?",
  //     a: "Our network program runs on a multi-tier binary structure. You earn a 10% direct commission when your referred partner acquires any course tier. As your binary team balances match volume between the left and right wings, you receive an additional 8% override commission. Higher ranks unlock up to 2% global pool shares."
  //   },
  //   {
  //     q: "Are the Daily Trading dividends guaranteed?",
  //     a: "Daily dividends simulated on the calculator represent historical performances of our custom automated trading indicator pools. Past results do not guarantee future profits. Actual results fluctuate depending on interbank market liquidity, currency spreads, and general market volatility."
  //   },
  //   {
  //     q: "Is there any charge to join the Partner Program?",
  //     a: "Participation in the partner program is entirely optional. Standard account creation and community membership are free. However, unlocking specific reward commissions and modular academy classrooms requires acquiring the corresponding modular course packages starting at $100."
  //   },
  //   {
  //     q: "How are withdrawals and referral points managed?",
  //     a: "All network sales volumes, matching point registers, and course rewards are tracked transparently in real-time on our secure digital ledger. Withdrawals can be requested via supported secure banking channels or automated crypto gateways."
  //   }
  // ]

  const faqs = [
    {
      q: "What is Dark Horse and how does it work?",
      a: " Dark Horse is an educational platform focused on financial market literacy. We provide structured, modular learning content covering Forex, Stock Markets, Cryptocurrency, and Real Estate fundamentals — along with live market data tools to support hands-on learning and analysis."
    },
    {
      q: "Is the educational content free to access?",
      a: "We offer a mix of free and premium learning resources. Free content includes introductory modules and live market data, while premium modules offer deeper, structured curriculum on specific topics."
    },
    {
      q: "Are the strategies or examples shown on the platform guaranteed to work in real markets?",
      a: "All content, including charts, indicators, and strategy examples, is provided strictly for educational purposes. Markets are inherently unpredictable, and past performance or simulated examples do not guarantee future results."
    },
    {
      q: "Do I need trading experience to join Dark Horse?",
      a: "Not at all. Our modules are designed for learners at every level — from complete beginners to those looking to deepen their understanding of market structure and analysis."
    },
    {
      q: "How can I track my learning progress?",
      a: "Your dashboard shows completed lessons, modules in progress, and recommended next steps based on the topics you've explored.."
    }
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      ref={faqRef}
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5 text-gold-medium" /> FAQ Support
        </div>
        <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
          Frequently Answered Parameters
        </h2>
        <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
          Need details on our learning modules, platform features, or how to get
          started with Dark Horse?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Column: Collapsible FAQs */}
        <div className="lg:col-span-7 space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = activeIndex === idx
            return (
              <div
                key={idx}
                className={`rounded-xl border overflow-hidden transition-all duration-300 ${isDark ? 'glass-card border-gold-dark/15' : 'bg-[#fdf8ef] border-gold-dark/20'}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left text-sm font-bold hover:bg-gold-dark/5 transition-colors cursor-pointer ${isDark ? 'text-white' : 'text-[#1a1200]'}`}
                >
                  <span className="pr-4">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-medium shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] border-t opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden ${isDark ? 'border-gold-dark/10' : 'border-gold-dark/15'}`}
                >
                  <p className={`px-6 py-5 text-xs leading-relaxed font-light ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: Premium Interactive FAQ Image wrapped in Tilt */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            className="w-full max-w-[420px]"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gold-medium/20 shadow-2xl bg-dark-900/60 p-4 flex flex-col space-y-4 glow-gold">

              {/* Overlay graphics */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10 pointer-events-none"></div>

              {/* Main Image */}
              <div className="h-64 rounded-xl overflow-hidden relative">
                <img
                  src="/images/img_5.jpg"
                  alt="Financial Advisory Help Support"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Support Info Box */}
              <div className="relative z-20 p-2 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldQuestion className="w-5 h-5 text-gold-medium" />
                  <span className="text-xs uppercase font-bold tracking-widest text-white">Learner Support Center</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Our support team is available to help with platform 
navigation, module access, and general questions about our educational 
resources.
                </p>

                <div className="pt-2 border-t border-gold-dark/10 flex items-center justify-between text-[10px] text-gold-light uppercase tracking-wider font-semibold">
                  <span>SUPPORT CENTER: ACTIVE</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
              </div>

            </div>
          </Tilt>
        </div>

      </div>
    </section>
  )
}

export default FaqSection
