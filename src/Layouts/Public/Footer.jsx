import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Mail } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const handleNavClick = (path) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for subscribing to our newsletter!')
  }

  const socialLinks = [
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.9.1-1.2 1-1.2h2.5V1.5H13c-3 0-4 1.5-4 3.5V8z" />
        </svg>
      ),
      url: '#'
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      url: '#'
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      url: '#'
    },
    {
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.059 1.28-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
      url: '#'
    }
  ]

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Ecosystem', path: '/ecosystem' },
    { label: 'Advantages', path: '/advantages' },
    { label: 'Markets', path: '/markets' },
    { label: 'Academy', path: '/academy' },
    { label: 'Market News', path: '/news' },
    { label: 'Contact', path: '/contact' }
  ]

  return (
    <footer className={`relative z-10 border-t font-sans py-16 ${isDark
      ? 'bg-dark-950 border-gold-dark/20 text-gray-400'
      : 'bg-[#f5f0e8] border-gold-dark/20 text-[#8a7050]'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-medium/30 bg-black flex items-center justify-center p-0.5 glow-gold">
                <img
                  src="/logo.jpeg"
                  alt="Dark Horse Finance Academy Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="text-lg font-bold font-display uppercase tracking-widest bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">
                  Dark Horse
                </span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-gray-400 font-medium">
                  Finance
                </span>
              </div>
            </div>

            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
              Financial education in Real Estate, Forex, Equities, and
              Cryptocurrencies. Empowering learners with analytical tools and
              collaborative market insights.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 ${isDark
                    ? 'border-gold-dark/20 bg-dark-900 text-gold-medium hover:text-gold-light hover:border-gold-medium hover:bg-dark-800'
                    : 'border-gold-dark/20 bg-[#f0e8d0] text-gold-dark hover:text-gold-medium hover:border-gold-medium hover:bg-[#ede4cb]'
                    }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="space-y-5">
            <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isDark ? 'text-gold-light' : 'text-[#1a1200]'}`}>
              Useful Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.path)}
                    className={`hover:text-gold-light hover:underline transition-all text-left flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#6a5030]'
                      }`}
                  >
                    <span className="text-[10px] text-gold-medium">➔</span> {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-5">
            <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isDark ? 'text-gold-light' : 'text-[#1a1200]'}`}>
              Contact Info
            </h3>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isDark ? 'bg-dark-900 border border-gold-dark/20 text-gold-medium' : 'bg-[#f0e8d0] text-gold-dark'
                }`}>
                <Mail className="w-4 h-4" />
              </div>
              <a
                href="mailto:info@Mock.ceo"
                className={`text-sm font-semibold transition-colors duration-250 ${isDark ? 'text-gray-300 hover:text-gold-light' : 'text-[#5a4225] hover:text-gold-medium'
                  }`}
              >
                info@Mock.ceo
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-5">
            <h3 className={`text-sm font-bold font-display uppercase tracking-wider ${isDark ? 'text-gold-light' : 'text-[#1a1200]'}`}>
              Newsletter
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-[#8a7050]'}`}>
              Stay updated with the latest news and offers. Subscribe to our newsletter.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter Your E-mail"
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold-medium/60 ${isDark
                  ? 'bg-dark-900 border-gold-dark/20 text-gray-200 placeholder-gray-600'
                  : 'bg-white border-gold-dark/25 text-[#3a2e10] placeholder-[#a6927a]'
                  }`}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-gold-dark to-gold-medium text-black px-4 py-2.5 rounded-lg hover:brightness-110 shadow-md shadow-gold-medium/5 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[11px] text-gray-600 italic">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>

        </div>

        {/* Bottom copyright area */}




        <div className={`mt-16 pt-8 border-t text-center space-y-6 text-xs ${isDark ? 'border-gold-dark/10 text-gray-600' : 'border-gold-dark/15 text-[#9a8060]'
          }`}>

          <p>Risk Warning: Trading Real Estate assets, Forex, Stock Markets, CFDs, and
            digital assets carries high levels of risk and speculation. All content,
            charts, and market data on this platform are provided strictly for
            educational purposes and do not constitute financial, investment, or
            trading advice. Dark Horse Finance does not guarantee outcomes based on
            simulated or historical data.</p>
          <p>&copy; {currentYear} Dark Horse Finance. Strategy. Growth. Wealth. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer