import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyProfile } from "../../redux/userSlice";
import { selectUser } from "../../redux/authSlice";
import { getAllPlans } from "../../redux/planSlice";
import { addTopup, clearErrors, clearMessage } from "../../redux/topupSlice";
import { Check, DollarSign, Info, X, Zap, ChevronDown } from "lucide-react";

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
      appearance: none;
      -webkit-appearance: none;
    }
    .zyn-input:focus {
      border-color: ${Z.tealBorder};
      box-shadow: 0 0 0 3px ${Z.tealGlow};
    }
    .zyn-input option { background: ${Z.surface2}; color: #fff; }
    .zyn-input::-webkit-outer-spin-button,
    .zyn-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .zyn-input[type=number] { -moz-appearance: textfield; }

    .zyn-select {
      width: 100%;
      background: ${Z.surface2};
      border: 1px solid ${Z.line};
      color: #fff;
      border-radius: 12px;
      padding: 12px 42px 12px 42px;
      font-size: 15px;
      font-weight: 600;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: 'Exo 2', sans-serif;
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
    }
    .zyn-select:focus {
      border-color: ${Z.tealBorder};
      box-shadow: 0 0 0 3px ${Z.tealGlow};
    }
    .zyn-select option { background: ${Z.surface2}; color: #fff; }

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
      background: rgba(196, 95, 17, 0.15) !important;
      border-color: rgba(248,113,113,0.5) !important;
    }

    .zyn-spin { animation: spin 0.9s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .zyn-slide-in { animation: slideIn 0.25s ease both; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }

    .zyn-checkbox {
      width: 18px; height: 18px;
      border-radius: 5px;
      border: 2px solid ${Z.muted};
      background: ${Z.surface2};
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      transition: all 0.2s ease;
      flex-shrink: 0;
      position: relative;
    }
    .zyn-checkbox:checked {
      background: ${Z.teal};
      border-color: ${Z.teal};
    }
    .zyn-checkbox:checked::after {
      content: '';
      position: absolute;
      left: 4px; top: 1px;
      width: 6px; height: 10px;
      border: 2px solid #fff;
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
    }
    .zyn-checkbox:focus { outline: none; box-shadow: 0 0 0 3px ${Z.tealGlow}; }
  `}</style>
);

export default function UserTopupModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { plans } = useSelector((state) => state.plans);
  const auth = useSelector(selectUser);
  const { loading, error, message } = useSelector((state) => state.alltopup);

  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const minAmount = plan?.min || 1000;
  const maxAmount = plan?.max || 10000;
  const stepAmount = 500;

  useEffect(() => {
    dispatch(getAllPlans());
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearErrors()), 3000);
      return () => clearTimeout(t);
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => dispatch(clearMessage()), 3000);
      return () => clearTimeout(t);
    }
  }, [dispatch, message]);

  const handlePlanChange = (e) => {
    if (e.target.value === "") { setPlan(null); setAmount(""); return; }
    const selectedPlan = plans.find((p) => p.id === parseInt(e.target.value, 10));
    setPlan(selectedPlan || null);
    setAmount(selectedPlan?.monthly_price || selectedPlan?.min || 1000);
    setValidationError("");
  };

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

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    validateAmount(e.target.value);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!plan) {
      setValidationError("Please select a plan");
      return;
    }
    if (!termsAccepted) {
      setValidationError("You must accept the terms and conditions");
      return;
    }
    if (!validateAmount(amount)) return;

    dispatch(addTopup({
      values: {
        id: plan?.id,
        userby_id: auth?.id,
        userto_id: auth?.id,
        amount: amount,
      },
    }));
    modelClose();
  };

  return (
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      <GlobalStyle />

      <DialogBackdrop
        className="fixed inset-0"
        style={{ background: "rgba(7, 7, 6, 0.85)", backdropFilter: "blur(6px)" }}
      />

      <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center p-4">
        <DialogPanel
          className="zyn-modal zyn-slide-in w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: Z.surface,
            border: `1px solid ${Z.line}`,
            boxShadow: `0 0 60px ${Z.goldGlow}, 0 30px 60px rgba(0, 0, 0, 0.6)`,
          }}
        >
          {/* Top gradient bar */}
          <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${Z.gold}, ${Z.teal})` }} />

          {/* ── Header ── */}
          <div
            className="px-6 pt-5 pb-4 flex items-start justify-between"
            style={{ borderBottom: `1px solid ${Z.line}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: Z.goldGlow, border: `1px solid ${Z.goldBorder}` }}
              >
                <Check className="w-5 h-5" style={{ color: Z.gold }} />
              </div>
              <div>
                <DialogTitle
                  as="h3"
                  className="text-lg font-black leading-tight"
                  style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", letterSpacing: "0.03em" }}
                >
                  Upgrade Your Plan
                </DialogTitle>
                <p className="text-xs mt-0.5" style={{ color: Z.muted }}>
                  Take your experience to the next level
                </p>
              </div>
            </div>

            <button
              onClick={modelClose}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", color: Z.muted }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = Z.muted; }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-6 py-5 space-y-4">

            {/* Validation Error */}
            {validationError && (
              <div
                className="p-3 rounded-xl text-sm"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}
              >
                {validationError}
              </div>
            )}

            {/* ── Plan Select ── */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: Z.muted }}>
                Select Upgrade Plan
              </label>
              <div className="relative">
                {/* left icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: Z.goldGlow }}>
                  <span style={{ color: Z.gold, fontSize: 11, fontWeight: 700 }}>★</span>
                </div>
                <select
                  className="zyn-select"
                  onChange={handlePlanChange}
                  value={plan?.id || ""}
                >
                  <option value="">Choose a plan</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${p.monthly_price} Activation
                    </option>
                  ))}
                </select>
                {/* right chevron */}
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: Z.muted }}
                />
              </div>
            </div>

            {/* ── Amount Input ── */}
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
                  disabled={!plan}
                />
              </div>
            </div>

            {/* ── Min / Max Info ── */}
            {plan && (
              <div
                className="p-3 rounded-xl flex items-start gap-2"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${Z.line}` }}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: Z.teal }} />
                <div className="text-xs" style={{ color: Z.muted }}>
                  <span style={{ color: "#fff", fontWeight: 700 }}>Min:</span> ${minAmount}
                  <span className="mx-1" style={{ color: Z.muted }}>|</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>Max:</span> ${maxAmount}
                  <br />
                  <span style={{ color: Z.muted }}>Amount must be in multiples of ${stepAmount}</span>
                </div>
              </div>
            )}

            {/* ── Terms & Conditions ── */}
            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{ background: Z.surface2, border: `1px solid ${Z.line}` }}
            >
              <input
                id="terms"
                type="checkbox"
                className="zyn-checkbox mt-0.5"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: Z.text }}>
                I accept the{" "}
                <span style={{ color: Z.teal, fontWeight: 700 }}>Terms and Conditions</span>
              </label>
            </div>

            {/* API Error */}
            {error && (
              <div
                className="p-3 rounded-xl text-sm"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171" }}
              >
                {error}
              </div>
            )}

            {/* API Success */}
            {message && (
              <div
                className="p-3 rounded-xl text-sm"
                style={{ background: Z.tealGlow, border: `1px solid ${Z.tealBorder}`, color: Z.teal }}
              >
                {message}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            className="px-6 pb-6 flex gap-3"
            style={{ borderTop: `1px solid ${Z.line}`, paddingTop: "16px" }}
          >
            <button
              onClick={modelClose}
              className="zyn-btn-cancel flex-1 py-3.5 rounded-xl text-sm font-bold"
              style={{ background: "transparent", border: "1px solid rgba(214, 146, 9, 0.25)", color: "#ececec" }}
            >
              Cancel
            </button>

            <button
              onClick={handleSaveChanges}
              disabled={loading || !termsAccepted || !plan}
              className="zyn-btn-confirm flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: Z.gold, color: Z.navy, fontSize: "14px" }}
            >
              {loading ? (
                <>
                  <div
                    className="zyn-spin w-4 h-4 rounded-full border-2"
                    style={{ borderColor: `${Z.navy}40`, borderTopColor: Z.navy }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Confirm Upgrade
                </>
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}