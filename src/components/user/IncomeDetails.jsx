
import {
  DollarSign,
  CreditCard,
  Users,
  Gift,
  Zap,
  TrendingUp,
  Activity,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const IncomeDetails = ({
  totalBusiness,
  totalWithdrawals,
  totalDeposits,
  totalTeamCount,
  user,
  totalEarning,
}) => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({});

  // Debug: Check all props on component mount
  useEffect(() => {
    // console.log("========== IncomeDetails Debug ==========");
    // console.log("totalTeamCount:", totalTeamCount);
    // console.log("totalTeamCount type:", typeof totalTeamCount);
    // console.log("totalBusiness:", totalBusiness);
    // console.log("totalWithdrawals:", totalWithdrawals);
    // console.log("totalDeposits:", totalDeposits);
    // console.log("user:", user);
    // console.log("totalEarning:", totalEarning);
    // console.log("======================================");
    
    setDebugInfo({
      teamCount: totalTeamCount,
      teamCountType: typeof totalTeamCount,
      teamCountValue: Number(totalTeamCount)
    });
  }, [totalTeamCount, totalBusiness, totalWithdrawals, totalDeposits, user, totalEarning]);

  const handleTeamClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // console.log("===== Team Card Clicked =====");
    // console.log("totalTeamCount value:", totalTeamCount);
    // console.log("Navigating to: /user/refferal");
    // console.log("Navigating to: /user/team");
    
    // Try multiple navigation methods
    try {
      // Method 1: useNavigate
      // navigate("/user/team");
      navigate("/user/refferral-tree");
      console.log("Navigation attempted with navigate");
      
      // Method 2: Alternative if above fails
      // window.location.href = "/user/team";
      
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleCardClick = (link, title) => {
    console.log(`===== ${title} Clicked =====`);
    console.log("Link:", link);
    
    if (!link) {
      console.error(`No link defined for ${title}`);
      return;
    }
    
    try {
      navigate(link);
      console.log(`Navigating to ${link} successful`);
    } catch (error) {
      console.error(`Navigation failed for ${link}:`, error);
    }
  };

  const cardData = [
    { 
      title: "Total Business", 
      amount: Number(totalBusiness || 0).toLocaleString(), 
      icon: DollarSign, 
      link: "/user/income", 
      color: "#e6c57f" // gold-light
    },
    // { 
    //   title: "Activity Reward", 
    //   amount: Number(user?.reward || 0).toLocaleString(), 
    //   icon: Gift, 
    //   link: "/user/transaction/reward_transaction", 
    //   color: "#d4af37" // gold-medium
    // },
    { 
      title: "Total Withdrawal", 
      amount: Number(totalWithdrawals || 0).toLocaleString(), 
      icon: Zap, 
      link: "/user/withdrawal", 
      color: "#e6c57f" 
    },
    { 
      title: "Total Deposit", 
      amount: Number(totalDeposits || 0).toLocaleString(), 
      icon: CreditCard, 
      // link: "/user/manual-deposit",
      link: "/user/deposit-history", 
      color: "#d4af37" 
    },
    { 
      title: "Total Team", 
      amount: Number(totalTeamCount || 0).toLocaleString(), 
      icon: Users, 
      // link: "/user/team", 
      link:"user/refferral-tree",
      color: "#e6c57f",
      onClick: handleTeamClick // Special handler for team
    },
    { 
      title: "Total Income", 
      amount: `$${Number(totalEarning || 0).toLocaleString()}`, 
      icon: Activity, 
      link: "/user/income", 
      color: "#d4af37" 
    },
  ];

  return (
    <div className="w-full bg-transparent overflow-hidden animate-slideUp">
      
      {/* Header */}
      <div className="relative p-6 border-b border-white/5">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gold-medium rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-display">
                System <span className="text-gold-light">Overview</span>
              </h2>
              <p className="text-[10px] font-bold text-gold-medium uppercase tracking-widest mt-0.5 font-sans">Secure Network Node</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
             <ShieldCheck size={14} className="text-gold-light" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest font-sans">Verified</span>
          </div>
        </div>
      </div>


      <div className="p-5 space-y-3">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            onClick={(e) => {
              if (card.onClick) {
                card.onClick(e);
              } else {
                handleCardClick(card.link, card.title);
              }
            }}
            className="group relative flex items-center justify-between p-5 rounded-2xl bg-dark-900/60 border border-gold-dark/20 transition-all duration-300 hover:bg-dark-800 hover:border-gold-medium/50 cursor-pointer backdrop-blur-sm"
          >
            <div className="flex items-center gap-5">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all group-hover:scale-110"
                style={{ borderColor: `${card.color}40`, color: card.color, backgroundColor: `${card.color}15` }}
              >
                <card.icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-gold-light transition-colors font-sans">
                  {card.title}
                </p>
                <p className="text-xl font-black text-white tracking-tight leading-none font-display">
                  {card.amount || "0"}
                </p>
              </div>
            </div>
            <div className="bg-white/5 p-2 rounded-lg group-hover:bg-gold-medium transition-colors">
              <ChevronRight size={18} className="text-white" />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-slideUp { 
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
      `}</style>
    </div>
  );
};

export default IncomeDetails;