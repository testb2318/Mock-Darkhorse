import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReferralTree } from "../../redux/referralSlice";
import { selectUser } from "../../redux/authSlice";
import Loader from "../../components/common/Loader";

export default function UserDirectMember() {
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useSelector(selectUser);

  const dispatch = useDispatch();
  const { loading, referralTree } = useSelector((state) => state.referralTree);
  const [allRefferal, setAllRefferal] = useState([]);

  useEffect(() => {
    if (auth?.refferal_code) {
      dispatch(getReferralTree(auth?.refferal_code));
    }
  }, [dispatch, auth?.refferal_code]);

  useEffect(() => {
    setAllRefferal(referralTree || []);
  }, [referralTree]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val === "") {
      setAllRefferal(referralTree);
    } else {
      const filtered = referralTree?.filter((p) =>
        p.username?.toLowerCase().includes(val.toLowerCase())
      );
      setAllRefferal(filtered);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        :root {
          --gold: #e8c832;
          --gold-dim: rgba(232,200,50,0.18);
          --gold-faint: rgba(232,200,50,0.07);
          --teal: #4dd9d9;
          --teal-dim: rgba(77,217,217,0.18);
          --teal-faint: rgba(77,217,217,0.06);
          --green: #1ee899;
          --red: #e05c5c;
          --bg-deep: #050a10;
          --bg-card: rgba(8,18,32,0.98);
          --text-primary: #dce8f5;
          --text-muted: #3d5f7a;
          --text-dim: #1e3348;
          --border-gold: rgba(232,200,50,0.14);
          --border-teal: rgba(77,217,217,0.14);
        }

        .udm-wrap {
          font-family: 'DM Sans', sans-serif;
          animation: udmPageIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes udmPageIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Scanline overlay */
        .udm-scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.09) 3px,
            rgba(0,0,0,0.09) 4px
          );
          pointer-events: none;
          border-radius: inherit;
          z-index: 0;
        }

        /* Glowing orbs behind header */
        .udm-orb-gold {
          position: absolute;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,200,50,0.10) 0%, transparent 70%);
          top: -80px; left: -60px;
          pointer-events: none;
          filter: blur(2px);
        }
        .udm-orb-teal {
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(77,217,217,0.09) 0%, transparent 70%);
          top: -50px; right: -40px;
          pointer-events: none;
          filter: blur(2px);
        }

        /* Header brand font */
        .udm-title {
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--gold);
          text-shadow:
            0 0 30px rgba(232,200,50,0.35),
            0 0 60px rgba(232,200,50,0.10);
        }

        /* Stat badges */
        .udm-stat {
          position: relative;
          padding: 10px 20px;
          border-radius: 14px;
          background: rgba(8,22,40,0.70);
          border: 1px solid var(--border-gold);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          overflow: hidden;
        }
        .udm-stat::after {
          content: '';
          position: absolute;
          bottom: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.4;
        }
        .udm-stat-num {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--gold);
          line-height: 1;
        }
        .udm-stat-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* Search */
        .udm-search-wrap {
          position: relative;
        }
        .udm-search {
          width: 100%;
          height: 42px;
          padding: 0 44px 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text-primary);
          background: rgba(4,10,20,0.85);
          border: 1px solid var(--border-gold);
          border-radius: 12px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .udm-search::placeholder { color: var(--text-dim); }
        .udm-search:focus {
          border-color: rgba(77,217,217,0.40);
          box-shadow: 0 0 0 3px rgba(77,217,217,0.08), 0 0 20px rgba(77,217,217,0.10);
        }
        .udm-search-icon {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text-muted);
        }

        /* Divider bar */
        .udm-divbar {
          height: 2px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--teal) 50%, transparent 100%);
          flex-shrink: 0;
        }

        /* Table */
        .udm-table { width: 100%; border-collapse: separate; border-spacing: 0; }

        .udm-th {
          padding: 14px 20px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(6,16,30,0.85);
          border-bottom: 1px solid var(--border-gold);
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 2;
        }
        .udm-th:first-child { border-radius: 0; }

        /* Row */
        .udm-tr {
          border-bottom: 1px solid rgba(255,255,255,0.030);
          transition: background 0.22s;
          animation: udmRowIn 0.35s ease both;
        }
        @keyframes udmRowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .udm-tr:hover { background: rgba(18,140,155,0.07) !important; }
        .udm-tr:hover .udm-sno { color: var(--teal) !important; }
        .udm-tr:hover .udm-username {
          color: #fff !important;
          text-shadow: 0 0 16px rgba(77,217,217,0.30);
        }

        .udm-td { padding: 14px 20px; vertical-align: middle; }

        /* S.No */
        .udm-sno {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-dim);
          transition: color 0.2s;
          min-width: 28px;
          display: inline-block;
          text-align: center;
        }

        /* Avatar + Username combo */
        .udm-user-cell { display: flex; align-items: center; gap: 10px; }
        .udm-avatar {
          width: 32px; height: 32px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(12,70,90,0.80), rgba(6,30,50,0.80));
          border: 1px solid rgba(77,217,217,0.22);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: var(--teal);
          text-transform: uppercase;
          box-shadow: 0 0 10px rgba(77,217,217,0.10);
        }
        .udm-username {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: 0.02em;
          transition: color 0.2s, text-shadow 0.2s;
        }

        /* Status badge */
        .udm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: capitalize;
        }
        .udm-badge-active {
          background: rgba(18,195,120,0.10);
          border: 1px solid rgba(18,195,120,0.28);
          color: #28d98e;
        }
        .udm-badge-inactive {
          background: rgba(220,60,60,0.09);
          border: 1px solid rgba(220,60,60,0.22);
          color: #e05c5c;
        }
        .udm-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .udm-dot-active {
          background: var(--green);
          box-shadow: 0 0 6px rgba(30,232,153,0.80);
          animation: udmPulse 1.8s infinite;
        }
        .udm-dot-inactive { background: var(--red); }
        @keyframes udmPulse {
          0%, 100% { box-shadow: 0 0 6px rgba(30,232,153,0.80); }
          50%       { box-shadow: 0 0 14px rgba(30,232,153,0.20); }
        }

        /* Email */
        .udm-email {
          font-size: 12px;
          color: white;
          font-style: italic;
          letter-spacing: 0.01em;
        }

        /* Plan chip */
        .udm-plan {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: var(--gold);
          text-shadow: 0 0 14px rgba(232,200,30,0.35);
          letter-spacing: 0.04em;
        }

        /* Date */
        .udm-date {
          font-size: 13px;
          color: white;
          letter-spacing: 0.04em;
        }

        /* Empty state */
        .udm-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 80px 20px;
        }
        .udm-empty-icon {
          width: 72px; height: 72px;
          border-radius: 20px;
          background: rgba(8,22,38,0.80);
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          box-shadow: 0 0 30px rgba(232,200,50,0.04);
        }
        .udm-empty-text {
          font-size: 13px;
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        .udm-empty-sub {
          font-size: 11px;
          color: var(--text-dim);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: -8px;
        }

        /* Corner accent */
        .udm-corner-tl {
          position: absolute;
          top: 0; left: 0;
          width: 28px; height: 28px;
          border-top: 2px solid var(--teal);
          border-left: 2px solid var(--teal);
          border-radius: 14px 0 0 0;
          opacity: 0.40;
        }
        .udm-corner-br {
          position: absolute;
          bottom: 0; right: 0;
          width: 28px; height: 28px;
          border-bottom: 2px solid var(--gold);
          border-right: 2px solid var(--gold);
          border-radius: 0 0 14px 0;
          opacity: 0.35;
        }

        /* Count pill */
        .udm-count-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 50px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px;
          font-weight: 700;
          background: var(--gold-faint);
          border: 1px solid var(--gold-dim);
          color: var(--gold);
          letter-spacing: 0.08em;
        }
      `}</style>

      <div
        className="udm-wrap min-h-screen p-4 m-2 rounded-3xl bg-transparent"
      >
        {/* ── Main Card ── */}
        <div className="glass-card animated-border-gold rounded-3xl p-0.5">
          <div className="bg-black/40 rounded-[1.8rem] overflow-hidden relative">
          <div className="udm-corner-tl" />
          <div className="udm-corner-br" />

          {/* ── Header ── */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "28px 28px 24px",
              background:
                "linear-gradient(118deg, rgba(10,60,82,0.38) 0%, rgba(6,14,26,0.55) 55%, rgba(120,88,8,0.10) 100%)",
              borderBottom: "1px solid var(--border-gold)",
            }}
          >
            <div className="udm-orb-gold" />
            <div className="udm-orb-teal" />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Left — Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Icon box */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background:
                      "linear-gradient(135deg, rgba(13,106,124,0.90) 0%, rgba(6,42,60,0.95) 100%)",
                    border: "1.5px solid rgba(232,185,28,0.35)",
                    boxShadow:
                      "0 0 24px rgba(18,160,175,0.22), inset 0 1px 0 rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="7" r="3" stroke="#4dd9d9" strokeWidth="1.8" />
                    <circle cx="17" cy="9" r="2.2" stroke="#e8c832" strokeWidth="1.6" />
                    <path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#4dd9d9" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M17 19c0-2.21-1.4-4.1-3.4-4.82" stroke="#e8c832" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h3 className="udm-title" style={{ fontSize: 20, margin: 0 }}>
                      Member Directory
                    </h3>
                    <span className="udm-count-pill">
                      {allRefferal?.length || 0} Members
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 11,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Network Overview · Direct Referrals
                  </p>
                </div>
              </div>

              {/* Right — Stats + Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {/* Stat: Active */}
                <div className="udm-stat">
                  <span className="udm-stat-num" style={{ color: "#1ee899" }}>
                    {allRefferal?.filter((m) => m?.is_active === "active").length || 0}
                  </span>
                  <span className="udm-stat-label">Active</span>
                </div>

                {/* Stat: Total */}
                <div className="udm-stat">
                  <span className="udm-stat-num">{allRefferal?.length || 0}</span>
                  <span className="udm-stat-label">Total</span>
                </div>

                {/* Search */}
                <div className="udm-search-wrap" style={{ width: 240 }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search username…"
                    className="udm-search"
                  />
                  <span className="udm-search-icon">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gold–Teal accent bar */}
          <div className="udm-divbar" />

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table className="udm-table" style={{ minWidth: 660 }}>
              <thead>
                <tr>
                  {["#", "Member", "Status", "E-Mail", "Active Plan", "Joined"].map((h) => (
                    <th key={h} className="udm-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allRefferal?.length > 0 ? (
                  allRefferal.map((item, index) => {
                    const isActive = item?.is_active === "active";
                    const initial = item?.username?.[0]?.toUpperCase() || "?";
                    const date = item?.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A";

                    return (
                      <tr
                        key={index}
                        className="udm-tr"
                        style={{ animationDelay: `${index * 45}ms` }}
                      >
                        {/* S.No */}
                        <td className="udm-td">
                          <span className="udm-sno">{index + 1}</span>
                        </td>

                        {/* Member */}
                        <td className="udm-td">
                          <div className="udm-user-cell">
                            <div className="udm-avatar">{initial}</div>
                            <span className="udm-username">{item?.username}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="udm-td">
                          <span className={`udm-badge ${isActive ? "udm-badge-active" : "udm-badge-inactive"}`}>
                            <span className={`udm-dot ${isActive ? "udm-dot-active" : "udm-dot-inactive"}`} />
                            {item?.is_active}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="udm-td">
                          <span className="udm-email">{item?.email}</span>
                        </td>

                        {/* Plan */}
                        <td className="udm-td">
                          <span className="udm-plan">${item?.active_plan}</span>
                        </td>

                        {/* Date */}
                        <td className="udm-td">
                          <span className="udm-date">{date}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="udm-empty">
                        <div className="udm-empty-icon">
                          <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <p className="udm-empty-text">No direct members found yet.</p>
                        <p className="udm-empty-sub">Your referral network will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom gradient fade */}
          {allRefferal?.length > 8 && (
            <div
              style={{
                height: 2,
                background: "linear-gradient(90deg, transparent, var(--teal), var(--gold), transparent)",
                opacity: 0.18,
              }}
            />
          )}
          </div>
        </div>
      </div>
    </>
  );
}
