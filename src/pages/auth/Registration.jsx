

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { User, Mail, Phone, Eye, EyeClosed, Check, X, ArrowRightCircle, Wallet } from "lucide-react";

import Spinner from "@/components/common/Spinner";
import ErrorAlert from "@/components/common/ErrorAlert";
// import Header from "../../web/layout/Header";
import Footer from "../../Layouts/Public/Footer";
import { useAuth } from "../../hooks/useAuth";
import { BASE_URL } from "../../baseurl";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../Layouts/Public/Navbar";


const useQuery = () => new URLSearchParams(useLocation().search);

// ✅ FIX: InputWrap ab wrapper div click hone pe andar ka input automatically focus karega
const InputWrap = ({ children }) => {
  const wrapRef = useRef(null);

  const handleClick = () => {
    // Wrapper ke andar jo pehla input/select element ho usse focus karo
    const input = wrapRef.current?.querySelector("input, select, textarea");
    if (input) input.focus();
  };

  return (
    <div
      ref={wrapRef}
      onClick={handleClick}
      className="flex items-center gap-3 border border-gold-dark/20 rounded-xl px-4 py-2.5 bg-dark-900 focus-within:border-gold-medium focus-within:ring-1 focus-within:ring-gold-medium/40 transition-all duration-200 cursor-text"
    >
      {children}
    </div>
  );
};

export default function Registration() {
  const navigate = useNavigate();
  const query = useQuery();
  const { loading, error, userSignup } = useAuth();

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [referralUser, setReferralUser] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [formError, setFormError] = useState("");

  const debounceTimeout = useRef(null);

  async function getUserByReferralCode(code) {
    if (!code || code.length < 3) { setReferralUser(null); return; }
    try {
      const res = await axios.get(`${BASE_URL}/users/referral/${code}`);
      setReferralUser(res.data?.user || null);
    } catch { setReferralUser(null); }
  }

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      country_code: "+91",
      phone: "",
      password: "",
      confirmPassword: "",
      referralBy: "",
      bep20_address: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required").min(2, "Min 2 characters").max(50, "Too long")
        .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      country_code: Yup.string().required("Country code is required"),
      phone: Yup.string().required("Phone number is required")
        .matches(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
      password: Yup.string().min(8, "Min 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Uppercase, lowercase & number required")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      referralBy: Yup.string().required("Referral Code is required")
        .min(3, "Min 3 characters").max(9, "Too long"),
      bep20_address: Yup.string()
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid BEP-20 address (must start with 0x, 42 chars)")
        .required("BEP-20 wallet address is required"),
    }),
    onSubmit: async (values) => {
      if (!termsAgreed) { setFormError("Please agree to the Terms of Use"); return; }
      setFormError("");
      try {
        const plainPassword = values.password; // ✅ password pehle save karo
        const resultAction = await userSignup(values);
        if (resultAction.payload?.success) {
          const userData = resultAction.payload.auth;
          setRegisteredUser({ ...userData, password: plainPassword }); // ✅ password modal mein dikhao
          setRegistrationSuccess(true);
          formik.resetForm(); // ✅ form reset karo
          setTermsAgreed(false); // ✅ checkbox bhi reset karo
          setReferralUser(null); // ✅ referral user bhi clear karo
        } else {
          setFormError(resultAction.payload?.error || "Registration failed");
        }
      } catch { setFormError("Network error. Please try again."); }
    },
  });

  useEffect(() => {
    const referral = query.get("referral") || query.get("refferral");
    if (referral) {
      const up = referral.toUpperCase();
      formik.setFieldValue("referralBy", up);
      getUserByReferralCode(up);
    }
  }, []);

  const handleReferralChange = (e) => {
    const up = e.target.value.toUpperCase();
    formik.setFieldValue("referralBy", up);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => getUserByReferralCode(up), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    if (!termsAgreed) { setFormError("Please agree to the Terms of Use"); return; }
    formik.handleSubmit(e);
  };

  const handleSuccess = () => { setRegistrationSuccess(false); setRegisteredUser(null); navigate("/login"); };
  const handleSuccessClose = () => { setRegistrationSuccess(false); setRegisteredUser(null); };

  const FieldError = ({ name }) =>
    formik.touched[name] && formik.errors[name]
      ? <p className="text-rose-400 text-xs mt-1">{formik.errors[name]}</p>
      : null;

  return (
    <>
      {/* <style>{`
        @keyframes gridScroll {
          0%   { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(.975); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes orb1 {
          0%, 100% { transform: scale(1) translate(0,0); opacity: .18; }
          50%       { transform: scale(1.3) translate(20px,-20px); opacity: .28; }
        }
        @keyframes orb2 {
          0%, 100% { transform: scale(1) translate(0,0); opacity: .10; }
          50%       { transform: scale(1.2) translate(-15px,15px); opacity: .18; }
        }
        .card-anim { animation: cardIn .7s cubic-bezier(.16,1,.3,1) both; }
        .orb-1 { animation: orb1 7s ease-in-out infinite; }
        .orb-2 { animation: orb2 9s ease-in-out infinite 1s; }
        .particle { animation: floatUp linear infinite; }

        @keyframes shootingStar {
          0%   { transform: translateX(-100px) translateY(-100px); opacity: 0; }
          5%   { opacity: 1; }
          100% { transform: translateX(800px) translateY(800px); opacity: 0; }
        }
        .shooting-star {
          position: absolute;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent 0%, rgba(186,230,253,0.4) 20%, rgba(147,210,255,1) 60%, white 100%);
          box-shadow: 0 0 6px 1px rgba(186,230,253,0.9), 0 0 12px 2px rgba(14,165,233,0.6), 0 0 20px 4px rgba(14,165,233,0.3);
          animation: shootingStar linear infinite;
          pointer-events: none;
          opacity: 0;
          transform-origin: left center;
          rotate: 35deg;
        }

        @keyframes chartDraw {
          0%   { stroke-dashoffset: 1000; opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes chartFade {
          0%,100% { opacity: .08; }
          50%      { opacity: .18; }
        }
        .chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: chartDraw linear infinite;
        }
        .chart-svg { animation: chartFade ease-in-out infinite; }
      `}</style> */}

      <Navbar/>

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-theme-base" style={{ paddingTop: "90px" }}>

        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/img_12.jpg')" }} />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/90" />

        {/* Animated grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(212,175,55,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.07) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "gridScroll 20s linear infinite",
          }}
        />

        {/* Glowing orbs */}
        {/* <div className="orb-1 absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(212,175,55,.6) 0%,transparent 70%)", filter: "blur(70px)" }} />
        <div className="orb-2 absolute -bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(243,229,171,.5) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 -translate-y-1/2 right-8 w-40 h-40 rounded-full pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(circle,rgba(212,175,55,.35) 0%,transparent 70%)", filter: "blur(40px)", animationDuration: "4s" }} /> */}

        {/* Floating particles */}
        {/* {[...Array(14)].map((_, i) => {
          const size = 2 + (i % 3) + 1;
          const left = ((i * 7.1) % 95) + 2;
          const duration = 9 + (i % 6);
          const delay = (i * 0.7) % 8;
          return (
            <span
              key={i}
              className="particle absolute rounded-full pointer-events-none"
              style={{
                width: `${size}px`, height: `${size}px`,
                left: `${left}%`, bottom: "-10px",
                background: "rgba(212,175,55,.65)",
                boxShadow: "0 0 8px rgba(212,175,55,.9)",
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })} */}

        {/* Shooting Stars */}
        {/* {[
          { top: "2%",  left: "5%",  length: 60,  duration: 3.5, delay: 0    },
          { top: "8%",  left: "25%", length: 75,  duration: 2.8, delay: 1.2  },
          { top: "0%",  left: "50%", length: 55,  duration: 4.0, delay: 2.5  },
          { top: "5%",  left: "70%", length: 70,  duration: 3.2, delay: 0.8  },
          { top: "1%",  left: "88%", length: 50,  duration: 3.8, delay: 3.5  },
          { top: "15%", left: "3%",  length: 65,  duration: 2.5, delay: 1.8  },
          { top: "20%", left: "40%", length: 60,  duration: 3.0, delay: 4.2  },
          { top: "12%", left: "60%", length: 70,  duration: 3.6, delay: 0.5  },
          { top: "25%", left: "80%", length: 55,  duration: 2.9, delay: 2.0  },
          { top: "30%", left: "15%", length: 75,  duration: 3.3, delay: 5.0  },
          { top: "35%", left: "55%", length: 58,  duration: 4.2, delay: 1.5  },
          { top: "40%", left: "90%", length: 65,  duration: 2.7, delay: 3.8  },
          { top: "45%", left: "30%", length: 72,  duration: 3.5, delay: 0.3  },
          { top: "50%", left: "10%", length: 60,  duration: 2.8, delay: 4.6  },
          { top: "55%", left: "65%", length: 68,  duration: 3.1, delay: 2.3  },
          { top: "60%", left: "45%", length: 75,  duration: 3.9, delay: 1.0  },
          { top: "65%", left: "75%", length: 52,  duration: 2.6, delay: 5.5  },
          { top: "70%", left: "20%", length: 70,  duration: 3.4, delay: 0.9  },
          { top: "75%", left: "85%", length: 58,  duration: 4.0, delay: 3.2  },
          { top: "80%", left: "35%", length: 65,  duration: 2.9, delay: 1.7  },
          { top: "10%", left: "48%", length: 72,  duration: 3.7, delay: 6.0  },
          { top: "18%", left: "92%", length: 55,  duration: 2.5, delay: 2.8  },
          { top: "42%", left: "7%",  length: 68,  duration: 3.3, delay: 4.5  },
          { top: "58%", left: "52%", length: 62,  duration: 3.0, delay: 0.6  },
        ].map((s, i) => (
          <span
            key={`star-${i}`}
            className="shooting-star"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.length}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))} */}

        {/* Chart Lines SVG */}
        {/* <svg
          className="chart-svg absolute inset-0 w-full h-full pointer-events-none"
          style={{ animationDuration: "6s" }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <polyline
            className="chart-line"
            points="0,420 80,400 160,380 200,390 260,340 320,310 400,280 460,260 520,240 600,200 680,180 760,150 840,130 920,100 1000,80 1100,60 1200,40 1400,20"
            fill="none"
            stroke="rgba(212,175,55,0.35)"
            strokeWidth="1.5"
            style={{ animationDuration: "12s", animationDelay: "0s" }}
          />
          <polyline
            className="chart-line"
            points="0,500 100,480 180,510 240,460 300,490 380,430 440,460 500,400 580,420 660,370 720,400 800,340 880,360 960,300 1040,320 1140,270 1300,240 1400,210"
            fill="none"
            stroke="rgba(243,229,171,0.25)"
            strokeWidth="1"
            style={{ animationDuration: "15s", animationDelay: "2s" }}
          />
          <polyline
            className="chart-line"
            points="0,300 120,320 200,350 280,330 360,360 420,340 500,370 580,350 660,380 740,355 820,390 900,365 1000,400 1100,375 1200,350 1400,320"
            fill="none"
            stroke="rgba(212,175,55,0.15)"
            strokeWidth="1"
            style={{ animationDuration: "18s", animationDelay: "4s" }}
          />
        </svg> */}

        {/* FORM CARD */}
        <div className="card-anim relative z-10 w-full max-w-[880px] mx-auto
          sm:mx-8 lg:mr-12 xl:mr-20 2xl:mr-32
          my-8 px-6 py-8 sm:px-8
          glass-card rounded-2xl
          shadow-[0_0_60px_rgba(212,175,55,.1),0_25px_50px_rgba(0,0,0,.5)]">

          {/* Corner accents */}
            <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs text-white font-bold hover:text-gold-light transition-colors duration-200 mb-6 uppercase tracking-wider text-glow"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back 
                </Link>
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-gold-medium/50 rounded-tl-xl pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-gold-medium/50 rounded-br-xl pointer-events-none" />

          {/* Title */}
          <div className="text-center mb-7">
            {/* <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gold-medium/10 border border-gold-medium/25 mb-3"> */}
              {/* <User size={20} className="text-gold-light" /> */}
               <Link to="/" className="inline-block relative w-16 h-16 rounded-full overflow-hidden border border-gold-medium/30 bg-black p-0.5 glow-gold mx-auto">
                            <img
                                src="/logo.jpeg"
                                alt="Dark Horse Finance Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </Link>
            {/* </div> */}
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">Sign up to start your Dark Horse journey</p>
          </div>

          {formError && <ErrorAlert error={formError} />}

          <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Full Name *</label>
              <InputWrap>
                <User size={15} className="text-gold-medium shrink-0" />
                <input type="text" name="fullname" value={formik.values.fullname}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder="Enter your full name"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm" />
              </InputWrap>
              <FieldError name="fullname" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Email *</label>
              <InputWrap>
                <Mail size={15} className="text-gold-medium shrink-0" />
                <input type="email" name="email" value={formik.values.email}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder="example@email.com"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm" />
              </InputWrap>
              <FieldError name="email" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Phone *</label>
              <div className="flex gap-2">
                <select name="country_code" value={formik.values.country_code}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  className="w-[90px] px-2 py-2.5 border border-gold-dark/20 bg-dark-900 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-medium focus:border-gold-medium text-sm transition-all">
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                </select>
                <div className="flex-1">
                  <InputWrap>
                    <Phone size={15} className="text-gold-medium shrink-0" />
                    <input type="tel" name="phone" value={formik.values.phone}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      placeholder="9876543210" maxLength="10"
                      className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm" />
                  </InputWrap>
                </div>
              </div>
              <FieldError name="phone" />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 text-sm text-white bg-dark-900 border border-gold-dark/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-medium focus:border-gold-medium transition-all placeholder-gray-600" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-medium transition-colors">
                    {showPass ? <Eye size={15} /> : <EyeClosed size={15} />}
                  </button>
                </div>
                <FieldError name="password" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Confirm *</label>
                <div className="relative">
                  <input type={showConfirmPass ? "text" : "password"} name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 text-sm text-white bg-dark-900 border border-gold-dark/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold-medium focus:border-gold-medium transition-all placeholder-gray-600" />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-medium transition-colors">
                    {showConfirmPass ? <Eye size={15} /> : <EyeClosed size={15} />}
                  </button>
                </div>
                <FieldError name="confirmPassword" />
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">Referral Code *</label>
              <InputWrap>
                <User size={15} className="text-gold-medium shrink-0" />
                <input type="text" name="referralBy" value={formik.values.referralBy}
                  onChange={handleReferralChange} onBlur={formik.handleBlur}
                  placeholder="Enter referral code"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm uppercase" />
              </InputWrap>
              {referralUser && (
                <p className="text-gold-medium text-xs mt-1 flex items-center gap-1">
                  <Check size={11} className="shrink-0" />
                  Referred by: <span className="font-medium">{referralUser.fullname}</span>
                </p>
              )}
              <FieldError name="referralBy" />
            </div>

            {/* BEP-20 Address */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                BEP-20 Wallet Address *
              </label>
              <InputWrap>
                <Wallet size={15} className="text-gold-medium shrink-0" />
                <input type="text" name="bep20_address" value={formik.values.bep20_address}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder="0x1234...abcd"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm font-mono tracking-tight" />
              </InputWrap>
              <p className="text-gray-600 text-[11px] mt-1">BSC / BEP-20 address (Trust Wallet, MetaMask, etc.)</p>
              <FieldError name="bep20_address" />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" id="terms" checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-gold-medium rounded cursor-pointer" />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                I accept the{" "}
                <Link to="/terms" className="text-gold-medium hover:text-gold-light hover:underline">Terms of Use</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-gold-medium hover:text-gold-light hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !termsAgreed}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 ${
                termsAgreed && !loading
                  ? "bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light text-black hover:brightness-110 shadow-lg shadow-gold-medium/10 transition-all cursor-pointer"
                  : "bg-gray-700/60 text-white cursor-not-allowed opacity-50"
              }`}
            >
              {loading ? <Spinner /> : "Create Account →"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-gold-medium hover:text-gold-light hover:underline transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <Footer/>

      {/* Success Modal */}
      {registrationSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSuccessClose} />
          <div className="card-anim relative w-full max-w-md rounded-2xl glass-card border border-gold-medium/25 shadow-2xl shadow-gold-medium/20 overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <button onClick={handleSuccessClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-theme-primary bg-dark-900 hover:bg-dark-800 rounded-full p-1.5 transition-all">
                <X size={15} />
              </button>

              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gold-medium to-gold-dark rounded-full mb-4 shadow-lg shadow-gold-medium/30">
                <Check size={28} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">🎉 Welcome Aboard!</h2>
              <p className="text-gold-light text-sm mb-5">Your account has been created successfully!</p>

              <div className="bg-dark-900 rounded-xl p-4 mb-5 text-left space-y-2.5 border border-gold-medium/10">
                {[
                  ["Name", registeredUser?.fullname],
                  ["Username", registeredUser?.username],
                  ["Email", registeredUser?.email],
                  ["Password", registeredUser?.password],
                ].map(([label, val]) => (
                  <p key={label} className="text-white text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gold-medium rounded-full mt-1.5 shrink-0" />
                    <span className="text-gray-400 w-20 shrink-0 text-xs font-medium">{label}:</span>
                    <span className={`break-all ${label === "Password" ? "font-mono text-xs" : "text-sm"}`}>{val}</span>
                  </p>
                ))}
              </div>

              <div className="space-y-2.5">
                <button onClick={handleSuccess}
                  className="w-full bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 text-black font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-gold-medium/20 text-sm">
                  Continue to Login <ArrowRightCircle size={16} />
                </button>
                <button onClick={handleSuccessClose}
                  className="w-full bg-dark-900 border border-gold-dark/20 text-gray-400 hover:text-theme-primary py-2.5 rounded-xl hover:bg-dark-800 transition-all text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <ErrorAlert error={error} />}
    </>
  );
}