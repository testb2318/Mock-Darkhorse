import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { classNames } from "../../../utils/helpers";

export const MenuItem = ({ item, currentTab, handleHeaderMenu, isSubItem = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  
  const handleClick = (e) => {
    if (hasSubmenu) {
      e.preventDefault(); // Prevent navigation for items with submenu
      setIsExpanded(!isExpanded);
      handleHeaderMenu(item.submenu, item.name);
    } else {
      handleHeaderMenu(item.submenu || [], item.name);
    }
  };

  const isActive = currentTab === item.name;

  return (
    <li key={item.name}>
      {hasSubmenu ? (
        // Item with submenu - button to toggle expansion
        <>
          <button
            onClick={handleClick}
            className={classNames(
              isActive
                ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
                : "text-gray-100 hover:bg-gray-800 hover:text-white",
              "w-full text-left group flex items-center justify-between rounded-md px-2 py-2 text-base font-medium leading-6"
            )}
          >
            <div className="flex items-center">
              {!isSubItem && item.icon && (
                <item.icon aria-hidden="true" className="w-6 h-6 mr-3 shrink-0" />
              )}
              {isSubItem && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white mr-3">
                  {item.initial}
                </span>
              )}
              <span>{item.name}</span>
            </div>
            {/* Chevron icon for submenu toggle */}
            <div className="mr-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>
          
          {/* Render submenu items when expanded */}
          {isExpanded && (
            <ul className="mt-1 ml-8 space-y-1">
              {item.submenu.map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    to={subItem.to}
                    onClick={() => handleHeaderMenu([], subItem.name)}
                    className="text-gray-400 hover:bg-gray-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-base leading-6"
                  >
                    <span className="truncate">{subItem.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        // Item without submenu - direct link
        <Link
          to={item.to}
          onClick={handleClick}
          className={classNames(
            isActive
              ? "shadow-lg border-white/50 text-gray-100 border bg-gray-900/50 hover:bg-gray-900/50 hover:text-[#ffeded]"
              : "text-gray-100 hover:bg-gray-800 hover:text-white",
            "group flex items-center rounded-md p-3 text-base font-medium leading-6"
          )}
        >
          {!isSubItem && item.icon && (
            <item.icon aria-hidden="true" className="w-6 h-6 mr-3 shrink-0" />
          )}
          {isSubItem && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white mr-3">
              {item.initial}
            </span>
          )}
          {item.name}
        </Link>
      )}
    </li>
  );
};