// import { Disclosure } from "@headlessui/react";
// import { Bell, Menu } from "lucide-react";


// export const Header = ({ setSidebarOpen, PageName }) => {
//   return (
//     <>
//       <Disclosure as="nav" className="text-gray-100 bg-[#844fc1]">
//         <div className="max-w-full ml-4">
//           <div className="flex items-center justify-end h-16">
//             <div className="hidden w-1/3 lg:block">
//               <div className="flex items-center ml-4">
//                 <button
//                   type="button"
//                   className="relative p-1 text-yellow-700 bg-yellow-300 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
//                 >
//                   <span className="absolute" />
//                   <span className="sr-only">View notifications</span>
//                   <Bell aria-hidden="true" className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="flex justify-end w-full lg:hidden">
//               <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-green-800 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
//                 <button
//                   type="button"
//                   onClick={() => setSidebarOpen(true)}
//                   className="-m-2.5 p-2.5 text-gray-200 lg:hidden"
//                 >
//                   <span className="sr-only">Open sidebar</span>
//                   <Menu aria-hidden="true" className="h-7 w-7" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Disclosure>

//       <header className="text-gray-100 bg-[#5e3dc9]">
//         <div className="px-4 py-0 border-t-2 border-b-2 border-green-300 max-w-7xl sm:px-6 lg:px-8">
//           <nav aria-label="Breadcrumb" className="flex text-base">
//             <div className="flex items-center gap-2">
//               <svg
//                 fill="currentColor"
//                 viewBox="0 0 24 44"
//                 preserveAspectRatio="none"
//                 aria-hidden="true"
//                 className="flex-shrink-0 w-6 h-full text-green-200"
//               >
//                 <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
//               </svg>
//               Admin / {PageName}
//             </div>
//           </nav>
//         </div>
//       </header>
//     </>
//   );
// };



























import { Disclosure } from "@headlessui/react";
import { Bell, Menu, X, ChevronRight, Home, User, Settings } from "lucide-react";
import { useState } from "react";

export const Header = ({ setSidebarOpen, PageName }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Sample notifications
  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", read: false },
    { id: 2, title: "Deposit request pending", time: "15 min ago", read: false },
    { id: 3, title: "Withdrawal completed", time: "1 hour ago", read: true },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <Disclosure as="nav" className="bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900 border-b border-white/10">
        <div className="max-w-full">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile Menu Button - Left Side */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Notification Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                </button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#111]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-white/10">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-3 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-[#F5C518]/5' : ''}`}>
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

              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>

      {/* Breadcrumb Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Home className="w-4 h-4" />
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#F5C518] font-medium">{PageName}</span>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

// Alternative Simple Version (if you prefer simpler)
export const HeaderSimple = ({ setSidebarOpen, PageName }) => {
  return (
    <>
      {/* Top Navigation Bar */}
      <Disclosure as="nav" className="bg-gradient-to-r from-black via-blue-950/50 to-[#0a0a0a] border-b border-white/10">
        <div className="max-w-full">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page Title for Mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">A</span>
              </div>
              <span className="text-white text-sm font-medium">{PageName}</span>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              {/* Notification Button */}
              <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 block h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>

              {/* User Avatar */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-semibold">AD</span>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>

      {/* Breadcrumb Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#F5C518] font-medium">{PageName}</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;


// import React from "react";
// import { Home, Bell, LogOut } from "lucide-react";

// export const Header = ({ setSidebarOpen, PageName }) => {
//   return (
//     <header className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
//       {/* Left Section */}
//       <div className="flex items-center gap-3">
//         {/* Home Icon */}
//         <Home className="w-6 h-6 text-green-400 cursor-pointer hover:text-green-300" />

//         {/* Arrow */}
//         <svg
//           fill="currentColor"
//           viewBox="0 0 24 44"
//           preserveAspectRatio="none"
//           aria-hidden="true"
//           className="flex-shrink-0 w-6 h-6 text-green-200"
//         >
//           <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
//         </svg>

//         {/* Admin Text */}
//         <span className="text-lg font-semibold">Admin {PageName}</span>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-4">
//         {/* Notification Icon */}
//         <Bell className="w-6 h-6 text-gray-300 cursor-pointer hover:text-white" />

//         {/* Logout Button */}
//         <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm font-medium">
//           <LogOut className="w-5 h-5" />
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }
