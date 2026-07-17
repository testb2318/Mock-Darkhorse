import {
  getAllWithdrawalByid,
  WithdrawalPrinciple,
} from "../../redux/withdrawalSlice";
import {
  sendOTP,
  verifyOTP,
  clearOtpErrors,
  clearOtpMessage,
} from "../../redux/otpSlice";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../common/Spinner";
import { getMyProfile } from "../../redux/userSlice";
import api from '../../api/axiosInstance';
import { selectUser } from "../../redux/authSlice";

export default function PrincipleWithdrawal({ openModel, modelClose }) {
  const dispatch = useDispatch();

  const auth = useSelector(selectUser);
  const { myprofile: singleuser } = useSelector((state) => state.users);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);

  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bep20Address, setBep20Address] = useState("");
  const [agreeToBep20, setAgreeToBep20] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [hasPendingPrincipleWithdrawal, setHasPendingPrincipleWithdrawal] = useState(false);

  // ✅ Backend se aayega
  const [principleAmount, setPrincipleAmount] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [withdrawalInfo, setWithdrawalInfo] = useState(null);

  // ✅ Backend se principle amount fetch karo
  const fetchPrincipleAmount = async (id) => {
    try {
      const res = await api.get(`/withdrawalrequest/principle/info/${id}`);
      const data = res.data;

      if (data?.success) {
        setPrincipleAmount(data.principleAmount);
        setCanWithdraw(true);
        setDaysRemaining(null);
        setWithdrawalInfo(data);
      }
    } catch (err) {
      const errData = err?.response?.data;
      if (errData?.daysRemaining) {
        setDaysRemaining(errData.daysRemaining);
        setCanWithdraw(false);
      }
      console.log("Principle info error:", errData?.message || err.message);
    }
  };

  useEffect(() => {
    if (singleuser) {
      const walletAddress = singleuser?.wallet_address || singleuser?.bep20 || "";
      if (walletAddress) setBep20Address(walletAddress);
    }
  }, [singleuser]);

  useEffect(() => {
    if (Array.isArray(singleWithdrawal)) {
      const pendingExists = singleWithdrawal.some(
        (w) => w.status === "pending" && w.type === "principle"
      );
      setHasPendingPrincipleWithdrawal(pendingExists);
    }
  }, [singleWithdrawal]);

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getAllWithdrawalByid());

    if (auth?.id) {
      fetchPrincipleAmount(auth.id);
    }
  }, [dispatch, auth?.id]);

  useEffect(() => {
    // OTP error/success clear
    if (error) {
      const t = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleOTPChange = (e) => setOtp(e.target.value);
  const handleBep20Change = (e) => setBep20Address(e.target.value);
  const handleCheckboxChange = (e) => setAgreeToBep20(e.target.checked);

  const requestOTP = async () => {
    if (hasPendingPrincipleWithdrawal) {
      alert("⚠️ You have a pending principle withdrawal request.");
      return;
    }

    if (!canWithdraw) {
      setError(`You cannot withdraw yet. ${daysRemaining} days remaining.`);
      return;
    }

    if (!bep20Address) {
      setError("Please enter your BEP20 address");
      return;
    }

    if (!agreeToBep20) {
      setError("Please confirm your BEP20 address");
      return;
    }

    if (!acknowledged) {
      setError("Please acknowledge the withdrawal conditions");
      return;
    }

    const emailToUse = singleuser?.email || auth?.email;
    if (!emailToUse) {
      setError("Email not found. Please refresh and try again.");
      return;
    }

    if (!auth?.id) {
      setError("User ID not found. Please login again.");
      return;
    }

    dispatch(sendOTP({ userId: auth.id, email: emailToUse }));
    setIsOTPRequested(true);
    setError("");
  };

  const verifyAndSubmit = async (e) => {
    e.preventDefault();

    if (!auth?.id) {
      setError("User session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      // ✅ OTP verify karo
      const response = await dispatch(verifyOTP({ userId: auth.id, otp }));

      if (response?.payload?.success) {

        // ✅ Sirf user_id aur bep20usdt bhejna hai — amount backend calculate karega
        const allValues = {
          user_id: auth.id,
          bep20usdt: bep20Address,
        };

        const withdrawalResult = await dispatch(WithdrawalPrinciple({ values: allValues }));

        if (withdrawalResult.meta.requestStatus === 'fulfilled') {
          modelClose();
          setOtp("");
          setIsOTPRequested(false);
          setAgreeToBep20(false);
          setBep20Address("");
          setAcknowledged(false);
        } else {
          setError(withdrawalResult.payload || "Withdrawal submission failed");
        }
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!openModel} onClose={modelClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/80" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto hide-scrollbar">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative transform overflow-hidden rounded-[20px] bg-[#0a0d14] border border-[#1a5f7a] shadow-[0_0_60px_rgba(78,205,196,0.08),_0_0_120px_rgba(26,95,122,0.12)] text-left transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* Header */}
            <div className="relative bg-[#0d1520] border-b border-[#1a3a4a] px-6 py-5 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1a5f7a] via-[#4ecdc4] to-[#f5c518]" />
              <div className="pr-10">
                <h3 className="text-[22px] font-bold text-[#f5c518] tracking-wider uppercase m-0">Principle Withdrawal</h3>
                <p className="text-[11px] text-[#4ecdc4] tracking-[3px] mt-1 uppercase opacity-80">SECURE TRANSACTION</p>

                {/* ✅ Amount Pill */}
                <div className="inline-flex items-center gap-2 bg-[#1a5f7a]/25 border border-[#1a5f7a] rounded-full px-3.5 py-1.5 mt-3">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#4ecdc4] shadow-[0_0_6px_#4ecdc4]" />
                  <span className="text-xs text-[#4ecdc4] tracking-wider">
                    PRINCIPLE WALLET: <span className="text-[#f5c518] font-bold">${canWithdraw ? principleAmount.toFixed(2) : "0.00"}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={modelClose}
                className="absolute top-[18px] right-[20px] bg-[#1a5f7a]/20 border border-[#1a5f7a] rounded-lg w-8 h-8 flex items-center justify-center text-[#4ecdc4] hover:bg-[#1a5f7a]/40 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">

              {/* ✅ Amount Card */}
              {/* ✅ Info Box Details */}
              {withdrawalInfo && canWithdraw && (
                <div className="bg-[#1a5f7a]/12 border border-[#1a3a4a] border-l-4 border-l-[#4ecdc4] rounded-r-xl p-4 flex gap-3 items-start mb-6">
                  <div className="mt-1 text-xs text-[#7ab8c4] space-y-1 w-full">
                    <div className="flex justify-between items-center">
                      <span>Original Plan:</span>
                      <span className="text-[#e8f4f8] font-semibold">${withdrawalInfo.originalPlan}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ROI Taken (Deducted):</span>
                      <span className="text-red-400 font-semibold">-${withdrawalInfo.roiDeducted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Activation Days:</span>
                      <span className="text-[#4ecdc4] font-semibold">{withdrawalInfo.daysSinceActivation} days</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ 45 din nahi hue toh warning */}
              {/* ✅ Lock Status Alerts */}
              {!canWithdraw && daysRemaining !== null && (
                <div className="bg-[#f5c518]/5 border border-[#f5c518]/30 rounded-xl p-4 flex gap-3 items-start mb-6">
                  <svg className="w-5 h-5 text-[#f5c518] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#f5c518] m-0">Withdrawal Locked</h4>
                    <p className="text-xs text-[#c9a227] mt-1 leading-relaxed">
                      Withdrawal is available after 45 days.
                      <span className="block font-bold text-[#f5c518] mt-1">{daysRemaining} days remaining</span>
                    </p>
                  </div>
                </div>
              )}

              {/* ✅ 45 din ho gaye toh green */}
              {canWithdraw && (
                <div className="bg-[#4ecdc4]/10 border border-[#4ecdc4]/30 rounded-xl p-4 flex gap-3 items-start mb-6">
                  <svg className="w-5 h-5 text-[#4ecdc4] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#4ecdc4] m-0">Withdrawal Available</h4>
                    <p className="text-xs text-[#7ab8c4] mt-1 leading-relaxed">
                      The 45-day lock period is complete. You can now withdraw your principle.
                    </p>
                  </div>
                </div>
              )}

              {/* ✅ Pending warning */}
              {hasPendingPrincipleWithdrawal && (
                <div className="bg-[#f5c518]/5 border border-[#f5c518]/30 rounded-xl p-4 flex gap-3 items-start mb-6">
                  <svg className="w-5 h-5 text-[#f5c518] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#f5c518] m-0">Pending Principle Withdrawal</h4>
                    <p className="text-xs text-[#c9a227] mt-1 leading-relaxed">
                      You have a pending request. Please wait for it to be processed.
                    </p>
                  </div>
                </div>
              )}

              {!isOTPRequested ? (
                <form className="space-y-6">

                  {/* BEP20 Address */}
                  <div className="mb-6">
                    <label htmlFor="bep20usdt" className="block text-[11px] font-bold text-[#4ecdc4] uppercase tracking-[1.5px] mb-2">
                      BEP-20 USDT Address
                    </label>
                    <input
                      type="text"
                      id="bep20usdt"
                      className="w-full bg-[#0d1520] border border-[#1a3a4a] rounded-xl px-4 py-3.5 text-sm text-[#e8f4f8] placeholder-[#3a5060] outline-none focus:border-[#4ecdc4] focus:ring-4 focus:ring-[#4ecdc4]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                      placeholder="Enter your BEP20 USDT wallet address"
                      value={bep20Address}
                      onChange={handleBep20Change}
                      disabled={hasPendingPrincipleWithdrawal || !canWithdraw}
                    />
                    <div className="flex items-center gap-3 mt-3 px-3 py-2.5 bg-[#1a5f7a]/8 border border-[#1a3a4a] rounded-xl">
                      <input
                        id="agreeToBep20"
                        type="checkbox"
                        checked={agreeToBep20}
                        onChange={handleCheckboxChange}
                        disabled={hasPendingPrincipleWithdrawal || !canWithdraw}
                        className="w-4 h-4 rounded border-[#1a3a4a] bg-[#0d1520] text-[#4ecdc4] focus:ring-[#4ecdc4] accent-[#4ecdc4] cursor-pointer"
                      />
                      <label htmlFor="agreeToBep20" className="text-xs text-[#7ab8c4] cursor-pointer select-none">
                        I confirm my BEP-20 USDT address is correct
                      </label>
                    </div>
                  </div>

                  {/* Amount — readonly, backend se */}
                  <div className="mb-6">
                    <label htmlFor="amount" className="block text-[11px] font-bold text-[#4ecdc4] uppercase tracking-[1.5px] mb-2">
                      Withdrawable Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#4ecdc4]">$</span>
                      <input
                        id="amount"
                        type="text"
                        value={canWithdraw ? principleAmount.toFixed(2) : "0.00"}
                        disabled
                        className="w-full bg-[#0d1520] border border-[#1a3a4a] rounded-xl pl-8 pr-4 py-3.5 text-lg font-bold text-[#f5c518] cursor-not-allowed opacity-80"
                      />
                    </div>
                  </div>

                  {/* Warning box */}
                  <div className="bg-[#f5c518]/5 border border-[#1a3a4a] border-l-4 border-l-[#f5c518] rounded-r-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#f5c518] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#f5c518] m-0">Important Conditions</h4>
                        <ul className="mt-2 space-y-1.5 text-xs text-[#7ab8c4] list-disc pl-4">
                          <li>Account will become <span className="text-[#f5c518]">inactive</span> after withdrawal</li>
                          <li>ROI already taken is deducted from principle</li>
                          <li>Future income & commissions will be disabled</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-[#1a5f7a]/8 border border-[#1a3a4a] rounded-lg">
                      <input
                        id="acknowledge"
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#1a3a4a] bg-[#0d1520] text-[#4ecdc4] focus:ring-[#4ecdc4] accent-[#4ecdc4] cursor-pointer"
                        checked={acknowledged}
                        onChange={() => setAcknowledged(!acknowledged)}
                        disabled={hasPendingPrincipleWithdrawal || !canWithdraw}
                      />
                      <label htmlFor="acknowledge" className="text-xs text-[#7ab8c4] cursor-pointer select-none">
                        I understand and accept these conditions
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                      <p className="text-sm text-red-400 m-0">{error}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={
                      !acknowledged ||
                      !agreeToBep20 ||
                      !bep20Address ||
                      !canWithdraw ||
                      hasPendingPrincipleWithdrawal
                    }
                    onClick={requestOTP}
                    className="w-full py-4 rounded-xl font-bold text-sm tracking-[1.5px] uppercase transition-all
                      disabled:bg-[#1a2535] disabled:text-[#3a5060] disabled:cursor-not-allowed
                      enabled:bg-gradient-to-r enabled:from-[#1a5f7a] enabled:via-[#2a8fa8] enabled:to-[#4ecdc4] enabled:text-[#0a0d14] enabled:shadow-[0_0_20px_rgba(78,205,196,0.3)] enabled:hover:opacity-90"
                  >
                    {hasPendingPrincipleWithdrawal
                      ? "Pending Withdrawal Exists"
                      : !canWithdraw
                        ? `${daysRemaining} Days Remaining`
                        : "Proceed to Verification →"}
                  </button>
                  <p className="text-center text-[10px] tracking-[4px] text-[#1a3a4a] mt-6 uppercase">Dark Horse · SECURE WITHDRAWAL</p>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={verifyAndSubmit}>

                  {/* Summary */}
                  {/* Summary Card */}
                  <div className="bg-[#1a5f7a]/12 border border-[#1a3a4a] rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7ab8c4]">Withdrawal Amount:</span>
                      <span className="text-[#f5c518] font-bold">${principleAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7ab8c4]">Admin Charge:</span>
                      <span className="text-red-400 font-bold">$0.00</span>
                    </div>
                    <div className="pt-3 border-t border-[#1a3a4a] flex justify-between items-center">
                      <span className="text-[#4ecdc4] font-bold">Net Payable:</span>
                      <span className="text-[#4ecdc4] text-xl font-bold">${principleAmount.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 pt-2 text-[10px] text-[#3a5060] font-mono break-all text-center">
                      ADDRESS: {bep20Address}
                    </div>
                  </div>

                  {/* OTP Input */}
                  <div className="text-center">
                    <label htmlFor="otp" className="block text-[11px] font-bold text-[#4ecdc4] uppercase tracking-[1.5px] mb-4">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      id="otp"
                      type="text"
                      placeholder="· · · · · ·"
                      value={otp}
                      onChange={handleOTPChange}
                      maxLength={6}
                      required
                      className="w-full bg-[#0d1520] border border-[#1a5f7a] rounded-2xl p-5 text-3xl text-[#f5c518] font-bold tracking-[12px] text-center outline-none focus:ring-4 focus:ring-[#4ecdc4]/10 transition-all placeholder-[#1a3a4a]"
                    />

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2.5 mt-4">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${i < otp.length ? "bg-[#f5c518] shadow-[0_0_8px_#f5c518]" : "bg-[#1a3a4a]"
                            }`}
                        />
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-[#7ab8c4]">
                      OTP sent to <span className="text-[#4ecdc4] font-semibold">{singleuser?.email || auth?.email}</span>
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-400 text-sm m-0">{error}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={otp.length !== 6 || loading}
                      className="w-full py-4 rounded-xl font-bold text-sm tracking-[1.5px] uppercase transition-all
                        disabled:bg-[#1a2535] disabled:text-[#3a5060] disabled:cursor-not-allowed
                        enabled:bg-gradient-to-r enabled:from-[#1a5f7a] enabled:via-[#2a8fa8] enabled:to-[#4ecdc4] enabled:text-[#0a0d14] enabled:shadow-[0_0_20px_rgba(78,205,196,0.3)] enabled:hover:opacity-90"
                    >
                      {loading ? <Spinner /> : "Submit Withdrawal →"}
                    </button>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setIsOTPRequested(false); setOtp(""); }}
                        className="flex-1 py-3 bg-transparent border border-[#1a3a4a] text-[#4ecdc4] rounded-xl text-sm font-semibold hover:bg-[#1a5f7a]/10 transition-all"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={requestOTP}
                        disabled={loading}
                        className="flex-1 py-3 bg-transparent border border-[#1a3a4a] text-[#4ecdc4] rounded-xl text-sm font-semibold hover:bg-[#1a5f7a]/10 transition-all disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                  <p className="text-center text-[10px] tracking-[4px] text-[#1a3a4a] mt-6 uppercase">Dark Horse · SECURE WITHDRAWAL</p>
                </form>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}


// import {
//   getAllWithdrawalByid,
//   WithdrawalPrinciple,
// } from "../../redux/withdrawalSlice";
// import {
//   sendOTP,
//   verifyOTP,
//   clearOtpErrors,
//   clearOtpMessage,
// } from "../../redux/otpSlice";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Spinner from "../common/Spinner";
// import { getMyProfile } from "../../redux/userSlice";
// import api from '../../api/axiosInstance';
// import { selectUser } from "../../redux/authSlice";

// export default function PrincipleWithdrawal({ openModel, modelClose }) {
//   const dispatch = useDispatch();

//   const auth = useSelector(selectUser);
//   const { myprofile: singleuser } = useSelector((state) => state.users);
//   const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);

//   const [isOTPRequested, setIsOTPRequested] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [bep20Address, setBep20Address] = useState("");
//   const [agreeToBep20, setAgreeToBep20] = useState(false);
//   const [acknowledged, setAcknowledged] = useState(false);
//   const [hasPendingPrincipleWithdrawal, setHasPendingPrincipleWithdrawal] = useState(false);

//   // ✅ Backend se aayega
//   const [principleAmount, setPrincipleAmount] = useState(0);
//   const [daysRemaining, setDaysRemaining] = useState(null);
//   const [canWithdraw, setCanWithdraw] = useState(false);
//   const [withdrawalInfo, setWithdrawalInfo] = useState(null);

//   // ✅ Backend se principle amount fetch karo
//   const fetchPrincipleAmount = async (id) => {
//     try {
//       const res = await api.get(`/withdrawalrequest/principle/info/${id}`);
//       const data = res.data;

//       if (data?.success) {
//         setPrincipleAmount(data.principleAmount);
//         setCanWithdraw(true);
//         setDaysRemaining(null);
//         setWithdrawalInfo(data);
//       }
//     } catch (err) {
//       const errData = err?.response?.data;
//       if (errData?.daysRemaining) {
//         setDaysRemaining(errData.daysRemaining);
//         setCanWithdraw(false);
//       }
//       console.log("Principle info error:", errData?.message || err.message);
//     }
//   };

//   useEffect(() => {
//     if (singleuser) {
//       const walletAddress = singleuser?.wallet_address || singleuser?.bep20 || "";
//       if (walletAddress) setBep20Address(walletAddress);
//     }
//   }, [singleuser]);

//   useEffect(() => {
//     if (Array.isArray(singleWithdrawal)) {
//       const pendingExists = singleWithdrawal.some(
//         (w) => w.status === "pending" && w.type === "principle"
//       );
//       setHasPendingPrincipleWithdrawal(pendingExists);
//     }
//   }, [singleWithdrawal]);

//   useEffect(() => {
//     dispatch(getMyProfile());
//     dispatch(getAllWithdrawalByid());

//     if (auth?.id) {
//       fetchPrincipleAmount(auth.id);
//     }
//   }, [dispatch, auth?.id]);

//   useEffect(() => {
//     // OTP error/success clear
//     if (error) {
//       const t = setTimeout(() => setError(""), 4000);
//       return () => clearTimeout(t);
//     }
//   }, [error]);

//   const handleOTPChange = (e) => setOtp(e.target.value);
//   const handleBep20Change = (e) => setBep20Address(e.target.value);
//   const handleCheckboxChange = (e) => setAgreeToBep20(e.target.checked);

//   const requestOTP = async () => {
//     if (hasPendingPrincipleWithdrawal) {
//       alert("⚠️ You have a pending principle withdrawal request.");
//       return;
//     }

//     if (!canWithdraw) {
//       setError(`You cannot withdraw yet. ${daysRemaining} days remaining.`);
//       return;
//     }

//     if (!bep20Address) {
//       setError("Please enter your BEP20 address");
//       return;
//     }

//     if (!agreeToBep20) {
//       setError("Please confirm your BEP20 address");
//       return;
//     }

//     if (!acknowledged) {
//       setError("Please acknowledge the withdrawal conditions");
//       return;
//     }

//     const emailToUse = singleuser?.email || auth?.email;
//     if (!emailToUse) {
//       setError("Email not found. Please refresh and try again.");
//       return;
//     }

//     if (!auth?.id) {
//       setError("User ID not found. Please login again.");
//       return;
//     }

//     dispatch(sendOTP({ userId: auth.id, email: emailToUse }));
//     setIsOTPRequested(true);
//     setError("");
//   };

//   const verifyAndSubmit = async (e) => {
//     e.preventDefault();

//     if (!auth?.id) {
//       setError("User session expired. Please login again.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // ✅ OTP verify karo
//       const response = await dispatch(verifyOTP({ userId: auth.id, otp }));

//       if (response?.payload?.success) {

//         // ✅ Sirf user_id aur bep20usdt bhejna hai — amount backend calculate karega
//         const allValues = {
//           user_id: auth.id,
//           bep20usdt: bep20Address,
//         };

//         const withdrawalResult = await dispatch(WithdrawalPrinciple({ values: allValues }));

//         if (withdrawalResult.meta.requestStatus === 'fulfilled') {
//           modelClose();
//           setOtp("");
//           setIsOTPRequested(false);
//           setAgreeToBep20(false);
//           setBep20Address("");
//           setAcknowledged(false);
//         } else {
//           setError(withdrawalResult.payload || "Withdrawal submission failed");
//         }
//       } else {
//         setError("OTP verification failed. Please try again.");
//       }
//     } catch (err) {
//       setError(err?.response?.data?.message || "An error occurred");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={!!openModel} onClose={modelClose} className="relative z-50">
//       <DialogBackdrop className="fixed inset-0 bg-black/80" />
//       <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
//         <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//           <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
//             <div className="p-5 text-white">

//               {/* Header */}
//               <div className="py-4 flex justify-between items-center border-b border-gray-700 mb-6">
//                 <h2 className="text-xl font-semibold">Principle Withdrawal</h2>
//                 <button onClick={modelClose} className="text-gray-400 hover:text-gray-200">✕</button>
//               </div>

//               {/* ✅ Amount Card */}
//               <div className="bg-gray-800 p-4 rounded-lg mb-6">
//                 <p className="text-blue-400 font-medium text-sm">
//                   Your Withdrawable Amount:{" "}
//                   <span className="font-bold text-white">
//                     ${canWithdraw ? principleAmount.toFixed(2) : "0.00"}
//                   </span>
//                 </p>
//                 {withdrawalInfo && (
//                   <div className="mt-2 text-xs text-gray-400 space-y-1">
//                     <p>Original Plan: <span className="text-white">${withdrawalInfo.originalPlan}</span></p>
//                     <p>ROI Taken: <span className="text-red-400">-${withdrawalInfo.roiDeducted}</span></p>
//                     <p>Days Since Activation: <span className="text-green-400">{withdrawalInfo.daysSinceActivation} days</span></p>
//                   </div>
//                 )}
//               </div>

//               {/* ✅ 45 din nahi hue toh warning */}
//               {!canWithdraw && daysRemaining !== null && (
//                 <div className="bg-yellow-900 border border-yellow-700 p-4 rounded-lg mb-6">
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="text-yellow-500">⏰</span>
//                     <h3 className="text-sm font-medium text-yellow-100">Withdrawal Locked</h3>
//                   </div>
//                   <p className="text-yellow-200 text-sm">
//                     You can withdraw your principle after <span className="font-bold">45 days</span> of plan activation.
//                   </p>
//                   <p className="text-yellow-400 font-bold mt-2">
//                     {daysRemaining} days remaining
//                   </p>
//                 </div>
//               )}

//               {/* ✅ 45 din ho gaye toh green */}
//               {canWithdraw && (
//                 <div className="bg-green-900 border border-green-700 p-4 rounded-lg mb-6">
//                   <div className="flex items-center gap-2">
//                     <span className="text-green-500">✓</span>
//                     <h3 className="text-sm font-medium text-green-100">
//                       Withdrawal Available
//                     </h3>
//                   </div>
//                   <p className="text-green-200 text-sm mt-1">
//                     45 day lock period is complete. You can now withdraw your principle.
//                   </p>
//                 </div>
//               )}

//               {/* ✅ Pending warning */}
//               {hasPendingPrincipleWithdrawal && (
//                 <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-600 rounded-md">
//                   <div className="flex">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-yellow-300">Pending Principle Withdrawal</h3>
//                       <p className="mt-1 text-sm text-yellow-200">
//                         You have a pending principle withdrawal. Please wait for it to be processed.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {!isOTPRequested ? (
//                 <form className="space-y-6">

//                   {/* BEP20 Address */}
//                   <div>
//                     <label htmlFor="bep20usdt" className="block text-sm font-medium text-gray-300 mb-2">
//                       BEP 20 USDT Address
//                     </label>
//                     <input
//                       type="text"
//                       id="bep20usdt"
//                       className="py-3 border border-gray-700 bg-black text-white block w-full pl-4 pr-12 sm:text-sm rounded-md disabled:opacity-50 focus:ring-indigo-500"
//                       placeholder="Enter your BEP20 USDT wallet address"
//                       value={bep20Address}
//                       onChange={handleBep20Change}
//                       disabled={hasPendingPrincipleWithdrawal || !canWithdraw}
//                     />
//                     <div className="flex items-center mt-2">
//                       <input
//                         id="agreeToBep20"
//                         type="checkbox"
//                         checked={agreeToBep20}
//                         onChange={handleCheckboxChange}
//                         disabled={hasPendingPrincipleWithdrawal || !canWithdraw}
//                         className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
//                       />
//                       <label htmlFor="agreeToBep20" className="ml-2 block text-sm text-gray-300 select-none">
//                         I confirm my BEP 20 USDT address is correct
//                       </label>
//                     </div>
//                   </div>

//                   {/* Amount — readonly, backend se */}
//                   <div>
//                     <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
//                       Withdrawable Amount
//                     </label>
//                     <input
//                       id="amount"
//                       type="text"
//                       value={canWithdraw ? `$${principleAmount.toFixed(2)}` : "$0.00"}
//                       disabled
//                       className="block w-full rounded-md border border-gray-700 py-3 px-4 bg-gray-800 text-white shadow-sm sm:text-sm cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Warning box */}
//                   <div className="bg-orange-900 border border-orange-700 p-4 rounded-md">
//                     <div className="flex items-start">
//                       <span className="text-orange-500">⚠️</span>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-orange-100">Important Warning</h3>
//                         <ul className="list-disc pl-5 space-y-1 mt-1 text-orange-200 text-sm">
//                           <li>Your account will become inactive after withdrawal</li>
//                           <li className="font-bold">ROI already taken has been deducted from principle</li>
//                           <li>No trade income or commissions will be earned</li>
//                           <li>To restore benefits, a new plan purchase is required</li>
//                         </ul>
//                       </div>
//                     </div>
//                     <div className="mt-4 flex items-center">
//                       <input
//                         id="acknowledge"
//                         type="checkbox"
//                         className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
//                         checked={acknowledged}
//                         onChange={() => setAcknowledged(!acknowledged)}
//                         disabled={hasPendingPrincipleWithdrawal || !canWithdraw}
//                       />
//                       <label htmlFor="acknowledge" className="ml-2 block text-sm text-gray-300">
//                         I understand and accept these conditions
//                       </label>
//                     </div>
//                   </div>

//                   {error && (
//                     <div className="rounded-md bg-red-900/50 border border-red-700 p-3">
//                       <p className="text-sm text-red-300">{error}</p>
//                     </div>
//                   )}

//                   <button
//                     type="button"
//                     disabled={
//                       !acknowledged ||
//                       !agreeToBep20 ||
//                       !bep20Address ||
//                       !canWithdraw ||
//                       hasPendingPrincipleWithdrawal
//                     }
//                     className="w-full py-3 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
//                     onClick={requestOTP}
//                   >
//                     {hasPendingPrincipleWithdrawal
//                       ? "Pending Withdrawal Exists"
//                       : !canWithdraw
//                       ? `${daysRemaining} Days Remaining`
//                       : "Proceed to Verification"}
//                   </button>
//                 </form>
//               ) : (
//                 <form className="space-y-6" onSubmit={verifyAndSubmit}>

//                   {/* Summary */}
//                   <div className="rounded-md bg-gray-800 p-4 mb-4 text-white space-y-1">
//                     <p>Withdrawal Amount: <span className="font-bold text-blue-400">${principleAmount.toFixed(2)}</span></p>
//                     <p>Admin Charge: <span className="font-bold text-red-500">$0.00</span></p>
//                     <p>Net Amount: <span className="font-bold text-green-400">${principleAmount.toFixed(2)}</span></p>
//                     <p className="mt-2 pt-2 border-t border-gray-700 text-xs">
//                       Withdrawal Address: <span className="font-mono text-gray-300 break-all">{bep20Address}</span>
//                     </p>
//                   </div>

//                   {/* OTP Input */}
//                   <div className="relative w-full">
//                     <label htmlFor="otp" className="absolute -top-2 left-2 bg-gray-900 px-1 text-xs font-medium text-gray-300">
//                       OTP
//                     </label>
//                     <input
//                       id="otp"
//                       type="text"
//                       placeholder="Enter 6-digit OTP"
//                       value={otp}
//                       onChange={handleOTPChange}
//                       maxLength={6}
//                       required
//                       className="block w-full p-4 rounded-md border-0 bg-black text-white shadow-sm ring-1 ring-gray-700 focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest"
//                     />
//                     <p className="mt-1 text-xs text-gray-400">
//                       OTP sent to {singleuser?.email || auth?.email}
//                     </p>
//                   </div>

//                   {error && (
//                     <div className="rounded-md bg-red-900 p-4">
//                       <p className="text-red-500 text-sm">{error}</p>
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     disabled={otp.length !== 6 || loading}
//                     className="w-full mt-4 p-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? <Spinner /> : "Submit Withdrawal"}
//                   </button>

//                   <div className="text-center">
//                     <button
//                       type="button"
//                       onClick={requestOTP}
//                       disabled={loading}
//                       className="text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
//                     >
//                       Resend OTP
//                     </button>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => { setIsOTPRequested(false); setOtp(""); }}
//                     className="w-full mt-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
//                   >
//                     Back
//                   </button>
//                 </form>
//               )}
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   );
// }
