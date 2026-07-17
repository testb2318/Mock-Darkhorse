import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getAllDepositeByid } from "../../redux/depositeSlice";
import { getAllWithdrawalByid } from "../../redux/withdrawalSlice";
import { selectUser } from "../../redux/authSlice";

import {
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock3,
  History,
  ChevronRight
} from "lucide-react";

export default function UserTransactions() {
  const dispatch = useDispatch();
  const { singleDeposite } = useSelector((state) => state.alldeposite);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const auth = useSelector(selectUser);

  useEffect(() => {
    if (!auth?.id) return;
    dispatch(getAllDepositeByid(auth.id));
    dispatch(getAllWithdrawalByid(auth.id));
  }, [auth?.id, dispatch]);

  const transactions = useMemo(() => {
    const deposits = singleDeposite?.map((d) => ({ ...d, type: "deposit" })) || [];
    const withdrawals = singleWithdrawal?.map((w) => ({ ...w, type: "withdrawal" })) || [];
    return [...deposits, ...withdrawals]
      .sort((a, b) => new Date(b.createdAT) - new Date(a.createdAT))
      .slice(0, 8);
  }, [singleDeposite, singleWithdrawal]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "complete":
      case "TRN-ADM002":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/20";
      default:
        return "bg-rose-500/20 text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="w-full bg-[#0a0c12] rounded-[2rem] border-2 border-yellow-600/20 p-6 shadow-2xl">
      
      {/* --- High Visibility Header --- */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-dark rounded-2xl flex items-center justify-center shadow-gold-dark">
            <History className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">History</h2>
            <p className="text-xs font-bold text-gold-light uppercase tracking-widest mt-1">Real-time Logs</p>
          </div>
        </div>
      </div>

      {/* --- Transaction List (Table-less for better visibility) --- */}
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((tx, index) => {
            const isDeposit = tx.type === "deposit";
            const statusClass = getStatusStyle(tx.status);

            return (
              <div
                key={tx.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-[#121620] border border-white/5 hover:border-yellow-500/50 transition-all duration-300 animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* 1. Icon & Type */}
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDeposit ? 'bg-gold-dark' : 'bg-rose-600'} shadow-lg`}>
                    {isDeposit ? <ArrowDownLeft className="text-white w-5 h-5" /> : <ArrowUpRight className="text-white w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{isDeposit ? "Received" : "Sent"}</p>
                    <p className="text-sm font-black text-white">{isDeposit ? "Deposit Funds" : "Withdrawal Order"}</p>
                  </div>
                </div>

                {/* 2. Amount (Large & Bold) */}
                <div className="mb-3 md:mb-0">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Volume</p>
                   <p className={`text-xl font-black ${isDeposit ? 'text-gold-dark' : 'text-rose-500'}`}>
                    {isDeposit ? "+" : "-"}${Number(tx.amount).toLocaleString()}
                   </p>
                </div>

                {/* 3. Date & Time */}
                <div className="mb-3 md:mb-0">
                   <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">Timeline</p>
                   <p className="text-sm font-bold text-slate-300">{new Date(tx.createdAT).toLocaleDateString()} <span className="text-slate-300 ml-1">{new Date(tx.createdAT).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
                </div>

                {/* 4. Status Tag */}
                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusClass}`}>
                    {tx.status === "complete" || tx.status === "TRN-ADM002" ? "Success" : tx.status}
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-gold-dark transition-colors" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <AlertCircle size={40} className="mx-auto text-slate-700 mb-2" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No Transactions Found</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}




























