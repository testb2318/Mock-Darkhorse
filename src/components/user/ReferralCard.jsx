import { useState } from "react";
import { Check, Copy, User } from "lucide-react";
import Tilt from "react-parallax-tilt";

const ReferralCard = ({ user }) => {
  const [isCopied, setIsCopied] = useState(false);

  const registerUrl = `https://Mock.ceo/registration?refferral=${user?.refferal_code}`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(registerUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy referral link: ", err);
      });
  };

  return (
    <Tilt
      className="tilt-card-wrapper h-full"
      perspective={1000}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glareColor="#e6c57f"
      scale={1.02}
    >
      <div className="relative w-full overflow-hidden rounded-2xl glass-card glass-card-hover animated-border-gold tilt-card-inner p-4 shadow-[0_10px_30px_rgba(212,175,55,0.08)] h-full flex flex-col justify-center">
        
        {/* Glow */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gold-medium/10 blur-3xl z-0" />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative z-10 flex flex-col gap-3">
          
          {/* Header */}
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-gold-medium shadow-[0_0_10px_rgba(212,175,55,0.7)]" />

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-gold-light/60 font-sans">
                Referral
              </p>

              <h2 className="mt-0.5 text-sm font-bold text-white font-display">
                Invite & Earn
              </h2>
            </div>
          </div>

          {/* Referred By */}
          <div className="flex items-center justify-between rounded-xl border border-gold-medium/20 bg-dark-900/50 px-3 py-2 backdrop-blur-sm">
            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-gold-light/50 font-sans">
                Referred By
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-white">
                {user?.reffer_by || "N/A"}
              </p>
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              <User size={12} className="text-white" />
            </div>
          </div>

          {/* Referral Code */}
          <div className="rounded-xl border border-gold-medium/20 bg-dark-900/60 px-3 py-3 text-center backdrop-blur-sm">
            <p className="text-[8px] uppercase tracking-[0.22em] text-gold-light/55 font-sans">
              Your Code
            </p>

            <div className="mt-1 break-all text-sm font-bold tracking-[0.15em] text-gold-light font-mono">
              {user?.refferal_code || "N/A"}
            </div>
          </div>

          {/* Link */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[8px] uppercase tracking-[0.22em] text-gold-light/55 font-sans">
                Referral Link
              </p>

              {isCopied && (
                <span className="text-[10px] text-emerald-400 font-sans font-semibold">
                  Copied
                </span>
              )}
            </div>

            <div className="rounded-xl border border-gold-medium/20 bg-dark-950/70 p-2 backdrop-blur-sm">
              <p className="truncate text-[10px] text-gray-300">
                {registerUrl}
              </p>

              <button
                onClick={handleCopy}
                className={`mt-2 flex h-8 w-full items-center justify-center gap-1 rounded-lg text-[11px] font-semibold text-white transition-all duration-300
                  ${
                    isCopied
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:opacity-90 hover:scale-[1.02]"
                  }`}
              >
                {isCopied ? <Check size={13} /> : <Copy size={13} />}
                {isCopied ? "Copied" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default ReferralCard;


// import { useState } from "react";
// import { Check, Copy, User } from "lucide-react";

// const ReferralCard = ({ user }) => {
//   const [isCopied, setIsCopied] = useState(false);

//   const registerUrl = `https://zynetwork.world/registration?refferral=${user?.refferal_code}`;

//   const handleCopy = () => {
//     navigator.clipboard
//       .writeText(registerUrl)
//       .then(() => {
//         setIsCopied(true);
//         setTimeout(() => setIsCopied(false), 2000);
//       })
//       .catch((err) => {
//         console.error("Failed to copy referral link: ", err);
//       });
//   };

//   return (
//     <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-slate-950 via-[#07162d] to-[#020817] p-5 shadow-[0_12px_40px_rgba(0,120,255,0.08)]">
      
//       {/* Background Glow */}
//       <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-500/8 blur-3xl" />
//       <div className="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-blue-600/8 blur-3xl" />

//       {/* Grid Overlay */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-10"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
//           `,
//           backgroundSize: "28px 28px",
//         }}
//       />

//       <div className="relative z-10 flex flex-col gap-5">
//         {/* Header Section */}
//         <div className="flex items-start gap-3">
//           <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
//           <div>
//             <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300/65">
//               Referral Network
//             </p>
//             <h2 className="mt-0.5 text-lg font-bold text-white">
//               Invite & Earn Rewards
//             </h2>
//             <p className="mt-1 text-xs text-slate-300">
//               Share your referral link and grow your network.
//             </p>
//           </div>
//         </div>

//         {/* Referred By Block */}
//         <div className="flex items-center justify-between rounded-xl border border-cyan-400/10 bg-cyan-950/15 px-4 py-2.5 backdrop-blur-md">
//           <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/55">
//             Referred By
//           </p>
//           <div className="flex items-center gap-2">
//             <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(0,180,255,0.25)]">
//               <User size={12} className="text-white" />
//             </div>
//             <span className="text-xs font-semibold text-white">
//               {user?.reffer_by || "N/A"}
//             </span>
//           </div>
//         </div>

//         {/* Referral Code Box */}
//         <div className="rounded-xl border border-cyan-400/10 bg-gradient-to-br from-cyan-950/20 to-slate-950 p-3.5 text-center">
//           <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-300/65">
//             Your Code
//           </p>
//           <div className="mt-1.5 break-all text-xl font-extrabold tracking-[0.15em] text-cyan-300">
//             {user?.refferal_code || "N/A"}
//           </div>
//         </div>

//         {/* Action Link & Copy Input Section */}
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center justify-between px-1">
//             <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300/65">
//               Referral Link
//             </p>
//             {isCopied && (
//               <span className="text-[11px] font-medium text-emerald-400 animate-fade-in">
//                 Copied!
//               </span>
//             )}
//           </div>

//           <div className="relative flex items-center rounded-xl border border-cyan-400/10 bg-slate-950/70 p-1">
//             <input
//               type="text"
//               value={registerUrl}
//               readOnly
//               className="h-9 flex-1 bg-transparent px-3 text-xs text-cyan-100 outline-none truncate pr-2"
//             />
//             <button
//               onClick={handleCopy}
//               className={`flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-white transition-all duration-300 shrink-0
//                 ${
//                   isCopied
//                     ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_12px_rgba(34,197,94,0.2)]"
//                     : "bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_4px_12px_rgba(0,130,255,0.15)] hover:opacity-90"
//                 }`}
//             >
//               {isCopied ? <Check size={14} /> : <Copy size={14} />}
//               <span>{isCopied ? "Copied" : "Copy Link"}</span>
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ReferralCard;

// // import { useState } from "react";
// // import { Check, Copy, User } from "lucide-react";

// // const ReferralCard = ({ user }) => {
// //   const [isCopied, setIsCopied] = useState(false);

// //   const registerUrl = `https://zynetwork.world/registration?refferral=${user?.refferal_code}`;

// //   const handleCopy = () => {
// //     navigator.clipboard
// //       .writeText(registerUrl)
// //       .then(() => {
// //         setIsCopied(true);
// //         setTimeout(() => setIsCopied(false), 2000);
// //       })
// //       .catch((err) => {
// //         console.error("Failed to copy referral link: ", err);
// //       });
// //   };

// //   return (
// //     <div className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-slate-950 via-[#07162d] to-[#020817] p-4 md:p-5 shadow-[0_12px_40px_rgba(0,120,255,0.08)]">
      
// //       {/* Background Glow */}
// //       <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-500/8 blur-3xl" />
// //       <div className="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-blue-600/8 blur-3xl" />

// //       {/* Grid */}
// //       <div
// //         className="pointer-events-none absolute inset-0 opacity-10"
// //         style={{
// //           backgroundImage: `
// //             linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
// //             linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
// //           `,
// //           backgroundSize: "28px 28px",
// //         }}
// //       />

// //       <div className="relative z-10">
// //         {/* Header */}
// //         <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
// //           <div className="flex items-start gap-3">
// //             <div className="mt-1 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />

// //             <div>
// //               <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300/65">
// //                 Referral Network
// //               </p>

// //               <h2 className="mt-1 text-lg font-bold text-white md:text-xl">
// //                 Invite & Earn Rewards
// //               </h2>

// //               <p className="mt-2 max-w-lg text-xs leading-5 text-slate-300">
// //                 Share your referral link and grow your network.
// //               </p>
// //             </div>
// //           </div>

// //           {/* Referred By */}
// //           <div className="rounded-xl border border-cyan-400/10 bg-cyan-950/15 px-3 py-3 backdrop-blur-md">
// //             <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-cyan-300/55">
// //               Referred By
// //             </p>

// //             <div className="flex items-center gap-2.5">
// //               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_14px_rgba(0,180,255,0.25)]">
// //                 <User size={15} className="text-white" />
// //               </div>

// //               <span className="text-sm font-semibold text-white">
// //                 {user?.reffer_by || "N/A"}
// //               </span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Main */}
// //         <div className="grid gap-4 xl:grid-cols-[250px_1fr]">
          
// //           {/* Code */}
// //           <div className="rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-950/20 to-slate-950 p-4">
// //             <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-300/65">
// //               Your Code
// //             </p>

// //             <div className="mt-3 break-all text-lg font-extrabold tracking-[0.14em] text-cyan-300 md:text-2xl">
// //               {user?.refferal_code || "N/A"}
// //             </div>
// //           </div>

// //           {/* Link */}
// //           <div>
// //             <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300/65">
// //               Referral Link
// //             </p>

// //             <div className="rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-slate-900 via-[#071428] to-slate-950 p-3">
// //               <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
// //                 <input
// //                   type="text"
// //                   value={registerUrl}
// //                   readOnly
// //                   className="h-11 flex-1 rounded-xl border border-cyan-400/10 bg-slate-950/70 px-4 text-xs text-cyan-100 outline-none"
// //                 />

// //                 <button
// //                   onClick={handleCopy}
// //                   className={`flex h-11 min-w-[130px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all duration-300
// //                     ${
// //                       isCopied
// //                         ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_18px_rgba(34,197,94,0.28)]"
// //                         : "bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_8px_20px_rgba(0,130,255,0.2)] hover:-translate-y-0.5"
// //                     }`}
// //                 >
// //                   {isCopied ? (
// //                     <>
// //                       <Check size={16} />
// //                       Copied
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Copy size={16} />
// //                       Copy Link
// //                     </>
// //                   )}
// //                 </button>
// //               </div>

// //               {isCopied && (
// //                 <p className="mt-3 text-xs font-medium text-emerald-400">
// //                   Referral link copied
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ReferralCard;
