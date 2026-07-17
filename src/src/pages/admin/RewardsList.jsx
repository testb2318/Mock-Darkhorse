// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchRewards, setSelectedReward } from '../../redux/rewardSlice';
// // import RewardEditModal from './RewardEditModal';

// const RewardsList = () => {
//   const dispatch = useDispatch();
//   const { rewards, loading, error } = useSelector((state) => state.rewards);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   useEffect(() => {
//     dispatch(fetchRewards());
//   }, [dispatch]);
  
//   const handleEdit = (reward) => {
//     dispatch(setSelectedReward(reward));
//     setIsModalOpen(true);
//   };
  
//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(value);
//   };
  
//   if (loading) return <div className="text-center p-4">Loading rewards...</div>;
//   if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  
//   return (
//         <div className="admin-dark p-4">
//       <div className="admin-table-bg rounded-md shadow-sm">
//       <h1 className="text-2xl font-semibold p-4 border-b border-white/20">Reward Plans</h1>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//         {rewards?.map((reward) => (
//           <div
//             key={reward.id}
//             className={`admin-thead  p-4 shadow-md border-l-4 ${
//               reward.is_active ? 'border-green-400' : 'border-gray-300'
//             }`}
//           >
//             <div className="flex justify-between items-start">
//               <h2 className="text-xl font-semibold ">{reward.title}</h2>
//               <span
//                 className={`px-2 py-1 text-xs rounded-full ${
//                   reward.is_active ? 'card-green text-green-100' : 'bg-gray-100 text-gray-600'
//                 }`}
//               >
//                 {reward.is_active ? 'Active' : 'Inactive'}
//               </span>
//             </div>
//             <p className=" mt-2 max-h-60 overflow-y-auto no-scrollbar text-sm text-justify">{reward.description}</p>
//             <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
//               <div className="card-blue p-2 rounded">
//                 <span className=" font-medium">Target:</span>
//                 <p className="">${reward.threshold.toLocaleString()}</p>
//               </div>
//               <div className="card-purple p-2 rounded">
//                 <span className=" font-medium">Reward:</span>
//                 <p className="">{formatCurrency(reward.reward_amount)}</p>
//               </div>
//             </div>
            
//             <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
//               <div className="card-teal p-2 rounded flex justify-between items-center">
//                 <span className=" font-medium">Time Frame:</span>
//                 <p className="">{reward.duration_days} days</p>
//               </div>
//             </div>
            
//             {/* <button
//               onClick={() => handleEdit(reward)}
//               className="mt-4 w-full bg-[#D4AF37] hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
//             >
//               Edit Reward
//             </button> */}
//           </div>
//         ))}
//       </div>
//       </div>
      
//       {/* {isModalOpen && <RewardEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />} */}
//     </div>
//   );
// };

// export default RewardsList;













import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; // Animation library
import { fetchRewards, setSelectedReward } from '../../redux/rewardSlice';
import { 
  Trophy, Target, Clock, DollarSign, 
  Settings2, ShieldCheck, ShieldAlert,
  Zap, ChevronRight, Sparkles
} from 'lucide-react';

const RewardsList = () => {
  const dispatch = useDispatch();
  const { rewards, loading, error } = useSelector((state) => state.rewards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchRewards());
  }, [dispatch]);
  
  const handleEdit = (reward) => {
    dispatch(setSelectedReward(reward));
    setIsModalOpen(true);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0
    }).format(value);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-[#F5C518] border-t-transparent rounded-full"
      />
      <p className="text-[#F5C518] font-bold animate-pulse tracking-widest text-xs">LOADING ECOSYSTEM...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-12 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Animated Header */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#F5C518] font-black tracking-[0.3em] text-xs">
              <Sparkles size={14} /> SYSTEM CONFIGURATION
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              REWARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ENGINES</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0a0a0a]/80 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
             <div className="px-4 py-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Active Nodes</p>
                <p className="text-xl font-black text-white">{rewards?.length || 0}</p>
             </div>
             <div className="h-10 w-[1px] bg-white/10" />
             <div className="p-3 text-[#F5C518]"><Trophy size={28} /></div>
          </div>
        </motion.div>

        {/* Animated Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {rewards?.map((reward) => (
            <motion.div
              key={reward.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative"
            >
              {/* Outer Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F5C518] to-purple-600 rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur transition duration-500" />
              
              <div className="relative bg-[#0b1120] border border-white/10 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl overflow-hidden">
                
                {/* Header: Title & Status */}
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white group-hover:text-[#F5C518] transition-colors leading-tight">
                      {reward.title}
                    </h2>
                    <div className="flex items-center gap-2">
                       {reward.is_active ? 
                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <ShieldCheck size={10}/> Online
                        </span> : 
                        <span className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-[#111] px-2 py-0.5 rounded-md">
                          <ShieldAlert size={10}/> Offline
                        </span>
                       }
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#F5C518]/20 group-hover:text-[#F5C518] transition-all">
                    <Zap size={20} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                  {reward.description}
                </p>

                {/* Main Stats (Glass Box) */}
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Target size={10}/> Goal
                    </p>
                    <p className="text-xl font-black text-white italic">${reward.threshold.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <DollarSign size={10}/> Payout
                    </p>
                    <p className="text-xl font-black text-[#F5C518] italic">{formatCurrency(reward.reward_amount)}</p>
                  </div>
                </div>

                {/* Time Validity Footer */}
                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={14} className="group-hover:text-purple-400 transition-colors"/>
                    <span className="text-xs font-bold uppercase tracking-tighter">{reward.duration_days} Days Expiry</span>
                  </div>
                  <motion.button
                    onClick={() => handleEdit(reward)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#F5C518] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Manage <ChevronRight size={14} />
                  </motion.button>
                </div>

                {/* Subtle Background Icon */}
                <Trophy className="absolute -bottom-6 -right-6 text-white/[0.02] w-32 h-32 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsList;