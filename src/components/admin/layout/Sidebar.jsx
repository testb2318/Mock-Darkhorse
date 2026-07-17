import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, X } from "lucide-react";
import { MainMenu } from "./menuData";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-black via-[#111] to-[#0a0a0a] border-r border-white/10 text-white transition-all duration-300 z-50 shadow-xl
          ${isMobileMenuOpen ? "w-72" : isSidebarOpen ? "w-64" : "md:w-20"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">A</span>
            </div> */}
            <img src="/logo.jpeg" className="w-11" alt="logo" />

            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="text-lg font-bold bg-gradient-to-r from-[#F5C518] via-[#f0d060] to-[#c9a227] bg-clip-text text-transparent">
                Admin Panel
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-20 -right-3.5 p-1.5 text-black bg-gradient-to-br from-[#D4AF37] to-[#F5C518] border-2 border-white/20 rounded-full hidden md:block shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-110 transition-all duration-300 z-50"
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        {/* Menu Items - No scrollbar */}
        <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <ul className="flex flex-col gap-1 p-3">
            {MainMenu.map((menu, index) => {
              const isActive = activeTab === menu.name;
              const hasSubmenu = menu.submenu && menu.submenu.length > 0;

              return (
                <Disclosure key={index} as="div" defaultOpen={isActive}>
                  {({ open }) => (
                    <>
                      {!hasSubmenu ? (
                        <Link
                          to={menu.to}
                          className={`flex items-center w-full transition-all duration-300 rounded-xl group ${
                            isSidebarOpen || isMobileMenuOpen ? "px-3 py-2.5" : "p-2 justify-center"
                          } ${
                            isActive
                              ? "bg-gradient-to-r from-[#F5C518]/10 to-[#c9a227]/20 border border-[#F5C518]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                              : "hover:bg-white/5"
                          }`}
                          onClick={() => {
                            setActiveTab(menu.name);
                            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                          }}
                        >
                          <div className={`${isActive ? "text-[#F5C518]" : "text-slate-400 group-hover:text-[#f0d060]"} transition-colors duration-200`}>
                            {menu.icon && <menu.icon className="w-5 h-5" />}
                          </div>
                          {(isSidebarOpen || isMobileMenuOpen) && (
                            <span className={`ml-3 text-sm font-medium transition-colors duration-200 ${
                              isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                            }`}>
                              {menu.name}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <>
                          <Disclosure.Button
                            className={`flex items-center w-full transition-all duration-300 rounded-xl group ${
                              isSidebarOpen || isMobileMenuOpen ? "px-3 py-2.5" : "p-2 justify-center"
                            } ${
                              isActive
                                ? "bg-gradient-to-r from-[#F5C518]/10 to-[#c9a227]/20 border border-[#F5C518]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                : "hover:bg-white/5"
                            }`}
                            onClick={() => setActiveTab(menu.name)}
                          >
                            <div className={`${isActive ? "text-[#F5C518]" : "text-slate-400 group-hover:text-[#f0d060]"} transition-colors duration-200`}>
                              {menu.icon && <menu.icon className="w-5 h-5" />}
                            </div>
                            {(isSidebarOpen || isMobileMenuOpen) && (
                              <span className={`ml-3 text-sm font-medium transition-colors duration-200 ${
                                isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                              }`}>
                                {menu.name}
                              </span>
                            )}
                            {(isSidebarOpen || isMobileMenuOpen) && hasSubmenu && (
                              <ChevronDown
                                className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                                  open ? "rotate-180" : ""
                                } ${isActive ? "text-[#F5C518]" : "text-slate-400"}`}
                              />
                            )}
                          </Disclosure.Button>

                          {hasSubmenu && open && (isSidebarOpen || isMobileMenuOpen) && (
                            <Disclosure.Panel className="ml-6 mt-1 space-y-1">
                              {menu.submenu.map((submenu, subIndex) => (
                                <Link
                                  key={subIndex}
                                  to={submenu.to}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    activeTab === submenu.name
                                      ? "bg-[#F5C518]/10 text-[#F5C518] border-l-2 border-[#F5C518]"
                                      : "text-slate-400 hover:text-[#f0d060] hover:bg-white/5"
                                  }`}
                                  onClick={() => {
                                    setActiveTab(submenu.name);
                                    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                                  }}
                                >
                                  {submenu.icon && (
                                    <submenu.icon className="w-4 h-4" />
                                  )}
                                  <span>{submenu.name}</span>
                                </Link>
                              ))}
                            </Disclosure.Panel>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Disclosure>
              );
            })}
          </ul>

          {/* Bottom Section */}
          <div className="mt-auto p-3 border-t border-white/10">
            <div className={`flex items-center gap-3 rounded-xl p-2 bg-white/5 ${isSidebarOpen || isMobileMenuOpen ? "" : "justify-center"}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5C518] flex items-center justify-center shadow-lg">
                <span className="text-black text-xs font-bold">V</span>
              </div>
              {(isSidebarOpen || isMobileMenuOpen) && (
                <div>
                  <p className="text-xs font-medium text-white">Version 1.0.0</p>
                  <p className="text-xs text-slate-500">© 2024</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}