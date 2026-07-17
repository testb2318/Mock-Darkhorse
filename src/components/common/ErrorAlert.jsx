// import { useState } from 'react'
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
// import { CircleAlert, X } from 'lucide-react'


// export default function ErrorAlert({error}) {
//   const [open, setOpen] = useState(true)

//   return (
//     <Dialog open={open} onClose={setOpen} className="relative z-10">
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
//                 <CircleAlert className="w-6 h-6 text-yellow-500" />
//                 <DialogTitle as="h3" className="text-lg font-semibold text-white">
//                   Error
//                 </DialogTitle>
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6">
//               <h4 className="text-lg font-medium text-white mb-2">
//                 Something went Wrong!
//               </h4>
//               <p className="text-lg text-gray-300">
//                 {error}
//               </p>
//             </div>
//             <div className="flex justify-end p-4 border-t border-gray-700 bg-gray-800">
//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   )
// }

import { useState, useEffect } from 'react'
import { AlertTriangle, X, RefreshCw, Zap } from 'lucide-react'

export default function ErrorAlert({error}) {
  const [open, setOpen] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)

  const handleRetry = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      setOpen(false)
    }, 1500)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(prev => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-lg transform transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl border border-red-500/20">
          
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-orange-600/10"></div>
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Floating particles */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-red-400/30 rounded-full animate-ping delay-500"></div>
            <div className="absolute top-20 right-16 w-1 h-1 bg-orange-400/40 rounded-full animate-ping delay-1000"></div>
            <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-yellow-400/20 rounded-full animate-ping delay-700"></div>
          </div>

          {/* Header */}
          <div className="relative px-8 pt-8 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  {/* Pulsing ring */}
                  <div 
                    key={pulseKey}
                    className="absolute inset-0 rounded-full border-2 border-red-400/60 animate-ping"
                  ></div>
                  <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-orange-500 p-4 rounded-full shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                    System Alert
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-red-400 font-semibold tracking-wide">Critical Error Detected</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="group relative p-3 text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5 transform group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative px-8 pb-6">
            <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <h4 className="text-xl font-bold text-white">
                    Oops! Something went wrong
                  </h4>
                </div>
                
                <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-orange-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 rounded-full mt-1"></div>
                    <p className="text-gray-200 text-base font-mono leading-relaxed">
                      {error || "An unexpected error occurred. Our systems are working to resolve this issue. Please try again in a few moments or contact support if the problem persists."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative px-8 pb-8">
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={handleRetry}
                disabled={isAnimating}
                className="group relative flex items-center gap-3 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-xl hover:from-red-500 hover:via-red-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25 disabled:transform-none"
              >
                <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>{isAnimating ? 'Retrying...' : 'Try Again'}</span>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative px-6 py-3 text-sm font-semibold text-gray-300 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:text-white hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-white/10 hover:scale-105 hover:-translate-y-0.5"
              >
                Dismiss
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        </div>
      </div>
    </div>
  )
}  