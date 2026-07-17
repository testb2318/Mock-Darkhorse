import React, { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { Send, Mail, MessageSquare, User, Phone, CheckCircle2, Headphones } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'

const ContactSection = ({ contactRef }) => {
  const { isDark } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    }, 1500)
  }

  const inputCls = `w-full rounded-lg px-4 py-3 text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-gold-medium/30 ${isDark
    ? 'bg-dark-900/60 border-gold-dark/25 text-gray-200 placeholder-gray-600 focus:border-gold-medium/60'
    : 'bg-white border-[#c4a86a]/50 text-[#1a1200] placeholder-[#b0956a] focus:border-gold-medium/70 focus:ring-gold-medium/20'
    }`

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-gold-medium" />,
      label: 'Email Us',
      value: 'support@Mock.ceo',
      // sub: 'Response within 24 hours'
    },
    {
      icon: <Headphones className="w-5 h-5 text-gold-medium" />,
      label: 'Live Support',
      value: 'Chat Desk',
      // sub: 'Available 24/5 — market hours'
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-gold-medium" />,
      label: 'Community',
      value: 'Join Our Discord',
      // sub: '10,000+ active members'
    }
  ]

  return (
    <section
      id="contact"
      ref={contactRef}
      className={`relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-y ${isDark ? 'bg-dark-900/30 border-gold-dark/10' : 'bg-[#ede5d4] border-gold-dark/25'
        }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gold-dark/10 border border-gold-medium/10 text-gold-dark text-[10px] font-bold uppercase tracking-widest">
            <MessageSquare className="w-3.5 h-3.5 text-gold-medium" /> Get In Touch
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
            Contact Our Support Desk
          </h2>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
            Have questions about our learning modules, platform features, or market
            tools? Our support team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left — Contact Info Cards */}
          <div className="lg:col-span-4 space-y-5">
            {contactInfo.map((info, idx) => (
              <Tilt key={idx} tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1000} scale={1.02}>
                <div className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 ${isDark
                  ? 'border-gold-dark/20 bg-dark-900/60 glow-gold'
                  : 'border-[#c4a86a]/50 bg-white shadow-md shadow-gold-dark/10'
                  }`}>
                  <div className="w-10 h-10 rounded-xl bg-gold-dark/10 border border-gold-medium/20 flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase tracking-widest font-bold mb-0.5 ${isDark ? 'text-gray-500' : 'text-[#9a8060]'}`}>
                      {info.label}
                    </p>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>{info.value}</p>
                    {/* <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-600' : 'text-[#9a8060]'}`}>{info.sub}</p> */}
                  </div>
                </div>
              </Tilt>
            ))}

            {/* Support Hours */}
            <p>Dark Horse is a financial education platform built to help learners
              understand how markets truly work. We bring together structured content
              across Real Estate, Forex, Equities, and Cryptocurrencies — combining
              live market data, analytical tools, and community-driven insights into
              one accessible learning experience. Whether you're just starting out or
              looking to sharpen your market understanding, Dark Horse is designed to
              make financial literacy clear, practical, and within reach for everyone.</p>
            {/* <div className={`p-5 rounded-2xl border-2 ${isDark ? 'border-gold-dark/20 bg-dark-900/60' : 'border-[#c4a86a]/50 bg-white shadow-md shadow-gold-dark/10'
              }`}>
              <h4 className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${isDark ? 'text-gray-500' : 'text-[#9a8060]'}`}>
                Support Hours
              </h4>
              {[
                { day: 'Monday – Friday', time: '08:00 – 22:00 UTC' },
                { day: 'Saturday', time: '10:00 – 18:00 UTC' },
                { day: 'Sunday', time: 'Emergency Only' },
              ].map(({ day, time }) => (
                <div key={day} className={`flex justify-between text-xs py-1.5 border-b last:border-0 ${isDark ? 'border-gold-dark/10 text-gray-400' : 'border-[#c4a86a]/30 text-[#4a3a20]'
                  }`}>
                  <span>{day}</span>
                  <span className="text-gold-medium font-mono font-bold">{time}</span>
                </div>
              ))}
            </div> */}
          </div>

          {/* Right — Contact Form */}
          <div className="lg:col-span-8">
            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} perspective={1200} scale={1.01}>
              <div className={`relative rounded-2xl border-2 p-8 overflow-hidden ${isDark
                ? 'border-gold-medium/20 bg-dark-900/70'
                : 'border-[#c4a86a]/55 bg-white shadow-xl shadow-gold-dark/12'
                }`}>

                {/* Background glow */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold-medium/5 blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-[40px] pointer-events-none" />

                {/* Success message */}
                {sent && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 animate-bounce">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-display">Message Sent!</h3>
                    <p className="text-sm text-gray-400 mt-1">Our team will respond within 24 hours.</p>
                  </div>
                )}

                <h3 className={`text-lg font-bold font-display mb-6 ${isDark ? 'text-white' : 'text-[#1a1200]'}`}>
                  Send a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase tracking-widest font-bold block ${isDark ? 'text-gray-500' : 'text-[#9a8060]'}`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-medium/60" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Alexander Mercer"
                          className={`${inputCls} pl-10`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase tracking-widest font-bold block ${isDark ? 'text-gray-500' : 'text-[#9a8060]'}`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-medium/60" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="alex@example.com"
                          className={`${inputCls} pl-10`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] uppercase tracking-widest font-bold block ${isDark ? 'text-gray-500' : 'text-[#9a8060]'}`}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="">Select a topic...</option>
                      <option value="academy">Academy &amp; Courses</option>
                      <option value="referral">Referral / Partner Program</option>
                      <option value="trading">Trading Strategies</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other Enquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] uppercase tracking-widest font-bold block ${isDark ? 'text-gray-500' : 'text-[#9a8060]'}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your enquiry in detail..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${loading
                      ? 'bg-gold-dark/60 cursor-wait'
                      : 'bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/20 hover:-translate-y-0.5'
                      }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </Tilt>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
