import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import {
  getAllTopup,
  deleteTopup,
  clearErrors,
  clearMessage,
  updateTopup,
} from "../../redux/topupSlice";
import { getAllUsers } from "../../redux/userSlice";
import Confirmation from "../../components/modals/Confirmation";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Check,
  X,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Wallet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function TopupList() {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editableTopup, setEditableTopup] = useState(null);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [filterquery, setFilterquery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { alltopup, loading, error, message } = useSelector(
    (state) => state.alltopup
  );
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    await Promise.all([dispatch(getAllTopup()), dispatch(getAllUsers())]);
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

  // Memoized filtered data
  const filteredTopups = useMemo(() => {
    if (!alltopup || !Array.isArray(alltopup)) return [];

    return alltopup.filter((item) => {
      const matchesStatus = filterquery ? item?.status === filterquery : true;
      const matchesSearch = searchQuery
        ? item?.amount?.toString().includes(searchQuery) ||
        item?.userby_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.userto_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.id?.toString().includes(searchQuery)
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [alltopup, filterquery, searchQuery]);

  // Calculate statistics
  const stats = {
    total: filteredTopups.length,
    totalAmount: filteredTopups.reduce((sum, item) => sum + parseFloat(item?.amount || 0), 0),
    completed: alltopup?.filter((item) => item?.status === "complete")?.length || 0,
    pending: alltopup?.filter((item) => item?.status === "pending")?.length || 0,
    declined: alltopup?.filter((item) => item?.status === "decline")?.length || 0,
    totalOverall: alltopup?.length || 0,
    totalAmountOverall: alltopup?.reduce((sum, item) => sum + parseFloat(item?.amount || 0), 0) || 0,
  };

  // Pagination calculations
  const totalItems = filteredTopups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredTopups.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterquery]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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
    setEditableTopup(item);
    setEditMode(true);
    setValues({ status: item.status });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableTopup(null);
    setValues({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChange = (id) => {
    if (editableTopup) {
      dispatch(updateTopup({ id: id, updatedData: values }));
      setEditMode(false);
      setEditableTopup(null);
    }
  };

  const handleClearFilters = () => {
    setFilterquery("");
    setSearchQuery("");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "decline":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "inprogress":
        return "bg-[#F5C518]/20 text-[#F5C518] border-[#F5C518]/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "decline":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const statsData = [
    { title: "Total Transactions", value: stats.totalOverall, filteredValue: stats.total, icon: TrendingUp, color: "blue" },
    { title: "Total Amount", value: `$${stats.totalAmountOverall.toLocaleString()}`, filteredValue: `$${stats.totalAmount.toLocaleString()}`, icon: DollarSign, color: "emerald" },
    { title: "Completed", value: stats.completed, icon: CheckCircle, color: "emerald" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "amber" },
    { title: "Declined", value: stats.declined, icon: AlertCircle, color: "rose" },
  ];

  const colorSchemes = {
    blue: { gradient: "from-[#D4AF37] to-[#F5C518]", bg: "bg-[#F5C518]/10", text: "text-[#F5C518]", iconBg: "bg-[#F5C518]/20" },
    emerald: { gradient: "from-emerald-600 to-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400", iconBg: "bg-emerald-500/20" },
    amber: { gradient: "from-amber-600 to-amber-500", bg: "bg-amber-500/10", text: "text-amber-400", iconBg: "bg-amber-500/20" },
    rose: { gradient: "from-rose-600 to-rose-500", bg: "bg-rose-500/10", text: "text-rose-400", iconBg: "bg-rose-500/20" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Topup Management
              </h1>
              <p className="text-slate-400 text-sm mt-1">Monitor and manage all topup transactions</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? "animate-spin" : "group-hover:rotate-180"}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            const colors = colorSchemes[stat.color];
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 hover:scale-105 transition-all duration-300 group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium mb-1">{stat.title}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    {stat.filteredValue && (
                      <p className="text-xs text-slate-500 mt-1">Filtered: {stat.filteredValue}</p>
                    )}
                  </div>
                  <div className={`p-2 rounded-xl ${colors.iconBg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error} />}

        {/* Filters */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by amount, email, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
              />
            </div>
            <div className="lg:w-56 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={filterquery}
                onChange={(e) => setFilterquery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0a0a0a] text-white">All Status</option>
                <option value="complete" className="bg-[#0a0a0a] text-emerald-400">Complete</option>
                <option value="decline" className="bg-[#0a0a0a] text-rose-400">Decline</option>
                <option value="pending" className="bg-[#0a0a0a] text-amber-400">Pending</option>
                <option value="inprogress" className="bg-[#0a0a0a] text-[#F5C518]">In Progress</option>
              </select>
            </div>
            <div className="lg:w-36">
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 cursor-pointer"
              >
                <option value={5} className="bg-[#0a0a0a] text-[#F5C518]">5 per page</option>
                <option value={10} className="bg-[#0a0a0a] text-[#F5C518]">10 per page</option>
                <option value={25} className="bg-[#0a0a0a] text-[#F5C518]">25 per page</option>
                <option value={50} className="bg-[#0a0a0a] text-[#F5C518]">50 per page</option>
                <option value={100} className="bg-[#0a0a0a] text-[#F5C518]">100 per page</option>
              </select>
            </div>
            {(filterquery || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-8 h-8 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 mt-2">Loading transactions...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No transactions found</h3>
                <p className="text-slate-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Topup By</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Topup To</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {currentData.map((item, index) => (
                    <tr key={item?.id || index} className="hover:bg-white/5 transition-all duration-300">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-sm font-mono text-[#F5C518]">#{item?.id}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {item?.userby_email?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <Link to={`/admin/check/profile/${item?.userby_id}`} className="text-sm text-white hover:text-[#F5C518] transition-colors">
                            {item?.userby_email}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {item?.userto_email?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <Link to={`/admin/check/profile/${item?.userto_id}`} className="text-sm text-white hover:text-emerald-400 transition-colors">
                            {item?.userto_email}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-base font-bold text-emerald-400">${parseFloat(item?.amount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {editMode && editableTopup?.id === item?.id ? (
                          <select
                            name="status"
                            value={values.status || item?.status}
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
                            {item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className="text-sm text-slate-400">{formatDate(item?.createdAT)}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {editMode && editableTopup?.id === item?.id ? (
                            <>
                              <button onClick={() => handleSaveChange(item?.id)} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={handleCancelEdit} className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg bg-[#F5C518]/20 text-[#F5C518] hover:bg-[#F5C518]/30 transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item?.id)} className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalItems > 0 && totalPages > 1 && (
            <div className="border-t border-white/10 px-5 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-slate-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
                  >
                    <ChevronsLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof page === "number" && handlePageChange(page)}
                        disabled={typeof page !== "number"}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${page === currentPage
                            ? "bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-white shadow-lg shadow-[#F5C518]/25"
                            : typeof page === "number"
                              ? "text-slate-400 hover:text-white hover:bg-white/10"
                              : "text-slate-500 cursor-default"
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all"
                  >
                    <ChevronsRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50" onClick={handleClosePreview}>
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="object-contain max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 p-2 text-white bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalOpen && (
        <Confirmation isClose={isClose} deletefunction={deleteTopup} id={deleteID} />
      )}
    </div>
  );
}
















