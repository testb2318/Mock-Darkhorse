// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllNotifications,
//   deleteNotification,
// } from "../../redux/notificationSlice"; // Redux actions for notifications
// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";
// import * as Yup from "yup";
// import Confirmation from "../../components/modals/Confirmation";
// const NotificationsTable = () => {
//   const dispatch = useDispatch();
//   const { notifications, loading, error, message } = useSelector(
//     (state) => state.notifications
//   );
//   const [open, setOpen] = useState(false);
//   const [deleteID, setDeleteID] = useState(null);

//   useEffect(() => {
//     dispatch(getAllNotifications()); // Fetch notifications on component load
//   }, [dispatch]);

//   const handleDelete = (id) => {
//     setDeleteID(id);
//     setOpen(true);
//   };

//   function isClose() {
//     setOpen(false);
//     setDeleteID(null);
//   }

//   return (
//     <div className="admin-dark p-4">
//       <div className="admin-table-bg rounded-md shadow-sm  p-4">
//         {message && <SuccessAlert message={message} />}
//         {error && <ErrorAlert error={error} />}
//         <table className="min-w-full text-sm ">
//           <thead className="text-sm">
//             <tr className="admin-thead border-b  border-white/20">
//               <th className="px-4 py-2 text-center border border-white/20 font-medium">
//                 #
//               </th>
//               <th className="px-4 py-2 text-left border border-white/20 font-medium">
//                 Title
//               </th>
//               <th className="px-4 py-2 text-left border border-white/20 font-medium">
//                 Message
//               </th>
//               <th className="px-4 py-2 text-left border border-white/20 font-medium">
//                 All User
//               </th>
//               <th className="px-4 py-2 text-left border border-white/20 font-medium">
//                 Type
//               </th>
//               <th className="px-4 py-2 text-center border border-white/20 font-medium">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {notifications?.map((notification, index) => (
//               <tr
//                 key={notification?.notification_id}
//                 className="border-b admin-primary-bg border-white/20 hover:admin-sub-bg"
//               >
//                 <td className="px-4 py-2 text-center border border-white/20 font-medium text-sm">
//                   {index + 1}
//                 </td>
//                 <td className="px-4 py-2 text-justify border border-white/20 font-medium text-sm">
//                   {notification?.title}
//                 </td>
//                 <td className="px-4 py-2 text-justify border border-white/20 font-medium text-sm">
//                   {notification?.message}
//                 </td>
//                 <td className="px-4 py-2 border border-white/20 font-medium text-sm">
//                   {notification?.users ? "True" : "False"}
//                 </td>
//                 <td className="px-4 py-2 border border-white/20 font-medium text-sm">
//                   {notification?.type}
//                 </td>
//                 <td className="px-4 py-2 text-center border border-white/20 font-medium text-sm">
//                   {/* <button
//                   onClick={() => handleEdit(notification)}
//                   className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
//                 >
//                   Edit
//                 </button> */}
//                   <button
//                     onClick={() => handleDelete(notification?.id)}
//                     className="py-1 ml-2 text-red-500 rounded hover:text-red-600"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke-width="1.5"
//                       stroke="currentColor"
//                       class="w-5 h-5"
//                     >
//                       <path
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//                       />
//                     </svg>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {open && (
//           <Confirmation
//             isClose={isClose}
//             deletefunction={deleteNotification}
//             id={deleteID}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsTable;




















import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotifications,
  deleteNotification,
} from "../../redux/notificationSlice";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import Confirmation from "../../components/modals/Confirmation";

const NotificationsTable = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error, message } = useSelector(
    (state) => state.notifications
  );
  const [open, setOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  const handleDelete = (id) => {
    setDeleteID(id);
    setOpen(true);
  };

  function isClose() {
    setOpen(false);
    setDeleteID(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
      <div className="relative max-w-[1400px] mx-auto">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                  Notifications
                </h2>
                <p className="text-slate-400 text-sm">Manage all system notifications</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {message && <SuccessAlert message={message} />}
            {error && <ErrorAlert error={error} />}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="relative">
                  <div className="w-10 h-10 border-3 border-[#F5C518]/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <span className="ml-3 text-slate-400">Loading...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider rounded-l-lg">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Message</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">All User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {notifications?.map((notification, index) => (
                      <tr key={notification?.notification_id || notification?.id} className="hover:bg-white/5 transition-all duration-300">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-[#F5C518]">{index + 1}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-white">{notification?.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-300 max-w-md line-clamp-2">{notification?.message}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {notification?.users ? (
                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            notification?.type === 'notification' 
                              ? 'bg-[#F5C518]/20 text-[#F5C518] border-[#F5C518]/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {notification?.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(notification?.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all duration-300 group"
                            title="Delete"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!notifications || notifications.length === 0) && (
                      <tr>
                        <td colSpan="6" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-slate-400">No notifications found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {open && (
          <Confirmation
            isClose={isClose}
            deletefunction={deleteNotification}
            id={deleteID}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsTable;















