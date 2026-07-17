import React, { useMemo } from 'react';

/**
 * CyanTreeLoader - A React 19 high-performance loader
 * Visualizes a referral network growing, pulsing on completion, and resetting.
 */
export default function TreeLoader({ isLoading }) {
  const treeData = useMemo(() => ({
    // Center is 100, 100
    root: { x: 100, y: 100 },
    branches: [
      // Level 1: 3 Main nodes
      { id: 'l1-1', x1: 100, y1: 100, x2: 100, y2: 60, delay: 0 },
      { id: 'l1-2', x1: 100, y1: 100, x2: 140, y2: 125, delay: 0.4 },
      { id: 'l1-3', x1: 100, y1: 100, x2: 60, y2: 125, delay: 0.8 },
      
      // Level 2: Sub-nodes growing from Level 1
      { id: 'l2-1', x1: 100, y1: 60, x2: 80, y2: 35, delay: 1.2 },
      { id: 'l2-2', x1: 100, y1: 60, x2: 120, y2: 35, delay: 1.4 },
      { id: 'l2-3', x1: 140, y1: 125, x2: 165, y2: 115, delay: 1.6 },
      { id: 'l2-4', x1: 140, y1: 125, x2: 155, y2: 150, delay: 1.8 },
      { id: 'l2-5', x1: 60, y1: 125, x2: 35, y2: 115, delay: 2.0 },
      { id: 'l2-6', x1: 60, y1: 125, x2: 45, y2: 150, delay: 2.2 },
    ]
  }), []);

  if (!isLoading) return null;
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#000206] overflow-hidden">
      {}
      <style>
        {`
          @keyframes branchGrow {
            0% { stroke-dashoffset: 100; opacity: 0; }
            10% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }

          @keyframes nodePop {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes globalSequence {
            0%, 5% { opacity: 0; transform: scale(0.9); }
            10%, 75% { opacity: 1; transform: scale(1); }
            80% { transform: scale(1.1); filter: drop-shadow(0 0 12px #826705); }
            85% { transform: scale(1); filter: drop-shadow(0 0 2px #a47404); }
            95%, 100% { opacity: 0; transform: scale(1.05); }
          }

          @keyframes rotateSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animate-branch {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: branchGrow 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .animate-node {
            transform-origin: center;
            animation: nodePop 4.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          }

          .tree-container {
            animation: globalSequence 4.5s infinite;
            transform-origin: center;
          }

          .rotation-wrapper {
            animation: rotateSlow 20s linear infinite;
          }
        `}
      </style>

      {}
      <div className="relative h-48 w-48 flex items-center justify-center">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-cyan-500/10 blur-[50px] rounded-full animate-pulse" />
        
        <svg
          viewBox="0 0 200 200"
          className="relative z-10 w-full h-full rotation-wrapper"
        >
          <g className="tree-container">
            {/* Draw Branches First */}
            {treeData.branches.map((b) => (
              <line
                key={`branch-${b.id}`}
                x1={b.x1}
                y1={b.y1}
                x2={b.x2}
                y2={b.y2}
                stroke="#c68905"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-branch"
                style={{ animationDelay: `${b.delay}s` }}
              />
            ))}

            {/* Draw Root Node */}
            <circle
              cx={treeData.root.x}
              cy={treeData.root.y}
              r="6"
              fill="#d2a10d"
              className="animate-node"
              style={{ 
                animationDelay: '0s',
                filter: 'drop-shadow(0 0 8px rgba(189, 130, 14, 0.8))'
              }}
            />

            {/* Draw Sub-Nodes */}
            {treeData.branches.map((b) => (
              <circle
                key={`node-${b.id}`}
                cx={b.x2}
                cy={b.y2}
                r="4"
                fill="#c1960a"
                className="animate-node"
                style={{ 
                  animationDelay: `${b.delay + 0.3}s`,
                  filter: 'drop-shadow(0 0 5px rgba(132, 112, 11, 0.6))'
                }}
              />
            ))}
          </g>
        </svg>

        {}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 bg-gold-medium rounded-full animate-ping opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
