import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../common/Spinner";
import { getMyProfile } from "../../redux/userSlice";
import {
  addWithdrawal,
  getAllWithdrawalByid,
} from "../../redux/withdrawalSlice";
import {
  sendOTP,
  verifyOTP,
  clearOtpErrors,
  clearOtpMessage,
  resetOtpState,
} from "../../redux/otpSlice";

export const calculateMaxWithdrawal = (user, transactions, currentDate, dispatch) => {
  const EARNING_MULTIPLIER = 4;
  const WITHDRAWAL_PERCENTAGE = 0.5;
  const totalLimit = user.active_plan * EARNING_MULTIPLIER;
  const maxWithdrawableTotal = totalLimit * WITHDRAWAL_PERCENTAGE;
  const totalWithdrawals = transactions
    .filter((item) => item.status !== "decline")
    .reduce((acc, item) => acc + (item.amount || 0) + (item.deduction || 0), 0);
  const remainingWithdrawalLimit = Math.max(0, maxWithdrawableTotal - totalWithdrawals);
  let availableForWithdrawal = Math.min(remainingWithdrawalLimit, user.working);
  return {
    canWithdrawFullBalance: true,
    maxAmount: availableForWithdrawal,
    remainingLimit: remainingWithdrawalLimit,
    alreadyWithdrawn: totalWithdrawals,
    totalLimit: totalLimit,
    remainingFromTotal: totalLimit - totalWithdrawals,
  };
};

export default function UserWithdrawalModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.otp);
  const { myprofile: singleuser } = useSelector((state) => state.users);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const withdrawalState = useSelector((state) => state.withdrawal || state.allwithdrawal || state.staff || {});
  const withdrawalError = withdrawalState.error;
  const withdrawalLoading = withdrawalState.loading;
  const withdrawalMessage = withdrawalState.message;

  const [values, setValues] = useState({});
  const [check, setCheck] = useState(null);
  const [maxAmount, setMaxAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [agreeToBep20, setAgreeToBep20] = useState(false);
  const [bep20Address, setBep20Address] = useState("");
  const [hasPendingWithdrawal, setHasPendingWithdrawal] = useState(false);

  useEffect(() => { dispatch(getMyProfile()); dispatch(getAllWithdrawalByid()); }, [dispatch]);

  useEffect(() => {
    if (singleuser) {
      setMaxAmount(singleuser?.working || 0);
      const wa = singleuser?.wallet_address || singleuser?.bep20 || "";
      if (wa) setBep20Address(wa);
    }
    if (Array.isArray(singleWithdrawal)) {
      setHasPendingWithdrawal(
        singleWithdrawal.some((w) => w.status === "pending" && (w.type === "ROI" || w.type === "working"))
      );
    }
  }, [singleuser, singleWithdrawal]);

  useEffect(() => {
    if (error) { const t = setTimeout(() => dispatch(clearOtpErrors()), 5000); return () => clearTimeout(t); }
    if (message) { const t = setTimeout(() => dispatch(clearOtpMessage()), 5000); return () => clearTimeout(t); }
  }, [dispatch, error, message]);

  useEffect(() => {
    if (!openModel) {
      setIsOTPRequested(false); setOtp(""); setValues({});
      setAgreeToBep20(false); setBep20Address("");
      dispatch(resetOtpState());
    }
  }, [openModel, dispatch]);

  const isReady = values.amount && agreeToBep20 && bep20Address && !loading && !hasPendingWithdrawal;

  const handleChange = (e) => { const { name, value } = e.target; setValues((p) => ({ ...p, [name]: value })); };
  const handleOTPChange = (e) => { const v = e.target.value.replace(/\D/g, ""); if (v.length <= 6) setOtp(v); };

  const requestOTP = async () => {
    if (hasPendingWithdrawal) { alert("You have a pending withdrawal. Please wait."); return; }
    try {
      const result = await dispatch(sendOTP({ userId: auth?.id, email: singleuser?.email }));
      if (result.meta.requestStatus === "fulfilled") setIsOTPRequested(true);
    } catch (e) { console.error(e); }
  };

  const verifyAndSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(verifyOTP({ userId: auth?.id, otp }));
      if (result.meta.requestStatus === "fulfilled") {
        const allValues = { amount: values.amount, bep20usdt: bep20Address, user_id: auth?.id, check };
        const wr = await dispatch(addWithdrawal({ values: allValues }));
        if (wr.type === "withdrawal/add/rejected") return;
        if (wr.meta.requestStatus === "fulfilled") {
          modelClose(); setOtp(""); setIsOTPRequested(false);
          setValues({}); setAgreeToBep20(false); setBep20Address("");
        }
      }
    } catch (e) { console.error(e); }
  };

  return (
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      {/* Overlay Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-[#000814]/85 backdrop-blur-sm transition-opacity" />
      
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto hide-scrollbar">
        {/* Container adjusts alignment dynamically: bottom on mobile, centered on desktop */}
        <div className="flex min-h-full items-end justify-center p-0 md:items-center md:p-6 text-center">
          
          {/* Max-width steps up dynamically to handle widescreen content grids cleanly */}
          <DialogPanel className="relative w-full transform overflow-hidden rounded-t-3xl md:rounded-2xl border-t md:border border-[#bc810c] bg-[#0a0d14] text-left shadow-2xl transition-all md:max-w-3xl shadow-[0_0_80px_rgba(181,123,16,0.12)]">
            
            {/* Header */}
            <div className="relative overflow-hidden bg-[#221a07] border-b border-[#251a0b] px-5 py-6 md:px-8 md:py-7">
              {/* Gold Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c48915] via-[#232017] to-[#3d330f]" />
              
              <div className="pr-12">
                <h3 className="text-xl md:text-2xl font-bold text-[#f5c518] tracking-wide m-0">
                  Withdrawal Request
                </h3>
                <p className="text-[10px] md:text-xs font-semibold text-[#bd830f] tracking-[3px] mt-1 opacity-80">
                  SECURE TRANSACTION TERMINAL
                </p>
              </div>
              
              {/* Close Button */}
              <button 
                onClick={modelClose} 
                className="absolute top-1/2 -translate-y-1/2 right-5 md:right-8 flex h-8 w-8 items-center justify-center rounded-lg border border-[#cd9513] bg-white/10 text-[#ca920e] text-lg cursor-pointer transition hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            {/* Global Context Errors/Alert Stack */}
            <div className="px-5 pt-4 md:px-8 md:pt-6 space-y-3">
              {message && (
                <div className="bg-[#c97610]/10 border border-[#c08e11]/30 rounded-lg p-3">
                  <p className="text-xs md:text-sm text-[#cd9a4e] m-0">{message}</p>
                </div>
              )}
              {withdrawalMessage && (
                <div className="bg-[#c97610]/10 border border-[#c08e11]/30 rounded-lg p-3">
                  <p className="text-xs md:text-sm text-[#dcb20b] m-0">{withdrawalMessage}</p>
                </div>
              )}
              {error && (
                <div className="bg-[#bf722a]/10 border border-[#c66313]/30 rounded-lg p-3">
                  <p className="text-xs md:text-sm text-[#e05050] m-0">{error}</p>
                </div>
              )}
              {withdrawalError && (
                <div className="bg-[#bf722a]/10 border border-[#c66313]/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-[#c04040] mb-0.5">Withdrawal Error</p>
                  <p className="text-xs md:text-sm text-[#e05050] m-0">{withdrawalError}</p>
                </div>
              )}
              {hasPendingWithdrawal && (
                <div className="bg-[#f5c518]/5 border border-[#f5c518]/30 rounded-lg p-3 flex gap-3">
                  <svg className="text-[#f5c518] shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-[#f5c518] m-0">Pending Request Intercepted</p>
                    <p className="text-xs text-[#c9a227] mt-0.5 m-0">Please allow our ledger processing window to finish your existing query before filing another.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Split Content Core Panel */}
            <div className="px-5 pb-8 pt-4 md:px-8 md:pb-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: User Financial Ledger Details (Spans 5 cols on Desktop) */}
              <div className="md:col-span-5 space-y-4 bg-[#221a07]/30 border border-[#251a0b] rounded-2xl p-4">
                <div>
                  <span className="block text-[10px] font-bold text-[#bd830f] uppercase tracking-wider mb-1">Vault Portfolio</span>
                  <div className="inline-flex items-center gap-2 bg-[#b9940f]/15 border border-[#d6ab0e]/40 rounded-lg px-3 py-2 w-full">
                    <span className="w-2 h-2 rounded-full bg-[#c78e09] shadow-[0_0_6px_#c57a1f]" />
                    <p className="text-xs text-[#e2ddd5] m-0">
                      Available Balance: <span className="text-[#f5c518] font-bold ml-1">${maxAmount}</span>
                    </p>
                  </div>
                </div>

                {/* Terms Information Summary Strip */}
                <div className="bg-[#b5820c]/10 border border-[#cb7e0b]/40 border-l-[3px] border-l-[#ae7c11] rounded-r-lg p-3 space-y-2">
                  <div className="flex gap-2 items-start">
                    <svg className="text-[#f5c518] shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[11px] text-[#ede9e2] leading-normal m-0 font-medium">
                      Operational Threshold Parameters:
                    </p>
                  </div>
                  <ul className="text-[11px] text-[#c3b18f] space-y-1 pl-5 list-disc opacity-90">
                    <li>Minimum limit threshold: <span className="text-[#f5c518] font-semibold">$10</span></li>
                    <li>Surcharge platform gas fee: <span className="text-[#f5c518] font-semibold">10%</span></li>
                    <li>Processing pipeline queue: <span className="text-[#f5c518] font-semibold">24–48 Hours</span></li>
                  </ul>
                </div>
              </div>

              {/* RIGHT COLUMN: Functional Entry Forms (Spans 7 cols on Desktop) */}
              <div className="md:col-span-7">
                {!isOTPRequested ? (
                  <div className="space-y-4">
                    {/* BEP20 Address Box */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#f1efeb] uppercase tracking-[1.5px] mb-1.5">
                        BEP-20 USDT Address
                      </label>
                      <input
                        type="text" name="bep20usdt" value={bep20Address}
                        disabled={true} placeholder="0x..."
                        className="w-full bg-[#090804] border border-[#d89510] rounded-xl px-4 py-3 text-xs font-mono text-[#c3b18f]/40 cursor-not-allowed outline-none opacity-50"
                      />
                      
                      <div className="flex items-center gap-2.5 mt-2 p-2.5 bg-[#b47a0f]/10 border border-[#a96a0d]/70 rounded-lg">
                        <input
                          id="agreeToBep20" type="checkbox" checked={agreeToBep20}
                          onChange={(e) => setAgreeToBep20(e.target.checked)}
                          disabled={hasPendingWithdrawal}
                          className="accent-[#d07a0a] w-4 h-4 cursor-pointer shrink-0"
                        />
                        <label htmlFor="agreeToBep20" className="text-xs text-[#f6f4f2] select-none cursor-pointer leading-tight">
                          I verify my secondary crypto address routing target is authentic
                        </label>
                      </div>
                    </div>

                    {/* Value Amount Request Frame */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#f1efeb] uppercase tracking-[1.5px] mb-1.5">
                        Withdrawal Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#bc9521] pointer-events-none">
                          $
                        </span>
                        <input
                          type="number" name="amount" placeholder="0.00"
                          onChange={handleChange}
                          min={10} step={1} max={maxAmount}
                          disabled={hasPendingWithdrawal}
                          className="w-full bg-[#090804] border border-[#d89510] focus:border-[#cf9a31] focus:ring-2 focus:ring-[#cf9a31]/20 rounded-xl pl-8 pr-24 py-3 text-base font-semibold text-[#f5c518] outline-none transition disabled:opacity-40"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#c08a0c] pointer-events-none">
                          MAX: ${maxAmount}
                        </span>
                      </div>

                      {/* Realtime Yield Calculations */}
                      {values.amount && (
                        <div className="mt-2 bg-[#f5c518]/5 border border-[#f5c518]/20 rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-[#f5c518] m-0">${values.amount}</p>
                            <p className="text-[11px] text-[#d99a1a] m-0">Gross volume total</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-emerald-500 m-0">
                              Net Payoff: ${(values.amount * 0.9).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )}
                      {errorMessage && <p className="text-rose-500 text-xs mt-2 m-0">{errorMessage}</p>}
                    </div>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c3a10c]/40 to-transparent my-4" />

                    <button
                      type="button" disabled={!isReady} onClick={requestOTP}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-[1.5px] uppercase transition cursor-pointer ${
                        isReady 
                          ? "bg-gradient-to-r from-[#be7d0d] via-[#bd995c] to-[#c08c33] text-[#0a0d14] shadow-lg shadow-amber-500/5 hover:brightness-110" 
                          : "bg-[#2a1c01] text-[#db9717] opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {loading ? <Spinner /> : hasPendingWithdrawal ? "Action Locked" : "Generate Verification OTP →"}
                    </button>
                  </div>
                ) : (
                  /* OTP Authentication View */
                  <div className="space-y-4">
                    <div className="bg-[#1a5f7a]/10 border border-[#1a3a4a] rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#4ecdc4]/15 border border-[#4ecdc4] flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="#4ecdc4">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-[#4ecdc4] m-0">Challenge Token Outbound</p>
                        <p className="text-[11px] text-[#7ab8c4] m-0">Dispatched onto profile primary email sync address.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#f1efeb] uppercase tracking-[1.5px] mb-2 text-left">
                        Secure OTP Core Key
                      </label>
                      <input
                        id="otp" type="text" placeholder="······"
                        value={otp} onChange={handleOTPChange} maxLength={6}
                        className="w-full bg-[#090804] border border-[#d89510] focus:border-[#cf9a31] rounded-xl py-3 text-xl font-bold text-[#f5c518] tracking-[10px] text-center outline-none transition"
                      />

                      {/* Code State Tracker Indicators */}
                      <div className="flex justify-center gap-1.5 mt-2.5">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                              i < otp.length ? "bg-[#f5c518] shadow-[0_0_6px_#f5c518]" : "bg-[#cb8711]/40"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="text-center mt-3">
                        <button type="button" onClick={requestOTP} disabled={loading} className="bg-transparent border-none text-[#dd7819] text-xs underline cursor-pointer hover:text-amber-500">
                          Re-transmit Key
                        </button>
                      </div>
                    </div>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c3a10c]/40 to-transparent my-4" />

                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="submit"
                        disabled={otp.length !== 6 || loading || withdrawalLoading}
                        onClick={verifyAndSubmit}
                        className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-[1.5px] uppercase transition cursor-pointer ${
                          (otp.length === 6 && !loading && !withdrawalLoading)
                            ? "bg-gradient-to-r from-[#be7d0d] via-[#bd995c] to-[#c08c33] text-[#0a0d14] shadow-lg"
                            : "bg-[#2a1c01] text-[#db9717] opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {loading || withdrawalLoading ? <Spinner /> : "Authorize Settlement Requests"}
                      </button>

                      <button
                        type="button"
                        onClick={() => { setIsOTPRequested(false); setOtp(""); }}
                        className="w-full py-2.5 bg-transparent border border-[#bd7810]/60 rounded-xl text-xs font-semibold text-[#bd7810] tracking-wide cursor-pointer hover:bg-white/5"
                      >
                        ← Back to Parameters
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Brand Stamp Accent */}
            <div className="bg-[#221a07]/10 border-t border-[#251a0b]/40 py-3 text-center">
              <p className="text-[9px] tracking-[4px] text-[#d19212]/70 font-medium uppercase m-0">
                Dark Horse SYSTEM NETWORK ENGINE · SECURED INTERACTION
              </p>
            </div>

          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

// import React, { useState, useEffect } from "react";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import { useSelector, useDispatch } from "react-redux";
// import Spinner from "../common/Spinner";
// import { getMyProfile } from "../../redux/userSlice";
// import {
//   addWithdrawal,
//   getAllWithdrawalByid,
// } from "../../redux/withdrawalSlice";
// import {
//   sendOTP,
//   verifyOTP,
//   clearOtpErrors,
//   clearOtpMessage,
//   resetOtpState,
// } from "../../redux/otpSlice";

// export const calculateMaxWithdrawal = (user, transactions, currentDate, dispatch) => {
//   const EARNING_MULTIPLIER = 4;
//   const WITHDRAWAL_PERCENTAGE = 0.5;
//   const totalLimit = user.active_plan * EARNING_MULTIPLIER;
//   const maxWithdrawableTotal = totalLimit * WITHDRAWAL_PERCENTAGE;
//   const totalWithdrawals = transactions
//     .filter((item) => item.status !== "decline")
//     .reduce((acc, item) => acc + (item.amount || 0) + (item.deduction || 0), 0);
//   const remainingWithdrawalLimit = Math.max(0, maxWithdrawableTotal - totalWithdrawals);
//   let availableForWithdrawal = Math.min(remainingWithdrawalLimit, user.working);
//   return {
//     canWithdrawFullBalance: true,
//     maxAmount: availableForWithdrawal,
//     remainingLimit: remainingWithdrawalLimit,
//     alreadyWithdrawn: totalWithdrawals,
//     totalLimit: totalLimit,
//     remainingFromTotal: totalLimit - totalWithdrawals,
//   };
// };

// const S = {
//   overlay: { background: "rgba(0,8,20,0.80)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" },
//   panel: {
//     background: "#0a0d14",
//     border: "1px solid #bc810c",
//     borderRadius: "20px",
//     overflow: "hidden",
//     boxShadow: "0 0 60px rgba(181, 123, 16, 0.08), 0 0 120px rgba(204, 156, 11, 0.12)",
//   },
//   header: {
//     background: "#221a07",
//     borderBottom: "1px solid #251a0b",
//     padding: "22px 26px 18px",
//     position: "relative",
//     overflow: "hidden",
//   },
//   accentLine: {
//     position: "absolute",
//     top: 0, left: 0, right: 0,
//     height: "2px",
//     background: "linear-gradient(90deg,#c48915 0%,#232017 50%,#3d330f 100%)",
//   },
//   title: { fontSize: "22px", fontWeight: "700", color: "#f5c518", letterSpacing: "1px", margin: 0 },
//   subTitle: { fontSize: "11px", color: "#bd830f", letterSpacing: "3px", marginTop: "4px", opacity: 0.8 },
//   badge: {
//     display: "inline-flex", alignItems: "center", gap: "8px",
//     background: "rgba(185, 148, 15, 0.25)", border: "1px solid #d6ab0e",
//     borderRadius: "30px", padding: "6px 14px", marginTop: "12px",
//   },
//   dot: { width: "7px", height: "7px", borderRadius: "50%", background: "#c78e09", boxShadow: "0 0 6px #c57a1f" },
//   badgeText: { fontSize: "12px", color: "#e2ddd5", letterSpacing: "0.5px" },
//   goldVal: { color: "#f5c518", fontWeight: "600" },
//   closeBtn: {
//     position: "absolute", top: "18px", right: "20px",
//     background: "rgba(212, 208, 199, 0.2)", border: "1px solid #cd9513",
//     borderRadius: "10px", width: "32px", height: "32px",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     cursor: "pointer", color: "#ca920e", fontSize: "16px",
//   },
//   body: { padding: "22px 26px 28px" },
//   infoBox: {
//     background: "rgba(181, 130, 12, 0.12)", border: "1px solid #cb7e0b",
//     borderLeft: "3px solid #ae7c11", borderRadius: "0 10px 10px 0",
//     padding: "12px 16px", display: "flex", gap: "10px",
//     alignItems: "flex-start", marginBottom: "22px",
//   },
//   infoText: { fontSize: "12px", color: "#ede9e2", lineHeight: "1.7", margin: 0 },
//   infoHL: { color: "#f5c518", fontWeight: "600" },
//   label: {
//     fontSize: "11px", fontWeight: "600", color: "#f1efeb",
//     textTransform: "uppercase", letterSpacing: "1.5px",
//     marginBottom: "8px", display: "block",
//   },
//   inputBase: {
//     width: "100%", background: "#090804",
//     border: "1px solid #d89510", borderRadius: "12px",
//     padding: "14px 16px", fontSize: "14px", color: "#c3b18f",
//     outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
//   },
//   inputFocus: { borderColor: "#cf9a31", boxShadow: "0 0 0 3px rgba(208, 203, 193, 0.1)" },
//   prefix: {
//     position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
//     fontSize: "13px", fontWeight: "600", color: "#bc9521", pointerEvents: "none",
//   },
//   suffix: {
//     position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
//     fontSize: "11px", fontWeight: "600", color: "#c08a0c", pointerEvents: "none",
//   },
//   checkRow: {
//     display: "flex", alignItems: "center", gap: "10px", marginTop: "10px",
//     padding: "10px 14px", background: "rgba(180, 122, 15, 0.08)",
//     borderRadius: "10px", border: "1px solid #a96a0d",
//   },
//   checkLabel: { fontSize: "12px", color: "#f6f4f2", userSelect: "none" },
//   dollarBox: {
//     marginTop: "10px", background: "rgba(245,197,24,0.06)",
//     border: "1px solid rgba(245,197,24,0.25)", borderRadius: "10px",
//     padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
//   },
//   dollarMain: { fontSize: "15px", fontWeight: "700", color: "#f5c518", margin: 0 },
//   dollarSub: { fontSize: "11px", color: "#d99a1a", marginTop: "2px" },
//   divider: { height: "1px", background: "linear-gradient(90deg,transparent,#c3a10c,transparent)", margin: "22px 0" },
//   btnPrimary: {
//     width: "100%", padding: "15px",
//     background: "linear-gradient(135deg,#be7d0d 0%,#bd995c 50%,#c08c33 100%)",
//     border: "none", borderRadius: "12px",
//     fontSize: "14px", fontWeight: "700", color: "#0a0d14",
//     cursor: "pointer", letterSpacing: "1.5px", textTransform: "uppercase",
//   },
//   btnPrimaryOff: {
//     width: "100%", padding: "15px",
//     background: "#2a1c01", border: "none", borderRadius: "12px",
//     fontSize: "14px", fontWeight: "700", color: "#db9717",
//     cursor: "not-allowed", letterSpacing: "1.5px", textTransform: "uppercase",
//   },
//   btnSecondary: {
//     width: "100%", padding: "13px", background: "transparent",
//     border: "1px solid #bd7810", borderRadius: "12px",
//     fontSize: "13px", fontWeight: "600", color: "#af6414",
//     cursor: "pointer", letterSpacing: "1px", marginTop: "10px",
//   },
//   otpInput: {
//     width: "100%", background: "#c88521", border: "1px solid #db9f15",
//     borderRadius: "14px", padding: "18px 16px",
//     fontSize: "28px", color: "#f5c518", outline: "none",
//     letterSpacing: "12px", textAlign: "center", fontWeight: "700", boxSizing: "border-box",
//   },
//   otpDot: (filled) => ({
//     width: "8px", height: "8px", borderRadius: "50%",
//     background: filled ? "#f5c518" : "#cb8711",
//     transition: "background 0.2s",
//     boxShadow: filled ? "0 0 6px #f5c518" : "none",
//   }),
//   resendBtn: {
//     background: "transparent", border: "none", color: "#dd7819",
//     fontSize: "12px", cursor: "pointer", letterSpacing: "0.5px",
//     textDecoration: "underline", padding: 0,
//   },
//   alertGreen: {
//     background: "rgba(201, 118, 16, 0.08)", border: "1px solid rgba(192, 142, 17, 0.3)",
//     borderRadius: "10px", padding: "12px 16px", marginTop: "14px",
//   },
//   alertRed: {
//     background: "rgba(191, 114, 42, 0.08)", border: "1px solid rgba(198, 99, 19, 0.3)",
//     borderRadius: "10px", padding: "12px 16px", marginTop: "14px",
//   },
//   alertYellow: {
//     background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.3)",
//     borderRadius: "10px", padding: "12px 16px", marginTop: "14px",
//     display: "flex", gap: "12px",
//   },
//   footer: { textAlign: "center", marginTop: "18px", fontSize: "10px", letterSpacing: "4px", color: "#d19212" },
// };

// export default function UserWithdrawalModel({ openModel, modelClose }) {
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { loading, error, message } = useSelector((state) => state.otp);
//   const { myprofile: singleuser } = useSelector((state) => state.users);
//   const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
//   const withdrawalState = useSelector((state) => state.withdrawal || state.allwithdrawal || state.staff || {});
//   const withdrawalError = withdrawalState.error;
//   const withdrawalLoading = withdrawalState.loading;
//   const withdrawalMessage = withdrawalState.message;

//   const [values, setValues] = useState({});
//   const [check, setCheck] = useState(null);
//   const [maxAmount, setMaxAmount] = useState(0);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isOTPRequested, setIsOTPRequested] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [agreeToBep20, setAgreeToBep20] = useState(false);
//   const [bep20Address, setBep20Address] = useState("");
//   const [hasPendingWithdrawal, setHasPendingWithdrawal] = useState(false);
//   const [focus, setFocus] = useState({});

//   useEffect(() => { dispatch(getMyProfile()); dispatch(getAllWithdrawalByid()); }, [dispatch]);

//   useEffect(() => {
//     if (singleuser) {
//       setMaxAmount(singleuser?.working || 0);
//       const wa = singleuser?.wallet_address || singleuser?.bep20 || "";
//       if (wa) setBep20Address(wa);
//     }
//     if (Array.isArray(singleWithdrawal)) {
//       setHasPendingWithdrawal(
//         singleWithdrawal.some((w) => w.status === "pending" && (w.type === "ROI" || w.type === "working"))
//       );
//     }
//   }, [singleuser, singleWithdrawal]);

//   useEffect(() => {
//     if (error) { const t = setTimeout(() => dispatch(clearOtpErrors()), 5000); return () => clearTimeout(t); }
//     if (message) { const t = setTimeout(() => dispatch(clearOtpMessage()), 5000); return () => clearTimeout(t); }
//   }, [dispatch, error, message]);

//   useEffect(() => {
//     if (!openModel) {
//       setIsOTPRequested(false); setOtp(""); setValues({});
//       setAgreeToBep20(false); setBep20Address("");
//       dispatch(resetOtpState());
//     }
//   }, [openModel, dispatch]);

//   const isReady = values.amount && agreeToBep20 && bep20Address && !loading && !hasPendingWithdrawal;

//   const handleChange = (e) => { const { name, value } = e.target; setValues((p) => ({ ...p, [name]: value })); };
//   const handleOTPChange = (e) => { const v = e.target.value.replace(/\D/g, ""); if (v.length <= 6) setOtp(v); };

//   const requestOTP = async () => {
//     if (hasPendingWithdrawal) { alert("You have a pending withdrawal. Please wait."); return; }
//     try {
//       const result = await dispatch(sendOTP({ userId: auth?.id, email: singleuser?.email }));
//       if (result.meta.requestStatus === "fulfilled") setIsOTPRequested(true);
//     } catch (e) { console.error(e); }
//   };

//   const verifyAndSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await dispatch(verifyOTP({ userId: auth?.id, otp }));
//       if (result.meta.requestStatus === "fulfilled") {
//         const allValues = { amount: values.amount, bep20usdt: bep20Address, user_id: auth?.id, check };
//         const wr = await dispatch(addWithdrawal({ values: allValues }));
//         if (wr.type === "withdrawal/add/rejected") return;
//         if (wr.meta.requestStatus === "fulfilled") {
//           modelClose(); setOtp(""); setIsOTPRequested(false);
//           setValues({}); setAgreeToBep20(false); setBep20Address("");
//         }
//       }
//     } catch (e) { console.error(e); }
//   };

//   const inStyle = (name) => focus[name] ? { ...S.inputBase, ...S.inputFocus } : S.inputBase;

//   return (
//     <Dialog open={openModel} onClose={modelClose} className="relative z-50">
//       <DialogBackdrop className="fixed inset-0 backdrop-blur-sm" style={S.overlay} />
//       <div className="fixed inset-0 z-10 w-screen overflow-y-auto hide-scrollbar">
//         <div className="flex min-h-full items-center justify-center p-4 overflow-hidden">
//           <DialogPanel className="relative w-full sm:max-w-lg" style={S.panel}>

//             {/* Header */}
//             <div style={S.header}>
//               <div style={S.accentLine} />
//               <div style={{ paddingRight: "44px" }}>
//                 <h3 style={S.title}>Withdrawal Request</h3>
//                 <p style={S.subTitle}>SECURE TRANSACTION</p>
//                 <div style={S.badge}>
//                   <span style={S.dot} />
//                   <span style={S.badgeText}>
//                     Available: <span style={S.goldVal}>${maxAmount}</span>
//                   </span>
//                 </div>
//               </div>
//               <button onClick={modelClose} style={S.closeBtn}>✕</button>
//             </div>

//             {/* Body */}
//             <div style={S.body}>

//               {/* Alerts */}
//               {message && <div style={S.alertGreen}><p style={{ fontSize: "13px", color: "#cd9a4e", margin: 0 }}>{message}</p></div>}
//               {withdrawalMessage && <div style={S.alertGreen}><p style={{ fontSize: "13px", color: "#dcb20b", margin: 0 }}>{withdrawalMessage}</p></div>}
//               {error && <div style={S.alertRed}><p style={{ fontSize: "13px", color: "#e05050", margin: 0 }}>{error}</p></div>}
//               {withdrawalError && (
//                 <div style={S.alertRed}>
//                   <p style={{ fontSize: "12px", color: "#c04040", marginBottom: "2px", fontWeight: 600 }}>Withdrawal Error</p>
//                   <p style={{ fontSize: "13px", color: "#e05050", margin: 0 }}>{withdrawalError}</p>
//                 </div>
//               )}
//               {hasPendingWithdrawal && (
//                 <div style={S.alertYellow}>
//                   <svg style={{ color: "#f5c518", flexShrink: 0, marginTop: "1px" }} width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   <div>
//                     <p style={{ fontSize: "12px", color: "#f5c518", fontWeight: 600, margin: 0 }}>Pending Withdrawal</p>
//                     <p style={{ fontSize: "12px", color: "#c9a227", margin: "3px 0 0" }}>Please wait for your existing request to be processed.</p>
//                   </div>
//                 </div>
//               )}

//               <div style={{ marginTop: (message || error || hasPendingWithdrawal) ? "20px" : "0" }}>
//                 {!isOTPRequested ? (
//                   <div>
//                     {/* Info strip */}
//                     <div style={S.infoBox}>
//                       <svg style={{ color: "#dfd7cc", flexShrink: 0, marginTop: "1px" }} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//                       </svg>
//                       <p style={S.infoText}>
//                         Min. Withdrawal: <span style={S.infoHL}>$10</span>
//                         {"  ·  "}Admin Fee: <span style={S.infoHL}>10%</span>
//                         {"  ·  "}Processing: <span style={S.infoHL}>24–48 hrs</span>
//                       </p>
//                     </div>

//                     {/* BEP20 */}
//                     <div style={{ marginBottom: "18px" }}>
//                       <label style={S.label}>BEP-20 USDT Address</label>
//                       <input
//                         type="text" name="bep20usdt" value={bep20Address}
//                         onChange={(e) => setBep20Address(e.target.value)}
//                         disabled={true} placeholder="0x..."
//                         style={{ ...S.inputBase, opacity: 0.5, cursor: "not-allowed", fontFamily: "monospace", fontSize: "12px" }}
//                       />
//                       <div style={S.checkRow}>
//                         <input
//                           id="agreeToBep20" type="checkbox" checked={agreeToBep20}
//                           onChange={(e) => setAgreeToBep20(e.target.checked)}
//                           disabled={hasPendingWithdrawal}
//                           style={{ accentColor: "#d07a0a", width: "15px", height: "15px", cursor: "pointer" }}
//                         />
//                         <label htmlFor="agreeToBep20" style={S.checkLabel}>
//                           I confirm my BEP-20 USDT address is correct
//                         </label>
//                       </div>
//                     </div>

//                     {/* Amount */}
//                     <div style={{ marginBottom: "6px" }}>
//                       <label style={S.label}>Withdrawal Amount</label>
//                       <div style={{ position: "relative" }}>
//                         <span style={S.prefix}>$</span>
//                         <input
//                           type="number" name="amount" placeholder="0.00"
//                           onChange={handleChange}
//                           onFocus={() => setFocus((p) => ({ ...p, amount: true }))}
//                           onBlur={() => setFocus((p) => ({ ...p, amount: false }))}
//                           min={10} step={1} max={maxAmount}
//                           disabled={hasPendingWithdrawal}
//                           style={{
//                             ...inStyle("amount"),
//                             paddingLeft: "30px", paddingRight: "90px",
//                             fontSize: "18px", fontWeight: "600", color: "#f5c518",
//                             ...(hasPendingWithdrawal ? { opacity: 0.5, cursor: "not-allowed" } : {}),
//                           }}
//                         />
//                         <span style={S.suffix}>MAX: ${maxAmount}</span>
//                       </div>

//                       {/* Fee breakdown */}
//                       {values.amount && (
//                         <div style={S.dollarBox}>
//                           <div>
//                             <p style={S.dollarMain}>${values.amount}</p>
//                             <p style={S.dollarSub}>will be withdrawn</p>
//                           </div>
//                           <div style={{ textAlign: "right" }}>
//                             <p style={{ fontSize: "10px", color: "#1a5f7a", marginTop: "2px" }}>
//                               After 10% fee: ${(values.amount * 0.9).toFixed(2)}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                       {errorMessage && <p style={{ color: "#e05050", fontSize: "12px", marginTop: "8px" }}>{errorMessage}</p>}
//                     </div>

//                     <div style={S.divider} />

//                     <button
//                       type="button" disabled={!isReady} onClick={requestOTP}
//                       style={isReady ? S.btnPrimary : S.btnPrimaryOff}
//                     >
//                       {loading ? <Spinner /> : hasPendingWithdrawal ? "Pending Withdrawal Exists" : "Request OTP →"}
//                     </button>

//                     <p style={S.footer}>Dark Horse · SECURE WITHDRAWAL</p>
//                   </div>
//                 ) : (
//                   <div>
//                     {/* OTP sent card */}
//                     <div style={{
//                       background: "rgba(26,95,122,0.12)", border: "1px solid #1a3a4a",
//                       borderRadius: "12px", padding: "14px 16px", marginBottom: "22px",
//                       display: "flex", alignItems: "center", gap: "12px",
//                     }}>
//                       <div style={{
//                         width: "36px", height: "36px", borderRadius: "50%",
//                         background: "rgba(78,205,196,0.15)", border: "1px solid #4ecdc4",
//                         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//                       }}>
//                         <svg width="16" height="16" viewBox="0 0 20 20" fill="#4ecdc4">
//                           <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                           <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p style={{ fontSize: "12px", color: "#4ecdc4", fontWeight: 600, margin: 0 }}>OTP Sent Successfully</p>
//                         <p style={{ fontSize: "11px", color: "#7ab8c4", margin: "2px 0 0" }}>Sent to {singleuser?.email}</p>
//                       </div>
//                     </div>

//                     <label style={S.label}>Enter 6-Digit OTP</label>
//                     <input
//                       id="otp" type="text" placeholder="· · · · · ·"
//                       value={otp} onChange={handleOTPChange} maxLength={6}
//                       onFocus={() => setFocus((p) => ({ ...p, otp: true }))}
//                       onBlur={() => setFocus((p) => ({ ...p, otp: false }))}
//                       style={{ ...S.otpInput, ...(focus.otp ? S.inputFocus : {}) }}
//                     />

//                     {/* Progress dots */}
//                     <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
//                       {[0, 1, 2, 3, 4, 5].map((i) => (
//                         <div key={i} style={S.otpDot(i < otp.length)} />
//                       ))}
//                     </div>

//                     <div style={{ textAlign: "center", marginTop: "14px" }}>
//                       <button type="button" onClick={requestOTP} disabled={loading} style={S.resendBtn}>
//                         Resend OTP
//                       </button>
//                     </div>

//                     <div style={S.divider} />

//                     <button
//                       type="submit"
//                       disabled={otp.length !== 6 || loading || withdrawalLoading}
//                       onClick={verifyAndSubmit}
//                       style={(otp.length === 6 && !loading && !withdrawalLoading) ? S.btnPrimary : S.btnPrimaryOff}
//                     >
//                       {loading || withdrawalLoading ? <Spinner /> : "Submit Withdrawal →"}
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => { setIsOTPRequested(false); setOtp(""); }}
//                       style={S.btnSecondary}
//                     >
//                       ← Back
//                     </button>

//                     <p style={S.footer}>Dark Horse · SECURE WITHDRAWAL</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </DialogPanel>
//         </div>
//       </div>
//     </Dialog>
//   );
// }