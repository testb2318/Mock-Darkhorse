
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Lock, Shield, Zap, Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../api/axiosInstance';

export default function UserWallet() {
    const { auth } = useSelector(state => state.auth);
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const id = auth?.id || auth?.user?.id || auth?.userId;

    useEffect(() => {
        if (id) {
            if (typeof id === 'object') {
                setError(`Invalid ID format: ID is an object`);
                setLoading(false);
            } else {
                fetchWalletData(id);
            }
        } else {
            setError('User ID not found. Please login again.');
            setLoading(false);
        }
    }, [id]);

    const fetchWalletData = async (userId) => {
        try {
            setLoading(true);
            const res = await api.get(`/wallet/user/${id}`);
            const data = res.data;
            if (data.success) {
                setWalletData(data.wallet);
            } else {
                setError('Failed to fetch wallet data');
            }
        } catch (err) {
            setError('Error connecting to API');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center animate-pulse">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-400 font-bold tracking-widest text-xs uppercase">Syncing Wallet...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center animate-fadeIn">
                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 max-w-md text-center backdrop-blur-xl">
                    <Shield className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-white mb-2">Secure Connection Failed</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">{error}</p>
                    <button onClick={() => fetchWalletData(id)} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20">
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    if (!walletData) return null;

    const statsCards = [
        { label: 'Total Earned', value: walletData.total_earned, icon: ArrowDownToLine, color: '#10b981', gradient: 'from-emerald-500/20' },
        { label: 'Total Withdrawn', value: walletData.total_withdrawn, icon: ArrowUpFromLine, color: '#f43f5e', gradient: 'from-rose-500/20' },
        { label: 'Total Invested', value: walletData.total_invested, icon: Globe, color: '#3b82f6', gradient: 'from-blue-500/20' },
        { label: 'Withdrawal Limit', value: walletData.withdrawal_limit, icon: Lock, color: '#f59e0b', gradient: 'from-amber-500/20' }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-slideUp">

            {/* Main Premium Container */}
            <div className="rounded-[2.5rem] bg-[#03081c]/60 border border-white/5 shadow-2xl backdrop-blur-2xl overflow-hidden relative">

                {/* Animated Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px] animate-pulse delay-700"></div>

                {/* Header Section */}
                <div className="relative px-8 py-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Wallet className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Wallet Assets</h2>
                            <p className="text-xs text-blue-400/60 font-bold uppercase tracking-[0.2em]">Live Portfolio Monitor</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full group hover:bg-emerald-500/20 transition-all cursor-default">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Network Secure</span>
                    </div>
                </div>

                <div className="p-8">
                    {/* Featured ROI Balance Card - High Importance */}
                    <div className="relative overflow-hidden rounded-[2rem] border-2 border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent p-8 mb-8 group transition-all duration-500 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(37,99,235,0.1)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-shimmer" />

                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="p-5 rounded-2xl bg-blue-500/20 border border-blue-400/30 shadow-inner">
                                    <TrendingUp className="w-10 h-10 text-blue-400 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Compound ROI Balance</p>
                                    <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                                        {formatCurrency(walletData.roi_balance)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                                <span className="text-sm font-black text-white uppercase tracking-tighter">Growth Active</span>
                            </div>
                        </div>

                        {/* Animated Visual Progress Bar */}
                        <div className="mt-8 relative">
                            <div className="flex justify-between text-[10px] font-bold text-blue-400/50 uppercase tracking-[0.2em] mb-2 px-1">
                                <span>Performance</span>
                                <span>Optimal</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full w-[75%] shadow-[0_0_15px_rgba(37,99,235,0.5)] relative">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progressStripes_1s_linear_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Secondary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/10 shadow-xl`}>
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-2xl -mr-8 -mt-8`} />

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-slate-800/50 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                                            <Icon className="w-5 h-5 transition-colors" style={{ color: stat.color }} />
                                        </div>
                                    </div>

                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-300 transition-colors">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white tracking-tight group-hover:scale-105 origin-left transition-transform duration-500">
                                        {formatCurrency(stat.value)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer / Meta Info */}
                <div className="px-8 py-5 bg-black/20 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vault Status: Encrypted</span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                Updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest italic">
                            System Currency: USD
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes progressStripes {
                    from { background-position: 1rem 0; }
                    to { background-position: 0 0; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-shimmer { animation: shimmer 2s infinite linear; }
                .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
            `}</style>
        </div>
    );
}