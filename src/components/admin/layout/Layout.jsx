import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Menu,
  User,
  LogOut,
  HomeIcon,
  Bell,
  Settings,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { signoutadmin } from "../../../redux/authSlice";
import { useTheme } from "../../../context/ThemeContext";

export const Layout = ({ PageName }) => {
  const { setIsForcedDark } = useTheme();

  useEffect(() => {
    setIsForcedDark(true);
    return () => setIsForcedDark(false);
  }, [setIsForcedDark]);

  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const dispatch = useDispatch();
  const admin = useSelector((state) => state.auth.admin);

  // Handle window resize - close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =======================
     LOGOUT BUTTON
  ======================= */
  const handleLogout = async () => {
    localStorage.clear();
    await dispatch(signoutadmin());
    window.location.href = "/admin-login";
  };

  // Sample notifications
  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", read: false },
    { id: 2, title: "Deposit request pending", time: "15 min ago", read: false },
    { id: 3, title: "Withdrawal completed", time: "1 hour ago", read: true },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 overflow-x-hidden ${
          isSidebarOpen && !isMobileMenuOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full bg-white/5 backdrop-blur-md border-b border-white/10 px-4 py-2 shadow-lg">
          {/* Left Section */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#c9a227]/20">
                <HomeIcon className="w-4 h-4 text-[#F5C518]" />
              </div>
              <span className="text-sm text-slate-400">Admin</span>
              <span className="text-slate-600 text-sm">/</span>
              <span className="text-sm font-medium text-white">{PageName || "Dashboard"}</span>
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#111]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-white/10">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notif.read ? "bg-[#F5C518]/10" : ""
                        }`}
                      >
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/10">
                    <button className="text-xs text-[#F5C518] hover:text-[#f0d060] w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-black" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">{admin?.fullname || "Admin"}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0a0f14]/95 backdrop-blur-xl border border-[#F5C518]/20 rounded-xl shadow-2xl py-1 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold">
                        {admin?.fullname?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{admin?.fullname || "Admin User"}</p>
                      <p className="text-xs text-slate-400">{admin?.email || "admin@example.com"}</p>
                    </div>
                  </div>

                  <button onClick={() => window.location.href='/admin/profile'} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>

                  <button onClick={() => window.location.href='/admin/settings'} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>

                  <div className="border-t border-white/10 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-400 font-medium hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scroll">
          <Suspense fallback={<div className="flex h-full items-center justify-center"><div className="w-8 h-8 border-4 border-[#F5C518] border-t-transparent rounded-full animate-spin"></div></div>}>
            <Outlet key={location.pathname} />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Layout;