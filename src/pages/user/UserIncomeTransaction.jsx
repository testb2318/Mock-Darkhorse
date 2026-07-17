// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion"; // Element-level animation
// import Loader from "../../components/common/Loader";
// import {
//   getTransactionById,
//   clearErrors,
//   clearMessage,
// } from "../../redux/transactionSlice";

// export default function UserIncomeTransaction() {
//   const { table_name, fit } = useParams();
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { transaction, loading, error, message } = useSelector(
//     (state) => state.transaction
//   );

//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("all");
//   const entriesPerPage = 20;

//   // --- Animation Variants ---
//   const containerVars = {
//     initial: { opacity: 0 },
//     animate: { 
//       opacity: 1,
//       transition: { staggerChildren: 0.05 } 
//     }
//   };

//   const itemVars = {
//     initial: { y: 15, opacity: 0 },
//     animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
//   };

//   // Get dynamic page title based on table_name
//   const getPageTitle = () => {
//     switch (table_name) {
//       case 'direct_transaction':
//         return {
//           title: 'Direct History',
//           subtitle: 'Track all your direct transaction activities'
//         };
//       case 'invest_level_transaction':
//         return {
//           title: 'Level History',
//           subtitle: 'Track all your level-based transaction activities'
//         };
//       case 'reward_transaction':
//         return {
//           title: 'Reward History',
//           subtitle: 'Track all your reward transaction activities'
//         };
//       // case 'cto_transaction':
//       //   return {
//       //     title: 'CTO History',
//       //     subtitle: 'Track all your CTO transaction activities'
//       //   };
//       default:
//         return {
//           title: 'Transaction History',
//           subtitle: 'Track all your financial activities'
//         };
//     }
//   };

//   // Fetch transactions on component mount
//   useEffect(() => {
//     if (table_name && auth?.id) {
//       dispatch(getTransactionById({ table_name, user_id: auth.id }));
//     }
//   }, [dispatch, table_name, auth?.id]);

//   // Handle error and message cleanup
//   useEffect(() => {
//     let errorInterval, messageInterval;
    
//     if (error) {
//       errorInterval = setInterval(() => dispatch(clearErrors()), 3000);
//     }
    
//     if (message) {
//       messageInterval = setInterval(() => dispatch(clearMessage()), 3000);
//     }
    
//     return () => {
//       if (errorInterval) clearInterval(errorInterval);
//       if (messageInterval) clearInterval(messageInterval);
//     };
//   }, [error, message, dispatch]);

//   // Get unique transaction types for filtering tabs
//   const transactionTypes = useMemo(() => {
//     if (!transaction?.length) return [];
//     const types = new Set();
    
//     transaction.forEach(item => {
//       const type = table_name === "invest_level_transaction" 
//         ? item?.type 
//         : table_name.split("_")[0];
//         console.log(type)
//       if (type) types.add(type.toLowerCase());
//     });
  
//     return Array.from(types);
//   }, [transaction, table_name]);

//   // Process and filter transactions based on search and active tab
//   const processedTransactions = useMemo(() => {
//     if (!transaction?.length) return [];
    
//     let filteredData = [...transaction].reverse();
    
//     // Apply filter by URL parameter if provided
//     if (fit) {
//       filteredData = filteredData.filter(item => 
//         item?.type?.toLowerCase().includes(fit.toLowerCase())
//       );
//     }
    
//     // Apply active tab filter
//     if (activeTab !== "all") {
//       filteredData = filteredData.filter(item => {
//         const itemType = table_name === "invest_level_transaction" 
//           ? item?.type 
//           : table_name.split("_")[0];
//         return itemType?.toLowerCase() === activeTab.toLowerCase();
//       });
//     }
    
//     // Apply search filter
//     if (searchTerm) {
//       filteredData = filteredData.filter(item => 
//         Object.values(item).some(value => 
//           value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
    
//     return filteredData;
//   }, [transaction, fit, searchTerm, activeTab, table_name]);

//   // Calculate pagination
//   const totalPages = Math.max(1, Math.ceil(processedTransactions.length / entriesPerPage));
//   const currentTransactions = useMemo(() => {
//     return processedTransactions.slice(
//       (currentPage - 1) * entriesPerPage, 
//       currentPage * entriesPerPage
//     );
//   }, [processedTransactions, currentPage, entriesPerPage]);

//   // Pagination handlers
//   const goToNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   // Format currency value
//   const formatCurrency = (value) => {
//     if (!value) return "$0.00";
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(value);
//   };

//   // Format date logic for System Log style
//   const formatDate = (dateString) => {
//     if (!dateString) return { date: "", time: "" };
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return { date: dateString, time: "" };
    
//     const d = new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     }).format(date);

//     const t = new Intl.DateTimeFormat('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     }).format(date);

//     return { date: d, time: t };
//   };

//   // Get transaction type and status indicators
//   const getTransactionTypeClass = (item) => {
//     const type = table_name === "invest_level_transaction" 
//       ? item?.type?.toLowerCase() 
//       : table_name.split("_")[0].toLowerCase();
      
//     const typeClasses = {
//       deposit: "bg-green-500/10 text-green-400 border border-green-500/20",
//       withdraw: "bg-red-500/10 text-red-400 border border-red-500/20",
//       reward: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
//       referral: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
//       invest: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
//       cto: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
//       default: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
//       roi: "bg-slate-500/10 text-slate-400 border border-slate-500/20"
//     };
    
//     return typeClasses[type] || typeClasses.default;
//   };

//   const noDataAvailable = !loading && currentTransactions.length === 0;

//   return (
//     <motion.div 
//       initial="initial"
//       animate="animate"
//       variants={containerVars}
//       className="p-4 m-4 sm:p-6 min-h-screen relative overflow-hidden bg-[#020817] text-slate-200 rounded-xl"
//     >
//       {/* Element Level Background Animation */}
//       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 blur-[100px] animate-pulse" />
//         <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 blur-[100px] animate-pulse" />
//       </div>

//       <div className="relative z-10">
//         {/* Header Section */}
//         <motion.div variants={itemVars} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
//               {getPageTitle().title}
//             </h3>
//             <p className="text-slate-400 text-sm mt-1 font-medium">{getPageTitle().subtitle}</p>
//           </div>
//           <div className="relative w-full md:w-auto group">
//             <input
//               value={searchTerm}
//               onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//               className="w-full md:w-80 h-12 px-5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all backdrop-blur-md"
//               placeholder="Search activity log..."
//             />
//             <div className="absolute right-4 top-3 text-slate-500 group-focus-within:text-blue-400">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </div>
//         </motion.div>

//         {/* Filter Tabs */}
//         <motion.div variants={itemVars} className="mb-8 overflow-x-auto pb-2 custom-scroll">
//           <div className="flex space-x-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-max">
//             <button
//               onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
//               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
//                 activeTab === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-400 hover:text-slate-200"
//               }`}
//             >
//               All Records
//             </button>
//             {transactionTypes.map((type) => (
//               <button
//                 key={type}
//                 onClick={() => { setActiveTab(type); setCurrentPage(1); }}
//                 className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
//                   activeTab === type ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-slate-400 hover:text-slate-200"
//                 }`}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </motion.div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: 'Total Volume', value: transaction?.length || 0, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
//             { label: 'Total Earned', value: formatCurrency(transaction?.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0)), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2' },
//             { label: 'Last Entry', value: transaction?.length > 0 ? formatCurrency(transaction[transaction.length - 1]?.amount) : "$0.00", icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
//             { label: 'Result Found', value: processedTransactions.length, icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586' }
//           ].map((stat, i) => (
//             <motion.div
//               key={i}
//               variants={itemVars}
//               whileHover={{ scale: 1.02, y: -5 }}
//               className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-xl"
//             >
//               <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
//               <div className="flex items-center justify-between mt-2">
//                 <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
//                 <div className="bg-blue-500/10 p-2 rounded-lg">
//                   <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
//                   </svg>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Table Section */}
//         <motion.div variants={itemVars} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
//           {loading ? (
//             <div className="h-64 flex items-center justify-center"><Loader /></div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-white/5 border-b border-white/10 text-slate-400">
//                   <tr>
//                     <th className="p-4 text-sm font-bold uppercase tracking-widest">No.</th>
//                     {table_name !== "cto_transaction" && <th className="p-4 text-sm font-bold uppercase tracking-widest">User ID</th>}
//                     <th className="p-4 text-sm font-bold uppercase tracking-widest">Amount</th>
//                     <th className="p-4 text-sm font-bold uppercase tracking-widest">Type</th>
//                     {table_name !== "reward_transaction" && table_name !== "cto_transaction" && (
//                       <>
//                         <th className="p-4 text-sm font-bold uppercase tracking-widest">Reference</th>
//                         <th className="p-4 text-sm font-bold uppercase tracking-widest">Percent</th>
//                       </>
//                     )}
//                     <th className="p-4 text-sm font-bold uppercase tracking-widest text-center">System Log (Time)</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/5">
//                   <AnimatePresence mode="wait">
//                     {noDataAvailable ? (
//                       <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                         <td colSpan={8} className="py-20 text-center text-slate-500 italic">No transactions found in this sequence.</td>
//                       </motion.tr>
//                     ) : (
//                       currentTransactions.map((item, index) => (
//                         <motion.tr
//                           key={index}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.02 }}
//                           className="hover:bg-blue-500/5 transition-colors group"
//                         >
//                           <td className="p-4 text-slate-500 font-mono text-sm">{(currentPage - 1) * entriesPerPage + index + 1}</td>
//                           {table_name !== "cto_transaction" && <td className="p-4 text-slate-300 font-medium">{item?.email || '—'}</td>}
//                           <td className="p-4">
//                             <span className="text-emerald-400 font-bold">+{formatCurrency(item?.amount)}</span>
//                           </td>
//                           <td className="p-4">
//                             <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${getTransactionTypeClass(item)}`}>
//                               {table_name === "invest_level_transaction" ? item?.type : table_name.split("_")[0]}
//                             </span>
//                           </td>
//                           {table_name !== "reward_transaction" && table_name !== "cto_transaction" && (
//                             <>
//                               <td className="p-4 text-slate-400 text-sm">{formatCurrency(item?.onamount)}</td>
//                               <td className="p-4 text-slate-400 text-sm">{item?.percent ? `${item.percent}%` : '—'}</td>
//                             </>
//                           )}
//                           <td className="p-4 text-center">
//                             <div className="flex flex-col items-center">
//                               <span className="text-sm font-bold text-slate-400 group-hover:text-blue-300 transition-colors">
//                                 {formatDate(item?.createdAt).date}
//                               </span>
//                               <span className="text-[10px] font-mono text-cyan-500/60 uppercase">
//                                 {formatDate(item?.createdAt).time}
//                               </span>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ))
//                     )}
//                   </AnimatePresence>
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </motion.div>

//         {/* Pagination Section */}
//         {!loading && processedTransactions.length > 0 && (
//           <motion.div variants={itemVars} className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 px-2">
//             <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">
//               Showing log <b>{(currentPage - 1) * entriesPerPage + 1}</b> to <b>{Math.min(currentPage * entriesPerPage, processedTransactions.length)}</b>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={goToPreviousPage}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 disabled:opacity-20 transition-all"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               <span className="font-mono text-sm text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-lg border border-blue-500/20">
//                 {currentPage} / {totalPages}
//               </span>
//               <button
//                 onClick={goToNextPage}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 disabled:opacity-20 transition-all"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// }



































// // import { useParams } from "react-router-dom";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useEffect, useState, useMemo } from "react";
// // import Loader from "../../components/common/Loader";
// // import {
// //   getTransactionById,
// //   clearErrors,
// //   clearMessage,
// // } from "../../redux/transactionSlice";

// // export default function UserIncomeTransaction() {
// //   const { table_name, fit } = useParams();
// //   const dispatch = useDispatch();
// //   const { auth } = useSelector((state) => state.auth);
// //   const { transaction, loading, error, message } = useSelector(
// //     (state) => state.transaction
// //   );
  
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [activeTab, setActiveTab] = useState("all");
// //   const entriesPerPage = 20;

// //   // Get dynamic page title based on table_name
// //   const getPageTitle = () => {
// //     switch (table_name) {
// //       case 'direct_transaction':
// //         return {
// //           title: 'Direct History',
// //           subtitle: 'Track all your direct transaction activities'
// //         };
// //       case 'invest_level_transaction':
// //         return {
// //           title: 'Level History',
// //           subtitle: 'Track all your level-based transaction activities'
// //         };
// //       case 'reward_transaction':
// //         return {
// //           title: 'Reward History',
// //           subtitle: 'Track all your reward transaction activities'
// //         };
// //       // case 'cto_transaction':
// //       //   return {
// //       //     title: 'CTO History',
// //       //     subtitle: 'Track all your CTO transaction activities'
// //       //   };
// //       default:
// //         return {
// //           title: 'Transaction History',
// //           subtitle: 'Track all your financial activities'
// //         };
// //     }
// //   };

// //   // Fetch transactions on component mount
// //   useEffect(() => {
// //     if (table_name && auth?.id) {
// //       dispatch(getTransactionById({ table_name, user_id: auth.id }));
// //     }
// //   }, [dispatch, table_name, auth?.id]);

// //   // Handle error and message cleanup
// //   useEffect(() => {
// //     let errorInterval, messageInterval;
    
// //     if (error) {
// //       errorInterval = setInterval(() => dispatch(clearErrors()), 3000);
// //     }
    
// //     if (message) {
// //       messageInterval = setInterval(() => dispatch(clearMessage()), 3000);
// //     }
    
// //     return () => {
// //       if (errorInterval) clearInterval(errorInterval);
// //       if (messageInterval) clearInterval(messageInterval);
// //     };
// //   }, [error, message, dispatch]);

// //   // Get unique transaction types for filtering tabs
// //   const transactionTypes = useMemo(() => {
// //     if (!transaction?.length) return [];
// //     const types = new Set();
    
// //     transaction.forEach(item => {
// //       const type = table_name === "invest_level_transaction" 
// //         ? item?.type 
// //         : table_name.split("_")[0];
// //         console.log(type)
// //       if (type) types.add(type.toLowerCase());
// //     });
  
// //     return Array.from(types);
// //   }, [transaction, table_name]);

// //   // Process and filter transactions based on search and active tab
// //   const processedTransactions = useMemo(() => {
// //     if (!transaction?.length) return [];
    
// //     let filteredData = [...transaction].reverse();
    
// //     // Apply filter by URL parameter if provided
// //     if (fit) {
// //       filteredData = filteredData.filter(item => 
// //         item?.type?.toLowerCase().includes(fit.toLowerCase())
// //       );
// //     }
    
// //     // Apply active tab filter
// //     if (activeTab !== "all") {
// //       filteredData = filteredData.filter(item => {
// //         const itemType = table_name === "invest_level_transaction" 
// //           ? item?.type 
// //           : table_name.split("_")[0];
// //         return itemType?.toLowerCase() === activeTab.toLowerCase();
// //       });
// //     }
    
// //     // Apply search filter
// //     if (searchTerm) {
// //       filteredData = filteredData.filter(item => 
// //         Object.values(item).some(value => 
// //           value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
// //         )
// //       );
// //     }
    
// //     return filteredData;
// //   }, [transaction, fit, searchTerm, activeTab, table_name]);

// //   // Calculate pagination
// //   const totalPages = Math.max(1, Math.ceil(processedTransactions.length / entriesPerPage));
// //   const currentTransactions = useMemo(() => {
// //     return processedTransactions.slice(
// //       (currentPage - 1) * entriesPerPage, 
// //       currentPage * entriesPerPage
// //     );
// //   }, [processedTransactions, currentPage, entriesPerPage]);

// //   // Pagination handlers
// //   const goToNextPage = () => {
// //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
// //   };

// //   const goToPreviousPage = () => {
// //     if (currentPage > 1) setCurrentPage(currentPage - 1);
// //   };

// //   // Format currency value
// //   const formatCurrency = (value) => {
// //     if (!value) return "$0.00";
// //     return new Intl.NumberFormat('en-US', {
// //       style: 'currency',
// //       currency: 'USD',
// //       minimumFractionDigits: 2
// //     }).format(value);
// //   };

// //   // Format date
// //   const formatDate = (dateString) => {
// //     if (!dateString) return "";
// //     const date = new Date(dateString);
// //     if (isNaN(date.getTime())) return dateString;
    
// //     return new Intl.DateTimeFormat('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     }).format(date);
// //   };

// //   // Get transaction type and status indicators
// //   const getTransactionTypeClass = (item) => {
// //     const type = table_name === "invest_level_transaction" 
// //       ? item?.type?.toLowerCase() 
// //       : table_name.split("_")[0].toLowerCase();
      
// //     const typeClasses = {
// //       deposit: "bg-green-100 text-green-800",
// //       withdraw: "bg-red-100 text-red-800",
// //       reward: "bg-purple-100 text-purple-800",
// //       referral: "bg-blue-100 text-blue-800",
// //       invest: "bg-indigo-100 text-indigo-800",
// //       cto: "bg-amber-100 text-amber-800",
// //       default: "bg-blue-100 text-blue-800",
// //       roi: "bg-gray-100 text-gray-800"
// //     };
    
// //     return typeClasses[type] || typeClasses.default;
// //   };

// //   // Check if data is available
// //   console.log(currentTransactions)
// //   const noDataAvailable = !loading && currentTransactions.length === 0;

// //   return (
// //     <div className="p-4 tableBg rounded-md">
// //       {/* Header Section */}
// //       <div className="flex flex-col justify-between items-center mb-6 sm:flex-row">
// //         <div className="mb-4 sm:mb-0">
// //           <h3 className="text-2xl font-semibold text-yellow-400">{getPageTitle().title}</h3>
// //           <p className="subtext text-base">{getPageTitle().subtitle}</p>
// //         </div>
// //         <div className="relative">
// //           <input
// //             value={searchTerm}
// //             onChange={(e) => {
// //               setSearchTerm(e.target.value);
// //               setCurrentPage(1); // Reset to first page when searching
// //             }}
// //             className="pr-10 pl-5 w-72 h-12 text-lg primeryBg backdrop-blur-sm rounded-md shadow-inner  focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
// //             placeholder="Search transactions..."
// //           />
// //           <button className="absolute top-3 right-4">
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               strokeWidth="2.5"
// //               stroke="currentColor"
// //               className="w-6 h-6 subtext"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
// //               />
// //             </svg>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filter Tabs */}
// //       <div className="mb-4 overflow-x-auto custom-scroll pb-2">
// //         <div className="flex space-x-2">
// //           <button
// //             onClick={() => { 
// //               setActiveTab("all"); 
// //               setCurrentPage(1);
// //             }}
// //             className={`px-4 py-2 rounded-lg font-medium transition-all ${
// //               activeTab === "all"
// //                 ? "bg-blue-600  shadow-lg"
// //                 : "bg-white/10 /80 hover:bg-white/20"
// //             }`}
// //           >
// //             All Transactions
// //           </button>
          
// //           {transactionTypes.map((type) => (
// //             <button
// //               key={type}
// //               onClick={() => { 
// //                 setActiveTab(type); 
// //                 setCurrentPage(1);
// //               }}
// //               className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
// //                 activeTab === type
// //                   ? "bg-blue-600  shadow-lg"
// //                   : "bg-white/10 /80 hover:bg-white/20"
// //               }`}
// //             >
// //               {type}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Stats Summary Cards */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //         <div className="bg-gradient-to-br from-purple-700 to-purple-800 p-4 rounded-xl shadow-lg">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-blue-100">Total Transactions</p>
// //               <h4 className="text-2xl font-bold ">{transaction?.length || 0}</h4>
// //             </div>
// //             <div className="bg-purple-400/30 p-3 rounded-lg">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
// //               </svg>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="bg-gradient-to-br from-green-700 to-green-800 p-4 rounded-xl shadow-lg">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-green-100">Total Earned</p>
// //               <h4 className="text-2xl font-bold ">
// //                 {formatCurrency(
// //                   transaction?.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0) || 0
// //                 )}
// //               </h4>
// //             </div>
// //             <div className="bg-green-400/30 p-3 rounded-lg">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="bg-gradient-to-br from-pink-700 to-pink-800  p-4 rounded-xl shadow-lg">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-pink-100">Latest Transaction</p>
// //               <h4 className="text-2xl font-bold ">
// //                 {transaction && transaction.length > 0 
// //                   ? formatCurrency(transaction[transaction.length - 1]?.amount) 
// //                   : "$0.00"}
// //               </h4>
// //             </div>
// //             <div className="bg-pink-400/30 p-3 rounded-lg">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
// //               </svg>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="bg-gradient-to-br from-amber-700 to-amber-800 p-4 rounded-xl shadow-lg">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-amber-100">Filtered Results</p>
// //               <h4 className="text-2xl font-bold ">{processedTransactions.length}</h4>
// //             </div>
// //             <div className="bg-amber-400/30 p-3 rounded-lg">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
// //               </svg>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Table Section */}
// //       <div className="overflow-hidden rounded-xl shadow-lg bg-white/5 backdrop-blur-sm border border-white/10">
// //         {loading ? (
// //           <div className="flex justify-center items-center h-64">
// //             <Loader />
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto custom-scroll">
// //             <table className="w-full text-left">
// //               <thead className="bg-thead p-4">
// //                 <tr className="">
// //                   <th className="p-4  font-medium">No.</th>
// //                   {table_name !== "cto_transaction" && (
// //                     <th className="p-4  font-medium">ID</th>
// //                   )}
// //                   <th className="p-4  font-medium">Amount</th>
// //                   <th className="p-4  font-medium">Type</th>
// //                   {table_name !== "reward_transaction" &&
// //                     table_name !== "cto_transaction" && (
// //                       <>
// //                         <th className="p-4  font-medium">On Amount</th>
// //                         <th className="p-4  font-medium">Percent</th>
// //                       </>
// //                     )}
// //                   <th className="p-4  font-medium">Date & Time</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {noDataAvailable ? (
// //                   <tr>
// //                     <td 
// //                       colSpan={
// //                         table_name !== "reward_transaction" && table_name !== "cto_transaction"
// //                           ? table_name !== "cto_transaction" ? 7 : 6
// //                           : table_name !== "cto_transaction" ? 5 : 4
// //                       } 
// //                       className="py-16 text-center subtext"
// //                     >
// //                       <div className="flex flex-col items-center justify-center">
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 subtext mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
// //                         </svg>
// //                         <p className="text-lg">No transactions found</p>
// //                         <p className="subtext mt-2">Try adjusting your search or filters</p>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   currentTransactions.map((item, index) => (
// //                     <tr
// //                       key={index}
// //                          className={
// //                       index % 2 === 0
// //                         ? "primeryBg bg-opacity-20"
// //                         : "primerysub bg-opacity-20"
// //                     }
// //                     >
// //                       <td className="p-4 ">
// //                         {(currentPage - 1) * entriesPerPage + index + 1}
// //                       </td>
// //                       {table_name !== "cto_transaction" && (
// //                         <td className="p-4 ">{item?.email || '—'}</td>
// //                       )}
// //                       <td className="p-4">
// //                         <span className="font-semibold text-emerald-400">
// //                           +{formatCurrency(item?.amount)}
// //                         </span>
// //                       </td>
// //                       <td className="py-4">
// //                         <span className={`px-1 py-1  capitalize rounded-full text-sm font-medium ${getTransactionTypeClass(item)}`}>
// //                           {table_name === "invest_level_transaction"
// //                             ? item?.type
// //                             : table_name.split("_")[0]}
// //                         </span>
// //                       </td>
// //                       {table_name !== "reward_transaction" &&
// //                         table_name !== "cto_transaction" && (
// //                           <>
// //                             <td className="p-4 ">
// //                               {formatCurrency(item?.onamount)}
// //                             </td>
// //                             <td className="p-4 ">
// //                               {item?.percent ? `${item.percent}%` : '—'}
// //                             </td>
// //                           </>
// //                         )}
// //                       <td className="p-4 ">
// //                         {formatDate(item?.createdAt)}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       {/* Pagination Section */}
// //       {!loading && processedTransactions.length > 0 && (
// //         <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
// //           <div className="text-slate-400">
// //             Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, processedTransactions.length)} of {processedTransactions.length} entries
// //           </div>
          
// //           <div className="flex items-center gap-2">
// //             <button
// //               onClick={goToPreviousPage}
// //               disabled={currentPage === 1}
// //               className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
// //                 currentPage === 1 
// //                   ? "bg-slate-700/50 text-slate-500 cursor-not-allowed" 
// //                   : "bg-blue-600  hover:bg-blue-700"
// //               }`}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
// //               </svg>
// //               Previous
// //             </button>
            
// //             <div className="flex items-center gap-1">
// //               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //                 // Show pages around current page
// //                 let pageToShow;
// //                 if (totalPages <= 5) {
// //                   pageToShow = i + 1;
// //                 } else if (currentPage <= 3) {
// //                   pageToShow = i + 1;
// //                 } else if (currentPage >= totalPages - 2) {
// //                   pageToShow = totalPages - 4 + i;
// //                 } else {
// //                   pageToShow = currentPage - 2 + i;
// //                 }
                
// //                 return (
// //                   <button
// //                     key={i}
// //                     onClick={() => setCurrentPage(pageToShow)}
// //                     className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
// //                       currentPage === pageToShow
// //                         ? "bg-blue-600 "
// //                         : "primeryBg hover:bg-slate-700"
// //                     }`}
// //                   >
// //                     {pageToShow}
// //                   </button>
// //                 );
// //               })}
              
// //               {totalPages > 5 && currentPage < totalPages - 2 && (
// //                 <>
// //                   <span className="subtext px-1">...</span>
// //                   <button
// //                     onClick={() => setCurrentPage(totalPages)}
// //                     className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-700/50 text-black hover:bg-slate-700 transition-all"
// //                   >
// //                     {totalPages}
// //                   </button>
// //                 </>
// //               )}
// //             </div>
            
// //             <button
// //               onClick={goToNextPage}
// //               disabled={currentPage === totalPages}
// //               className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
// //                 currentPage === totalPages 
// //                   ? "bg-slate-700/50 text-slate-500 cursor-not-allowed" 
// //                   : "bg-blue-600  hover:bg-blue-700"
// //               }`}
// //             >
// //               Next
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/common/Loader";
import {
  getTransactionById,
  clearErrors,
  clearMessage,
} from "../../redux/transactionSlice";

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent, icon }) {
  const accentMap = {
    blue: "from-[#1A6FA8] to-[#4DD9C0]",
    gold: "from-[#F5C518] to-[#E8A800]",
    teal: "from-[#4DD9C0] to-[#1A6FA8]",
    slate: "from-slate-500 to-slate-600",
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative glass-card animated-border-gold rounded-2xl p-0.5 group"
    >
      <div className="bg-black/40 rounded-2xl p-6 h-full relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b ${accentMap[accent] || accentMap.blue} rounded-l-2xl`} />
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4DD9C0]/5 rounded-full blur-xl group-hover:bg-[#4DD9C0]/10 transition-all duration-500" />
        <p className="text-[9px] font-black tracking-[3px] uppercase text-slate-500 mb-2">{label}</p>
        <div className="flex items-center justify-between mt-1">
          <h3 className="font-['Orbitron',sans-serif] text-2xl font-black text-white tracking-tight">{value}</h3>
          <div className="bg-[#1A2E45] p-2 rounded-lg">
            <svg className="w-5 h-5 text-[#4DD9C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserIncomeTransaction() {
  const { table_name, fit } = useParams();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { transaction, loading, error, message } = useSelector(
    (state) => state.transaction
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const entriesPerPage = 20;

  // ── Page title ──────────────────────────────────────────────────────────────
  const getPageTitle = () => {
    switch (table_name) {
      case "direct_transaction":
        return { title: "Direct", accent: "History" };
      case "invest_level_transaction":
        return { title: "Level", accent: "History" };
      case "reward_transaction":
        return { title: "Reward", accent: "History" };
      default:
        return { title: "Transaction", accent: "History" };
    }
  };

  // ── User initials ───────────────────────────────────────────────────────────
  const userInitials = auth?.fullname
    ? auth.fullname.trim().split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("")
    : "Zx";

  // ── Data fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (table_name && auth?.id) {
      dispatch(getTransactionById({ table_name, user_id: auth.id }));
    }
  }, [dispatch, table_name, auth?.id]);

  // ── Error / message cleanup ─────────────────────────────────────────────────
  useEffect(() => {
    let errorInterval, messageInterval;
    if (error) errorInterval = setInterval(() => dispatch(clearErrors()), 3000);
    if (message) messageInterval = setInterval(() => dispatch(clearMessage()), 3000);
    return () => {
      if (errorInterval) clearInterval(errorInterval);
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [error, message, dispatch]);

  // ── Unique types for tabs ───────────────────────────────────────────────────
  const transactionTypes = useMemo(() => {
    if (!transaction?.length) return [];
    const types = new Set();
    transaction.forEach((item) => {
      const type = table_name === "invest_level_transaction" ? item?.type : table_name.split("_")[0];
      if (type) types.add(type.toLowerCase());
    });
    return Array.from(types);
  }, [transaction, table_name]);

  // ── Filter + search ─────────────────────────────────────────────────────────
  const processedTransactions = useMemo(() => {
    if (!transaction?.length) return [];
    let data = [...transaction].reverse();

    if (fit) {
      data = data.filter((item) => item?.type?.toLowerCase().includes(fit.toLowerCase()));
    }

    if (activeTab !== "all") {
      data = data.filter((item) => {
        const itemType = table_name === "invest_level_transaction" ? item?.type : table_name.split("_")[0];
        return itemType?.toLowerCase() === activeTab.toLowerCase();
      });
    }

    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some((v) => v && v.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return data;
  }, [transaction, fit, activeTab, searchTerm, table_name]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(processedTransactions.length / entriesPerPage));
  const currentTransactions = useMemo(
    () => processedTransactions.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage),
    [processedTransactions, currentPage, entriesPerPage]
  );

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };
  const goToPreviousPage = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };

  // ── Formatters ──────────────────────────────────────────────────────────────
  // const formatCurrency = (v) =>
  //   v ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v) : "$0.00";
const formatCurrency = (v) =>
  v ? new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(v) : "$0.00";

  
  const formatDate = (ds) => {
    if (!ds) return { date: "", time: "" };
    const d = new Date(ds);
    if (isNaN(d.getTime())) return { date: ds, time: "" };
    return {
      date: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(d),
      time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).format(d),
    };
  };

  // ── Type badge style ────────────────────────────────────────────────────────
  const getTypeBadgeClass = (item) => {
    const type = (table_name === "invest_level_transaction" ? item?.type : table_name.split("_")[0])?.toLowerCase();
    const map = {
      direct: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      invest: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      reward: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      roi: "bg-[#4DD9C0]/10 text-[#4DD9C0] border border-[#4DD9C0]/20",
      level: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      default: "bg-[#1A6FA8]/15 text-[#4DD9C0] border border-[#4DD9C0]/20",
    };
    return map[type] || map.default;
  };

  const pageTitle = getPageTitle();

  // ── Table headers ───────────────────────────────────────────────────────────
  const showExtraCols = table_name !== "reward_transaction" && table_name !== "cto_transaction";

  return (
    <div className="relative min-h-screen bg-transparent text-slate-200 p-4 lg:p-8 overflow-hidden font-['Rajdhani',sans-serif]">

      {/* ── Background glows ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[180px] rounded-full bg-[#F5C518]/3 blur-[100px]" />
      </div>

      {/* ── Main content ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-7xl mx-auto"
      >

        {/* ── Header ── */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
        >
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-[#c59e14]" />
              <div className="absolute -inset-[6px] rounded-full border border-[#1A6FA8]/50" />
              <span className="font-['Orbitron',sans-serif] text-xl font-black text-[#F5C518] leading-none">
                {userInitials}
              </span>
            </div>
            <div>
              <h1 className="font-['Orbitron',sans-serif] text-3xl lg:text-4xl font-black text-white tracking-wider uppercase">
                {pageTitle.title}{" "}
                <span className="text-gold-dark">{pageTitle.accent}</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#4DD9C0] animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">
                  Live Transaction Stream
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80 group">
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full glass-card bg-black/40 border border-yellow-500/20 rounded-2xl px-12 py-3.5 text-sm text-white placeholder-slate-400 outline-none focus:border-yellow-500/50 transition-all duration-200 font-['Rajdhani',sans-serif] font-semibold"
              placeholder="Search activity log..."
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-yellow-500 transition-colors"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Volume"
            value={transaction?.length || 0}
            accent="blue"
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
          />
          <StatCard
            label="Total Earned"
            value={formatCurrency(transaction?.reduce((a, b) => a + (parseFloat(b.amount) || 0), 0))}
            accent="gold"
            icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
          />
          <StatCard
            label="Last Entry"
            value={transaction?.length > 0 ? formatCurrency(transaction[transaction.length - 1]?.amount) : "$0.00"}
            accent="teal"
            icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
          <StatCard
            label="Filtered"
            value={processedTransactions.length}
            accent="slate"
            icon="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586"
          />
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-6 flex-wrap">
          {["all", ...transactionTypes].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#4DD9C0]/15 border-[#4DD9C0]/50 text-[#4DD9C0]"
                  : "bg-[#0D1520] border-[#1A2E45] text-slate-500 hover:border-[#4DD9C0]/30 hover:text-slate-300"
              }`}
            >
              {tab === "all" ? "All Records" : tab}
            </button>
          ))}
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          variants={itemVariants}
          className="glass-card animated-border-gold rounded-3xl p-0.5 mb-6"
        >
          <div className="bg-black/40 rounded-[1.8rem] overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-80"><Loader /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/40 border-b border-yellow-500/20">
                  <tr>
                    {["No.", ...(table_name !== "cto_transaction" ? ["User ID"] : []), "Amount", "Type",
                      ...(showExtraCols ? ["Reference", "Percent"] : []), "System Log"].map((h) => (
                      <th key={h} className="px-6 py-5 text-[12px] font-black uppercase tracking-[3px] text-yellow-500/70">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-500/10">
                  <AnimatePresence>
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map((item, index) => {
                        const { date, time } = formatDate(item?.createdAt);
                        return (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-yellow-500/5 transition-colors group"
                          >
                            {/* No */}
                            <td className="px-6 py-5 text-[11px] font-bold text-slate-600">
                              {(currentPage - 1) * entriesPerPage + index + 1}
                            </td>

                            {/* User ID */}
                            {table_name !== "cto_transaction" && (
                              <td className="px-6 py-5 text-sm font-semibold text-slate-400">
                                {item?.email || "—"}
                              </td>
                            )}

                            {/* Amount */}
                            <td className="px-6 py-5 font-['Orbitron',sans-serif] text-[15px] font-black text-[#3DFFC0]">
                              +{formatCurrency(item?.amount)}
                            </td>

                            {/* Type badge */}
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${getTypeBadgeClass(item)}`}>
                                {table_name === "invest_level_transaction" ? item?.type : table_name.split("_")[0]}
                              </span>
                            </td>

                            {/* Reference + Percent */}
                            {showExtraCols && (
                              <>
                                <td className="px-6 py-5 text-sm font-bold text-slate-500">
                                  {formatCurrency(item?.onamount)}
                                </td>
                                <td className="px-6 py-5 font-['Orbitron',sans-serif] text-sm font-black text-[#4DD9C0]">
                                  {item?.percent ? `${item.percent}%` : "—"}
                                </td>
                              </>
                            )}

                            {/* Date */}
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-[13px] font-black uppercase tracking-widest text-white-400 group-hover:text-[#4DD9C0] transition-colors">
                                  {date}
                                </span>
                                <span className="text-[13px] font-mono text-cyan-500/30 uppercase">
                                  {time}
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={showExtraCols ? (table_name !== "cto_transaction" ? 7 : 6) : (table_name !== "cto_transaction" ? 5 : 4)}
                          className="px-6 py-20 text-center text-[11px] font-black uppercase tracking-[4px] text-slate-600"
                        >
                          No Transactions Found
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          </div>
        </motion.div>

        {/* ── Pagination ── */}
        {!loading && processedTransactions.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center glass-card bg-black/40 border border-yellow-500/20 rounded-2xl px-6 py-4"
          >
            <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
              Showing{" "}
              <span className="text-white">{(currentPage - 1) * entriesPerPage + 1}</span>
              <span className="text-slate-600"> – </span>
              <span className="text-white">{Math.min(currentPage * entriesPerPage, processedTransactions.length)}</span>
              <span className="text-slate-600"> of {processedTransactions.length}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-black/40 border border-yellow-500/20 disabled:opacity-20 hover:border-yellow-500 hover:text-yellow-500 transition-all text-white flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="font-['Orbitron',sans-serif] text-sm text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-lg border border-yellow-500/20 flex items-center">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-black/40 border border-yellow-500/20 disabled:opacity-20 hover:border-yellow-500 hover:text-yellow-500 transition-all text-white flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}