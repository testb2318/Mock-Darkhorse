// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllDeposite } from "../../redux/depositeSlice";
// import { getAllUsers } from "../../redux/userSlice";
// import { getAllWithdrawal } from "../../redux/withdrawalSlice";
// import Loader from "../../components/common/Loader";
// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";

// export default function Reports() {
//   const dispatch = useDispatch();
//   const { users } = useSelector((state) => state.users);
//   const { allwithdrawal } = useSelector((state) => state.allwithdrawal);
//   const { alldeposite, loading, error, message } = useSelector(
//     (state) => state.alldeposite
//   );

//   const [allUser, setAllUser] = useState();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1); // Current page number
//   const [itemsPerPage] = useState(10); // Number of items per page

//   useEffect(() => {
//     dispatch(getAllUsers());
//     dispatch(getAllWithdrawal());
//     dispatch(getAllDeposite());
//   }, [dispatch]);

//   function findLastEntryByCreatedAt(arr) {
//     return arr?.reduce(
//       (acc, current) => (acc.created_at > current.created_at ? acc : current),
//       {}
//     );
//   }

//   const combinedArray = users?.map((user) => {
//     let lastWithdrawal = findLastEntryByCreatedAt(
//       allwithdrawal?.filter((w) => w.user_id === user.id)
//     );
//     let lastDeposit = findLastEntryByCreatedAt(
//       alldeposite?.filter((d) => d.user_id === user.id)
//     );
//     return {
//       id: user?.id,
//       name: user?.username,
//       last_login: user?.last_login,
//       created_at: user?.created_at,
//       updated_at: user?.updated_at,
//       active_plan: user?.active_plan,
//       activation_date: user?.activation_date,
//       last_withdrawal_created_at: lastWithdrawal?.createdAT || null,
//       last_withdrawal_amount: lastWithdrawal?.amount || null,
//       last_deposit_created_at: lastDeposit?.createdAT || null,
//       last_deposit_amount: lastDeposit?.amount || null,
//     };
//   });

//   useEffect(() => {
//     setAllUser(combinedArray);
//     if (searchQuery) {
//       setAllUser(
//         combinedArray?.filter((p) =>
//           p.name?.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     }
//   }, [searchQuery, combinedArray]);

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = (searchQuery ? allUser : combinedArray)?.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );
//   const totalPages = Math.ceil(
//     (searchQuery ? allUser : combinedArray)?.length / itemsPerPage
//   );

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="admin-dark p-4">
//       <div className="admin-table-bg rounded-md shadow-sm  p-4">
//         <div className="flex justify-end">
//           <label htmlFor="email" className="sr-only">
//             Search
//           </label>
//           <input
//             id="search"
//             name="search"
//             value={searchQuery}
//             onChange={(e) => handleSearch(e)}
//             type="text"
//             placeholder="search here . . ."
//             className="block w-full px-2 py-2  border border-white/20 admin-primary-bg  rounded-md shadow-sm md:max-w-sm  placeholder:text-gray-300 sm:text-base sm:leading-6"
//           />
//         </div>
//         {message && <SuccessAlert message={message} />}
//         {error && <ErrorAlert error={error} />}

//         <div
//           className={`${
//             loading ? "h-[560px] items-center" : "h-full"
//           } overflow-x-auto custom-scroll`}
//         >
//           {loading ? (
//             <Loader />
//           ) : (
//             <div className="flow-root mt-4">
//               <div className="inline-block min-w-full">
//                 <table className="min-w-full overflow-hidden">
//                   <thead className="text-sm">
//                     <tr className="admin-thead border-b border-white/20">
//                       <th className="px-3 py-2 font-medium text-sm border-r border-white/20 text-left">
//                         Name
//                       </th>
//                       <th className="px-3 py-2 font-medium text-sm border-r border-white/20">
//                         Last Deposit
//                       </th>
//                       <th className="px-3 py-2 font-medium text-sm border-r border-white/20 text-right">
//                         Last Withdrawal
//                       </th>
//                       <th className="px-3 py-2 font-medium text-sm border-r border-white/20 text-right">
//                         Activation Date
//                       </th>
//                       <th className="px-3 py-2 font-medium text-sm border-r border-white/20">
//                         Last Update
//                       </th>
//                       <th className="px-3 py-2 font-medium text-sm border-r border-white/20">
//                         Last Login
//                       </th>
//                       <th className="px-3 py-2 font-medium text-sm border-r border-white/20">
//                         Created At
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentData?.map((item, index) => (
//                       <tr
//                         key={index}
//                         className="border-b admin-primary-bg border-white/20 hover:admin-sub-bg"
//                       >
//                         <td className="px-3 py-2 border-r border-white/20">
//                           <div className="truncate text-sm font-medium">
//                             {item?.name}
//                           </div>
//                         </td>
//                         <td className="px-3 py-2 border-r border-white/20">
//                           <div className="text-sm">
//                             {new Date(
//                               item?.last_deposit_created_at
//                             ).toLocaleDateString()}
//                           </div>
//                           <div className="mt-1 px-2 py-1 text-xs rounded bg-gray-700/40 ring-1 ring-inset ring-white/10">
//                             {item?.last_deposit_amount}
//                           </div>
//                         </td>
//                         <td className="px-3 py-2 border-r border-white/20 text-right">
//                           <div className="text-sm">
//                             {new Date(
//                               item?.last_withdrawal_created_at
//                             ).toLocaleDateString()}
//                           </div>
//                           <div className="mt-1 px-2 py-1 text-xs rounded bg-gray-700/40 ring-1 ring-inset ring-white/10">
//                             {item?.last_withdrawal_amount}
//                           </div>
//                         </td>
//                         <td className="px-3 py-2 border-r border-white/20 text-sm">
//                           {item?.activation_date}
//                         </td>
//                         <td className="px-3 py-2 border-r border-white/20 text-sm">
//                           {new Date(item?.updated_at).toLocaleDateString()}
//                         </td>
//                         <td className="px-3 py-2 border-r border-white/20 text-sm">
//                           {new Date(item?.last_login).toLocaleDateString()}
//                         </td>
//                         <td className="px-3 py-2 border-r border-white/20 text-sm">
//                           {new Date(item?.created_at).toLocaleDateString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 <div className="flex justify-between p-4 ">
//                   <button
//                     onClick={handlePrevious}
//                     disabled={currentPage === 1}
//                     className={`px-5 text-lg py-1 rounded-md ${
//                       currentPage === 1
//                         ? "bg-green-700 text-gray-300 cursor-not-allowed"
//                         : "bg-[#D4AF37] text-white"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={handleNext}
//                     disabled={currentPage === totalPages}
//                     className={`px-5 py-1 text-lg rounded-md ${
//                       currentPage === totalPages
//                         ? "bg-green-700 text-gray-300 cursor-not-allowed"
//                         : "bg-[#D4AF37] text-white"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeposite } from "../../redux/depositeSlice";
import { getAllUsers } from "../../redux/userSlice";
import { getAllWithdrawal } from "../../redux/withdrawalSlice";
import Loader from "../../components/common/Loader";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import { Search, ChevronLeft, ChevronRight, RefreshCw, FileText, Users, DollarSign, Clock } from "lucide-react";

export default function Reports() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { allwithdrawal } = useSelector((state) => state.allwithdrawal);
  const { alldeposite, loading, error, message } = useSelector(
    (state) => state.alldeposite
  );

  const [allUser, setAllUser] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [dispatch]);

  const fetchAllData = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(getAllUsers()),
      dispatch(getAllWithdrawal()),
      dispatch(getAllDeposite())
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  function findLastEntryByCreatedAt(arr) {
    if (!arr || arr.length === 0) return {};
    return arr.reduce(
      (acc, current) => (acc.created_at > current.created_at ? acc : current),
      {}
    );
  }

  const combinedArray = users?.map((user) => {
    let lastWithdrawal = findLastEntryByCreatedAt(
      allwithdrawal?.filter((w) => w.user_id === user.id)
    );
    let lastDeposit = findLastEntryByCreatedAt(
      alldeposite?.filter((d) => d.user_id === user.id)
    );
    return {
      id: user?.id,
      name: user?.username,
      last_login: user?.last_login,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
      active_plan: user?.active_plan,
      activation_date: user?.activation_date,
      last_withdrawal_created_at: lastWithdrawal?.createdAT || lastWithdrawal?.created_at || null,
      last_withdrawal_amount: lastWithdrawal?.amount || null,
      last_deposit_created_at: lastDeposit?.createdAT || lastDeposit?.created_at || null,
      last_deposit_amount: lastDeposit?.amount || null,
    };
  });

  useEffect(() => {
    setAllUser(combinedArray);
    if (searchQuery) {
      setAllUser(
        combinedArray?.filter((p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, combinedArray]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = (searchQuery ? allUser : combinedArray)?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (searchQuery ? allUser : combinedArray)?.length / itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const totalDeposits = alldeposite?.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0) || 0;
  const totalWithdrawals = allwithdrawal?.reduce((sum, w) => sum + parseFloat(w.amount || 0), 0) || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950/20 to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-slate-400 text-sm mt-1">User activity and transaction reports</p>
            </div>
          </div>
          <button 
            onClick={fetchAllData}
            disabled={refreshing}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-in fade-in-up duration-500 delay-100">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#F5C518] opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Users</p>
                <p className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Registered users</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F5C518]/20">
                <Users className="w-6 h-6 text-[#F5C518]" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Deposits</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalDeposits)}</p>
                <p className="text-xs text-slate-500 mt-1">From {alldeposite?.length || 0} transactions</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600 to-rose-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Withdrawals</p>
                <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalWithdrawals)}</p>
                <p className="text-xs text-slate-500 mt-1">From {allwithdrawal?.length || 0} transactions</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/20">
                <DollarSign className="w-6 h-6 text-rose-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden animate-in fade-in-up duration-500 delay-200">
          {/* Search Bar */}
          <div className="p-5 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#F5C518]" />
                <h2 className="text-white font-semibold text-lg">User Activity Report</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#F5C518]/20 text-[#F5C518]">
                  {combinedArray?.length || 0} users
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="search"
                  name="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search by name..."
                  className="block w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all sm:w-80"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {message && (
            <div className="mx-5 mt-4">
              <SuccessAlert message={message} />
            </div>
          )}
          {error && (
            <div className="mx-5 mt-4">
              <ErrorAlert error={error} />
            </div>
          )}

          <div className={`${loading ? "min-h-[400px] flex items-center justify-center" : ""}`}>
            {loading ? (
              <Loader isLoading={loading} />
            ) : (
              <>
                <div className="overflow-x-auto custom-scroll">
                  <table className="w-full">
                    <thead className="bg-white/10 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Deposit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Withdrawal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Activation Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Update</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Login</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentData?.length > 0 ? (
                        currentData.map((item, index) => (
                          <tr key={index} className="hover:bg-white/5 transition-all duration-300 group animate-in fade-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">
                                {item?.name || 'N/A'}
                              </div>
                             </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-slate-400">
                                {formatDate(item?.last_deposit_created_at)}
                              </div>
                              {item?.last_deposit_amount && (
                                <div className="mt-1 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400">
                                  {formatCurrency(item?.last_deposit_amount)}
                                </div>
                              )}
                             </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-slate-400">
                                {formatDate(item?.last_withdrawal_created_at)}
                              </div>
                              {item?.last_withdrawal_amount && (
                                <div className="mt-1 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-400">
                                  {formatCurrency(item?.last_withdrawal_amount)}
                                </div>
                              )}
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm text-slate-300">
                                {item?.activation_date ? formatDate(item.activation_date) : 'N/A'}
                              </span>
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                              {formatDate(item?.updated_at)}
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                              {formatDate(item?.last_login)}
                             </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                              {formatDate(item?.created_at)}
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Search className="w-6 h-6 text-slate-500" />
                              </div>
                              <p className="text-slate-400">No users found</p>
                              {searchQuery && (
                                <button
                                  onClick={handleClearSearch}
                                  className="text-sm text-[#F5C518] hover:text-[#f0d060] transition-colors"
                                >
                                  Clear search
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-white/10">
                    <div className="text-sm text-slate-400">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, (searchQuery ? allUser : combinedArray)?.length || 0)} of {(searchQuery ? allUser : combinedArray)?.length || 0} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="group px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 hover:scale-105"
                      >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-white rounded-lg shadow-lg shadow-[#F5C518]/25">
                          {currentPage}
                        </span>
                        <span className="text-slate-400 text-sm">of {totalPages}</span>
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="group px-4 py-2 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 hover:scale-105"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}