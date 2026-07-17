import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import {
  createPayment,
  getCurrencies,
  getMinAmount,
  getPaymentStatus,
} from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import PaymentQRCode from "./GateWayQr";

// --- ANIMATION VARIANTS: Element level interactivity ---
const fader = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

const inputFocus = {
  scale: 1.01,
  transition: { type: "spring", stiffness: 300 }
};

const Nowpayments = () => {
  const { auth } = useSelector((state) => state.auth);
  const id = auth?.id;

  // --- BACKEND LOGIC (STRICTLY UNTOUCHED) ---
  const [formData, setFormData] = useState({
    price_amount: "",
    price_currency: "usd",
    pay_currency: "",
    id,
  });
  const [currencies, setCurrencies] = useState([]);
  const [paymentResult, setPaymentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        setCurrencies(data.currencies);
      } catch (err) { console.error(err); }
    };
    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!formData.id) return alert("User Null");
    try {
      const result = await createPayment({
        ...formData,
        price_amount: parseFloat(formData.price_amount),
      });
      setPaymentResult(result);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080c14] text-white p-4 m-4 overflow-hidden flex items-center justify-center font-sans">
      
      {/* 1. BACKGROUND ANIMATION: Moving Fluid Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [-30, 30, -30], y: [0, 60, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full"
        />
        <motion.div 
          animate={{ x: [30, -30, 30], y: [0, -40, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full"
        />
      </div>

      <motion.div 
        initial="hidden" animate="visible" variants={fader}
        className="relative z-10 max-w-xl w-full bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
      >
        {/* Header: Theme consistent Blue-Cyan Gradient */}
        <div className="bg-slate-950/40 p-8 border-b border-slate-800/50">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black italic tracking-tighter text-white"
          >
            CRYPTO <span className="text-blue-500 not-italic">DEPOSIT</span>
          </motion.h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Secure Institutional Gateway</p>
        </div>

        <div className="p-8 lg:p-10">
          <AnimatePresence mode="wait">
            {!paymentResult ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                <div className="space-y-6">
                  {/* Amount and Asset Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={fader} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deposit Amount (USD)</label>
                      <motion.input
                        whileFocus={inputFocus}
                        type="number" name="price_amount" value={formData.price_amount} onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4.5 px-6 focus:border-blue-500 outline-none transition-all placeholder-slate-700 font-bold"
                        placeholder="0.00" required
                      />
                    </motion.div>
                    <motion.div variants={fader} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Class</label>
                      <div className="w-full bg-slate-900/20 border border-slate-800 rounded-2xl py-4.5 px-6 text-blue-400 font-black italic">
                        USDT
                      </div>
                    </motion.div>
                  </div>

                  {/* Network Selection */}
                  <motion.div variants={fader} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Settlement Network</label>
                    <div className="relative">
                      <motion.select 
                        whileFocus={inputFocus}
                        name="pay_currency" value={formData.pay_currency} onChange={handleChange} required 
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4.5 px-6 focus:border-blue-500 outline-none cursor-pointer appearance-none text-sm font-bold text-slate-300"
                      >
                        <option value="">Select Network...</option>
                        {currencies.filter(c => c.toLowerCase() === "usdtbsc").map(c => (
                          <option key={c} value={c}>BEP-20 (Binance Smart Chain)</option>
                        ))}
                      </motion.select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                    </div>
                  </motion.div>
                </div>

                {/* Submit Action */}
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(37,99,235,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full bg-blue-600 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : "Initialize Secure Transaction"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div 
                key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800 space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Network Status</p>
                      <p className="text-blue-400 text-sm font-black flex items-center gap-3 mt-1">
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                        AWAITING FUNDING
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Reference ID</p>
                      <p className="text-[10px] font-mono text-slate-400 break-all bg-black/30 p-3 rounded-lg mt-1">{paymentResult.payment_id}</p>
                    </div>
                    <button 
                      onClick={() => setPaymentResult(null)} 
                      className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors"
                    >
                      ← Abort Transaction
                    </button>
                  </div>
                  
                  {/* QR Animation */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-6 rounded-[2.5rem] flex justify-center shadow-[0_0_60px_rgba(37,99,235,0.2)]"
                  >
                    <PaymentQRCode paymentData={paymentResult} />
                  </motion.div>
                </div>
                
                <PaymentStatusTracker paymentId={paymentResult.payment_id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// --- LOGIC SUB-COMPONENTS (STRICTLY PRESERVED) ---

const PaymentStatusTracker = ({ paymentId }) => {
  const [status, setStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const s = await getPaymentStatus(paymentId);
        setStatus(s);
        if (s.payment_status === "finished") setShowSuccess(true);
        if (["failed", "expired"].includes(s.payment_status)) setShowFailed(true);
      } catch (err) { console.error(err); }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Polling remains same
    return () => clearInterval(interval);
  }, [paymentId]);

  if (showSuccess) return <PaymentSuccess />;
  if (showFailed) return <div className="text-rose-500 text-center p-6 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-[10px] font-black uppercase tracking-widest">Session Expired / Failed</div>;

  return (
    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 text-center">
      <span className="text-[11px] text-blue-500 font-black uppercase tracking-[0.4em]">
        {status ? status.payment_status : "SYNCHRONIZING..."}
      </span>
    </div>
  );
};

const PaymentSuccess = () => {
  useEffect(() => {
    setTimeout(() => { window.location.reload(); }, 3000);
  }, []);

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      className="bg-emerald-500/10 border border-emerald-500/30 p-10 rounded-[2.5rem] text-center"
    >
      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-2xl font-black text-emerald-400 italic">SUCCESS</h3>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 italic">Syncing balance with blockchain...</p>
    </motion.div>
  );
};

export default Nowpayments;