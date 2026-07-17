



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Search, 
//   Filter, 
//   X, 
//   ChevronLeft, 
//   ChevronRight, 
//   Download,
//   TrendingUp,
//   Users,
//   DollarSign,
//   Activity,
//   RefreshCw,
//   Award,
//   Calendar,
//   Wallet,
//   CheckCircle,
//   AlertCircle,
//   Clock
// } from 'lucide-react';
// import { BASE_URL } from '../../baseurl';

// // Transaction Status Options
// const STATUS_OPTIONS = [
//   { value: '', label: 'All Statuses' },
//   { value: 'completed', label: 'Completed' },
//   { value: 'pending', label: 'Pending' },
//   { value: 'rejected', label: 'Rejected' }
// ];

// const REWARD_LEVEL_OPTIONS = [
//   { value: '', label: 'All Levels' },
//   { value: '1', label: 'Level 1' },
//   { value: '2', label: 'Level 2' },
//   { value: '3', label: 'Level 3' },
//   { value: '4', label: 'Level 4' },
//   { value: '5', label: 'Level 5' }
// ];

// // Stats Card Component
// const StatsCard = ({ icon: Icon, title, value, color }) => {
//   const colorSchemes = {
//     blue: { gradient: "from-[#D4AF37] to-[#F5C518]", bg: "bg-[#F5C518]/10", text: "text-[#F5C518]", iconBg: "bg-[#F5C518]/20", border: "border-[#F5C518]/30" },
//     emerald: { gradient: "from-emerald-600 to-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400", iconBg: "bg-emerald-500/20", border: "border-emerald-500/30" },
//     purple: { gradient: "from-purple-600 to-purple-500", bg: "bg-purple-500/10", text: "text-purple-400", iconBg: "bg-purple-500/20", border: "border-purple-500/30" },
//     amber: { gradient: "from-amber-600 to-amber-500", bg: "bg-amber-500/10", text: "text-amber-400", iconBg: "bg-amber-500/20", border: "border-amber-500/30" },
//   };
  
//   const scheme = colorSchemes[color] || colorSchemes.blue;
  
//   return (
//     <div className={`relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border ${scheme.border} p-5 hover:scale-105 transition-all duration-300 group`}>
//       <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
//       <div className="relative flex items-center justify-between">
//         <div>
//           <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
//           <p className="text-2xl font-bold text-white">{value}</p>
//         </div>
//         <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
//           <Icon className={`w-6 h-6 ${scheme.text}`} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // Status Badge Component
// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     completed: { icon: CheckCircle, color: "emerald", text: "Completed" },
//     pending: { icon: Clock, color: "amber", text: "Pending" },
//     rejected: { icon: AlertCircle, color: "rose", text: "Rejected" },
//   };
  
//   const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
//   const Icon = config.icon;
//   const colors = {
//     emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
//     amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
//     rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
//   };
  
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[config.color]}`}>
//       <Icon className="w-3 h-3" />
//       {config.text}
//     </span>
//   );
// };

// // Level Badge Component
// const LevelBadge = ({ level }) => {
//   const levelColors = {
//     1: "from-[#D4AF37] to-[#F5C518]",
//     2: "from-indigo-600 to-indigo-500",
//     3: "from-purple-600 to-purple-500",
//     4: "from-pink-600 to-pink-500",
//     5: "from-rose-600 to-rose-500",
//   };
  
//   const gradient = levelColors[level] || levelColors[1];
  
//   return (
//     <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${gradient} text-white shadow-lg`}>
//       <Award className="w-3 h-3 mr-1" />
//       Level {level}
//     </span>
//   );
// };

// const RewardTransactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     per_page: 10,
//     current_page: 1,
//     last_page: 1,
//     from: 0,
//     to: 0
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     reward_level: '',
//     username: '',
//     email: '',
//     date_from: '',
//     date_to: '',
//     amount_min: '',
//     amount_max: ''
//   });

//   // API call function
//   const fetchTransactions = async (params = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`${BASE_URL}/tr/rewards`, {
//         params: {
//           page: params.page || 1,
//           limit: params.limit || 10,
//           ...params.filters
//         },
//          withCredentials: true 
//       });
      
//       if (response.data && response.data.transactions) {
//         setTransactions(response.data.transactions);
//         setPagination(response.data.pagination || {
//           total: response.data.transactions.length,
//           per_page: 10,
//           current_page: 1,
//           last_page: 1,
//           from: 1,
//           to: response.data.transactions.length
//         });
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to fetch transactions');
//       console.error('API Error:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Load transactions on component mount
//   useEffect(() => {
//     fetchTransactions({ page: 1, limit: 10, filters });
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchTransactions({ page: 1, limit: pagination.per_page, filters });
//   };

//   // Calculate stats from transactions
//   const stats = React.useMemo(() => {
//     if (!transactions || transactions.length === 0) {
//       return { totalAmount: 0, totalTransactions: 0, averageAmount: 0, uniqueUsers: 0 };
//     }

//     const totalAmount = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
//     const totalTransactions = transactions.length;
//     const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
//     const uniqueUsers = new Set(transactions.map(t => t.user_id)).size;

//     return { totalAmount, totalTransactions, averageAmount, uniqueUsers };
//   }, [transactions]);

//   // Handle filter changes
//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   // Apply filters
//   const applyFilters = () => {
//     fetchTransactions({ page: 1, limit: pagination.per_page, filters });
//     setShowFilters(false);
//   };

//   // Reset filters
//   const handleResetFilters = () => {
//     const resetFilters = {
//       reward_level: '',
//       username: '',
//       email: '',
//       date_from: '',
//       date_to: '',
//       amount_min: '',
//       amount_max: ''
//     };
//     setFilters(resetFilters);
//     fetchTransactions({ page: 1, limit: pagination.per_page, filters: resetFilters });
//   };

//   // Handle pagination
//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= pagination.last_page) {
//       setPagination(prev => ({ ...prev, current_page: page }));
//       fetchTransactions({ page, limit: pagination.per_page, filters });
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(amount || 0);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'N/A';
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const getPageNumbers = () => {
//     const delta = 2;
//     const pages = [];
//     const lastPage = pagination.last_page;
//     const current = pagination.current_page;
    
//     for (let i = 1; i <= lastPage; i++) {
//       if (i === 1 || i === lastPage || (i >= current - delta && i <= current + delta)) {
//         pages.push(i);
//       } else if (pages[pages.length - 1] !== '...') {
//         pages.push('...');
//       }
//     }
//     return pages;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative max-w-[1600px] mx-auto space-y-6">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
//               <Award className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
//                 Reward Transactions
//               </h1>
//               <p className="text-slate-400 text-sm mt-1">Monitor and manage all reward transactions</p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button 
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
//               <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
//             </button>
//             <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//             <button 
//               onClick={() => setShowFilters(!showFilters)}
//               className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
//             >
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           <StatsCard icon={DollarSign} title="Total Amount" value={formatCurrency(stats.totalAmount)} color="emerald" />
//           <StatsCard icon={Activity} title="Total Transactions" value={stats.totalTransactions.toLocaleString()} color="blue" />
//           <StatsCard icon={TrendingUp} title="Average Amount" value={formatCurrency(stats.averageAmount)} color="purple" />
//           <StatsCard icon={Users} title="Unique Users" value={stats.uniqueUsers.toLocaleString()} color="amber" />
//         </div>

//         {/* Filters Panel */}
//         {showFilters && (
//           <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden animate-in fade-in-up duration-300">
//             <div className="flex items-center justify-between p-5 border-b border-white/10">
//               <div className="flex items-center gap-2">
//                 <Filter className="w-5 h-5 text-[#F5C518]" />
//                 <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
//               </div>
//               <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
//                 <X className="w-5 h-5 text-slate-400" />
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-2">Reward Level</label>
//                 <select
//                   value={filters.reward_level}
//                   onChange={(e) => handleFilterChange('reward_level', e.target.value)}
//                   className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//                 >
//                   {REWARD_LEVEL_OPTIONS.map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
//                 <input
//                   type="text"
//                   value={filters.username}
//                   onChange={(e) => handleFilterChange('username', e.target.value)}
//                   placeholder="Search by username"
//                   className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
//                 <input
//                   type="email"
//                   value={filters.email}
//                   onChange={(e) => handleFilterChange('email', e.target.value)}
//                   placeholder="Search by email"
//                   className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-2">Date From</label>
//                 <input
//                   type="date"
//                   value={filters.date_from}
//                   onChange={(e) => handleFilterChange('date_from', e.target.value)}
//                   className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-2">Date To</label>
//                 <input
//                   type="date"
//                   value={filters.date_to}
//                   onChange={(e) => handleFilterChange('date_to', e.target.value)}
//                   className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-2">Min Amount</label>
//                 <input
//                   type="number"
//                   value={filters.amount_min}
//                   onChange={(e) => handleFilterChange('amount_min', e.target.value)}
//                   placeholder="0"
//                   className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-400 mb-2">Max Amount</label>
//                 <input
//                   type="number"
//                   value={filters.amount_max}
//                   onChange={(e) => handleFilterChange('amount_max', e.target.value)}
//                   placeholder="1000"
//                   className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 p-5 border-t border-white/10">
//               <button
//                 onClick={applyFilters}
//                 className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
//               >
//                 Apply Filters
//               </button>
//               <button
//                 onClick={handleResetFilters}
//                 className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300"
//               >
//                 Reset All
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Transactions Table */}
//         <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
//           <div className="p-5 border-b border-white/10">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Activity className="w-5 h-5 text-[#F5C518]" />
//                 <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
//                 <span className="px-2 py-0.5 text-xs rounded-full bg-[#F5C518]/20 text-[#F5C518]">
//                   {pagination.total} total
//                 </span>
//               </div>
//               <div className="text-sm text-slate-400">
//                 Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} results
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center py-16">
//               <div className="relative">
//                 <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center py-16">
//               <div className="text-center">
//                 <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
//                   <AlertCircle className="w-8 h-8 text-rose-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-white mb-2">Error Loading Data</h3>
//                 <p className="text-sm text-rose-400 mb-4">{error}</p>
//                 <button
//                   onClick={() => fetchTransactions({ page: 1, limit: pagination.per_page, filters })}
//                   className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           ) : transactions.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
//                 <Activity className="w-10 h-10 text-slate-500" />
//               </div>
//               <h3 className="text-lg font-semibold text-white mb-2">No transactions found</h3>
//               <p className="text-slate-400">There are no transactions matching your criteria.</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-white/10 border-b border-white/10">
//                     <tr>
//                       <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
//                       <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User Details</th>
//                       <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Reward Level</th>
//                       <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
//                       <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
//                       <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date Created</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-white/10">
//                     {transactions.map((transaction, idx) => (
//                       <tr key={transaction.id || idx} className="hover:bg-white/5 transition-all duration-300">
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className="text-sm font-mono text-[#F5C518]">#{transaction.id}</span>
//                         </td>
//                         <td className="px-5 py-3">
//                           <div>
//                             <div className="text-sm font-medium text-white">{transaction.username || 'N/A'}</div>
//                             <div className="text-sm text-slate-400">{transaction.email || 'N/A'}</div>
//                           </div>
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <LevelBadge level={transaction.reward_level} />
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className="text-sm font-bold text-emerald-400">{formatCurrency(transaction.amount)}</span>
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <StatusBadge status={transaction.status} />
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className="text-sm text-slate-400">{formatDate(transaction.createdAt)}</span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {pagination.last_page > 1 && (
//                 <div className="border-t border-white/10 px-5 py-4">
//                   <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                     <div className="text-sm text-slate-400">
//                       Page {pagination.current_page} of {pagination.last_page}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <button
//                         onClick={() => handlePageChange(pagination.current_page - 1)}
//                         disabled={pagination.current_page <= 1}
//                         className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
//                       >
//                         <ChevronLeft className="w-4 h-4 text-white" />
//                       </button>
                      
//                       {getPageNumbers().map((page, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => typeof page === 'number' && handlePageChange(page)}
//                           disabled={typeof page !== 'number'}
//                           className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                             page === pagination.current_page
//                               ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-white shadow-lg shadow-[#F5C518]/25'
//                               : typeof page === 'number'
//                               ? 'text-slate-400 hover:text-white hover:bg-white/10'
//                               : 'text-slate-500 cursor-default'
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       ))}
                      
//                       <button
//                         onClick={() => handlePageChange(pagination.current_page + 1)}
//                         disabled={pagination.current_page >= pagination.last_page}
//                         className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
//                       >
//                         <ChevronRight className="w-4 h-4 text-white" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RewardTransactions;



import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // ✅ axiosInstance import kiya
import { 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  RefreshCw,
  Award,
  Calendar,
  Wallet,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Transaction Status Options
const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' }
];

const REWARD_LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: '1', label: 'Level 1' },
  { value: '2', label: 'Level 2' },
  { value: '3', label: 'Level 3' },
  { value: '4', label: 'Level 4' },
  { value: '5', label: 'Level 5' }
];

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, color }) => {
  const colorSchemes = {
    blue: { gradient: "from-[#D4AF37] to-[#F5C518]", bg: "bg-[#F5C518]/10", text: "text-[#F5C518]", iconBg: "bg-[#F5C518]/20", border: "border-[#F5C518]/30" },
    emerald: { gradient: "from-emerald-600 to-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400", iconBg: "bg-emerald-500/20", border: "border-emerald-500/30" },
    purple: { gradient: "from-purple-600 to-purple-500", bg: "bg-purple-500/10", text: "text-purple-400", iconBg: "bg-purple-500/20", border: "border-purple-500/30" },
    amber: { gradient: "from-amber-600 to-amber-500", bg: "bg-amber-500/10", text: "text-amber-400", iconBg: "bg-amber-500/20", border: "border-amber-500/30" },
  };
  
  const scheme = colorSchemes[color] || colorSchemes.blue;
  
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border ${scheme.border} p-5 hover:scale-105 transition-all duration-300 group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
          <Icon className={`w-6 h-6 ${scheme.text}`} />
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { icon: CheckCircle, color: "emerald", text: "Completed" },
    pending: { icon: Clock, color: "amber", text: "Pending" },
    rejected: { icon: AlertCircle, color: "rose", text: "Rejected" },
  };
  
  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;
  const colors = {
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[config.color]}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

// Level Badge Component
const LevelBadge = ({ level }) => {
  const levelColors = {
    1: "from-[#D4AF37] to-[#F5C518]",
    2: "from-indigo-600 to-indigo-500",
    3: "from-purple-600 to-purple-500",
    4: "from-pink-600 to-pink-500",
    5: "from-rose-600 to-rose-500",
  };
  
  const gradient = levelColors[level] || levelColors[1];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${gradient} text-white shadow-lg`}>
      <Award className="w-3 h-3 mr-1" />
      Level {level}
    </span>
  );
};

const RewardTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    reward_level: '',
    username: '',
    email: '',
    date_from: '',
    date_to: '',
    amount_min: '',
    amount_max: ''
  });

  // ✅ API call function — axiosInstance use ho raha hai, BASE_URL nahi chahiye
  const fetchTransactions = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/tr/rewards`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...params.filters
        }
      });
      
      if (response.data && response.data.transactions) {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination || {
          total: response.data.transactions.length,
          per_page: 10,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: response.data.transactions.length
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions({ page: 1, limit: 10, filters });
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions({ page: 1, limit: pagination.per_page, filters });
  };

  // Calculate stats from transactions
  const stats = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalAmount: 0, totalTransactions: 0, averageAmount: 0, uniqueUsers: 0 };
    }

    const totalAmount = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
    const totalTransactions = transactions.length;
    const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
    const uniqueUsers = new Set(transactions.map(t => t.user_id)).size;

    return { totalAmount, totalTransactions, averageAmount, uniqueUsers };
  }, [transactions]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchTransactions({ page: 1, limit: pagination.per_page, filters });
    setShowFilters(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      reward_level: '',
      username: '',
      email: '',
      date_from: '',
      date_to: '',
      amount_min: '',
      amount_max: ''
    };
    setFilters(resetFilters);
    fetchTransactions({ page: 1, limit: pagination.per_page, filters: resetFilters });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: page }));
      fetchTransactions({ page, limit: pagination.per_page, filters });
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];
    const lastPage = pagination.last_page;
    const current = pagination.current_page;
    
    for (let i = 1; i <= lastPage; i++) {
      if (i === 1 || i === lastPage || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Reward Transactions
              </h1>
              <p className="text-slate-400 text-sm mt-1">Monitor and manage all reward transactions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard icon={DollarSign} title="Total Amount" value={formatCurrency(stats.totalAmount)} color="emerald" />
          <StatsCard icon={Activity} title="Total Transactions" value={stats.totalTransactions.toLocaleString()} color="blue" />
          <StatsCard icon={TrendingUp} title="Average Amount" value={formatCurrency(stats.averageAmount)} color="purple" />
          <StatsCard icon={Users} title="Unique Users" value={stats.uniqueUsers.toLocaleString()} color="amber" />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden animate-in fade-in-up duration-300">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#F5C518]" />
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
              </div>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Reward Level</label>
                <select
                  value={filters.reward_level}
                  onChange={(e) => handleFilterChange('reward_level', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                >
                  {REWARD_LEVEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
                <input
                  type="text"
                  value={filters.username}
                  onChange={(e) => handleFilterChange('username', e.target.value)}
                  placeholder="Search by username"
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder="Search by email"
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Date From</label>
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => handleFilterChange('date_from', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Date To</label>
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => handleFilterChange('date_to', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Min Amount</label>
                <input
                  type="number"
                  value={filters.amount_min}
                  onChange={(e) => handleFilterChange('amount_min', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Max Amount</label>
                <input
                  type="number"
                  value={filters.amount_max}
                  onChange={(e) => handleFilterChange('amount_max', e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-white/10">
              <button
                onClick={applyFilters}
                className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300"
              >
                Reset All
              </button>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#F5C518]" />
                <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#F5C518]/20 text-[#F5C518]">
                  {pagination.total} total
                </span>
              </div>
              <div className="text-sm text-slate-400">
                Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} results
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Error Loading Data</h3>
                <p className="text-sm text-rose-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchTransactions({ page: 1, limit: pagination.per_page, filters })}
                  className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Activity className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No transactions found</h3>
              <p className="text-slate-400">There are no transactions matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10 border-b border-white/10">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User Details</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Reward Level</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {transactions.map((transaction, idx) => (
                      <tr key={transaction.id || idx} className="hover:bg-white/5 transition-all duration-300">
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-[#F5C518]">#{transaction.id}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div>
                            <div className="text-sm font-medium text-white">{transaction.username || 'N/A'}</div>
                            <div className="text-sm text-slate-400">{transaction.email || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <LevelBadge level={transaction.reward_level} />
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-emerald-400">{formatCurrency(transaction.amount)}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <StatusBadge status={transaction.status} />
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-sm text-slate-400">{formatDate(transaction.createdAt)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-slate-400">
                      Page {pagination.current_page} of {pagination.last_page}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page <= 1}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-white" />
                      </button>
                      
                      {getPageNumbers().map((page, idx) => (
                        <button
                          key={idx}
                          onClick={() => typeof page === 'number' && handlePageChange(page)}
                          disabled={typeof page !== 'number'}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            page === pagination.current_page
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-white shadow-lg shadow-[#F5C518]/25'
                              : typeof page === 'number'
                              ? 'text-slate-400 hover:text-white hover:bg-white/10'
                              : 'text-slate-500 cursor-default'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page >= pagination.last_page}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardTransactions;