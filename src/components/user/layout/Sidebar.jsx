import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";
import { userMenus } from "../../../constant";
import { ChevronLeft, ChevronDown, X } from "lucide-react";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
}) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-black via-[#0a0a0a] to-[#111111] border-r border-[#2962ff]/20 text-white transition-all duration-300 z-50
        ${isMobileMenuOpen ? "w-64" : isSidebarOpen ? "w-64" : "md:w-16"}
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
    >
      {/* Logo + Mobile Close */}
      <div className="flex items-center justify-between px-4 py-1 border-b border-[#2962ff]/20">
        <Link to="/">
          <img src="/logo.png" className="w-16" alt="logo" />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden text-[#2962ff] hover:text-[#2962ff]/80 p-2 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Toggle (Desktop) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-[50px] -right-3.5 p-2 text-[#2962ff] border bg-gradient-to-b from-black via-[#111111] to-[#1a1a1a] border-[#2962ff]/40 shadow-[0_0_6px_rgba(41,98,255,0.3)] rounded-full hidden md:block hover:shadow-[0_0_12px_rgba(41,98,255,0.5)] transition-all duration-200"
      >
        <ChevronLeft
          className={`w-4 h-4 transition-transform ${
            isSidebarOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      {/* Menu Items */}
      <div className="flex flex-col h-full p-2">
        <ul className="flex flex-col space-y-2 overflow-auto no-scrollbar mb-24">
          {userMenus.map((menu, index) => {
            const isActive = activeTab === menu.name;
            const hasSubmenu = menu.submenu.length > 0;

            return (
              <Disclosure key={index} as="div">
                {({ open }) => (
                  <>
                    {!hasSubmenu ? (
                      <Link
                        to={menu.to}
                        className={`flex items-center w-full transition-all duration-200 rounded-lg 
                          ${isSidebarOpen ? "p-3" : "p-2 justify-center"} 
                          ${
                            isActive
                              ? "bg-[#2962ff]/10 border border-[#2962ff]/40 shadow-[0_0_8px_rgba(41,98,255,0.2)] text-[#2962ff]"
                              : "hover:bg-[#2962ff]/5 hover:border hover:border-[#2962ff]/20 text-white"
                          }`}
                        onClick={() => {
                          setActiveTab(menu.name);
                          if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                        }}
                      >
                        {menu.icon && <menu.icon className="w-6 h-6" />}
                        {(isSidebarOpen || isMobileMenuOpen) && (
                          <span className="ml-3">{menu.name}</span>
                        )}
                      </Link>
                    ) : (
                      <Disclosure.Button
                        className={`flex items-center w-full transition-all duration-200 rounded-lg 
                          ${isSidebarOpen ? "p-3" : "p-2 justify-center"} 
                          ${
                            isActive
                              ? "bg-[#2962ff]/10 border border-[#2962ff]/40 shadow-[0_0_8px_rgba(41,98,255,0.2)] text-[#2962ff]"
                              : "hover:bg-[#2962ff]/5 hover:border hover:border-[#2962ff]/20 text-white"
                          }`}
                        onClick={() => {
                          setActiveTab(menu.name);
                        }}
                      >
                        {menu.icon && <menu.icon className="w-6 h-6" />}
                        {(isSidebarOpen || isMobileMenuOpen) && (
                          <span className="ml-3">{menu.name}</span>
                        )}
                        {(isSidebarOpen || isMobileMenuOpen) && hasSubmenu && (
                          <ChevronDown
                            className={`w-5 h-5 ml-auto transition-transform ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </Disclosure.Button>
                    )}

                    {/* Submenu Panel */}
                    {hasSubmenu &&
                      open &&
                      (isSidebarOpen || isMobileMenuOpen) && (
                        <Disclosure.Panel className="pl-4 mt-1">
                          <ul className="space-y-1">
                            {menu.submenu.map((submenu, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  to={submenu.to}
                                  className={`flex items-center p-2 rounded-lg transition-all duration-200 
                                    ${
                                      activeTab === submenu.name
                                        ? "bg-[#2962ff]/10 border border-[#2962ff]/30 text-[#2962ff] shadow-[0_0_6px_rgba(41,98,255,0.15)]"
                                        : "text-white hover:bg-[#2962ff]/5 hover:border hover:border-[#2962ff]/20"
                                    }`}
                                  onClick={() => {
                                    setActiveTab(submenu.name);
                                    if (isMobileMenuOpen)
                                      setIsMobileMenuOpen(false);
                                  }}
                                >
                                  {submenu.icon && (
                                    <submenu.icon className="w-5 h-5 mr-4" />
                                  )}
                                  {submenu.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      )}
                  </>
                )}
              </Disclosure>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}