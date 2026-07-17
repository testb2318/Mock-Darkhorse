import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWithdrawalByid,
  deleteWithdrawal,
  clearErrors,
  clearMessage,
} from "../../redux/withdrawalSlice";
import { getMyProfile } from "../../redux/userSlice";
import {
  Banknote,
  CalendarIcon,
  ClockIcon,
  Search,
  ArrowUpRight,
  History,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Zap,
  Landmark, // ✅ Principle ke liye icon
} from "lucide-react";
import Loader from "../../components/common/Loader";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import WithdrawalModel from "../../components/modals/WithdrawalModel";
import ROIWithdrawalConfirmation from "../../components/modals/ROIWithdrawalConfirmation";
import PrincipleWithdrawal from "../../components/modals/PrincipleWithdrawal"; // ✅ ADD
import BebModal from "../../components/modals/BebModal";
import { selectUser } from "../../redux/authSlice";

/* ─── Dark Horse Design Tokens ──────────────────────────────────────────────── */
const Z = {
  gold:        "#d4af37",
  goldDim:     "#d4af37",
  goldGlow:    "rgba(212,175,55,0.15)",
  goldBorder:  "rgba(212,175,55,0.25)",
  navy:        "#000000",
  navyLight:   "#d4af37",
  navyGlow:    "rgba(212,175,55,0.15)",
  navyBorder:  "rgba(212,175,55,0.30)",
  teal:        "#d4af37",
  tealGlow:    "rgba(212,175,55,0.12)",
  tealBorder:  "rgba(212,175,55,0.25)",
  purple:      "#d4af37",
  purpleGlow:  "rgba(212,175,55,0.12)",
  purpleBorder:"rgba(212,175,55,0.25)",
  bg:          "transparent",
  surface:     "transparent",
  surfaceUp:   "rgba(10,10,10,0.8)",
  line:        "rgba(212,175,55,0.25)",
  muted:       "#d4af37",
  text:        "#f1f1f1",
};

/* ─── Inline global style injection ──────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700;900&display=swap');

    .zyn-root { font-family: 'Exo 2', sans-serif; }

    .zyn-card-gold { transition: box-shadow 0.35s ease, border-color 0.35s ease; }
    .zyn-card-gold:hover {
      border-color: ${Z.goldBorder} !important;
      box-shadow: 0 0 40px ${Z.goldGlow}, inset 0 0 30px ${Z.goldGlow};
    }

    .zyn-card-teal { transition: box-shadow 0.35s ease, border-color 0.35s ease; }
    .zyn-card-teal:hover {
      border-color: ${Z.tealBorder} !important;
      box-shadow: 0 0 40px ${Z.tealGlow}, inset 0 0 30px ${Z.tealGlow};
    }

    /* ✅ Principle card hover */
    .zyn-card-purple { transition: box-shadow 0.35s ease, border-color 0.35s ease; }
    .zyn-card-purple:hover {
      border-color: ${Z.purpleBorder} !important;
      box-shadow: 0 0 40px ${Z.purpleGlow}, inset 0 0 30px ${Z.purpleGlow};
    }

    .zyn-hex-bg {
      background: transparent;
    }

    .zyn-scan::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${Z.gold}, transparent);
      animation: scan 3s ease-in-out infinite;
    }
    @keyframes scan {
      0%,100% { opacity: 0; transform: scaleX(0.2); }
      50%      { opacity: 1; transform: scaleX(1);   }
    }

    .zyn-scan-teal::before {
      background: linear-gradient(90deg, transparent, ${Z.teal}, transparent);
    }

    /* ✅ Principle scan */
    .zyn-scan-purple::before {
      background: linear-gradient(90deg, transparent, ${Z.purple}, transparent);
    }

    .zyn-btn-gold {
      position: relative; overflow: hidden;
      transition: all 0.25s ease;
    }
    .zyn-btn-gold::after {
      content:''; position:absolute; inset:0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .zyn-btn-gold:hover::after { transform: translateX(100%); }
    .zyn-btn-gold:hover { box-shadow: 0 0 24px ${Z.goldGlow}; }
    .zyn-btn-gold:active { transform: scale(0.98); }

    .zyn-btn-teal {
      position: relative; overflow: hidden;
      transition: all 0.25s ease;
    }
    .zyn-btn-teal::after {
      content:''; position:absolute; inset:0;
      background: linear-gradient(90deg, transparent 0%, rgba(78,205,196,0.12) 50%, transparent 100%);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .zyn-btn-teal:hover::after { transform: translateX(100%); }
    .zyn-btn-teal:hover { box-shadow: 0 0 24px ${Z.tealGlow}; }
    .zyn-btn-teal:active { transform: scale(0.98); }

    /* ✅ Principle button */
    .zyn-btn-purple {
      position: relative; overflow: hidden;
      transition: all 0.25s ease;
    }
    .zyn-btn-purple::after {
      content:''; position:absolute; inset:0;
      background: linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.12) 50%, transparent 100%);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .zyn-btn-purple:hover::after { transform: translateX(100%); }
    .zyn-btn-purple:hover { box-shadow: 0 0 24px ${Z.purpleGlow}; }
    .zyn-btn-purple:active { transform: scale(0.98); }

    .zyn-row { transition: background 0.2s ease; }
    .zyn-row:hover { background: rgba(245,197,24,0.03) !important; }

    .zyn-input:focus { border-color: ${Z.goldBorder} !important; box-shadow: 0 0 0 3px ${Z.goldGlow}; }
    .zyn-input { transition: border-color 0.2s ease, box-shadow 0.2s ease; }

    .zyn-pending-pulse { animation: badgePulse 2s ease-in-out infinite; }
    @keyframes badgePulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.65; }
    }

    .zyn-logo-ring { animation: ringRotate 12s linear infinite; }
    @keyframes ringRotate { to { transform: rotate(360deg); } }

    .zyn-fade-in { animation: fadeUp 0.5s ease both; }
    .zyn-fade-in:nth-child(1) { animation-delay: 0.05s; }
    .zyn-fade-in:nth-child(2) { animation-delay: 0.15s; }
    .zyn-fade-in:nth-child(3) { animation-delay: 0.25s; } /* ✅ 3rd card */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0);    }
    }

    .zyn-corner::after {
      content: '';
      position: absolute;
      bottom: 0; right: 0;
      width: 60px; height: 60px;
      background: conic-gradient(from 135deg, transparent 45deg, rgba(245,197,24,0.12) 90deg, transparent 135deg);
      border-radius: 0 0 1.5rem 0;
    }
    .zyn-corner-teal::after {
      background: conic-gradient(from 135deg, transparent 45deg, rgba(78,205,196,0.12) 90deg, transparent 135deg);
    }
    /* ✅ Principle corner */
    .zyn-corner-purple::after {
      background: conic-gradient(from 135deg, transparent 45deg, rgba(167,139,250,0.12) 90deg, transparent 135deg);
    }
  `}</style>
);

/* ─── Status Badge ────────────────────────────────────────────────────────── */
const getStatusBadge = (status) => {
  const s = status?.toLowerCase();
  if (s === "pending") return (
    <span className="zyn-pending-pulse inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{ color: Z.gold, background: Z.goldGlow, border: `1px solid ${Z.goldBorder}` }}>
      <ClockIcon className="w-3 h-3" /> Pending
    </span>
  );
  if (s === "approved" || s === "complete") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{ color: Z.teal, background: Z.tealGlow, border: `1px solid ${Z.tealBorder}` }}>
      <ShieldCheck className="w-3 h-3" /> Approved
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{ color: "#F87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
      <AlertCircle className="w-3 h-3" /> {status}
    </span>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Withdrawals() {
  const dispatch = useDispatch();

  const { singleWithdrawal, loading, error, message } = useSelector((state) => state.allwithdrawal);
  const { myprofile } = useSelector((state) => state.users);
  const auth = useSelector(selectUser);

  const [searchTerm, setSearchTerm]                       = useState("");
  const [bebModal, setBebModal]                           = useState(false);
  const [openModel, setOpenModel]                         = useState(false);
  const [withdrawalROIModel, setWithdrawalROIModel]       = useState(false);
  const [withdrawalPrincipleModel, setWithdrawalPrincipleModel] = useState(false); // ✅ ADD

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getAllWithdrawalByid());
  }, [dispatch]);

  useEffect(() => {
    if (error || message) {
      const t = setTimeout(() => {
        if (error)   dispatch(clearErrors());
        if (message) dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [dispatch, error, message]);

  const closeAllModals = () => {
    setOpenModel(false);
    setWithdrawalROIModel(false);
    setWithdrawalPrincipleModel(false); // ✅ ADD
  };

  const openWithdrawalModal = (type) => {
    if (myprofile?.bep20 || myprofile?.trc20) {
      if (type === "income")         setOpenModel(true);
      else if (type === "roi")       setWithdrawalROIModel(true);
      else if (type === "principle") setWithdrawalPrincipleModel(true); // ✅ ADD
    } else {
      setBebModal(true);
    }
  };

  const filteredWithdrawals = singleWithdrawal?.filter(item =>
    item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item?.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="zyn-root min-h-screen" style={{ background: "transparent", color: Z.text }}>
      <GlobalStyle />
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 48 48" className="w-full h-full zyn-logo-ring" style={{ position: "absolute" }}>
                <circle cx="24" cy="24" r="21" fill="none" stroke={Z.navyLight} strokeWidth="2" strokeDasharray="6 4" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-5 h-5" style={{ color: Z.gold }} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: Z.muted }}>
                Dark Horse Finance
              </p>
              <h1 className="text-3xl font-black tracking-tight leading-none" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                <span style={{ color: "#fff" }}>WITHDRAW</span>{" "}
                <span style={{ color: Z.gold }}>ASSETS</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
            style={{ background: Z.tealGlow, border: `1px solid ${Z.tealBorder}` }}>
            <ShieldCheck className="w-4 h-4" style={{ color: Z.teal }} />
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: Z.teal }}>
              Secure Protocol Active
            </span>
          </div>
        </div>

        {/* ── Wallet Cards ───────────────────────────────────────────────── */}
        {/* ✅ 3 columns now (md:grid-cols-3) */}
        <div className="glass-card animated-border-gold mb-10 overflow-hidden rounded-3xl p-0.5">

  {/* Header */}
  <div className="border-b border-white/6 px-4 py-4 sm:px-6">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <p
          className="text-[9px] font-black uppercase tracking-[0.28em]"
          style={{ color: Z.muted }}
        >
          WALLET CONTROL CENTER
        </p>

        <h2
          className="mt-1 text-lg font-bold text-white md:text-xl"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Secure Withdrawal Access
        </h2>
      </div>

      <p
        className="max-w-md text-xs leading-5 md:text-sm"
        style={{ color: Z.muted }}
      >
        Fast access to all wallet withdrawal actions.
      </p>
    </div>
  </div>

  {/* Income Wallet */}
  <button
    onClick={() => openWithdrawalModal("income")}
    className="group flex w-full flex-col gap-4 border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/[0.02] sm:px-6 md:flex-row md:items-center md:justify-between"
  >
    <div className="flex items-start gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: Z.goldGlow,
          border: `1px solid ${Z.goldBorder}`,
        }}
      >
        <Banknote className="h-6 w-6" style={{ color: Z.gold }} />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className="text-base font-bold text-white md:text-lg"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Income Wallet
          </h3>

          <span
            className="rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em]"
            style={{
              background: Z.goldGlow,
              color: Z.gold,
              border: `1px solid ${Z.goldBorder}`,
            }}
          >
            Primary
          </span>
        </div>

        <p
          className="mt-1 text-xs leading-5 md:text-sm"
          style={{ color: Z.muted }}
        >
          Referral earnings and networking bonus withdrawals.
        </p>
      </div>
    </div>

    <div
      className="flex h-10 items-center justify-center rounded-xl px-4 text-xs font-black transition group-hover:scale-[1.02] md:h-11 md:px-5 md:text-sm"
      style={{
        background: Z.gold,
        color: Z.navy,
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      Withdraw Income
      <ArrowUpRight className="ml-2 h-4 w-4" />
    </div>
  </button>

  {/* Trade Wallet */}
  {/* <button
    onClick={() => openWithdrawalModal("roi")}
    className="group flex w-full flex-col gap-4 border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/[0.02] sm:px-6 md:flex-row md:items-center md:justify-between"
  >
    <div className="flex items-start gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: Z.tealGlow,
          border: `1px solid ${Z.tealBorder}`,
        }}
      >
        <TrendingUp className="h-6 w-6" style={{ color: Z.teal }} />
      </div>

      <div>
        <h3
          className="text-base font-bold text-white md:text-lg"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Trade Wallet
        </h3>

        <p
          className="mt-1 text-xs leading-5 md:text-sm"
          style={{ color: Z.muted }}
        >
          Yield returns and daily trade withdrawal access.
        </p>
      </div>
    </div>

    <div
      className="flex h-10 items-center justify-center rounded-xl px-4 text-xs font-black transition group-hover:bg-white/10 md:h-11 md:px-5 md:text-sm"
      style={{
        background: Z.tealGlow,
        color: Z.teal,
        border: `1px solid ${Z.tealBorder}`,
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      Withdraw Yield
      <ArrowUpRight className="ml-2 h-4 w-4" />
    </div>
  </button> */}

  {/* Principle Wallet */}
  {/* <button
    onClick={() => openWithdrawalModal("principle")}
    className="group flex w-full flex-col gap-4 px-4 py-4 text-left transition hover:bg-white/[0.02] sm:px-6 md:flex-row md:items-center md:justify-between"
  >
    <div className="flex items-start gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: Z.purpleGlow,
          border: `1px solid ${Z.purpleBorder}`,
        }}
      >
        <Landmark className="h-6 w-6" style={{ color: Z.purple }} />
      </div>

      <div>
        <h3
          className="text-base font-bold text-white md:text-lg"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Principle Wallet
        </h3>

        <p
          className="mt-1 text-xs leading-5 md:text-sm"
          style={{ color: Z.muted }}
        >
          Withdraw original invested capital securely.
        </p>
      </div>
    </div>

    <div
      className="flex h-10 items-center justify-center rounded-xl px-4 text-xs font-black transition group-hover:bg-white/10 md:h-11 md:px-5 md:text-sm"
      style={{
        background: Z.purpleGlow,
        color: Z.purple,
        border: `1px solid ${Z.purpleBorder}`,
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      Withdraw Principle
      <ArrowUpRight className="ml-2 h-4 w-4" />
    </div>
  </button> */}
</div>

        <div className="glass-card animated-border-gold rounded-3xl overflow-hidden p-0.5">
          <div className="px-6 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderBottom: `1px solid ${Z.line}` }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: Z.goldGlow, border: `1px solid ${Z.goldBorder}` }}>
                <History className="w-4 h-4" style={{ color: Z.gold }} />
              </div>
              <span className="font-bold text-white text-base" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em" }}>
                Recent Activities
              </span>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: Z.muted }} />
              <input
                type="text"
                placeholder="Filter by status or type..."
                className="zyn-input w-full rounded-xl py-3 pl-12 pr-4 text-sm outline-none"
                style={{ background: Z.bg, border: `1px solid rgba(255,255,255,0.08)`, color: "#fff", fontFamily: "'Exo 2', sans-serif" }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "rgba(245,197,24,0.03)" }}>
                  {["Transaction", "Amount", "Date", "Status"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-amber-300"
                      style={{ color: Z.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ borderTop: `1px solid ${Z.line}` }}>
                {filteredWithdrawals?.length > 0 ? (
                  filteredWithdrawals.slice().reverse().map((item, index) => (
                    <tr key={index} className="zyn-row" style={{ borderBottom: `1px solid ${Z.line}` }}>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          #WDL-{1000 + index}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: Z.muted }}>
                          {item?.type || "Transfer"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold" style={{ color: Z.gold, fontFamily: "'Rajdhani', sans-serif", fontSize: "16px" }}>
                          $ {(item?.amount + (item?.deduction || 0)).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-200">
                        {new Date(item?.createdAT).toLocaleString('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})}
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(item?.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-sm font-black uppercase tracking-widest"
                      style={{ color: Z.muted }}>
                      No Transaction Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {openModel && (
        <WithdrawalModel openModel={openModel} modelClose={closeAllModals} />
      )}
      {withdrawalROIModel && (
        <ROIWithdrawalConfirmation
          openModel={withdrawalROIModel}
          modelClose={closeAllModals}
          id={auth?.id}
        />
      )}
      {/* ✅ Principle Modal — NEWLY ADDED */}
      {withdrawalPrincipleModel && (
        <PrincipleWithdrawal
          openModel={withdrawalPrincipleModel}
          modelClose={closeAllModals}
        />
      )}
      {bebModal && <BebModal handleBebClose={() => setBebModal(false)} />}
    </div>
  );
}