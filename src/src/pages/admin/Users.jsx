

import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { useUsers } from "../../hooks/useUsers";
import { useUserFiltering } from "../../hooks/useUserFiltering";
import SearchInput from "../../components/common/SearchInput";
import UserTable from "../../components/common/UserTable";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import Loader from "../../components/common/Loader";
import AdminCashHandle from "../../components/admin/AdminCashHandle";

// Updated usePagination hook embedded here for full context
const usePagination = (data, itemsPerPage = 30) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = React.useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const handlePagination = React.useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [totalPages, currentPage]);

  const resetPage = React.useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePagination,
    resetPage,
  };
};

// Enhanced Pagination component with better button design
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const maxVisible = 7; // Maximum number of page buttons to show
    let startPage, endPage;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than maxVisible
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages
      const halfVisible = Math.floor(maxVisible / 2);
      
      if (currentPage <= halfVisible) {
        startPage = 1;
        endPage = maxVisible;
      } else if (currentPage + halfVisible >= totalPages) {
        startPage = totalPages - maxVisible + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-slate-300 bg-[#2e1402]/50 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* First page + ellipsis if needed */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm font-medium text-slate-300 bg-[#a04708]/50 border border-white/10 rounded-lg hover:bg-[#F5C518]/20 hover:text-[#F5C518] hover:border-[#F5C518]/30 transition-all duration-200"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 py-2 text-slate-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            page === currentPage
              ? "bg-[#D4AF37] text-white border border-[#D4AF37] shadow-md shadow-[#F5C518]/25"
              : "text-slate-300 bg-[#111]/50 border border-white/10 hover:bg-[#F5C518]/20 hover:text-[#F5C518] hover:border-[#F5C518]/30"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page + ellipsis if needed */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 py-2 text-slate-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm font-medium text-slate-300 bg-[#111]/50 border border-white/10 rounded-lg hover:bg-[#F5C518]/20 hover:text-[#F5C518] hover:border-[#F5C518]/30 transition-all duration-200"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-slate-300 bg-[#111]/50 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const Users = () => {
  const { action } = useParams();
  const dispatch = useDispatch();
  const { userLogin } = useAuth();
  const { users, loading, resetError, resetMessage, fetchAllUsers } =
    useUsers();
  const { message, error } = useSelector((state) => state.allwithdrawal);

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [modalopen, setModalopen] = useState(false);
  const [deleteID, setdeleteID] = useState();
  const [cashHandle, setCashHandle] = useState(null);
  const [userCashData, setUserCashData] = useState({
    userId: null,
    name: null,
    balance: null,
    profitWallet: null,
    roi: null,
  });

  // Custom hooks
  const filteredUsers = useUserFiltering(users, searchQuery, action);
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedUsers,
    handlePagination,
    resetPage,
  } = usePagination(filteredUsers,30);

  // Effects
  useLayoutEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (error) {
      const errorInterval = setInterval(() => {
        resetError();
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    // if (message) {
    //   const messageInterval = setInterval(() => {
    //     resetMessage();
    //   }, 3000);
    //   return () => clearInterval(messageInterval);
    // }
  }, [error, message]);

  useEffect(() => {
    resetPage();
  }, [searchQuery, resetPage]);

  // Event handlers
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value.toLowerCase());
  }, []);

  const handleDelete = useCallback((id) => {
    setdeleteID(id);
    setModalopen(true);
  }, []);

  const handleCash = useCallback((action, user) => {
    setCashHandle(action);
    setUserCashData({
      userId: user?.id,
      name: user?.username,
      balance: user?.business,
      profitWallet:
        Number(user?.level_month || 0) +
        Number(user?.direct_income || 0) +
        Number(user?.salary || 0) +
        Number(user?.reward || 0),
      roi: user?.roi_income,
    });
  }, []);

  const handleSession = useCallback(
    (user) => {
      const values = { email: user.email, password: user.password };
      userLogin(values);
      window.open("/user/dashboard", "_blank");
    },
    [dispatch]
  );

  const handleCashModelClose = useCallback(() => {
    setCashHandle(null);
    setUserCashData({
      userId: null,
      name: null,
      balance: null,
      profitWallet: null,
      roi: null,
    });
  }, []);

  return (
    <div className="p-2 sm:p-4 min-h-screen bg-gradient-to-br from-black via-slate-950 to-[#5b2b01]">
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-lg">Users Management</h2>
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#a65606]/20 text-[#F5C518]">
              {filteredUsers?.length || 0} users
            </span>
          </div>
          <SearchInput value={searchQuery} onChange={handleSearch} />
        </div>

        {message && <div className="mb-4"><SuccessAlert message={message} /></div>}
        {error && <div className="mb-4"><ErrorAlert error={error} /></div>}

        <div className={`${loading ? "h-[560px] items-center" : "h-full"}`}>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-3 border-[#F5C518]/30 border-t-yellow-700 rounded-full animate-spin"></div>
              <span className="ml-3 text-slate-400">Loading users...</span>
            </div>
          ) : (
            <UserTable
              users={paginatedUsers}
              currentPage={currentPage}
              itemsPerPage={30}
              onHandleCash={handleCash}
              onHandleSession={handleSession}
              onHandleDelete={handleDelete}
            />
          )}
        </div>

        {cashHandle && (
          <AdminCashHandle
            HandleCashmodel={handleCashModelClose}
            cashHandle={cashHandle}
            userId={userCashData.userId}
            name={userCashData.name}
            balance={userCashData.balance}
            profitWallet={userCashData.profitWallet}
            roi={userCashData.roi}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePagination}
        />
      </div>
    </div>
  );
};

export default Users;





















































