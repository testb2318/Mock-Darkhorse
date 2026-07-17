
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearErrors, clearMessage } from '../../redux/forgotSlice';
import { useParams , Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, Shield, Zap } from 'lucide-react';

export default function ForgotPassword() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { message, error, loading } = useSelector((state) => state.forgot);

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    dispatch(resetPassword({ newPassword, token }));
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearErrors()), 4000);
      return () => clearTimeout(timer);
    }
    if (message) {
      const timer = setTimeout(() => dispatch(clearMessage()), 4000);
      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  return (
    <div className="min-h-screen bg-theme-base  overflow-hidden relative ">

      <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div>
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none z-0"
                style={{ backgroundImage: `url('/images/img_12.jpg')` }}
            ></div>
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid"></div>
        <div className="absolute inset-0 bg-grid-overlay"></div>
        <div className="absolute inset-0 bg-radial-gradient"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:py-12 inset-0   ">
        <div className="w-full max-w-sm sm:max-w-md ">
          {/* Glass Card */}
          <div className="glass-card rounded-[24px] sm:rounded-[32px] px-6 py-8 sm:px-10 sm:py-12 md:px-12 md:py-14 relative overflow-hidden">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-10 relative">
              {/* <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-gold-medium/25 p-3 sm:p-4 md:p-6 relative group"> */}
                {/* <Shield className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-black drop-shadow-lg" /> */}
                  <Link to="/" className="inline-block relative w-16 h-16 rounded-full overflow-hidden border border-gold-medium/30 bg-black p-0.5 glow-gold mx-auto">
                                 <img
                                   src="/logo.jpeg"
                                   alt="Dark Horse Finance Logo"
                                   className="w-full h-full object-cover rounded-full"
                                 />
                               </Link>
                {/* <div className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light rounded-2xl sm:rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> */}
                {/* <Zap className="absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 animate-ping-slow -top-1 -right-1" /> */}
              {/* </div> */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light bg-clip-text text-transparent mb-2 sm:mb-3 tracking-tight">
                Password Reset
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg backdrop-blur-sm px-2">
                Secure your account with a new password
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl sm:rounded-2xl backdrop-blur-sm animate-pulse">
                <div className="flex items-center gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 font-semibold text-xs sm:text-sm">{error}</span>
                </div>
              </div>
            )}
            
            {message && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-xl sm:rounded-2xl backdrop-blur-sm animate-bounce">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 font-semibold text-xs sm:text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handlePasswordReset} className="space-y-4 sm:space-y-6">
              {/* Password Input */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-gray-300 tracking-wide">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create strong password"
                    className="w-full h-12 sm:h-14 px-4 sm:px-5 pr-12 sm:pr-14 bg-dark-900 border-2 border-gold-dark/20 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg text-white placeholder-gray-600 backdrop-blur-sm focus:border-gold-medium focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-gold-medium/30 transition-all duration-300 group-hover:border-gold-medium/40"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-medium transition-colors p-1"
                  >
                    {showNewPassword ? 
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : 
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    }
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-medium/0 via-gold-medium/20 to-gold-medium/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-gray-300 tracking-wide">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full h-12 sm:h-14 px-4 sm:px-5 pr-12 sm:pr-14 bg-dark-900 border-2 border-gold-dark/20 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg text-white placeholder-gray-600 backdrop-blur-sm focus:border-gold-medium focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-gold-medium/30 transition-all duration-300 group-hover:border-gold-medium/40"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-medium transition-colors p-1"
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : 
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    }
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-medium/0 via-gold-medium/20 to-gold-medium/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light text-black rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg md:text-xl shadow-xl sm:shadow-2xl shadow-gold-medium/30 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-gold-medium/50 active:scale-95 disabled:opacity-50 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 border-3 sm:border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base md:text-lg">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm sm:text-base md:text-lg">Reset Password</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 md:pt-8 border-t border-white/10 text-center">
              <p className="text-xs sm:text-sm text-gray-400">
                Remember your password?{' '}
                <a href="/login" className="text-gold-medium font-bold hover:text-gold-light transition-colors inline-flex items-center gap-1 group">
                  Sign In
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <style>{`
        .bg-grid {
          background-image: 
            linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }
        
        .bg-grid-overlay {
          background-image: 
            linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px);
          background-size: 100px 100px;
          animation: gridMoveReverse 30s linear infinite;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.2) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(243, 229, 171, 0.2) 0%, transparent 50%);
          animation: radialRotate 15s ease-in-out infinite;
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes gridMoveReverse {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100px, -100px); }
        }
        
        @keyframes radialRotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
        }
        


        
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .particle {
          position: absolute;
          background: linear-gradient(45deg, #d4af37, #8e6f3e);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .particle-1 { width: 3px; height: 3px; top: 20%; left: 10%; animation-delay: 0s; }
        .particle-2 { width: 4px; height: 4px; top: 60%; right: 15%; animation-delay: 1.5s; }
        .particle-3 { width: 2px; height: 2px; bottom: 30%; left: 20%; animation-delay: 3s; }
        .particle-4 { width: 3px; height: 3px; top: 40%; right: 30%; animation-delay: 4.5s; }
        
        @media (min-width: 640px) {
          .particle-1 { width: 4px; height: 4px; }
          .particle-2 { width: 6px; height: 6px; }
          .particle-3 { width: 3px; height: 3px; }
          .particle-4 { width: 5px; height: 5px; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @media (max-width: 480px) {
          .glass-card {
            padding: 1.5rem 1rem !important;
            margin: 0.5rem;
          }
          
          h1 {
            font-size: 1.75rem !important;
          }
        }
      `}</style> */}
    </div>
  );
}