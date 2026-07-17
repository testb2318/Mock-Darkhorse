import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, UserCheck } from 'lucide-react'

// Import modular sections
import HeroSection from './HomeSections/HeroSection'
import StatsSection from './HomeSections/StatsSection'
import FeaturesSection from './HomeSections/FeaturesSection'
import CtaSection from './HomeSections/CtaSection'
import ContactSection from './HomeSections/ContactSection'
import MarketsSection from './HomeSections/MarketsSection'
import EcosystemSection from './HomeSections/EcosystemSection'
import AcademySection from './HomeSections/AcademySection'
import NewsSection from './HomeSections/NewsSection'
import TestimonialsSection from './HomeSections/TestimonialsSection'
import AdvantagesSection from './HomeSections/AdvantagesSection'
import FaqSection from './HomeSections/FaqSection'
import IdeasSection from './HomeSections/IdeasSection'

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [sponsorId, setSponsorId] = useState('DH_GLOBAL_ELITE')
  const [formData, setFormData] = useState({ name: '', email: '', agree: false })
  const [showSuccessParticles, setShowSuccessParticles] = useState(false)

  // Ref nodes for GSAP ScrollTriggers
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  // Listen to open-register-modal custom events from Navbar
  useEffect(() => {
    const handleOpenModal = () => setIsRegisterOpen(true)
    window.addEventListener('open-register-modal', handleOpenModal)
    return () => window.removeEventListener('open-register-modal', handleOpenModal)
  }, [])

  // GSAP Animations setup
  useEffect(() => {
    // Kill any existing ScrollTriggers to prevent duplicates on rerender
    ScrollTrigger.getAll().forEach(t => t.kill())

    // Hero Section entry animations
    const heroCtx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from('.hero-badge', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.out' })
        .from('.hero-title span', { opacity: 0, y: 30, stagger: 0.15, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-desc', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.5')
        .from('.hero-ctas', { opacity: 0, y: 15, duration: 0.5, ease: 'power2.out' }, '-=0.4')
        .from('.hero-graphic', { 
          x: -1000, 
          y: -800, 
          rotation: 360, 
          scale: 0.2, 
          opacity: 0, 
          duration: 2.0, 
          ease: 'power4.out' 
        }, '-=0.8')
    }, heroRef)

    // Scroll trigger for Features
    gsap.fromTo(
      '#features .glass-card',
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        }
      }
    )

    return () => {
      heroCtx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setShowSuccessParticles(true)
    setTimeout(() => {
      setShowSuccessParticles(false)
      setIsRegisterOpen(false)
      alert(`Welcome to the Elite Circle! Registered under Sponsor: ${sponsorId}`)
    }, 2500)
  }

  return (
    <div className="relative font-sans text-gray-300">
      
      {/* 1. HERO SECTION */}
      <HeroSection heroRef={heroRef} onJoinClick={() => setIsRegisterOpen(true)} />


      <MarketsSection/>

      {/* 2. STATS SECTION */}
      {/* <StatsSection /> */}

      {/* 3. PLATFORM FEATURES */}
      <EcosystemSection/>

      <AdvantagesSection/>

     <AcademySection/>

   <NewsSection/>


      <FeaturesSection featuresRef={featuresRef} />

      {/* 4. VIP CTA ACTION BANNER */}

      <TestimonialsSection/>
    
      <FaqSection/>

      {/* <IdeasSection/> */}

      <CtaSection onJoinClick={() => setIsRegisterOpen(true)} />

      {/* 5. CONTACT DESK SECTION */}
      <ContactSection />

      {/* REGISTRATION MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-gold-medium/30 p-8 bg-dark-950/95 shadow-2xl overflow-hidden glass-card">
            <button 
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gold-light cursor-pointer"
            >
              ✕
            </button>

            {showSuccessParticles && (
              <div className="absolute inset-0 z-25 bg-black/90 flex flex-col items-center justify-center text-center space-y-4 p-6">
                <div className="w-16 h-16 rounded-full bg-gold-medium/20 border border-gold-medium flex items-center justify-center text-gold-light animate-bounce">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display text-white">Elite Circle Application Approved</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Initializing trading terminals, generating sponsor pathways, and sending onboarding emails...
                </p>
              </div>
            )}

            <div className="text-center space-y-2 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-medium/30 bg-black flex items-center justify-center p-0.5 glow-gold mx-auto">
                <img
                  src="/logo.jpeg"
                  alt="Dark Horse Finance Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="text-lg font-bold font-display uppercase tracking-widest text-white">Elite Club Application</h2>
              <p className="text-xs text-gray-500">Submit parameters to link with the Dark Horse global network.</p>
            </div>

            <div className="bg-dark-900/60 rounded-lg p-3 border border-gold-dark/10 mb-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold-medium" />
                <span className="text-gray-500">Assigned Sponsor:</span>
              </div>
              <span className="font-mono font-bold text-gold-light">{sponsorId}</span>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 uppercase tracking-wider block font-semibold">Full Legal Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alexander Mercer"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-dark-900 border border-gold-dark/20 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold-medium/60 focus:ring-1 focus:ring-gold-medium/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 uppercase tracking-wider block font-semibold">Corporate Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="alexander@mercerholding.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-900 border border-gold-dark/20 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold-medium/60 focus:ring-1 focus:ring-gold-medium/60"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input 
                  type="checkbox" 
                  id="agree"
                  required
                  checked={formData.agree}
                  onChange={(e) => setFormData({...formData, agree: e.target.checked})}
                  className="mt-1 accent-gold-medium rounded"
                />
                <label htmlFor="agree" className="text-[10px] text-gray-500 leading-normal">
                  I agree to the <span className="text-gold-light hover:underline cursor-pointer">Risk Disclosure Policy</span> and acknowledge that trading carries high volatility. I confirm sponsor link details are correct.
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 rounded-lg text-center text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home
