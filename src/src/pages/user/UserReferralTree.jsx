import React, { useState, useEffect, useMemo, useRef, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTreeData } from "../../redux/referralSlice";
import TreeLoader from "../../components/common/TreeLoader";
import { RefreshCw } from "lucide-react";

// Dark Horse palette replaced with Gold
// --zy-dark:   #1a1608  (dark gold)
// --zy-mid:    #b89020  (mid gold)
// --zy-bright: #d4af37  (bright gold highlight)

// --- Logic: Network Stats Calculation ---
const getNetworkStats = (node) => {
  let biz = Number(node.active_plan) || 0;
  let team = 0;
  const traverse = (n) => {
    if (!n.referrals) return;
    n.referrals.forEach(ref => {
      team++;
      biz += Number(ref.active_plan) || 0;
      traverse(ref);
    });
  };
  traverse(node);
  return { biz, team };
};

const TreeNode = memo(({ user, level = 0, expandedNodes, toggleExpand }) => {
  const [showInfo, setShowInfo] = useState(false);
  const isExpanded = !!expandedNodes[user.id];
  const hasChildren = user.referrals && user.referrals.length > 0;
  const stats = useMemo(() => getNetworkStats(user), [user]);

  const clickTimer = useRef(null);
  const lastClickTime = useRef(0);

  const handleTap = (e) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastClickTime.current < DOUBLE_TAP_DELAY) {
      clearTimeout(clickTimer.current);
      if (hasChildren) toggleExpand(user.id);
      lastClickTime.current = 0;
    } else {
      lastClickTime.current = now;
      clickTimer.current = setTimeout(() => {
        setShowInfo(prev => !prev);
        lastClickTime.current = 0;
      }, DOUBLE_TAP_DELAY);
    }
  };

  const isActive = user.is_active === 'active';

  return (
    <li className="tree-li flex flex-col items-center">
      {/* Node Card */}
      <div
        onClick={handleTap}
        style={{
          background: isActive
            ? 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)'
            : 'rgba(10,10,10,0.6)',
          boxShadow: isActive
            ? '0 0 18px rgba(212,175,55,0.2), 0 0 6px rgba(212,175,55,0.1)'
            : 'none',
        }}
        className={`relative z-20 transition-all duration-300 transform cursor-pointer rounded-2xl p-[2px] mb-2
          ${showInfo ? 'w-56 md:w-64' : 'w-36 md:w-44'}
          ${isActive ? 'animated-border-gold' : ''}
        `}
      >
        <div className="glass-card active:scale-95 transition-transform rounded-[14px] p-3 md:p-4">
          <div className="flex items-center gap-3 pointer-events-none z-10 relative">
            <div className="relative">
              <div
                style={{
                  borderColor: isActive ? '#d4af37' : '#554c33',
                  boxShadow: isActive ? '0 0 10px rgba(212,175,55,0.3)' : 'none',
                }}
                className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center bg-[#b77d11]"
              >
                <span
                  style={{ color: isActive ? '#d4af37' : '#64748b' }}
                  className="text-[10px] font-black"
                >
                  {user.username?.substring(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Status dot */}
              <div
                style={isActive ? {
                  background: 'linear-gradient(135deg, #b89020, #d4af37)',
                  boxShadow: '0 0 8px #d4af37',
                } : { background: '#ef4444' }}
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black"
              />
            </div>

            <div className="overflow-hidden">
              <p className="text-white font-bold text-[11px] md:text-sm truncate italic">@{user.username}</p>
              <span style={{ color: '#d4af37' }} className="text-[8px] font-mono uppercase tracking-tighter">
                LVL {level}
              </span>
            </div>
          </div>

          {showInfo && (
            <div
              style={{ borderColor: 'rgba(212,175,55,0.3)' }}
              className="mt-3 pt-3 border-t space-y-2 animate-in fade-in zoom-in-95 duration-200 z-10 relative"
            >
              <div className="grid grid-cols-2 gap-1.5">
                <div
                  style={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.25)' }}
                  className="p-1.5 rounded-lg border text-center"
                >
                  <p className="text-[7px] text-slate-400 uppercase font-black tracking-widest">Plan</p>
                  <p style={{ color: '#d4af37' }} className="text-xs font-black">${user.active_plan || 0}</p>
                </div>
                <div
                  style={{ background: 'rgba(212,175,55,0.05)', borderColor: 'rgba(212,175,55,0.15)' }}
                  className="p-1.5 rounded-lg border text-center"
                >
                  <p className="text-[7px] text-slate-400 uppercase font-black tracking-widest">Team</p>
                  <p className="text-xs font-black text-slate-200">{stats.team}</p>
                </div>
              </div>
              {hasChildren && (
                <p style={{ color: '#b89020' }} className="text-[7px] font-black text-center uppercase tracking-widest animate-pulse">
                  {isExpanded ? "Double Tap to Collapse" : "Double Tap to Expand"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Children & Lines */}
      {isExpanded && hasChildren && (
        <ul className="flex justify-center pt-12 relative connector-line">
          {user.referrals.map((child) => (
            <TreeNode
              key={child.id || child.username}
              user={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

const ReferralTree = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { treeData, loading } = useSelector((state) => state.referralTree);
  const [expandedNodes, setExpandedNodes] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (auth?.refferal_code) dispatch(getTreeData(auth.refferal_code));
  }, [auth?.refferal_code, dispatch]);

  const rootUser = useMemo(() => auth ? { ...auth, referrals: treeData || [] } : null, [auth, treeData]);

  const toggleExpand = (id) => setExpandedNodes(p => ({ ...p, [id]: !p[id] }));

  const resetTree = () => {
    setExpandedNodes({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#02040a]">
      <TreeLoader isLoading={true} />
    </div>
  );

  return (
    <div className="w-full min-h-screen text-white flex flex-col font-['Syne']" style={{ background: 'transparent' }}>

      {/* Header */}
      <div
        style={{ borderBottomColor: 'rgba(212,175,55,0.25)' }}
        className="w-full border-b p-5 md:px-10 glass-card"
      >
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto z-10 relative">
          <div>
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none gold-gradient-text">
              Network{' '}
              <span style={{ color: '#d4af37' }}>Engine</span>
            </h2>
            <p style={{ color: 'rgba(212,175,55,0.7)' }} className="text-[10px] font-mono mt-1 tracking-[0.2em] uppercase">
              Node Alpha: {auth?.username}
            </p>
          </div>
          <button
            onClick={resetTree}
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
              boxShadow: '0 0 16px rgba(212,175,55,0.3)',
              border: '1px solid rgba(212,175,55,0.4)',
            }}
            className="flex items-center gap-2 text-gold-medium px-5 py-2 rounded-xl text-[11px] font-black hover:bg-gold-medium hover:text-black hover:opacity-100 active:scale-95 transition-all uppercase"
          >
            <RefreshCw size={14} /> REBOOT
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-x-auto custom-scroll cursor-grab active:cursor-grabbing">
        <div className="inline-block min-w-full p-10 md:p-20">
          <ul className="flex justify-center m-0 p-0">
            {rootUser && (
              <TreeNode
                user={rootUser}
                expandedNodes={expandedNodes}
                toggleExpand={toggleExpand}
              />
            )}
          </ul>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tree-li { list-style: none; position: relative; padding: 30px 5px 0 5px; }

        /* Vertical drop from parent */
        .connector-line::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          border-left: 2.5px solid #d4af37;
          width: 0; height: 30px;
        }

        /* Horizontal branch lines */
        .tree-li::before, .tree-li::after {
          content: '';
          position: absolute; top: 0; right: 50%;
          border-top: 2.5px solid #d4af37;
          width: 50%; height: 30px;
        }
        .tree-li::after { right: auto; left: 50%; border-left: 2.5px solid #d4af37; }

        .tree-li:only-child::after,
        .tree-li:only-child::before { display: none; }
        .tree-li:only-child { padding-top: 0; }

        .tree-li:first-child::before,
        .tree-li:last-child::after { border: 0 none; }

        .tree-li:last-child::before  { border-right: 2.5px solid #d4af37; border-radius: 0 15px 0 0; }
        .tree-li:first-child::after  { border-radius: 15px 0 0 0; }

        .custom-scroll::-webkit-scrollbar { height: 6px; display: none; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; display: none; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; display: none; }
      `}} />
    </div>
  );
};

export default ReferralTree;


// import React, { useState, useEffect, useMemo, useRef, memo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getTreeData } from "../../redux/referralSlice";
// import TreeLoader from "../../components/common/TreeLoader";
// import { RefreshCw, Users, DollarSign, ChevronDown, ChevronUp } from "lucide-react";

// // --- Logic: Network Stats Calculation ---
// const getNetworkStats = (node) => {
//   let biz = Number(node.active_plan) || 0;
//   let team = 0;
//   const traverse = (n) => {
//     if (!n.referrals) return;
//     n.referrals.forEach(ref => {
//       team++;
//       biz += Number(ref.active_plan) || 0;
//       traverse(ref);
//     });
//   };
//   traverse(node);
//   return { biz, team };
// };

// const TreeNode = memo(({ user, level = 0, expandedNodes, toggleExpand }) => {
//   const [showInfo, setShowInfo] = useState(false);
//   const isExpanded = !!expandedNodes[user.id];
//   const hasChildren = user.referrals && user.referrals.length > 0;
//   const stats = useMemo(() => getNetworkStats(user), [user]);

//   const clickTimer = useRef(null);
//   const lastClickTime = useRef(0);

//   const handleTap = (e) => {
//     e.stopPropagation();
//     const now = Date.now();
//     const DOUBLE_TAP_DELAY = 300;

//     if (now - lastClickTime.current < DOUBLE_TAP_DELAY) {
//       clearTimeout(clickTimer.current);
//       if (hasChildren) toggleExpand(user.id);
//       lastClickTime.current = 0;
//     } else {
//       lastClickTime.current = now;
//       clickTimer.current = setTimeout(() => {
//         setShowInfo(prev => !prev);
//         lastClickTime.current = 0;
//       }, DOUBLE_TAP_DELAY);
//     }
//   };

//   return (
//     <li className="tree-li flex flex-col items-center">
//       {/* Node Card */}
//       <div 
//         onClick={handleTap}
//         className={`relative z-20 transition-all duration-300 transform cursor-pointer rounded-2xl p-[2px] mb-2
//           ${showInfo ? 'w-56 md:w-64' : 'w-36 md:w-44'} 
//           ${user.is_active === 'active' 
//             ? 'bg-cyan-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
//             : 'bg-slate-700'}
//         `}
//       >
//         <div className="bg-[#0b0f1a] active:scale-95 transition-transform hover:bg-[#111827] rounded-[14px] p-3 md:p-4">
//           <div className="flex items-center gap-3 pointer-events-none">
//             <div className="relative">
//               <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center bg-[#050810] 
//                 ${user.is_active === 'active' ? 'border-cyan-500' : 'border-slate-600'}`}>
//                  <span className={`text-[10px] font-black ${user.is_active === 'active' ? 'text-cyan-500' : 'text-slate-500'}`}>
//                    {user.username?.substring(0,2).toUpperCase()}
//                  </span>
//               </div>
//               <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0b0f1a] 
//                 ${user.is_active === 'active' ? 'bg-cyan-500 shadow-[0_0_8px_#22d3ee]' : 'bg-red-500'}`} />
//             </div>
            
//             <div className="overflow-hidden">
//               <p className="text-white font-bold text-[11px] md:text-sm truncate italic">@{user.username}</p>
//               <span className="text-[8px] text-cyan-500/100 font-mono uppercase tracking-tighter">LVL {level}</span>
//             </div>
//           </div>

//           {showInfo && (
//             <div className="mt-3 pt-3 border-t border-cyan-500/50 space-y-2 animate-in fade-in zoom-in-95 duration-200">
//               <div className="grid grid-cols-2 gap-1.5">
//                 <div className="bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/30 text-center">
//                   <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest">Plan</p>
//                   <p className="text-xs font-black text-cyan-500">${user.active_plan || 0}</p>
//                 </div>
//                 <div className="bg-cyan-950/60 p-1.5 rounded-lg border border-cyan-500/20 text-center">
//                   <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest">Team</p>
//                   <p className="text-xs font-black text-slate-200">{stats.team}</p>
//                 </div>
//               </div>
//               {hasChildren && (
//                  <p className="text-[7px] text-cyan-600 font-black text-center uppercase tracking-widest animate-pulse">
//                    {isExpanded ? "Double Tap to Collapse" : "Double Tap to Expand"}
//                  </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Children & Lines */}
//       {isExpanded && hasChildren && (
//         <ul className="flex justify-center pt-12 relative connector-line">
//           {user.referrals.map((child) => (
//             <TreeNode 
//               key={child.id || child.username} 
//               user={child} 
//               level={level + 1} 
//               expandedNodes={expandedNodes} 
//               toggleExpand={toggleExpand} 
//             />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// });

// const ReferralTree = () => {
//   const dispatch = useDispatch();
//   const { auth } = useSelector((state) => state.auth);
//   const { treeData, loading } = useSelector((state) => state.referralTree);
//   const [expandedNodes, setExpandedNodes] = useState({});
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (auth?.refferal_code) dispatch(getTreeData(auth.refferal_code));
//   }, [auth?.refferal_code, dispatch]);

//   const rootUser = useMemo(() => auth ? { ...auth, referrals: treeData || [] } : null, [auth, treeData]);

//   const toggleExpand = (id) => setExpandedNodes(p => ({ ...p, [id]: !p[id] }));

//   const resetTree = () => {
//     setExpandedNodes({});
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   if (loading) return <div className="h-screen flex items-center justify-center bg-[#02040a]"><TreeLoader isLoading={true} /></div>;

//   return (
//     <div className="w-full min-h-screen bg-[#02040a] text-white flex flex-col font-['Syne']">
      
//       {/* Static Header */}
//       <div className="w-full bg-[#0b0f1a] border-b border-cyan-500/50 p-5 md:px-10">
//         <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
//           <div>
//             <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none">
//               Network <span className="text-cyan-500">Engine</span>
//             </h2>
//             <p className="text-[10px] text-cyan-400/60 font-mono mt-1 tracking-[0.2em] uppercase">Node Alpha: {auth?.username}</p>
//           </div>
//           <button 
//             onClick={resetTree} 
//             className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-2 rounded-xl text-[11px] font-black hover:bg-cyan-500 active:scale-95 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
//           >
//             <RefreshCw size={14} /> REBOOT
//           </button>
//         </div>
//       </div>

//       {/* Tree Content */}
//       <div className="flex-1 overflow-x-auto custom-scroll cursor-grab active:cursor-grabbing">
//         <div className="inline-block min-w-full p-10 md:p-20">
//           <ul className="flex justify-center m-0 p-0">
//             {rootUser && (
//               <TreeNode 
//                 user={rootUser} 
//                 expandedNodes={expandedNodes} 
//                 toggleExpand={toggleExpand} 
//               />
//             )}
//           </ul>
//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .tree-li { list-style: none; position: relative; padding: 30px 5px 0 5px; }
        
//         /* Parent Connector */
//         .connector-line::before {
//           content: ''; position: absolute; top: 0; left: 50%; 
//           border-left: 2.5px solid #00fff; 
//           width: 0; height: 30px;
//         }

//         /* Horizontal Connectors */
//         .tree-li::before, .tree-li::after {
//           content: ''; position: absolute; top: 0; right: 50%; 
//           border-top: 2.5px solid #2563eb; 
//           width: 50%; height: 30px;
//         }
//         .tree-li::after { right: auto; left: 50%; border-left: 2.5px solid #2563eb; }

//         .tree-li:only-child::after, .tree-li:only-child::before { display: none; }
//         .tree-li:only-child { padding-top: 0; }
//         .tree-li:first-child::before, .tree-li:last-child::after { border: 0 none; }

//         .tree-li:last-child::before { border-right: 2.5px solid #2563eb; border-radius: 0 15px 0 0; }
//         .tree-li:first-child::after { border-radius: 15px 0 0 0; }

//         .custom-scroll::-webkit-scrollbar { height: 6px; display: none; }
//         .custom-scroll::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; display: none; }
//         .custom-scroll::-webkit-scrollbar-track { background: #0b0f1a; display: none;}
//       `}} />
//     </div>
//   );
// };

// export default ReferralTree;