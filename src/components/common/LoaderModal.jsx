// import React from "react";

// export default function Loader({ isLoading }) {
//   if (!isLoading) return null;
  
//   return (
//     <>
//       <style>
//         {`
//           /* Unique Blue Wave Loader */
//           .blue-wave-loader {
//             position: relative;
//             width: 120px;
//             height: 120px;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }
          
//           .wave-ring {
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             border-radius: 50%;
//             border: 3px solid transparent;
//             border-top-color: #c68113;
//             animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
//           }
          
//           .wave-ring:nth-child(1) {
//             animation-delay: 0s;
//             border-top-color: #c28e0b;
//           }
          
//           .wave-ring:nth-child(2) {
//             width: 85%;
//             height: 85%;
//             animation-delay: 0.3s;
//             border-top-color: #d29a16;
//             border-right-color: #dca122;
//           }
          
//           .wave-ring:nth-child(3) {
//             width: 60%;
//             height: 60%;
//             animation-delay: 0.6s;
//             border-top-color: #c99b13;
//             border-left-color: #c2880c;
//             border-bottom-color: #da9b1d;
//           }
          
//           .wave-ring:nth-child(4) {
//             width: 35%;
//             height: 35%;
//             animation-delay: 0.9s;
//             border-top-color: #c4a423;
//             border-right-color: #c28e0b;
//             border-bottom-color: #d4960f;
//           }
          
//           .loader-center {
//             position: absolute;
//             width: 15%;
//             height: 15%;
//             background: linear-gradient(135deg, #daa70d, #d4a71e);
//             border-radius: 50%;
//             animation: pulse 1s ease-in-out infinite;
//             box-shadow: 0 0 20px rgba(202, 164, 25, 0.5);
//           }
          
//           @keyframes spin {
//             0% {
//               transform: rotate(0deg);
//             }
//             100% {
//               transform: rotate(360deg);
//             }
//           }
          
//           @keyframes pulse {
//             0%, 100% {
//               transform: scale(0.8);
//               opacity: 0.6;
//             }
//             50% {
//               transform: scale(1.2);
//               opacity: 1;
//             }
//           }
          
//           /* Glowing dots effect */
//           .loader-dots {
//             display: flex;
//             gap: 12px;
//             margin-top: 30px;
//           }
          
//           .loader-dot {
//             width: 10px;
//             height: 10px;
//             border-radius: 50%;
//             background: linear-gradient(135deg, #d7ad16, #d4b116);
//             animation: bounce 0.8s ease-in-out infinite;
//           }
          
//           .loader-dot:nth-child(1) {
//             animation-delay: 0s;
//           }
          
//           .loader-dot:nth-child(2) {
//             animation-delay: 0.2s;
//           }
          
//           .loader-dot:nth-child(3) {
//             animation-delay: 0.4s;
//           }
          
//           .loader-dot:nth-child(4) {
//             animation-delay: 0.6s;
//           }
          
//           .loader-dot:nth-child(5) {
//             animation-delay: 0.8s;
//           }
          
//           @keyframes bounce {
//             0%, 60%, 100% {
//               transform: translateY(0);
//             }
//             30% {
//               transform: translateY(-15px);
//             }
//           }
          
//           /* Loading text animation */
//           .loader-text {
//             margin-top: 25px;
//             font-size: 14px;
//             font-weight: 500;
//             background: linear-gradient(135deg, #d4ae16, #e0b218);
//             -webkit-background-clip: text;
//             background-clip: text;
//             color: transparent;
//             letter-spacing: 2px;
//             animation: shimmer 1.5s ease-in-out infinite;
//           }
          
//           @keyframes shimmer {
//             0%, 100% {
//               opacity: 0.5;
//             }
//             50% {
//               opacity: 1;
//             }
//           }
          
//           /* Container animation */
//           .loader-container {
//             animation: fadeIn 0.3s ease-in-out;
//           }
          
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//             }
//             to {
//               opacity: 1;
//             }
//           }
//         `}
//       </style>

//       <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black via-blue-950/40 to-[#0a0a0a] backdrop-blur-sm z-50 loader-container">
//         {/* Animated Background Orbs */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         </div>
        
//         {/* Main Loader */}
//         <div className="relative flex flex-col items-center">
//           <div className="blue-wave-loader">
//             <div className="wave-ring"></div>
//             <div className="wave-ring"></div>
//             <div className="wave-ring"></div>
//             <div className="wave-ring"></div>
//             <div className="loader-center"></div>
//           </div>
          
//           {/* Bouncing Dots */}
//           <div className="loader-dots">
//             <div className="loader-dot"></div>
//             <div className="loader-dot"></div>
//             <div className="loader-dot"></div>
//             <div className="loader-dot"></div>
//             <div className="loader-dot"></div>
//           </div>
          
//           {/* Loading Text */}
//           <div className="loader-text">
//             LOADING
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }













import React from "react";

export default function Loader({ isLoading }) {
  if (!isLoading) return null;
  
  return (
    <>
      <style>
        {`
          /* Geometric Gold Shard Loader */
          .gold-shard-loader {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            height: 80px;
            position: relative;
          }
          
          .shard {
            width: 24px;
            height: 48px;
            /* Creates a clean diamond/rhombus shape instead of a circle */
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fcf6ba);
            background-size: 300% 300%;
            animation: 
              shardMorph 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite,
              gradientShift 4s ease infinite;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          }
          
          /* Staggering the animations to create a fluid geometric wave */
          .shard:nth-child(1) {
            animation-delay: 0s, 0s;
          }
          .shard:nth-child(2) {
            animation-delay: 0.2s, 0.5s;
            height: 64px; /* Dynamic height variations like a bar chart */
          }
          .shard:nth-child(3) {
            animation-delay: 0.4s, 1s;
            height: 80px;
          }
          .shard:nth-child(4) {
            animation-delay: 0.6s, 1.5s;
            height: 64px;
          }
          .shard:nth-child(5) {
            animation-delay: 0.8s, 2s;
          }
          
          /* Geometric scaling and opacity wave */
          @keyframes shardMorph {
            0%, 100% {
              transform: scaleY(0.6) scaleX(0.8);
              opacity: 0.4;
              filter: brightness(0.8) drop-shadow(0 0 0px rgba(212,175,55,0));
            }
            50% {
              transform: scaleY(1.1) scaleX(1.1);
              opacity: 1;
              filter: brightness(1.2) drop-shadow(0 0 15px rgba(212,175,55,0.6));
            }
          }
          
          /* Simulates light reflecting off moving metallic gold surfaces */
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* Metallic gold text sweep animation */
          .loader-text {
            margin-top: 35px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            background: linear-gradient(to right, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fcf6ba 75%, #bf953f 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: 5px;
            animation: textShine 3s linear infinite;
          }
          
          @keyframes textShine {
            to {
              background-position: 200% center;
            }
          }
          
          .loader-container {
            animation: fadeIn 0.4s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      {/* Premium Dark Glass Dashboard Backdrop */}
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-stone-900 to-zinc-950 backdrop-blur-md z-50 loader-container">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[150px]"></div>
        </div>
        
        {/* Floating Glass UI Card */}
        <div className="flex flex-col items-center p-12 px-16 rounded-2xl bg-black/40 border border-neutral-800/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
          
          {/* Diamond Shard Loader */}
          <div className="gold-shard-loader">
            <div className="shard"></div>
            <div className="shard"></div>
            <div className="shard"></div>
            <div className="shard"></div>
            <div className="shard"></div>
          </div>
          
          {/* Luxury Text Tracking */}
          <div className="loader-text">
            Securing Connection
          </div>
        </div>
      </div>
    </>
  );
}