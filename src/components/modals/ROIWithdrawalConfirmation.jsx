

import {
  addROIWithdrawal,
  getAllWithdrawalByid,
} from "../../redux/withdrawalSlice";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../common/Spinner";
import { getMyProfile } from "../../redux/userSlice";
import axios from "axios";
import {
  sendOTP,
  verifyOTP,
  clearOtpErrors,
  clearOtpMessage,
  resetOtpState,
} from "../../redux/otpSlice";

const S = {
  overlay: { background: "rgba(0,8,20,0.80)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" },
  panel: {
    background: "#0a0d14", border: "1px solid #1a5f7a", borderRadius: "20px",
    overflow: "hidden", boxShadow: "0 0 60px rgba(78,205,196,0.08), 0 0 120px rgba(26,95,122,0.12)",
  },
  header: {
    background: "#0d1520", borderBottom: "1px solid #1a3a4a",
    padding: "22px 26px 18px", position: "relative", overflow: "hidden",
  },
  accentLine: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(90deg,#1a5f7a 0%,#4ecdc4 50%,#f5c518 100%)",
  },
  title: { fontSize: "22px", fontWeight: "700", color: "#f5c518", letterSpacing: "1px", margin: 0 },
  subTitle: { fontSize: "11px", color: "#4ecdc4", letterSpacing: "3px", marginTop: "4px", opacity: 0.8 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "rgba(26,95,122,0.25)", border: "1px solid #1a5f7a",
    borderRadius: "30px", padding: "6px 14px", marginTop: "12px",
  },
  dot: { width: "7px", height: "7px", borderRadius: "50%", background: "#4ecdc4", boxShadow: "0 0 6px #4ecdc4" },
  badgeText: { fontSize: "12px", color: "#4ecdc4", letterSpacing: "0.5px" },
  goldVal: { color: "#f5c518", fontWeight: "600" },
  closeBtn: {
    position: "absolute", top: "18px", right: "20px",
    background: "rgba(26,95,122,0.2)", border: "1px solid #1a5f7a",
    borderRadius: "10px", width: "32px", height: "32px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "#4ecdc4", fontSize: "16px",
  },
  body: { padding: "22px 26px 28px" },
  infoBox: {
    background: "rgba(26,95,122,0.12)", border: "1px solid #1a3a4a",
    borderLeft: "3px solid #4ecdc4", borderRadius: "0 10px 10px 0",
    padding: "12px 16px", display: "flex", gap: "10px",
    alignItems: "flex-start", marginBottom: "22px",
  },
  infoText: { fontSize: "12px", color: "#7ab8c4", lineHeight: "1.7", margin: 0 },
  infoHL: { color: "#f5c518", fontWeight: "600" },
  label: {
    fontSize: "11px", fontWeight: "600", color: "#4ecdc4",
    textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", display: "block",
  },
  inputBase: {
    width: "100%", background: "#0d1520", border: "1px solid #1a3a4a", borderRadius: "12px",
    padding: "14px 16px", fontSize: "14px", color: "#e8f4f8",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputFocus: { borderColor: "#4ecdc4", boxShadow: "0 0 0 3px rgba(78,205,196,0.1)" },
  prefix: {
    position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
    fontSize: "13px", fontWeight: "600", color: "#4ecdc4", pointerEvents: "none",
  },
  suffix: {
    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
    fontSize: "11px", fontWeight: "600", color: "#1a5f7a", pointerEvents: "none",
  },
  checkRow: {
    display: "flex", alignItems: "center", gap: "10px", marginTop: "10px",
    padding: "10px 14px", background: "rgba(26,95,122,0.08)",
    borderRadius: "10px", border: "1px solid #1a3a4a",
  },
  checkLabel: { fontSize: "12px", color: "#7ab8c4", userSelect: "none" },
  dollarBox: {
    marginTop: "10px", background: "rgba(245,197,24,0.06)",
    border: "1px solid rgba(245,197,24,0.25)", borderRadius: "10px",
    padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  dollarMain: { fontSize: "15px", fontWeight: "700", color: "#f5c518", margin: 0 },
  dollarSub: { fontSize: "11px", color: "#7ab8c4", marginTop: "2px" },
  divider: { height: "1px", background: "linear-gradient(90deg,transparent,#1a3a4a,transparent)", margin: "22px 0" },
  btnPrimary: {
    width: "100%", padding: "15px",
    background: "linear-gradient(135deg,#1a5f7a 0%,#2a8fa8 50%,#4ecdc4 100%)",
    border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "700",
    color: "#0a0d14", cursor: "pointer", letterSpacing: "1.5px", textTransform: "uppercase",
  },
  btnPrimaryOff: {
    width: "100%", padding: "15px", background: "#1a2535", border: "none",
    borderRadius: "12px", fontSize: "14px", fontWeight: "700", color: "#3a5060",
    cursor: "not-allowed", letterSpacing: "1.5px", textTransform: "uppercase",
  },
  btnSecondary: {
    width: "100%", padding: "13px", background: "transparent",
    border: "1px solid #1a3a4a", borderRadius: "12px",
    fontSize: "13px", fontWeight: "600", color: "#4ecdc4",
    cursor: "pointer", letterSpacing: "1px", marginTop: "10px",
  },
  otpInput: {
    width: "100%", background: "#0d1520", border: "1px solid #1a5f7a",
    borderRadius: "14px", padding: "18px 16px", fontSize: "28px", color: "#f5c518",
    outline: "none", letterSpacing: "12px", textAlign: "center", fontWeight: "700", boxSizing: "border-box",
  },
  otpDot: (filled) => ({
    width: "8px", height: "8px", borderRadius: "50%",
    background: filled ? "#f5c518" : "#1a3a4a", transition: "background 0.2s",
    boxShadow: filled ? "0 0 6px #f5c518" : "none",
  }),
  resendBtn: {
    background: "transparent", border: "none", color: "#4ecdc4",
    fontSize: "12px", cursor: "pointer", letterSpacing: "0.5px", textDecoration: "underline", padding: 0,
  },
  alertGreen: {
    background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.3)",
    borderRadius: "10px", padding: "12px 16px", marginTop: "14px",
  },
  alertRed: {
    background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.3)",
    borderRadius: "10px", padding: "12px 16px", marginTop: "14px",
  },
  alertYellow: {
    background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.3)",
    borderRadius: "10px", padding: "12px 16px", marginTop: "14px", display: "flex", gap: "12px",
  },
  alertYellowDate: {
    background: "rgba(245,197,24,0.06)", borderLeft: "3px solid #f5c518",
    border: "1px solid rgba(245,197,24,0.25)", borderRadius: "0 10px 10px 0",
    padding: "12px 16px", marginBottom: "18px",
  },
  footer: { textAlign: "center", marginTop: "18px", fontSize: "10px", letterSpacing: "4px", color: "#1a3a4a" },
};

export default function ROIWithdrawalConfirmation({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { singleWithdrawal } = useSelector((state) => state.allwithdrawal);
  const { loading, success, error: otpErr, message } = useSelector((state) => state.otp);
  const { myprofile: singleuser } = useSelector((state) => state.users);

  const withdrawalState = useSelector(
    (state) => state.withdrawal || state.allwithdrawal || state.staff || {},
  );
  const withdrawalError = withdrawalState.error;
  const withdrawalLoading = withdrawalState.loading;
  const withdrawalMessage = withdrawalState.message;

  const [values, setValues] = useState({});
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [maxAmount, setMaxAmount] = useState(0); // dollars mein (non_working)
  const [agreeToBep20, setAgreeToBep20] = useState(false);
  const [bep20Address, setBep20Address] = useState("");
  const [hasPendingWithdrawal, setHasPendingWithdrawal] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [focus, setFocus] = useState({});
  const [tokenLoading, setTokenLoading] = useState(true);

  const today = new Date();
  const dayOfMonth = today.getDate();
  const isAllowedDate = [1, 2, 3, 4, 5].includes(dayOfMonth);

  // ✅ FIX: non_working backend se DOLLARS mein aata hai
  // maxTokens = dollars / tokenPrice  (divide)
  // Display mein: tokens dikhao, dollars bhi dikhao
  // Working wali SAME logic:
  // non_working = TOKENS mein aata hai backend se
  const maxTokens = maxAmount;                                                      // 1000 TXT directly
  const dollarValue = tokenPrice ? (maxAmount * tokenPrice).toFixed(2) : "0.00";   // 1000 × tokenPrice = $

  // User ne jitne tokens enter kiye → dollar value = tokens * tokenPrice
  const tokensToDollar = (tokens) => {
    if (!tokenPrice || !tokens || isNaN(parseFloat(tokens))) return null;
    return (parseFloat(tokens) * tokenPrice).toFixed(2);
  };

  const dollarEquivalent = tokensToDollar(values.amount);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      setTokenLoading(true);
      try {
        const res = await axios.get("https://api.Mock.ceo/api/v1/tokens");
        const tokens = res.data.data || [];
        const activeToken = tokens.find((t) => t.is_active === 1);
        if (activeToken) {
          setTokenPrice(parseFloat(activeToken.current_price));
          setTokenSymbol(activeToken.symbol);
        }
      } catch (e) {
        console.error("Token fetch error:", e);
      } finally {
        setTokenLoading(false);
      }
    };
    fetchTokenPrice();
  }, []);

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getAllWithdrawalByid());
    if (otpErr) { const t = setTimeout(() => dispatch(clearOtpErrors()), 3000); return () => clearTimeout(t); }
    if (success) { const t = setTimeout(() => dispatch(clearOtpMessage()), 3000); return () => clearTimeout(t); }
  }, [dispatch, otpErr, success]);

  useEffect(() => {
    if (singleuser) {
      // non_working = dollars mein hai backend se
      const nonWorking = parseFloat(singleuser?.non_working) || 0;
      setMaxAmount(nonWorking);
      const wa = singleuser?.wallet_address || singleuser?.bep20 || "";
      if (wa) setBep20Address(wa);
    }
    if (Array.isArray(singleWithdrawal)) {
      setHasPendingWithdrawal(
        singleWithdrawal.some(
          (w) => w.status === "pending" && (w.type === "ROI" || w.type === "working"),
        ),
      );
    }
  }, [singleuser, singleWithdrawal]);

  useEffect(() => {
    if (!openModel) {
      setIsOTPRequested(false);
      setOtp("");
      setValues({});
      setAgreeToBep20(false);
      setBep20Address("");
      dispatch(resetOtpState());
    }
  }, [openModel, dispatch]);

  const isReady =
    values.amount &&
    agreeToBep20 &&
    bep20Address &&
    parseFloat(values.amount) >= 10 &&
    parseFloat(values.amount) <= maxTokens &&
    isAllowedDate &&
    maxAmount > 0 &&
    tokenPrice > 0 &&
    !loading &&
    !hasPendingWithdrawal &&
    !tokenLoading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
  };

  const handleOTPChange = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    if (v.length <= 6) setOtp(v);
  };

  const requestOTP = async () => {
    if (hasPendingWithdrawal) { alert("You have a pending withdrawal. Please wait."); return; }
    try {
      const result = await dispatch(sendOTP({ userId: auth?.id, email: singleuser?.email }));
      if (result.meta.requestStatus === "fulfilled") setIsOTPRequested(true);
    } catch (e) { console.error("❌ ROI - Failed to send OTP:", e); }
  };

  const verifyAndSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(verifyOTP({ userId: auth?.id, otp }));
      if (result.meta.requestStatus === "fulfilled") {
        const allValues = {
          ...values,
          bep20usdt: bep20Address,
          user_id: auth?.id,
          type: "ROI",
          income_type: "non_working",
        };
        const wr = await dispatch(addROIWithdrawal({ values: allValues }));
        if (wr.type === "withdrawal/addROI/rejected") return;
        if (wr.meta.requestStatus === "fulfilled") {
          modelClose();
          setOtp("");
          setIsOTPRequested(false);
          setValues({});
          setAgreeToBep20(false);
          setBep20Address("");
        }
      }
    } catch (e) { console.error("❌ ROI - An error occurred:", e); }
  };

  const inStyle = (name) => focus[name] ? { ...S.inputBase, ...S.inputFocus } : S.inputBase;

  // Button label helper
  const getButtonLabel = () => {
    if (loading) return <Spinner />;
    if (hasPendingWithdrawal) return "Pending Withdrawal Exists";
    if (maxAmount <= 0) return "No Amount Available";
    if (tokenLoading) return "Loading Token Price...";
    if (!isAllowedDate) return "Not Allowed This Date";
    return "Request OTP →";
  };

  return (
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 backdrop-blur-sm" style={S.overlay} />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto hide-scrollbar">
        <div className="flex min-h-full items-center justify-center p-4 overflow-hidden">
          <DialogPanel className="relative w-full sm:max-w-lg" style={S.panel}>

            {/* Header */}
            <div style={S.header}>
              <div style={S.accentLine} />
              <div style={{ paddingRight: "44px" }}>
                <h3 style={S.title}>Trade Withdrawal</h3>
                <p style={S.subTitle}>Yield · SECURE TRANSACTION</p>
                <div style={S.badge}>
                  <span style={S.dot} />
                  <span style={S.badgeText}>
                    YIELD WALLET:{" "}
                    {tokenLoading ? (
                      <span style={{ color: "#4ecdc4" }}>Loading...</span>
                    ) : (
                      <>
                        {/* ✅ Working wala same format: tokens TXT · $dollar */}
                        <span style={S.goldVal}>{tokenSymbol} {maxTokens} </span>
                        <span style={{ color: "#1a5f7a" }}> · </span>
                        <span style={S.goldVal}>${dollarValue}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
              <button onClick={modelClose} style={S.closeBtn}>✕</button>
            </div>

            {/* Body */}
            <div style={S.body}>

              {/* Alerts */}
              {message && <div style={S.alertGreen}><p style={{ fontSize: "13px", color: "#4ecdc4", margin: 0 }}>{message}</p></div>}
              {withdrawalMessage && <div style={S.alertGreen}><p style={{ fontSize: "13px", color: "#4ecdc4", margin: 0 }}>{withdrawalMessage}</p></div>}
              {otpErr && <div style={S.alertRed}><p style={{ fontSize: "13px", color: "#e05050", margin: 0 }}>{otpErr}</p></div>}
              {withdrawalError && (
                <div style={S.alertRed}>
                  <p style={{ fontSize: "12px", color: "#c04040", marginBottom: "2px", fontWeight: 600 }}>Withdrawal Error</p>
                  <p style={{ fontSize: "13px", color: "#e05050", margin: 0 }}>{withdrawalError}</p>
                </div>
              )}
              {hasPendingWithdrawal && (
                <div style={S.alertYellow}>
                  <svg style={{ color: "#f5c518", flexShrink: 0, marginTop: "1px" }} width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p style={{ fontSize: "12px", color: "#f5c518", fontWeight: 600, margin: 0 }}>Pending Withdrawal</p>
                    <p style={{ fontSize: "12px", color: "#c9a227", margin: "3px 0 0" }}>Please wait for your existing request to be processed.</p>
                  </div>
                </div>
              )}

              <div style={{ marginTop: (message || otpErr || hasPendingWithdrawal) ? "20px" : "0" }}>
                {!isOTPRequested ? (
                  <div>
                    {/* Date restriction */}
                    {!isAllowedDate && (
                      <div style={S.alertYellowDate}>
                        <p style={{ fontSize: "12px", color: "#c9a227", margin: 0 }}>
                          ⚠️ Trade withdrawals are only allowed on{" "}
                          <span style={{ color: "#f5c518", fontWeight: 600 }}>1st – 5th</span>{" "}
                          of each month.
                        </p>
                      </div>
                    )}

                    {/* Info strip */}
                    <div style={S.infoBox}>
                      <svg style={{ color: "#4ecdc4", flexShrink: 0, marginTop: "1px" }} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                      <p style={S.infoText}>
                        Min. Withdrawal: <span style={S.infoHL}>10 {tokenSymbol}</span>
                        {"  ·  "}Admin Fee: <span style={S.infoHL}>10%</span>
                        {"  ·  "}Processing: <span style={S.infoHL}>24–48 hrs</span>
                      </p>
                    </div>

                    {/* BEP20 */}
                    <div style={{ marginBottom: "18px" }}>
                      <label style={S.label}>BEP-20 USDT Address</label>
                      <input
                        type="text" name="bep20usdt" value={bep20Address}
                        onChange={(e) => setBep20Address(e.target.value)}
                        disabled={true} placeholder="0x..."
                        style={{ ...S.inputBase, opacity: 0.5, cursor: "not-allowed", fontFamily: "monospace", fontSize: "12px" }}
                      />
                      <div style={S.checkRow}>
                        <input
                          id="agreeToBep20ROI" type="checkbox" checked={agreeToBep20}
                          onChange={(e) => setAgreeToBep20(e.target.checked)}
                          disabled={hasPendingWithdrawal}
                          style={{ accentColor: "#4ecdc4", width: "15px", height: "15px", cursor: "pointer" }}
                        />
                        <label htmlFor="agreeToBep20ROI" style={S.checkLabel}>
                          I confirm my BEP-20 USDT address is correct
                        </label>
                      </div>
                    </div>

                    {/* Amount — tokens mein enter karo */}
                    <div style={{ marginBottom: "6px" }}>
                      <label style={S.label}>
                        Withdrawal Amount {tokenSymbol && `(${tokenSymbol})`}
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={S.prefix}>{tokenSymbol || "~"}</span>
                        <input
                          type="number" name="amount" placeholder="0.00"
                          value={values.amount || ""}
                          onChange={handleChange}
                          onFocus={() => setFocus((p) => ({ ...p, amount: true }))}
                          onBlur={() => setFocus((p) => ({ ...p, amount: false }))}
                          min={10} step={1} max={maxTokens}
                          disabled={hasPendingWithdrawal || !isAllowedDate || maxAmount <= 0 || tokenLoading}
                          style={{
                            ...inStyle("amount"),
                            paddingLeft: "52px", paddingRight: "90px",
                            fontSize: "18px", fontWeight: "600", color: "#f5c518",
                            ...((hasPendingWithdrawal || !isAllowedDate || maxAmount <= 0 || tokenLoading)
                              ? { opacity: 0.5, cursor: "not-allowed" }
                              : {}),
                          }}
                        />
                        {/* ✅ MAX tokens dikhao (dollars / price) */}
                        <span style={S.suffix}>
                          MAX: {tokenLoading ? "..." : maxTokens}
                        </span>
                      </div>

                      {/* ✅ Dollar equivalent: tokens * tokenPrice */}
                      {dollarEquivalent && (
                        <div style={S.dollarBox}>
                          <div>
                            <p style={S.dollarMain}>≈ ${dollarEquivalent}</p>
                            <p style={S.dollarSub}>will be withdrawn</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "11px", color: "#4ecdc4", margin: 0 }}>
                              1 {tokenSymbol} = ${tokenPrice}
                            </p>
                            <p style={{ fontSize: "10px", color: "#1a5f7a", marginTop: "2px" }}>
                              After 10% fee: ${(parseFloat(dollarEquivalent) * 0.9).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={S.divider} />

                    <button
                      type="button"
                      disabled={!isReady}
                      onClick={requestOTP}
                      style={isReady ? S.btnPrimary : S.btnPrimaryOff}
                    >
                      {getButtonLabel()}
                    </button>

                    <p style={S.footer}>Dark Horse · SECURE WITHDRAWAL</p>
                  </div>
                ) : (
                  <div>
                    {/* OTP sent card */}
                    <div style={{
                      background: "rgba(26,95,122,0.12)", border: "1px solid #1a3a4a",
                      borderRadius: "12px", padding: "14px 16px", marginBottom: "22px",
                      display: "flex", alignItems: "center", gap: "12px",
                    }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "rgba(78,205,196,0.15)", border: "1px solid #4ecdc4",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="#4ecdc4">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", color: "#4ecdc4", fontWeight: 600, margin: 0 }}>OTP Sent Successfully</p>
                        <p style={{ fontSize: "11px", color: "#7ab8c4", margin: "2px 0 0" }}>Sent to {singleuser?.email}</p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div style={{
                      background: "rgba(26,95,122,0.12)", border: "1px solid #1a3a4a",
                      borderRadius: "12px", padding: "12px 16px", marginBottom: "18px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#7ab8c4" }}>Withdrawal Amount</span>
                        <span style={{ fontSize: "12px", color: "#f5c518", fontWeight: 600, fontFamily: "monospace" }}>
                          {values.amount} {tokenSymbol}
                          {dollarEquivalent && ` ≈ $${dollarEquivalent}`}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "12px", color: "#7ab8c4" }}>BEP-20 Address</span>
                        <span style={{ fontSize: "11px", color: "#f5c518", fontWeight: 600, fontFamily: "monospace" }}>
                          {bep20Address?.substring(0, 8)}...{bep20Address?.substring(bep20Address.length - 6)}
                        </span>
                      </div>
                    </div>

                    <label style={S.label}>Enter 6-Digit OTP</label>
                    <input
                      id="otp" type="text" placeholder="· · · · · ·"
                      value={otp} onChange={handleOTPChange} maxLength={6}
                      onFocus={() => setFocus((p) => ({ ...p, otp: true }))}
                      onBlur={() => setFocus((p) => ({ ...p, otp: false }))}
                      style={{ ...S.otpInput, ...(focus.otp ? S.inputFocus : {}) }}
                    />

                    {/* Progress dots */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={S.otpDot(i < otp.length)} />
                      ))}
                    </div>

                    <div style={{ textAlign: "center", marginTop: "14px" }}>
                      <button type="button" onClick={requestOTP} disabled={loading} style={S.resendBtn}>
                        Resend OTP
                      </button>
                    </div>

                    <div style={S.divider} />

                    <button
                      type="submit"
                      disabled={otp.length !== 6 || loading || withdrawalLoading}
                      onClick={verifyAndSubmit}
                      style={(otp.length === 6 && !loading && !withdrawalLoading) ? S.btnPrimary : S.btnPrimaryOff}
                    >
                      {loading || withdrawalLoading ? <Spinner /> : "Submit Withdrawal →"}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsOTPRequested(false); setOtp(""); }}
                      style={S.btnSecondary}
                    >
                      ← Back
                    </button>

                    <p style={S.footer}>Dark Horse · SECURE WITHDRAWAL</p>
                  </div>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}