
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { addTopup, clearErrors, clearMessage } from "../../redux/topupSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, DollarSign, Info, Calendar, X, Zap } from "lucide-react";

/* ── Dark Horse Tokens ─────────────────────────────────────────────── */
const Z = {
  gold: "#120b02",
  goldGlow: "rgba(215, 207, 197, 0.15)",
  goldBorder: "rgba(245,197,24,0.28)",
  navy: "#d7d5d2",
  teal: "#eb9a20",
  tealGlow: "rgba(171, 97, 29, 0.12)",
  tealBorder: "rgba(202, 137, 32, 0.25)",
  bg: "#201604",
  surface: "#2a1c05",
  surface2: "#110901",
  line: "rgba(202, 112, 27, 0.07)",
  muted: "#c07d18",
  text: "#CBD5E1",
};
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Exo+2:wght@400;500;600;700&display=swap');
    .zyn-modal * { box-sizing: border-box; font-family: 'Exo 2', sans-serif; }

    .zyn-input {
      width: 100%;
      background: ${Z.surface2};
      border: 1px solid ${Z.line};
      color: #fff;
      border-radius: 12px;
      padding: 12px 16px 12px 42px;
      font-size: 16px;
      font-weight: 700;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: 'Exo 2', sans-serif;
    }
    .zyn-input:focus {
      border-color: ${Z.tealBorder};
      box-shadow: 0 0 0 3px ${Z.tealGlow};
    }
    .zyn-input option { background: ${Z.surface2}; }
    .zyn-input::-webkit-outer-spin-button,
    .zyn-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .zyn-input[type=number] { -moz-appearance: textfield; }

    .zyn-btn-confirm {
      position: relative; overflow: hidden;
      transition: all 0.25s ease;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: 0.06em;
    }
    .zyn-btn-confirm::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .zyn-btn-confirm:hover::after { transform: translateX(100%); }
    .zyn-btn-confirm:hover { box-shadow: 0 0 24px ${Z.goldGlow}; }
    .zyn-btn-confirm:active { transform: scale(0.97); }

    .zyn-btn-cancel {
      transition: all 0.2s ease;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: 0.06em;
    }
    .zyn-btn-cancel:hover {
      background: rgba(248,113,113,0.15) !important;
      border-color: rgba(248,113,113,0.5) !important;
    }

    .zyn-spin { animation: spin 0.9s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .zyn-slide-in { animation: slideIn 0.25s ease both; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
  `}</style>
);

export default function UserPlanConfirmation({ isclose, plan, user_id }) {
  const [open, setOpen] = useState(true);
  const [amount, setAmount] = useState(plan?.monthly_price || plan?.min || 1000);
  const [error, setValidationError] = useState("");
  const [duration, setDuration] = useState(6);
  const dispatch = useDispatch();

  const { error: apiError, message, loading } = useSelector((state) => state.alltopup);

  const minAmount = plan?.min || 1000;
  const maxAmount = plan?.max || 10000;
  const stepAmount = 500;

  useEffect(() => {
    if (apiError) {
      const t = setInterval(() => dispatch(clearErrors()), 3000);
      return () => clearInterval(t);
    }
    if (message) {
      const t = setInterval(() => dispatch(clearMessage()), 3000);
      return () => clearInterval(t);
    }
  }, [dispatch, apiError, message]);

  const validateAmount = (value) => {
    const n = parseFloat(value);
    if (isNaN(n) || value === "") {
      setValidationError("Please enter a valid number");
      return false;
    }
    if (n < minAmount) {
      setValidationError(`Minimum amount is $${minAmount}`);
      return false;
    }
    if (n > maxAmount) {
      setValidationError(`Maximum amount is $${maxAmount}`);
      return false;
    }
    if (n % stepAmount !== 0) {
      setValidationError(`Amount must be a multiple of $${stepAmount}`);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleAmountChange = (e) => { setAmount(e.target.value); validateAmount(e.target.value); };
  const handleDurationChange = (e) => setDuration(parseInt(e.target.value, 10));

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!validateAmount(amount)) return;
    dispatch(addTopup({
      values: {
        id: plan?.id,
        userby_id: user_id,
        userto_id: user_id,
        amount: amount,
        ...(plan?.isCompound && { duration }),
      }
    }));
    isclose();
  };

  return (
    <Dialog open={open} onClose={isclose} className="relative z-50">
      <GlobalStyle />

      <DialogBackdrop className="fixed inset-0" style={{ background: "rgba(4,8,16,0.85)", backdropFilter: "blur(6px)" }} />

      <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center p-4">
        <DialogPanel
          className="zyn-modal zyn-slide-in w-full max-w-md rounded-3xl overflow-hidden"
          style={{ background: Z.surface, border: `1px solid ${Z.line}`, boxShadow: `0 0 60px ${Z.goldGlow}, 0 30px 60px rgba(0,0,0,0.6)` }}>

          {/* Top gradient bar */}
          <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${Z.gold}, ${Z.teal})` }} />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-start justify-between"
            style={{ borderBottom: `1px solid ${Z.line}` }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: Z.goldGlow, border: `1px solid ${Z.goldBorder}` }}>
                <Check className="w-5 h-5" style={{ color: Z.gold }} />
              </div>
              <div>
                <DialogTitle as="h3"
                  className="text-lg font-black leading-tight"
                  style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", letterSpacing: "0.03em" }}>
                  Confirm Purchase
                </DialogTitle>
                <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: Z.muted }}>
                  Plan:{" "}
                  <span className="font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest"
                    style={{ background: Z.goldGlow, color: Z.gold, border: `1px solid ${Z.goldBorder}` }}>
                    {plan?.name}
                  </span>
                </p>
              </div>
            </div>
            <button onClick={isclose}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", color: Z.muted }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = Z.muted; }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: Z.muted }}>
                Enter Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: Z.teal }} />
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder={`${minAmount}`}
                  step={stepAmount}
                  min={minAmount}
                  max={maxAmount}
                  className="zyn-input"
                />
              </div>
              {error && (
                <p className="mt-2 text-xs font-medium" style={{ color: "#F87171" }}>{error}</p>
              )}
            </div>

            {/* Min / Max Info */}
            <div className="p-3 rounded-xl flex items-start gap-2"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${Z.line}` }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: Z.teal }} />
              <div className="text-xs" style={{ color: Z.muted }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>Min:</span> ${minAmount}
                <span className="mx-1" style={{ color: Z.muted }}>|</span>
                <span style={{ color: "#fff", fontWeight: 700 }}>Max:</span> ${maxAmount}
              </div>
            </div>

            {/* Duration (compound only) */}
            {plan?.isCompound && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: Z.muted }}>
                  Select Duration
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: Z.muted }} />
                  <select value={duration} onChange={handleDurationChange} className="zyn-input appearance-none">
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={18}>18 Months</option>
                    <option value={24}>24 Months</option>
                  </select>
                </div>
              </div>
            )}

            {/* API Error */}
            {apiError && (
              <div className="p-3 rounded-xl text-sm"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}>
                {apiError}
              </div>
            )}

            {/* API Message */}
            {message && (
              <div className="p-3 rounded-xl text-sm"
                style={{ background: Z.tealGlow, border: `1px solid ${Z.tealBorder}`, color: Z.teal }}>
                {message}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3" style={{ borderTop: `1px solid ${Z.line}`, paddingTop: "16px" }}>
            <button
              onClick={isclose}
              className="zyn-btn-cancel flex-1 py-3.5 rounded-xl text-sm font-bold"
              style={{ background: "transparent", border: "1px solid rgba(198, 112, 21, 0.25)", color: "#c96a10" }}>
              Cancel
            </button>

            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="zyn-btn-confirm flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: Z.gold, color: Z.navy, fontSize: "14px" }}>
              {loading ? (
                <>
                  <div className="zyn-spin w-4 h-4 rounded-full border-2"
                    style={{ borderColor: `${Z.navy}40`, borderTopColor: Z.navy }} />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Confirm Purchase
                </>
              )}
            </button>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  );
}