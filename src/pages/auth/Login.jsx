
import { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendForgotLink, clearMessage, clearErrors as clrerr } from "../../redux/forgotSlice";
import { useAuth } from "../../hooks/useAuth";
import Footer from "../../Layouts/Public/Footer";
import Spinner from "@/components/common/Spinner";
import Navbar from "../../Layouts/Public/Navbar";
import { ArrowLeft } from "lucide-react";


export default function Login() {
  const { loading, auth, error, message: msg, resetError, resetMessage, userLogin } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const { loading: load, message, error: Err } = useSelector((state) => state.forgot);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object().shape({
      email: Yup.string().required("Email or username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => { userLogin(values); },
  });

  useEffect(() => {
    if (error) { const t = setTimeout(() => resetError(), 2000); return () => clearTimeout(t); }
    if (Err) { const t = setTimeout(() => resetError(), 2000); return () => clearTimeout(t); }
    if (message) { const t = setTimeout(() => resetMessage(), 2000); return () => clearTimeout(t); }
    if (auth) { navigate(`/${auth?.role}/dashboard`); }
  }, [error, auth, message, Err, navigate]);

  const handleForgotPass = () => {
    if (!formik.values.email) { alert("Please enter your email"); return; }
    dispatch(sendForgotLink({ email: formik.values.email, role: "user" }));
  };

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
        .chart-line { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: chartDraw linear infinite; }
        .chart-svg  { animation: chartFade ease-in-out infinite; }
        .card-anim  { animation: cardIn .7s cubic-bezier(.16,1,.3,1) both; }
        .orb-1 { animation: orb1 7s ease-in-out infinite; }
        .orb-2 { animation: orb2 9s ease-in-out infinite 1s; }
        .particle { animation: floatUp linear infinite; }
      `}</style> */}

      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-theme-base" style={{ paddingTop: "90px" }}>


        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/img_12.jpg')" }} />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/90" />


        {/* Animated grid */}
        {/* <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(14,165,233,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(7, 8, 8, 0.07) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "gridScroll 20s linear infinite",
        }} /> */}

        {/* Glowing orbs */}
        {/* <div className="orb-1 absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(14,165,233,.6) 0%,transparent 70%)", filter: "blur(70px)" }} /> */}
        {/* <div className="orb-2 absolute -bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(56,189,248,.5) 0%,transparent 70%)", filter: "blur(60px)" }} /> */}
        {/* <div className="absolute top-1/2 -translate-y-1/2 right-8 w-40 h-40 rounded-full pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(circle,rgba(14,165,233,.35) 0%,transparent 70%)", filter: "blur(40px)", animationDuration: "4s" }} /> */}

        {/* Floating particles */}
        {/* {[...Array(14)].map((_, i) => (
          <span key={i} className="particle absolute rounded-full pointer-events-none" style={{
            width: `${2 + (i % 3) + 1}px`, height: `${2 + (i % 3) + 1}px`,
            left: `${((i * 7.1) % 95) + 2}%`, bottom: "-10px",
            background: "rgba(14,165,233,.65)",
            boxShadow: "0 0 8px rgba(14,165,233,.9)",
            animationDuration: `${9 + (i % 6)}s`,
            animationDelay: `${(i * 0.7) % 8}s`,
          }} />
        ))} */}

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
          <span key={`star-${i}`} className="shooting-star" style={{
            top: s.top, left: s.left,
            width: `${s.length}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }} />
        ))} */}

        {/* Chart Lines SVG */}
        {/* <svg className="chart-svg absolute inset-0 w-full h-full pointer-events-none"
          style={{ animationDuration: "6s" }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <polyline className="chart-line"
            points="0,420 80,400 160,380 200,390 260,340 320,310 400,280 460,260 520,240 600,200 680,180 760,150 840,130 920,100 1000,80 1100,60 1200,40 1400,20"
            fill="none" stroke="rgba(14,165,233,0.35)" strokeWidth="1.5"
            style={{ animationDuration: "12s", animationDelay: "0s" }} />
          <polyline className="chart-line"
            points="0,500 100,480 180,510 240,460 300,490 380,430 440,460 500,400 580,420 660,370 720,400 800,340 880,360 960,300 1040,320 1140,270 1300,240 1400,210"
            fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1"
            style={{ animationDuration: "15s", animationDelay: "2s" }} />
          <polyline className="chart-line"
            points="0,300 120,320 200,350 280,330 360,360 420,340 500,370 580,350 660,380 740,355 820,390 900,365 1000,400 1100,375 1200,350 1400,320"
            fill="none" stroke="rgba(14,165,233,0.15)" strokeWidth="1"
            style={{ animationDuration: "18s", animationDelay: "4s" }} />
        </svg> */}

        {/* ── FORM CARD ── */}

        <div className="card-anim relative z-10 w-full max-w-[440px] mx-auto
          sm:mx-8 lg:mr-12 xl:mr-20 2xl:mr-32
          my-8 px-6 py-8 sm:px-8
          my-8 px-6 py-8 sm:px-8
          glass-card rounded-2xl
">

          {/* Corner accents */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-white font-bold hover:text-gold-light transition-colors duration-200 mb-6 uppercase tracking-wider text-glow"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-gray-900/50 rounded-tl-xl pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-gray-900/50 rounded-br-xl pointer-events-none" />

          {/* Title */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center  rounded-full bg-gold-dark/10 border border-gold-light mb-3">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg> */}
              <Link to="/" className="inline-block relative w-16 h-16 rounded-full overflow-hidden border border-gold-medium/30 bg-black p-0.5 glow-gold mx-auto">
                <img
                  src="/logo.jpeg"
                  alt="Dark Horse Finance Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </Link>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue your Dark Horse journey</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-500/15 border border-green-500/40 rounded-xl">
              <p className="text-green-400 text-sm text-center">{message}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={formik.handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                Email or Username
              </label>
              <div className="flex items-center gap-3 bg-dark-900 border border-gold-dark/20 rounded-xl px-4 py-2.5 focus-within:border-gold-medium focus-within:ring-1 focus-within:ring-gold-medium/40 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gold-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  id="email" name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  type="text" placeholder="Enter your email or username"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-rose-400 text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" onClick={handleForgotPass}
                  className="text-xs font-medium text-gold-light hover:text-gold-light transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="flex items-center gap-3 bg-dark-900 border border-gold-dark/20 rounded-xl px-4 py-2.5 focus-within:border-gold-medium focus-within:ring-1 focus-within:ring-gold-medium/40 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gold-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password" name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="text-gray-500 hover:text-gold-light transition-colors shrink-0">
                  {showPass ? <FaRegEyeSlash size={15} /> : <FaRegEye size={15} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-rose-400 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember"
                className="w-4 h-4 accent-gold-light rounded cursor-pointer" />
              <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer select-none">Remember me</label>
            </div>

            {/* Submit */}
            <button type="submit"
              className="w-full py-3 rounded-xl text-black bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light hover:brightness-110 shadow-lg shadow-gold-medium/10 font-semibold text-sm shadow-lg shadow-gold-medium/10 hover:shadow-gold-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2">
              {loading || load ? <Spinner /> : "Sign In →"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link to="/registration" className="font-semibold text-gold-light hover:text-gold-dark hover:underline transition-colors">
              Create New Account
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}