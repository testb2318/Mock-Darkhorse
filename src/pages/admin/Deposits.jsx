import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import AdminPagination from "../../components/common/AdminPagination";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import Loader from "../../components/common/Loader";
import { useParams } from "react-router-dom";
import {
  getAllDeposite,
  deleteDeposite,
  clearErrors,
  clearMessage,
  updateDeposite,
} from "../../redux/depositeSlice";
import Confirmation from "../../components/modals/Confirmation";
import { getAllUsers } from "../../redux/userSlice";
import { Check, Edit, Eye, TimerReset, Trash, RefreshCw, Filter, Search, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, User } from "lucide-react";

export default function Deposits() {
  const { action } = useParams();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editableDeposite, setEditableDeposite] = useState(null);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterquery, setFilterquery] = useState("");
  const [values, setValues] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const { alldeposite, loading, error, message } = useSelector(
    (state) => state.alldeposite
  );
  const { users } = useSelector((state) => state.users || {});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(getAllDeposite()),
      dispatch(getAllUsers())
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    if (action) {
      setFilterquery(action);
    }
  }, [action]);

  // Memoized filtered data
  const filteredDeposits = useMemo(() => {
    if (!alldeposite || !Array.isArray(alldeposite)) return [];
    
    return alldeposite.filter((item) => {
      const matchesStatus = filterquery ? item?.status === filterquery : true;
      const user = users?.find((u) => u?.id === item?.user_id);
      const matchesSearch = searchQuery 
        ? user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.amount?.toString().includes(searchQuery)
        : true;
      
      return matchesStatus && matchesSearch;
    });
  }, [alldeposite, filterquery, searchQuery, users]);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'inprogress':
        return 'bg-[#F5C518]/20 text-[#F5C518] border-[#F5C518]/30';
      case 'decline':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'inprogress':
        return <TimerReset className="w-3 h-3" />;
      case 'decline':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => {
    setModalOpen(false);
    setPreviewImage(null);
  };

  const handleEdit = (item) => {
    setEditableDeposite(item);
    setEditMode(true);
    setValues(item.status);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableDeposite(null);
    setValues(undefined);
  };

  const handleChange = (e) => {
    setValues(e.target.value);
  };

  const handleSaveChange = (id) => {
    if (editableDeposite) {
      dispatch(
        updateDeposite({
          id: id,
          status: values,
          amount: editableDeposite?.amount,
          user_id: editableDeposite?.user_id,
        })
      );
      setEditMode(false);
      setEditableDeposite(null);
      setValues(undefined);
    }
  };

  const handleImageClick = (imageName) => {
    setPreviewImage(`/uploads/${imageName}`);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const handleClearFilters = () => {
    setFilterquery("");
    setSearchQuery("");
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterquery, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredDeposits.length / ITEMS_PER_PAGE));
  
  const paginatedDeposits = useMemo(() => {
    const reversedDeposits = [...filteredDeposits].reverse();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return reversedDeposits.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDeposits, currentPage]);

  const handlePageChange = (direction) => {
    if (direction === 'prev') setCurrentPage((p) => Math.max(1, p - 1));
    if (direction === 'next') setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  // Calculate statistics
  const totalDeposits = filteredDeposits.length;
  const totalAmount = filteredDeposits.reduce((sum, d) => sum + (d.amount || 0), 0);
  const pendingCount = filteredDeposits.filter(d => d.status === 'pending').length;
  const completedCount = filteredDeposits.filter(d => d.status === 'complete').length;

  if (loading && filteredDeposits.length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Deposit Management
              </h1>
              <p className="text-slate-400 text-sm mt-1">Manage and monitor all deposit transactions</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#F5C518] opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Deposits</p>
              <p className="text-2xl font-bold text-white">{totalDeposits}</p>
              <p className="text-xs text-slate-500 mt-1">Total transactions</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-[#F5C518]/20">
              <DollarSign className="w-6 h-6 text-[#F5C518]" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-400">${totalAmount.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">Total deposited amount</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-emerald-500/20">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
              <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-amber-500/20">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5 hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <p className="text-slate-400 text-sm font-medium mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
              <p className="text-xs text-slate-500 mt-1">Successfully processed</p>
            </div>
            <div className="absolute right-5 top-5 p-3 rounded-xl bg-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
          
          {/* Filters Section */}
          <div className="p-5 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#F5C518]" />
                <h2 className="text-white font-semibold text-lg">Deposit Transactions</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#F5C518]/20 text-[#F5C518]">
                  {totalDeposits} deposits
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={filterquery}
                    onChange={(e) => setFilterquery(e.target.value)}
                    className="pl-9 pr-8 py-2 bg-gray/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0a0a0a] text-white">All Status</option>
                    <option value="complete" className="bg-[#0a0a0a] text-emerald-400">Complete</option>
                    <option value="decline" className="bg-[#0a0a0a] text-rose-400">Decline</option>
                    <option value="pending" className="bg-[#0a0a0a] text-amber-400">Pending</option>
                    <option value="inprogress" className="bg-[#0a0a0a] text-[#F5C518]">In Progress</option>
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search by email or amount..."
                    className="pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 w-full sm:w-64"
                  />
                </div>
                {(filterquery || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Clear filters
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

          <div className="overflow-x-auto custom-scroll">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <span className="ml-3 text-slate-400">Loading data...</span>
              </div>
            ) : filteredDeposits.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <DollarSign className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-400 text-lg">No deposit transactions found</p>
                {(searchQuery || filterquery) && (
                  <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Sr No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Receipt</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Request/Action</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {paginatedDeposits.map((item, index) => {
                    const user = users?.find((u) => u?.id === item?.user_id);
                    return (
                      <tr key={item?.id || index} className="hover:bg-white/5 transition-all duration-300">
                        <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/admin/check/profile/${item?.user_id}`} className="block">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {user?.username || 'N/A'}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {user?.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-emerald-400">${item?.amount?.toFixed(2) || '0.00'}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {editMode && editableDeposite?.id === item?.id ? (
                            <select
                              value={values}
                              onChange={handleChange}
                              className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                            >
                              <option value="pending">Pending</option>
                              <option value="inprogress">In Progress</option>
                              <option value="decline">Decline</option>
                              <option value="complete">Complete</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item?.status)}`}>
                              {getStatusIcon(item?.status)}
                              {item?.status || 'N/A'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item?.image_name ? (
                            <button
                              onClick={() => handleImageClick(item?.image_name)}
                              className="text-[#F5C518] hover:text-[#f0d060] text-sm font-medium transition-colors hover:underline"
                            >
                              📎 View Receipt
                            </button>
                          ) : (
                            <span className="text-slate-500 text-sm">No receipt</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-slate-400 space-y-1">
                            <div>📅 {formatDateTime(item?.createdAT)}</div>
                            {item?.acceptat && <div>✅ {formatDateTime(item?.acceptat)}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-3">
                            <Link to={`/user/profile/${item?.user_id}`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                              <Eye className="w-4 h-4" />
                            </Link>
                            {editMode && editableDeposite?.id === item?.id ? (
                              <>
                                <button onClick={() => handleSaveChange(item?.id)} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={handleCancelEdit} className="text-rose-400 hover:text-rose-300 transition-colors">
                                  <TimerReset className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                {/* <button onClick={() => handleEdit(item)} className="text-[#F5C518] hover:text-[#f0d060] transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item?.id)} className="text-rose-400 hover:text-rose-300 transition-colors">
                                  <Trash className="w-4 h-4" />
                                </button> */}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination */}
          {!loading && filteredDeposits.length > 0 && (
            <div className="px-5 pb-4 mt-4">
              <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50" onClick={handleClosePreview}>
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Preview"
              className="object-contain max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            />
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalOpen && (
        <Confirmation
          isClose={isClose}
          id={deleteID}
          deletefunction={deleteDeposite}
        />
      )}
    </div>
  );
}







