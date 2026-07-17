import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axiosInstance";

export default function balanceCards() {
  const { auth } = useSelector((state) => state.auth);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = auth?.id;

  useEffect(() => {
    if (id) {
      fetchWalletData(id);
    }
  }, [id]);

  const fetchWalletData = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/wallet/user/${id}`);
      const data = res.data;

      if (data.success) {
        setWalletData(data.wallet);
      } else {
        setError("Failed to fetch wallet data");
      }
    } catch (err) {
      setError("Error connecting to API: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-700 border-t-[#00f5c3] rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-xs text-red-400">{error}</p>
          <button
            onClick={() => fetchWalletData(id)}
            className="mt-2 text-xs text-red-400 hover:text-red-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!walletData) return null;

  const cardData = [
    {
      title: "Compound ROI",
      amount: formatCurrency(walletData.roi_balance || 0),
      color: "text-[#00f5c3]",
      bg: "bg-[#00f5c3]/10",
      iconColor: "text-[#00f5c3]",
      borderColor: "border-[#00f5c3]/30",
      hoverBorderColor: "hover:border-[#00f5c3]",
      link: "/user/transaction/reward_transaction",
      Icon: TrendingUp,
      description: "Earned from mining",
    },
    {
      title: "Commission Balance",
      amount: formatCurrency(walletData.commission_balance || 0),
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      hoverBorderColor: "hover:border-purple-500",
      link: "/user/income",
      Icon: DollarSign,
      description: "Referral earnings",
    },
  ];

  // Add main balance if available
  if (walletData.main_balance !== undefined && walletData.main_balance > 0) {
    cardData.unshift({
      title: "Main Balance",
      amount: formatCurrency(walletData.main_balance || 0),
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      hoverBorderColor: "hover:border-blue-500",
      link: "/user/wallet",
      Icon: Wallet,
      description: "Available balance",
    });
  }

  // Add locked amount if available
  if (walletData.locked_amount > 0) {
    cardData.push({
      title: "Locked Amount",
      amount: formatCurrency(walletData.locked_amount || 0),
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      hoverBorderColor: "hover:border-yellow-500",
      link: "/user/wallet",
      Icon: Zap,
      description: "Pending release",
    });
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cardData.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="group block transition-all duration-300 hover:-translate-y-0.5"
          >
            <div
              className={`relative overflow-hidden rounded-xl border ${card.borderColor} ${card.hoverBorderColor} bg-gray-900/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#00f5c3]/10`}
            >
              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f5c3]/0 via-[#00f5c3]/5 to-[#00f5c3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${card.bg} transition-all duration-300 group-hover:scale-110`}
                  >
                    <card.Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{card.title}</p>
                    <p className={`text-base font-bold ${card.color}`}>
                      {card.amount}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {card.description}
                    </p>
                  </div>
                </div>

                <ArrowRight
                  className={`w-4 h-4 text-gray-600 transition-all duration-300 group-hover:text-[#00f5c3] group-hover:translate-x-1`}
                />
              </div>

              {/* Bottom Progress Bar */}
              <div className="mt-3">
                <div className="w-full h-0.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-[#00f5c3] rounded-full transition-all duration-500 group-hover:w-full opacity-50" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}