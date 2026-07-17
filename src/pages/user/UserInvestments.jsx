import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Layers
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import api from "../../api/axiosInstance";

export default function InvestmentViewer({ view = "cards" }) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useSelector(selectUser);

  // Logic intact: Backend connection unchanged
  useEffect(() => {
    if (auth?.id) {
      fetchInvestments(auth.id);
    }
  }, [auth?.id]);

  const fetchInvestments = async (userId) => {
    try {
      const res = await api.get(`/investments/user/${userId}`);
      const data = res.data;
      if (data.success) {
        setInvestments(data.data);
      } else {
        setInvestments([]);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold-medium/10 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-gold-medium border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="text-gold-light font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">Syncing Portfolio</p>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="glass-card animated-border-gold rounded-[2.5rem] p-20 text-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
        <Layers size={50} className="mx-auto text-gold-medium mb-6 animate-bounce" />
        <h3 className="text-2xl font-black text-white mb-2 font-display uppercase tracking-wider">No Active Plans</h3>
        <p className="text-slate-400 max-w-sm mx-auto text-sm">Your investment portfolio is currently empty. Explore our plans to start earning today.</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-slideUp">
      {view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {investments.map((investment) => (
              <div
              key={investment.id}
              className="group relative glass-card animated-border-gold rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(212,175,55,0.4)]"
            >
              {/* Top Decorative Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-medium/10 blur-[50px] group-hover:bg-gold-medium/20 transition-all z-0"></div>

              <div className="p-7 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gold-medium/10 rounded-2xl border border-gold-medium/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                      <ShieldCheck className="text-gold-light w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black gold-gradient-text tracking-tight font-display">{investment.plan_name}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(investment.status)}`}>
                    ● {investment.status}
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Portfolio Value</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter">
                      {formatCurrency(investment.current_value)}
                    </span>
                    <ArrowUpRight className="text-emerald-400 w-5 h-5 mb-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Invested</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(investment.invested_amount)}</p>
                  </div>
                  <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Earned</p>
                    <p className="text-lg font-bold text-emerald-400">{formatCurrency(investment.total_earned)}</p>
                  </div>
                </div>

                {/* ROI Progress Area */}
                <div className="bg-gradient-to-r from-gold-dark/20 to-gold-light/20 border border-gold-medium/20 rounded-2xl p-4 flex items-center justify-between mb-6 group-hover:from-gold-dark/30 group-hover:to-gold-light/30 transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center border border-gold-medium/30">
                      <Activity className="text-gold-light w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-tighter">Daily ROI</span>
                  </div>
                  <span className="text-2xl font-black text-white">{investment.roi_percentage}%</span>
                </div>

                {/* Date Details */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-5">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>Started: {formatDate(investment.start_date)}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <span>Payout: {formatDate(investment.last_roi_date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern List View */}
      {view === "list" && (
        <div className="glass-card animated-border-gold rounded-[2.5rem] p-1 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
          <div className="overflow-x-auto rounded-[2.3rem]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Name</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Principal</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Current Value</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Growth Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-white group-hover:text-gold-medium transition-colors font-display uppercase tracking-wider">{investment.plan_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">PID-{investment.plan_id}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(investment.status)}`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-slate-400">
                      {formatCurrency(investment.invested_amount)}
                    </td>
                    <td className="px-8 py-6 text-right font-black text-white text-lg">
                      {formatCurrency(investment.current_value)}
                      <span className="block text-[10px] text-emerald-400 font-bold">+{formatCurrency(investment.total_earned)} profit</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gold-medium/10 border border-gold-medium/20 text-gold-light font-black shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                        {investment.roi_percentage}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}