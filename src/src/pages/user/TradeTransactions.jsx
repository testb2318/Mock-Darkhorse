
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/common/Loader";
import {
  getTransactionById,
  clearErrors,
  clearMessage,
} from "../../redux/transactionSlice";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
};

function StatCard({ label, value, accent }) {
  const accentMap = {
    blue: "from-[#1A6FA8] to-[#4DD9C0]",
    gold: "from-[#F5C518] to-[#E8A800]",
    teal: "from-[#4DD9C0] to-[#1A6FA8]",
    slate: "from-slate-500 to-slate-600",
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative glass-card animated-border-gold rounded-2xl p-0.5 group"
    >
      <div className="bg-black/40 rounded-2xl p-6 h-full relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b ${accentMap[accent] || accentMap.blue} rounded-l-2xl`}
        />
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4DD9C0]/5 rounded-full blur-xl group-hover:bg-[#4DD9C0]/10 transition-all duration-500" />
      <p className="text-[9px] font-black tracking-[3px] uppercase text-slate-500 mb-2">
        {label}
      </p>
      <h3 className="font-['Orbitron',sans-serif] text-2xl font-black text-white tracking-tight">
        {value}
      </h3>
      </div>
    </motion.div>
  );
}

export default function TradeTransactions() {
  const table_name = "roi_transaction";
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state.auth);
  const { transaction, loading, error, message } = useSelector(
    (state) => state.transaction
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const entriesPerPage = 20;

  useEffect(() => {
    if (table_name && auth?.id) {
      dispatch(getTransactionById({ table_name, user_id: auth.id }));
    }
  }, [dispatch, table_name, auth?.id]);

  useEffect(() => {
    let errorInterval, messageInterval;
    if (error) errorInterval = setInterval(() => dispatch(clearErrors()), 3000);
    if (message) messageInterval = setInterval(() => dispatch(clearMessage()), 3000);
    return () => {
      if (errorInterval) clearInterval(errorInterval);
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [error, message, dispatch]);

  const transactionTypes = useMemo(() => {
    if (!transaction?.length) return [];
    const types = new Set();
    transaction.forEach((item) => {
      const type =
        table_name === "invest_level_transaction"
          ? item?.type
          : table_name.split("_")[0];
      if (type) types.add(type.toLowerCase());
    });
    return Array.from(types);
  }, [transaction, table_name]);

  const processedTransactions = useMemo(() => {
    if (!transaction?.length) return [];
    let data = [...transaction].reverse();

    if (activeTab !== "all") {
      data = data.filter((item) => {
        const itemType =
          table_name === "invest_level_transaction"
            ? item?.type
            : table_name.split("_")[0];
        return itemType?.toLowerCase() === activeTab.toLowerCase();
      });
    }

    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some(
          (v) => v && v.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return data;
  }, [transaction, activeTab, searchTerm, table_name]);

  const totalPages = Math.max(1, Math.ceil(processedTransactions.length / entriesPerPage));
  const currentTransactions = useMemo(
    () =>
      processedTransactions.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      ),
    [processedTransactions, currentPage, entriesPerPage]
  );

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };
  const goToPreviousPage = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };

  const formatCurrency = (v) =>
    v
      ? new Intl.NumberFormat("en-US", { 
  style: "currency", 
  currency: "USD", 
  minimumFractionDigits: 3, 
  maximumFractionDigits: 8 
}).format(v) : "$0.00";

  const formatDate = (ds) =>
    ds
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(ds))
      : "";

  const totalRevenue = transaction
    ?.filter((i) => i.tr_type === "credit")
    .reduce((a, b) => a + (parseFloat(b.amount) || 0), 0);

  const recentPayout =
    transaction?.length > 0
      ? formatCurrency(transaction[transaction.length - 1]?.amount)
      : "$0.00";

  // ── User initials from auth.fullname ──────────────────────────────────────
  const userInitials = auth?.fullname
    ? auth.fullname
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "Zy";

  const TABLE_HEADERS = ["Ref", "Amount", "Status", "Principle", "Yield", "Handler", "Date"];

  return (
    <div className="relative min-h-screen bg-transparent text-slate-200 p-4 lg:p-8 overflow-hidden font-['Rajdhani',sans-serif]">

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[180px] rounded-full bg-[#F5C518]/3 blur-[100px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-7xl mx-auto"
      >

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
        >
          <div className="flex items-center gap-4">
            {/* User initials ring */}
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-[#4DD9C0]" />
              <div className="absolute -inset-[6px] rounded-full border border-[#1A6FA8]/50" />
              <span className="font-['Orbitron',sans-serif] text-xl font-black text-[#F5C518] leading-none">
                {userInitials}
              </span>
            </div>

            <div>
              <h1 className="font-['Orbitron',sans-serif] text-3xl lg:text-4xl font-black text-white tracking-wider uppercase">
                ROI{" "}
                <span className="text-[#4DD9C0]">Ledger</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#4DD9C0] animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">
                  Live Transaction Stream
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-80 group">
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full glass-card bg-black/40 border border-yellow-500/20 rounded-2xl px-12 py-3.5 text-sm text-white placeholder-slate-400 outline-none focus:border-yellow-500/50 transition-all duration-200 font-['Rajdhani',sans-serif] font-semibold"
              placeholder="Search by ID, Amount..."
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-yellow-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <StatCard label="Total Data" value={transaction?.length || 0} accent="blue" />
          <StatCard label="Revenue" value={formatCurrency(totalRevenue)} accent="gold" />
          <StatCard label="Recent Payout" value={recentPayout} accent="teal" />
          <StatCard label="Filtered" value={processedTransactions.length} accent="slate" />
        </motion.div>

        {transactionTypes.length > 1 && (
          <motion.div variants={itemVariants} className="flex gap-2 mb-6 flex-wrap">
            {["all", ...transactionTypes].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#4DD9C0]/15 border-[#4DD9C0]/50 text-[#4DD9C0]"
                    : "bg-[#0D1520] border-[#1A2E45] text-slate-500 hover:border-[#4DD9C0]/30 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="glass-card animated-border-gold rounded-3xl p-0.5 mb-6"
        >
          <div className="bg-black/40 rounded-[1.8rem] overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/40 border-b border-yellow-500/20">
                  <tr>
                    {TABLE_HEADERS.map((h) => (
                      <th
                        key={h}
                        className="px-6 py-5 text-[12px] font-black uppercase tracking-[3px] text-yellow-500/70"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-500/10">
                  <AnimatePresence>
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-yellow-500/5 transition-colors group"
                        >
                          <td className="px-6 py-5 text-[11px] font-bold text-slate-600">
                            {(currentPage - 1) * entriesPerPage + index + 1}
                          </td>
                          <td
                            className={`px-6 py-5 font-['Orbitron',sans-serif] text-[15px] font-black ${
                              item.tr_type === "debit"
                                ? "text-rose-400"
                                : "text-[#3DFFC0]"
                            }`}
                          >
                            {item.tr_type === "debit"
                              ? `-${formatCurrency(item?.amount)}`
                              : `+${formatCurrency(item?.amount)}`}
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-[#1A6FA8]/15 text-[#4DD9C0] border border-[#4DD9C0]/20">
                              ROI Stream
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm font-bold text-white-500">
                            ${item?.onamount || "0.00"}
                          </td>
                          <td className="px-6 py-5 font-['Orbitron',sans-serif] text-sm font-black text-[#4DD9C0]">
                            {item?.percent}%
                          </td>
                          <td className="px-6 py-5 text-sm font-semibold text-slate-400">
                            {item.transaction_by}
                          </td>
                          <td className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-white-500">
                            {formatDate(item?.createdAt)}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-20 text-center text-[11px] font-black uppercase tracking-[4px] text-slate-600"
                        >
                          No Transactions Found
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          </div>
        </motion.div>

        {!loading && (
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center glass-card bg-black/40 border border-yellow-500/20 rounded-2xl px-6 py-4"
          >
            <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">
              Viewing{" "}
              <span className="text-white">Page {currentPage}</span>
              <span className="text-slate-600"> / {totalPages}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-black/40 border border-yellow-500/20 disabled:opacity-20 hover:border-yellow-500 hover:text-yellow-500 transition-all text-white flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-black/40 border border-yellow-500/20 disabled:opacity-20 hover:border-yellow-500 hover:text-yellow-500 transition-all text-white flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}