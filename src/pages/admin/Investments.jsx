// import { useState, useEffect } from 'react';
// import { Search, ChevronLeft, ChevronRight, TrendingUp, AlertCircle, Eye, Calendar, DollarSign } from 'lucide-react';
//  import api from "../../api/axiosInstance";

// export default function InvestmentDashboard() {
//   const [investments, setInvestments] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [search, setSearch] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [selectedInvestment, setSelectedInvestment] = useState(null);

//   useEffect(() => {
//     fetchInvestments();
//   }, [currentPage, limit, search]);


// const fetchInvestments = async () => {
//   try {
//     setLoading(true);
//     setError("");

//     const params = {
//       page: currentPage,
//       limit: limit,
//       ...(search && { search }),
//     };

//     const res = await api.get("/investments", { params });
//     const result = res.data;

//     if (result?.success) {
//       setInvestments(result.data);
//       setPagination(result.pagination);
//     } else {
//       throw new Error(result?.message || "Failed to fetch investments");
//     }
//   } catch (err) {
//     const msg =
//       err?.response?.data?.message ||
//       err?.response?.data?.error ||
//       err?.message ||
//       "Failed to fetch investments";

//     setError(msg);
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setSearch(searchInput);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'completed':
//         return 'bg-blue-100 text-blue-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading && investments.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
//           <p className="mt-4 text-slate-600 font-medium">Loading investments...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && investments.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
//           <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//           </div>
//           <h2 className="text-xl font-bold text-center text-slate-800 mb-2">Error Loading Data</h2>
//           <p className="text-center text-slate-600 mb-4">{error}</p>
//           <button
//             onClick={fetchInvestments}
//             className="w-full bg-[#D4AF37] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Investment Management</h1>
//           <p className="text-slate-600">Manage and monitor all investments</p>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <form onSubmit={handleSearch} className="flex-1 flex gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or plan..."
//                   value={searchInput}
//                   onChange={(e) => setSearchInput(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C518]"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-[#D4AF37] hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//               >
//                 Search
//               </button>
//             </form>
            
//             <div className="flex items-center gap-2">
//               <label className="text-sm text-slate-600 whitespace-nowrap">Per page:</label>
//               <select
//                 value={limit}
//                 onChange={(e) => {
//                   setLimit(parseInt(e.target.value));
//                   setCurrentPage(1);
//                 }}
//                 className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5C518]"
//               >
//                 <option value="10">10</option>
//                 <option value="25">25</option>
//                 <option value="50">50</option>
//                 <option value="100">100</option>
//               </select>
//             </div>
//           </div>

//           {search && (
//             <div className="mt-3 flex items-center gap-2">
//               <span className="text-sm text-slate-600">Searching for: <strong>{search}</strong></span>
//               <button
//                 onClick={() => {
//                   setSearch('');
//                   setSearchInput('');
//                   setCurrentPage(1);
//                 }}
//                 className="text-sm text-[#D4AF37] hover:text-blue-700 font-medium"
//               >
//                 Clear
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">Total Investments</p>
//                 <p className="text-2xl font-bold text-slate-800">{pagination?.total || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">Total Invested</p>
//                 <p className="text-2xl font-bold text-slate-800">
//                   {formatCurrency(investments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount), 0))}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                 <DollarSign className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">Current Value</p>
//                 <p className="text-2xl font-bold text-slate-800">
//                   {formatCurrency(investments.reduce((sum, inv) => sum + parseFloat(inv.current_value), 0))}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">Total Earned</p>
//                 <p className="text-2xl font-bold text-slate-800">
//                   {formatCurrency(investments.reduce((sum, inv) => sum + parseFloat(inv.total_earned), 0))}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
//                 <DollarSign className="w-6 h-6 text-emerald-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50 border-b border-slate-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ID</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Investor</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Plan</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Invested</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Current Value</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Earned</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ROI</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Start Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="10" className="px-6 py-12 text-center">
//                       <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
//                     </td>
//                   </tr>
//                 ) : investments.length === 0 ? (
//                   <tr>
//                     <td colSpan="10" className="px-6 py-12 text-center text-slate-500">
//                       No investments found
//                     </td>
//                   </tr>
//                 ) : (
//                   investments.map((investment) => (
//                     <tr key={investment.id} className="hover:bg-slate-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
//                         #{investment.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm">
//                           <div className="font-medium text-slate-900">{investment.user_name}</div>
//                           <div className="text-slate-500">{investment.user_email}</div>
//                           <div className="text-slate-500">{investment.user_phone}</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-slate-900">{investment.plan_name}</div>
//                         <div className="text-xs text-slate-500">
//                           {formatCurrency(investment.min)} - {formatCurrency(investment.max)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
//                         {formatCurrency(investment.invested_amount)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#D4AF37]">
//                         {formatCurrency(investment.current_value)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
//                         {formatCurrency(investment.total_earned)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
//                         {investment.roi_percentage}%
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(investment.status)}`}>
//                           {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
//                         {formatDate(investment.start_date)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <button
//                           onClick={() => setSelectedInvestment(investment)}
//                           className="text-[#D4AF37] hover:text-blue-800 font-medium flex items-center gap-1"
//                         >
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination && pagination.totalPages > 1 && (
//             <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
//               <div className="text-sm text-slate-600">
//                 Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} results
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
                
//                 <div className="flex items-center gap-1">
//                   {[...Array(pagination.totalPages)].map((_, i) => {
//                     const page = i + 1;
//                     if (
//                       page === 1 ||
//                       page === pagination.totalPages ||
//                       (page >= currentPage - 1 && page <= currentPage + 1)
//                     ) {
//                       return (
//                         <button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
//                             currentPage === page
//                               ? 'bg-[#D4AF37] text-white'
//                               : 'text-slate-600 hover:bg-slate-100'
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       );
//                     } else if (page === currentPage - 2 || page === currentPage + 2) {
//                       return <span key={page} className="px-2 text-slate-400">...</span>;
//                     }
//                     return null;
//                   })}
//                 </div>

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === pagination.totalPages}
//                   className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Detail Modal */}
//       {selectedInvestment && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedInvestment(null)}>
//           <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="bg-gradient-to-r from-[#D4AF37] to-blue-700 p-6 text-white">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-1">Investment Details</h2>
//                   <p className="text-blue-100">ID: #{selectedInvestment.id}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedInvestment(null)}
//                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-2 gap-6 mb-6">
//                 <div className="bg-green-50 rounded-lg p-4">
//                   <p className="text-sm text-green-700 mb-1">Invested Amount</p>
//                   <p className="text-2xl font-bold text-green-800">{formatCurrency(selectedInvestment.invested_amount)}</p>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-4">
//                   <p className="text-sm text-blue-700 mb-1">Current Value</p>
//                   <p className="text-2xl font-bold text-blue-800">{formatCurrency(selectedInvestment.current_value)}</p>
//                 </div>
//                 <div className="bg-purple-50 rounded-lg p-4">
//                   <p className="text-sm text-purple-700 mb-1">Total Earned</p>
//                   <p className="text-2xl font-bold text-purple-800">{formatCurrency(selectedInvestment.total_earned)}</p>
//                 </div>
//                 <div className="bg-orange-50 rounded-lg p-4">
//                   <p className="text-sm text-orange-700 mb-1">ROI Percentage</p>
//                   <p className="text-2xl font-bold text-orange-800">{selectedInvestment.roi_percentage}%</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-3">Plan Information</h3>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-slate-500">Plan Name</p>
//                       <p className="font-medium text-slate-900">{selectedInvestment.plan_name}</p>
//                     </div>
//                     <div>
//                       <p className="text-slate-500">Investment Range</p>
//                       <p className="font-medium text-slate-900">
//                         {formatCurrency(selectedInvestment.min)} - {formatCurrency(selectedInvestment.max)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-3">Investor Information</h3>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-slate-500">Name</p>
//                       <p className="font-medium text-slate-900">{selectedInvestment.user_name}</p>
//                     </div>
//                     <div>
//                       <p className="text-slate-500">Email</p>
//                       <p className="font-medium text-slate-900">{selectedInvestment.user_email}</p>
//                     </div>
//                     <div>
//                       <p className="text-slate-500">Phone</p>
//                       <p className="font-medium text-slate-900">{selectedInvestment.user_phone}</p>
//                     </div>
//                     <div>
//                       <p className="text-slate-500">User ID</p>
//                       <p className="font-medium text-slate-900">#{selectedInvestment.user_id}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-3">Timeline</h3>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-slate-500">Start Date</p>
//                       <p className="font-medium text-slate-900">{formatDate(selectedInvestment.start_date)}</p>
//                     </div>
//                     <div>
//                       <p className="text-slate-500">End Date</p>
//                       <p className="font-medium text-slate-900">{formatDate(selectedInvestment.end_date)}</p>
//                     </div>
//                     <div>
//                       <p className="text-slate-500">Last ROI Date</p>
//                       <p className="font-medium text-slate-900">{formatDate(selectedInvestment.last_roi_date)}</p>
//                     </div>
//                     <div>
//                       <p className="text-slate-500">Created At</p>
//                       <p className="font-medium text-slate-900">{formatDate(selectedInvestment.created_at)}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-3">Status</h3>
//                   <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedInvestment.status)}`}>
//                     {selectedInvestment.status.charAt(0).toUpperCase() + selectedInvestment.status.slice(1)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



















import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, TrendingUp, AlertCircle, Eye, Calendar, DollarSign, RefreshCw, Filter, X, User, Wallet, PieChart, Award } from 'lucide-react';
import api from "../../api/axiosInstance";

export default function InvestmentDashboard() {
  const [investments, setInvestments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, [currentPage, limit, search]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: currentPage,
        limit: limit,
        ...(search && { search }),
      };

      const res = await api.get("/investments", { params });
      const result = res.data;

      if (result?.success) {
        setInvestments(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result?.message || "Failed to fetch investments");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to fetch investments";
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInvestments();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchInput('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'completed':
        return 'bg-[#F5C518]/20 text-[#F5C518] border border-[#F5C518]/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  // Calculate statistics
  const totalInvestments = pagination?.total || 0;
  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount || 0), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value || 0), 0);
  const totalEarned = investments.reduce((sum, inv) => sum + parseFloat(inv.total_earned || 0), 0);

  const statsCards = [
    { title: "Total Investments", value: totalInvestments, icon: PieChart, color: "blue", gradient: "from-[#D4AF37] to-[#F5C518]" },
    { title: "Total Invested", value: formatCurrency(totalInvested), icon: Wallet, color: "emerald", gradient: "from-emerald-600 to-teal-600" },
    { title: "Current Value", value: formatCurrency(totalCurrentValue), icon: TrendingUp, color: "purple", gradient: "from-purple-600 to-pink-600" },
    { title: "Total Earned", value: formatCurrency(totalEarned), icon: Award, color: "amber", gradient: "from-amber-600 to-orange-600" },
  ];

  if (loading && investments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F5C518]/20 rounded-full blur-2xl animate-ping"></div>
          <div className="relative flex flex-col items-center gap-4 bg-white/5 backdrop-blur-2xl px-10 py-8 rounded-2xl border border-[#F5C518]/30">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-white font-medium">Loading investments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && investments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-rose-500/30 p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-14 h-14 bg-rose-500/20 rounded-full mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-center text-white mb-2">Error Loading Data</h2>
          <p className="text-center text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchInvestments}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] p-4 md:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Investment Management
              </h1>
              <p className="text-slate-400 text-sm mt-1">Manage and monitor all investments</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 animate-in fade-in-up duration-500 delay-100">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or plan..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] hover:from-[#F5C518] hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
              >
                Search
              </button>
            </form>
            
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-400 whitespace-nowrap">Per page:</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 cursor-pointer"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {search && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5C518]/20 border border-[#F5C518]/30">
                <Filter className="w-3 h-3 text-[#F5C518]" />
                <span className="text-sm text-slate-300">Searching for: <span className="text-[#F5C518] font-medium">{search}</span></span>
              </div>
              <button
                onClick={handleClearSearch}
                className="text-sm text-slate-400 hover:text-[#F5C518] transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in-up duration-500 delay-200">
          {statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-80`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden animate-in fade-in-up duration-500 delay-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Investor</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Plan</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Invested</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Current</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Earned</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ROI</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Start Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-5 py-12 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#F5C518] border-t-transparent"></div>
                      <p className="text-slate-400 text-sm mt-2">Loading...</p>
                    </td>
                  </tr>
                ) : investments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <Search className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-400">No investments found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  investments.map((investment, idx) => (
                    <tr key={investment.id} className="hover:bg-white/5 transition-all duration-300 group animate-in fade-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                      <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-[#F5C518]">
                        #{investment.id}
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-sm">
                          <div className="font-medium text-white">{investment.user_name}</div>
                          <div className="text-slate-400 text-xs">{investment.user_email}</div>
                          <div className="text-slate-500 text-xs">{investment.user_phone}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-sm font-medium text-white">{investment.plan_name}</div>
                        <div className="text-xs text-slate-500">
                          {formatCurrency(investment.min)} - {formatCurrency(investment.max)}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-white">
                        {formatCurrency(investment.invested_amount)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-emerald-400">
                        {formatCurrency(investment.current_value)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-amber-400">
                        {formatCurrency(investment.total_earned)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-white">
                        {investment.roi_percentage}%
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(investment.status)}`}>
                          {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm text-slate-400">
                        {formatDate(investment.start_date)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedInvestment(investment)}
                          className="text-[#F5C518] hover:text-[#f0d060] font-medium flex items-center gap-1 transition-all hover:gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-5 py-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-400">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-white shadow-lg shadow-[#F5C518]/25'
                              : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-1 text-slate-600">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setSelectedInvestment(null)}>
          <div className="bg-gradient-to-br from-slate-900 to-[#0a0a0a] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C518] p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Investment Details</h2>
                  <p className="text-blue-200 text-sm">ID: #{selectedInvestment.id}</p>
                </div>
                <button
                  onClick={() => setSelectedInvestment(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-sm text-emerald-400 mb-1">Invested Amount</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedInvestment.invested_amount)}</p>
                </div>
                <div className="bg-[#F5C518]/10 rounded-xl p-4 border border-[#F5C518]/20">
                  <p className="text-sm text-[#F5C518] mb-1">Current Value</p>
                  <p className="text-2xl font-bold text-[#F5C518]">{formatCurrency(selectedInvestment.current_value)}</p>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                  <p className="text-sm text-purple-400 mb-1">Total Earned</p>
                  <p className="text-2xl font-bold text-purple-400">{formatCurrency(selectedInvestment.total_earned)}</p>
                </div>
                <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                  <p className="text-sm text-amber-400 mb-1">ROI Percentage</p>
                  <p className="text-2xl font-bold text-amber-400">{selectedInvestment.roi_percentage}%</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-[#F5C518]" />
                    Plan Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 rounded-xl p-4">
                    <div>
                      <p className="text-slate-400">Plan Name</p>
                      <p className="font-medium text-white">{selectedInvestment.plan_name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Investment Range</p>
                      <p className="font-medium text-white">
                        {formatCurrency(selectedInvestment.min)} - {formatCurrency(selectedInvestment.max)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#F5C518]" />
                    Investor Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 rounded-xl p-4">
                    <div>
                      <p className="text-slate-400">Name</p>
                      <p className="font-medium text-white">{selectedInvestment.user_name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Email</p>
                      <p className="font-medium text-white">{selectedInvestment.user_email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Phone</p>
                      <p className="font-medium text-white">{selectedInvestment.user_phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">User ID</p>
                      <p className="font-medium text-white">#{selectedInvestment.user_id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F5C518]" />
                    Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 rounded-xl p-4">
                    <div>
                      <p className="text-slate-400">Start Date</p>
                      <p className="font-medium text-white">{formatDate(selectedInvestment.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">End Date</p>
                      <p className="font-medium text-white">{formatDate(selectedInvestment.end_date)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Last ROI Date</p>
                      <p className="font-medium text-white">{formatDate(selectedInvestment.last_roi_date)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Created At</p>
                      <p className="font-medium text-white">{formatDate(selectedInvestment.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Status</h3>
                  <span className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(selectedInvestment.status)}`}>
                    {selectedInvestment.status.charAt(0).toUpperCase() + selectedInvestment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}