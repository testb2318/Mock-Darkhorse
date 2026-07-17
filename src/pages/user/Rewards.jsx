import React, { useState, useEffect } from "react";
import {
  Trophy, Lock, CheckCircle, Clock, Gift,
  Star, Award, Zap, TrendingUp, Shield,
  ChevronRight, Sparkles, Target, Flame,
} from "lucide-react";
import {
  fetchUserRewards,
  fetchUserBusiness,
  claimReward,
  updateRewardStatus,
} from "../../redux/rewardSlice";
import { useSelector, useDispatch } from "react-redux";

// ─────────────────────────────────────────────────────────
// DESIGN TOKENS — Glassmorphism + deep dark base
// ─────────────────────────────────────────────────────────
const g = {
  // Page background — deep rich dark
  pageBg: "#0B0F14",
  surface: "#121821",

  // Ambient background blobs
  blob1: "radial-gradient(ellipse at 15% 20%, rgba(212,175,55,0.08) 0%, transparent 70%)",
  blob2: "radial-gradient(ellipse at 85% 75%, rgba(0,212,255,0.05) 0%, transparent 70%)",
  blob3: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 70%)",

  // Glass surfaces
  glassBg: "rgba(18,24,33,0.7)",
  glassBgMed: "rgba(18,24,33,0.85)",
  glassBgHover: "rgba(26,26,26,0.9)",
  glassBgStrong: "rgba(18,24,33,0.95)",
  glassActive: "rgba(212,175,55,0.05)",
  glassBorder: "rgba(212,175,55,0.12)",
  glassBorderMed: "rgba(212,175,55,0.25)",
  glassBorderStrong: "rgba(212,175,55,0.4)",

  // Accent palette
  gold: "#D4AF37",
  goldHighlight: "#F5C542",
  goldGlow: "rgba(212,175,55,0.15)",
  goldGlowStrong: "rgba(212,175,55,0.25)",
  accentBlue: "#00D4FF",
  accentBlueSoft: "rgba(0,212,255,0.1)",
  success: "#00C853",
  successSoft: "rgba(0,200,83,0.1)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#8A8A8A",
  textDim: "#555555",
  textGold: "#D4AF37",
  textAccent: "#00D4FF",
  textSuccess: "#00C853",

  // Gradients
  gradGold: "linear-gradient(135deg, #D4AF37, #F5C542)",
  gradBlack: "linear-gradient(135deg, #0B0F14, #121821)",
  gradAccent: "linear-gradient(135deg, #00D4FF, #00A3C2)",
  gradProgressGold: "linear-gradient(90deg, #D4AF37, #F5C542)",

  // Shadows
  shadowGlass: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.05)",
  shadowGlassHover: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.1)",
  shadowGoldActive: "0 0 0 1px rgba(212,175,55,0.3), 0 12px 40px rgba(212,175,55,0.15)",
  shadowGoldBtn: "0 4px 20px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
  shadowModal: "0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.1)",
  shadowStatCard: "0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
};


// ─────────────────────────────────────────────────────────
// GLASS SURFACE HELPERS
// ─────────────────────────────────────────────────────────
const glassCard = (extra = {}) => ({
  background: g.glassBg,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${g.glassBorder}`,
  boxShadow: g.shadowGlass,
  ...extra,
});

const glassCardActive = {
  background: g.glassActive,
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: `1px solid rgba(212,175,55,0.4)`,
  boxShadow: g.shadowGoldActive,
};

const glassCardHover = {
  background: g.glassBgHover,
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: `1px solid ${g.glassBorderMed}`,
  boxShadow: g.shadowGlassHover,
};

const btnGold = (disabled) => ({
  background: disabled ? "rgba(255,255,255,0.06)" : g.gradGold,
  color: disabled ? g.textDim : "#0B0F14",
  border: disabled ? `1px solid rgba(255,255,255,0.08)` : "none",
  fontWeight: 700,
  letterSpacing: "0.05em",
  fontSize: "0.72rem",
  textTransform: "uppercase",
  boxShadow: disabled ? "none" : g.shadowGoldBtn,
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "all 0.18s ease",
  backdropFilter: "blur(8px)",
});

const btnViolet = (disabled) => ({
  background: disabled ? "rgba(255,255,255,0.04)" : g.glassBgMed,
  color: disabled ? g.textDim : g.textAccent,
  border: disabled ? `1px solid rgba(255,255,255,0.06)` : `1px solid rgba(0,212,255,0.4)`,
  fontWeight: 600,
  fontSize: "0.72rem",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  boxShadow: disabled ? "none" : "0 4px 20px rgba(0,212,255,0.2)",
  cursor: disabled ? "not-allowed" : "pointer",
  backdropFilter: "blur(12px)",
  transition: "all 0.18s ease",
});

// ─────────────────────────────────────────────────────────
// AMBIENT BLOBS — fixed decorative background layer
// ─────────────────────────────────────────────────────────
const AmbientBg = () => (
  <div
    style={{
      position: "absolute", inset: 0, overflow: "hidden",
      pointerEvents: "none", zIndex: 0, borderRadius: "inherit",
    }}
  >
    <div style={{ position: "absolute", inset: 0, background: g.blob1 }} />
    <div style={{ position: "absolute", inset: 0, background: g.blob2 }} />
    <div style={{ position: "absolute", inset: 0, background: g.blob3 }} />
  </div>
);

// Top-edge frosted highlight — sells the glass illusion
const GlassEdge = ({ color = "rgba(255,255,255,0.12)" }) => (
  <div style={{
    position: "absolute", top: 0, left: "5%", right: "5%", height: "1px",
    background: `linear-gradient(90deg, transparent, ${color} 25%, ${color} 75%, transparent)`,
    pointerEvents: "none", zIndex: 2,
  }} />
);

// ─────────────────────────────────────────────────────────
// COUNTDOWN TIMER
// ─────────────────────────────────────────────────────────
const CountdownTimer = ({ endDate }) => {
  const [tl, setTl] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const d = new Date(endDate) - new Date();
      return d > 0
        ? { days: Math.floor(d / 86400000), hours: Math.floor((d / 3600000) % 24), minutes: Math.floor((d / 60000) % 60), seconds: Math.floor((d / 1000) % 60) }
        : { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    const id = setInterval(() => setTl(calc()), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold"
      style={{ background: g.accentBlueSoft, border: `1px solid rgba(0,212,255,0.25)`, color: g.textAccent, backdropFilter: "blur(8px)" }}>
      <Clock size={11} />
      <span>{tl.days}d {tl.hours}h {tl.minutes}m {tl.seconds}s</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// SUCCESS MODAL
// ─────────────────────────────────────────────────────────
const SuccessModal = ({ isOpen, onClose, rewardAmount }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(11,15,20,0.92)", backdropFilter: "blur(12px)" }}>
      <div className="relative rounded-3xl p-8 w-full max-w-sm overflow-hidden"
        style={{ ...glassCard(), border: `1px solid rgba(212,175,55,0.35)`, boxShadow: g.shadowModal }}>
        <AmbientBg />
        <GlassEdge color="rgba(212,175,55,0.3)" />
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Glow ring */}
          <div className="relative mb-6">
            <div style={{ position: "absolute", inset: "-8px", borderRadius: "50%", background: g.goldGlowStrong, filter: "blur(12px)" }} />
            <div className="w-18 h-18 rounded-full flex items-center justify-center relative"
              style={{ width: 72, height: 72, background: g.glassBgStrong, border: `1px solid rgba(212,175,55,0.5)`, backdropFilter: "blur(12px)" }}>
              <Trophy size={30} style={{ color: g.gold }} />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-black mb-2 tracking-wide" style={{ color: g.textPrimary, fontFamily: "'Outfit', sans-serif" }}>
            Reward Claimed!
          </h3>
          <p className="text-sm mb-7" style={{ color: g.textSecondary }}>
            Your reward has been successfully unlocked 🎉
          </p>
          <button onClick={onClose} className="w-full py-3 rounded-2xl font-bold text-sm tracking-widest uppercase"
            style={btnGold(false)}>
            Awesome
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// SPINNER
// ─────────────────────────────────────────────────────────
const Spinner = ({ label }) => (
  <span className="flex items-center justify-center gap-1.5">
    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    {label}
  </span>
);

// ─────────────────────────────────────────────────────────
// STAT CARD — dashboard row
// ─────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent, sub }) => (
  <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 relative overflow-hidden transition-all duration-200"
    style={{ ...glassCard(), cursor: "default" }}
    onMouseEnter={e => Object.assign(e.currentTarget.style, glassCardHover)}
    onMouseLeave={e => Object.assign(e.currentTarget.style, glassCard())}>
    <GlassEdge />
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `rgba(${accent},0.12)`, border: `1px solid rgba(${accent},0.25)` }}>
      <Icon size={20} style={{ color: `rgb(${accent})` }} />
    </div>
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: g.textDim }}>{label}</p>
      <p className="text-lg sm:text-xl font-black font-mono" style={{ color: g.textPrimary, letterSpacing: "-0.02em" }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: g.textSecondary }}>{sub}</p>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString();

// State classifier
const getLegState = (leg) => {
  const rawPct = (leg.totalBusiness / (leg.required || 1)) * 100;
  if (!leg.achieved) return "progress";
  if (rawPct >= 150) return "exceeded"; // 1.5x+ over = exceeded
  return "met";
};

// ─────────────────────────────────────────────────────────
// LEG TILE — three visual states
// ─────────────────────────────────────────────────────────
const LegTile = ({ leg }) => {
  const rawPct = (leg.totalBusiness / (leg.required || 1)) * 100;
  const cappedPct = Math.min(rawPct, 100);
  const overflow = leg.totalBusiness - (leg.required || 0);
  const state = getLegState(leg);

  // ── Per-state style tokens ──
  const stateStyles = {
    progress: {
      border: g.glassBorder,
      bevelColor: "rgba(255,255,255,0.1)",
      badgeBg: "rgba(0,212,255,0.12)",
      badgeBorder: "rgba(0,212,255,0.3)",
      badgeColor: g.textAccent,
      badgeText: `${Math.round(cappedPct)}%`,
      numColor: g.textPrimary,
      barBg: g.gradAccent,
      barGlow: "0 0 8px rgba(0,212,255,0.5)",
    },
    met: {
      border: "rgba(212,175,55,0.4)",
      bevelColor: "rgba(212,175,55,0.3)",
      badgeBg: "rgba(212,175,55,0.12)",
      badgeBorder: "rgba(212,175,55,0.4)",
      badgeColor: g.textGold,
      badgeText: "✓ Goal Met",
      numColor: g.textGold,
      barBg: g.gradProgressGold,
      barGlow: "0 0 10px rgba(212,175,55,0.7)",
    },
    exceeded: {
      border: "rgba(212,175,55,0.55)",
      bevelColor: "rgba(212,175,55,0.4)",
      badgeBg: "rgba(212,175,55,0.15)",
      badgeBorder: "rgba(212,175,55,0.5)",
      badgeColor: g.textGold,
      badgeText: "✦ Exceeded",
      numColor: g.textGold,
      barBg: g.gradProgressGold,
      barGlow: "0 0 14px rgba(212,175,55,0.8)",
    },
  };

  const s = stateStyles[state];

  return (
    <div
      className="rounded-2xl relative overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        ...glassCard({ border: `1px solid ${s.border}` }),
        minHeight: 160,
        boxShadow: state !== "progress"
          ? `0 0 24px rgba(212,175,55,0.08), ${g.shadowGlass}`
          : g.shadowGlass,
      }}
    >
      <GlassEdge color={s.bevelColor} />

      {/* Gold wash overlay for achieved states */}
      {state !== "progress" && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 80% 0%, rgba(212,175,55,0.07) 0%, transparent 65%)",
        }} />
      )}

      <div className="relative z-10 p-4 flex flex-col flex-1">

        {/* ── Header row: leg label + state badge ── */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: g.textDim }}>
              Leg {leg.legId}
            </span>
            {/* <span className="ml-2 text-xs" style={{ color: g.textDim }}>
              · {leg.percentage}%   
            </span> */}
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: s.badgeBg, color: s.badgeColor, border: `1px solid ${s.badgeBorder}` }}
          >
            {s.badgeText}
          </span>
        </div>

        {/* ── Glass divider ── */}
        <div className="mb-3" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* ── Leg Business section ── */}
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: g.textDim }}>
            Leg Business
          </p>
          <p
            className="text-2xl font-black font-mono leading-none"
            style={{ color: s.numColor, letterSpacing: "-0.03em" }}
          >
            {fmt(leg.totalBusiness)}
          </p>
        </div>

        {/* ── Progress section — changes by state ── */}
        <div className="mt-auto">

          {/* STATE: in progress */}
          {state === "progress" && (
            <>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: g.textSecondary }}>Progress</span>
                <span className="text-xs font-mono font-bold" style={{ color: g.textAccent }}>
                  {Math.round(cappedPct)}%
                </span>
              </div>
              <div className="rounded-full relative" style={{ height: 5, background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{ width: `${cappedPct}%`, background: s.barBg, boxShadow: s.barGlow }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs" style={{ color: g.textDim }}>
                  Required: {fmt(leg.required)}
                </span>
                <span className="text-xs font-mono" style={{ color: g.textDim }}>
                  {fmt(leg.totalBusiness)} / {fmt(leg.required)}
                </span>
              </div>
            </>
          )}

          {/* STATE: goal met (within 2x) */}
          {state === "met" && (
            <>
              <div
                className="rounded-full"
                style={{ height: 5, background: s.barBg, boxShadow: s.barGlow }}
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-semibold" style={{ color: g.textGold }}>
                  ✓ Required {fmt(leg.required)} met
                </span>
              </div>
            </>
          )}

          {/* STATE: exceeded — full gold bar, overflow shown below */}
          {state === "exceeded" && (
            <>
              {/* Always full 100% gold bar when achieved */}
              <div className="rounded-full w-full"
                style={{ height: 5, background: s.barBg, boxShadow: s.barGlow }} />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-semibold" style={{ color: g.textGold }}>
                  ✓ Required {fmt(leg.required)} met
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: g.textAccent }}>
                  +{fmt(overflow)} overflow
                </span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// JOURNEY NODE — horizontal roadmap dot
// ─────────────────────────────────────────────────────────
const JourneyNode = ({ reward, isLast, onClick, isSelected }) => {
  const isCompleted = reward.is_completed === 1;
  const isActive = reward.is_active == 1;
  const isLocked = !reward.start_date && !isActive && !isCompleted;

  const nodeColor = isCompleted ? g.textGold
    : isActive ? g.textAccent
    : isLocked ? g.textDim : g.textSecondary;

  const nodeBg = isCompleted ? g.goldGlow
    : isActive ? g.accentBlueSoft
    : isLocked ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";

  const nodeBorder = isCompleted ? "rgba(212,175,55,0.45)"
    : isActive ? "rgba(0,212,255,0.5)"
    : isLocked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)";

  return (
    <div className="flex items-center">
      <button
        onClick={() => onClick(reward)}
        className="flex flex-col items-center gap-2 group"
        style={{ minWidth: 72 }}
      >
        {/* Node circle */}
        <div className="relative">
          {isActive && (
            <div style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              background: g.violetSoft, animation: "pulse 2s infinite",
            }} />
          )}
          <div className="w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-200"
            style={{
              background: nodeBg, border: `1.5px solid ${nodeBorder}`,
              backdropFilter: "blur(12px)",
              boxShadow: isActive ? g.shadowGoldActive : isSelected ? `0 0 0 2px ${g.violet}` : "none",
              transform: isSelected ? "scale(1.15)" : "scale(1)",
            }}>
            {isCompleted
              ? <CheckCircle size={20} style={{ color: nodeColor }} />
              : isActive
              ? <Zap size={20} style={{ color: nodeColor }} />
              : isLocked
              ? <Lock size={18} style={{ color: nodeColor }} />
              : <Trophy size={18} style={{ color: nodeColor }} />
            }
          </div>
        </div>
        {/* Label */}
        <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight max-w-16 truncate"
          style={{ color: isActive ? g.textAccent : isCompleted ? g.textGold : g.textDim }}>
          {reward.title?.split(" ").slice(0, 2).join(" ")}
        </span>
        <span className="text-xs font-mono font-bold" style={{ color: isLocked ? g.textDim : g.textGold }}>
          ${reward.reward_amount}
        </span>
      </button>

      {/* Connector line */}
      {!isLast && (
        <div className="flex-1 h-px mx-1 relative" style={{ minWidth: 20 }}>
          <div style={{
            height: "100%",
            background: isCompleted
              ? `linear-gradient(90deg, rgba(212,175,55,0.5), rgba(212,175,55,0.15))`
              : "rgba(255,255,255,0.06)",
          }} />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// ACTIVE REWARD PANEL — full-width glass hero
// ─────────────────────────────────────────────────────────
const ActiveRewardPanel = ({
  title, rewardAmount, businessData, rewardId, endDate,
  onClaimReward, handleCarryForward,
  isClaimLoading, isCarryForwardLoading, isForwarded,
}) => {
  const qualifies = businessData?.qualifies;
  const totalBusiness = businessData?.totalBusiness || 0;
  const legs = businessData?.legs || [];
  const isDisabled = isClaimLoading || isCarryForwardLoading;

  return (
    <div className="rounded-3xl p-6 relative overflow-hidden transition-all duration-300"
      style={glassCardActive}>
      <AmbientBg />
      <GlassEdge color="rgba(212,175,55,0.3)" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
              style={{ background: g.glassBgStrong, border: `1px solid rgba(212,175,55,0.4)`, backdropFilter: "blur(16px)", boxShadow: "0 0 24px rgba(212,175,55,0.15)" }}>
              <Trophy size={28} style={{ color: g.gold }} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-wide mb-1.5"
                style={{ color: g.textPrimary, fontFamily: "'Outfit', sans-serif" }}>
                {title}
              </h3>
              <div className="flex items-center gap-2">
                <Gift size={13} style={{ color: g.textGold }} />
                <span className="text-sm font-bold" style={{ color: g.textGold }}>${rewardAmount} Reward</span>
              </div>
            </div>
          </div>

                  {/* Badges */}
                  <div className="flex flex-col items-end gap-2">
                      <div className="mb-1">{endDate && <CountdownTimer endDate={endDate} />}</div>
                      <div className="flex gap-2">
                          {isForwarded && (
                              <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                                  style={{ background: g.gradAccent, color: "#fff", boxShadow: "0 4px 12px rgba(0,212,255,0.3)" }}>
                                  Forwarded
                              </div>
                          )}
                          <div className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
                              style={{ background: g.gradGold, color: "#0B0F14", boxShadow: "0 4px 12px rgba(212,175,55,0.4)" }}>
                              Active
                          </div>
                      </div>
                  </div>
        </div>

        {/* Glass divider */}
        <div className="mb-6" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)" }} />

        {/* Leg performance grid */}
        {businessData && (
          <div className="mb-6">
            {/* Section header — includes total business prominently */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: g.textViolet }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: g.textViolet }}>
                  Business Performance
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: g.textDim }}>Total</span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black"
                  style={{ background: g.accentBlueSoft, color: g.textAccent, border: `1px solid rgba(0,212,255,0.3)`, backdropFilter: "blur(8px)" }}>
                  {fmt(totalBusiness)}
                </span>
              </div>
            </div>

            {/* Leg cards — responsive 1/2/3 col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {legs.map((leg, i) => {
                const rawPct = (leg.totalBusiness / (leg.required || 1)) * 100;
                const cappedPct = Math.min(rawPct, 100);
                const legState = getLegState(leg);
                const overflow = leg.totalBusiness - (leg.required || 0);

                const borderCol = legState === "progress"
                  ? "rgba(255,255,255,0.07)"
                  : legState === "met"
                  ? "rgba(212,175,55,0.35)"
                  : "rgba(212,175,55,0.55)";

                return (
                  <div key={leg.legId} className="rounded-xl relative overflow-hidden flex flex-col"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${borderCol}`,
                      backdropFilter: "blur(12px)",
                      boxShadow: legState !== "progress"
                        ? "0 0 16px rgba(212,175,55,0.07)"
                        : "none",
                    }}>
                    <GlassEdge color={legState !== "progress" ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.08)"} />

                    {/* Subtle gold wash for achieved */}
                    {legState !== "progress" && (
                      <div style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        background: "radial-gradient(ellipse at 90% 0%, rgba(212,175,55,0.06) 0%, transparent 60%)",
                      }} />
                    )}

                    <div className="relative z-10 p-3 flex flex-col flex-1">
                      {/* Header: leg label + share + badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-black uppercase tracking-widest" style={{ color: g.textDim }}>
                            Leg {i + 1}
                          </span>
                          {/* <span className="ml-1.5 text-xs" style={{ color: g.textDim }}>
                            · {leg.percentage}% share
                          </span> */}
                        </div>
                        {legState === "progress" && (
                          <span className="text-xs font-mono font-bold" style={{ color: g.textAccent }}>
                            {Math.round(cappedPct)}%
                          </span>
                        )}
                        {legState === "met" && (
                          <span className="text-xs font-bold" style={{ color: g.textGold }}>✓ Met</span>
                        )}
                        {legState === "exceeded" && (
                          <span className="text-xs font-bold" style={{ color: g.textGold }}>✦ Exceeded</span>
                        )}
                      </div>

                      {/* Glass divider */}
                      <div className="mb-2" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

                      {/* Leg Business — labelled section */}
                      <div className="mb-2">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: g.textDim }}>
                          Leg Business
                        </p>
                        <p className="text-lg font-black font-mono leading-none"
                          style={{ color: legState === "progress" ? g.textPrimary : g.textGold, letterSpacing: "-0.02em" }}>
                          {fmt(leg.totalBusiness)}
                        </p>
                      </div>

                      {/* Progress section — state-aware */}
                      <div className="mt-auto">
                        {/* IN PROGRESS */}
                        {legState === "progress" && (
                          <>
                            <div className="rounded-full relative" style={{ height: 4, background: "rgba(255,255,255,0.05)" }}>
                              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                style={{
                                  width: `${cappedPct}%`,
                                  background: g.gradAccent,
                                  boxShadow: "0 0 6px rgba(0,212,255,0.5)",
                                }} />
                            </div>
                            <div className="flex justify-between mt-1.5">
                              <span className="text-xs" style={{ color: g.textDim }}>
                                Required: {fmt(leg.required)}
                              </span>
                              <span className="text-xs font-mono" style={{ color: g.textDim }}>
                                {fmt(leg.totalBusiness)} / {fmt(leg.required)}
                              </span>
                            </div>
                          </>
                        )}

                        {/* GOAL MET */}
                        {legState === "met" && (
                          <>
                            <div className="rounded-full"
                              style={{ height: 4, background: g.gradProgressGold, boxShadow: "0 0 8px rgba(212,175,55,0.6)" }} />
                            <p className="text-xs mt-1.5 font-semibold" style={{ color: g.textGold }}>
                              ✓ Required {fmt(leg.required)} met
                            </p>
                          </>
                        )}

                        {/* EXCEEDED — full gold bar + overflow label */}
                        {legState === "exceeded" && (
                          <>
                            <div className="rounded-full w-full"
                              style={{ height: 4, background: g.gradProgressGold, boxShadow: "0 0 8px rgba(212,175,55,0.7)" }} />
                            <div className="flex justify-between mt-1.5">
                              <span className="text-xs font-semibold" style={{ color: g.textGold }}>
                                ✓ Required {fmt(leg.required)} met
                              </span>
                              <span className="text-xs font-mono font-bold" style={{ color: g.textAccent }}>
                                +{fmt(overflow)} overflow
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full"
              style={{ background: qualifies ? g.success : g.textDim, boxShadow: qualifies ? `0 0 6px ${g.success}` : "none" }} />
            <span className="text-sm font-semibold" style={{ color: qualifies ? g.textSuccess : g.textDim }}>
              {qualifies ? "Qualifies for reward" : "Not qualified yet"}
            </span>
          </div>

          {qualifies && (
            <div className="flex gap-2.5">
              <button
                onClick={(e) => { e.preventDefault(); onClaimReward(rewardId, rewardAmount); }}
                disabled={isDisabled}
                className="px-5 h-9 rounded-xl text-xs transition-all"
                style={btnGold(isDisabled)}>
                {isClaimLoading ? <Spinner label="Claiming..." /> : "Claim Reward"}
              </button>
              <button
                onClick={() => handleCarryForward(totalBusiness, rewardId)}
                disabled={isDisabled}
                className="px-5 h-9 rounded-xl text-xs transition-all"
                style={btnViolet(isDisabled)}>
                {isCarryForwardLoading ? <Spinner label="Processing..." /> : "Carry Forward"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// SELECTED REWARD DETAIL — appears below journey track
// ─────────────────────────────────────────────────────────
const RewardDetailPanel = ({ reward }) => {
  if (!reward) return null;
  const isCompleted = reward.is_completed === 1;
  const isActive = reward.is_active == 1;
  const isLocked = !reward.start_date && !isActive && !isCompleted;

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
      style={glassCard({
        border: isActive ? `1px solid rgba(0,212,255,0.4)` : isCompleted ? `1px solid rgba(212,175,55,0.3)` : `1px solid ${g.glassBorder}`,
      })}>
      <GlassEdge color={isActive ? "rgba(0,212,255,0.25)" : isCompleted ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.08)"} />
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isCompleted ? g.goldGlow : isActive ? g.accentBlueSoft : "rgba(255,255,255,0.04)",
            border: `1px solid ${isCompleted ? "rgba(212,175,55,0.4)" : isActive ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.08)"}`,
            backdropFilter: "blur(12px)",
          }}>
          {isCompleted
            ? <CheckCircle size={20} style={{ color: g.textGold }} />
            : isActive
            ? <Zap size={20} style={{ color: g.textViolet }} />
            : isLocked
            ? <Lock size={20} style={{ color: g.textDim }} />
            : <Trophy size={20} style={{ color: g.textSecondary }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-base truncate" style={{ color: g.textPrimary }}>{reward.title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-bold" style={{ color: g.textGold }}>
              <Gift size={11} className="inline mr-1" />${reward.reward_amount}
            </span>
            {isCompleted && <span className="text-xs font-semibold" style={{ color: g.textSuccess }}>✓ Completed</span>}
            {isActive && <span className="text-xs font-semibold" style={{ color: g.textAccent }}>⚡ Active Now</span>}
            {isLocked && <span className="text-xs" style={{ color: g.textDim }}>🔒 Locked</span>}
          </div>
        </div>
        {reward.threshold && (
          <div className="text-right">
            <p className="text-xs font-bold font-mono" style={{ color: g.textGold }}>
              {reward.current_business}
              <span style={{ color: g.textDim }}>/{reward.threshold}</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: g.textDim }}>progress</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// PROP BUILDER
// ─────────────────────────────────────────────────────────
const buildCardProps = (reward, businessData, handlers, loadingStates) => ({
  rewardId: reward.id,
  level: reward.level,
  title: reward.title,
  rewardAmount: reward.reward_amount,
  isCompleted: reward.is_completed === 1,
  startDate: reward.start_date,
  endDate: reward.end_date,
  currentBusiness: reward.current_business,
  threshold: reward.threshold,
  isActive: reward.is_active == 1,
  isForwarded: reward.forworded == 1,
  businessData: reward.is_active == 1 ? businessData : null,
  onClaimReward: handlers.onClaimReward,
  handleCarryForward: handlers.handleCarryForward,
  isClaimLoading: loadingStates.claim[reward.id] || false,
  isCarryForwardLoading: loadingStates.carryForward[reward.id] || false,
});

// ─────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label, accent = g.textAccent }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <Icon size={13} style={{ color: accent }} />
    <span className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>{label}</span>
    <div className="flex-1" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
  </div>
);

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
const UserRewardsComponent = ({
  rewards, businessData, user,
  showModal, claimedAmount, onCloseModal,
}) => {
  const dispatch = useDispatch();
  const userId = user?.id;
  const [loadingStates, setLoadingStates] = useState({ claim: {}, carryForward: {} });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalAmount, setModalAmount] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);

  const refreshData = () => {
    dispatch(fetchUserRewards(userId));
    dispatch(fetchUserBusiness(userId));
  };

  const handleClaimReward = async (rewardId, amount) => {
    setLoadingStates(p => ({ ...p, claim: { ...p.claim, [rewardId]: true } }));
    try {
      const res = await dispatch(claimReward(userId));
      if (res.type === "rewards/claimReward/fulfilled") {
        setModalAmount(amount);
        setShowSuccessModal(true);
        setTimeout(refreshData, 1000);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingStates(p => ({ ...p, claim: { ...p.claim, [rewardId]: false } })); }
  };

  const handleCarryForward = async (business, rewardId) => {
    setLoadingStates(p => ({ ...p, carryForward: { ...p.carryForward, [rewardId]: true } }));
    try {
      const res = await dispatch(updateRewardStatus({ id: userId, data: { business } }));
      if (res.type === "rewards/updateRewardStatus/fulfilled") {
        setShowSuccessModal(true);
        setTimeout(refreshData, 500);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingStates(p => ({ ...p, carryForward: { ...p.carryForward, [rewardId]: false } })); }
  };

  const handleCloseSuccessModal = () => { setShowSuccessModal(false); setModalAmount(0); refreshData(); };

  if (!rewards) return null;

  const handlers = { onClaimReward: handleClaimReward, handleCarryForward };
  const activeRewards = rewards.filter(r => r.is_active == 1);
  const completedRewards = rewards.filter(r => r.is_completed === 1);
  const totalRewards = rewards.length;
  const completedCount = completedRewards.length;

  return (
    <div className="max-w-7xl mx-auto mb-6 rounded-2xl sm:rounded-3xl overflow-hidden relative"
      style={{ background: g.pageBg, border: `1px solid ${g.glassBorder}`, boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.05)" }}>
      <AmbientBg />

      {/* ── Page header ── */}
      <div className="relative z-10 px-7 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest"
              style={{ background: g.accentBlueSoft, color: g.textAccent, border: `1px solid rgba(0,212,255,0.3)`, backdropFilter: "blur(8px)" }}>
              <Sparkles size={10} />
              Starter Plan
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1"
              style={{ color: g.textPrimary, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.02em" }}>
              Rewards
            </h1>
            <p className="text-sm" style={{ color: g.textSecondary }}>
              Complete milestones to unlock exclusive rewards
            </p>
          </div>
          <div className="relative">
            <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: g.goldGlowStrong, filter: "blur(16px)", pointerEvents: "none" }} />
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center relative"
              style={{ background: g.glassBgStrong, border: `1px solid rgba(212,175,55,0.45)`, backdropFilter: "blur(16px)" }}>
              <Trophy size={24} className="sm:w-7 sm:h-7" style={{ color: g.gold }} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-7">

        {/* ── Dashboard stat row ── */}
        {businessData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={TrendingUp} label="Total Business"
              value={fmt(businessData.totalBusiness || businessData.legs?.reduce((s, l) => s + (l.totalBusiness || 0), 0) || 0)}
              accent="0,212,255" />
            <StatCard icon={Trophy} label="Completed" value={`${completedCount}/${totalRewards}`} accent="212,175,55" sub="rewards" />
            <StatCard icon={Target} label="Active" value={activeRewards.length} accent="0,212,255" sub="challenges" />
            <StatCard icon={Flame} label="Legs Achieved"
              value={businessData.legs?.filter(l => l.achieved).length || 0}
              accent="0,200,83" sub={`of ${businessData.legs?.length || 0}`} />
          </div>
        )}

        {/* ── Leg tiles ── */}
        {businessData?.legs?.length > 0 && (
          <div>
            <SectionHeader icon={TrendingUp} label="Leg Performance" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {businessData.legs.map(leg => <LegTile key={leg.legId} leg={leg} />)}
            </div>
          </div>
        )}

        {/* ── Journey roadmap — horizontal scrollable track ── */}
        {rewards.length > 0 && (
          <div>
            <SectionHeader icon={Star} label="Reward Journey" accent={g.textGold} />
            <div className="rounded-2xl p-5 relative overflow-hidden"
              style={glassCard()}>
              <GlassEdge />
              {/* Scrollable track */}
              <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                <div className="flex items-center" style={{ minWidth: "max-content", gap: 0 }}>
                  {rewards.map((reward, i) => (
                    <JourneyNode
                      key={reward.id}
                      reward={reward}
                      isLast={i === rewards.length - 1}
                      onClick={setSelectedReward}
                      isSelected={selectedReward?.id === reward.id}
                    />
                  ))}
                </div>
              </div>
              {/* Overall progress bar */}
              <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: g.textDim }}>Overall Progress</span>
                  <span className="text-xs font-mono font-bold" style={{ color: g.textGold }}>
                    {completedCount} / {totalRewards} unlocked
                  </span>
                </div>
                <div className="rounded-full relative" style={{ height: 6, background: "rgba(255,255,255,0.05)" }}>
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                    style={{
                      width: `${totalRewards > 0 ? (completedCount / totalRewards) * 100 : 0}%`,
                      background: g.gradProgressGold,
                      boxShadow: "0 0 12px rgba(212,175,55,0.5)",
                    }} />
                </div>
              </div>
            </div>

            {/* Selected reward detail */}
            {selectedReward && (
              <div className="mt-3">
                <RewardDetailPanel reward={selectedReward} />
              </div>
            )}
          </div>
        )}

        {/* ── Active reward hero panels ── */}
        {activeRewards.length > 0 && (
          <div>
            <SectionHeader icon={Zap} label="Active Challenges" accent={g.textAccent} />
            <div className="space-y-4">
              {activeRewards.map(reward => (
                <ActiveRewardPanel
                  key={reward.id}
                  {...buildCardProps(reward, businessData, handlers, loadingStates)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
          style={glassCard({ border: `1px solid rgba(212,175,55,0.18)` })}>
          <GlassEdge color="rgba(212,175,55,0.15)" />
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: g.goldGlow, border: `1px solid rgba(212,175,55,0.35)`, backdropFilter: "blur(12px)" }}>
            <Shield size={18} style={{ color: g.gold }} />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold" style={{ color: g.textPrimary }}>Complete Your Journey</p>
            <p className="text-xs mt-0.5" style={{ color: g.textSecondary }}>
              Finish all levels to unlock the full Starter Plan reward package
            </p>
          </div>
        </div>

      </div>

      {/* ── Modals ── */}
      {showSuccessModal && (
        <SuccessModal isOpen={showSuccessModal} onClose={handleCloseSuccessModal} rewardAmount={modalAmount} />
      )}
      <SuccessModal isOpen={showModal} onClose={onCloseModal} rewardAmount={claimedAmount} />

      {/* Pulse keyframe */}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.08)} }`}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────
export default function Rewards() {
  const dispatch = useDispatch();
  const { auth } = useSelector(s => s.auth);
  const { rewards, loading, successMessage, totalBusiness } = useSelector(s => s.rewards);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);

  useEffect(() => {
    if (auth) {
      dispatch(fetchUserRewards(auth?.id));
      dispatch(fetchUserBusiness(auth?.id));
    }
  }, [dispatch, auth]);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (auth) {
      dispatch(fetchUserRewards(auth?.id));
      dispatch(fetchUserBusiness(auth?.id));
    }
  };

  useEffect(() => {
    if (successMessage) setShowSuccessModal(true);
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: g.gold }} />
      </div>
    );
  }

  return (
    <UserRewardsComponent
      rewards={rewards}
      businessData={totalBusiness}
      user={auth}
      showModal={showSuccessModal}
      claimedAmount={claimedAmount}
      onCloseModal={handleCloseModal}
    />
  );
}


// import React, { useState, useEffect } from "react";
// import {
//   Trophy,
//   Lock,
//   CheckCircle,
//   Clock,
//   Gift,
//   Star,
//   Award,
//   ChevronRight,
// } from "lucide-react";
// import {
//   fetchUserRewards,
//   fetchUserBusiness,
//   claimReward,
//   updateRewardStatus,
// } from "../../redux/rewardSlice";
// import { useSelector, useDispatch } from "react-redux";

// const CountdownTimer = ({ endDate }) => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const difference = new Date(endDate) - new Date();

//       if (difference > 0) {
//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((difference / 1000 / 60) % 60);
//         const seconds = Math.floor((difference / 1000) % 60);

//         return { days, hours, minutes, seconds };
//       }

//       return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//     };

//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [endDate]);

//   return (
//     <div className="flex items-center space-x-1 text-sm font-medium text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">
//       <Clock className="w-4 h-4 mr-1" />
//       <span>{timeLeft.days}d </span>
//       <span>{timeLeft.hours}h </span>
//       <span>{timeLeft.minutes}m </span>
//       <span>{timeLeft.seconds}s</span>
//     </div>
//   );
// };

// const SuccessModal = ({ isOpen, onClose, rewardAmount }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all">
//         <div className="flex items-center justify-between border-b border-gray-700 pb-3">
//           <div className="flex items-center gap-2">
//             <div className="bg-blue-900/30 p-2 rounded-full">
//               <Trophy className="w-6 h-6 text-blue-400" />
//             </div>
//             <h3 className="text-lg font-bold text-white">Congratulations!</h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-200"
//           >
//             ✖
//           </button>
//         </div>
//         <div className="mt-4">
//           <p className="text-gray-300">
//             You have successfully claimed your reward 🎉
//             {/* <span className="font-bold text-green-400">${rewardAmount}</span>! */}
//           </p>
//         </div>
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Great!
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const LegProgressBar = ({ leg, index }) => {
//   const percentage = (leg.totalBusiness / leg.required) * 100;
//   const cappedPercentage = Math.min(percentage, 100);

//   return (
//     <div className="mb-2">
//       <div className="flex justify-between text-xs font-medium mb-1">
//         <span className="text-gray-300">
//           Leg {index + 1} ({leg.percentage}%)
//         </span>
//         <span className={leg.achieved ? "text-blue-400" : "text-gray-400"}>
//           {leg.totalBusiness}/{leg.required}
//         </span>
//       </div>
//       <div className="w-full bg-gray-700 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full ${
//             leg.achieved ? "bg-blue-500" : "bg-blue-400"
//           }`}
//           style={{ width: `${cappedPercentage}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// const RewardLevelCard = ({
//   level,
//   rewardAmount,
//   isCompleted,
//   startDate,
//   endDate,
//   currentBusiness,
//   threshold,
//   isActive,
//   isForwarded,
//   title,
//   businessData,
//   onClaimReward,
//   handleCarryForward,
//   rewardId,
//   isClaimLoading,
//   isCarryForwardLoading,
// }) => {
//   const qualifies = businessData?.qualifies;
//   const totalBusiness = businessData?.totalBusiness || 0;
//   const legs = businessData?.legs || [];

//   return (
//     <div
//       className={`relative p-5 border rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 bg-[#1a1a1a] ${
//         isCompleted
//           ? "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
//           : startDate
//           ? "border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
//           : "border-gray-700"
//       } ${
//         isActive ? "border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]" : ""
//       } hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:scale-[1.01]`}
//     >
//       {!startDate && (
//         <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-xl z-10"></div>
//       )}
//       {!startDate && (
//         <div className="absolute inset-0 flex items-center justify-center z-20">
//           <div className="w-20 h-20 rounded-full bg-blue-900/40 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] ">
//             <Lock className="w-10 h-10 text-blue-400" />
//           </div>
//         </div>
//       )}

//       {isActive && (
//         <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.4)] z-30">
//           ACTIVE
//         </div>
//       )}
//       {isForwarded && (
//         <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.4)] z-30">
//           Forwarded
//         </div>
//       )}

//       <div className=" sm:space-x-5 space-y-5">
//         <div className="flex justify-start gap-4 items-center relative">
//           <div
//             className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.05)] ${
//               isCompleted
//                 ? "bg-blue-900/40 text-blue-400"
//                 : startDate
//                 ? "bg-blue-900/40 text-blue-400"
//                 : "bg-gray-800 text-gray-500"
//             }`}
//           >
//             {isCompleted ? (
//               <CheckCircle className="w-8 h-8" />
//             ) : startDate ? (
//               <Trophy className="w-8 h-8" />
//             ) : (
//               <Lock className="w-8 h-8" />
//             )}
//           </div>
//           <div>
//            <div className="flex justify-between items-center ">
//             <h3 className="text-lg font-bold text-white">{title}</h3>
//             {isCompleted && <Trophy className="text-blue-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
//           </div>

//           <div className="flex items-center ">
//             <Gift className="w-4 h-4 text-blue-400 mr-1" />
//             <p className="text-sm font-semibold text-blue-400">
//               Reward: ${rewardAmount}
//             </p>
//           </div>
//           </div>
//         </div>

//         <div className="">
         

//           {isActive && businessData && (
//             <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.03)]">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center">
//                   <Award className="w-5 h-5 text-blue-400 mr-2" />
//                   <h4 className="font-semibold text-blue-400">
//                     Business Performance
//                   </h4>
//                 </div>
//                 <div className="text-sm font-medium text-gray-300">
//                   {totalBusiness} total
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 {legs.map((leg, index) => (
//                   <LegProgressBar key={leg.legId} leg={leg} index={index} />
//                 ))}
//               </div>

//               <div className="mt-4 sm:flex justify-between items-center">
//                 <div
//                   className={`text-sm font-medium mb-4 ${
//                     qualifies ? "text-blue-400" : "text-blue-300"
//                   }`}
//                 >
//                   {qualifies ? "Qualifies for reward" : "Not qualified yet"}
//                 </div>

//                 {qualifies && (
//                   <div className="sm:flex justify-center items-center gap-4 sm:space-y-0 space-y-4">
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         onClaimReward(rewardId, rewardAmount);
//                       }}
//                       disabled={isClaimLoading || isCarryForwardLoading}
//                       className={`overflow-hidden text-sm relative w-full sm:w-32 p-2 h-10 rounded-md font-semibold cursor-pointer z-10 group transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
//                         isClaimLoading || isCarryForwardLoading
//                           ? "bg-gray-700 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)]"
//                       }`}
//                     >
//                       {isClaimLoading ? (
//                         <div className="flex items-center justify-center">
//                           <svg
//                             className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Claiming...
//                         </div>
//                       ) : (
//                         "Claim Reward"
//                       )}
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleCarryForward(totalBusiness, rewardId)
//                       }
//                       disabled={isClaimLoading || isCarryForwardLoading}
//                       className={`overflow-hidden w-full sm:w-32 p-2 h-10 rounded-md text-sm font-semibold cursor-pointer relative z-10 group transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
//                         isClaimLoading || isCarryForwardLoading
//                           ? "bg-gray-700 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)]"
//                       }`}
//                     >
//                       {isCarryForwardLoading
//                         ? "Processing..."
//                         : "Carry Forward"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {startDate && (
//             <div className="flex flex-wrap gap-2 items-center mt-3">
//               {threshold && (
//                 <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]">
//                   <Star className="w-4 h-4 text-blue-400 mr-1" />
//                   <span className="text-sm font-medium text-gray-300">
//                     Goal: {currentBusiness} / {threshold}
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const UserRewardsComponent = ({
//   rewards,
//   businessData,
//   user,
//   showModal,
//   claimedAmount,
//   onCloseModal,
// }) => {
//   const dispatch = useDispatch();
//   const userId = user?.id;
//   const [loadingStates, setLoadingStates] = useState({
//     claim: {},
//     carryForward: {},
//   });
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalAmount, setModalAmount] = useState(0);

//   const handleClaimReward = async (rewardId, amount) => {
//     setLoadingStates((prev) => ({
//       ...prev,
//       claim: { ...prev.claim, [rewardId]: true },
//     }));

//     try {
//       const result = await dispatch(claimReward(userId));

//       if (result.type === "rewards/claimReward/fulfilled") {
//         setModalAmount(amount);
//         setModalMessage("Reward claimed successfully!");
//         setShowSuccessModal(true);

//         setTimeout(() => {
//           dispatch(fetchUserRewards(userId));
//           dispatch(fetchUserBusiness(userId));
//         }, 1000);
//       } else {
//         console.error("Failed to claim reward:", result.error);
//       }
//     } catch (error) {
//       console.error("Error claiming reward:", error);
//     } finally {
//       setLoadingStates((prev) => ({
//         ...prev,
//         claim: { ...prev.claim, [rewardId]: false },
//       }));
//     }
//   };

//   const handleCarryForward = async (business, rewardId) => {
//     setLoadingStates((prev) => ({
//       ...prev,
//       carryForward: { ...prev.carryForward, [rewardId]: true },
//     }));

//     try {
//       const result = await dispatch(
//         updateRewardStatus({ id: userId, data: { business } })
//       );

//       if (result.type === "rewards/updateRewardStatus/fulfilled") {
//         setModalMessage("Business carried forward successfully!");
//         setShowSuccessModal(true);

//         setTimeout(() => {
//           dispatch(fetchUserRewards(userId));
//           dispatch(fetchUserBusiness(userId));
//         }, 500);
//       } else {
//         console.error("Failed to carry forward:", result.error);
//       }
//     } catch (error) {
//       console.error("Error carrying forward:", error);
//     } finally {
//       setLoadingStates((prev) => ({
//         ...prev,
//         carryForward: { ...prev.carryForward, [rewardId]: false },
//       }));
//     }
//   };

//   const handleCloseSuccessModal = () => {
//     setShowSuccessModal(false);
//     setModalMessage("");
//     setModalAmount(0);

//     dispatch(fetchUserRewards(userId));
//     dispatch(fetchUserBusiness(userId));
//   };

//   if (!rewards) {
//     return null;
//   }

//   const shadowVariants = [
//     "shadow-[inset_6px_6px_12px_rgba(59,130,246,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)]",
//     "shadow-[inset_6px_6px_12px_rgba(59,130,246,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)]",
//     "shadow-[inset_6px_6px_12px_rgba(59,130,246,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)]",
//     "shadow-[inset_6px_6px_12px_rgba(59,130,246,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.05)]",
//   ];

//   return (
//     <div className="max-w-7xl mx-auto mb-4 bg-[#1a1a1a] rounded-md border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
//       <div className="flex items-center justify-between border-b p-5 border-gray-800">
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold text-white">
//             Starter Plan Rewards
//           </h2>
//           <p className="text-gray-400">Complete challenges to earn rewards</p>
//         </div>
//         <div className="bg-blue-900/30 p-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]">
//           <Trophy className="w-10 h-10 text-blue-400" />
//         </div>
//       </div>

//       <div className="p-5">
//         {businessData && (
//           <div className="mb-6 p-4 bg-[#111] rounded-xl border border-gray-800 shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="font-bold text-white">Your Business Summary</h3>
//               <span className="text-sm font-medium bg-gray-800 text-gray-300 px-3 py-1 rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]">
//                 Total: {businessData.totalBusiness}
//               </span>
//             </div>
//             <div className="grid lg:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
//               {businessData.legs.map((leg, idx) => (
//                 <div
//                   key={leg.legId}
//                   className={`bg-[#1e1e1e] p-4 rounded-lg border border-gray-700  overflow-hidden ${
//                     shadowVariants[idx % shadowVariants.length]
//                   }`}
//                 >
//                   <div className="text-xs text-gray-400 mb-1">
//                     Leg {leg.legId}
//                   </div>
//                   <div className="font-medium text-white">
//                     {leg.totalBusiness}
//                   </div>
//                   <div className="mt-1 text-xs">
//                     <span
//                       className={`font-medium ${
//                         leg.achieved ? "text-blue-400" : "text-blue-300"
//                       }`}
//                     >
//                       {leg.percentage}%
//                     </span>
//                     <span className="text-gray-500"> required</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="space-y-5 mb-6">
//           {rewards
//             ?.filter((reward) => reward.is_active == 1)
//             .map((reward) => (
//               <RewardLevelCard
//                 key={reward.id}
//                 rewardId={reward.id}
//                 level={reward.level}
//                 title={reward.title}
//                 rewardAmount={reward.reward_amount}
//                 isCompleted={reward.is_completed === 1}
//                 startDate={reward.start_date}
//                 endDate={reward.end_date}
//                 currentBusiness={reward.current_business}
//                 threshold={reward.threshold}
//                 isActive={reward.is_active == 1}
//                 isForwarded={reward.forworded == 1}
//                 businessData={reward.is_active == 1 ? businessData : null}
//                 onClaimReward={handleClaimReward}
//                 handleCarryForward={handleCarryForward}
//                 isClaimLoading={loadingStates.claim[reward.id] || false}
//                 isCarryForwardLoading={
//                   loadingStates.carryForward[reward.id] || false
//                 }
//               />
//             ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           {rewards
//             ?.filter(
//               (reward) => reward.is_active != 1 && reward.is_completed !== 1
//             )
//             .map((reward) => (
//               <RewardLevelCard
//                 key={reward.id}
//                 rewardId={reward.id}
//                 level={reward.level}
//                 title={reward.title}
//                 rewardAmount={reward.reward_amount}
//                 isCompleted={reward.is_completed === 1}
//                 startDate={reward.start_date}
//                 endDate={reward.end_date}
//                 currentBusiness={reward.current_business}
//                 threshold={reward.threshold}
//                 isActive={reward.is_active == 1}
//                 isForwarded={reward.forworded == 1}
//                 businessData={reward.is_active == 1 ? businessData : null}
//                 onClaimReward={handleClaimReward}
//                 handleCarryForward={handleCarryForward}
//                 isClaimLoading={loadingStates.claim[reward.id] || false}
//                 isCarryForwardLoading={
//                   loadingStates.carryForward[reward.id] || false
//                 }
//               />
//             ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           {rewards
//             ?.filter((reward) => reward.is_completed === 1)
//             .map((reward) => (
//               <RewardLevelCard
//                 key={reward.id}
//                 rewardId={reward.id}
//                 level={reward.level}
//                 title={reward.title}
//                 rewardAmount={reward.reward_amount}
//                 isCompleted={reward.is_completed === 1}
//                 startDate={reward.start_date}
//                 endDate={reward.end_date}
//                 currentBusiness={reward.current_business}
//                 threshold={reward.threshold}
//                 isActive={reward.is_active == 1}
//                 isForwarded={reward.forworded == 1}
//                 businessData={reward.is_active == 1 ? businessData : null}
//                 onClaimReward={handleClaimReward}
//                 handleCarryForward={handleCarryForward}
//                 isClaimLoading={loadingStates.claim[reward.id] || false}
//                 isCarryForwardLoading={
//                   loadingStates.carryForward[reward.id] || false
//                 }
//               />
//             ))}
//         </div>

//         <div className="mt-8 p-5 bg-[#111] border border-gray-800 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
//           <div className="flex items-start">
//             <div className="bg-gray-800 p-2 rounded-full mr-3 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)]">
//               <Gift className="w-6 h-6 text-gray-300" />
//             </div>
//             <div>
//               <h3 className="font-bold text-white mb-1">
//                 Complete Your Journey
//               </h3>
//               <p className="text-sm text-gray-400">
//                 🏆 Finish all levels to unlock the full Starter Plan reward
//                 package!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showSuccessModal && (
//         <SuccessModal
//           isOpen={showSuccessModal}
//           onClose={handleCloseSuccessModal}
//           rewardAmount={modalAmount}
//           message={modalMessage}
//         />
//       )}

//       <SuccessModal
//         isOpen={showModal}
//         onClose={onCloseModal}
//         rewardAmount={claimedAmount}
//       />
//     </div>
//   );
// };

// export default function Rewards() {
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { rewards, loading, successMessage, totalBusiness } = useSelector(
//     (state) => state.rewards
//   );
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [claimedAmount, setClaimedAmount] = useState(0);

//   useEffect(() => {
//     if (auth) {
//       dispatch(fetchUserRewards(auth?.id));
//       dispatch(fetchUserBusiness(auth?.id));
//     }
//   }, [dispatch, auth]);

//   const handleCloseModal = () => {
//     setShowSuccessModal(false);

//     if (auth) {
//       dispatch(fetchUserRewards(auth?.id));
//       dispatch(fetchUserBusiness(auth?.id));
//     }
//   };

//   useEffect(() => {
//     if (successMessage) {
//       setShowSuccessModal(true);
//     }
//   }, [successMessage]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <UserRewardsComponent
//       rewards={rewards}
//       businessData={totalBusiness}
//       user={auth}
//       showModal={showSuccessModal}
//       claimedAmount={claimedAmount}
//       onCloseModal={handleCloseModal}
//     />
//   );
// }
