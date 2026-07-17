


import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, Calendar, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux'

const TokenTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user_id = useSelector((state) => state.auth.auth.id)
    const [filters, setFilters] = useState({
        transaction_type: '',
        token_id: '',
        user_id,
        start_date: '',
        end_date: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10
    });
    const [showFilters, setShowFilters] = useState(false);
    const [tokens, setTokens] = useState([]);

    const transactionTypes = ['deposit', 'purchase', 'stake', 'unstake', 'reward', 'transfer'];

    useEffect(() => {
        fetchTokens();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [filters.page]);

    const fetchTokens = async () => {
        try {
            const response = await fetch('/api/tokens', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTokens(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching tokens:', err);
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await fetch(`https://api.Mock.ceo/api/v1/token-transactions?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setTransactions(data.data);
                setPagination(data.pagination);
            } else {
                setError(data.message || 'Failed to fetch transactions');
            }
        } catch (err) {
            setError('An error occurred while fetching transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleApplyFilters = () => {
        fetchTransactions();
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        setFilters({
            transaction_type: '',
            token_id: '',
            start_date: '',
            end_date: '',
            page: 1,
            limit: 10,
            user_id: user_id
        });
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const getTypeColor = (type) => {
        const colors = {
            deposit: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            purchase: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            stake: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            unstake: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            reward: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            transfer: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
        };
        return colors[type] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 p-4 md:p-6">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-[1600px] mx-auto">
                <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                                        Token Transactions
                                    </h1>
                                    <p className="text-sm text-slate-400 mt-0.5">
                                        {pagination.totalRecords} total transactions
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/25"
                            >
                                <Filter size={18} />
                                Filters
                                {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="p-6 bg-white/5 border-b border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Transaction Type
                                    </label>
                                    <select
                                        value={filters.transaction_type}
                                        onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-white/10 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="">All Types</option>
                                        {transactionTypes.map(type => (
                                            <option key={type} value={type} className="text-black">
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Token
                                    </label>
                                    <select
                                        value={filters.token_id}
                                        onChange={(e) => handleFilterChange('token_id', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-white/10 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="">All Tokens</option>
                                        {tokens.map(token => (
                                            <option key={token.id} value={token.id} className="text-black">
                                                {token.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.start_date}
                                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-white/10 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={filters.end_date}
                                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-white/10 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={handleApplyFilters}
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-5 py-2 bg-white/10 border border-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin text-blue-400" size={40} />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-rose-400">{error}</p>
                                <button
                                    onClick={fetchTransactions}
                                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <p className="text-slate-400">No transactions found</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/5">
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Token</th>
                                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">USD Value</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {transactions.map((tx, index) => (
                                                <tr key={tx.id} className="hover:bg-white/5 transition-all duration-300">
                                                    <td className="py-4 px-4 text-sm text-blue-400 font-mono">
                                                        #{index + 1}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeColor(tx.transaction_type)}`}>
                                                            {tx.transaction_type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-white">
                                                        {tx.token_name || `Token #${tx.token_id}`}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-right font-medium text-white">
                                                        {parseFloat(tx.amount).toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-right text-emerald-400 font-semibold">
                                                        ${parseFloat(tx.usd_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-slate-400">
                                                        {tx.description || '-'}
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-slate-400">
                                                        {formatDate(tx.transaction_date)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-4">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeColor(tx.transaction_type)}`}>
                                                    {tx.transaction_type}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {formatDate(tx.transaction_date)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-400">Token:</span>
                                                    <span className="text-sm font-medium text-white">
                                                        {tx.token_name || `Token #${tx.token_id}`}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-400">Amount:</span>
                                                    <span className="text-sm font-medium text-white">
                                                        {parseFloat(tx.amount).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-slate-400">USD Value:</span>
                                                    <span className="text-sm font-semibold text-emerald-400">
                                                        ${parseFloat(tx.usd_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                                {tx.description && (
                                                    <div className="pt-2 border-t border-white/10">
                                                        <span className="text-sm text-slate-400">{tx.description}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                                        <div className="text-sm text-slate-400">
                                            Page {pagination.currentPage} of {pagination.totalPages}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={pagination.currentPage === 1}
                                                className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenTransactions;













