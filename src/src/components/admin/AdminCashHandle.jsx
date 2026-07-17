import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/Spinner";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import {
  debitAmount,
  clearErrors,
  clearMessage,
} from "../../redux/withdrawalSlice";
import api from '../../api/axiosInstance'
export default function AdminCashHandle({
  HandleCashmodel,
  cashHandle,
  name,
  userId,
  balance,
  roi,
  profitWallet,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [amount, setAmount] = useState(""); // ✅ Controlled state
  const [wallet_type, setWallet_type] = useState("profit");
  const [maxamount, setMaxamount] = useState(0);
  const { admin } = useSelector((state) => state.auth);

  // OTP States
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [pendingData, setPendingData] = useState(null);

  const { loading, error, message } = useSelector((state) => state.allwithdrawal);

  // ✅ Update maxamount based on wallet type
  useEffect(() => {
    if (wallet_type === "business") {
      setMaxamount(balance || 0);
    } else if (wallet_type === "profit") {
      setMaxamount(profitWallet || 0);
    } else if (wallet_type === "working") {
      setMaxamount(roi || 0);
    }
  }, [wallet_type, balance, profitWallet, roi]);

  // ✅ Set initial amount for debit
  useEffect(() => {
    if (cashHandle === "debit" && maxamount > 0) {
      setAmount(maxamount.toString());
    }
  }, [maxamount, cashHandle]);

  // Redux error/success handling
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert(message);
      dispatch(clearMessage());
      HandleCashmodel();
    }
  }, [error, message, dispatch, HandleCashmodel]);

  // Timer effect for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);
  // Send OTP to admin's email
  const sendOTP = async () => {
    try {
      setOtpLoading(true);
      setOtpError("");

      const res = await api.post("/auth/verification", {
        email: admin.email,
      });

      const data = res.data;

      // If backend returns success in data
      if (data?.success !== false) {
        setStep(2);
        setOtpSuccess(data?.message || "OTP sent successfully to your email");
        setResendTimer(60);
        setTimeout(() => setOtpSuccess(""), 3000);
      } else {
        setOtpError(data?.message || data?.error || "Failed to send OTP");
        setTimeout(() => setOtpError(""), 3000);
        setStep(1);
      }
    } catch (err) {
      console.error("❌ Send OTP error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Network error. Please try again.";

      setOtpError(msg);
      setTimeout(() => setOtpError(""), 3000);
      setStep(1);
    } finally {
      setOtpLoading(false);
    }
  };

  // ✅ Verify OTP with axios instance
  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setOtpError("Please enter complete OTP");
      setTimeout(() => setOtpError(""), 3000);
      return;
    }

    try {
      setOtpLoading(true);
      setOtpError("");

      const payload = {
        email: admin.email,
        otp: otpCode,
      };

      const res = await api.post("/auth/otp-code", payload);
      const data = res.data;

      console.log("📥 OTP verification response:", data);

      // Backend returns: { success: true, message: "..." }
      if (data?.success) {
        setOtpSuccess(data?.message || "OTP verified successfully!");

        setTimeout(() => {
          // keep your existing dispatch
          dispatch(debitAmount({ updatedData: pendingData }));
        }, 500);
      } else {
        const errorMessage = data?.error || data?.message || "Invalid OTP";
        setOtpError(errorMessage);
        setTimeout(() => setOtpError(""), 3000);
      }
    } catch (err) {
      console.error("❌ OTP verification error:", err);

      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Network error. Please try again.";

      setOtpError(msg);
      setTimeout(() => setOtpError(""), 3000);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP input with auto-focus
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      setTimeout(() => {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }, 10);
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    setTimeout(() => {
      const input = document.getElementById(`otp-${focusIndex}`);
      if (input) input.focus();
    }, 10);
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);

        setTimeout(() => {
          const prevInput = document.getElementById(`otp-${index - 1}`);
          if (prevInput) prevInput.focus();
        }, 10);
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // ✅ Form submission with validation
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // ✅ Amount validation
    if (!amount || amount === "" || amount === "0") {
      return alert("Please enter amount");
    }

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return alert("Please enter a valid amount");
    }

    // Wallet type check for debit
    if (cashHandle === "debit" && !wallet_type) {
      return alert("Please select wallet type");
    }

    // Debit validations
    if (cashHandle === "debit") {
      if (numAmount > maxamount) {
        return alert(`Amount exceeds limit. Maximum: ${maxamount}`);
      }
      if (numAmount <= 30) {
        return alert("Amount should be greater than 30");
      }
    }

    // Credit validations
    if (cashHandle === "credit" && numAmount > 100000) {
      return alert("Credit amount exceeds maximum limit of 100,000");
    }

    // Confirmation
    const confirmed = window.confirm(
      `Are you sure you want to ${cashHandle} ${numAmount} ${cashHandle === "debit"
        ? `from ${name}'s ${wallet_type} wallet`
        : `to ${name}'s account`
      }?`
    );

    if (!confirmed) return;

    // Prepare data
    const updatedData = {
      amount: numAmount,
      id: userId,
      action: cashHandle,
      wallet_type: cashHandle === "debit" ? wallet_type : "business",
    };

    setPendingData(updatedData);
    await sendOTP();
  };

  // Reset form
  const handleBackToForm = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess("");
    setPendingData(null);
  };

  // Get current balance
  const getCurrentBalance = () => {
    if (wallet_type === "business") return balance;
    if (wallet_type === "profit") return profitWallet;
    if (wallet_type === "working") return roi;
    return 0;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={loading || otpLoading ? () => { } : HandleCashmodel}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/10 backdrop-blur-xs transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 mt-2 sm:p-4 text-center">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-2xl bg-slate-950 border border-white/10 px-3 pb-4 pt-4 sm:px-4 sm:pb-4 sm:pt-5 text-left shadow-xl shadow-[#F5C518]/5 transition-all w-full max-w-lg data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              {/* Step 1: Transaction Form */}
              {step === 1 && (
                <>
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white capitalize">
                      {cashHandle} {cashHandle === "debit" ? "From" : "To"} {name}
                    </h2>
                    <p className="mt-2 text-sm sm:text-base leading-6 sm:leading-8 text-slate-300">
                      {cashHandle === "debit"
                        ? `Debit amount from user's ${wallet_type} wallet (Balance: ${getCurrentBalance()})`
                        : `Credit amount to user's account`
                      }
                    </p>
                  </div>
                  <form
                    onSubmit={handleSaveChanges}
                    className="mx-auto mt-4 max-w-xl sm:mt-4"
                  >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6">
                      {/* Wallet selector for debit */}
                      {cashHandle === "debit" && (
                        <div>
                          <label
                            htmlFor="wallet_type"
                            className="block text-sm sm:text-base font-semibold leading-6 text-slate-300"
                          >
                            Wallet <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-2.5">
                            <select
                              id="wallet_type"
                              name="wallet_type"
                              value={wallet_type}
                              onChange={(e) => setWallet_type(e.target.value)}
                              className="block w-full rounded-xl border-0 px-3 py-2 sm:px-3.5 sm:py-2.5 text-white bg-[#111]/50 shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-[#F5C518]/50 text-sm sm:text-lg sm:leading-6"
                            >
                              <option value="profit" className="bg-[#0a0a0a]">Profit Wallet</option>
                              <option value="business" className="bg-[#0a0a0a]">Active Wallet</option>
                              <option value="working" className="bg-[#0a0a0a]">Trade Wallet</option>
                            </select>
                          </div>
                          <p className="mt-1 text-sm text-slate-400">
                            Current balance: <span className="text-cyan-400 font-semibold">{getCurrentBalance()}</span>
                          </p>
                        </div>
                      )}

                      {/* ✅ FIXED: Amount input with proper step */}
                      <div>
                        <label
                          htmlFor="amount"
                          className="block text-sm sm:text-base font-semibold leading-6 text-slate-300"
                        >
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2.5">
                          <input
                            id="amount"
                            name="amount"
                            type="number"
                            step="any"
                            min="0"
                            max={cashHandle === "debit" ? maxamount : undefined}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                            className="block w-full rounded-xl border-0 px-3 py-2 sm:px-3.5 sm:py-2.5 text-white bg-[#111]/50 shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-[#F5C518]/50 text-sm sm:text-lg sm:leading-6"
                          />
                        </div>
                        {cashHandle === "debit" && (
                          <p className="mt-1 text-sm text-slate-400">
                            Maximum: <span className="text-amber-400">{maxamount}</span> | Minimum: <span className="text-amber-400">31</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6">
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          disabled={otpLoading || loading}
                          className="inline-flex w-full justify-center rounded-xl bg-[#D4AF37] px-3 py-2 sm:py-2.5 text-base sm:text-lg font-semibold text-white shadow-lg shadow-[#F5C518]/25 hover:bg-[#F5C518] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {otpLoading ? <Spinner /> : "Continue"}
                        </button>
                        <button
                          type="button"
                          onClick={HandleCashmodel}
                          disabled={otpLoading || loading}
                          className="mt-3 inline-flex w-full justify-center rounded-xl bg-[#111]/50 border border-white/10 px-3 py-2 sm:py-2.5 text-base sm:text-lg font-semibold text-slate-300 shadow-sm hover:bg-white/10 hover:text-white sm:col-start-1 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <>
                  <div className="mx-auto max-w-2xl text-center">
                    <button
                      onClick={handleBackToForm}
                      disabled={otpLoading || loading}
                      className="mb-4 text-[#F5C518] hover:text-[#f0d060] flex items-center text-sm font-medium transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to form
                    </button>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
                      Verify Email
                    </h2>
                    <p className="mt-2 text-sm sm:text-base leading-6 sm:leading-8 text-slate-300">
                      Enter the 6-digit code sent to
                      <br />
                      <span className="font-semibold text-[#F5C518]">
                        {admin?.email}
                      </span>
                    </p>
                  </div>

                  {/* Error & Success Messages */}
                  {otpError && (
                    <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                      <p className="text-rose-300 text-sm text-center">
                        {otpError}
                      </p>
                    </div>
                  )}
                  {otpSuccess && (
                    <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <p className="text-emerald-300 text-sm text-center">
                        {otpSuccess}
                      </p>
                    </div>
                  )}

                  <div className="mx-auto mt-6 max-w-xl space-y-6">
                    {/* OTP Input */}
                    <div className="flex justify-center gap-1.5 sm:gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          disabled={otpLoading || loading}
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-[#111]/50 border-2 border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      ))}
                    </div>

                    {/* Resend OTP */}
                    <div className="text-center text-sm">
                      {resendTimer > 0 ? (
                        <p className="text-slate-400">
                          Resend code in{" "}
                          <span className="font-semibold text-[#F5C518]">
                            {resendTimer}s
                          </span>
                        </p>
                      ) : (
                        <button
                          onClick={sendOTP}
                          disabled={otpLoading || loading}
                          className="text-[#F5C518] hover:text-[#f0d060] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        onClick={handleVerifyOTP}
                        disabled={otpLoading || loading || otp.some(d => !d)}
                        className="inline-flex w-full justify-center rounded-xl bg-[#D4AF37] px-3 py-2 sm:py-2.5 text-base sm:text-lg font-semibold text-white shadow-lg shadow-[#F5C518]/25 hover:bg-[#F5C518] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {otpLoading || loading ? <Spinner /> : "Verify & Process"}
                      </button>
                      <button
                        type="button"
                        onClick={HandleCashmodel}
                        disabled={otpLoading || loading}
                        className="mt-3 inline-flex w-full justify-center rounded-xl bg-[#111]/50 border border-white/10 px-3 py-2 sm:py-2.5 text-base sm:text-lg font-semibold text-slate-300 shadow-sm hover:bg-white/10 hover:text-white sm:col-start-1 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}