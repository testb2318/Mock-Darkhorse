

import {
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Banknote,
  UserCheck,
  Gift,
  Scale,
  ChevronRight,
  Sparkles,
  Wifi,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, clearErrors, clearMessage } from "../../redux/userSlice";
import { getTreeData } from "../../redux/referralSlice";
import { calculateTotalEarnings } from "../../utils/dashboardUtils";

export default function IncomeDetails() {
  const dispatch = useDispatch();
  const {
    myprofile: singleuser,
    loading,
    error,
    message,
  } = useSelector((state) => state.users);
  const { auth } = useSelector((state) => state.auth);
  const { treeData } = useSelector((state) => state.referralTree);

  useEffect(() => {
    dispatch(getMyProfile());
    if (auth?.refferal_code) {
      dispatch(getTreeData(auth?.refferal_code));
    }
    if (error) {
      const errorInterval = setInterval(() => dispatch(clearErrors()), 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => dispatch(clearMessage()), 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, auth?.refferal_code, error, message]);

  function analyzeTeamData(treeData) {
    let totalMembers = 0;
    let activeMembers = 0;
    let totalActivePlanAmount = 0;
    let totalInvestmentPlanAmount = 0;
    let queue = Array.isArray(treeData) ? [...treeData] : [treeData];

    while (queue.length > 0) {
      let node = queue.shift();
      if (!node) continue;
      totalMembers++;
      if (node.is_active === "active") {
        activeMembers++;
        totalActivePlanAmount += node.active_plan || 0;
        totalInvestmentPlanAmount += node.investment_plan || 0;
      }
      if (node.referrals && node.referrals.length > 0) {
        queue.push(...node.referrals);
      }
    }
    return {
      totalMembers,
      activeMembers,
      totalActivePlanAmount,
      totalInvestmentPlanAmount,
    };
  }

  const {
    totalMembers,
    activeMembers,
    totalActivePlanAmount,
    totalInvestmentPlanAmount,
  } = analyzeTeamData(treeData);

  const earning = calculateTotalEarnings(singleuser);
  const limit = singleuser?.limit_plan * 5;
  const available = Math.max(0, limit - earning);
  const usagePercent =
    limit > 0 ? Math.min(((earning / limit) * 100).toFixed(1), 100) : 0;

  const mainCard = {
    name: "Total Earning",
    value: earning || 0,
    isCurrency: true,
    icon: DollarSign,
    sub: "All revenue streams combined",
  };

  const incomeCards = [
    {
      name: "Roi Income",
      value: singleuser?.roi_income || 0,
      isCurrency: true,
      icon: BarChart3,
      accent: "cyan",
    },
    {
      name: "Referral Income",
      value: singleuser?.direct_income || 0,
      isCurrency: true,
      icon: TrendingUp,
      accent: "cyan",
    },
    // {
    //   name: "Growth Income",
    //   value: singleuser?.level_month || 0,
    //   isCurrency: true,
    //   icon: Banknote,
    //   accent: "cyan",
    // },
    // {
    //   name: "Activity Rewards",
    //   value: singleuser?.reward || 0,
    //   isCurrency: true,
    //   icon: Gift,
    //   accent: "gold",
    // },
    {
      name: "Available Limit",
      value: available || 0,
      isCurrency: true,
      icon: Scale,
      accent: "gold",
    },
  ];

  const teamStats = [
    {
      name: "Total Members",
      value: totalMembers || 0,
      isCurrency: false,
      icon: Users,
    },
    {
      name: "Active Members",
      value: activeMembers || 0,
      isCurrency: false,
      icon: UserCheck,
      green: true,
    },
    {
      name: "Team Business",
      value: (totalActivePlanAmount + totalInvestmentPlanAmount) || 0,
      isCurrency: true,
      icon: Sparkles,
      gold: true,
    },
  ];

  const formatCurrency = (val) =>
    `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const IconBox = ({ Icon, gold }) => (
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center border
        ${gold
          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
          : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
        }`}
    >
      <Icon size={15} />
    </div>
  );

  const StatCard = ({ card }) => {
    const isGold = card.accent === "gold";
    return (
      <div className="glass-card animated-border-gold rounded-2xl p-0.5 relative group overflow-hidden transition-all duration-300 hover:translate-y-[-2px]">
        <div className="bg-black/40 rounded-[15px] p-5 h-full border-b border-gold-medium/20">
        <div className="flex items-center gap-2 mb-3">
          <IconBox Icon={card.icon} gold={true} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-medium/70">
            {card.name}
          </span>
        </div>
        <p
          className={`font-mono text-2xl font-bold tracking-tight text-white`}
        >
          {card.isCurrency ? formatCurrency(card.value) : card.value}
        </p>
        <div
          className={`absolute -bottom-5 -right-5 w-20 h-20 rounded-full blur-2xl pointer-events-none bg-gold-medium/10`}
        />
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen text-slate-300 p-5 lg:p-10 bg-transparent"
    >

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-gold-medium/30 bg-black/20 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-2 border-gold-medium/60 bg-black/40 shadow-[0_0_18px_rgba(212,175,55,0.25)]">
              <span
                className="text-lg font-black tracking-wide font-display text-gold-light"
              >
                Dark
              </span>
              <div className="absolute inset-[-4px] rounded-full border border-gold-medium/20" />
            </div>
            <div>
              <h1
                className="text-xl font-black tracking-widest font-display"
              >
                <span className="text-white">Dark</span>
                <span className="text-gold-light">Horse</span>
              </h1>
              <p className="text-[11px] uppercase tracking-[3px] text-gold-medium/70 font-semibold">
                Income Analytics
              </p>
            </div>
          </div>

          <div className="flex-1 md:text-center">
            <h2
              className="text-3xl lg:text-4xl font-black text-white tracking-tight font-display"
            >
              Income <span className="text-gold-light">Details</span>
            </h2>
            <p className="text-gold-medium/70 text-sm mt-1 font-semibold">
              Real-time performance across 9 revenue streams
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Live Ledger
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Operational
              </span>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gold-medium/20 border-t-gold-medium rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Main Total Earning Card */}
              <div className="glass-card animated-border-gold rounded-3xl p-0.5">
                <div className="bg-black/40 rounded-[1.8rem] p-7 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-medium/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-light/20 to-transparent" />

                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold-medium/15 border border-gold-medium/25">
                        <DollarSign size={18} className="text-gold-light" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gold-medium/70">
                          Total Earning
                        </p>
                        <p className="text-[11px] text-white font-semibold">
                          {mainCard.sub}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-5xl lg:text-6xl font-black text-gold-light tracking-tight font-display"
                    >
                      {formatCurrency(mainCard.value)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-gold-medium/40 transition-colors">
                      <ChevronRight size={16} className="text-gold-light" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-medium/70 font-bold">
                      9 Streams
                    </span>
                  </div>
                </div>

                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gold-medium/8 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 left-10 w-32 h-32 rounded-full bg-gold-light/6 blur-3xl pointer-events-none" />
                </div>
              </div>

              {/* Income Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {incomeCards.map((card, i) => (
                  <StatCard key={i} card={card} />
                ))}
              </div>


               <div className="bg-[#311901] border border-yellow-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Plan Limit Usage
                  </p>
                  <p
                    className="font-black text-yellow-400 text-lg"
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    {usagePercent}%
                  </p>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden my-4 border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${usagePercent}%`,
                      background: "linear-gradient(90deg, #14a0c8, #f0c020)",
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                  You have consumed{" "}
                  <span className="text-yellow-500">{usagePercent}%</span> of
                  your 5× limit. Reach 100% to trigger auto-renewal requirements.
                </p>
                <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-yellow-500/8 blur-2xl pointer-events-none" />
              </div>


            </div>

            

            {/* Right Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8">

              {/* Team Summary */}
              <div className="glass-card animated-border-gold rounded-3xl p-0.5">
                <div className="bg-black/40 rounded-[1.8rem] p-8 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-medium/40 to-transparent" />
                <div className="flex items-center gap-2 mb-5">
                  <Activity size={14} className="text-gold-light" />
                  <h3
                    className="text-[11px] font-bold uppercase tracking-[3px] text-gold-light font-display"
                  >
                    Team Summary
                  </h3>
                </div>
                <div className="space-y-4">
                  {teamStats.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-3 border-b border-gold-medium/20 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gold-medium/10 border border-gold-medium/20 flex items-center justify-center text-gold-light">
                            <Icon size={15} />
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {item.name}
                          </span>
                        </div>
                        <span
                          className={`font-mono text-base font-bold text-gold-light`}
                        >
                          {item.isCurrency ? formatCurrency(item.value) : item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gold-medium/10 blur-2xl pointer-events-none" />
                </div>
              </div>

              {/* Plan Limit Progress */}
           

              {/* Network Status */}
              <div className="glass-card animated-border-gold rounded-3xl  p-0.5">
                <div className="bg-gold/10 rounded-[1.8rem] p-5 flex items-center h-30 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-medium/10 border border-gold-medium/20 flex items-center justify-center text-gold-light">
                    <Wifi size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold-medium/70">
                      Network Status
                    </p>
                    <p className="text-sm font-bold text-emerald-400 font-mono">
                      Operational
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Live
                  </span>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}