// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Download, Filter, Search, Calendar, DollarSign, User, CheckCircle2 } from 'lucide-react';
// import api from '../../api/axiosInstance';
// const TransactionDashboard = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [transactionType, setTransactionType] = useState('IB_Commission');

//   // Get transaction type from URL parameters
//   const getTransactionTypeFromURL = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('transaction_type') || 'IB_Commission';
//   };

//   const fetchTransactions = async (page = 1, type = null) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const currentType = type || transactionType;
//       const apiUrl = `/tr/all?transaction_type=${currentType}&page=${page}`;

//       const res = await api.get(apiUrl);
//       const data = res.data;

//       setTransactions(data.transactions || []);
//       setTotalPages(data.totalPages || 1);
//       setCurrentPage(data.currentPage || page);
//     } catch (err) {
//       setError(`Failed to fetch transactions: ${err.message}`);
//       console.error('Error fetching transactions:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const urlTransactionType = getTransactionTypeFromURL();
//     setTransactionType(urlTransactionType);
//     fetchTransactions(1, urlTransactionType);
//   }, []);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       fetchTransactions(page);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'complete':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'failed':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
//               <div className="space-y-4">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="h-20 bg-gray-200 rounded"></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-xl shadow-lg p-8 text-center">
//             <div className="text-red-600 text-6xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <button
//               onClick={() => fetchTransactions(currentPage)}
//               className="bg-[#D4AF37] hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Transaction Dashboard
//               </h1>
//               <p className="text-gray-600">
//                 Viewing {transactionType.replace('_', ' ')} transactions
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button className="flex items-center px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-blue-700 transition-colors">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export
//               </button>
//               <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Filter
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-[#D4AF37]" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Amount</p>
//                 <p className="text-2xl font-bold text-gray-900">{formatAmount(totalAmount)}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center">
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <CheckCircle2 className="w-6 h-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Transactions</p>
//                 <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center">
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <User className="w-6 h-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Unique Users</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {new Set(transactions.map(tx => tx.user_id)).size}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search transactions..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Transaction ID
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Source
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {transactions.map((transaction) => (
//                   <tr key={transaction.transaction_id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         #{transaction.transaction_id}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
//                             <span className="text-white font-medium text-sm">
//                               {transaction.username.charAt(0)}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {transaction.username}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {transaction.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-green-600">
//                         {formatAmount(transaction.amount)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{transaction.source}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transaction.status)}`}>
//                         {transaction.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {formatDate(transaction.created_at)}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="bg-white px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                 <span className="font-medium">{totalPages}</span>
//               </div>

//               <nav className="flex items-center space-x-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={`p-2 rounded-lg border ${currentPage === 1
//                       ? 'text-gray-300 border-gray-200 cursor-not-allowed'
//                       : 'text-gray-600 border-gray-300 hover:bg-gray-50'
//                     }`}
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>

//                 {[...Array(totalPages)].map((_, index) => {
//                   const page = index + 1;
//                   return (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-4 py-2 rounded-lg border ${currentPage === page
//                           ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
//                           : 'text-gray-600 border-gray-300 hover:bg-gray-50'
//                         }`}
//                     >
//                       {page}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={`p-2 rounded-lg border ${currentPage === totalPages
//                       ? 'text-gray-300 border-gray-200 cursor-not-allowed'
//                       : 'text-gray-600 border-gray-300 hover:bg-gray-50'
//                     }`}
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionDashboard;

























import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, Filter, Search, Calendar, DollarSign, User, CheckCircle2, RefreshCw, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import api from '../../api/axiosInstance';

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionType, setTransactionType] = useState('IB_Commission');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Get transaction type from URL parameters
  const getTransactionTypeFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('transaction_type') || 'IB_Commission';
  };

  const fetchTransactions = async (page = 1, type = null) => {
    setLoading(true);
    setError(null);

    try {
      const currentType = type || transactionType;
      const apiUrl = `/tr/all?transaction_type=${currentType}&page=${page}`;

      const res = await api.get(apiUrl);
      const data = res.data;

      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      setError(`Failed to fetch transactions: ${err.message}`);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions(currentPage);
  };

  useEffect(() => {
    const urlTransactionType = getTransactionTypeFromURL();
    setTransactionType(urlTransactionType);
    fetchTransactions(1, urlTransactionType);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTransactions(page);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'success':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'failed':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'ib_commission':
        return 'from-[#D4AF37] to-[#F5C518]';
      case 'deposit':
        return 'from-emerald-600 to-teal-600';
      case 'withdrawal':
        return 'from-rose-600 to-pink-600';
      default:
        return 'from-purple-600 to-violet-600';
    }
  };

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(tx => 
    searchQuery === '' || 
    tx.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.transaction_id?.toString().includes(searchQuery) ||
    tx.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const uniqueUsers = new Set(filteredTransactions.map(tx => tx.user_id)).size;

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F5C518]/20 rounded-full blur-2xl animate-ping"></div>
          <div className="relative flex flex-col items-center gap-4 bg-white/5 backdrop-blur-2xl px-10 py-8 rounded-2xl border border-[#F5C518]/30">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-white font-medium">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-rose-500/30 p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-14 h-14 bg-rose-500/20 rounded-full mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-center text-white mb-2">Error Loading Data</h2>
          <p className="text-center text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => fetchTransactions(currentPage)}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div> */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
        </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${getTransactionTypeColor(transactionType)} shadow-lg shadow-[#F5C518]/30`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Transaction Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Viewing <span className="text-[#F5C518] font-medium">{transactionType.replace('_', ' ')}</span> transactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] hover:from-[#F5C518] hover:to-indigo-500 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-in fade-in-up duration-500 delay-100">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#F5C518] opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-white">{formatAmount(totalAmount)}</p>
                <p className="text-xs text-slate-500 mt-1">From {filteredTransactions.length} transactions</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5C518]/20">
                <DollarSign className="w-6 h-6 text-[#F5C518]" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-emerald-400">{filteredTransactions.length.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Processed records</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Unique Users</p>
                <p className="text-2xl font-bold text-purple-400">{uniqueUsers.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Active participants</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <User className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden animate-in fade-in-up duration-500 delay-200">
          {/* Search Bar */}
          <div className="p-5 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F5C518]" />
                Recent Transactions
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#F5C518]/20 text-[#F5C518]">
                  {filteredTransactions.length} records
                </span>
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all w-full sm:w-80"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#F5C518] border-t-transparent"></div>
                      <p className="text-slate-400 text-sm mt-2">Loading transactions...</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <Search className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-400">No transactions found</p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="text-sm text-[#F5C518] hover:text-[#f0d060] transition-colors"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, idx) => (
                    <tr key={transaction.transaction_id || idx} className="hover:bg-white/5 transition-all duration-300 group animate-in fade-in-up" style={{ animationDelay: `${idx * 30}ms` }}>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#F5C518]">
                          #{transaction.transaction_id}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-9 w-9">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center shadow-lg">
                              <span className="text-white font-medium text-sm">
                                {transaction.username?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {transaction.username || 'Unknown'}
                            </div>
                            <div className="text-xs text-slate-400">
                              {transaction.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-sm font-bold text-emerald-400">
                          {formatAmount(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{transaction.source || 'N/A'}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transaction.status)}`}>
                          {transaction.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-400">
                          {formatDate(transaction.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-white/10">
              <div className="text-sm text-slate-400">
                Showing page <span className="font-medium text-white">{currentPage}</span> of{' '}
                <span className="font-medium text-white">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="group p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let page;
                    if (totalPages <= 5) {
                      page = index + 1;
                    } else if (currentPage <= 3) {
                      page = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + index;
                    } else {
                      page = currentPage - 2 + index;
                    }
                    
                    if (page > 0 && page <= totalPages) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-white shadow-lg shadow-[#F5C518]/25'
                              : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="group p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;