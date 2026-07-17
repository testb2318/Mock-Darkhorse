

// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import Loader from "../../components/common/Loader";
// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";
// import Confirmation from "../../components/modals/Confirmation";
// import {
//   deleteTopup,
//   getAllTopupByid,
//   clearErrors,
//   clearMessage,
// } from "../../redux/topupSlice";
// import { getAllPlans } from "../../redux/planSlice";
// import UserTopupModel from "../../components/modals/UserTopupModel";
// import { Search, Plus, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

// export default function UserTopup() {
//   const dispatch = useDispatch();
//   const { singletopup, loading, error, message } = useSelector(
//     (state) => state.alltopup
//   );
//   const { auth } = useSelector((state) => state.auth);
//   const [deleteID, setDeleteID] = useState();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [openModel, setOpenModel] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     dispatch(getAllPlans());
//     if (auth?.id) {
//       dispatch(getAllTopupByid(auth?.id));
//     }
//     if (error) {
//       const errorInterval = setInterval(() => {
//         dispatch(clearErrors());
//         window.location.reload();
//       }, 3000);
//       return () => clearInterval(errorInterval);
//     }
//     if (message) {
//       const messageInterval = setInterval(() => {
//         dispatch(clearMessage());
//         window.location.reload();
//       }, 3000);
//       return () => clearInterval(messageInterval);
//     }
//   }, [dispatch, error, message]);

//   const handleDelete = (id) => {
//     setDeleteID(id);
//     setModalOpen(true);
//   };

//   const isClose = () => {
//     setModalOpen(false);
//   };

//   function modelClose() {
//     setOpenModel(false);
//   }

//   const filteredTopups = singletopup?.filter((item) =>
//     item?.userto_email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case "complete":
//         return { color: "bg-green-500/10 text-green-400 border-green-500/30", icon: <CheckCircle className="w-3 h-3" /> };
//       case "pending":
//         return { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> };
//       case "rejected":
//         return { color: "bg-red-500/10 text-red-400 border-red-500/30", icon: <XCircle className="w-3 h-3" /> };
//       default:
//         return { color: "bg-slate-500/10 text-slate-400 border-slate-500/30", icon: null };
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "—";
//     const date = new Date(dateString);
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };

//   return (
//     <>
//       {message && <SuccessAlert message={message} />}
//       {error && <ErrorAlert error={error} />}
//       <Loader isLoading={loading} />

//       <div className="w-full max-w-6xl mx-auto px-4 py-6">
//         {/* Main Card: Swapped gray-900/800 for slate-950/900 */}
//         <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-blue-900/50 shadow-2xl overflow-hidden">
          
//           {/* Header Section */}
//           <div className="px-5 py-4 border-b border-blue-900/50 bg-slate-900/40">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
//                   <TrendingUp className="w-5 h-5 text-blue-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">Top-Up History</h3>
//                   <p className="text-sm text-blue-300/50 mt-0.5">Overview of your top-up transactions</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/30">
//                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                   <span className="text-xs text-green-400">Live</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Summary */}
//           <div className="px-5 pt-5">
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               <div className="text-center p-3 rounded-xl bg-slate-900/50 border border-blue-900/30 shadow-inner">
//                 <p className="text-xs text-blue-300/50 mb-1">Total Top-ups</p>
//                 <p className="text-lg font-bold text-white">{singletopup?.length || 0}</p>
//               </div>
//               <div className="text-center p-3 rounded-xl bg-slate-900/50 border border-blue-900/30 shadow-inner">
//                 <p className="text-xs text-blue-300/50 mb-1">Completed</p>
//                 <p className="text-lg font-bold text-green-400">
//                   {singletopup?.filter(t => t?.status?.toLowerCase() === 'complete').length || 0}
//                 </p>
//               </div>
//               <div className="text-center p-3 rounded-xl bg-slate-900/50 border border-blue-900/30 shadow-inner">
//                 <p className="text-xs text-blue-300/50 mb-1">Pending</p>
//                 <p className="text-lg font-bold text-yellow-400">
//                   {singletopup?.filter(t => t?.status?.toLowerCase() === 'pending').length || 0}
//                 </p>
//               </div>
//               <div className="text-center p-3 rounded-xl bg-slate-900/50 border border-blue-900/30 shadow-inner">
//                 <p className="text-xs text-blue-300/50 mb-1">Total Amount</p>
//                 <p className="text-lg font-bold text-blue-400">
//                   ${singletopup?.reduce((sum, item) => sum + (item?.amount || 0), 0).toLocaleString() || 0}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Search and Add Section */}
//           <div className="px-5 pt-5">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative flex-1">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-4 w-4 text-blue-400/50" />
//                 </div>
//                 <input
//                   className="w-full h-10 pl-10 pr-4 bg-slate-950 border border-blue-900/50 rounded-lg text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
//                   placeholder="Search by email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <button
//                 type="button"
//                 onClick={() => setOpenModel(true)}
//                 className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/40 transition-all duration-300"
//               >
//                 <Plus className="w-4 h-4" />
//                 Top-Up
//               </button>
//             </div>
//           </div>

//           {/* Table Section */}
//           <div className="p-5">
//             <div className="relative overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-blue-900/50">
//                     <th className="px-4 py-3 text-left text-xs font-medium text-blue-300/40 uppercase tracking-wider">#</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-blue-300/40 uppercase tracking-wider">Topup To</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-blue-300/40 uppercase tracking-wider">Amount</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-blue-300/40 uppercase tracking-wider">Description</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-blue-300/40 uppercase tracking-wider">Status</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-blue-300/40 uppercase tracking-wider">Request Date</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-blue-900/30">
//                   {filteredTopups?.length > 0 ? (
//                     filteredTopups
//                       .slice()
//                       .reverse()
//                       .map((item, index) => {
//                         const status = getStatusBadge(item?.status);
//                         return (
//                           <tr
//                             key={index}
//                             className="hover:bg-blue-500/5 transition-colors duration-200"
//                           >
//                             <td className="px-4 py-3 text-sm text-blue-300/30">#{index + 1}</td>
//                             <td className="px-4 py-3 text-sm text-slate-200 whitespace-nowrap">
//                               {item?.userto_email}
//                             </td>
//                             <td className="px-4 py-3 text-sm font-semibold text-blue-400 whitespace-nowrap">
//                               ${item?.amount?.toLocaleString()}
//                             </td>
//                             <td className="px-4 py-3 text-sm text-blue-100/40 max-w-[200px] truncate">
//                               {item?.note || "—"}
//                             </td>
//                             <td className="px-4 py-3 whitespace-nowrap">
//                               <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
//                                 {status.icon}
//                                 <span>{item?.status}</span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 text-sm text-blue-300/40 whitespace-nowrap">
//                               {formatDate(item?.createdAT)}
//                             </td>
//                           </tr>
//                         );
//                       })
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="px-4 py-12 text-center">
//                         <div className="flex flex-col items-center gap-3">
//                           <div className="p-4 rounded-full bg-slate-900 border border-blue-900/50">
//                             <Search className="w-8 h-8 text-blue-900" />
//                           </div>
//                           <p className="text-blue-300/40 text-sm">No top-up data available</p>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="px-5 py-3 bg-slate-950/50 border-t border-blue-900/50">
//             <div className="flex justify-between items-center text-xs">
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-1.5">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
//                   <span className="text-blue-300/40">Total Top-ups: {filteredTopups?.length || 0}</span>
//                 </div>
//               </div>
//               <div className="text-blue-300/20 font-medium">
//                 ALL AMOUNTS IN USD
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {modalOpen && (
//         <Confirmation
//           isClose={isClose}
//           deletefunction={deleteTopup}
//           id={deleteID}
//         />
//       )}
//       {openModel && (
//         <UserTopupModel openModel={openModel} modelClose={modelClose} />
//       )}
//     </>
//   );
// }



import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import Confirmation from "../../components/modals/Confirmation";
import {
  deleteTopup,
  getAllTopupByid,
  clearErrors,
  clearMessage,
} from "../../redux/topupSlice";
import { getAllPlans } from "../../redux/planSlice";
import UserTopupModel from "../../components/modals/UserTopupModel";
import { Search, Plus, Clock, CheckCircle, XCircle, TrendingUp, RefreshCw } from "lucide-react";

export default function UserTopup() {
  const dispatch = useDispatch();
  const { singletopup, loading, error, message } = useSelector(
    (state) => state.alltopup
  );
  const { auth } = useSelector((state) => state.auth);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModel, setOpenModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllPlans());
    if (auth?.id) {
      dispatch(getAllTopupByid(auth?.id));
    }
    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
        window.location.reload();
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
        window.location.reload();
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message]);

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => setModalOpen(false);
  function modelClose() { setOpenModel(false); }

  const filteredTopups = singletopup?.filter((item) =>
    item?.userto_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return {
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          glow: "shadow-emerald-500/20",
          icon: <CheckCircle className="w-3 h-3" />
        };
      case "pending":
        return {
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          glow: "shadow-amber-500/20",
          icon: <Clock className="w-3 h-3" />
        };
      case "rejected":
        return {
          color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          glow: "shadow-rose-500/20",
          icon: <XCircle className="w-3 h-3" />
        };
      default:
        return {
          color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          glow: "",
          icon: null
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const totalAmount = singletopup?.reduce((sum, item) => sum + (item?.amount || 0), 0) || 0;

  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />

      <div className="w-full max-w-8xl mx-auto px-10 py-6">
        <div className="glass-card animated-border-gold rounded-2xl p-0.5 shadow-[0_0_60px_rgba(212,175,55,0.08)]">
          <div className="bg-black/40 rounded-[15px] overflow-hidden">

          {/* ── Header ── */}
          <div className="px-6 py-5 border-b border-gold-medium/30"
            style={{ background: "rgba(10,10,10,0.4)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-gold-medium/20"
                  style={{ background: "rgba(212,175,55,0.12)" }}>
                  <TrendingUp className="w-5 h-5 text-gold-light" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide font-display">Top-Up History</h3>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(212,175,55,0.7)" }}>
                    Overview of your top-up transactions
                  </p>
                </div>
              </div>

            
            
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20"
                style={{ background: "rgba(0,200,100,0.07)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Live</span>
              </div>
                         <button
              type="button"
              onClick={() => setOpenModel(true)}
              className="flex items-center justify-center gap-2 px-5 h-12 rounded-xl text-sm font-semibold text-gold-medium hover:text-black transition-all duration-200 uppercase tracking-wider"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)",
                border: "1px solid rgba(212,175,55,0.4)",
                boxShadow: "0 4px 20px rgba(212,175,55,0.1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#d4af37";
                e.currentTarget.style.boxShadow = "0 4px 28px rgba(212,175,55,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(212,175,55,0.1)";
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Re Top-Up
            </button>
            </div>

            
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 pt-5">
            {[
              { label: "Total Top-ups", value: singletopup?.length || 0, color: "text-white", border: "rgba(212,175,55,0.3)" },
              {
                label: "Completed",
                value: singletopup?.filter(t => t?.status?.toLowerCase() === "complete").length || 0,
                color: "text-emerald-400",
                border: "rgba(52,211,153,0.2)"
              },
              {
                label: "Pending",
                value: singletopup?.filter(t => t?.status?.toLowerCase() === "pending").length || 0,
                color: "text-amber-400",
                border: "rgba(251,191,36,0.2)"
              },
              {
                label: "Total Amount",
                value: `$${totalAmount.toLocaleString()}`,
                color: "text-gold-light",
                border: "rgba(212,175,55,0.3)"
              },
            ].map((s, i) => (
              <div key={i}
                className="text-center py-4 px-3 rounded-xl bg-black/20"
                style={{
                  border: `1px solid ${s.border}`,
                }}>
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(212,175,55,0.8)" }}>
                  {s.label}
                </p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Search + Button ── */}
          <div className="flex flex-col sm:flex-row gap-3 px-6 pt-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-medium" />
              <input
                className="w-full h-10 pl-10 pr-4 rounded-xl text-white text-sm outline-none transition-all"
                style={{
                  background: "rgba(10,10,10,0.6)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  color: "#fff",
                }}
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={e => e.target.style.borderColor = "rgba(212,175,55,0.8)"}
                onBlur={e => e.target.style.borderColor = "rgba(212,175,55,0.3)"}
              />
            </div>
           
          </div>

          {/* ── Table ── */}
          <div className="px-6 pt-5 pb-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                  {["#", "Topup To", "Amount", "Status", "Request Date"].map((h) => (
                    <th key={h}
                      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-gold-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTopups?.length > 0 ? (
                  filteredTopups
                    .slice()
                    .reverse()
                    .map((item, index) => {
                      const status = getStatusBadge(item?.status);
                      return (
                        <tr
                          key={index}
                          className="group transition-all duration-150"
                          style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(212,175,55,0.05)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <td className="px-4 py-3.5 text-xs font-mono text-gold-medium/70">
                            #{index + 1}
                          </td>
                          <td className="px-4 py-3.5 text-sm font-medium text-white">
                            {item?.userto_email}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-bold text-gold-light">
                              ${item?.amount?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-sm ${status.color} ${status.glow}`}>
                              {status.icon}
                              {item?.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-400">
                            {formatDate(item?.createdAT)}
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-gold-medium/30 bg-black/40">
                          <Search className="w-6 h-6 text-gold-medium/50" />
                        </div>
                        <p className="text-sm text-gold-medium/70">No top-up data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-3 flex justify-between items-center border-t border-gold-medium/30 bg-black/20">
            <div className="flex items-center gap-2 text-xs text-gold-medium/80">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-medium inline-block" />
              Total Records: {filteredTopups?.length || 0}
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-medium">
              All Amounts in USD
            </span>
          </div>

        </div>
        </div>
      </div>

      {modalOpen && (
        <Confirmation isClose={isClose} deletefunction={deleteTopup} id={deleteID} />
      )}
      {openModel && (
        <UserTopupModel openModel={openModel} modelClose={modelClose} />
      )}
    </>
  );
}