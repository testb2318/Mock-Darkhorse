import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/common/Loader";
import { getUplineTransactions } from "../../redux/withdrawalSlice";

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
    gold: "from-[#F5C518] to-[#E8A800]",
    teal: "from-[#4DD9C0] to-[#1A6FA8]",
    slate: "from-slate-500 to-slate-600",
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative bg-[#0D1520] border border-[#1A2E45] rounded-2xl p-6 overflow-hidden group transition-all duration-300 hover:border-[#F5C518]/50"
    >
      <div className={`absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b ${accentMap[accent] || accentMap.gold} rounded-l-2xl`} />
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#F5C518]/5 rounded-full blur-xl group-hover:bg-[#F5C518]/10 transition-all duration-500" />
      <p className="text-[9px] font-black tracking-[3px] uppercase text-slate-500 mb-2">{label}</p>
      <h3 className="font-['Orbitron',sans-serif] text-2xl font-black text-white tracking-tight">{value}</h3>
    </motion.div>
  );
}

export default function UplineTransactions() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { uplineTransactions, loading: uplineLoading } = useSelector(
    (state) => state.allwithdrawal
  );

  const [uplinePage, setUplinePage] = useState(1);
  const entriesPerPage = 20;

  useEffect(() => {
    dispatch(getUplineTransactions());
  }, [dispatch]);

  const totalUplineIncome = useMemo(
    () =>
      (uplineTransactions || []).reduce(
        (acc, item) => acc + parseFloat(item.amount || 0),
        0
      ),
    [uplineTransactions]
  );

  const uplineTotalPages = Math.max(
    1,
    Math.ceil((uplineTransactions?.length || 0) / entriesPerPage)
  );

  const currentUplineTransactions = useMemo(
    () =>
      (uplineTransactions || []).slice(
        (uplinePage - 1) * entriesPerPage,
        uplinePage * entriesPerPage
      ),
    [uplineTransactions, uplinePage, entriesPerPage]
  );

  const formatCurrency = (v) =>
    v
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

  const userInitials = auth?.fullname
    ? auth.fullname
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "Zy";

  const UPLINE_HEADERS = [
    "Ref",
    "From User",
    "Withdrawal ID",
    "Amount",
    "Percent",
    "Type",
    "Date",
  ];

  return (
    <div className="relative min-h-screen bg-[#060B14] text-slate-200 p-4 lg:p-8 m-4 overflow-hidden font-['Rajdhani',sans-serif]">

      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [-40, 40, -40], y: [0, 80, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#F5C518]/10 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [40, -40, 40], y: [0, -80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#4DD9C0]/10 blur-[120px]"
        />
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
              <div className="absolute inset-0 rounded-full border-2 border-[#F5C518]" />
              <div className="absolute -inset-[6px] rounded-full border border-[#F5C518]/50" />
              <span className="font-['Orbitron',sans-serif] text-xl font-black text-[#F5C518] leading-none">
                {userInitials}
              </span>
            </div>
            <div>
              <h1 className="font-['Orbitron',sans-serif] text-3xl lg:text-4xl font-black text-white tracking-wider uppercase">
                Leadership <span className="text-[#F5C518]">Bonus</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">
                  Upline Income Stream
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          <StatCard
            label="Total Bonuses"
            value={uplineTransactions?.length || 0}
            accent="gold"
          />
          <StatCard
            label="Total Earned"
            value={formatCurrency(totalUplineIncome)}
            accent="teal"
          />
          <StatCard
            label="This Page"
            value={currentUplineTransactions.length}
            accent="slate"
          />
        </motion.div>

        {/* Upline Table */}
        <motion.div
          variants={itemVariants}
          className="bg-[#0D1520]/60 backdrop-blur-2xl border border-[#1A2E45] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] mb-6"
        >
          {uplineLoading ? (
            <div className="flex justify-center items-center h-80">
              <Loader />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#060B14]/60 border-b border-[#1A2E45]">
                  <tr>
                    {UPLINE_HEADERS.map((h) => (
                      <th
                        key={h}
                        className="px-6 py-5 text-[9px] font-black uppercase tracking-[3px] text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2E45]/30">
                  <AnimatePresence>
                    {currentUplineTransactions.length > 0 ? (
                      currentUplineTransactions.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-[#F5C518]/[0.03] transition-colors group"
                        >
                          <td className="px-6 py-5 text-[11px] font-bold text-slate-600">
                            {(uplinePage - 1) * entriesPerPage + index + 1}
                          </td>
                          <td className="px-6 py-5 text-xs font-semibold text-slate-400">
                            {item.from_user_email || `User #${item.from_user_id}`}
                          </td>
                          <td className="px-6 py-5 text-xs font-bold text-slate-500">
                            #{item.withdrawal_id}
                          </td>
                          <td className="px-6 py-5 font-['Orbitron',sans-serif] text-[15px] font-black text-[#F5C518]">
                            +{formatCurrency(item.amount)}
                          </td>
                          <td className="px-6 py-5 font-['Orbitron',sans-serif] text-xs font-black text-[#4DD9C0]">
                            {item.percent}%
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20">
                              {item.type === "leadership_bonus_3percent"
                                ? "3% Bonus"
                                : "2% Bonus"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {formatDate(item.createdAt)}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-20 text-center text-[11px] font-black uppercase tracking-[4px] text-slate-600"
                        >
                          No Leadership Bonus Found
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
        {!uplineLoading && (
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center bg-[#0D1520]/60 backdrop-blur border border-[#1A2E45] rounded-2xl px-6 py-4"
          >
            <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-600">
              Viewing{" "}
              <span className="text-white">Page {uplinePage}</span>
              <span className="text-slate-600"> / {uplineTotalPages}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUplinePage((p) => Math.max(1, p - 1))}
                disabled={uplinePage === 1}
                className="w-10 h-10 rounded-xl bg-[#0D1520] border border-[#1A2E45] disabled:opacity-20 hover:border-[#F5C518] hover:text-[#F5C518] transition-all text-white flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setUplinePage((p) => Math.min(uplineTotalPages, p + 1))}
                disabled={uplinePage === uplineTotalPages}
                className="w-10 h-10 rounded-xl bg-[#0D1520] border border-[#1A2E45] disabled:opacity-20 hover:border-[#F5C518] hover:text-[#F5C518] transition-all text-white flex items-center justify-center"
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