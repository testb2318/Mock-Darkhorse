



import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { makeTrade, resetState } from "../../redux/tradeSlice";
import TradeSuccessModal from "../modals/TradeSuccessModal";
import { getMyProfile } from "../../redux/userSlice";
import { selectUser } from "../../redux/authSlice";

const TradeNow = () => {
  const dispatch = useDispatch();
  const [latestDate, setLatestDate] = useState(null);
  const [canShowButton, setCanShowButton] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);
  const { loading, message } = useSelector((state) => state.trade);
  const user = useSelector(selectUser);
  const { myprofile } = useSelector((state) => state.users);

  // ✅ Sirf ek baar profile fetch
  useEffect(() => {
    dispatch(getMyProfile());
  }, []);

  // ✅ Fetch latest ROI date — sirf ek baar
  useEffect(() => {
    const fetchLatestRoiDate = async () => {
      try {
        const res = await axios.get(`/referral/latest`);
        if (res.data?.latestRoiDate) {
          const roiDate = new Date(res.data.latestRoiDate);
          setLatestDate(roiDate);
        } else {
          setCanShowButton(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCanShowButton(true);
        } else {
          console.error("Error fetching ROI date:", err);
        }
      }
    };

    fetchLatestRoiDate();
  }, []);

  // ✅ Countdown timer
  useEffect(() => {
    if (!latestDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const nextRoiTime = new Date(latestDate.getTime() + 24 * 60 * 60 * 1000);
      const diff = nextRoiTime - now;

      if (diff <= 0) {
        setCanShowButton(true);
        setCountdown("");
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [latestDate]);

  // ✅ FIXED: reload ke baad resetState — infinite loop band
  useEffect(() => {
    if (message) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(resetState()); // ✅ pehle state reset karo
        window.location.reload(); // phir reload
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ✅ FIXED: userId hata diya
  async function handleTrade(pair) {
    if (!myprofile?.active_plan) {
      alert("Please activate a Plan first");
      return;
    }
    dispatch(makeTrade({ pair }));
  }

  return (
    <div className="w-full">
      <TradeSuccessModal
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        message={"Mining Reward successfull"}
      />

      <div className="text-center">
        {isWeekend ? (
          <div className="relative overflow-hidden glass-card glass-card-hover animated-border-gold rounded-2xl p-6 shadow-[0_10px_30px_rgba(212,175,55,0.08)]">
            <div className="relative flex flex-col items-center space-y-4 z-10">
              <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-orange-500/30 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                <svg
                  className="w-8 h-8 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-sm uppercase tracking-widest text-gold-light/70 font-semibold mb-2 font-sans">
                  Weekend Market Closed
                </h3>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-display">
                  Next Trading Day: Monday
                </div>
              </div>
            </div>
          </div>
        ) : canShowButton ? (
          <div className="relative flex w-full justify-center items-center">
            <button
              onClick={() => handleTrade("DOGE")}
              disabled={loading}
              className="relative w-[180px] h-[45px] rounded-[10px] bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light bg-[length:250%_100%] bg-left text-white flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-1000 active:scale-95 hover:bg-right font-display shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-bold tracking-wide">Processing...</span>
                </div>
              ) : (
                <span className="absolute w-[97%] h-[90%] rounded-[8px] bg-dark-900/90 flex items-center justify-center text-gold-medium font-bold tracking-wide transition-all duration-1000">
                  Execute Trade
                </span>
              )}
            </button>
          </div>
        ) : countdown ? (
          <div className="relative overflow-hidden glass-card glass-card-hover animated-border-gold rounded-2xl p-6 shadow-[0_10px_30px_rgba(212,175,55,0.08)]">
            <div className="relative flex flex-col items-center z-10">
              <div className="text-center">
                <h2 className="text-lg font-bold gold-gradient-text uppercase tracking-wider font-display">
                  Complete for Today
                </h2>
                <div className="text-gray-400 text-sm mt-2 font-sans">
                  <p className="mb-2">Next trading opportunity in</p>
                  <span className="bg-gold-medium/10 border border-gold-medium/30 px-5 py-2 mt-1 rounded-full text-gold-light font-mono font-bold shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                    {countdown}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative glass-card rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="text-sm font-bold tracking-widest uppercase text-gold-medium/70 animate-pulse">
                Loading Trading Data...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeNow;