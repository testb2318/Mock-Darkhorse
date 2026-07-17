import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  User, Mail, Calendar, Key, Copy, CheckCircle,
  XCircle, Shield, Briefcase, DollarSign, Wallet,
  Link as LinkIcon, Network, Save, Lock
} from "lucide-react";
import Loader from "@/components/common/Loader";
import SuccessAlert from "@/components/common/SuccessAlert";
import ErrorAlert from "@/components/common/ErrorAlert";
import {
  getUser,
  updateUsers,
  clearErrors,
  clearMessage,
} from "@/redux/userSlice";
import api from "../../api/axiosInstance";

export default function UserDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleuser, loading, error, message } = useSelector(
    (state) => state.users,
  );
  const { admin } = useSelector((state) => state.auth);

  const [editUser, setEditUser] = useState([]);

  // OTP States
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

  //  FIX 1: Sirf id change hone pe getUser call karo
  useEffect(() => {
    dispatch(getUser(id));
  }, [id]);

  // ✅ FIX 2: Error alag useEffect mein clear karo
  useEffect(() => {
    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
  }, [error]);

  // ✅ FIX 3: Message alag useEffect mein clear karo
  useEffect(() => {
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [message]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendOTP = async () => {
    try {
      setOtpLoading(true);
      setOtpError("");
      const res = await api.post("/auth/verification");
      const data = res.data;

      if (data?.success !== false) {
        setShowOtpSection(true);
        setOtpSuccess(data?.message || "OTP sent successfully to your email");
        setResendTimer(60);
        setTimeout(() => setOtpSuccess(""), 3000);
        setTimeout(() => {
          document.getElementById("otp-section")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        setOtpError(data?.message || data?.error || "Failed to send OTP");
        setTimeout(() => setOtpError(""), 3000);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Network error. Please try again.";
      setOtpError(msg);
      setTimeout(() => setOtpError(""), 3000);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setOtpError("Please enter complete OTP");
      setTimeout(() => setOtpError(""), 3000);
      return;
    }

    try {
      setOtpLoading(true);
      setOtpError("");
      const res = await api.post("/auth/otp-code", { otp: otpCode });
      const data = res.data;

      if (data?.success) {
        setOtpSuccess(data?.message || "OTP verified successfully!");
        setTimeout(() => {
          dispatch(updateUsers({ id: id, updatedData: pendingUpdateData }));
          setShowOtpSection(false);
          setOtp(["", "", "", "", "", ""]);
          setPendingUpdateData(null);
          setOtpError("");
          setOtpSuccess("");
        }, 1000);
      } else {
        const errorMessage = data?.error || data?.message || "Invalid OTP";
        setOtpError(errorMessage);
        setTimeout(() => setOtpError(""), 3000);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Network error. Please try again.";
      setOtpError(msg);
      setTimeout(() => setOtpError(""), 3000);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      setTimeout(() => {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }, 10);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    setTimeout(() => {
      document.getElementById(`otp-${focusIndex}`)?.focus();
    }, 10);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        setTimeout(() => {
          document.getElementById(`otp-${index - 1}`)?.focus();
        }, 10);
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (Object.keys(editUser).length === 0) {
      alert("Please make some changes before saving");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to update ${singleuser?.username}'s details?`,
    );
    if (!confirmed) return;
    setPendingUpdateData({ ...editUser, updated_at: new Date().toISOString() });
    await sendOTP();
  };

  const handleCancelOtp = () => {
    setShowOtpSection(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess("");
    setPendingUpdateData(null);
    setResendTimer(0);
  };

  return (
    <>
      <div className={`${loading ? "h-[560px] items-center justify-center flex" : "min-h-screen"} bg-gradient-to-br from-black via-slate-900 to-[#0a0a0a] p-2 sm:p-4 md:p-5 font-sans`}>
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-[#F5C518]/20 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-slate-400 text-sm font-medium tracking-wide">Loading user details...</span>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-4">

            {/* Header Actions & Alerts */}
            <div className="flex flex-col gap-3">
              {message && <SuccessAlert message={message} />}
              {error && <ErrorAlert error={error} />}
            </div>

            {/* Profile Hero Header */}
            <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Gradient Banner */}
              <div className="h-20 sm:h-28 w-full bg-gradient-to-r from-[#D4AF37]/40 via-purple-600/40 to-cyan-600/40 opacity-80" />

              <div className="px-5 pb-5 sm:px-8 sm:pb-8 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 sm:-mt-14">
                  {/* Avatar */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#0a0a0a] p-1.5 shadow-2xl border border-white/10 flex-shrink-0 relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5 overflow-hidden">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500" />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-slate-900 shadow-lg shadow-emerald-500/50" title="Active"></div>
                  </div>

                  {/* Identity */}
                  <div className="flex-1 pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight capitalize drop-shadow-md">
                        {singleuser?.username || "Unknown User"}
                      </h1>
                      <span className="px-2.5 py-0.5 bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/20 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit">
                        {singleuser?.role || "User"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {singleuser?.email || "No email provided"}
                    </p>
                  </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Team</span>
                    <span className="text-lg sm:text-xl font-bold text-amber-400 flex items-center gap-1.5">
                      <Network className="w-4 h-4 text-amber-500/70" />
                      {singleuser?.total_team || "0"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ROI / Day</span>
                    <span className="text-lg sm:text-xl font-bold text-cyan-400 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-cyan-500/70" />
                      {singleuser?.roi_day || "0.00"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Paid Member</span>
                    <span className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
                      <Shield className={`w-4 h-4 ${singleuser?.paid_member === 'yes' ? 'text-emerald-400' : 'text-slate-500'}`} />
                      {singleuser?.paid_member || "No"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Referral Code</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base sm:text-lg font-bold text-[#F5C518] font-mono tracking-wider">
                        {singleuser?.refferal_code || "N/A"}
                      </span>
                      <button className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white" onClick={() => { navigator.clipboard.writeText(singleuser?.refferal_code || ""); alert("Copied!"); }}>
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Read-Only Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {/* Card 1: Dates & Activity */}
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg p-4 sm:p-5 hover:bg-white/[0.07] transition-colors duration-300">
                <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
                  <div className="p-2 bg-[#F5C518]/10 rounded-lg text-[#F5C518]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-wide">Activity Log</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center group">
                    <span className="text-xs font-medium text-slate-400">Last Login</span>
                    <span className="text-xs font-semibold text-white group-hover:text-[#F5C518] transition-colors">{singleuser?.last_login || " - "}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-xs font-medium text-slate-400">Created At</span>
                    <span className="text-xs font-semibold text-white group-hover:text-[#F5C518] transition-colors">{singleuser?.created_at || " - "}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-xs font-medium text-slate-400">Verified At</span>
                    <span className="text-xs font-semibold text-white group-hover:text-[#F5C518] transition-colors">{singleuser?.verify_at || " - "}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-xs font-medium text-slate-400">Updated At</span>
                    <span className="text-xs font-semibold text-white group-hover:text-[#F5C518] transition-colors">{singleuser?.updated_at || " - "}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-xs font-medium text-slate-400">Activation Date</span>
                    <span className="text-xs font-semibold text-white group-hover:text-[#F5C518] transition-colors">{singleuser?.activation_date || " - "}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Network & Affiliation */}
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg p-4 sm:p-5 hover:bg-white/[0.07] transition-colors duration-300">
                <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-wide">Network & Affiliation</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center group">
                    <span className="text-xs font-medium text-slate-400">Referred By</span>
                    <span className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">{singleuser?.reffer_by || " - "}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-xs font-medium text-slate-400">Level / Month</span>
                    <span className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">{singleuser?.level_month || " - "}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Financial Details */}
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg p-4 sm:p-5 hover:bg-white/[0.07] transition-colors duration-300 xl:col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-wide">Crypto Wallets</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">BEP20 Address</span>
                    <div className="p-2.5 bg-[#0a0a0a]/50 rounded-xl border border-white/5 text-xs text-slate-300 font-mono break-all hover:border-emerald-500/30 transition-colors group relative">
                      {singleuser?.bep20 || "No address linked"}
                      {singleuser?.bep20 && (
                        <button className="absolute right-1.5 top-1.5 p-1 bg-[#111] rounded text-slate-400 hover:text-white" onClick={() => { navigator.clipboard.writeText(singleuser?.bep20); alert("Copied!"); }}>
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Editable Section / Settings Panel */}
            {!showOtpSection && (
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden mt-4">
                <div className="border-b border-white/5 bg-white/[0.02] px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
                  <div className="p-2 bg-[#F5C518]/10 rounded-lg text-[#F5C518] shadow-inner">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">Account Settings</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Manage user profile, statuses, and balances</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

                    {/* Form Group: Identity */}
                    <div className="col-span-full mb-1">
                      <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest border-b border-white/5 pb-1.5">Identity & Access</h3>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Username</label>
                      <input type="text" name="username" defaultValue={singleuser?.username} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
                      <input type="email" name="email" defaultValue={singleuser?.email} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                      <input type="text" name="password" defaultValue={singleuser?.password} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</label>
                      <select name="role" disabled defaultValue={singleuser?.role} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-slate-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed appearance-none">
                        <option value="user" className="bg-[#0a0a0a]">User</option>
                        <option value="admin" className="bg-[#0a0a0a]">Admin</option>
                      </select>
                    </div>

                    {/* Form Group: Statuses */}
                    <div className="col-span-full mt-3 mb-1">
                      <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest border-b border-white/5 pb-1.5">Account Statuses</h3>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account Status</label>
                      <select name="status" defaultValue={singleuser?.status} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner appearance-none cursor-pointer">
                        <option value="unblock" className="bg-[#0a0a0a]">Unblocked</option>
                        <option value="block" className="bg-[#0a0a0a] text-rose-400">Blocked</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Is Active</label>
                      <select name="is_active" defaultValue={singleuser?.is_active} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner appearance-none cursor-pointer">
                        <option value="active" className="bg-[#0a0a0a]">Active</option>
                        <option value="inactive" className="bg-[#0a0a0a] text-amber-400">Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">ROI Status</label>
                      <select name="roi_status" defaultValue={singleuser?.roi_status} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner appearance-none cursor-pointer">
                        <option value="open" className="bg-[#0a0a0a]">Open</option>
                        <option value="close" className="bg-[#0a0a0a] text-rose-400">Close</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Level Status</label>
                      <select name="level_status" defaultValue={singleuser?.level_status} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner appearance-none cursor-pointer">
                        <option value="open" className="bg-[#0a0a0a]">Open</option>
                        <option value="close" className="bg-[#0a0a0a] text-rose-400">Close</option>
                      </select>
                    </div>

                    {/* Form Group: Personal & Financial */}
                    <div className="col-span-full mt-3 mb-1">
                      <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest border-b border-white/5 pb-1.5">Personal & Financials</h3>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input type="text" name="fullname" defaultValue={singleuser?.fullname || ""} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</label>
                      <input type="number" name="phone" defaultValue={singleuser?.phone || ""} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>
                    {/* <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address</label>
                      <input type="text" name="address" defaultValue={singleuser?.address || ""} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div> */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Business</label>
                      <input type="number" name="business" defaultValue={singleuser?.business || ""} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>
                    {/* <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Business Balance</label>
                      <input type="number" name="business_balance" defaultValue={singleuser?.business_balance || ""} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div> */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Wallet Address (BEP20)</label>
                      <input type="text" name="bep20" defaultValue={singleuser?.bep20 || ""} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Referred By</label>
                      <input type="text" disabled name="reffer_by" defaultValue={singleuser?.reffer_by} onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#0a0a0a]/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all shadow-inner" />
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex justify-end mt-6 pt-4 border-t border-white/5">
                    <button
                      className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-white rounded-lg hover:from-[#F5C518] hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 min-w-[160px] justify-center text-sm font-semibold shadow-lg shadow-[#F5C518]/25 group"
                      onClick={handleSaveChanges}
                      disabled={otpLoading || loading}
                    >
                      {otpLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Secure OTP Verification Section */}
            {showOtpSection && (
              <div id="otp-section" className="rounded-2xl bg-[#0a0a0a] border border-[#F5C518]/20 shadow-[0_0_40px_-12px_rgba(59,130,246,0.25)] overflow-hidden mt-6 max-w-xl mx-auto relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-24 bg-[#F5C518]/10 blur-2xl pointer-events-none rounded-full"></div>

                <div className="p-6 sm:p-8 relative z-10">
                  <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#F5C518]/10 flex items-center justify-center border border-[#F5C518]/20 shadow-inner">
                      <Lock className="w-6 h-6 text-[#F5C518]" />
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                      Security Verification
                    </h2>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-sm mx-auto">
                      To protect this account, please enter the 6-digit authorization code sent to
                      <br />
                      <span className="font-semibold text-[#F5C518] inline-block mt-1 px-2.5 py-0.5 bg-[#F5C518]/10 rounded border border-[#F5C518]/20">{admin?.email}</span>
                    </p>
                  </div>

                  {otpError && (
                    <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <p className="text-rose-300 text-xs font-medium">{otpError}</p>
                    </div>
                  )}
                  {otpSuccess && (
                    <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <p className="text-emerald-300 text-xs font-medium">{otpSuccess}</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        disabled={otpLoading}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-slate-950 border-2 border-white/10 text-white rounded-lg focus:outline-none focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="text-center text-xs mb-8">
                    {resendTimer > 0 ? (
                      <p className="text-slate-400 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Resend code available in <span className="font-bold text-amber-400 font-mono text-sm">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button onClick={sendOTP} disabled={otpLoading}
                        className="text-[#F5C518] hover:text-[#f0d060] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-[#F5C518]/10">
                        {otpLoading && <div className="w-3.5 h-3.5 border-2 border-[#F5C518]/30 border-t-blue-400 rounded-full animate-spin"></div>}
                        Resend Authorization Code
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button type="button" onClick={handleCancelOtp} disabled={otpLoading}
                      className="w-full justify-center rounded-lg bg-[#111] border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 shadow-sm hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      Cancel Update
                    </button>
                    <button onClick={handleVerifyOTP} disabled={otpLoading || otp.some((d) => !d)}
                      className="w-full justify-center rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5C518] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#F5C518]/25 hover:from-[#F5C518] hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group">
                      {otpLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Verify & Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}
