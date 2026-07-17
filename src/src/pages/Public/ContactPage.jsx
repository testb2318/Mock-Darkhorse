import React from 'react'
import ContactSection from './HomeSections/ContactSection'
import FaqSection from './HomeSections/FaqSection'
import { useTheme } from '../../context/ThemeContext'
import { Globe, MapPin, Clock, Phone, HelpCircle, MessageSquare, Headphones, ShieldAlert, ArrowRight } from 'lucide-react'

const ContactPage = () => {
  const { isDark } = useTheme()

  const escalationSteps = [
    {
      stage: "Stage 1",
      title: "Digital Helpdesk",
      desc: "Submit a support inquiry directly via our email form. Standard response time is less than 2 hours.",
      icon: <MessageSquare className="w-5 h-5 text-gold-medium" />
    },
    {
      stage: "Stage 2",
      title: "Strategy Advisor Session",
      desc: "Schedule a virtual chart consultation session to review customized simulator indicators.",
      icon: <Headphones className="w-5 h-5 text-gold-medium" />
    },
    {
      stage: "Stage 3",
      title: "Institutional Desk Support",
      desc: "Eligible Elite Club members receive direct direct support hotlines and custom accounts managers.",
      icon: <ShieldAlert className="w-5 h-5 text-gold-medium" />
    }
  ]

  return (
    <div className="pt-20 min-h-screen">
      
      {/* 1. Visual Subpage Hero */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${
        isDark ? 'border-gold-dark/15 bg-dark-950/30' : 'border-gold-dark/20 bg-[#fdf8ef]/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Info */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
                Online Assistance
              </span>
              <h1 className={`text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-wide ${
                isDark ? 'text-white' : 'text-[#1a1200]'
              }`}>
                We are Here to <span className="bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">Support</span> Your Growth
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-gray-400 font-normal' : 'text-[#5a4225] font-medium'
              }`}>
                Whether you have technical questions about our custom TradingView indicator configurations, simulated calculators, or course syllabus milestones, our support advisor desk is available around the clock.
              </p>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                >
                  Message Desk
                </button>
              </div>
            </div>

            {/* Right Column: Glowing Framed Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className={`relative rounded-2xl p-2 border transition-all duration-300 w-full max-w-md ${
                isDark 
                  ? 'border-gold-dark/20 bg-dark-900/40 shadow-2xl shadow-black/50' 
                  : 'border-gold-dark/25 bg-[#fdf8ef]/85 shadow-2xl shadow-gold-dark/10'
              }`}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                  <img
                    src="/images/img_0.jpg"
                    alt="Support Team Desk"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Contact Form Section */}
      <ContactSection />

      {/* 3. Online Support Escalation Pathway (Enrichment Block) */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${
        isDark ? 'border-gold-dark/10 bg-dark-950/40' : 'border-gold-dark/15 bg-[#fdf8ef]/70'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-medium font-bold">
              Resolution Path
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
              isDark ? 'text-white' : 'text-[#1a1200]'
            }`}>
              Support Escalation Pathway
            </h2>
            <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
              Understand how our digital helpdesks systematically address and resolve your technical and syllabus inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {escalationSteps.map((step, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border p-8 transition-all duration-300 relative group overflow-hidden ${
                  isDark 
                    ? 'border-gold-dark/20 bg-dark-900/40 hover:border-gold-medium/40 shadow-lg' 
                    : 'border-gold-dark/25 bg-[#fdf8ef] hover:border-gold-medium/50 shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-medium block font-mono">
                      {step.stage}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center text-gold-light">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#6a5030]'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Support FAQ */}
      <FaqSection />

    </div>
  )
}

export default ContactPage
