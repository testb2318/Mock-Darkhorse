import { useState } from "react";
import BEP20QR from "./BEP20QR";
import { Upload, CheckCircle, AlertCircle, Clock, ArrowRight, Wallet, CreditCard, Shield } from "lucide-react";

export default function DepositForm({ transactions, user }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formValues, setFormValues] = useState({
    amount: "",
    currency: "USDT",
    hash: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currencies = [
    { value: "USDT", label: "USDT (BEP-20)", icon: "₿" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formValues.amount) <= 0) {
      newErrors.amount = "Amount must be positive";
    } else if (parseFloat(formValues.amount) < 10) {
      newErrors.amount = "Minimum deposit amount is 10 USDT";
    }

    if (!formValues.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!fileName) {
      newErrors.image = "Proof of payment is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        image: "File size exceeds 5MB limit",
      });
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("amount", formValues.amount);
      formData.append("currency", formValues.currency);
      formData.append("user_id", user?.id);
      if (formValues.hash) formData.append("hash", formValues.hash);
      if (document.getElementById("image").files[0]) {
        formData.append("image", document.getElementById("image").files[0]);
      }

      const response = await fetch("https://api.growzy.tech/api/v1/deposite/manual", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormValues({ amount: "", currency: "USDT", hash: "" });
        setFileName("");
        setPreviewImage(null);
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "Failed to submit deposit" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred while processing your request" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "complete":
        return { color: "bg-green-500/10 text-green-400 border-green-500/30", icon: <CheckCircle className="w-3 h-3" /> };
      case "pending":
        return { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> };
      case "rejected":
        return { color: "bg-red-500/10 text-red-400 border-red-500/30", icon: <AlertCircle className="w-3 h-3" /> };
      default:
        return { color: "bg-gray-500/10 text-gray-400 border-gray-500/30", icon: null };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl overflow-hidden">
        {isSubmitted ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#00f5c3]/10 border border-[#00f5c3]/30 mb-6">
              <CheckCircle className="h-10 w-10 text-[#00f5c3]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Deposit Request Submitted!</h2>
            <p className="text-gray-400 mb-6">
              Your deposit request has been successfully submitted and is pending approval.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2 bg-[#00f5c3] text-black font-medium rounded-lg hover:bg-[#00d9a8] transition-all duration-300"
            >
              Submit Another Deposit
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Form */}
            <div className="w-full lg:w-3/5 p-6 border-r border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#00f5c3]/10 rounded-xl">
                  <Wallet className="w-6 h-6 text-[#00f5c3]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
                  <p className="text-sm text-gray-500">Add funds to your account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount <span className="text-[#00f5c3]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={formValues.amount}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-2.5 bg-gray-800/50 border ${
                        errors.amount ? "border-red-500" : "border-gray-700"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5c3] transition-colors`}
                      placeholder="Enter deposit amount"
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>

                {/* Currency Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency <span className="text-[#00f5c3]">*</span>
                  </label>
                  <select
                    name="currency"
                    value={formValues.currency}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-800/50 border ${
                      errors.currency ? "border-red-500" : "border-gray-700"
                    } rounded-lg text-white focus:outline-none focus:border-[#00f5c3] transition-colors`}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency}</p>}
                </div>

                {/* Hash Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transaction Hash <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="hash"
                    value={formValues.hash}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00f5c3] transition-colors"
                    placeholder="Enter transaction hash"
                  />
                  <p className="text-xs text-gray-500 mt-1">For cryptocurrency deposits, please provide the transaction hash</p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Proof of Payment <span className="text-[#00f5c3]">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:border-[#00f5c3]/50 transition-all duration-300 cursor-pointer">
                      Choose File
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                      />
                    </label>
                    <span className="text-sm text-gray-500 truncate">{fileName || "No file chosen"}</span>
                  </div>
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: JPEG, PNG, PDF. Max size: 5MB</p>
                </div>

                {/* Preview */}
                {previewImage && (
                  <div className="mt-3">
                    <img src={previewImage} alt="Preview" className="max-h-32 rounded-lg border border-gray-700" />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-[#00f5c3] to-[#00d9a8] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00f5c3]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Deposit <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Info */}
            <div className="w-full lg:w-2/5 p-6 bg-gray-800/20">
              <div className="space-y-6">
                {/* Deposit Information */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#00f5c3]" />
                    Deposit Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="w-8 h-8 rounded-full bg-[#00f5c3]/10 flex items-center justify-center">
                        <span className="text-[#00f5c3] text-sm">$</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Minimum Deposit</p>
                        <p className="text-sm font-semibold text-white">10 USDT</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="w-8 h-8 rounded-full bg-[#00f5c3]/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#00f5c3]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Processing Time</p>
                        <p className="text-sm font-semibold text-white">1-2 Business Days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="w-8 h-8 rounded-full bg-[#00f5c3]/10 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-[#00f5c3]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Proof Required</p>
                        <p className="text-sm font-semibold text-white">Payment Screenshot</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BEP20 QR */}
                <BEP20QR />

                {/* Recent Deposits */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Recent Deposits</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {transactions && transactions.length > 0 ? (
                      transactions.slice(-5).reverse().map((transaction) => {
                        const status = getStatusBadge(transaction.status);
                        return (
                          <div key={transaction.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-white">
                                ${transaction.amount} {transaction.currency}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                                {status.icon}
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAT).toLocaleDateString()}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">No transactions found</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}