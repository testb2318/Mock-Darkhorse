import { Users, DollarSign, TrendingUp } from "lucide-react";
import Tilt from "react-parallax-tilt";

const SummaryStats = ({ totalTeamCount, totalEarning, user }) => {
  const statsItems = [
    {
      label: "Total Team",
      value: `${Number(totalTeamCount).toLocaleString()}`,
      icon: Users,
      gradient: "from-gold-dark via-gold-medium to-gold-light",
      bgGradient: "from-gold-medium/20 to-gold-light/20",
      iconBg: "bg-gradient-to-br from-gold-dark to-gold-medium",
    },
    {
      label: "Total Income",
      value: `$ ${totalEarning}`,
      icon: DollarSign,
      gradient: "from-gold-dark via-gold-medium to-gold-light",
      bgGradient: "from-gold-medium/20 to-gold-light/20",
      iconBg: "bg-gradient-to-br from-gold-dark to-gold-medium",
    },
    // {
    //   label: "Trade Remaining Limit",
    //   value: `$ ${
    //     user?.active_plan > 0
    //       ? (
    //           Number(user?.active_plan) * 2 -
    //           Number(user?.roi_income)
    //         ).toLocaleString()
    //       : 0
    //   }`,
    //   icon: TrendingUp,
    //   gradient: "from-pink-500 via-rose-400 to-purple-400",
    //   bgGradient: "from-pink-500/20 to-purple-500/20",
    //   iconBg: "bg-gradient-to-br from-pink-500 to-purple-500",
    // },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {statsItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <Tilt
            key={idx}
            className="tilt-card-wrapper h-full"
            perspective={1000}
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#e6c57f"
            scale={1.02}
          >
            <div
              className={`px-4 py-[19px] flex justify-start items-center gap-4 rounded-2xl glass-card glass-card-hover animated-border-gold tilt-card-inner h-full transition-all duration-300`}
            >
              {/* Icon with Gradient Background */}
              <div className="flex items-center relative z-10">
                <div
                  className={`h-12 w-12 rounded-xl ${item.iconBg} flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]`}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1 relative z-10">
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase font-sans">
                  {item.label}
                </span>
                <h2
                  className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent font-display`}
                >
                  {item.value}
                </h2>
              </div>
            </div>
          </Tilt>
        );
      })}
    </div>
  );
};

export default SummaryStats;
