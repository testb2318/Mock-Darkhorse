
import { useState, useEffect, Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDown,
  LogOut,
  User,
  Menu as MenuIcon,
  X,
  Wallet,
} from "lucide-react";
import axios from "axios";
import { signoutuser } from "../../../redux/authSlice";
import { defaulterNotification, getMyProfile } from "../../../redux/userSlice";
import { userMenus } from "../../../constant";
import BoosterTimer from "../../common/BoosterTimer";
import { useTheme } from "../../../context/ThemeContext";


export default function UserLayout() {
  const { setIsForcedDark } = useTheme();

  useEffect(() => {
    setIsForcedDark(true);
    return () => setIsForcedDark(false);
  }, [setIsForcedDark]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const walletRef = useRef(null);
  const navRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useSelector((state) => state.auth);
  const { myprofile: singleuser } = useSelector((state) => state.users);

  useEffect(() => {
    if (auth?.id) {
      dispatch(getMyProfile());
      dispatch(defaulterNotification(auth.id));
    }
  }, [auth?.id, dispatch]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await axios.get("https://api.Mock.ceo/api/v1/tokens");
        const tokens = res.data.data || [];
        const active = tokens.find((t) => t.is_active === 1);
        if (active) {
          setTokenPrice(parseFloat(active.current_price));
          setTokenSymbol(active.symbol);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchTokens();
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (walletRef.current && !walletRef.current.contains(e.target))
        setWalletOpen(false);
    };
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn);
    return () => {
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("touchstart", fn);
    };
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  const handleLogout = () => {
    dispatch(signoutuser());
    navigate("/");
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  };

  const fmt = (v) =>
    Number(v || 0).toLocaleString("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

  return (
    <div className="flex flex-col min-h-screen text-gray-100 user-theme user-bg-abstract">
      <div className="flex flex-col min-h-screen user-bg-overlay">
        {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
        <nav
          ref={navRef}
          className="sticky top-0 z-50 w-full overflow-visible glass-card border-b border-gold-dark/20"
          style={{
            boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.8)" : "none",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <div className="w-full h-[64px] flex items-center justify-between overflow-visible">
            {/* LOGO */}
            <div className="flex-shrink-0 flex items-center" style={{ paddingLeft: "40px" }}>
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.jpeg"
                  alt="Dark Horse"
                  className="h-14 w-14 rounded-full object-cover"
                  style={{
                    border: "2px solid #D4AF37",
                    padding: "2px",
                    background: "rgba(212, 175, 55, 0.1)",
                    boxShadow: "0 0 10px rgba(212, 175, 55, 0.3)"
                  }}
                />
              </Link>
            </div>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden xl:flex items-center justify-center gap-0 flex-1 overflow-visible">
              {userMenus.map((menu, index) => {
                const isActive = activeDropdown === index;
                const hasSub = menu.submenu?.length > 0;
                const IconComponent = menu.icon;

                return (
                  <div key={menu.name} className="relative">
                    {hasSub ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(isActive ? null : index);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[13.5px] font-extrabold transition-all duration-150 whitespace-nowrap"
                          style={{
                            color: isActive ? "#ffffff" : "#aaaaaa",
                            background: "transparent",
                            letterSpacing: "0.01em",
                            fontWeight: "800",
                            borderBottom: menu.submenu.some(sub => location.pathname === sub.to) ? "2px solid #D4AF37" : "2px solid transparent",
                            borderRadius: "0",
                            paddingBottom: "8px",
                            marginBottom: "-10px"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#aaaaaa"; }}
                        >
                          {/* ✅ Icon added */}
                          {IconComponent && (
                            <IconComponent
                              className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: isActive ? "#F5C518" : "#666666" }}
                            />
                          )}
                          {menu.name}
                          <ChevronDown
                            className="w-3 h-3 transition-transform duration-200"
                            style={{
                              transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                              color: isActive ? "#ffffff" : "#666666",
                            }}
                          />
                        </button>

                        {isActive && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-full left-0 mt-1 rounded-lg"
                            style={{
                              background: "#1a1a1a",
                              border: "1px solid rgba(255,255,255,0.1)",
                              boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
                              minWidth: "200px",
                              width: "max-content",
                              zIndex: 99999,
                            }}
                          >
                            <div className="py-1">
                              {menu.submenu.map((sub) => {
                                const SubIcon = sub.icon;
                                return (
                                  <Link
                                    key={sub.name}
                                    to={sub.to}
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-extrabold sm:text-sm transition-all duration-100 whitespace-nowrap"
                                    style={{ color: "#999999", fontWeight: "800" }}
                                    onClick={() => setActiveDropdown(null)}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "#999999"; e.currentTarget.style.background = "transparent"; }}
                                  >
                                    {/* ✅ Submenu icon */}
                                    {SubIcon && (
                                      <SubIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#ba9c16" }} />
                                    )}
                                    {sub.name}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={menu.to}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[13.5px] font-extrabold transition-all duration-150 whitespace-nowrap"
                        style={{
                          color: location.pathname === menu.to ? "#ffffff" : "#aaaaaa",
                          letterSpacing: "0.01em",
                          fontWeight: "800",
                          borderBottom: location.pathname === menu.to ? "2px solid #D4AF37" : "2px solid transparent",
                          borderRadius: "0",
                          paddingBottom: "8px",
                          marginBottom: "-10px"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#aaaaaa"; }}
                      >
                        {/* ✅ Icon added */}
                        {IconComponent && (
                          <IconComponent
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: "#666666" }}
                          />
                        )}
                        {menu.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT — Profile + Hamburger */}
            <div className="flex items-center justify-end flex-shrink-0" style={{ paddingLeft: "16px", paddingRight: "40px" }}>
              {/* Desktop Profile */}
              <Menu as="div" className="relative hidden xl:inline-block">
                <Menu.Button
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                  style={{
                    border: "1.5px solid rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.12)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                >
                  <User className="w-5 h-5" style={{ color: "#ffffff" }} />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl overflow-hidden focus:outline-none z-50"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.85)",
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>
                        {singleuser?.fullname}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#666666" }}>
                        {singleuser?.email}
                      </p>
                    </div>
                    <Menu.Item>
                      {() => (
                        <Link
                          to={`/user/profile/${auth?.id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "#999999" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#999999"; e.currentTarget.style.background = "transparent"; }}
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {() => (
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "#e57373" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229,115,115,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Mobile Hamburger */}
              <button
                onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
                className="xl:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#cccccc",
                  marginRight: "20px",
                }}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MOBILE DRAWER */}
          {mobileMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="xl:hidden max-h-[80vh] overflow-y-auto"
              style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="px-4 py-2">
                {userMenus.map((menu, index) => {
                  const isActive = activeDropdown === index;
                  const IconComponent = menu.icon;
                  return (
                    <div key={menu.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {menu.submenu?.length > 0 ? (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(isActive ? null : index); }}
                            className="w-full flex items-center justify-between py-3.5 text-sm font-medium transition-colors"
                            style={{ color: isActive ? "#ffffff" : "#cccccc" }}
                          >
                            {/* ✅ Mobile icon */}
                            <span className="flex items-center gap-2.5">
                              {IconComponent && (
                                <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? "#F5C518" : "#555555" }} />
                              )}
                              {menu.name}
                            </span>
                            <ChevronDown
                              className="w-4 h-4 transition-transform duration-200"
                              style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)", color: isActive ? "#ffffff" : "#888888" }}
                            />
                          </button>
                          {isActive && (
                            <div
                              className="flex flex-col mb-1"
                              style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "6px" }}
                            >
                              {menu.submenu.map((sub) => {
                                const SubIcon = sub.icon;
                                return (
                                  <Link
                                    key={sub.name}
                                    to={sub.to}
                                    className="flex items-center gap-2 px-4 py-3 text-sm transition-colors"
                                    style={{ color: "#bbbbbb", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "#bbbbbb")}
                                    onClick={() => { setActiveDropdown(null); setMobileMenuOpen(false); }}
                                  >
                                    {/* ✅ Mobile submenu icon */}
                                    {SubIcon && (
                                      <SubIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#2ABFBF" }} />
                                    )}
                                    {sub.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={menu.to}
                          className="flex items-center gap-2.5 py-3.5 text-sm font-medium transition-colors"
                          style={{ color: "#cccccc" }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {/* ✅ Mobile simple link icon */}
                          {IconComponent && (
                            <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: "#555555" }} />
                          )}
                          {menu.name}
                        </Link>
                      )}
                    </div>
                  );
                })}

                {/* Mobile profile section */}
                <div className="py-3 mt-1">
                  <div className="mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>{singleuser?.fullname}</p>
                    <p className="text-xs" style={{ color: "#555555" }}>{singleuser?.email}</p>
                  </div>
                  <Link
                    to={`/user/profile/${auth?.id}`}
                    className="flex items-center gap-2 py-2 text-sm"
                    style={{ color: "#aaaaaa" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" style={{ color: "#888888" }} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-sm w-full"
                    style={{ color: "#e57373" }}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* ══════════════════════════════════
          SUBHEADER — Greeting + Wallets
      ══════════════════════════════════ */}
        <div>
          <header
            className="px-4 sm:px-8 flex items-center justify-between gap-4 sticky z-40"
            style={{
              top: "64px",
              background: "linear-gradient(135deg, rgba(10,10,10,0.6) 0%, rgba(20,20,20,0.8) 50%, rgba(10,10,10,0.6) 100%)",
              borderBottom: "1px solid rgba(212,175,55,0.15)",
              backdropFilter: "blur(10px)",
              minHeight: "56px",
            }}
          >
            {/* Greeting */}
            <div className="flex items-center gap-2 py-3 min-w-0">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-gold-light to-gold-dark opacity-80 flex-shrink-0" />
              <p className="text-sm font-medium truncate text-gray-300 font-sans">
                {greeting()},
                <span className="ml-2 font-bold text-base tracking-wide text-gold-medium" style={{ textShadow: "0 0 12px rgba(212,175,55,0.3)" }}>
                  {singleuser?.fullname}
                </span>
              </p>
            </div>

            {/* ── Brand Header Bar (Centered) ── */}
            <div
              className="hidden lg:flex items-center gap-3 px-5 py-2 rounded-2xl border border-white/5 max-w-[400px] w-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(26,107,138,0.18) 0%, rgba(10,22,40,0.6) 50%, rgba(201,162,39,0.12) 100%)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 0 1px rgba(74,182,212,0.08), 0 4px 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* Gold accent line */}
              <div
                className="h-8 w-1 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(180deg, #c9a227 0%, #f0d060 50%, #c9a227 100%)",
                  boxShadow: "0 0 12px rgba(201,162,39,0.6)",
                }}
              />
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#97790b]/70">
                  Dark Horse
                </p>
                <p className="text-[11px] text-white/30 tracking-wide">
                  Live  Dashboard
                </p>
              </div>

              {/* Live indicator */}
              <div className="ml-auto flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cc9b14] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c09513]" />
                </span>
                <span className="text-[11px] text-[#c99915]/80 font-medium tracking-widest uppercase">
                  Live
                </span>
              </div>
            </div>

            {/* Desktop Wallet Cards */}
            <div className="hidden lg:flex items-center gap-3 py-3">
              {/* <BoosterTimer
              activationDate={singleuser?.activation_date}
              days={7}
            /> */}
              {/* <WalletCard label="Token Price" value={`$${tokenPrice ?? "—"} ${tokenSymbol}`} teal /> */}
              <WalletCard label="Deposit Fund" value={`$${fmt(singleuser?.business)}`} gold />
              {/* <WalletCard label="Yield Wallet" value={`$${fmt(singleuser?.non_working)}`} teal /> */}
              <WalletCard label="Income Wallet" value={`$${fmt(singleuser?.working)}`} gold />
            </div>

            {/* Mobile Wallet + Profile */}
            <div className="flex lg:hidden gap-2 items-center py-3">
              <div ref={walletRef} className="relative z-[999]">
                <button
                  type="button"
                  onClick={() => setWalletOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    border: "1px solid rgba(42,191,191,0.3)",
                    background: "rgba(42,191,191,0.06)",
                    color: "#2ABFBF",
                  }}
                >
                  <Wallet className="w-4 h-4" />
                  Wallet
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform"
                    style={{ transform: walletOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {walletOpen && (
                  <div
                    className="fixed left-3 right-3 rounded-2xl overflow-hidden z-[999]"
                    style={{
                      top: "55px",
                      background: "#0c1420",
                      border: "1px solid rgba(42,191,191,0.2)",
                      boxShadow: "0 16px 52px rgba(0,0,0,0.9)",
                    }}
                  >
                    {/* <div className="flex flex-col items-center justify-around py-4 px-2">
                    <div className="leading-tight mb-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#aaaaaa]">
                        Booster Timer
                      </p>
                    </div>
                    <BoosterTimer
                      activationDate={singleuser?.activation_date}
                      days={7} />
                  </div> */}
                    <div style={{ height: "2px", background: "linear-gradient(90deg, #F5C518, #d38511)" }} />
                    {[
                      // { label: "Token Price", value: `$${tokenPrice ?? "—"} ${tokenSymbol}`, gold: false },
                      { label: "Deposit Fund", value: `$${fmt(singleuser?.business)}`, gold: true },
                      // { label: "ROI Wallet", value: `$${fmt(singleuser?.non_working)}`, gold: false },
                      { label: "Income Wallet", value: `$${fmt(singleuser?.working)}`, gold: true },
                    ].map((item, i, arr) => (
                      <div
                        key={item.label}
                        className="flex justify-between items-center px-4 py-3"
                        style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                      >
                        <span className="text-sm" style={{ color: "#4a6a7a" }}>{item.label}</span>
                        <span className="text-sm font-extrabold" style={{ color: item.gold ? "#F5C518" : "#2ABFBF" }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Profile */}
              <Menu as="div" className="relative inline-block">
                <Menu.Button
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}
                >
                  <User className="w-4 h-4" style={{ color: "#cccccc" }} />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl overflow-hidden focus:outline-none z-50"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.85)",
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{singleuser?.fullname}</p>
                      <p className="text-xs truncate" style={{ color: "#666666" }}>{singleuser?.email}</p>
                    </div>
                    <Menu.Item>
                      {() => (
                        <Link
                          to={`/user/profile/${auth?.id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "#999999" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#999999"; e.currentTarget.style.background = "transparent"; }}
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {() => (
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm"
                          style={{ color: "#e57373" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229,115,115,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

// ── Wallet Card Component ─────────────────────────────────────────
function WalletCard({ label, value, gold }) {
  // Use gold for everything to keep theme consistent
  const color = "var(--color-gold-medium)";
  const borderColor = "rgba(212,175,55,0.25)";
  const bgColor = "rgba(212,175,55,0.04)";
  const glowColor = "rgba(212,175,55,0.15)";

  return (
    <div
      className="relative px-4 py-2.5 rounded-xl text-center min-w-[120px] transition-all duration-200 cursor-default glass-card"
      style={{ border: `1px solid ${borderColor}`, background: bgColor }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 16px 2px ${glowColor}`; e.currentTarget.style.borderColor = color; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = borderColor; }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full" style={{ background: color, opacity: 0.6 }} />
      <div className="flex items-center justify-center gap-1 mb-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, opacity: 0.7 }} />
        <p className="text-[11px] font-medium uppercase tracking-wider text-gold-light/70">{label}</p>
      </div>
      <p className="text-sm font-bold leading-none tracking-wide text-white" style={{ textShadow: `0 0 8px ${glowColor}` }}>
        {value}
      </p>
    </div>
  );
}