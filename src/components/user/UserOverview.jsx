import {
  DollarSign,
  Users,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Fingerprint
} from "lucide-react";

const UserOverview = ({ data, tradellimit }) => {
  // Helper function to format numbers with 2 decimal places
  const formatToTwoDecimals = (value) => {
    if (value === undefined || value === null) return "0.00";
    const num = Number(value);
    return num.toFixed(2);
  };

  const overviewItems = [
    { icon: Users, value: Number(data?.totalDirectInactiveMembers || 0).toLocaleString(), label: "Inactive Members", color: "#a855f7" },
    { icon: ShieldCheck, value: Number(data?.totalActiveMembers || 0).toLocaleString(), label: "Active Members", color: "#10b981" },
    { icon: Zap, value: Number(data?.totallimit) > 0 ? formatToTwoDecimals(Number(data.totallimit)) : "0.00", label: "Limit Left", color: "#f59e0b" },
    // { icon: Star, value: `$${formatToTwoDecimals(Number(tradellimit))}`, label: "Trade Limit", color: "#6366f1" },
    // { icon: DollarSign, value: formatToTwoDecimals(Number(data?.ib_income || 0)), label: "IB Income", color: "#14b8a6" },
    { icon: Globe, value: data?.user?.bep20 ? `${data.user.bep20.substring(0, 6)}...${data.user.bep20.substring(data.user.bep20.length - 4)}` : "N/A", label: "Address", color: "#877a05" },
  ];

  return (
    <div className="w-full bg-transparent animate-fadeIn mt-10 px-2">
      
      {/* Header Section - High Contrast */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-gold-dark p-2 rounded-lg shadow-[0_0_15px_rgba(167, 151, 3, 0.4)]">
            <Fingerprint className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
              USER <span className="text-gold-medium">ANALYTICS</span>
            </h2>
            <p className="text-[10px] text-gold-dark font-bold uppercase tracking-[0.2em] mt-1">System Status: Active</p>
          </div>
        </div>
        <div className="hidden sm:block h-px flex-1 mx-6 bg-gradient-to-r from-gold-dark to-transparent"></div>
      </div>

      {/* Responsive Row Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewItems.map((item, index) => (
          <div
            key={index}
            className="group relative flex flex-col justify-between p-5 rounded-2xl bg-dark-900/60 border border-white/10 hover:border-gold-medium transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Top/Left Content */}
            <div className="flex flex-col gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-inner transition-transform group-hover:scale-110"
                style={{ borderColor: `${item.color}40`, color: item.color, backgroundColor: `${item.color}10` }}
              >
                <item.icon size={24} strokeWidth={2.5} />
              </div>
              
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-gold-medium transition-colors truncate">
                  {item.label}
                </p>
                {/* Main Value - Bold and White with 2 decimal places */}
                <h3 className="text-xl font-black text-white tracking-wide font-mono break-all xl:text-lg 2xl:text-xl">
                  {item.value}
                </h3>
              </div>
            </div>

            {/* Glowing Indicator Line (Repositioned to the bottom edge for row/card style harmony) */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[3px] opacity-40 group-hover:opacity-100 transition-all shadow-[0_-2px_10px_currentcolor]"
              style={{ backgroundColor: item.color, color: item.color }}
            ></div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default UserOverview;