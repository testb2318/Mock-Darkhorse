import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, DollarSign, Activity, X, Check, AlertCircle } from 'lucide-react';

const TokenManager = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedToken, setSelectedToken] = useState(null);
  const [formData, setFormData] = useState({
    token_name: '',
    contract_address: '',
    initial_price: '',
    current_price: '',
    symbol: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = 'https://api.Mock.ceo/api/v1/tokens';

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      if (data.success) {
        setTokens(data.data);
      } else {
        setError(data.message || 'Failed to fetch tokens');
      }
    } catch {
      setError('Network error. Please check your connection.');
    }
    setLoading(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.token_name.trim()) errors.token_name = 'Token name is required';
    if (modalMode === 'create' && !formData.contract_address.trim()) {
      errors.contract_address = 'Contract address is required';
    }
    if (modalMode === 'create' && !formData.initial_price) {
      errors.initial_price = 'Initial price is required';
    }
    if (modalMode === 'update' && !formData.current_price) {
      errors.current_price = 'Current price is required';
    }
    if (!formData.symbol.trim()) errors.symbol = 'Symbol is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ token_name: '', contract_address: '', initial_price: '', current_price: '', symbol: '', is_active: true });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (token) => {
    setModalMode('update');
    setSelectedToken(token);
    setFormData({
      token_name: token.token_name,
      contract_address: token.contract_address,
      initial_price: token.initial_price,
      current_price: token.current_price,
      symbol: token.symbol,
      is_active: token.is_active
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const url = modalMode === 'create'
        ? API_BASE
        : `${API_BASE}/${selectedToken.id}`;

      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const body = modalMode === 'create'
        ? {
          token_name: formData.token_name,
          contract_address: formData.contract_address,
          initial_price: parseFloat(formData.initial_price),
          symbol: formData.symbol
        }
        : {
          token_name: formData.token_name,
          current_price: parseFloat(formData.current_price),
          symbol: formData.symbol,
          is_active: formData.is_active
        };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(modalMode === 'create' ? 'Token Created!' : 'Token Updated!');
        setShowModal(false);
        fetchTokens();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this token?')) return;
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setSuccess('Deleted Successfully!');
        fetchTokens();
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className=" bg-black p-4 text-white">
      <div className="max-w-7xl mx-auto bg-[#0F0F0F] rounded-md">
        <div className='flex justify-between gap-4 border-b p-4  border-white/10 items-center'>
          <div >
            <h1 className="text-2xl font-bold">Token Management</h1>
            <p className="text-gray-400 mt-1">Create, update, and manage your tokens</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-[#D4AF37] hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg mb-6"
          >
            <Plus className="w-5 h-5" /> Create New Token
          </button>
        </div>
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-600/10 border border-red-600 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5" /> {success}
          </div>
        )}



        {/* Token Cards */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-lg">
            <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No Tokens Yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {tokens.map((token) => (
              <div key={token.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-[#F5C518]/40 transition-all"
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{token.token_name}</h3>
                    <p className="text-[#F5C518] text-sm">{token.symbol}</p>
                  </div>
                  <div>
                    <span className={`px-5 py-1 rounded-full flex items-center text-xs ${token.is_active ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                      }`}>
                      {token.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="text-gray-300 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Current:</span>
                    <span>${parseFloat(token.current_price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Initial:</span>
                    <span>${parseFloat(token.initial_price).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-gray-400 px-3 pt-[2px] rounded-full bg-[#060606] text-sm font-mono truncate mb-4">
                  {token.contract_address}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(token)}
                    className="flex-1 bg-[#D4AF37] hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(token.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md w-full shadow-lg">

              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">{modalMode === 'create' ? "Create Token" : "Update Token"}</h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Token Name */}
                <input
                  name="token_name"
                  value={formData.token_name}
                  onChange={handleInputChange}
                  placeholder="Token Name"
                  className={`w-full bg-black border ${formErrors.token_name ? 'border-red-600' : 'border-neutral-700'
                    } rounded-lg p-2 text-white`}
                />

                {/* Symbol */}
                <input
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="Symbol"
                  className={`w-full bg-black border ${formErrors.symbol ? 'border-red-600' : 'border-neutral-700'
                    } rounded-lg p-2 text-white`}
                />

                {modalMode === 'create' && (
                  <>
                    <input
                      name="contract_address"
                      value={formData.contract_address}
                      onChange={handleInputChange}
                      placeholder="Contract Address"
                      className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-white font-mono text-sm"
                    />
                    <input
                      type="number"
                      step="0.00001"
                      name="initial_price"
                      value={formData.initial_price}
                      onChange={handleInputChange}
                      placeholder="Initial Price"
                      className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-white"
                    />
                  </>
                )}

                {modalMode === 'update' && (
                  <>
                    <input
                      type="number"
                      step="0.00001"
                      name="current_price"
                      value={formData.current_price}
                      onChange={handleInputChange}
                      placeholder="Current Price"
                      className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-white"
                    />

                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      Active
                    </label>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 rounded-lg p-2"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="flex-1 bg-[#D4AF37] hover:bg-blue-700 rounded-lg p-2"
                  >
                    {submitting ? "Please Wait..." : modalMode === 'create' ? "Create" : "Update"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TokenManager;