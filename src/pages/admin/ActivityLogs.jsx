// import React, { useState, useEffect } from 'react';
// import { AlertCircle, Activity, RefreshCw, Search, Filter, X, Calendar, User, FileText } from 'lucide-react';
// import api from '../../api/axiosInstance';
// export default function ActivityLogDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [userIdFilter, setUserIdFilter] = useState('');
//   const [actionTypeFilter, setActionTypeFilter] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [expandedRow, setExpandedRow] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get('/activity');
//       setData(response.data);

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const getActionBadgeColor = (action) => {
//     switch (action) {
//       case 'CREATE':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'UPDATE':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'DELETE':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setUserIdFilter('');
//     setActionTypeFilter('');
//     setStartDate('');
//     setEndDate('');
//   };

//   const filteredData = data?.data?.filter(activity => {
//     // Search term filter (searches in description, email, etc.)
//     const searchLower = searchTerm.toLowerCase();
//     const matchesSearch = searchTerm === '' || 
//       activity.description.toLowerCase().includes(searchLower) ||
//       activity.ip_address.toLowerCase().includes(searchLower) ||
//       JSON.stringify(activity.metadata).toLowerCase().includes(searchLower);

//     // User ID filter
//     const matchesUserId = userIdFilter === '' || 
//       activity.user_id.toString() === userIdFilter;

//     // Action type filter
//     const matchesActionType = actionTypeFilter === '' || 
//       activity.action_type === actionTypeFilter;

//     // Date range filter
//     const activityDate = new Date(activity.created_at);
//     const matchesStartDate = startDate === '' || 
//       activityDate >= new Date(startDate);
//     const matchesEndDate = endDate === '' || 
//       activityDate <= new Date(endDate + 'T23:59:59');

//     return matchesSearch && matchesUserId && matchesActionType && 
//            matchesStartDate && matchesEndDate;
//   }) || [];

//   const uniqueUserIds = [...new Set(data?.data?.map(a => a.user_id) || [])];
//   const uniqueActionTypes = [...new Set(data?.data?.map(a => a.action_type) || [])];

//   const getChangesFromRequestBody = (activity) => {
//     const requestBody = activity.metadata?.requestBody;
//     if (!requestBody) return null;

//     return Object.entries(requestBody).map(([key, value]) => ({
//       field: key,
//       value: typeof value === 'object' ? JSON.stringify(value) : value
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-[#F5C518] animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading activity logs...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Error Loading Data</h3>
//           <p className="text-gray-600 text-center mb-4">{error}</p>
//           <button
//             onClick={fetchData}
//             className="w-full bg-[#F5C518] hover:bg-[#D4AF37] text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <div className="bg-[#F5C518] p-3 rounded-lg">
//                 <Activity className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Admin Activity Log</h1>
//                 <p className="text-gray-600">Monitor all user activities</p>
//               </div>
//             </div>
//             <button
//               onClick={fetchData}
//               className="flex items-center gap-2 bg-[#F5C518] hover:bg-[#D4AF37] text-white font-medium py-2 px-4 rounded-lg transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-5 h-5 text-gray-600" />
//             <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//             {(searchTerm || userIdFilter || actionTypeFilter || startDate || endDate) && (
//               <button
//                 onClick={clearFilters}
//                 className="ml-auto flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
//               >
//                 <X className="w-4 h-4" />
//                 Clear All
//               </button>
//             )}
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
//               />
//             </div>

//             {/* User ID Filter */}
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <select
//                 value={userIdFilter}
//                 onChange={(e) => setUserIdFilter(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C518] focus:border-transparent appearance-none"
//               >
//                 <option value="">All Users</option>
//                 {uniqueUserIds.map(id => (
//                   <option key={id} value={id}>User {id}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Action Type Filter */}
//             <div className="relative">
//               <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <select
//                 value={actionTypeFilter}
//                 onChange={(e) => setActionTypeFilter(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C518] focus:border-transparent appearance-none"
//               >
//                 <option value="">All Actions</option>
//                 {uniqueActionTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Start Date */}
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
//                 placeholder="Start Date"
//               />
//             </div>

//             {/* End Date */}
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
//                 placeholder="End Date"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <p className="text-gray-600 text-sm mb-1">Total Activities</p>
//             <p className="text-3xl font-bold text-gray-900">{data?.pagination?.total || 0}</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <p className="text-gray-600 text-sm mb-1">Filtered Results</p>
//             <p className="text-3xl font-bold text-[#D4AF37]">{filteredData.length}</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <p className="text-gray-600 text-sm mb-1">Unique Users</p>
//             <p className="text-3xl font-bold text-gray-900">{uniqueUserIds.length}</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <p className="text-gray-600 text-sm mb-1">Action Types</p>
//             <p className="text-3xl font-bold text-gray-900">{uniqueActionTypes.length}</p>
//           </div>
//         </div>

//         {/* Activity Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">User ID</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">IP Address</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Timestamp</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Details</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                       No activities found matching your filters
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((activity, index) => (
//                     <React.Fragment key={activity.id}>
//                       <tr
//                         className={`hover:bg-slate-50 transition-colors ${
//                           index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
//                         } ${expandedRow === activity.id ? 'border-l-4 border-[#F5C518]' : ''}`}
//                       >
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           #{activity.id}
//                         </td>
//                         <td className="px-6 py-4 text-sm font-semibold text-[#D4AF37]">
//                           {activity.user_id}
//                         </td>
//                         <td className="px-6 py-4">
//                           <span
//                             className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getActionBadgeColor(
//                               activity.action_type
//                             )}`}
//                           >
//                             {activity.action_type}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900 font-mono">
//                           {activity.description}
//                         </td>
//                         <td className="px-6 py-4">
//                           <span
//                             className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
//                               activity.metadata?.statusCode === 200
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-red-100 text-red-800'
//                             }`}
//                           >
//                             {activity.metadata?.statusCode || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-600 font-mono">
//                           {activity.ip_address}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-600">
//                           {formatDate(activity.created_at)}
//                         </td>
//                         <td className="px-6 py-4">
//                           <button
//                             onClick={() => setExpandedRow(expandedRow === activity.id ? null : activity.id)}
//                             className="text-[#D4AF37] hover:text-blue-800 text-sm font-medium"
//                           >
//                             {expandedRow === activity.id ? 'Hide' : 'View'}
//                           </button>
//                         </td>
//                       </tr>
                      
//                       {/* Expanded Row Details */}
//                       {expandedRow === activity.id && (
//                         <tr className="bg-slate-100">
//                           <td colSpan="8" className="px-6 py-6">
//                             <div className="space-y-4">
//                               {/* User Agent */}
//                               <div>
//                                 <h4 className="text-sm font-semibold text-gray-900 mb-2">User Agent</h4>
//                                 <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 font-mono text-xs">
//                                   {activity.user_agent}
//                                 </p>
//                               </div>

//                               {/* Request Details */}
//                               {activity.metadata && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   <div>
//                                     <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Info</h4>
//                                     <div className="bg-white p-3 rounded border border-gray-200 space-y-1 text-sm">
//                                       <p><span className="font-semibold">Method:</span> <span className="text-purple-600">{activity.metadata.method}</span></p>
//                                       <p><span className="font-semibold">Path:</span> <span className="text-gray-700">{activity.metadata.path}</span></p>
//                                       <p><span className="font-semibold">Status:</span> <span className="text-green-600">{activity.metadata.statusCode}</span></p>
//                                     </div>
//                                   </div>

//                                   {/* Changes Made */}
//                                   {activity.metadata.requestBody && (
//                                     <div>
//                                       <h4 className="text-sm font-semibold text-gray-900 mb-2">Changes Made by User</h4>
//                                       <div className="bg-white p-3 rounded border border-gray-200">
//                                         <div className="space-y-2">
//                                           {getChangesFromRequestBody(activity)?.map((change, idx) => (
//                                             <div key={idx} className="flex items-start gap-2 text-sm">
//                                               <span className="font-semibold text-gray-700 min-w-24">{change.field}:</span>
//                                               <span className="text-[#D4AF37] break-all">{change.value}</span>
//                                             </div>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               )}

//                               {/* Full Request Body JSON */}
//                               {activity.metadata?.requestBody && (
//                                 <div>
//                                   <h4 className="text-sm font-semibold text-gray-900 mb-2">Full Request Body (JSON)</h4>
//                                   <div className="bg-[#0a0a0a] p-4 rounded border border-gray-700 overflow-x-auto">
//                                     <pre className="text-xs text-green-400 font-mono">
//                                       {JSON.stringify(activity.metadata.requestBody, null, 2)}
//                                     </pre>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }























// import React, { useState, useEffect } from 'react';
// import { AlertCircle, Activity, RefreshCw, Search, Filter, X, Calendar, User, FileText, ChevronDown, ChevronUp, Server, Clock, Globe, Database } from 'lucide-react';
// import api from '../../api/axiosInstance';

// export default function ActivityLogDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [userIdFilter, setUserIdFilter] = useState('');
//   const [actionTypeFilter, setActionTypeFilter] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get('/activity');
//       setData(response.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchData();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'N/A';
//       return date.toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//       });
//     } catch {
//       return 'N/A';
//     }
//   };

//   const getActionBadgeColor = (action) => {
//     switch (action) {
//       case 'CREATE':
//         return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
//       case 'UPDATE':
//         return 'bg-[#F5C518]/20 text-[#F5C518] border-[#F5C518]/30';
//       case 'DELETE':
//         return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
//       default:
//         return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setUserIdFilter('');
//     setActionTypeFilter('');
//     setStartDate('');
//     setEndDate('');
//   };

//   const filteredData = data?.data?.filter(activity => {
//     const searchLower = searchTerm.toLowerCase();
//     const matchesSearch = searchTerm === '' || 
//       activity.description?.toLowerCase().includes(searchLower) ||
//       activity.ip_address?.toLowerCase().includes(searchLower) ||
//       JSON.stringify(activity.metadata).toLowerCase().includes(searchLower);

//     const matchesUserId = userIdFilter === '' || 
//       activity.user_id?.toString() === userIdFilter;

//     const matchesActionType = actionTypeFilter === '' || 
//       activity.action_type === actionTypeFilter;

//     const activityDate = new Date(activity.created_at);
//     const matchesStartDate = startDate === '' || 
//       activityDate >= new Date(startDate);
//     const matchesEndDate = endDate === '' || 
//       activityDate <= new Date(endDate + 'T23:59:59');

//     return matchesSearch && matchesUserId && matchesActionType && 
//            matchesStartDate && matchesEndDate;
//   }) || [];

//   const uniqueUserIds = [...new Set(data?.data?.map(a => a.user_id) || [])];
//   const uniqueActionTypes = [...new Set(data?.data?.map(a => a.action_type) || [])];

//   const getChangesFromRequestBody = (activity) => {
//     const requestBody = activity.metadata?.requestBody;
//     if (!requestBody) return null;

//     return Object.entries(requestBody).map(([key, value]) => ({
//       field: key,
//       value: typeof value === 'object' ? JSON.stringify(value) : value
//     }));
//   };

//   if (loading && !refreshing) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] flex items-center justify-center">
//         <div className="relative">
//           <div className="absolute inset-0 bg-[#F5C518]/20 rounded-full blur-2xl animate-ping"></div>
//           <div className="relative flex flex-col items-center gap-4 bg-white/5 backdrop-blur-2xl px-10 py-8 rounded-2xl border border-[#F5C518]/30">
//             <div className="relative">
//               <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
//             </div>
//             <p className="text-white font-medium">Loading activity logs...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] flex items-center justify-center p-4">
//         <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-rose-500/30 p-8 max-w-md w-full">
//           <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-white mb-2 text-center">Error Loading Data</h3>
//           <p className="text-slate-400 text-center mb-6">{error}</p>
//           <button
//             onClick={fetchData}
//             className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

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
//               <Activity className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
//                 Activity Log Dashboard
//               </h1>
//               <p className="text-slate-400 text-sm mt-1">Monitor all user activities</p>
//             </div>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
//             <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
//           </button>
//         </div>

//         {/* Filters Panel */}
//         <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5 text-[#F5C518]" />
//               <h2 className="text-lg font-semibold text-white">Filters</h2>
//             </div>
//             {(searchTerm || userIdFilter || actionTypeFilter || startDate || endDate) && (
//               <button
//                 onClick={clearFilters}
//                 className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//                 Clear All
//               </button>
//             )}
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//               />
//             </div>

//             {/* User ID Filter */}
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <select
//                 value={userIdFilter}
//                 onChange={(e) => setUserIdFilter(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 appearance-none cursor-pointer"
//               >
//                 <option value="">All Users</option>
//                 {uniqueUserIds.map(id => (
//                   <option key={id} value={id}>User {id}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Action Type Filter */}
//             <div className="relative">
//               <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <select
//                 value={actionTypeFilter}
//                 onChange={(e) => setActionTypeFilter(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 appearance-none cursor-pointer"
//               >
//                 <option value="">All Actions</option>
//                 {uniqueActionTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Start Date */}
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//               />
//             </div>

//             {/* End Date */}
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
//             <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#F5C518] opacity-0 group-hover:opacity-10 transition-opacity" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">Total Activities</p>
//                 <p className="text-2xl font-bold text-white">{data?.pagination?.total || 0}</p>
//               </div>
//               <div className="p-3 rounded-xl bg-[#F5C518]/20">
//                 <Database className="w-6 h-6 text-[#F5C518]" />
//               </div>
//             </div>
//           </div>

//           <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">Filtered Results</p>
//                 <p className="text-2xl font-bold text-emerald-400">{filteredData.length}</p>
//               </div>
//               <div className="p-3 rounded-xl bg-emerald-500/20">
//                 <Filter className="w-6 h-6 text-emerald-400" />
//               </div>
//             </div>
//           </div>

//           <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">Unique Users</p>
//                 <p className="text-2xl font-bold text-purple-400">{uniqueUserIds.length}</p>
//               </div>
//               <div className="p-3 rounded-xl bg-purple-500/20">
//                 <User className="w-6 h-6 text-purple-400" />
//               </div>
//             </div>
//           </div>

//           <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
//             <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-slate-400 text-sm font-medium mb-1">Action Types</p>
//                 <p className="text-2xl font-bold text-amber-400">{uniqueActionTypes.length}</p>
//               </div>
//               <div className="p-3 rounded-xl bg-amber-500/20">
//                 <Activity className="w-6 h-6 text-amber-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Activity Table */}
//         <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-white/10 border-b border-white/10">
//                 <tr>
//                   <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
//                   <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User ID</th>
//                   <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
//                   <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
//                   <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
//                   <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP Address</th>
//                   <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Timestamp</th>
//                   <th className="px-5 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Details</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/10">
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="px-5 py-16 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <Search className="w-12 h-12 text-slate-500" />
//                         <p className="text-slate-400">No activities found matching your filters</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((activity, index) => (
//                     <React.Fragment key={activity.id}>
//                       <tr className={`hover:bg-white/5 transition-all duration-300 ${expandedRow === activity.id ? 'bg-white/5' : ''}`}>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className="text-sm font-mono text-[#F5C518]">#{activity.id}</span>
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className="text-sm font-semibold text-white">{activity.user_id}</span>
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getActionBadgeColor(activity.action_type)}`}>
//                             {activity.action_type}
//                           </span>
//                         </td>
//                         <td className="px-5 py-3">
//                           <span className="text-sm text-slate-300 font-mono">{activity.description}</span>
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-lg ${
//                             activity.metadata?.statusCode === 200 || activity.metadata?.statusCode === 201
//                               ? 'bg-emerald-500/20 text-emerald-400'
//                               : 'bg-rose-500/20 text-rose-400'
//                           }`}>
//                             {activity.metadata?.statusCode || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <span className="text-sm text-slate-400 font-mono">{activity.ip_address}</span>
//                         </td>
//                         <td className="px-5 py-3 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Clock className="w-3 h-3 text-slate-500" />
//                             <span className="text-sm text-slate-400">{formatDate(activity.created_at)}</span>
//                           </div>
//                         </td>
//                         <td className="px-5 py-3 text-center">
//                           <button
//                             onClick={() => setExpandedRow(expandedRow === activity.id ? null : activity.id)}
//                             className="text-[#F5C518] hover:text-[#f0d060] transition-colors flex items-center gap-1 mx-auto"
//                           >
//                             {expandedRow === activity.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                             <span className="text-xs">{expandedRow === activity.id ? 'Hide' : 'View'}</span>
//                           </button>
//                         </td>
//                       </tr>
                      
//                       {/* Expanded Row Details */}
//                       {expandedRow === activity.id && (
//                         <tr className="bg-white/5">
//                           <td colSpan="8" className="px-5 py-5">
//                             <div className="space-y-4">
//                               {/* User Agent */}
//                               <div>
//                                 <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
//                                   <Globe className="w-4 h-4 text-[#F5C518]" />
//                                   User Agent
//                                 </h4>
//                                 <p className="text-sm text-slate-400 bg-white/5 p-3 rounded-xl border border-white/10 font-mono text-xs">
//                                   {activity.user_agent}
//                                 </p>
//                               </div>

//                               {/* Request Details */}
//                               {activity.metadata && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                   <div>
//                                     <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
//                                       <Server className="w-4 h-4 text-[#F5C518]" />
//                                       Request Info
//                                     </h4>
//                                     <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
//                                       <p className="text-sm"><span className="font-semibold text-slate-400">Method:</span> <span className="text-purple-400">{activity.metadata.method}</span></p>
//                                       <p className="text-sm"><span className="font-semibold text-slate-400">Path:</span> <span className="text-slate-300">{activity.metadata.path}</span></p>
//                                       <p className="text-sm"><span className="font-semibold text-slate-400">Status:</span> <span className="text-emerald-400">{activity.metadata.statusCode}</span></p>
//                                     </div>
//                                   </div>

//                                   {/* Changes Made */}
//                                   {activity.metadata.requestBody && (
//                                     <div>
//                                       <h4 className="text-sm font-semibold text-white mb-2">Changes Made</h4>
//                                       <div className="bg-white/5 p-3 rounded-xl border border-white/10">
//                                         <div className="space-y-2">
//                                           {getChangesFromRequestBody(activity)?.map((change, idx) => (
//                                             <div key={idx} className="flex items-start gap-2 text-sm">
//                                               <span className="font-semibold text-slate-400 min-w-24">{change.field}:</span>
//                                               <span className="text-[#F5C518] break-all">{change.value}</span>
//                                             </div>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               )}

//                               {/* Full Request Body JSON */}
//                               {activity.metadata?.requestBody && (
//                                 <div>
//                                   <h4 className="text-sm font-semibold text-white mb-2">Full Request Body (JSON)</h4>
//                                   <div className="bg-[#0a0a0a] p-4 rounded-xl border border-slate-700 overflow-x-auto">
//                                     <pre className="text-xs text-emerald-400 font-mono">
//                                       {JSON.stringify(activity.metadata.requestBody, null, 2)}
//                                     </pre>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






















import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, RefreshCw, Search, Filter, X, Calendar, User, FileText, ChevronDown, ChevronUp, Server, Clock, Globe, Database } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function ActivityLogDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/activity');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'UPDATE':
        return 'bg-[#F5C518]/20 text-[#F5C518] border-[#F5C518]/30';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setUserIdFilter('');
    setActionTypeFilter('');
    setStartDate('');
    setEndDate('');
  };

  const filteredData = data?.data?.filter(activity => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      activity.description?.toLowerCase().includes(searchLower) ||
      activity.ip_address?.toLowerCase().includes(searchLower) ||
      JSON.stringify(activity.metadata).toLowerCase().includes(searchLower);

    const matchesUserId = userIdFilter === '' || 
      activity.user_id?.toString() === userIdFilter;

    const matchesActionType = actionTypeFilter === '' || 
      activity.action_type === actionTypeFilter;

    const activityDate = new Date(activity.created_at);
    const matchesStartDate = startDate === '' || 
      activityDate >= new Date(startDate);
    const matchesEndDate = endDate === '' || 
      activityDate <= new Date(endDate + 'T23:59:59');

    return matchesSearch && matchesUserId && matchesActionType && 
           matchesStartDate && matchesEndDate;
  }) || [];

  const uniqueUserIds = [...new Set(data?.data?.map(a => a.user_id) || [])];
  const uniqueActionTypes = [...new Set(data?.data?.map(a => a.action_type) || [])];

  const getChangesFromRequestBody = (activity) => {
    const requestBody = activity.metadata?.requestBody;
    if (!requestBody) return null;

    return Object.entries(requestBody).map(([key, value]) => ({
      field: key,
      value: typeof value === 'object' ? JSON.stringify(value) : value
    }));
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#F5C518]/20 rounded-full blur-2xl animate-ping"></div>
          <div className="relative flex flex-col items-center gap-4 bg-white/5 backdrop-blur-2xl px-10 py-8 rounded-2xl border border-[#F5C518]/30">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-white font-medium">Loading activity logs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-rose-500/30 p-8 max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2 text-center">Error Loading Data</h3>
          <p className="text-slate-400 text-center mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        {/* <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div> */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Activity Log Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-1">Monitor all user activities</p>
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

        {/* Filters Panel */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#F5C518]" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
            </div>
            {(searchTerm || userIdFilter || actionTypeFilter || startDate || endDate) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>

            {/* User ID Filter */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 appearance-none cursor-pointer"
              >
                <option value="">All Users</option>
                {uniqueUserIds.map(id => (
                  <option key={id} value={id}>User {id}</option>
                ))}
              </select>
            </div>

            {/* Action Type Filter */}
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={actionTypeFilter}
                onChange={(e) => setActionTypeFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 appearance-none cursor-pointer"
              >
                <option value="">All Actions</option>
                {uniqueActionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#F5C518] opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Activities</p>
                <p className="text-2xl font-bold text-white">{data?.pagination?.total || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5C518]/20">
                <Database className="w-6 h-6 text-[#F5C518]" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Filtered Results</p>
                <p className="text-2xl font-bold text-emerald-400">{filteredData.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Filter className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Unique Users</p>
                <p className="text-2xl font-bold text-purple-400">{uniqueUserIds.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <User className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Action Types</p>
                <p className="text-2xl font-bold text-amber-400">{uniqueActionTypes.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP Address</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-slate-500" />
                        <p className="text-slate-400">No activities found matching your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <tr className={`hover:bg-white/5 transition-all duration-300 ${expandedRow === activity.id ? 'bg-white/5' : ''}`}>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-[#F5C518]">#{activity.id}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-white">{activity.user_id}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getActionBadgeColor(activity.action_type)}`}>
                            {activity.action_type}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm text-slate-300 font-mono">{activity.description}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-lg ${
                            activity.metadata?.statusCode === 200 || activity.metadata?.statusCode === 201
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {activity.metadata?.statusCode || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-sm text-slate-400 font-mono">{activity.ip_address}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span className="text-sm text-slate-400">{formatDate(activity.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => setExpandedRow(expandedRow === activity.id ? null : activity.id)}
                            className="text-[#F5C518] hover:text-[#f0d060] transition-colors flex items-center gap-1 mx-auto"
                          >
                            {expandedRow === activity.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            <span className="text-xs">{expandedRow === activity.id ? 'Hide' : 'View'}</span>
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Row Details */}
                      {expandedRow === activity.id && (
                        <tr className="bg-white/5">
                          <td colSpan="8" className="px-5 py-5">
                            <div className="space-y-4">
                              {/* User Agent */}
                              <div>
                                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-[#F5C518]" />
                                  User Agent
                                </h4>
                                <p className="text-sm text-slate-400 bg-white/5 p-3 rounded-xl border border-white/10 font-mono text-xs">
                                  {activity.user_agent}
                                </p>
                              </div>

                              {/* Request Details */}
                              {activity.metadata && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                      <Server className="w-4 h-4 text-[#F5C518]" />
                                      Request Info
                                    </h4>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                                      <p className="text-sm"><span className="font-semibold text-slate-400">Method:</span> <span className="text-purple-400">{activity.metadata.method}</span></p>
                                      <p className="text-sm"><span className="font-semibold text-slate-400">Path:</span> <span className="text-slate-300">{activity.metadata.path}</span></p>
                                      <p className="text-sm"><span className="font-semibold text-slate-400">Status:</span> <span className="text-emerald-400">{activity.metadata.statusCode}</span></p>
                                    </div>
                                  </div>

                                  {/* Changes Made */}
                                  {activity.metadata.requestBody && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-white mb-2">Changes Made</h4>
                                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                        <div className="space-y-2">
                                          {getChangesFromRequestBody(activity)?.map((change, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm">
                                              <span className="font-semibold text-slate-400 min-w-24">{change.field}:</span>
                                              <span className="text-[#F5C518] break-all">{change.value}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Full Request Body JSON */}
                              {activity.metadata?.requestBody && (
                                <div>
                                  <h4 className="text-sm font-semibold text-white mb-2">Full Request Body (JSON)</h4>
                                  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-slate-700 overflow-x-auto">
                                    <pre className="text-xs text-emerald-400 font-mono">
                                      {JSON.stringify(activity.metadata.requestBody, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}