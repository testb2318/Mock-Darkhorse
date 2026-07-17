
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/common/Loader";
import { fetchRewardLevelTransactions } from "../../redux/rewardTransaction";

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
      className="relative bg-[#0D1520] border border-[#1A2E45] rounded-2xl p-6 overflow-hidden group transition-all duration-300 hover:border-[#4DD9C0]/50"
    >
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
    </motion.div>
  );
}

export default function RewardLevelTransactions() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);

  const { rewardLevelTransactions: transaction, loading } = useSelector(
    (state) => state.rewardTransaction
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const entriesPerPage = 20;

  useEffect(() => {
    if (auth?.id) {
      dispatch(fetchRewardLevelTransactions(auth.id));
    }
  }, [dispatch, auth?.id]);

  const processedTransactions = useMemo(() => {
    if (!transaction?.length) return [];
    let data = [...transaction].reverse();

    if (searchTerm) {
      data = data.filter((item) =>
        Object.values(item).some(
          (v) =>
            v && v.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return data;
  }, [transaction, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(processedTransactions.length / entriesPerPage)
  );

  const currentTransactions = useMemo(
    () =>
      processedTransactions.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      ),
    [processedTransactions, currentPage, entriesPerPage]
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const formatCurrency = (v) =>
    v != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(v)
      : "$0.00";

  const formatDate = (ds) =>
    ds
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(ds))
      : "";

  // ✅ totalRevenue = sum of reward_income
  const totalRevenue = transaction
    ?.reduce((a, b) => a + (parseFloat(b.reward_income) || 0), 0);

  // ✅ recentPayout = last item ka reward_income
  const recentPayout =
    transaction?.length > 0
      ? formatCurrency(transaction[transaction.length - 1]?.reward_income)
      : "$0.00";

  const userInitials = auth?.fullname
    ? auth.fullname
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "U";

  // ✅ Updated headers matching backend fields
  const TABLE_HEADERS = [
    "Ref",
    "ROI Amount",
    "Reward Income",
    "Percent",
    "Total Levels",
    "Date",
  ];

  return (
    <div className="relative min-h-screen bg-[#060B14] text-slate-200 p-4 lg:p-8 m-4 overflow-hidden font-['Rajdhani',sans-serif]">

      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [-40, 40, -40], y: [0, 80, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#1A6FA8]/15 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [40, -40, 40], y: [0, -80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#4DD9C0]/10 blur-[120px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[180px] rounded-full bg-[#F5C518]/3 blur-[100px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-[#4DD9C0]" />
              <div className="absolute -inset-[6px] rounded-full border border-[#1A6FA8]/50" />
              <span className="font-['Orbitron',sans-serif] text-xl font-black text-[#F5C518] leading-none">
                {userInitials}
              </span>
            </div>

            <div>
              <h1 className="font-['Orbitron',sans-serif] text-3xl lg:text-4xl font-black text-white tracking-wider uppercase">
                Reward <span className="text-[#4DD9C0]">Level</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#4DD9C0] animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">
                  Level Income Stream
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-80 group">
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#0D1520]/80 backdrop-blur-xl border border-[#1A2E45] rounded-2xl px-12 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-[#4DD9C0] transition-all duration-200 font-['Rajdhani',sans-serif] font-semibold"
              placeholder="Search transactions..."
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#4DD9C0] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <StatCard label="Total Records" value={transaction?.length || 0} accent="blue" />
          <StatCard label="Total Reward" value={formatCurrency(totalRevenue)} accent="gold" />
          <StatCard label="Recent Payout" value={recentPayout} accent="teal" />
          <StatCard label="Filtered" value={processedTransactions.length} accent="slate" />
        </motion.div>

        {/* Table */}
        <motion.div
          variants={itemVariants}
          className="bg-[#0D1520]/60 backdrop-blur-2xl border border-[#1A2E45] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] mb-6"
        >
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#060B14]/60 border-b border-[#1A2E45]">
                  <tr>
                    {TABLE_HEADERS.map((h) => (
                      <th
                        key={h}
                        className="px-6 py-5 text-[12px] font-black uppercase tracking-[3px] text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2E45]/30">
                  <AnimatePresence>
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map((item, index) => (
                        <motion.tr
                          key={item.id || index}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-[#4DD9C0]/[0.03] transition-colors group"
                        >
                          {/* Ref */}
                          <td className="px-6 py-5 text-[12px] font-bold text-slate-600">
                            {(currentPage - 1) * entriesPerPage + index + 1}
                          </td>

                          {/* ROI Amount */}
                          <td className="px-6 py-5 font-['Orbitron',sans-serif] text-[12px] font-black text-slate-300">
                            {formatCurrency(item?.roi_amount)}
                          </td>

                          {/* Reward Income ✅ */}
                          <td className="px-6 py-5 font-['Orbitron',sans-serif] text-[12px] font-black text-[#3DFFC0]">
                            +{formatCurrency(item?.reward_income)}
                          </td>

                          {/* Percent */}
                          <td className="px-6 py-5 font-['Orbitron',sans-serif] text-[12px] font-black text-[#4DD9C0]">
                            {item?.percent}%
                          </td>

                          {/* Total Levels */}
                          <td className="px-6 py-5">
                            <span className="px-3 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest bg-[#1A6FA8]/15 text-[#4DD9C0] border border-[#4DD9C0]/20">
                              Level {item?.total_levels}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5 text-[12px] font-black uppercase tracking-widest text-white">
                            {formatDate(item?.createdAt)}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
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
        </motion.div>

        {/* Pagination */}
        {!loading && (
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center bg-[#0D1520]/60 backdrop-blur border border-[#1A2E45] rounded-2xl px-6 py-4"
          >
            <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-600">
              Viewing{" "}
              <span className="text-white">Page {currentPage}</span>
              <span className="text-slate-600"> / {totalPages}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-[#0D1520] border border-[#1A2E45] disabled:opacity-20 hover:border-[#4DD9C0] hover:text-[#4DD9C0] transition-all text-white flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-[#0D1520] border border-[#1A2E45] disabled:opacity-20 hover:border-[#4DD9C0] hover:text-[#4DD9C0] transition-all text-white flex items-center justify-center"
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