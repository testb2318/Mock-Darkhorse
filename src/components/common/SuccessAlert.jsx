// import { useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// import { Check, X } from "lucide-react";

// export default function SuccessAlert({ message }) {
//   const [open, setOpen] = useState(true);

//   // Close & Reload function
//   const handleCloseAndReload = () => {
//     setOpen(false);
//     setTimeout(() => {
//       window.location.reload();
//     }, 100); 
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={() => {}} 
//       className="relative z-10"
//     >
//       <DialogBackdrop
//         transition
//         className="fixed inset-0 bg-black bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
//       />

//       <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//         <div className="flex lg:min-h-full mt-48 lg:mt-0 items-end justify-center p-4 text-center sm:items-center sm:p-0">
//           <DialogPanel
//             transition
//             className="relative transform overflow-hidden rounded-lg bg-gray-900 text-white shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-700">
//               <div className="flex items-center gap-3">
//                 <Check className="w-6 h-6 text-green-500" />
//                 <DialogTitle
//                   as="h3"
//                   className="text-lg font-semibold text-white"
//                 >
//                   Successful
//                 </DialogTitle>
//               </div>
//               <button
//                 onClick={handleCloseAndReload} // X button se bhi reload
//                 className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6">
//               <p className="text-lg text-gray-300">{message}</p>
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end p-4 border-t border-gray-700 bg-gray-800">
//               <button
//                 type="button"
//                 onClick={handleCloseAndReload}
//                 className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
//               >
//                 Go back
//               </button>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   );
// }


// import { useState, useEffect } from "react";
// import { Check, X, Sparkles } from "lucide-react";

// export default function SuccessAlert({ message }) {
//   const [open, setOpen] = useState(true);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(5);

//   useEffect(() => {
//     setTimeout(() => setIsAnimating(true), 100);
//   }, []);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else {
//       handleCloseAndReload();
//     }
//   }, [timeLeft]);

//   const handleCloseAndReload = () => {
//     setIsAnimating(false);
//     setTimeout(() => {
//       setOpen(false);
//       setTimeout(() => {
//         window.location.reload();
//       }, 500); // 0.5 sec wait after close
//     }, 300); // animation close delay
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className={`absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/40 to-black/60 backdrop-blur-sm transition-all duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'
//           }`}
//         onClick={handleCloseAndReload}
//       />
//       <div
//         className={`relative bg-gradient-to-br from-gray-900 to-black shadow-2xl rounded w-full max-w-sm overflow-hidden transform transition-all duration-500 ease-out border border-gray-700 ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8'
//           }`}
//       >
//         <div className="absolute inset-0 opacity-5">
//           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
//           <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-400 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-1000" />
//         </div>

//         <button
//           onClick={handleCloseAndReload}
//           className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110 z-10"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-500/30">
//           Auto-close in {timeLeft}s
//         </div>

//         <div className="flex flex-col items-center pt-16 pb-6">
//           <div className="relative">
//             <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
//               <div className="absolute inset-2 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-full animate-pulse" />
//               <Check className="w-12 h-12 text-white relative z-10 animate-bounce" />
//             </div>
//             <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
//             <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-emerald-400 animate-pulse delay-500" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mt-6 mb-2 text-center">
//             Success!
//           </h2>
//           <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
//         </div>
//         <div className="px-8 pb-8">
//           <p className="text-gray-300 text-center leading-relaxed text-lg">
//             {message}
//           </p>
//         </div>
//         <div className="px-8 pb-8 relative z-20">
//           <button
//             onClick={handleCloseAndReload}
//             className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-200"
//           >
//             <span className="flex items-center justify-center gap-2">
//               Continue
//             </span>
//           </button>
//         </div>
//         <div className="h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400" />
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Check, X, Zap } from "lucide-react";

const Z = {
  gold:       "#F5C518",
  goldGlow:   "rgba(245,197,24,0.15)",
  goldBorder: "rgba(245,197,24,0.28)",
  navy:       "#1A3A6B",
  teal:       "#4ECDC4",
  tealGlow:   "rgba(78,205,196,0.12)",
  tealBorder: "rgba(78,205,196,0.28)",
  surface:    "#0D1423",
  line:       "rgba(255,255,255,0.07)",
  muted:      "#4B5A72",
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Exo+2:wght@400;500;600&display=swap');
    .zyn-sa * { box-sizing: border-box; font-family: 'Exo 2', sans-serif; }

    .zyn-sa-panel {
      animation: saIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes saIn {
      from { opacity:0; transform: scale(0.88) translateY(16px); }
      to   { opacity:1; transform: scale(1)    translateY(0);    }
    }
    .zyn-sa-out {
      animation: saOut 0.3s ease both;
    }
    @keyframes saOut {
      to { opacity:0; transform: scale(0.92) translateY(10px); }
    }

    /* Ripple */
    .zyn-sa-ripple {
      position: absolute; inset: 0; border-radius: 50%;
      animation: saRipple 2.2s ease-out infinite;
    }
    .zyn-sa-ripple:nth-child(2) { animation-delay: 0.7s; }
    @keyframes saRipple {
      0%   { transform: scale(1);    opacity: 0.4; }
      100% { transform: scale(2.4);  opacity: 0;   }
    }

    /* Check pop */
    .zyn-sa-check {
      animation: checkPop 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.25s both;
    }
    @keyframes checkPop {
      from { transform: scale(0.3) rotate(-20deg); opacity:0; }
      to   { transform: scale(1)   rotate(0deg);   opacity:1; }
    }

    /* Progress bar */
    .zyn-sa-bar {
      animation: barDrain 5s linear both;
    }
    @keyframes barDrain {
      from { width: 100%; }
      to   { width: 0%;   }
    }

    /* Close btn */
    .zyn-sa-close { transition: all 0.2s ease; }
    .zyn-sa-close:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; }

    /* Continue btn */
    .zyn-sa-btn {
      position: relative; overflow: hidden;
      transition: all 0.25s ease;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: 0.06em;
    }
    .zyn-sa-btn::after {
      content:'';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .zyn-sa-btn:hover::after  { transform: translateX(100%); }
    .zyn-sa-btn:hover         { box-shadow: 0 0 28px ${Z.goldGlow}; }
    .zyn-sa-btn:active        { transform: scale(0.97); }

    /* Timer badge pulse */
    .zyn-sa-timer { animation: timerPulse 1s ease-in-out infinite; }
    @keyframes timerPulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.6; }
    }
  `}</style>
);

export default function SuccessAlert({ message }) {
  const [open, setOpen]           = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft]   = useState(5);

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 80);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    } else {
      handleCloseAndReload();
    }
  }, [timeLeft]);

  const handleCloseAndReload = () => {
    setIsClosing(true);
    setIsAnimating(false);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => window.location.reload(), 500);
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="zyn-sa fixed inset-0 z-50 flex items-center justify-center p-4">
      <GlobalStyle />

      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(4,8,16,0.88)",
          backdropFilter: "blur(7px)",
          opacity: isAnimating ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
        onClick={handleCloseAndReload}
      />

      {/* Panel */}
      <div
        className={`zyn-sa-panel relative w-full max-w-sm rounded-3xl overflow-hidden ${isClosing ? "zyn-sa-out" : ""}`}
        style={{
          background: Z.surface,
          border: `1px solid ${Z.line}`,
          boxShadow: `0 0 70px ${Z.tealGlow}, 0 0 30px ${Z.goldGlow}, 0 30px 60px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Top gradient bar */}
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${Z.teal}, ${Z.gold})` }} />

        {/* Timer badge */}
        <div className="absolute top-4 left-4 z-10">
          <div
            className="zyn-sa-timer flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{ background: Z.tealGlow, border: `1px solid ${Z.tealBorder}`, color: Z.teal }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: Z.teal }} />
            Auto-close {timeLeft}s
          </div>
        </div>

        {/* Close btn */}
        <button
          onClick={handleCloseAndReload}
          className="zyn-sa-close absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)", color: Z.muted }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center pt-16 pb-6 px-6">

          {/* Check icon with ripples */}
          <div className="relative flex items-center justify-center mb-6" style={{ width: 88, height: 88 }}>
            <div className="zyn-sa-ripple" style={{ border: `1.5px solid ${Z.teal}` }} />
            <div className="zyn-sa-ripple" style={{ border: `1.5px solid ${Z.teal}` }} />
            <div
              className="relative z-10 w-[88px] h-[88px] rounded-full flex items-center justify-center"
              style={{ background: Z.tealGlow, border: `2px solid ${Z.tealBorder}` }}
            >
              <Check className="zyn-sa-check w-10 h-10" style={{ color: Z.teal }} strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-3xl font-black mb-2 text-center"
            style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", letterSpacing: "0.02em" }}
          >
            Operation <span style={{ color: Z.gold }}>Successful!</span>
          </h2>

          {/* Divider */}
          <div className="w-14 h-[2px] rounded-full mb-4"
            style={{ background: `linear-gradient(90deg, ${Z.teal}, ${Z.gold})` }} />

          {/* Message */}
          <p className="text-sm text-center leading-relaxed mb-8" style={{ color: Z.muted }}>
            {message}
          </p>

          {/* Continue button */}
          <button
            onClick={handleCloseAndReload}
            className="zyn-sa-btn w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            style={{ background: Z.gold, color: Z.navy, fontSize: "15px" }}
          >
            <Zap className="w-4 h-4" />
            Continue
          </button>
        </div>

        {/* Progress bar (drains over 5s) */}
        <div style={{ background: "rgba(255,255,255,0.05)", height: "3px" }}>
          <div
            className="zyn-sa-bar h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${Z.teal}, ${Z.gold})` }}
          />
        </div>
      </div>
    </div>
  );
}