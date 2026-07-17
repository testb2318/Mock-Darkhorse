
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  Zap,
  Wallet,
  X,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Coins,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

const Tokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buyModal, setBuyModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [amountUsd, setAmountUsd] = useState("");
  const [buyLoading, setBuyLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [wallet, setWallet] = useState("business");
  const [refreshing, setRefreshing] = useState(false);

  // auth user from Redux
  const authUser = useSelector((state) => state?.auth.auth);
  const user = useSelector((state) => state?.users.singleuser);

  // safe numeric values with fallback 0
  const business = Number(user?.business || 0);
  const directIncome = Number(user?.direct_income || 0);
  const working = Number(user?.working || 0);
  const incomeWallet = working - directIncome;

  useEffect(() => {
    fetchTokens();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`https://api.Mock.ceo/api/v1/users/${authUser?.id}`);
      console.log("Latest User Data:", res.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://api.Mock.ceo/api/v1/tokens");
      setTokens(res.data.data || []);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load tokens";
      setError(errorMessage);
      showNotification(errorMessage, "error");
      console.error("Fetch tokens error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTokens();
  };

  const openBuyModal = (token) => {
    setSelectedToken(token);
    setAmountUsd("");
    setBuyModal(true);
  };

  const buyToken = async () => {
    if (!amountUsd || parseFloat(amountUsd) <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    if (!authUser?.id) {
      showNotification("User not found. Please login again.", "error");
      return;
    }

    const requestData = {
      user_id: authUser.id,
      token_id: selectedToken.id,
      amount_usd: parseFloat(amountUsd),
      wallet,
    };

    console.log("=== BUY TOKEN REQUEST ===");
    console.log("Request Data:", requestData);
    console.log("User Balances:", {
      business,
      working,
      incomeWallet
    });
    console.log("Selected Wallet:", wallet);

    setBuyLoading(true);
    try {
      const response = await axios.post("https://api.Mock.ceo/api/v1/tokens/buy-tokens", requestData);

      console.log("Buy token response:", response.data);

      showNotification(
        `Successfully purchased ${selectedToken.symbol} tokens!`,
        "success"
      );
      setBuyModal(false);
      setAmountUsd("");
      fetchTokens();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Buy token full error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Purchase failed. Please try again.";
      showNotification(errorMessage, "error");
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border ${notification.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/20 border-rose-500/30 text-rose-400"
              }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium text-sm">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-full">
        {/* Header */}
        <div className="animate-fade-in p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                  Token Marketplace
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Discover and invest in top Web3 tokens
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 ml-3">Loading tokens...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-rose-500/20 border border-rose-500/30 rounded-full mb-6">
              <AlertCircle className="w-12 h-12 text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Failed to Load Tokens
            </h3>
            <p className="text-slate-400 mb-6 text-center max-w-md">{error}</p>
            <button
              onClick={fetchTokens}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-white/5 rounded-full mb-6">
              <Wallet className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Tokens Available
            </h3>
            <p className="text-slate-400 mb-6">
              Check back later for new tokens
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {token.symbol?.substring(0, 2) || "TK"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {token.token_name}
                      </h2>
                      <span className="text-sm text-slate-400">
                        {token.symbol}
                      </span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">
                      +2.4%
                    </span>
                  </div>
                </div>

                <div className="mb-5 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-slate-400 text-xs mb-1">Current Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      ${token.current_price}
                    </span>
                    <span className="text-slate-500 text-xs">USD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-slate-500 text-xs mb-1">24h Volume</p>
                    <p className="text-white font-semibold text-sm">$2.4M</p>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-slate-500 text-xs mb-1">Market Cap</p>
                    <p className="text-white font-semibold text-sm">$124B</p>
                  </div>
                </div>

                <button
                  onClick={() => openBuyModal(token)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Token
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BUY MODAL */}
      {buyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4 z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Buy {selectedToken?.token_name}
                  </h2>
                </div>
                <p className="text-slate-400 text-sm">
                  Enter amount to purchase
                </p>
              </div>
              <button
                onClick={() => setBuyModal(false)}
                disabled={buyLoading}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="mb-5 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Price</span>
                <span className="text-white font-bold text-lg">
                  ${selectedToken?.current_price}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-slate-300 font-semibold mb-2 block text-sm">
                Select Wallet
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  disabled={buyLoading}
                  className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="business" className="bg-slate-900">
                    Active Wallet $({business.toLocaleString()})
                  </option>
                  <option value="working" className="bg-slate-900">
                    Income Wallet $({incomeWallet.toLocaleString()})
                  </option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-slate-300 font-semibold mb-2 block text-sm">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  disabled={buyLoading}
                  className="w-full pl-7 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBuyModal(false)}
                className="flex-1 px-5 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 font-semibold transition-all duration-300"
              >
                Cancel
              </button>

              <button
                onClick={buyToken}
                disabled={buyLoading || !amountUsd || parseFloat(amountUsd) <= 0}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {buyLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tokens;