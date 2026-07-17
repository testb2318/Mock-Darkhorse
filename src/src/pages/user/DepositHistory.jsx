import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import ErrorAlert from "../../components/common/ErrorAlert";
import SuccessAlert from "../../components/common/SuccessAlert";
import {
  getAllDepositeByid,
  clearErrors,
  clearMessage,
} from "../../redux/depositeSlice";
import { selectUser } from "../../redux/authSlice";
import Loader from "../../components/common/Loader";
import { getQrLink } from "../../redux/qrSlice";

const DepositHistory = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectUser);
  const { singleDeposite, loading, error, message } = useSelector(
    (state) => state.alldeposite
  );
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    dispatch(getQrLink());
    dispatch(getAllDepositeByid(auth?.id));
    if (error) {
      const t = setInterval(() => dispatch(clearErrors()), 3000);
      return () => clearInterval(t);
    }
    if (message) {
      const t = setInterval(() => dispatch(clearMessage()), 3000);
      return () => clearInterval(t);
    }
  }, [dispatch, error, message, auth?.id]);

  useEffect(() => {
    setFiltered(singleDeposite ? [...singleDeposite].reverse() : []);
  }, [singleDeposite]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const reversed = singleDeposite ? [...singleDeposite].reverse() : [];
    if (!val) {
      setFiltered(reversed);
    } else {
      setFiltered(
        reversed.filter(
          (p) =>
            p?.email?.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
  };

  const totalCount   = singleDeposite?.length || 0;
  const pendingCount = singleDeposite?.filter((d) => d?.status === "pending").length || 0;
  const approvedCount= singleDeposite?.filter((d) => d?.status === "approved" || d?.status === "success").length || 0;

  return (
    <>
      <Loader isLoading={loading} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        :root {
          --gold: #e8c832;
          --gold-dim: rgba(232,200,50,0.18);
          --gold-faint: rgba(232,200,50,0.07);
          --teal: #d4af37;
          --teal-dim: rgba(212,175,55,0.18);
          --teal-faint: rgba(212,175,55,0.06);
          --green: #1ee899;
          --amber: #f59e0b;
          --red: #e05c5c;
          --bg-deep: transparent;
          --bg-card: rgba(10,10,10,0.7);
          --text-primary: #f1f1f1;
          --text-muted: #9ca3af;
          --text-dim: #6b7280;
          --border-gold: rgba(212,175,55,0.25);
          --border-teal: rgba(212,175,55,0.15);
        }

        .dh-wrap {
          font-family: 'DM Sans', sans-serif;
          animation: dhPageIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes dhPageIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Orbs */
        .dh-orb-gold {
          position: absolute;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,200,50,0.15) 0%, transparent 70%);
          top: -80px; left: -60px;
          pointer-events: none; filter: blur(4px);
        }
        .dh-orb-teal {
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%);
          top: -50px; right: -40px;
          pointer-events: none; filter: blur(4px);
        }

        /* Title */
        .dh-title {
          font-family: 'Chakra Petch', sans-serif;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--gold);
          text-shadow: 0 0 30px rgba(232,200,50,0.35), 0 0 60px rgba(232,200,50,0.10);
        }

        /* Stat badges */
        .dh-stat {
          position: relative;
          padding: 10px 20px;
          border-radius: 14px;
          background: rgba(8,22,40,0.70);
          border: 1px solid var(--border-gold);
          display: flex; flex-direction: column;
          align-items: center; gap: 2px;
          overflow: hidden;
        }
        .dh-stat::after {
          content: '';
          position: absolute;
          bottom: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0.4;
        }
        .dh-stat-num {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 22px; font-weight: 700;
          color: var(--gold); line-height: 1;
        }
        .dh-stat-label {
          font-size: 9px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--text-muted);
        }

        /* Search */
        .dh-search-wrap { position: relative; }
        .dh-search {
          width: 100%; height: 42px;
          padding: 0 44px 0 16px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-primary);
          background: rgba(4,10,20,0.85);
          border: 1px solid var(--border-gold);
          border-radius: 12px; outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .dh-search::placeholder { color: var(--text-dim); }
        .dh-search:focus {
          border-color: rgba(212,175,55,0.50);
          box-shadow: 0 0 0 3px rgba(212,175,55,0.15), 0 0 20px rgba(212,175,55,0.20);
        }
        .dh-search-icon {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none; color: var(--text-muted);
        }

        /* Accent bar */
        .dh-divbar {
          height: 2px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--teal) 50%, transparent 100%);
          flex-shrink: 0;
        }

        /* Table */
        .dh-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .dh-th {
          padding: 14px 20px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--gold);
          background: rgba(6,16,30,0.85);
          border-bottom: 1px solid var(--border-gold);
          white-space: nowrap;
          position: sticky; top: 0; z-index: 2;
        }

        /* Row */
        .dh-tr {
          border-bottom: 1px solid rgba(255,255,255,0.030);
          transition: background 0.22s;
          animation: dhRowIn 0.35s ease both;
        }
        @keyframes dhRowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .dh-tr:hover { background: rgba(18,140,155,0.07) !important; }
        .dh-tr:hover .dh-sno { color: var(--color-gray-200) !important; }
        .dh-tr:hover .dh-email { color: #4a7a9a !important; }

        .dh-td { padding: 14px 20px; vertical-align: middle; }

        /* S.No */
        .dh-sno {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px; font-weight: 700;
          color: lightgray;
          transition: color 0.2s;
        }

        /* Avatar + email */
        .dh-user-cell { display: flex; align-items: center; gap: 10px; }
        .dh-avatar {
          width: 32px; height: 32px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(212,175,55,0.20), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.40);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 12px; font-weight: 700;
          color: var(--teal); text-transform: uppercase;
          box-shadow: 0 0 10px rgba(212,175,55,0.20);
        }
        .dh-email {
          font-size: 12px; font-weight: 500;
          color: lightgray;
          font-style: italic;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }

        /* Amount */
        .dh-amount {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 14px; font-weight: 700;
          color: var(--green);
          text-shadow: 0 0 14px rgba(30,232,153,0.30);
          letter-spacing: 0.04em;
        }

        /* Status badge */
        .dh-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 50px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: capitalize;
        }
        .dh-badge-approved {
          background: rgba(18,195,120,0.10);
          border: 1px solid rgba(18,195,120,0.28);
          color: #28d98e;
        }
        .dh-badge-pending {
          background: rgba(245,158,11,0.10);
          border: 1px solid rgba(245,158,11,0.28);
          color: #f59e0b;
        }
        .dh-badge-failed {
          background: rgba(220,60,60,0.09);
          border: 1px solid rgba(220,60,60,0.22);
          color: #e05c5c;
        }
        .dh-dot {
          width: 6px; height: 6px;
          border-radius: 50%; display: inline-block; flex-shrink: 0;
        }
        .dh-dot-approved {
          background: var(--green);
          box-shadow: 0 0 6px rgba(30,232,153,0.80);
          animation: dhPulse 1.8s infinite;
        }
        .dh-dot-pending {
          background: var(--amber);
          box-shadow: 0 0 6px rgba(245,158,11,0.60);
          animation: dhPulse 1.8s infinite;
        }
        .dh-dot-failed { background: var(--red); }
        @keyframes dhPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* Date */
        .dh-date {
          font-size: 13px; color: lightgray;
          letter-spacing: 0.04em;
          font-family: 'Chakra Petch', sans-serif;
        }

        /* Action button */
        .dh-btn-accept {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 8px;
          background: linear-gradient(135deg, rgba(212,175,55,0.20), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.45);
          color: var(--gold);
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 0 14px rgba(212,175,55,0.15);
        }
        .dh-btn-accept:hover {
          border-color: var(--gold);
          box-shadow: 0 0 22px rgba(212,175,55,0.35);
          color: #fff;
        }
        .dh-btn-settled {
          font-family: 'Chakra Petch', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 8px;
          background: rgba(8,20,36,0.60);
          border: 1px solid var(--text-dim);
          color: lightgray;
          cursor: not-allowed;
        }

        /* Count pill */
        .dh-count-pill {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 50px;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 11px; font-weight: 700;
          background: var(--gold-faint);
          border: 1px solid var(--gold-dim);
          color: var(--gold); letter-spacing: 0.08em;
        }

        /* Corner accents */
        .dh-corner-tl {
          position: absolute; top: 0; left: 0;
          width: 28px; height: 28px;
          border-top: 2px solid var(--teal);
          border-left: 2px solid var(--teal);
          border-radius: 14px 0 0 0; opacity: 0.40;
        }
        .dh-corner-br {
          position: absolute; bottom: 0; right: 0;
          width: 28px; height: 28px;
          border-bottom: 2px solid var(--gold);
          border-right: 2px solid var(--gold);
          border-radius: 0 0 14px 0; opacity: 0.35;
        }

        /* Empty state */
        .dh-empty {
          display: flex; flex-direction: column;
          align-items: center; gap: 16px; padding: 80px 20px;
        }
        .dh-empty-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: rgba(8,22,38,0.80);
          border: 1px solid var(--border-gold);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-dim);
          box-shadow: 0 0 30px rgba(232,200,50,0.04);
        }
        .dh-empty-text { font-size: 13px; color: var(--text-muted); letter-spacing: 0.02em; }
        .dh-empty-sub {
          font-size: 11px; color: var(--text-dim);
          letter-spacing: 0.05em; text-transform: uppercase;
          margin-top: -8px; font-family: 'Chakra Petch', sans-serif;
        }
      `}</style>

      {/* ── Page Wrapper ── */}
      <div
        className="dh-wrap min-h-screen p-4 m-2 rounded-3xl"
        style={{ background: "transparent" }}
      >
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error} />}

        {/* ── Main Card ── */}
        <div
          className="glass-card animated-border-gold"
          style={{
            borderRadius: 22,
            padding: "2px", // padding for inner content if needed
            position: "relative",
          }}
        >
          <div className="dh-corner-tl" style={{ zIndex: 5 }} />
          <div className="dh-corner-br" style={{ zIndex: 5 }} />

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
            <div className="dh-orb-gold" />
            <div className="dh-orb-teal" />

            <div
              style={{
                position: "relative", zIndex: 1,
                display: "flex", flexWrap: "wrap",
                gap: 20, alignItems: "center", justifyContent: "space-between",
              }}
            >
              {/* Left — Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Icon box */}
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.05) 100%)",
                    border: "1.5px solid rgba(212,175,55,0.45)",
                    boxShadow: "0 0 24px rgba(212,175,55,0.22), inset 0 1px 0 rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="6" width="18" height="13" rx="2" stroke="var(--teal)" strokeWidth="1.7" />
                    <path d="M3 10h18" stroke="#e8c832" strokeWidth="1.5" />
                    <circle cx="7.5" cy="14.5" r="1.2" fill="var(--teal)" />
                    <rect x="11" y="13.5" width="6" height="2" rx="1" fill="#e8c832" opacity="0.6" />
                  </svg>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h3 className="dh-title " style={{ fontSize: 20, margin: 0 }}>
                      Deposit <span className= "text-white"> History</span>
                    </h3>
                    <span className="dh-count-pill">
                      {totalCount} Transactions
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "6px 0 0", fontSize: 11,
                      letterSpacing: "2px", textTransform: "uppercase",
                      color: "var(--text-muted)", fontWeight: 500,
                    }}
                  >
                    Live Transaction Ledger · Fund Deposits
                  </p>
                </div>
              </div>

              {/* Right — Stats + Search */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

                {/* Stat: Approved */}
                {/* <div className="dh-stat">
                  <span className="dh-stat-num" style={{ color: "var(--green)" }}>
                    {approvedCount}
                  </span>
                  <span className="dh-stat-label">Approved</span>
                </div> */}

                {/* Stat: Pending */}
                {/* <div className="dh-stat">
                  <span className="dh-stat-num" style={{ color: "var(--amber)" }}>
                    {pendingCount}
                  </span>
                  <span className="dh-stat-label">Pending</span>
                </div> */}

                {/* Stat: Total */}
                {/* <div className="dh-stat">
                  <span className="dh-stat-num">{totalCount}</span>
                  <span className="dh-stat-label">Total</span>
                </div> */}

                {/* Search */}
                <div className="dh-search-wrap" style={{ width: 240 }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Filter by email…"
                    className="dh-search"
                  />
                  <span className="dh-search-icon">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gold–Teal accent bar */}
          <div className="dh-divbar" />

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table className="dh-table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  {["#", "Email", "Amount", "Status", "Date", "Action"].map((h) => (
                    <th key={h} className="dh-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered?.length > 0 ? (
                  filtered.map((item, index) => {
                    const st = item?.status;
                    const isApproved = st === "approved" || st === "success" || st === "complete";
                    const isPending  = st === "pending" || st=== "inProgress";
                    const isFailed   = st === "faild" || st === "failed" || st=== "decline";

                    const badgeClass = isApproved
                      ? "dh-badge-approved"
                      : isPending ? "dh-badge-pending" : "dh-badge-failed";
                    const dotClass = isApproved
                      ? "dh-dot-approved"
                      : isPending ? "dh-dot-pending" : "dh-dot-failed";

                    const initial = item?.email?.charAt(0)?.toUpperCase() || "?";
                    const date = item?.createdAT
                      ? new Date(item.createdAT).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })
                      : "N/A";

                    return (
                      <tr
                        key={index}
                        className="dh-tr"
                        style={{ animationDelay: `${index * 45}ms` }}
                      >
                        {/* S.No */}
                        <td className="dh-td">
                          <span className="dh-sno">{index + 1}</span>
                        </td>

                        {/* Email */}
                        <td className="dh-td">
                          <div className="dh-user-cell">
                            <div className="dh-avatar">{initial}</div>
                            <span className="dh-email">{item?.email}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="dh-td">
                          <span className="dh-amount">${item?.amount}</span>
                        </td>

                        {/* Status */}
                        <td className="dh-td">
                          <span className={`dh-badge ${badgeClass}`}>
                            <span className={`dh-dot ${dotClass}`} />
                            {item?.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="dh-td">
                          <span className="dh-date">{date}</span>
                        </td>

                        {/* Action */}
                        <td className="dh-td">
                          {isPending ? (
                            <button className="dh-btn-accept">Accept</button>
                          ) : (
                            <button className="dh-btn-settled" disabled>Settled</button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="dh-empty">
                        <div className="dh-empty-icon">
                          <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                            <rect x="3" y="6" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 14h.01M11 14h4" />
                          </svg>
                        </div>
                        <p className="dh-empty-text">No transactions found yet.</p>
                        <p className="dh-empty-sub">Your deposit history will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom accent line */}
          {filtered?.length > 8 && (
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
    </>
  );
};

export default DepositHistory;