import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Shield,
  Mail,
  Key,
  Wallet,
  User,
  Calendar,
  Users,
  Check,
  Edit3,
  RotateCcw,
} from "lucide-react";
import {
  verifyEmailCode,
  sendUserVerificationEmail,
} from "../../redux/authSlice";
import { getMyProfile, updateMyProfile } from "../../redux/userSlice";

// Helper for professional Date/Time formatting
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center bg-transparent">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#F5C518]"></div>
  </div>
);

export default function Profile() {
  const dispatch = useDispatch();

  const { myprofile: singleuser, loading: userLoading } = useSelector(
    (state) => state.users,
  );
  const { loading: authLoading } = useSelector((state) => state.auth);

  const [editUser, setEditUser] = useState({});
  const [verificationStep, setVerificationStep] = useState("initial");
  const [otpCode, setOtpCode] = useState("");
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [verificationError, setVerificationError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (verificationStep !== "initial") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [verificationStep]);

  useEffect(() => {
    if (singleuser) {
      setEditUser({
        email: singleuser.email || "",
        phone: singleuser.phone || "",
        bep20: singleuser.bep20 || "",
      });
    }
  }, [singleuser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const hasChanges =
      editUser.email !== singleuser?.email ||
      editUser.phone !== singleuser?.phone ||
      editUser.bep20 !== singleuser?.bep20;

    if (!hasChanges) {
      alert("No changes detected");
      return;
    }

    const updatedData = {
      email: editUser.email,
      phone: editUser.phone,
      bep20: editUser.bep20,
      updated_at: new Date().toISOString(),
    };
    setPendingUpdates(updatedData);
    await sendVerificationCode();
    setVerificationStep("otp");
  };

  const sendVerificationCode = async () => {
    try {
      const result = await dispatch(
        sendUserVerificationEmail({ email: singleuser?.email }),
      );
      if (result.type.includes("fulfilled")) {
        setVerificationError("");
      } else {
        setVerificationError("Failed to send verification email");
      }
    } catch (error) {
      setVerificationError("Failed to send verification email");
    }
  };

  const handleOtpVerification = async () => {
    try {
      const result = await dispatch(
        verifyEmailCode({
          email: singleuser?.email,
          otp: otpCode,
          userId: auth?.id,
        }),
      );
      if (result.type.includes("fulfilled")) {
        setVerificationStep("updating");
        await performUpdate();
      } else {
        setVerificationError("Invalid verification code");
      }
    } catch (error) {
      setVerificationError("Verification failed");
    }
  };

  const performUpdate = async () => {
    try {
      const result = await dispatch(updateMyProfile(pendingUpdates));
      if (result.type.includes("fulfilled")) {
        setUpdateSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(result.error?.message || "Update failed");
      }
    } catch (error) {
      setVerificationError(error.message || "Update failed. Please try again.");
      setVerificationStep("otp");
    }
  };

  const resetVerification = () => {
    setVerificationStep("initial");
    setOtpCode("");
    setPendingUpdates({});
    setVerificationError("");
    setUpdateSuccess(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setEditUser({
      email: singleuser?.email || "",
      phone: singleuser?.phone || "",
      bep20: singleuser?.bep20 || "",
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditUser({
      email: singleuser?.email || "",
      phone: singleuser?.phone || "",
      bep20: singleuser?.bep20 || "",
    });
  };

  const renderVerificationModal = () => {
    if (verificationStep === "initial") return null;

    return (
      <div className="fixed inset-0 top-44 bg-black/80 backdrop-blur-md z-[100] p-4 font-sans overflow-y-auto custom-scroll">
        <div className="min-h-full flex items-center justify-center">
          <div className="bg-[#0a0a0a] border border-[#c9a227]/50 rounded-2xl w-full max-w-[380px] shadow-[0_0_40px_rgba(212,175,55,0.15)] flex flex-col overflow-hidden relative">
            {/* Subtle gold glow behind modal */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F5C518] to-transparent opacity-50"></div>

            <div className="p-6 sm:p-8 ">
              <div className="text-center mb-6 shrink-0 relative">
                <div className="w-16 h-16 bg-[#111] border border-[#F5C518]/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.1)] relative z-10">
                  {verificationStep === "otp" && (
                    <Key className="w-7 h-7 text-[#F5C518]" />
                  )}
                  {verificationStep === "updating" && !updateSuccess && (
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#F5C518]"></div>
                  )}
                  {verificationStep === "updating" && updateSuccess && (
                    <Check className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  )}
                </div>

                <h3 className="text-xl font-black text-white mb-1 tracking-tight">
                  {verificationStep === "otp" && "VERIFY EMAIL"}
                  {verificationStep === "updating" &&
                    !updateSuccess &&
                    "UPDATING..."}
                  {verificationStep === "updating" &&
                    updateSuccess &&
                    "SUCCESS!"}
                </h3>
                <p className="text-[#f0d060]/60 text-xs font-medium tracking-wide uppercase">
                  {verificationStep === "otp" &&
                    `Code sent to ${singleuser?.email}`}
                  {verificationStep === "updating" &&
                    !updateSuccess &&
                    "Syncing records..."}
                  {verificationStep === "updating" &&
                    updateSuccess &&
                    "Profile updated."}
                </p>
              </div>

              {verificationStep === "otp" && (
                <div className="space-y-5">
                  {verificationError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                      <p className="text-red-400 text-xs font-medium">
                        {verificationError}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-[#F5C518]/70 mb-2 uppercase tracking-[0.2em] text-center">
                      6-Digit OTP
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) =>
                        setOtpCode(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full px-4 py-3 text-[#f0d060] bg-[#111] border border-[#c9a227]/30 rounded-xl focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]/40 outline-none text-center text-2xl tracking-[0.4em] font-mono shadow-inner transition-all"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <h4 className="font-bold text-[#F5C518] text-[10px] mb-3 uppercase tracking-widest border-b border-white/10 pb-2">
                      Review Changes
                    </h4>
                    <div className="space-y-3 text-[11px] text-gray-300 font-medium">
                      {pendingUpdates.email !== singleuser?.email && (
                        <div className="flex flex-col gap-1">
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                            Email
                          </p>
                          <p className="flex justify-between items-center gap-2">
                            <span className="truncate opacity-50">
                              {singleuser?.email}
                            </span>
                            <span className="text-[#c9a227]">→</span>
                            <span className="text-white truncate font-semibold">
                              {pendingUpdates.email}
                            </span>
                          </p>
                        </div>
                      )}
                      {pendingUpdates.phone !== singleuser?.phone && (
                        <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-white/5">
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                            Phone
                          </p>
                          <p className="flex justify-between items-center gap-2">
                            <span className="opacity-50">
                              {singleuser?.phone || "None"}
                            </span>
                            <span className="text-[#c9a227]">→</span>
                            <span className="text-white font-semibold">
                              {pendingUpdates.phone}
                            </span>
                          </p>
                        </div>
                      )}
                      {pendingUpdates.bep20 !== singleuser?.bep20 && (
                        <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-white/5">
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                            BEP-20 Wallet
                          </p>
                          <p className="flex justify-between items-center gap-2">
                            <span className="opacity-50 font-mono">
                              {singleuser?.bep20
                                ? "..." + singleuser?.bep20.slice(-4)
                                : "None"}
                            </span>
                            <span className="text-[#c9a227]">→</span>
                            <span className="text-white font-semibold font-mono">
                              ...{pendingUpdates.bep20?.slice(-4)}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={handleOtpVerification}
                      disabled={otpCode.length !== 6 || authLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-black rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all font-black text-xs uppercase tracking-widest"
                    >
                      {authLoading ? "Verifying..." : "Confirm Update"}
                    </button>
                    <button
                      onClick={resetVerification}
                      className="w-full py-2.5 text-gray-500 hover:text-white transition-colors text-[11px] font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {verificationStep === "updating" && (
                <div className="text-center py-8">
                  {!updateSuccess ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5C518] mx-auto"></div>
                  ) : (
                    <p className="text-emerald-400 font-black tracking-[0.2em] uppercase text-sm animate-pulse">
                      Sync Complete
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (userLoading) return <Loader />;

  return (
    <div className="w-full bg-transparent p-3 sm:p-4 lg:p-6 text-gray-200 font-sans mt-4">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-[#c9a227]/20 p-2.5 rounded-xl border border-[#F5C518]/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <User className="text-[#F5C518] w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                USER <span className="text-[#F5C518]">PROFILE</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                Manage your account
              </p>
            </div>
          </div>
          <div className="hidden sm:block h-px flex-1 mx-8 bg-gradient-to-r from-[#c9a227]/40 to-transparent"></div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#F5C518]/10 blur-[50px] pointer-events-none"></div>
            <div className="relative z-10 p-6 sm:p-8">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border-2 border-[#F5C518]/20 bg-gradient-to-br from-[#c9a227]/20 to-transparent shadow-[inset_0_0_20px_rgba(212,175,55,0.1)] relative">
                  <User className="h-10 w-10 text-[#F5C518]" />
                  <div
                    className={`absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center ${singleuser?.active_plan ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h1 className="mt-5 text-2xl font-black text-white tracking-tight">
                  {singleuser?.username}
                </h1>
                <p className="text-[#f0d060]/70 text-[11px] font-bold uppercase tracking-widest mt-1">
                  {singleuser?.active_plan ? "Verified Member" : "Unverified"}
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center justify-between group hover:border-[#F5C518]/30 transition-colors">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                      Total Team
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                      {singleuser?.total_team || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-white/30 group-hover:text-[#F5C518]/40 transition-colors" />
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center justify-between group hover:border-[#F5C518]/30 transition-colors">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                      Referral Code
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#F5C518] tracking-wider">
                      {singleuser?.active_plan == 0
                        ? "INACTIVE"
                        : singleuser?.refferal_code}
                    </p>
                  </div>
                  <Key className="w-8 h-8 text-white/30 group-hover:text-[#F5C518]/40 transition-colors" />
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center justify-between group hover:border-[#F5C518]/30 transition-colors">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                      Referred By
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {singleuser?.reffer_by || "DIRECT"}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-white/30 group-hover:text-[#F5C518]/40 transition-colors" />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {isEditing && (
                  <button
                    onClick={cancelEdit}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={isEditing ? handleSaveChanges : toggleEditMode}
                  disabled={authLoading}
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C518] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                >
                  {authLoading && verificationStep === "initial" && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
                  )}
                  {isEditing
                    ? authLoading && verificationStep === "initial"
                      ? "SENDING CODE..."
                      : "VERIFY & UPDATE"
                    : "EDIT PROFILE"}
                </button>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            {/* Form Section */}
            <section className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="border-b border-white/10 px-8 py-6 bg-white/[0.02]">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-[#F5C518]" />
                  Profile Configuration
                </h2>
              </div>

              <div className="p-8 space-y-8">
                {isEditing && (
                  <div className="bg-[#F5C518]/10 border border-[#F5C518]/30 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#F5C518] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#f0d060] font-bold">
                        Security Verification Required
                      </p>
                      <p className="text-xs text-[#f0d060]/70 mt-1">
                        Changes to your profile require email OTP verification
                        to ensure account security.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        name="email"
                        type="email"
                        value={editUser.email || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`h-12 w-full rounded-xl border border-white/10 bg-black/50 pl-11 pr-4 text-sm text-white outline-none focus:border-[#F5C518]/50 focus:ring-1 focus:ring-[#F5C518]/30 transition-all ${!isEditing && "opacity-60 cursor-not-allowed bg-white/5"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        name="phone"
                        type="tel"
                        value={editUser.phone || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`h-12 w-full rounded-xl border border-white/10 bg-black/50 pl-11 pr-4 text-sm text-white outline-none focus:border-[#F5C518]/50 focus:ring-1 focus:ring-[#F5C518]/30 transition-all ${!isEditing && "opacity-60 cursor-not-allowed bg-white/5"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">
                    BEP-20 Wallet Address
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      name="bep20"
                      value={editUser.bep20 || ""}
                      onChange={handleChange}
                      disabled={!isEditing || !!singleuser?.bep20}
                      className={`h-12 w-full rounded-xl border border-white/10 bg-black/50 pl-11 pr-4 text-sm text-[#F5C518] outline-none focus:border-[#F5C518]/50 focus:ring-1 focus:ring-[#F5C518]/30 transition-all font-mono tracking-wide ${(!isEditing || !!singleuser?.bep20) && "opacity-60 cursor-not-allowed bg-white/5 text-gray-400"}`}
                    />
                  </div>
                  {singleuser?.bep20 && (
                    <p className="text-[10px] text-red-400/80 mt-2 ml-1 italic font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Linked wallet is permanent
                      and cannot be changed.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Timeline Section */}
            <section className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="border-b border-white/10 px-8 py-5 bg-white/[0.02]">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#F5C518]" />
                  Account Timeline
                </h2>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Last Login",
                    val: formatDate(singleuser?.last_login),
                  },
                  { label: "Created", val: formatDate(singleuser?.created_at) },
                  {
                    label: "Activation",
                    val: formatDate(singleuser?.activation_date),
                  },
                  {
                    label: "Modified",
                    val: formatDate(singleuser?.updated_at),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#c9a227]/20 group-hover:bg-[#F5C518] transition-colors"></div>
                    <p className="text-[9px] uppercase text-gray-500 tracking-[0.2em] font-bold mb-2">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-200 font-bold">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
      {renderVerificationModal()}
    </div>
  );
}

// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import {
//   Shield,
//   Mail,
//   Key,
//   Wallet,
//   User,
//   Calendar,
//   Users,
//   Check,
//   X,
//   Edit3,
//   RotateCcw,
// } from "lucide-react";
// import {
//   clearErrors,
//   clearMessage,
//   verifyEmailCode,
//   sendUserVerificationEmail,
// } from "../../redux/authSlice";
// import { getMyProfile, updateMyProfile } from "../../redux/userSlice";

// const Loader = () => (
//   <div className="flex items-center justify-center h-full">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//   </div>
// );

// export default function Profile() {
//   const dispatch = useDispatch();

//   // ✅ FIX 1: myprofile read karo, singleuser nahi
//   const { myprofile: singleuser, loading: userLoading } = useSelector((state) => state.users);
//   const { loading: authLoading } = useSelector((state) => state.auth);

//   const [editUser, setEditUser] = useState({});
//   const [verificationStep, setVerificationStep] = useState("initial");
//   const [otpCode, setOtpCode] = useState("");
//   const [pendingUpdates, setPendingUpdates] = useState({});
//   const [verificationError, setVerificationError] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   // ✅ FIX 2: getMyProfile dispatch karo — pehle ye tha hi nahi!
//   useEffect(() => {
//     dispatch(getMyProfile());
//   }, [dispatch]);

//   useEffect(() => {
//     if (singleuser) {
//       setEditUser({
//         email: singleuser.email || "",
//         phone: singleuser.phone || "",
//         bep20: singleuser.bep20 || "",
//       });
//     }
//   }, [singleuser]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSaveChanges = async () => {
//     const hasChanges =
//       editUser.email !== singleuser?.email ||
//       editUser.phone !== singleuser?.phone ||
//       editUser.bep20 !== singleuser?.bep20;

//     if (!hasChanges) {
//       alert("No changes detected");
//       return;
//     }

//     const updatedData = {
//       email: editUser.email,
//       phone: editUser.phone,
//       bep20: editUser.bep20,
//       updated_at: new Date().toISOString(),
//     };
//     setPendingUpdates(updatedData);
//     await sendVerificationCode();
//     setVerificationStep("otp");
//   };

//   const sendVerificationCode = async () => {
//     try {
//       const result = await dispatch(
//         sendUserVerificationEmail({ email: singleuser?.email })
//       );
//       if (result.type.includes("fulfilled")) {
//         setVerificationError("");
//       } else {
//         setVerificationError("Failed to send verification email");
//       }
//     } catch (error) {
//       setVerificationError("Failed to send verification email");
//     }
//   };

//   const handleOtpVerification = async () => {
//     try {
//       const result = await dispatch(
//         verifyEmailCode({ email: singleuser?.email, otp: otpCode })
//       );
//       if (result.type.includes("fulfilled")) {
//         setVerificationStep("updating");
//         await performUpdate();
//       } else {
//         setVerificationError("Invalid verification code");
//       }
//     } catch (error) {
//       setVerificationError("Verification failed");
//     }
//   };

//   const performUpdate = async () => {
//     try {
//       // ✅ FIX 3: updateMyProfile use karo (token-based), updateUsers(id) nahi
//       const result = await dispatch(updateMyProfile(pendingUpdates));

//       if (result.type.includes("fulfilled")) {
//         setUpdateSuccess(true);
//         setTimeout(() => {
//           window.location.reload();
//         }, 2000);
//       } else {
//         throw new Error(result.error?.message || "Update failed");
//       }
//     } catch (error) {
//       setVerificationError(error.message || "Update failed. Please try again.");
//       setVerificationStep("otp");
//     }
//   };

//   const resetVerification = () => {
//     setVerificationStep("initial");
//     setOtpCode("");
//     setPendingUpdates({});
//     setVerificationError("");
//     setUpdateSuccess(false);
//   };

//   const toggleEditMode = () => {
//     setIsEditing(!isEditing);
//     setEditUser({
//       email: singleuser?.email || "",
//       phone: singleuser?.phone || "",
//       bep20: singleuser?.bep20 || "",
//     });
//   };

//   const cancelEdit = () => {
//     setIsEditing(false);
//     setEditUser({
//       email: singleuser?.email || "",
//       phone: singleuser?.phone || "",
//       bep20: singleuser?.bep20 || "",
//     });
//   };

//   const renderVerificationModal = () => {
//     if (verificationStep === "initial") return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
//           <div className="text-center mb-6">
//             <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
//               {verificationStep === "otp" && <Key className="w-8 h-8 text-blue-400" />}
//               {verificationStep === "updating" && !updateSuccess && (
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
//               )}
//               {verificationStep === "updating" && updateSuccess && (
//                 <Check className="w-8 h-8 text-green-400" />
//               )}
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-2">
//               {verificationStep === "otp" && "Verify Your Email"}
//               {verificationStep === "updating" && !updateSuccess && "Updating Profile..."}
//               {verificationStep === "updating" && updateSuccess && "Update Successful!"}
//             </h3>
//             <p className="text-gray-400">
//               {verificationStep === "otp" &&
//                 `Enter the 6-digit code sent to ${singleuser?.email}`}
//               {verificationStep === "updating" &&
//                 !updateSuccess &&
//                 "Please wait while we update your profile"}
//               {verificationStep === "updating" &&
//                 updateSuccess &&
//                 "Your profile has been updated successfully"}
//             </p>
//           </div>

//           {verificationStep === "otp" && (
//             <div className="space-y-4">
//               {verificationError && (
//                 <div className="bg-red-900 border border-red-700 rounded-lg p-3">
//                   <p className="text-red-300 text-sm">{verificationError}</p>
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Verification Code
//                 </label>
//                 <input
//                   type="text"
//                   value={otpCode}
//                   onChange={(e) => setOtpCode(e.target.value)}
//                   className="w-full px-4 py-3 text-white bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
//                   placeholder="000000"
//                   maxLength={6}
//                 />
//               </div>

//               <div className="text-sm text-gray-400 text-center">
//                 Code sent to:{" "}
//                 <span className="font-medium text-gray-200">{singleuser?.email}</span>
//               </div>

//               <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
//                 <h4 className="font-medium text-blue-300 mb-2">Changes to be made:</h4>
//                 <div className="space-y-1 text-sm text-blue-200">
//                   {pendingUpdates.email !== singleuser?.email && (
//                     <div>• Email: {singleuser?.email} → {pendingUpdates.email}</div>
//                   )}
//                   {pendingUpdates.phone !== singleuser?.phone && (
//                     <div>• Phone: {singleuser?.phone || "None"} → {pendingUpdates.phone}</div>
//                   )}
//                   {pendingUpdates.bep20 !== singleuser?.bep20 && (
//                     <div>
//                       • BEP-20: {singleuser?.bep20 ? "****" + singleuser?.bep20.slice(-6) : "None"}{" "}
//                       → {"****" + pendingUpdates.bep20?.slice(-6)}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex space-x-3">
//                 <button
//                   onClick={resetVerification}
//                   className="flex-1 py-3 px-4 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleOtpVerification}
//                   disabled={otpCode.length !== 6 || authLoading}
//                   className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                 >
//                   {authLoading ? "Verifying..." : "Verify & Update"}
//                 </button>
//               </div>

//               <div className="text-center">
//                 <button
//                   onClick={sendVerificationCode}
//                   disabled={authLoading}
//                   className="text-blue-400 text-sm hover:underline disabled:opacity-50"
//                 >
//                   Resend Code
//                 </button>
//               </div>
//             </div>
//           )}

//           {verificationStep === "updating" && (
//             <div className="text-center py-8">
//               {!updateSuccess && (
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
//               )}
//               {updateSuccess && (
//                 <p className="text-green-400 font-medium mt-4">Redirecting...</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <div
//         className={`${
//           userLoading ? "h-96 flex items-center justify-center" : "min-h-screen"
//         } bg-white`}
//       >
//         {userLoading ? (
//           <Loader />
//         ) : (
//           <div className="max-w-7xl mx-auto">
//             <div className="bg-[#1a1a1a] rounded-md shadow-sm overflow-hidden">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 mb-8 shadow-lg">
//                 <div className="flex flex-col md:flex-row items-center justify-between">
//                   <div className="flex items-center mb-4 md:mb-0">
//                     <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm">
//                       <User className="w-10 h-10 text-white" />
//                     </div>
//                     <div>
//                       <h1 className="text-2xl font-bold text-white">
//                         {singleuser?.username}
//                       </h1>
//                       <p className="text-blue-100">User Profile & Settings</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={toggleEditMode}
//                     className="flex items-center space-x-2 bg-white text-pink-600 px-5 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md"
//                   >
//                     {isEditing ? (
//                       <>
//                         <RotateCcw className="w-5 h-5" />
//                         <span>Cancel Edit</span>
//                       </>
//                     ) : (
//                       <>
//                         <Edit3 className="w-5 h-5" />
//                         <span>Edit Profile</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
//                 {/* Left Column */}
//                 <div className="bg-[#2a2a2a] rounded-md">
//                   <h3 className="text-2xl font-semibold text-white p-4 border-b border-white/20 flex items-center">
//                     <Shield className="w-6 h-6 mr-3 text-blue-400" />
//                     {isEditing ? "Update Details" : "Profile Details"}
//                   </h3>

//                   <div className="space-y-6 p-4">
//                     {isEditing && (
//                       <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
//                         <div className="flex items-center">
//                           <Mail className="w-5 h-5 text-blue-400 mr-2" />
//                           <span className="text-blue-200 text-sm font-medium">
//                             All changes require email verification for security
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
//                         <Mail className="w-4 h-4 mr-2" />
//                         Email Address
//                       </label>
//                       <input
//                         name="email"
//                         type="email"
//                         value={editUser.email || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing}
//                         className={`w-full px-4 py-3 border text-white bg-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           isEditing
//                             ? "border-gray-700 bg-[#2a2a2a] cursor-text"
//                             : "border-gray-800 bg-gray-800 cursor-not-allowed"
//                         }`}
//                         placeholder="Enter Email"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-300 mb-3">
//                         Phone Number
//                       </label>
//                       <input
//                         name="phone"
//                         type="tel"
//                         value={editUser.phone || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing}
//                         className={`w-full px-4 py-3 border text-white bg-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           isEditing
//                             ? "border-gray-700 bg-[#2a2a2a] cursor-text"
//                             : "border-gray-800 bg-gray-800 cursor-not-allowed"
//                         }`}
//                         placeholder="Enter Phone Number"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
//                         <Wallet className="w-4 h-4 mr-2" />
//                         BEP-20 Wallet Address
//                       </label>
//                       <input
//                         name="bep20"
//                         value={editUser.bep20 || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing || !!singleuser?.bep20}
//                         className={`w-full px-4 py-3 border text-white bg-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                           isEditing && !singleuser?.bep20
//                             ? "border-gray-700 bg-[#2a2a2a] cursor-text"
//                             : "border-gray-800 bg-gray-800 cursor-not-allowed"
//                         }`}
//                         placeholder="0x..."
//                       />
//                       {singleuser?.bep20 && (
//                         <p className="text-xs text-red-500 mt-1">
//                           BEP-20 Wallet Address can only be added once.
//                         </p>
//                       )}
//                     </div>

//                     {isEditing ? (
//                       <div className="flex space-x-3">
//                         <button
//                           onClick={cancelEdit}
//                           className="flex-1 border border-gray-700 text-gray-300 text-lg font-semibold py-4 rounded-lg hover:bg-gray-800 transition-all duration-300"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={handleSaveChanges}
//                           disabled={authLoading || userLoading}
//                           className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
//                             authLoading || userLoading
//                               ? "opacity-60 cursor-not-allowed"
//                               : "hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
//                           }`}
//                         >
//                           {authLoading || userLoading ? (
//                             <svg
//                               className="animate-spin h-5 w-5 text-white"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12" cy="12" r="10"
//                                 stroke="currentColor" strokeWidth="4"
//                               />
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                               />
//                             </svg>
//                           ) : (
//                             <>
//                               <Shield className="w-5 h-5" />
//                               <span>Verify & Update</span>
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="text-center py-4">
//                         <p className="text-gray-400">
//                           Click "Edit Profile" to update your information
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="bg-[#2a2a2a] rounded-md">
//                   <h3 className="text-2xl font-semibold p-4 border-b border-white/20 text-white flex items-center">
//                     <User className="w-6 h-6 mr-3 text-blue-400" />
//                     Account Information
//                   </h3>

//                   <div className="bg-gray-900 border border-gray-700">
//                     <div className="grid grid-cols-1">
//                       {[
//                         {
//                           label: "Last Login",
//                           value: singleuser?.last_login,
//                           icon: <Calendar className="w-4 h-4 text-gray-400" />,
//                         },
//                         {
//                           label: "Account Created",
//                           value: singleuser?.created_at,
//                           icon: <Calendar className="w-4 h-4 text-gray-400" />,
//                         },
//                         {
//                           label: "Referred By",
//                           value: singleuser?.reffer_by,
//                           icon: <Users className="w-4 h-4 text-gray-400" />,
//                         },
//                         {
//                           label: "Activation Date",
//                           value: singleuser?.activation_date,
//                           icon: <Calendar className="w-4 h-4 text-gray-400" />,
//                         },
//                         {
//                           label: "Last Updated",
//                           value: singleuser?.updated_at,
//                           icon: <Calendar className="w-4 h-4 text-gray-400" />,
//                         },
//                         {
//                           label: "Referral Code",
//                           value:
//                             singleuser?.active_plan == 0
//                               ? "Referral code not active"
//                               : singleuser?.refferal_code,
//                           icon: <Key className="w-4 h-4 text-gray-400" />,
//                         },
//                         {
//                           label: "Total Team",
//                           value: singleuser?.total_team,
//                           icon: <Users className="w-4 h-4 text-gray-400" />,
//                         },
//                       ].map(({ label, value, icon }, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0"
//                         >
//                           <div className="flex items-center">
//                             {icon}
//                             <span className="font-medium text-gray-300 ml-2">{label}</span>
//                           </div>
//                           <span className="text-gray-200 font-medium">{value || "-"}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 p-4 bg-gray-800">
//                     <div className="bg-blue-900 rounded-lg p-4 text-center">
//                       <div className="text-base font-semibold text-blue-300">
//                         {singleuser?.total_team || 0}
//                       </div>
//                       <div className="text-sm text-blue-200 font-medium">Team Members</div>
//                     </div>
//                     <div className="bg-green-900 rounded-lg p-4 text-center">
//                       <div className="text-base font-semibold text-green-300">
//                         {singleuser?.active_plan ? "Active" : "Inactive"}
//                       </div>
//                       <div className="text-sm text-green-200 font-medium">Plan Status</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {renderVerificationModal()}
//     </>
//   );
// }
