
// import React, { useState, useEffect } from 'react';
// import { TrendingUp, TrendingDown, Users, DollarSign, Lock, Activity } from 'lucide-react';

// export default function TokenDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

// const fetchData = async () => {
//   try {
//     setLoading(true);

//     const token = localStorage.getItem('adminToken'); // ✅ 'token' nahi, 'adminToken'

//     const response = await fetch('https://api.Mock.ceo/api/v1/admin/dashboard', {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       }
//     });

//     if (response.status === 401) {
//       throw new Error('Unauthorized - Please login again');
//     }

//     const result = await response.json();

//     if (result.success) setData(result.data);
//     else throw new Error('Failed to fetch data');

//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   if (loading) {
//     return (
//       <div className=" bg-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
//           <p className="text-red-400 text-center">{error}</p>
//           <button 
//             onClick={fetchData}
//             className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { overallStats, tokenStats, recentTransactions, stakingPerformance } = data;

//   const StatCard = ({ icon: Icon, label, value, trend,bgColor }) => (
//     <div className={`${bgColor} border border-white/10 rounded-xl p-6 hover:border-purple-500/40 transition-all`}>
//       <div className="flex justify-between mb-3 items-center">
//         <Icon className="w-8 h-8 text-purple-400" />
//         {trend !== undefined && (
//           <span className={`text-sm flex items-center ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
//             {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
//             {trend}%
//           </span>
//         )}
//       </div>
//       <p className="text-gray-400 text-xs">{label}</p>
//       <p className="text-white text-2xl font-bold mt-1">{value}</p>
//     </div>
//   );

//   const TokenCard = ({ token }) => (
//     <div className="bg-[#0F0F0F] border border-purple-400/20 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(128,0,255,0.25)] transition-all">
//       <div className="flex justify-between mb-3">
//         <div>
//           <h3 className="text-white font-bold">{token.token_name}</h3>
//           <p className="text-gray-400 text-xs">{token.symbol}</p>
//         </div>
//         <div className={`px-3 py-1 rounded-full flex items-center text-xs font-semibold ${
//           parseFloat(token.price_change_percentage) > 0 
//             ? 'bg-green-500/20 text-green-400'
//             : 'bg-red-500/20 text-red-400'
//         }`}>
//           {token.price_change_percentage}%
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4 text-sm mb-3">
//         <div>
//           <p className="text-gray-400 text-xs">Current Price</p>
//           <p className="text-white font-semibold">${parseFloat(token.current_price).toFixed(2)}</p>
//         </div>
//         <div>
//           <p className="text-gray-400 text-xs">Initial Price</p>
//           <p className="text-gray-300">${parseFloat(token.initial_price).toFixed(2)}</p>
//         </div>
//       </div>

//       <div className="text-sm border-t border-white/10 pt-3 space-y-2">
//         <div className="flex justify-between">
//           <span className="text-gray-400">Purchased</span>
//           <span className="text-white">{parseFloat(token.total_purchased).toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400">Staked</span>
//           <span className="text-purple-400">{parseFloat(token.total_staked).toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-400">Buyers</span>
//           <span className="text-white">{token.unique_buyers}</span>
//         </div>
//       </div>
//     </div>
//   );

//   const TransactionRow = ({ tx }) => (
//     <div className="flex justify-between items-center py-4 px-4 text-sm hover:bg-white/5 transition-colors border-b border-white/5">
//       <div>
//         <p className="text-white font-medium">{tx.token_name} ({tx.symbol})</p>
//         <p className="text-gray-400">{tx.username}</p>
//       </div>
//       <div className="text-right">
//         <p className="text-white font-semibold">${parseFloat(tx.usd_value).toLocaleString()}</p>
//         <p className="text-gray-400">{parseFloat(tx.amount).toFixed(2)} {tx.symbol}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-black p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="mb-5">
//           <h1 className="text-2xl  font-bold text-white">Token Dashboard</h1>
//           <p className="text-gray-400 text-lg mt-1">Live Stats & Analytics</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//           <StatCard bgColor="bg-blue-900/60" icon={Users} label="Total Users" value={overallStats?.total_users}/>
//           <StatCard bgColor="bg-green-900/60" icon={Activity} label="Active Tokens" value={overallStats?.active_tokens}/>
//           <StatCard bgColor="bg-pink-900/60" icon={DollarSign} label="Total Purchases" value={`$${parseFloat(overallStats?.total_purchases_usd).toLocaleString()}`}/>
//           <StatCard  bgColor="bg-amber-900/60" icon={Lock} label="Total Staked" value={`$${parseFloat(overallStats?.total_staked_usd).toLocaleString()}`}/>
//         </div>

//         {/* Token List */}
//         <h2 className="text-xl font-bold text-white mb-3">Active Tokens</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//           {tokenStats?.map(t => <TokenCard key={t.id} token={t}/> )}
//         </div>

//         {/* Recent Transactions */}
//         <h2 className="text-xl font-bold text-white mb-3">Recent Transactions</h2>
//         <div className="bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden">
//           {recentTransactions?.map(tx => <TransactionRow key={tx.id} tx={tx}/> )}
//         </div>

//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Lock, Activity, AlertCircle } from 'lucide-react';

export default function TokenDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://api.Mock.ceo/api/v1/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      if (result.success) setData(result.data);
      else throw new Error('Failed to fetch data');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="bg-black flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
        <p className="text-red-400 text-center">{error}</p>
        <button onClick={fetchData} className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">Retry</button>
      </div>
    </div>
  );

  // ✅ Sahi keys use karo
  const { userStats, financialStats, transactionStats, planStats, recentActivity } = data;

  const StatCard = ({ icon: Icon, label, value, bgColor }) => (
    <div className={`${bgColor} border border-white/10 rounded-xl p-6 hover:border-purple-500/40 transition-all`}>
      <div className="flex justify-between mb-3 items-center">
        <Icon className="w-8 h-8 text-purple-400" />
      </div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value ?? 'N/A'}</p>
    </div>
  );

  const TransactionRow = ({ tx }) => (
    <div className="flex justify-between items-center py-4 px-4 text-sm hover:bg-white/5 transition-colors border-b border-white/5">
      <div>
        <p className="text-white font-medium capitalize">{tx.type}</p>
        <p className="text-gray-400">{tx.username}</p>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold">${parseFloat(tx.amount || 0).toLocaleString()}</p>
        <p className="text-gray-400 text-xs">{new Date(tx.created_at).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{tx.status}</span>
      </div>
    </div>
  );

  const PlanRow = ({ plan }) => (
    <div className="flex justify-between items-center py-3 px-4 border-b border-white/5 hover:bg-white/5">
      <p className="text-white text-sm">{plan.name}</p>
      <span className="text-purple-400 font-semibold">{plan.users} users</span>
    </div>
  );

  const ActivityRow = ({ user }) => (
    <div className="flex justify-between items-center py-3 px-4 border-b border-white/5 hover:bg-white/5">
      <div>
        <p className="text-white text-sm font-medium">{user.username}</p>
        <p className="text-gray-400 text-xs">{user.email}</p>
      </div>
      <p className="text-gray-400 text-xs">{new Date(user.created_at).toLocaleDateString()}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-white">Token Dashboard</h1>
          <p className="text-gray-400 text-lg mt-1">Live Stats & Analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard bgColor="bg-blue-900/60" icon={Users} label="Total Users" value={userStats?.totalUsers} />
          <StatCard bgColor="bg-green-900/60" icon={Activity} label="Active Users" value={userStats?.activeUsers} />
          <StatCard bgColor="bg-pink-900/60" icon={DollarSign} label="Total Deposits" value={`$${parseFloat(financialStats?.totalDeposits?.total || 0).toLocaleString()}`} />
          <StatCard bgColor="bg-amber-900/60" icon={Lock} label="Total Withdrawals" value={`$${parseFloat(financialStats?.totalWithdrawals?.total || 0).toLocaleString()}`} />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard bgColor="bg-purple-900/60" icon={Activity} label="Blocked Users" value={userStats?.blockedUsers} />
          <StatCard bgColor="bg-red-900/60" icon={DollarSign} label="Total ROI Distributed" value={`$${parseFloat(financialStats?.totalROIDistributed?.total || 0).toLocaleString()}`} />
          <StatCard bgColor="bg-teal-900/60" icon={Lock} label="Total Investments" value={`$${parseFloat(data?.investmentStats?.total || 0).toLocaleString()}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Membership Plans */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Membership Plans</h2>
            <div className="bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden">
              {planStats?.map((plan, i) => <PlanRow key={i} plan={plan} />)}
            </div>
          </div>

          {/* Recent Signups */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">Recent Signups</h2>
            <div className="bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden">
              {recentActivity?.map((user, i) => <ActivityRow key={i} user={user} />)}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <h2 className="text-xl font-bold text-white mb-3">Recent Transactions</h2>
        <div className="bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden">
          {transactionStats?.topTransactions?.map((tx, i) => <TransactionRow key={i} tx={tx} />)}
        </div>

      </div>
    </div>
  );
}