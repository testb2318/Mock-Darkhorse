// import React, { useState, useEffect } from "react";
// import {
//   Users,
//   TrendingUp,
//   Activity,
//   CreditCard,
//   PieChart,
//   ArrowUpRight,
//   RefreshCw,
//   Calendar,
//   Clock,
//   AlertCircle,
//   Shield,
//   Database,
//   UserPlus,
//   Wallet,
//   BarChart3,
//   ChevronRight,
//   LayoutDashboard,
//   Gift,
//   ArrowDownUp,
// } from "lucide-react";
// import api from "../../api/axiosInstance";

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await api.get('/admin/dashboard');

//         if (response.data && response.data.success) {
//           setData(response.data.data);
//         } else {
//           throw new Error(response.data?.message || 'No data received from API');
//         }
//       } catch (err) {
//         console.error('Fetch Error:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [refreshKey]);

//   const handleRefresh = () => {
//     setRefreshKey(prev => prev + 1);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatCompactNumber = (num) => {
//     if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
//     if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
//     return num.toString();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] flex items-center justify-center">
//         <div className="relative">
//           <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-3xl animate-ping"></div>
//           <div className="relative flex flex-col items-center gap-5 bg-[#0f1435]/80 backdrop-blur-2xl px-12 py-8 rounded-3xl border border-blue-500/30">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
//             </div>
//             <span className="text-xl font-semibold text-white">Loading Dashboard...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] flex items-center justify-center p-4">
//         <div className="max-w-md w-full">
//           <div className="bg-red-500/10 backdrop-blur-2xl p-10 rounded-3xl border border-red-500/30">
//             <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
//             <p className="text-red-300 text-2xl font-bold mb-3 text-center">Connection Error</p>
//             <p className="text-red-200/70 text-base mb-8 text-center">{error}</p>
//             <button 
//               onClick={handleRefresh}
//               className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-lg transition-all"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] flex items-center justify-center">
//         <div className="bg-yellow-500/10 backdrop-blur-2xl p-12 rounded-3xl border border-yellow-500/30">
//           <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
//           <p className="text-yellow-200 text-xl text-center">No data available</p>
//         </div>
//       </div>
//     );
//   }

//   const mainStats = [
//     { id: 1, title: "Total Users", value: formatCompactNumber(data.userStats?.totalUsers || 0), subtitle: `${data.userStats?.activeUsers || 0} active users`, icon: Users, trend: "+12%", color: "blue" },
//     { id: 2, title: "Total Deposits", value: `$${formatCompactNumber(data.financialStats?.totalDeposits?.total || 0)}`, subtitle: `${data.financialStats?.totalDeposits?.count || 0} transactions`, icon: CreditCard, trend: "+8%", color: "cyan" },
//     { id: 3, title: "Total Withdrawals", value: `$${formatCompactNumber(data.financialStats?.totalWithdrawals?.total || 0)}`, subtitle: `${data.financialStats?.totalWithdrawals?.count || 0} transactions`, icon: ArrowUpRight, trend: "+5%", color: "indigo" },
//     { id: 4, title: "ROI Distributed", value: `$${formatCompactNumber(data.financialStats?.totalROIDistributed?.total || 0)}`, subtitle: `${data.financialStats?.totalROIDistributed?.count || 0} distributions`, icon: TrendingUp, trend: "+15%", color: "sky" },
//   ];

//   const quickStats = [
//     { id: 1, title: "New Today", value: data.userStats?.newUsersToday || 0, icon: UserPlus, color: "emerald" },
//     { id: 2, title: "This Month", value: data.userStats?.newUsersThisMonth || 0, icon: Calendar, color: "blue" },
//     { id: 3, title: "Blocked Users", value: data.userStats?.blockedUsers || 0, icon: Shield, color: "rose" },
//     { id: 4, title: "Total Tables", value: data.systemHealth?.total_tables || 0, icon: Database, color: "purple" },
//   ];

//   const getColorScheme = (color) => {
//     const schemes = {
//       blue: { gradient: "from-blue-600 to-blue-500", text: "text-blue-400", dark: "from-blue-700 to-blue-600" },
//       cyan: { gradient: "from-cyan-600 to-cyan-500", text: "text-cyan-400", dark: "from-cyan-700 to-cyan-600" },
//       indigo: { gradient: "from-indigo-600 to-indigo-500", text: "text-indigo-400", dark: "from-indigo-700 to-indigo-600" },
//       sky: { gradient: "from-sky-600 to-sky-500", text: "text-sky-400", dark: "from-sky-700 to-sky-600" },
//       emerald: { gradient: "from-emerald-600 to-emerald-500", text: "text-emerald-400", dark: "from-emerald-700 to-emerald-600" },
//       rose: { gradient: "from-rose-600 to-rose-500", text: "text-rose-400", dark: "from-rose-700 to-rose-600" },
//       purple: { gradient: "from-purple-600 to-purple-500", text: "text-purple-400", dark: "from-purple-700 to-purple-600" },
//     };
//     return schemes[color] || schemes.blue;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27]">
//       {/* Animated Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
//         {/* <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div> */}
//       </div>

//       <div className="relative max-w-[1600px] mx-auto p-6 lg:p-8 space-y-6 lg:space-y-8">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30">
//                 <LayoutDashboard className="w-7 h-7 text-white" />
//               </div>
//               <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
//                 Admin Dashboard
//               </h1>
//             </div>
//             <p className="text-slate-400 text-sm lg:text-base pl-14">Real-time overview & analytics of your platform</p>
//           </div>
//           <button 
//             onClick={handleRefresh}
//             className="group flex items-center gap-2 px-5 py-2.5 bg-[#1a1f3e] hover:bg-[#22284a] border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
//           >
//             <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
//             <span>Refresh Data</span>
//           </button>
//         </div>

//         {/* Main Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {mainStats.map((stat, idx) => {
//             const Icon = stat.icon;
//             const colors = getColorScheme(stat.color);
//             return (
//               <div
//                 key={stat.id}
//                 className="group relative overflow-hidden rounded-2xl bg-[#0f1435]/80 backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
//               >
//                 <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />

//                 <div className="relative p-5 lg:p-6">
//                   <div className="flex items-center justify-between mb-3 lg:mb-4">
//                     <div className={`p-2.5 lg:p-3 rounded-xl bg-gradient-to-br ${colors.dark} shadow-xl transform transition-all duration-500 group-hover:scale-110`}>
//                       <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
//                     </div>
//                     <span className={`text-xs lg:text-sm font-bold ${colors.text} bg-white/10 px-2.5 py-1 rounded-full`}>
//                       {stat.trend}
//                     </span>
//                   </div>
//                   <h3 className="text-slate-300 text-xs lg:text-sm font-medium uppercase tracking-wider mb-1">{stat.title}</h3>
//                   <p className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-1">{stat.value}</p>
//                   <p className="text-slate-400 text-xs">{stat.subtitle}</p>
//                 </div>

//                 <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100`} />
//               </div>
//             );
//           })}
//         </div>

//         {/* Quick Stats + Financial Overview */}
//         <div className="grid grid-cols-12 gap-5 lg:gap-6">

//           {/* Quick Stats */}
//           <div className="lg:col-span-3 col-span-12 space-y-4  mt-4">
//             <div className="rounded-2xl bg-[#0f1435]/80 backdrop-blur-md border border-white/10 p-5 lg:p-6 shadow-xl">
//               <h3 className="text-white font-bold text-lg lg:text-xl mb-5 flex items-center gap-3">
//                 <div className="p-1.5 lg:p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
//                   <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//                 </div>
//                 Quick Insights
//               </h3>
//               <div className="space-y-4">
//                 {quickStats.map((stat) => {
//                   const Icon = stat.icon;
//                   const colors = getColorScheme(stat.color);
//                   return (
//                     <div 
//                       key={stat.id} 
//                       className="flex items-center justify-between p-3 rounded-xl bg-[#1a1f3e]/50 hover:bg-[#1a1f3e] transition-all duration-300 hover:scale-105 cursor-pointer"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className={`p-2 rounded-xl bg-gradient-to-br ${colors.dark} shadow-md`}>
//                           <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
//                         </div>
//                         <span className="text-slate-300 text-sm lg:text-base font-medium">{stat.title}</span>
//                       </div>
//                       <span className="text-white font-extrabold text-xl lg:text-2xl">{stat.value}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>


//           {/* Financial Overview */}
//           <div className="lg:col-span-9 col-span-12">
//             <div className="rounded-2xl bg-[#0f1435]/80 backdrop-blur-md border border-white/10 p-5 lg:p-6 shadow-xl">
//               <h2 className="text-white font-bold text-lg lg:text-xl mb-6 flex items-center gap-3">
//                 <div className="p-1.5 lg:p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
//                   <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//                 </div>
//                 Financial Overview
//               </h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//                 <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
//                   <CreditCard className="w-6 h-6 text-emerald-400 mb-3" />
//                   <p className="text-emerald-300 text-sm font-medium uppercase mb-1">Deposits</p>
//                   <p className="text-white font-bold text-xl">${formatCompactNumber(data.financialStats?.totalDeposits?.total || 0)}</p>
//                   <p className="text-slate-400 text-xs mt-1">{data.financialStats?.totalDeposits?.count || 0} txns</p>
//                 </div>
//                 <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
//                   <Clock className="w-6 h-6 text-amber-400 mb-3" />
//                   <p className="text-amber-300 text-sm font-medium uppercase mb-1">Pending Dep.</p>
//                   <p className="text-white font-bold text-xl">${formatCompactNumber(data.financialStats?.pendingDeposits?.total || 0)}</p>
//                   <p className="text-slate-400 text-xs mt-1">{data.financialStats?.pendingDeposits?.count || 0} pending</p>
//                 </div>
//                 <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
//                   <ArrowDownUp className="w-6 h-6 text-rose-400 mb-3" />
//                   <p className="text-rose-300 text-sm font-medium uppercase mb-1">Withdrawals</p>
//                   <p className="text-white font-bold text-xl">${formatCompactNumber(data.financialStats?.totalWithdrawals?.total || 0)}</p>
//                   <p className="text-slate-400 text-xs mt-1">{data.financialStats?.totalWithdrawals?.count || 0} txns</p>
//                 </div>
//                 <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
//                   <Clock className="w-6 h-6 text-orange-400 mb-3" />
//                   <p className="text-orange-300 text-sm font-medium uppercase mb-1">Pending With.</p>
//                   <p className="text-white font-bold text-xl">${formatCompactNumber(data.financialStats?.pendingWithdrawals?.total || 0)}</p>
//                   <p className="text-slate-400 text-xs mt-1">{data.financialStats?.pendingWithdrawals?.count || 0} pending</p>
//                 </div>
//                 <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
//                   <Gift className="w-6 h-6 text-blue-400 mb-3" />
//                   <p className="text-blue-300 text-sm font-medium uppercase mb-1">ROI Dist.</p>
//                   <p className="text-white font-bold text-xl">${formatCompactNumber(data.financialStats?.totalROIDistributed?.total || 0)}</p>
//                   <p className="text-slate-400 text-xs mt-1">{data.financialStats?.totalROIDistributed?.count || 0} dist</p>
//                 </div>
//               </div>
//             </div>




//         {/* Plan Distribution */}
//         <div className="rounded-2xl bg-[#0f1435]/80 backdrop-blur-md border border-white/10 p-5 lg:p-6 shadow-xl">
//           <h2 className="text-white font-bold text-lg lg:text-xl mb-6 flex items-center gap-3">
//             <div className="p-1.5 lg:p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
//               <PieChart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//             </div>
//             Plan Distribution
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//             {data.planStats?.map((plan, index) => {
//               const colors = [
//                 { gradient: "from-blue-600 to-indigo-600", bar: "bg-blue-500" },
//                 { gradient: "from-violet-600 to-purple-600", bar: "bg-violet-500" },
//                 { gradient: "from-emerald-600 to-teal-600", bar: "bg-emerald-500" },
//                 { gradient: "from-amber-600 to-orange-600", bar: "bg-amber-500" },
//                 { gradient: "from-rose-600 to-pink-600", bar: "bg-rose-500" },
//               ];
//               const color = colors[index % colors.length];
//               const percentage = data.userStats?.totalUsers ? ((plan.users || 0) / data.userStats.totalUsers * 100).toFixed(0) : 0;
//               return (
//                 <div key={plan.name || index} className="rounded-xl bg-[#1a1f3e]/50 border border-white/10 p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
//                   <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${color.gradient} mb-3`} />
//                   <h3 className="text-white font-bold text-base mb-2 truncate">{plan.name || 'Unknown'}</h3>
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-white font-extrabold text-2xl">{plan.users || 0}</span>
//                     <span className="text-slate-400 text-xs">users</span>
//                     <span className="text-slate-400 text-xs ml-auto font-semibold">{percentage}%</span>
//                   </div>
//                   <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
//                     <div className={`h-1.5 rounded-full ${color.bar} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//           </div>



//         </div>







//         {/* Today's Activity */}
//         <div className="rounded-2xl bg-[#0f1435]/80 backdrop-blur-md border border-white/10 p-5 lg:p-6 shadow-xl">
//           <h2 className="text-white font-bold text-lg lg:text-xl mb-6 flex items-center gap-3">
//             <div className="p-1.5 lg:p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
//               <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//             </div>
//             Today's Activity
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//             {data.transactionStats?.todayTransactions?.map((transaction, index) => {
//               const gradients = [
//                 { gradient: "from-sky-600 to-blue-600", text: "text-sky-300" },
//                 { gradient: "from-emerald-600 to-teal-600", text: "text-emerald-300" },
//                 { gradient: "from-violet-600 to-purple-600", text: "text-violet-300" }
//               ];
//               const style = gradients[index % gradients.length];
//               return (
//                 <div key={index} className="rounded-xl bg-[#1a1f3e]/50 border border-white/10 p-5 hover:scale-105 transition-all duration-500 cursor-pointer">
//                   <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${style.gradient} mb-4`}>
//                     <span className="text-white text-sm font-bold uppercase">{transaction.type || 'N/A'}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Count</p>
//                       <p className="text-4xl font-extrabold text-white">{transaction.count || 0}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Amount</p>
//                       <p className={`text-3xl font-bold ${style.text}`}>${formatCompactNumber(transaction.amount || 0)}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>


//         {/* Top Transactions Table */}
//         <div className="rounded-2xl bg-[#0f1435]/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-xl">
//           <div className="p-5 border-b border-white/10">
//             <h2 className="text-white font-bold text-xl flex items-center gap-3">
//               <Activity className="w-6 h-6 text-blue-400" />
//               Top Transactions
//             </h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-[#1a1f3e]">
//                 <tr>
//                   <th className="text-left py-4 px-5 text-slate-300 font-semibold text-sm uppercase">Type</th>
//                   <th className="text-left py-4 px-5 text-slate-300 font-semibold text-sm uppercase">Username</th>
//                   <th className="text-left py-4 px-5 text-slate-300 font-semibold text-sm uppercase">Amount</th>
//                   <th className="text-left py-4 px-5 text-slate-300 font-semibold text-sm uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.transactionStats?.topTransactions?.slice(0, 5).map((transaction, index) => (
//                   <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-all">
//                     <td className="py-4 px-5">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium capitalize">
//                         {transaction.type || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="py-4 px-5">
//                       <span className="text-white font-semibold">{transaction.username || 'Unknown'}</span>
//                     </td>
//                     <td className="py-4 px-5">
//                       <span className="text-emerald-400 font-bold text-xl">${formatCompactNumber(transaction.amount || 0)}</span>
//                     </td>
//                     <td className="py-4 px-5">
//                       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold">
//                         <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
//                         {transaction.status || 'N/A'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="p-4 border-t border-white/10 text-center">
//             <button className="text-blue-400 text-base font-medium flex items-center justify-center gap-2 hover:gap-3 transition-all">
//               View All Transactions <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Recent Users */}
//         <div className="rounded-2xl bg-[#0f1435]/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-xl">
//           <div className="p-5 border-b border-white/10">
//             <h2 className="text-white font-bold text-xl flex items-center gap-3">
//               <UserPlus className="w-6 h-6 text-blue-400" />
//               Recent User Registrations
//             </h2>
//           </div>
//           <div className="divide-y divide-white/10">
//             {data.recentActivity?.slice(0, 5).map((activity, index) => (
//               <div key={index} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
//                   <span className="text-white font-bold text-base">{activity.username?.substring(0, 2).toUpperCase() || 'U'}</span>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-white font-bold truncate">{activity.username || 'Unknown'}</p>
//                   <p className="text-slate-400 text-sm truncate">{activity.email || 'N/A'}</p>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <p className="text-slate-400 text-sm">{formatDate(activity.created_at)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="p-4 border-t border-white/10 text-center">
//             <button className="text-blue-400 text-base font-medium flex items-center justify-center gap-2 hover:gap-3 transition-all">
//               View All Users <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Activity,
  CreditCard,
  PieChart,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  Clock,
  AlertCircle,
  Shield,
  Database,
  UserPlus,
  Wallet,
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  Gift,
  ArrowDownUp,
} from "lucide-react";
import api from "../../api/axiosInstance";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/admin/dashboard");
        if (response.data && response.data.success) {
          setData(response.data.data);
        } else {
          throw new Error(response.data?.message || "No data received from API");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const formatCompactNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() ?? "0";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070c10" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: "#F5C518", animation: "spin 1s linear infinite" }} />
            <div className="absolute inset-2 rounded-full border-2 border-transparent" style={{ borderTopColor: "#D4AF37", animation: "spin 1.5s linear infinite reverse" }} />
          </div>
          <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#4a7a8a" }}>Loading Dashboard</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#070c10" }}>
        <div className="max-w-md w-full rounded-2xl p-8 text-center" style={{ background: "#0a0f14", border: "1px solid rgba(229,115,115,0.2)" }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#e57373" }} />
          <p className="text-white font-bold text-xl mb-2">Connection Error</p>
          <p className="text-sm mb-6" style={{ color: "#4a7a8a" }}>{error}</p>
          <button onClick={handleRefresh} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: "rgba(229,115,115,0.15)", border: "1px solid rgba(229,115,115,0.3)" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070c10" }}>
        <p style={{ color: "#4a7a8a" }}>No data available</p>
      </div>
    );
  }

  const mainStats = [
    { title: "Total Users", value: formatCompactNumber(data.userStats?.totalUsers || 0), subtitle: `${data.userStats?.activeUsers || 0} active`, icon: Users, accent: "#D4AF37" },
    { title: "Total Deposits", value: `$${formatCompactNumber(data.financialStats?.totalDeposits?.total || 0)}`, subtitle: `${data.financialStats?.totalDeposits?.count || 0} transactions`, icon: CreditCard, accent: "#F5C518" },
    { title: "Total Withdrawals", value: `$${formatCompactNumber(data.financialStats?.totalWithdrawals?.total || 0)}`, subtitle: `${data.financialStats?.totalWithdrawals?.count || 0} transactions`, icon: ArrowUpRight, accent: "#D4AF37" },
    { title: "ROI Distributed", value: `$${formatCompactNumber(data.financialStats?.totalROIDistributed?.total || 0)}`, subtitle: `${data.financialStats?.totalROIDistributed?.count || 0} distributions`, icon: TrendingUp, accent: "#F5C518" },
  ];

  const quickStats = [
    { title: "New Today", value: data.userStats?.newUsersToday || 0, icon: UserPlus, accent: "#D4AF37" },
    { title: "This Month", value: data.userStats?.newUsersThisMonth || 0, icon: Calendar, accent: "#F5C518" },
    { title: "Blocked Users", value: data.userStats?.blockedUsers || 0, icon: Shield, accent: "#e57373" },
    { title: "Total Tables", value: data.systemHealth?.total_tables || 0, icon: Database, accent: "#c9a227" },
  ];

  const financialCards = [
    { label: "Deposits", value: data.financialStats?.totalDeposits?.total || 0, count: data.financialStats?.totalDeposits?.count || 0, icon: CreditCard, accent: "#D4AF37" },
    { label: "Pending Dep.", value: data.financialStats?.pendingDeposits?.total || 0, count: data.financialStats?.pendingDeposits?.count || 0, icon: Clock, accent: "#F5C518" },
    { label: "Withdrawals", value: data.financialStats?.totalWithdrawals?.total || 0, count: data.financialStats?.totalWithdrawals?.count || 0, icon: ArrowDownUp, accent: "#e57373" },
    { label: "Pending With.", value: data.financialStats?.pendingWithdrawals?.total || 0, count: data.financialStats?.pendingWithdrawals?.count || 0, icon: Clock, accent: "#f0d060" },
    { label: "ROI Dist.", value: data.financialStats?.totalROIDistributed?.total || 0, count: data.financialStats?.totalROIDistributed?.count || 0, icon: Gift, accent: "#c9a227" },
  ];

  const planColors = ["#D4AF37", "#F5C518", "#c9a227", "#f0d060", "#e57373"];
  const activityColors = ["#D4AF37", "#F5C518", "#c9a227"];

  return (
    <div className="min-h-screen" style={{ background: "#070c10" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .dash-card { animation: fadeUp 0.4s ease both; }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .row-hover:hover { background: rgba(212,175,55,0.04) !important; }
      `}</style>

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ── Header ── */}
        <div className="dash-card flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ animationDelay: "0ms" }}>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF3722, #F5C51822)", border: "1px solid rgba(212,175,55,0.3)" }}>
                <LayoutDashboard className="w-5 h-5" style={{ color: "#D4AF37" }} />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: "#D4AF37", animation: "shimmer 2s ease infinite" }} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: "#ffffff" }}>
                Admin <span style={{ color: "#F5C518" }}>Dashboard</span>
              </h1>
              <p className="text-xs tracking-wider uppercase mt-0.5" style={{ color: "#4a7a8a" }}>Real-time platform overview</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", color: "#D4AF37" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.12)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.06)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)"; }}
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            Refresh
          </button>
        </div>

        {/* ── Main Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainStats.map((stat, i) => {
            const Icon = stat.icon;
            const isTeal = stat.accent === "#D4AF37";
            return (
              <div
                key={i}
                className="stat-card dash-card relative rounded-2xl p-5 overflow-hidden"
                style={{
                  animationDelay: `${i * 60}ms`,
                  background: "#0a0f14",
                  border: `1px solid ${isTeal ? "rgba(212,175,55,0.15)" : "rgba(245,197,24,0.15)"}`,
                }}
              >
                {/* corner glow */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full" style={{ background: `${stat.accent}18`, filter: "blur(20px)" }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${stat.accent}18`, border: `1px solid ${stat.accent}33` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.accent }} />
                    </div>
                    <div className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${stat.accent}18`, color: stat.accent }}>
                      +12%
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#4a7a8a" }}>{stat.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold tracking-tight mb-1" style={{ color: "#ffffff" }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: "#4a7a8a" }}>{stat.subtitle}</p>
                </div>
                {/* bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}66, transparent)` }} />
              </div>
            );
          })}
        </div>

        {/* ── Quick Stats + Financial Overview ── */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">

          {/* Quick Stats */}
          <div className="col-span-12 lg:col-span-3 dash-card" style={{ animationDelay: "280ms" }}>
            <div className="rounded-2xl h-full" style={{ background: "#0a0f14", border: "1px solid rgba(212,175,55,0.1)" }}>
              <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <BarChart3 className="w-4 h-4" style={{ color: "#D4AF37" }} />
                </div>
                <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Quick Insights</h3>
              </div>
              <div className="p-4 space-y-2">
                {quickStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="flex items-center justify-between px-3 py-3 rounded-xl transition-all cursor-pointer" style={{ background: "rgba(255,255,255,0.02)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = `${stat.accent}0d`}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${stat.accent}18` }}>
                          <Icon className="w-4 h-4" style={{ color: stat.accent }} />
                        </div>
                        <span className="text-sm" style={{ color: "#aaaaaa" }}>{stat.title}</span>
                      </div>
                      <span className="font-bold text-lg" style={{ color: "#ffffff" }}>{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Financial Overview + Plan Distribution */}
          <div className="col-span-12 lg:col-span-9 space-y-4">

            {/* Financial Cards */}
            <div className="dash-card rounded-2xl" style={{ animationDelay: "320ms", background: "#0a0f14", border: "1px solid rgba(245,197,24,0.1)" }}>
              <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)" }}>
                  <Wallet className="w-4 h-4" style={{ color: "#F5C518" }} />
                </div>
                <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Financial Overview</h3>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {financialCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="stat-card rounded-xl p-3.5 cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${card.accent}22` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${card.accent}0a`; e.currentTarget.style.borderColor = `${card.accent}44`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = `${card.accent}22`; }}
                    >
                      <Icon className="w-5 h-5 mb-3" style={{ color: card.accent }} />
                      <p className="text-[11px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: "#4a7a8a" }}>{card.label}</p>
                      <p className="font-bold text-lg leading-none mb-1" style={{ color: "#ffffff" }}>${formatCompactNumber(card.value)}</p>
                      <p className="text-[11px]" style={{ color: "#4a7a8a" }}>{card.count} txns</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="dash-card rounded-2xl" style={{ animationDelay: "360ms", background: "#0a0f14", border: "1px solid rgba(201,162,39,0.1)" }}>
              <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}>
                  <PieChart className="w-4 h-4" style={{ color: "#c9a227" }} />
                </div>
                <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Plan Distribution</h3>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {data.planStats?.map((plan, i) => {
                  const accent = planColors[i % planColors.length];
                  const pct = data.userStats?.totalUsers ? ((plan.users || 0) / data.userStats.totalUsers * 100).toFixed(0) : 0;
                  return (
                    <div key={i} className="stat-card rounded-xl p-3.5 cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}22` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}0a`; e.currentTarget.style.borderColor = `${accent}44`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = `${accent}22`; }}
                    >
                      <div className="h-[3px] w-10 rounded-full mb-3" style={{ background: accent }} />
                      <p className="text-sm font-semibold truncate mb-2" style={{ color: "#ffffff" }}>{plan.name || "Unknown"}</p>
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-xl font-bold" style={{ color: "#ffffff" }}>{plan.users || 0}</span>
                        <span className="text-[11px]" style={{ color: "#4a7a8a" }}>users</span>
                        <span className="text-[11px] ml-auto font-semibold" style={{ color: accent }}>{pct}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-1 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: accent }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── Today's Activity ── */}
        <div className="dash-card rounded-2xl" style={{ animationDelay: "400ms", background: "#0a0f14", border: "1px solid rgba(212,175,55,0.1)" }}>
          <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <Activity className="w-4 h-4" style={{ color: "#D4AF37" }} />
            </div>
            <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Today's Activity</h3>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.transactionStats?.todayTransactions?.map((tx, i) => {
              const accent = activityColors[i % activityColors.length];
              return (
                <div key={i} className="stat-card rounded-xl p-5 cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}22` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}0a`; e.currentTarget.style.borderColor = `${accent}44`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = `${accent}22`; }}
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: `${accent}18`, border: `1px solid ${accent}33` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{tx.type || "N/A"}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "#4a7a8a" }}>Count</p>
                      <p className="text-3xl font-bold" style={{ color: "#ffffff" }}>{tx.count || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "#4a7a8a" }}>Amount</p>
                      <p className="text-2xl font-bold" style={{ color: accent }}>${formatCompactNumber(tx.amount || 0)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Top Transactions Table ── */}
        {/* <div className="dash-card rounded-2xl overflow-hidden" style={{ animationDelay: "440ms", background: "#0a0f14", border: "1px solid rgba(245,197,24,0.1)" }}>
          <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)" }}>
              <Activity className="w-4 h-4" style={{ color: "#F5C518" }} />
            </div>
            <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Top Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Type", "Username", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#4a7a8a" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.transactionStats?.topTransactions?.slice(0, 5).map((tx, i) => (
                  <tr key={i} className="row-hover transition-all" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)" }}>
                        {tx.type || "N/A"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
                          {tx.username?.substring(0, 1).toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#cccccc" }}>{tx.username || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-base" style={{ color: "#F5C518" }}>${formatCompactNumber(tx.amount || 0)}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(245,197,24,0.08)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.2)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5C518", animation: "shimmer 2s ease infinite" }} />
                        {tx.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button className="flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2.5" style={{ color: "#D4AF37" }}>
              View All Transactions <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div> */}







        <div className="dash-card rounded-2xl overflow-hidden" style={{ animationDelay: "440ms", background: "#0a0f14", border: "1px solid rgba(245,197,24,0.1)" }}>
  <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)" }}>
      <Activity className="w-4 h-4" style={{ color: "#F5C518" }} />
    </div>
    <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Top Transactions</h3>
  </div>
  
  <div className="overflow-x-auto">
    <table className="w-full border-collapse block">
      <thead className="block w-full">
        <tr className="flex w-full" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {["Type", "Username", "Amount", "Status"].map((h) => (
            <th key={h} className="text-left py-3 px-5 text-[11px] font-semibold uppercase tracking-widest flex-1" style={{ color: "#4a7a8a" }}>{h}</th>
          ))}
        </tr>
      </thead>


      
      <tbody className="block max-h-[114px] overflow-y-auto w-full custom-scrollbar">
        {data.transactionStats?.topTransactions?.map((tx, i) => (
          <tr key={i} className="row-hover transition-all flex w-full" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <td className="py-3.5 px-5 flex-1 flex items-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium capitalize" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)" }}>
                {tx.type || "N/A"}
              </span>
            </td>
            <td className="py-3.5 px-5 flex-1 flex items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
                  {tx.username?.substring(0, 1).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium" style={{ color: "#cccccc" }}>{tx.username || "Unknown"}</span>
              </div>
            </td>
            <td className="py-3.5 px-5 flex-1 flex items-center">
              <span className="font-bold text-base" style={{ color: "#F5C518" }}>${formatCompactNumber(tx.amount || 0)}</span>
            </td>
            <td className="py-3.5 px-5 flex-1 flex items-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(245,197,24,0.08)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.2)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5C518", animation: "shimmer 2s ease infinite" }} />
                {tx.status || "N/A"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
    <button className="flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2.5" style={{ color: "#D4AF37" }}>
      View All Transactions <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>

        {/* ── Recent Users ── */}
        {/* <div className="dash-card rounded-2xl overflow-hidden" style={{ animationDelay: "480ms", background: "#0a0f14", border: "1px solid rgba(201,162,39,0.1)" }}>
          <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}>
              <UserPlus className="w-4 h-4" style={{ color: "#c9a227" }} />
            </div>
            <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Recent Registrations</h3>
          </div>
          <div>
            {data.recentActivity?.slice(0, 5).map((activity, i) => (
              <div key={i} className="row-hover flex items-center gap-4 px-5 py-3.5 transition-all cursor-pointer" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(201,162,39,0.2))", border: "1px solid rgba(212,175,55,0.2)", color: "#D4AF37" }}>
                  {activity.username?.substring(0, 2).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{activity.username || "Unknown"}</p>
                  <p className="text-xs truncate" style={{ color: "#4a7a8a" }}>{activity.email || "N/A"}</p>
                </div>
                <p className="text-xs flex-shrink-0" style={{ color: "#4a7a8a" }}>{formatDate(activity.created_at)}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button className="flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2.5" style={{ color: "#c9a227" }}>
              View All Users <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div> */}



        <div className="dash-card rounded-2xl overflow-hidden" style={{ animationDelay: "480ms", background: "#0a0f14", border: "1px solid rgba(201,162,39,0.1)" }}>
  <div className="flex items-center gap-3 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}>
      <UserPlus className="w-4 h-4" style={{ color: "#c9a227" }} />
    </div>
    <h3 className="font-semibold text-sm tracking-wide" style={{ color: "#ffffff" }}>Recent Registrations</h3>
  </div>



  <div className="overflow-y-auto max-h-[195px] custom-scrollbar">
    {data.recentActivity?.map((activity, i) => (
      <div key={i} className="row-hover flex items-center gap-4 px-5 py-3.5 transition-all cursor-pointer" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(201,162,39,0.2))", border: "1px solid rgba(212,175,55,0.2)", color: "#D4AF37" }}>
          {activity.username?.substring(0, 2).toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{activity.username || "Unknown"}</p>
          <p className="text-xs truncate" style={{ color: "#4a7a8a" }}>{activity.email || "N/A"}</p>
        </div>
        <p className="text-xs flex-shrink-0" style={{ color: "#4a7a8a" }}>{formatDate(activity.created_at)}</p>
      </div>
    ))}
  </div>

  <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
    <button className="flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2.5" style={{ color: "#c9a227" }}>
      View All Users <ChevronRight className="w-4 h-4" />
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;