import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { getAllUplineTransactions } from "../../redux/withdrawalSlice";
import { Search, Filter, RefreshCw, DollarSign, Award, Activity } from "lucide-react";
import AdminPagination from "../../components/common/AdminPagination";

export default function AdminUplineTransactions() {
  const dispatch = useDispatch();
  const { allUplineTransactions, loading: uplineLoading } = useSelector(
    (state) => state.allwithdrawal
  );

  const [uplinePage, setUplinePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const entriesPerPage = 30;

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const fetchData = async () => {
    setRefreshing(true);
    await dispatch(getAllUplineTransactions());
    setTimeout(() => setRefreshing(false), 500);
  };

  // Filter + Search
  const filteredTransactions = useMemo(() => {
    let data = allUplineTransactions || [];
    if (filterType) {
      data = data.filter((item) => item.type === filterType);
    }
    if (searchQuery) {
      data = data.filter(
        (item) =>
          item.from_user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.to_user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.withdrawal_id?.toString().includes(searchQuery)
      );
    }
    return data;
  }, [allUplineTransactions, filterType, searchQuery]);

  const totalUplineIncome = useMemo(
    () => filteredTransactions.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0),
    [filteredTransactions]
  );

  const bonus3Count = useMemo(
    () => (allUplineTransactions || []).filter((i) => i.type === "leadership_bonus_3percent").length,
    [allUplineTransactions]
  );

  const bonus2Count = useMemo(
    () => (allUplineTransactions || []).filter((i) => i.type !== "leadership_bonus_3percent").length,
    [allUplineTransactions]
  );

  const uplineTotalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / entriesPerPage)
  );

  const currentUplineTransactions = useMemo(
    () => filteredTransactions.slice((uplinePage - 1) * entriesPerPage, uplinePage * entriesPerPage),
    [filteredTransactions, uplinePage, entriesPerPage]
  );

  const handlePageChange = (direction) => {
    if (direction === 'prev') setUplinePage((p) => Math.max(1, p - 1));
    if (direction === 'next') setUplinePage((p) => Math.min(uplineTotalPages, p + 1));
  };

  const handleClearFilters = () => {
    setFilterType("");
    setSearchQuery("");
    setUplinePage(1);
  };

  const formatCurrency = (v) =>
    v ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v) : "$0.00";

  const formatDate = (ds) => {
    if (!ds) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    }).format(new Date(ds));
  };

  const getTypeColor = (type) => {
    if (type === "leadership_bonus_3percent") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-[#F5C518]/20 text-[#F5C518] border-[#F5C518]/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg shadow-amber-500/30">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-amber-100 to-orange-300 bg-clip-text text-transparent">
                All Leadership Bonuses
              </h1>
              <p className="text-slate-400 text-sm mt-1">Admin — All Users Upline Income</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in-up duration-500 delay-100">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#F5C518] opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Records</p>
              <p className="text-2xl font-bold text-white">{allUplineTransactions?.length || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Total leadership bonuses</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-[#F5C518]/20">
              <Activity className="w-6 h-6 text-[#F5C518]" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Distributed</p>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalUplineIncome)}</p>
              <p className="text-xs text-slate-500 mt-1">Total amount distributed</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-emerald-500/20">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">3% Bonuses</p>
              <p className="text-2xl font-bold text-amber-400">{bonus3Count}</p>
              <p className="text-xs text-slate-500 mt-1">Number of 3% distributions</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-amber-500/20">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">2% Bonuses</p>
              <p className="text-2xl font-bold text-[#F5C518]">{bonus2Count}</p>
              <p className="text-xs text-slate-500 mt-1">Number of 2% distributions</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-[#F5C518]/20">
              <Award className="w-6 h-6 text-[#F5C518]" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden animate-in fade-in-up duration-500 delay-200">
          
          {/* Filters */}
          <div className="p-5 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-400" />
                <h2 className="text-white font-semibold text-lg">Transactions</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                  {filteredTransactions.length} records
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setUplinePage(1); }}
                    className="pl-9 pr-8 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0a0a0a] text-white">All Types</option>
                    <option value="leadership_bonus_3percent" className="bg-[#0a0a0a] text-amber-400">3% Bonus</option>
                    <option value="leadership_bonus_2percent" className="bg-[#0a0a0a] text-[#F5C518]">2% Bonus</option>
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setUplinePage(1); }}
                    type="text"
                    placeholder="Search by email or ID..."
                    className="pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-full sm:w-64"
                  />
                </div>
                {(filterType || searchQuery) && (
                  <button onClick={handleClearFilters} className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scroll">
            {uplineLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-400">Loading data...</span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Activity className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-400 text-lg">No transactions found</p>
                {(searchQuery || filterType) && (
                  <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">From User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">To User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Withdrawal ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Percent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentUplineTransactions.map((item, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-all duration-300 group animate-in fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-slate-400 font-mono">{(uplinePage - 1) * entriesPerPage + index + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-white">{item.from_user_email || `User #${item.from_user_id}`}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-[#F5C518]">{item.to_user_email || `User #${item.to_user_id}`}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-slate-400">#{item.withdrawal_id}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-emerald-400">+{formatCurrency(item.amount)}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-[#F5C518]">{item.percent}%</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${getTypeColor(item.type)}`}>
                          {item.type === "leadership_bonus_3percent" ? "3% Bonus" : "2% Bonus"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {!uplineLoading && filteredTransactions.length > 0 && (
            <div className="px-5 pb-4">
              <AdminPagination currentPage={uplinePage} totalPages={uplineTotalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Loader from "../../components/common/Loader";
// import { getAllUplineTransactions } from "../../redux/withdrawalSlice";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.08, delayChildren: 0.15 },
//   },
// };

// const itemVariants = {
//   hidden: { y: 24, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: { type: "spring", stiffness: 120, damping: 16 },
//   },
// };

// function StatCard({ label, value, accent }) {
//   const accentMap = {
//     gold: "from-amber-500 to-orange-500",
//     teal: "from-[#F5C518] to-[#F5C518]",
//     slate: "from-slate-500 to-slate-600",
//     rose: "from-rose-500 to-rose-600",
//   };

//   return (
//     <motion.div
//       variants={itemVariants}
//       whileHover={{ y: -6, scale: 1.02 }}
//       className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden group transition-all duration-300 hover:border-amber-500/50"
//     >
//       <div className={`absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b ${accentMap[accent] || accentMap.gold} rounded-l-2xl`} />
//       <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-500" />
//       <p className="text-[9px] font-black tracking-[3px] uppercase text-slate-500 mb-2">{label}</p>
//       <h3 className="font-['Orbitron',sans-serif] text-2xl font-black text-white tracking-tight">{value}</h3>
//     </motion.div>
//   );
// }

// export default function AdminUplineTransactions() {
//   const dispatch = useDispatch();
//   const { allUplineTransactions, loading: uplineLoading } = useSelector(
//     (state) => state.allwithdrawal
//   );

//   const [uplinePage, setUplinePage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const entriesPerPage = 30;

//   useEffect(() => {
//     dispatch(getAllUplineTransactions());
//   }, [dispatch]);

//   // ✅ Filter + Search
//   const filteredTransactions = useMemo(() => {
//     let data = allUplineTransactions || [];
//     if (filterType) {
//       data = data.filter((item) => item.type === filterType);
//     }
//     if (searchQuery) {
//       data = data.filter(
//         (item) =>
//           item.from_user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.to_user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.withdrawal_id?.toString().includes(searchQuery)
//       );
//     }
//     return data;
//   }, [allUplineTransactions, filterType, searchQuery]);

//   const totalUplineIncome = useMemo(
//     () => filteredTransactions.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0),
//     [filteredTransactions]
//   );

//   const bonus3Count = useMemo(
//     () => (allUplineTransactions || []).filter((i) => i.type === "leadership_bonus_3percent").length,
//     [allUplineTransactions]
//   );

//   const bonus2Count = useMemo(
//     () => (allUplineTransactions || []).filter((i) => i.type !== "leadership_bonus_3percent").length,
//     [allUplineTransactions]
//   );

//   const uplineTotalPages = Math.max(
//     1,
//     Math.ceil(filteredTransactions.length / entriesPerPage)
//   );

//   const currentUplineTransactions = useMemo(
//     () => filteredTransactions.slice((uplinePage - 1) * entriesPerPage, uplinePage * entriesPerPage),
//     [filteredTransactions, uplinePage, entriesPerPage]
//   );

//   const formatCurrency = (v) =>
//     v ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v) : "$0.00";

//   const formatDate = (ds) =>
//     ds
//       ? new Intl.DateTimeFormat("en-US", {
//         year: "numeric", month: "short", day: "numeric",
//       }).format(new Date(ds))
//       : "";

//   const UPLINE_HEADERS = ["Ref", "From User", "To User", "Withdrawal ID", "Amount", "Percent", "Type", "Date"];

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] text-slate-200 p-4 lg:p-8 m-4 overflow-hidden font-['Rajdhani',sans-serif]">

//       {/* Background Blobs */}
//       <div className="pointer-events-none absolute inset-0 z-0">
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], x: [-40, 40, -40], y: [0, 80, 0] }}
//           transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[140px]"
//         />
//         <motion.div
//           animate={{ scale: [1.2, 1, 1.2], x: [40, -40, 40], y: [0, -80, 0] }}
//           transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#D4AF37]/10 blur-[120px]"
//         />
//       </div>

//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="relative z-10 max-w-7xl mx-auto"
//       >

//         {/* Header */}
//         <motion.div
//           variants={itemVariants}
//           className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
//         >
//           <div className="flex items-center gap-4">
//             <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
//               <div className="absolute inset-0 rounded-full border-2 border-amber-500" />
//               <div className="absolute -inset-[6px] rounded-full border border-amber-500/50" />
//               <span className="font-['Orbitron',sans-serif] text-xl font-black text-amber-500 leading-none">AD</span>
//             </div>
//             <div>
//               <h1 className="font-['Orbitron',sans-serif] text-3xl lg:text-4xl font-black text-white tracking-wider uppercase">
//                 All Leadership <span className="text-amber-500">Bonuses</span>
//               </h1>
//               <div className="flex items-center gap-2 mt-1">
//                 <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//                 <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">
//                   Admin — All Users Upline Income
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Stat Cards */}
//         <motion.div
//           variants={itemVariants}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
//         >
//           <StatCard label="Total Records" value={allUplineTransactions?.length || 0} accent="gold" />
//           <StatCard label="Total Distributed" value={formatCurrency(totalUplineIncome)} accent="teal" />
//           <StatCard label="3% Bonuses" value={bonus3Count} accent="slate" />
//           <StatCard label="2% Bonuses" value={bonus2Count} accent="rose" />
//         </motion.div>

//         {/* Filters */}
//         <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-6">
//           {/* Search */}
//           <div className="relative flex-1 group">
//             <input
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setUplinePage(1); }}
//               className="w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-12 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500 transition-all duration-200 font-['Rajdhani',sans-serif] font-semibold"
//               placeholder="Search by email or withdrawal ID..."
//             />
//             <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>

//           {/* Filter by Type */}
//           <select
//             value={filterType}
//             onChange={(e) => { setFilterType(e.target.value); setUplinePage(1); }}
//             className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-amber-500 transition-all duration-200 font-['Rajdhani',sans-serif] font-semibold appearance-none cursor-pointer"
//           >
//             <option value="" className="bg-[#0a0a0a] text-white">All Types</option>
//             <option value="leadership_bonus_3percent" className="bg-[#0a0a0a] text-white">3% Bonus</option>
//             <option value="leadership_bonus_2percent" className="bg-[#0a0a0a] text-white">2% Bonus</option>
//           </select>

//           {/* Clear */}
//           {(searchQuery || filterType) && (
//             <button
//               onClick={() => { setSearchQuery(""); setFilterType(""); setUplinePage(1); }}
//               className="px-4 py-3.5 text-sm text-slate-400 hover:text-white border border-white/10 rounded-2xl transition-colors"
//             >
//               Clear
//             </button>
//           )}
//         </motion.div>

//         {/* Table */}
//         <motion.div
//           variants={itemVariants}
//           className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-xl mb-6"
//         >
//           {uplineLoading ? (
//             <div className="flex justify-center items-center h-80"><Loader /></div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-white/10 border-b border-white/10">
//                   <tr>
//                     {UPLINE_HEADERS.map((h) => (
//                       <th key={h} className="px-6 py-5 text-[9px] font-black uppercase tracking-[3px] text-slate-500">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/10">
//                   <AnimatePresence>
//                     {currentUplineTransactions.length > 0 ? (
//                       currentUplineTransactions.map((item, index) => (
//                         <motion.tr
//                           key={index}
//                           initial={{ opacity: 0, x: -12 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0 }}
//                           transition={{ delay: index * 0.03 }}
//                           className="hover:bg-white/5 transition-colors group"
//                         >
//                           <td className="px-6 py-5 text-[11px] font-bold text-slate-600">
//                             {(uplinePage - 1) * entriesPerPage + index + 1}
//                           </td>
//                           <td className="px-6 py-5 text-xs font-semibold text-slate-400">
//                             {item.from_user_email || `User #${item.from_user_id}`}
//                           </td>
//                           <td className="px-6 py-5 text-xs font-semibold text-[#F5C518]">
//                             {item.to_user_email || `User #${item.to_user_id}`}
//                           </td>
//                           <td className="px-6 py-5 text-xs font-bold text-slate-500">
//                             #{item.withdrawal_id}
//                           </td>
//                           <td className="px-6 py-5 font-['Orbitron',sans-serif] text-[15px] font-black text-amber-400">
//                             +{formatCurrency(item.amount)}
//                           </td>
//                           <td className="px-6 py-5 font-['Orbitron',sans-serif] text-xs font-black text-[#F5C518]">
//                             {item.percent}%
//                           </td>
//                           <td className="px-6 py-5">
//                             <span className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
//                               {item.type === "leadership_bonus_3percent" ? "3% Bonus" : "2% Bonus"}
//                             </span>
//                           </td>
//                           <td className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
//                             {formatDate(item.createdAt)}
//                           </td>
//                         </motion.tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={8} className="px-6 py-20 text-center text-[11px] font-black uppercase tracking-[4px] text-slate-600">
//                           No Leadership Bonus Found
//                         </td>
//                       </tr>
//                     )}
//                   </AnimatePresence>
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </motion.div>

//         {/* Pagination */}
//         {!uplineLoading && (
//           <motion.div
//             variants={itemVariants}
//             className="flex justify-between items-center bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-6 py-4"
//           >
//             <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-600">
//               Viewing <span className="text-white">Page {uplinePage}</span>
//               <span className="text-slate-600"> / {uplineTotalPages}</span>
//               <span className="text-slate-600 ml-2">({filteredTransactions.length} records)</span>
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setUplinePage((p) => Math.max(1, p - 1))}
//                 disabled={uplinePage === 1}
//                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 hover:border-amber-500 hover:text-amber-500 transition-all text-white flex items-center justify-center"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button
//                 onClick={() => setUplinePage((p) => Math.min(uplineTotalPages, p + 1))}
//                 disabled={uplinePage === uplineTotalPages}
//                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 hover:border-amber-500 hover:text-amber-500 transition-all text-white flex items-center justify-center"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </motion.div>
//         )}

//       </motion.div>
//     </div>
//   );
// }