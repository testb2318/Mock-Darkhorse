import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { ArrowUp } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const PublicLayout = ({ children }) => {
    const [showScrollTop, setShowScrollTop] = useState(false)
    const { isDark } = useTheme()

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div
            data-theme={isDark ? 'dark' : 'light'}
            className={`relative min-h-screen flex flex-col overflow-x-hidden selection:bg-gold-medium/20 selection:text-gold-light ${isDark
                    ? 'bg-dark-950 text-gray-100'
                    : 'bg-[#f5f0e8] text-[#1a1200]'
                }`}
        >
            {/* Global Background Grid Overlay */}
            <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-60"></div>

            {/* Background Decorative Gold Blurs */}
            <div
                className={`fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow ${isDark ? 'bg-gold-dark/10' : 'bg-gold-dark/6'
                    }`}
            ></div>
            <div
                className={`fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-0 animate-pulse-slow ${isDark ? 'bg-gold-medium/5' : 'bg-gold-medium/3'
                    }`}
                style={{ animationDelay: '3s' }}
            ></div>

            <Navbar />

            <main className="relative z-10 flex-grow">
                {children}
            </main>

            <Footer />

            {/* Floating Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 p-3 rounded-full border text-gold-medium hover:text-gold-light shadow-2xl transition-all duration-300 transform ${showScrollTop
                        ? 'translate-y-0 opacity-100 pointer-events-auto'
                        : 'translate-y-4 opacity-0 pointer-events-none'
                    } hover:-translate-y-1 ${isDark
                        ? 'bg-dark-900 border-gold-dark/40 hover:border-gold-medium'
                        : 'bg-[#fdf8ef] border-gold-dark/40 hover:border-gold-medium'
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </div>
    )
}

export default PublicLayout