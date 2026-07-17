



// StatsGrid.jsx - Redesigned to match the precise dark UI border-accent theme
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
// Apne pasand ke icons yahan import karein
import { CalendarCheck, Wallet, TrendingUp } from "lucide-react"; 

const StatsGrid = ({ user }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getUserValue = (user, possibleKeys, defaultValue = 0) => {
    if (!user) return defaultValue;
    for (let key of possibleKeys) {
      if (user[key] !== undefined && user[key] !== null) {
        return user[key];
      }
    }
    return defaultValue;
  };

  const activePlan = getUserValue(user, ['active_plan', 'activePlan', 'plan', 'current_plan', 'investment', 'amount'], 0);
  const directIncome = getUserValue(user, ['direct_income', 'directIncome', 'directEarning', 'direct_earning', 'direct'], 0);
  const levelIncome = getUserValue(user, ['level_month', 'levelMonth', 'levelIncome', 'monthlyLevel', 'level_income', 'level'], 0);
  const tradeIncome = getUserValue(user, ['non_working', 'nonWorking', 'tradeIncome', 'roiIncome', 'roi_income', 'trading_income', 'roi'], 0);

  // 1. Alag-alag cards ke liye alag icons assign kar diye hain
  const stats = [
    {
      label: "Subscription Plan",
      value: `$${Number(activePlan).toLocaleString()}`,
      link: "/user/subscription",
      textColor: "text-gold-light", 
      accentColor: "bg-gold-medium", 
      delay: 0,
      icon: CalendarCheck,
      fixedText: "Lifetime Access", // Subscription Icon
    },
    {
      label: "Direct Income",
      value: `$${Number(directIncome).toLocaleString()}`,
      link: "/user/transaction/direct_transaction",
      textColor: "text-gold-light", 
      accentColor: "bg-gold-medium",
      delay: 100,
      icon: Wallet,
      fixedText: "Instant Payout", // Income/Wallet Icon
    },
    {
      label: "Roi Income",
      value: `$${Number(tradeIncome).toLocaleString()}`,
      link: "/user/transaction/roi_transaction/invest",
      textColor: "text-gold-light", 
      accentColor: "bg-gold-medium",
      delay: 300,
      icon: TrendingUp,
      fixedText: "Live Trading ROI", // Trading/Growth Icon
    },
  ];

  if (!user) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-gold-dark/20 animate-pulse h-[104px] flex flex-col justify-between">
            <div className="h-3 bg-gold-dark/20 rounded-xl w-20"></div>
            <div className="h-7 bg-gold-dark/20 rounded-xl w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-xl gap-18 mb-6 p-4">
      {stats.map((stat, index) => {
        
        // 2. React ke rule ke hisab se Icon ko Capital letter variable me dala
        const CardIcon = stat.icon;

        return (
          <Tilt
            key={index}
            className="tilt-card-wrapper h-full"
            perspective={1000}
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#e6c57f"
            scale={1.02}
          >
            <Link
              to={stat.link}
              className={`block glass-card glass-card-hover animated-border-gold rounded-2xl p-5 relative transition-all duration-300 group h-full tilt-card-inner
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${stat.delay}ms` }}
            > 
              {/* Top-Left Corner Colored Accent Frame */}
              <div className={`absolute top-0 left-0 w-[5px] h-18 rounded-tl-full ${stat.accentColor}`} />
              <div className={`absolute top-0 left-0 h-[5px] w-18 rounded-tl-full ${stat.accentColor}`} />

              {/* Card Content Layout */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col justify-between h-full space-y-2.5 relative z-10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans selection:bg-transparent">
                    {stat.label}
                  </span>
                  <div className={`text-2xl font-semibold tracking-tight font-display ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </div>

                <div className="hidden sm:flex items-center justify-center flex-1 mx-4 relative z-10">
                  <span className="text-[11px] font-medium tracking-wide text-gray-400 border border-gold-medium/20 bg-gold-medium/5 px-2.5 py-1 rounded-md shadow-inner">
                    {stat.fixedText}
                  </span>
                </div>
                
                {/* 3. Sahi tarike se Component ko size aur color props ke sath call kiya */}
                <span className="text-gold-light group-hover:scale-110 transition-transform duration-300">
                  <CardIcon size={44} />
                </span>
              </div>
            </Link>
          </Tilt>
        );
      })}
    </div>
  );
};

export default StatsGrid;



























