// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { signoutuser } from "@/redux/authSlice";
// import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
// import { User, Settings, LogOut } from "lucide-react";

// const UserDropdown = ({ user }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(signoutuser());
//     navigate("/login");
//   };

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <MenuButton className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200 transition">
//         <User className="h-5 w-5 text-gray-700" />
//         <span className="text-sm font-medium">{user?.username || "User"}</span>
//       </MenuButton>

//       <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//         <div className="py-1">
//           <MenuItem>
//             {({ active }) => (
//               <button
//                 onClick={() => navigate("/account")}
//                 className={`${
//                   active ? "bg-gray-100" : ""
//                 } flex w-full px-4 py-2 text-sm text-gray-700`}
//               >
//                 <Settings className="mr-2 h-4 w-4" /> Account Settings
//               </button>
//             )}
//           </MenuItem>
//           <MenuItem>
//             {({ active }) => (
//               <button
//                 onClick={handleLogout}
//                 className={`${
//                   active ? "bg-gray-100" : ""
//                 } flex w-full px-4 py-2 text-sm text-gray-700`}
//               >
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </button>
//             )}
//           </MenuItem>
//         </div>
//       </MenuItems>
//     </Menu>
//   );
// };

// export default UserDropdown;
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signoutuser } from "@/redux/authSlice";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { User, Settings, LogOut } from "lucide-react";

const UserDropdown = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =======================
     LOGOUT BUTTON
  ======================= */
  const handleLogout = async () => {
    localStorage.clear();        // ✅ clear localStorage
    await dispatch(signoutuser());
    navigate("/login");
  };

  /* =======================
     WINDOW / TAB CLOSE
  ======================= */
  useEffect(() => {
    const handleWindowClose = () => {
      localStorage.clear();      // ✅ clear localStorage on close
    };

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200 transition">
        <User className="h-5 w-5 text-gray-700" />
        <span className="text-sm font-medium">{user?.username || "User"}</span>
      </MenuButton>

      <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => navigate("/account")}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full px-4 py-2 text-sm text-gray-700`}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </button>
            )}
          </MenuItem>

          <MenuItem>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full px-4 py-2 text-sm text-gray-700`}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default UserDropdown;
