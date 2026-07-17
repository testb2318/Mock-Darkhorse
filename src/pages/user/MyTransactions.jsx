import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUserTransactions, resetTransactionState } from "../../redux/transactionSlice";

// --- PRESERVED UTILS ---
const formatCurrency = (value) => {
  if (!value) return "$0.00";
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date);
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

const tableRowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

// --- PRESERVED CUSTOM HOOK ---
const useTransactionFilters = (transaction_type, initialSource, dispatch, user_id) => {
  const [filters, setFilters] = useState({
    page: 1, limit: 10, transaction_type: transaction_type || "",
    status: "", search: "", source: initialSource || "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const applyFilters = () => {
    dispatch(getUserTransactions({ user_id, ...filters }));
  };

  const resetFilters = () => {
    const defaults = { page: 1, limit: 10, transaction_type: "", status: "", search: "", source: "" };
    setFilters(defaults);
    dispatch(getUserTransactions({ user_id, ...defaults }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return { filters, handleFilterChange, applyFilters, resetFilters, handlePageChange };
};

const MyTransactions = ({ transaction_type }) => {
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const user_id = auth?.id;
  const { source } = useParams();
  
  const {
    userTransactions, totalPages, currentPage, loading,
    error, success, message,
  } = useSelector((state) => state.transaction);

  const {
    filters, handleFilterChange, applyFilters, resetFilters, handlePageChange,
  } = useTransactionFilters(transaction_type, source, dispatch, user_id);

  useEffect(() => {
    if (user_id) dispatch(getUserTransactions({ user_id, ...filters }));
  }, [dispatch, filters.page, filters.limit]);

  useEffect(() => {
    if (user_id && source) resetFilters();
  }, [source, user_id]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(resetTransactionState()), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const stats = (() => {
    if (!userTransactions?.length) return { total: 0, deposited: 0, withdrawn: 0, transactions: 0 };
    return userTransactions.reduce((acc, t) => {
      const amt = parseFloat(t.amount) || 0;
      acc.total += amt;
      if (t.transaction_type === 'deposit') acc.deposited += amt;
      else if (t.transaction_type === 'withdrawal') acc.withdrawn += amt;
      return acc;
    }, { total: 0, deposited: 0, withdrawn: 0, transactions: userTransactions.length });
  })();

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#020617] text-slate-200 p-4 m-4 md:p-6 lg:p-10 selection:bg-blue-500/30"
    >
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
        
        {/* HEADER SECTION - RESPONSIVE STACKING */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
              Financial <span className="text-blue-500">Pulse</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Secure Ledger v3.0</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search Reference..."
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none w-full sm:w-64 lg:w-80 transition-all placeholder:text-slate-600"
            />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all"
            >
              Execute Filter
            </motion.button>
          </div>
        </motion.div>

        {/* NOTIFICATIONS */}
        <AnimatePresence mode="wait">
          {(success || error) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`overflow-hidden p-4 rounded-2xl border backdrop-blur-md mb-6 ${success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
            >
              <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
                <span>{message || error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATS GRID - RESPONSIVE COLUMNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Activity Count", val: stats.transactions, color: "text-blue-400" },
            { label: "Total Deposits", val: formatCurrency(stats.deposited), color: "text-emerald-400" },
            { label: "Total Expenses", val: formatCurrency(stats.withdrawn), color: "text-rose-400" },
            { label: "Available Net", val: formatCurrency(stats.total), color: "text-indigo-400" }
          ].map((s, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] shadow-2xl transition-all"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
              <h3 className={`text-2xl md:text-3xl font-black mt-2 tracking-tighter ${s.color}`}>{s.val}</h3>
            </motion.div>
          ))}
        </div>

        {/* DATA TABLE WRAPPER */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl"
        >
          {loading ? (
            <div className="p-24 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">Decryption In Progress</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-white/[0.03] text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">
                  <tr>
                    <th className="p-8">Seq</th>
                    <th className="p-8">Volume</th>
                    <th className="p-8">Type</th>
                    <th className="p-8">Channel</th>
                    <th className="p-8">Verdict</th>
                    <th className="p-8 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {userTransactions?.map((t, i) => (
                      <motion.tr 
                        key={t.transaction_id || i}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className="group hover:bg-blue-600/5 transition-all border-l-2 border-transparent hover:border-blue-600"
                      >
                        <td className="p-8 text-slate-600 font-mono text-xs italic">#{(currentPage - 1) * filters.limit + i + 1}</td>
                        <td className={`p-8 font-black text-xl tracking-tighter ${t.transaction_type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatCurrency(t.amount)}
                        </td>
                        <td className="p-8">
                          <span className="text-[10px] font-black uppercase px-3 py-1 bg-white/5 rounded-lg text-slate-400 border border-white/5">
                            {t.transaction_type}
                          </span>
                        </td>
                        <td className="p-8 text-xs font-bold uppercase tracking-widest text-slate-300">{t.source}</td>
                        <td className="p-8">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            t.status === 'completed' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-400/5' : 
                            t.status === 'pending' ? 'border-amber-500/20 text-amber-400 bg-amber-400/5' : 
                            'border-rose-500/20 text-rose-400 bg-rose-400/5'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-8 text-[10px] text-slate-500 font-bold text-right tabular-nums">{formatDate(t.created_at)}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* RESPONSIVE PAGINATION */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/60 p-5 rounded-[2rem] border border-white/5 gap-6 shadow-2xl">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] pl-4">
            Cluster {currentPage} / <span className="text-slate-400">{totalPages}</span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <motion.button 
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"
            >
              Prev
            </motion.button>
            <motion.button 
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex-1 sm:flex-none px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-600/20 disabled:opacity-20 transition-all"
            >
              Next
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyTransactions;

// // src/components/transactions/MyTransactions.jsx
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getUserTransactions, resetTransactionState } from "../../redux/transactionSlice";



// const useTransactionFilters = (transaction_type, initialSource, dispatch, user_id) => {
//   // Filter states
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 10,
//     transaction_type: transaction_type || "",
//     status: "",
//     search: "",
//     source: initialSource || "",
//   });

//   // Active filter tab
//   const [activeTab, setActiveTab] = useState("all");

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//       page: 1, // Reset to first page when changing filters
//     }));
//   };

//   // Apply filters
//   const applyFilters = () => {
//     dispatch(getUserTransactions({ user_id, ...filters }));
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       page: 1,
//       limit: 10,
//       transaction_type: "",
//       status: "",
//       search: "",
//       source: "",
//     });
//     setActiveTab("all");
//     dispatch(getUserTransactions({ user_id, page: 1, limit: 10 }));
//   };

//   // Handle type filter tab click
//   const handleTabClick = (type) => {
//     setActiveTab(type);
//     if (type === "all") {
//       setFilters((prev) => ({ ...prev, transaction_type: "", page: 1 }));
//     } else {
//       setFilters((prev) => ({ ...prev, transaction_type: type, page: 1 }));
//     }
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     if (newPage > 0) {
//       setFilters((prev) => ({ ...prev, page: newPage }));
//     }
//   };

//   return {
//     filters,
//     activeTab,
//     setActiveTab,
//     handleFilterChange,
//     applyFilters,
//     resetFilters,
//     handleTabClick,
//     handlePageChange,
//   };
// };
// // src/utils/transactionUtils.js

// // Format currency
// const formatCurrency = (value) => {
//   if (!value) return "$0.00";
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2
//   }).format(value);
// };

// // Format date
// const formatDate = (dateString) => {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return dateString;

//   return new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   }).format(date);
// };

// // Get status badge color
// const getStatusBadgeClass = (status) => {
//   switch (status) {
//     case "completed":
//       return "bg-green-100 text-green-800";
//     case "pending":
//       return "bg-yellow-100 text-yellow-800";
//     case "failed":
//       return "bg-red-100 text-red-800";
//     case "cancelled":
//       return "bg-gray-100 subtext";
//     default:
//       return "bg-gray-100 subtext";
//   }
// };

// // Get transaction type badge color
// const getTransactionTypeBadgeClass = (type) => {
//   switch (type) {
//     case "deposit":
//       return "bg-green-100 text-green-800";
//     case "withdrawal":
//       return "bg-red-100 text-red-800";
//     case "transfer":
//       return "bg-blue-100 text-blue-800";
//     case "refund":
//       return "bg-yellow-100 text-yellow-800";
//     default:
//       return "bg-gray-100 subtext";
//   }
// };

// // src/components/transactions/StatsSummary.jsx


// const StatsSummary = ({ stats }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       <div className="bg-gradient-to-br from-purple-700 to-purple-800 p-4 rounded-xl shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-blue-100">Total Transactions</p>
//             <h4 className="text-2xl font-bold text-white">{stats.transactions}</h4>
//           </div>
//           <div className="bg-purple-400/30 p-3 rounded-lg">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-green-700 to-green-800 p-4 rounded-xl shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-green-100">Total Deposited</p>
//             <h4 className="text-2xl font-bold text-white">{formatCurrency(stats.deposited)}</h4>
//           </div>
//           <div className="bg-green-400/30 p-3 rounded-lg">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-red-700 to-red-800 p-4 rounded-xl shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-red-100">Total Withdrawn</p>
//             <h4 className="text-2xl font-bold text-white">{formatCurrency(stats.withdrawn)}</h4>
//           </div>
//           <div className="bg-red-400/30 p-3 rounded-lg">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-purple-700 to-purple-800 p-4 rounded-xl shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-purple-100">Net Balance</p>
//             <h4 className="text-2xl font-bold text-white">{formatCurrency(stats.total)}</h4>
//           </div>
//           <div className="bg-purple-400/30 p-3 rounded-lg">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// const FilterTabs = ({ activeTab, handleTabClick, transactionTypeOptions }) => {
//   return (
//     <>
//       <div></div></>
//     // <div className="mb-4 overflow-x-auto custom-scroll pb-2">
//     //   <div className="flex space-x-2">
//     //     <button
//     //       onClick={() => handleTabClick("all")}
//     //       className={`px-4 py-2 rounded-lg font-medium transition-all ${
//     //         activeTab === "all"
//     //           ? "bg-blue-600 text-white shadow-lg"
//     //           : "bg-blue-500 text-white/80 "
//     //       }`}
//     //     >
//     //       All Transactions
//     //     </button>

//     //     {transactionTypeOptions.map((type) => (
//     //       <button
//     //         key={type}
//     //         onClick={() => handleTabClick(type)}
//     //         className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
//     //           activeTab === type
//     //             ? "bg-blue-600 text-white shadow-lg"
//     //             : "bg-blue-500 text-white/80 "
//     //         }`}
//     //       >
//     //         {type}
//     //       </button>
//     //     ))}
//     //   </div>
//     // </div>
//   );
// };



// const TransactionAlerts = ({ success, error, message, resetState }) => {
//   if (!success && !error) return null;

//   return (
//     <>
//       {success && (
//         <div className="bg-emerald-900/50 border border-emerald-300 text-emerald-300 px-4 py-3 rounded-lg mb-6 flex justify-between items-center backdrop-blur-sm">
//           <div className="flex items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span>{message}</span>
//           </div>
//           <button
//             onClick={resetState}
//             className="text-emerald-300 hover:text-emerald-100"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-900/50 border border-red-300 text-red-300 px-4 py-3 rounded-lg mb-6 flex justify-between items-center backdrop-blur-sm">
//           <div className="flex items-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//             <span>{error}</span>
//           </div>
//           <button
//             onClick={resetState}
//             className="text-red-300 hover:text-red-100"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>
//       )}
//     </>
//   );
// };


// const TransactionHeader = ({ searchValue, handleFilterChange, applyFilters }) => {
//   return (
//     <div className=" lg:flex flex-col space-y-4 lg:space-y-0 justify-between items-center mb-6 sm:flex-row">
//       <div className="mb-4 sm:mb-0">
//         <h1 className="text-xl font-semibold text-yellow-400">My Transactions</h1>
//         <p className="subtext mt-1">View and manage your transaction history</p>
//       </div>
//       <div className="lg:flex justify-end space-y-4 lg:space-y-0 gap-4">
//         <div className="relative">
//           <input
//             type="text"
//             name="search"
//             value={searchValue}
//             onChange={handleFilterChange}
//             placeholder="Search transactions..."
//             className="pr-10 pl-5 w-full lg:w-72 h-10 text-sm primeryBg backdrop-blur-sm rounded-md shadow-inner border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//           />
//           <button
//             onClick={applyFilters}
//             className="absolute top-2.5 right-4"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="2.5"
//               stroke="currentColor"
//               className="w-6 h-6 subtext"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// const AdvancedFilters = ({
//   filters,
//   handleFilterChange,
//   resetFilters,
//   applyFilters,
//   sourceOptions,
//   statusOptions
// }) => {
//   return (
//     <div className=" backdrop-blur-sm border  border-white/10 rounded-md ">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold subtext">Advanced Filters</h2>
//         <button
//           onClick={resetFilters}
//           className="text-blue-300 hover:text-blue-100 flex items-center transition-all"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//           </svg>
//           Reset Filters
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Source Filter */}
//         <div>
//           <label className="block subtext text-sm font-medium mb-2">
//             Source
//           </label>
//           <div className="relative">
//             <select
//               name="source"
//               value={filters.source}
//               onChange={handleFilterChange}
//               className="w-full pl-4 pr-10 py-2  border rounded-md  border-gray-200 subtext shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
//             >
//               <option value="">All Sources</option>
//               {sourceOptions.map((source) => (
//                 <option key={source} value={source} className="">
//                   {source.charAt(0).toUpperCase() + source.slice(1)}
//                 </option>
//               ))}
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//               <svg className="h-5 w-5 subtext/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Status Filter */}
//         <div>
//           <label className="block subtext text-sm font-medium mb-2">
//             Status
//           </label>
//           <div className="relative">
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleFilterChange}
//               className="w-full pl-4 pr-10 py-2  border border-gray-200 rounded-md subtext shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
//             >
//               <option value="">All Statuses</option>
//               {statusOptions.map((status) => (
//                 <option key={status} value={status} className="">
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </option>
//               ))}
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//               <svg className="h-5 w-5 subtext/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Results per page */}
//         <div>
//           <label className="block subtext text-sm font-medium mb-2">
//             Results Per Page
//           </label>
//           <div className="relative">
//             <select
//               name="limit"
//               value={filters.limit}
//               onChange={handleFilterChange}
//               className="w-full pl-4 pr-10 py-2 primeryBg border border-gray-200 rounded-md subtext shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
//             >
//               <option value="5" className="">5</option>
//               <option value="10" className="">10</option>
//               <option value="20" className="">20</option>
//               <option value="50" className="">50</option>
//             </select>
//             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//               <svg className="h-5 w-5 subtext" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6">
//         <button
//           onClick={applyFilters}
//           className="bg-blue-500 hover:bg-blue-600 subtext font-medium py-2 px-6 rounded-lg shadow-lg transition-all"
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// };


// const TransactionTable = ({ loading, transactions, currentPage, limit }) => {
//   return (
//     <div className="overflow-hidden rounded-xl shadow-lg  backdrop-blur-sm border border-white/10">
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="flex flex-col items-center">
//             <div className="w-12 h-12 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
//             <p className="text-white mt-4">Loading transactions...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="overflow-x-auto custom-scroll ">
//           <table className="w-full text-left">
//             <thead className="bg-thead p-4">
//               <tr className="">
//                 <th className="p-4  font-medium">ID</th>
//                 <th className="p-4  font-medium">Amount</th>
//                 <th className="p-4  font-medium">Type</th>
//                 <th className="p-4  font-medium">Source</th>
//                 <th className="p-4  font-medium">Status</th>
//                 <th className="p-4  font-medium">Date & Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions && transactions.length === 0 ? (
//                 <tr className="">
//                   <td colSpan="6" className="py-16 text-center subtext">
//                     <div className="flex flex-col items-center justify-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 subtext mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                       <p className="text-lg">No transactions found</p>
//                       <p className="subtext mt-2">Try adjusting your search or filters</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 transactions && transactions.map((transaction, index) => (
//                   <tr
//                     key={transaction.transaction_id || index}
//                     className={
//                       index % 2 === 0
//                         ? "primeryBg bg-opacity-20"
//                         : "primerysub bg-opacity-20"
//                     }
//                   >
//                     <td className="p-4 ">
//                       {(currentPage - 1) * limit + index + 1}
//                     </td>
//                     <td className="p-4">
//                       <span className={`font-semibold ${transaction.transaction_type === "deposit" ? "text-emerald-400" :
//                         transaction.transaction_type === "withdrawal" ? "text-red-400" : "text-blue-400"
//                         }`}>
//                         +{formatCurrency(transaction.amount)}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeBadgeClass(transaction.transaction_type)}`}>
//                         {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
//                       </span>
//                     </td>
//                     <td className="p-4  capitalize">
//                       {transaction.source}
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
//                         {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="p-4 ">
//                       {formatDate(transaction.created_at)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };


// const TransactionPagination = ({
//   loading,
//   transactions,
//   currentPage,
//   totalPages,
//   limit,
//   handlePageChange
// }) => {
//   if (loading || !transactions || transactions.length === 0 || totalPages <= 0) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
//       <div className="text-slate-400">
//         Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, (currentPage - 1) * limit + transactions.length)} of {totalPages * limit} entries
//       </div>

//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${currentPage === 1
//             ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
//             : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//           </svg>
//           Previous
//         </button>

//         <div className="flex items-center gap-1">
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             // Create page number logic
//             let pageNumber;
//             if (totalPages <= 5) {
//               // Show all pages if 5 or fewer
//               pageNumber = i + 1;
//             } else if (currentPage <= 3) {
//               // Near start
//               pageNumber = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               // Near end
//               pageNumber = totalPages - 4 + i;
//             } else {
//               // Middle - show current page and 2 pages on each side
//               pageNumber = currentPage - 2 + i;
//             }

//             return (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(pageNumber)}
//                 className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === pageNumber
//                   ? "bg-blue-600 text-white"
//                   : "bg-slate-700/50  hover:bg-slate-700/80"
//                   }`}
//               >
//                 {pageNumber}
//               </button>
//             );
//           })}

//           {totalPages > 5 && currentPage < totalPages - 2 && (
//             <>
//               <span className="text-slate-500 px-1">...</span>
//               <button
//                 onClick={() => handlePageChange(totalPages)}
//                 className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-700/50  hover:bg-slate-700/80"
//               >
//                 {totalPages}
//               </button>
//             </>
//           )}
//         </div>

//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${currentPage === totalPages
//             ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
//             : "bg-blue-600 text-white hover:bg-blue-700"
//             }`}
//         >
//           Next
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };


// const MyTransactions = ({ transaction_type }) => {
//   const { auth } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const user_id = auth.id;
//   const { source } = useParams();
//   const {
//     userTransactions,
//     totalPages,
//     currentPage,
//     loading,
//     error,
//     success,
//     message,
//   } = useSelector((state) => state.transaction);

//   // Use custom hook for filter management
//   const {
//     filters,
//     activeTab,
//     setActiveTab,
//     handleFilterChange,
//     applyFilters,
//     resetFilters,
//     handleTabClick,
//     handlePageChange,
//   } = useTransactionFilters(transaction_type, source, dispatch, user_id);

//   // Load user transactions on component mount and when filters change
//   useEffect(() => {
//     if (user_id) {
//       dispatch(getUserTransactions({ user_id, ...filters }));
//     }
//   }, [dispatch, filters.page, filters.limit]);



//   // Modify your existing useEffect to properly respond to source changes
//   useEffect(() => {
//     if (user_id) {
//       // Reset filters and fetch fresh data when source changes
//       if (source) {
//         // Reset to page 1 and clear any active filters
//         const resetFilterState = {
//           ...filters,
//           page: 1,
//           // Reset other filter values as needed
//           search: '',
//           status: '',
//           transaction_type: ''
//         };

//         // Update your filter state through your custom hook
//         resetFilters();

//         // Fetch transactions with the new source and reset filters
//         dispatch(getUserTransactions({
//           user_id,
//           ...resetFilterState,
//           source // Make sure to include the new source
//         }));
//       }
//     }
//   }, [source, user_id]); // Only depend on source and user_id

//   // Clear success message after displaying
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         dispatch(resetTransactionState());
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error, dispatch]);

//   // Calculate transaction statistics
//   const calculateStatistics = () => {
//     if (!userTransactions || !userTransactions.length) {
//       return {
//         total: 0,
//         deposited: 0,
//         withdrawn: 0,
//         transactions: 0
//       };
//     }

//     const stats = userTransactions.reduce((acc, transaction) => {
//       const amount = parseFloat(transaction.amount) || 0;
//       acc.total += amount;

//       if (transaction.transaction_type === 'deposit') {
//         acc.deposited += amount;
//       } else if (transaction.transaction_type === 'withdrawal') {
//         acc.withdrawn += amount;
//       }

//       return acc;
//     }, { total: 0, deposited: 0, withdrawn: 0, transactions: userTransactions.length });

//     return stats;
//   };

//   const stats = calculateStatistics();

//   // Options for filters
//   const transactionTypeOptions = ["deposit", "withdrawal", "transfer", "refund"];
//   const sourceOptions = ["bank", "card", "wallet", "crypto"];
//   const statusOptions = ["pending", "completed", "failed", "cancelled"];

//   return (
//     <div className="p-4 rounded-md tableBg">
//       {/* Header Section */}
//       <TransactionHeader
//         searchValue={filters.search}
//         handleFilterChange={handleFilterChange}
//         applyFilters={applyFilters}
//       />

//       {/* Success/Error Messages */}
//       <TransactionAlerts
//         success={success}
//         error={error}
//         message={message}
//         resetState={() => dispatch(resetTransactionState())}
//       />

//       {/* Stats Summary Cards */}
//       <StatsSummary stats={stats} />

//       {/* Filter Tabs */}
//       {/* <FilterTabs 
//         activeTab={activeTab}
//         handleTabClick={handleTabClick}
//         transactionTypeOptions={transactionTypeOptions}
//       /> */}

//       {/* Advanced Filters Panel */}
//       {/* <AdvancedFilters
//         filters={filters}
//         handleFilterChange={handleFilterChange}
//         resetFilters={resetFilters}
//         applyFilters={applyFilters}
//         sourceOptions={sourceOptions}
//         statusOptions={statusOptions}
//       /> */}

//       {/* Table Section */}
//       <TransactionTable
//         loading={loading}
//         transactions={userTransactions}
//         currentPage={currentPage}
//         limit={filters.limit}
//       />

//       {/* Pagination */}
//       <TransactionPagination
//         loading={loading}
//         transactions={userTransactions}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         limit={filters.limit}
//         handlePageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default MyTransactions;