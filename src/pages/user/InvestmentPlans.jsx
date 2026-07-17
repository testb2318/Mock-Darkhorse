import { useState, useEffect } from "react";
import {
  Package, TrendingUp, Users, Shield, Clock,
  Zap, Wallet, Award, ChevronRight,
  Activity, Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import Loader from "../../components/common/Loader";
import UserPlanConfirmation from "../../components/modals/UserPlanConfirmation";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import UserEntryFeeConfirmation from "../../components/modals/UserEntryFeeConfirmation";
import { getAllPlans } from "../../redux/planSlice";
import { getUser } from "../../redux/userSlice";
import { clearErrors, clearMessage } from "../../redux/depositeSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";

const Z = {
  gold: "#F5C518",
  goldDim: "#C49B10",
  goldGlow: "rgba(245,197,24,0.15)",
  goldBorder: "rgba(245,197,24,0.28)",
  navy: "#1A3A6B",
  navyLight: "#2B6CB0",
  navyGlow: "rgba(43,108,176,0.18)",
  navyBorder: "rgba(43,108,176,0.30)",
  teal: "#4ECDC4",
  tealGlow: "rgba(78,205,196,0.14)",
  tealBorder: "rgba(78,205,196,0.28)",
  bg: "#080C14",
  surface: "#0D1423",
  surface2: "#111B2E",
  line: "rgba(255,255,255,0.06)",
  muted: "#4B5A72",
  text: "#CBD5E1",
};

const GlobalStyle = () => (
  <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Exo+2:wght@300;400;500;600;700;900&display=swap');
      .zyn-root * { box-sizing: border-box; }
      .zyn-root { font-family: 'Exo 2', sans-serif; }
      .zyn-hex {
        background-image:
          radial-gradient(circle at 15% 25%, rgba(212,175,55,0.10) 0%, transparent 55%),
          radial-gradient(circle at 85% 75%, rgba(212,175,55,0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 60%);
      }
      .zyn-spin { animation: spin 10s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .zyn-pulse { animation: pulse 2s ease-in-out infinite; }
      @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
    `}</style>
);

const cardAccents = [
  {
    color: '#d4af37',
    glow: 'rgba(212, 175, 55, 0.15)',
    border: 'rgba(212, 175, 55, 0.3)',
    bg: 'rgba(212, 175, 55, 0.05)',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};



export default function InvestmentPlans() {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state) => state.plans);
  const { error, message, loading: topUpLoading } = useSelector((state) => state.alltopup);
  const auth = useSelector(selectUser);

  const [planConfirm, setPlanConfirm] = useState(false);
  const [plan, setPlan] = useState(null);
  const [entryPlanModel, setEntryPlanModel] = useState(false);

  useEffect(() => {
    dispatch(getAllPlans());
    if (auth?.id) dispatch(getUser(auth?.id));
  }, [dispatch, auth?.id]);

  useEffect(() => {
    if (error) {
      const t = setInterval(() => dispatch(clearErrors()), 3000);
      return () => clearInterval(t);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (message) {
      const t = setInterval(() => dispatch(clearMessage()), 3000);
      return () => clearInterval(t);
    }
  }, [message, dispatch]);

  function handleBuyPlan(p) { setPlan(p); setPlanConfirm(true); }
  function isclose() { setPlan(null); setPlanConfirm(false); setEntryPlanModel(false); }

  if (loading) return <Loader isLoading={true} />;

  return (
    <>
      <GlobalStyle />
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}

      <div className="zyn-root zyn-hex min-h-screen bg-transparent text-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 relative z-10">

          {/* Header */}
          <div className="text-center mb-14 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
              style={{ background: `radial-gradient(ellipse, rgba(212,175,55,0.15) 0%, transparent 70%)` }} />

            <div className="relative flex flex-col items-center justify-center mb-6">
              <svg viewBox="0 0 64 64" className="w-16 h-16 zyn-spin absolute" style={{ opacity: 0.5 }}>
                <circle cx="32" cy="32" r="29" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="8 5" />
              </svg>
              <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border border-gold-medium/30 bg-gold-medium/10">
                <Zap className="w-6 h-6 text-gold-light" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 border border-gold-medium/30 bg-gold-medium/10">
              <span className="zyn-pulse w-1.5 h-1.5 rounded-full inline-block bg-gold-light" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-light">
                Start Earning Today
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-none"
              style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "-0.01em" }}>
              <span className="text-white">Subscription</span>{" "}
              <span className="text-gold-medium">PLANS</span>
            </h1>
            <p className="text-base max-w-xl mx-auto mb-5 text-gold-medium/70">
              Choose the perfect plan that matches your financial goals and risk tolerance.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { label: "Active Plans", value: plans?.length || 0 },
              // { label: "Support", value: "24/7" },
              { label: "Secure Investment", value: "100%" },
              { label: "Withdrawal", value: "Instant" },
            ].map((s) => (
              <div key={s.label} className="glass-card animated-border-gold rounded-2xl p-0.5">
                <div className="bg-black/40 rounded-[15px] p-4 text-center h-full flex flex-col justify-center">
                  <div className="text-2xl font-black mb-0.5 text-gold-light font-display">{s.value}</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gold-medium/70">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Plans Grid */}
          <section id="plans_grid" className="w-full max-w-8xl mx-auto">
            {plans && plans.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-4"
              >
                {plans.map((p, index) => {
                  const accent = cardAccents[index % cardAccents.length];
                  const price = p.monthly_price || 0;

                  return (
                    <motion.div
                      key={p.id}
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      className="relative w-full group"
                    >
                      <div className="glass-card animated-border-gold rounded-[2rem] p-0.5">
                        <div className="bg-black/40 rounded-[1.8rem] relative overflow-hidden z-10">

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 p-5 lg:p-4">

                          {/* Icon & Name */}
                          <div className="flex items-center gap-5 flex-1 w-full lg:w-auto">
                            <motion.div
                              initial={{ rotate: -10 }}
                              animate={{ rotate: 0 }}
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border relative"
                              style={{ background: accent.bg, borderColor: accent.border }}
                            >
                              {index % 2 === 0
                                ? <Wallet className="w-8 h-8" style={{ color: accent.color }} />
                                : <Award className="w-8 h-8" style={{ color: accent.color }} />}
                              <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 rounded-2xl blur-md"
                                style={{ background: accent.color }}
                              />
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-black text-white uppercase tracking-tight truncate font-display">
                                {p.name || "Plan"}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm leading-relaxed text-gold-medium/70">
                                  {p.description || "Premium investment plan with guaranteed returns."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 px-6 lg:border-x border-gold-medium/20 w-full lg:w-auto">
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-gold-medium/70 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={12} className="text-gold-light" /> Daily ROI
                              </div>
                              <div className="text-lg font-black text-white font-display">
                                {p.ROI_day || 0}%
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[10px] font-bold text-gold-medium/70 uppercase tracking-widest flex items-center gap-2">
                                <Users size={12} className="text-gold-light" /> Sponsor Bonus
                              </div>
                              <div className="text-lg font-black text-white font-display">
                                {p.Sponser_bonus || 0}%
                              </div>
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4">
                            <div className="text-left lg:text-right">
                              <div className="text-[10px] font-bold text-gold-medium/70 uppercase tracking-widest mb-0.5">Monthly Price</div>
                              <div className="text-2xl font-black text-white flex items-baseline gap-1 font-display">
                                ${price}
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleBuyPlan(p)}
                              disabled={topUpLoading}
                              className="relative group/btn overflow-hidden flex items-center gap-3 px-8 py-3 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b89126 100%)' }}
                            >
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
                              {topUpLoading ? (
                                <div className="w-5 h-5 rounded-full border-2 animate-spin border-black/40 border-t-black" />
                              ) : (
                                <>
                                  <span className="relative z-10 font-black text-black text-xs uppercase tracking-[0.15em] font-display">
                                    Invest Now
                                  </span>
                                  <ChevronRight size={16} className="relative z-10 text-black transition-transform group-hover/btn:translate-x-1" />
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>

                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="col-span-full text-center py-24 glass-card animated-border-gold rounded-3xl p-1">
                <div className="bg-black/40 rounded-[1.8rem] py-24 border-b border-gold-medium/20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 border border-gold-medium/30 bg-gold-medium/10">
                    <Package className="w-9 h-9 text-gold-medium" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-display">
                    No Plans Available
                  </h3>
                  <p className="text-gold-medium/70">Please check back later for investment plans.</p>
                </div>
              </div>
            )}
          </section>

          <div className="text-center mt-14 pt-8 border-t border-gold-medium/20">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-medium/70">
              🔒 Secure & Guaranteed Returns &nbsp;|&nbsp; 💎 Customer Support &nbsp;|&nbsp; ⚡ Start Earning Today
            </p>
          </div>
        </div>
      </div>

      {planConfirm && (
        <UserPlanConfirmation
          isclose={isclose}
          plan={plan}
          user_id={auth?.id}
        />
      )}
      {entryPlanModel && (
        <UserEntryFeeConfirmation isclose={isclose} user_id={auth?.id} />
      )}
    </>
  );
}