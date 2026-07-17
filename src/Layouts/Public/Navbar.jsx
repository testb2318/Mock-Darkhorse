import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight, LogIn, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { isDark, toggleTheme } = useTheme()

    // Track scroll for background change
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 25)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (path) => {
        setIsOpen(false)
        navigate(path)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleLoginClick = () => {
        setIsOpen(false)
        navigate('/login')
    }

    const handleRegisterClick = () => {
        setIsOpen(false)
        // Dispatches global event to open registration modal on Home page
        if (location.pathname !== '/registration') {
            navigate('/registration')
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('open-register-modal'))
            }, 300)
        } else {
            window.dispatchEvent(new CustomEvent('open-register-modal'))
        }
    }

    const navLinks = [
        { id: 'hero', label: 'Home', path: '/' },
        { id: 'about', label: 'About', path: '/about' },
        { id: 'ecosystem', label: 'Ecosystem', path: '/ecosystem' },
        { id: 'advantages', label: 'Advantages', path: '/advantages' },
        { id: 'markets', label: 'Markets', path: '/markets' },
        // { id: 'academy', label: 'Academy', path: '/academy' },
        // { id: 'news', label: 'Market News', path: '/news' },
        { id: 'contact', label: 'Contact', path: '/contact' }
    ]

    const navBg = scrolled
        ? isDark
            ? 'bg-dark-950/85 border-b border-gold-dark/20 py-3 backdrop-blur-md shadow-lg shadow-black/40'
            : 'bg-[#fdf8ef]/80 border-b border-gold-dark/20 py-3 backdrop-blur-md shadow-lg shadow-gold-dark/10'
        : 'bg-transparent py-5'

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${navBg}`}>
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-6">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div
                            className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
                            onClick={() => handleNavClick('/')}
                        >
                            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-medium/30 bg-black flex items-center justify-center p-0.5 glow-gold">
                                <img
                                    src="/logo.jpeg"
                                    alt="Dark Horse Finance Logo"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold font-display uppercase tracking-widest bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark bg-clip-text text-transparent">
                                    Dark Horse
                                </span>
                                <span className={`block text-[9px] uppercase tracking-[0.25em] font-medium ${isDark ? 'text-gray-400' : 'text-[#8a7050]'}`}>
                                    
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden xl:flex items-center space-x-7">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path
                                return (
                                    <button
                                        key={link.id}
                                        onClick={() => handleNavClick(link.path)}
                                        className={`relative py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-300 ${isActive
                                            ? 'text-gold-dark text-glow font-bold'
                                            : isDark
                                                ? 'text-gray-400 hover:text-gold-light'
                                                : 'text-[#6a5a38] hover:text-gold-dark'
                                            }`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <span className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark rounded-full shadow-md shadow-gold-medium/50"></span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Actions */}
                        <div className="hidden xl:flex items-center gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer ${isDark
                                    ? 'border-gold-dark/20 bg-dark-900/50 text-gold-medium hover:text-gold-light hover:border-gold-medium/40'
                                    : 'border-gold-dark/25 bg-[#f0e8d0] text-gold-dark hover:text-gold-medium hover:border-gold-medium/50'
                                    }`}
                            >
                                {isDark
                                    ? <Sun className="w-4 h-4" />
                                    : <Moon className="w-4 h-4" />
                                }
                            </button>

                            <button
                                onClick={handleLoginClick}
                                className={`text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer py-2 px-3 rounded-lg border border-transparent ${isDark
                                    ? 'text-gray-300 hover:text-gold-light hover:bg-gold-dark/5 hover:border-gold-dark/10'
                                    : 'text-[#5a4a20] hover:text-gold-dark hover:bg-gold-dark/8 hover:border-gold-dark/15'
                                    }`}
                            >
                                <LogIn className="w-4 h-4 text-gold-medium" /> Login
                            </button>

                            <button
                                onClick={handleRegisterClick}
                                className="relative px-6 py-2.5 rounded-full overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light transition-all duration-500 ease-out group-hover:scale-105"></div>
                                <div className="absolute inset-[1px] bg-dark-950 rounded-full transition-all duration-300 group-hover:opacity-0"></div>
                                <span className="relative text-xs font-bold uppercase tracking-widest text-gold-dark group-hover:text-black transition-colors duration-300 flex items-center gap-1">
                                    Sign-up <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            </button>
                        </div>

                        {/* Mobile: theme toggle + hamburger */}
                        <div className="xl:hidden flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg border transition-all cursor-pointer ${isDark
                                    ? 'border-gold-dark/20 bg-dark-900/50 text-gold-medium'
                                    : 'border-gold-dark/20 bg-[#f0e8d0] text-gold-dark'
                                    }`}
                            >
                                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`focus:outline-none p-1.5 rounded-lg border ${isDark
                                    ? 'text-gray-300 hover:text-gold-medium border-gold-dark/20 bg-dark-900/50'
                                    : 'text-[#5a4a20] hover:text-gold-dark border-gold-dark/20 bg-[#f0e8d0]'
                                    }`}
                                aria-expanded={isOpen}
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu drawer */}
                <div
                    className={`xl:hidden fixed  right-0 z-50 w-full max-w-xs border-l backdrop-blur-xl shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        } ${isDark
                            ? 'bg-dark-950/95 border-gold-dark/20'
                            : 'bg-[#fdf8ef]/97 border-gold-dark/25'
                        }`}
                >
                    <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-gold-dark/10' : 'border-gold-dark/15'}`}>
                        <div className="flex items-center gap-2">
                            <img
                                src="/logo.jpeg"
                                alt="Dark Horse Finance Logo"
                                className="w-8 h-8 object-cover rounded-full border border-gold-medium/30"
                            />
                            <span className="text-md font-bold uppercase tracking-wider bg-gradient-to-r from-gold-light to-gold-dark bg-clip-text text-transparent">
                                Dark Horse
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`focus:outline-none ${isDark ? 'text-gray-400' : 'text-[#8a7050]'} hover:text-gold-medium`}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="px-6 py-8 flex flex-col space-y-5">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path
                            return (
                                <button
                                    key={link.id}
                                    onClick={() => handleNavClick(link.path)}
                                    className={`text-left text-sm font-semibold uppercase tracking-wider transition-colors ${isActive
                                        ? 'text-gold-light text-glow font-bold'
                                        : isDark
                                            ? 'text-gray-400 hover:text-gold-light'
                                            : 'text-[#6a5a38] hover:text-gold-dark'
                                        }`}
                                >
                                    {link.label}
                                </button>
                            )
                        })}

                        <div className={`pt-6 border-t flex flex-col gap-4 ${isDark ? 'border-gold-dark/15' : 'border-gold-dark/20'}`}>
                            <button
                                onClick={handleLoginClick}
                                className={`w-full py-3 rounded-lg text-center text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2 cursor-pointer ${isDark
                                    ? 'text-gray-300 border-gold-dark/20 hover:border-gold-medium/40 bg-dark-900/40'
                                    : 'text-[#5a4a20] border-gold-dark/25 hover:border-gold-medium/50 bg-[#f0e8d0]'
                                    }`}
                            >
                                <LogIn className="w-4 h-4 text-gold-medium" /> Login
                            </button>

                            <button
                                onClick={handleRegisterClick}
                                className="w-full py-3 rounded-full text-center text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                            >
                               sign-up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Backdrop */}
                {isOpen && (
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    ></div>
                )}
            </nav>
        </>
    )
}

export default Navbar