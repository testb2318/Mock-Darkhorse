// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import Loader from "../BaseFile/comman/Loader";
// import { AiFillDelete } from "react-icons/ai";
// import SuccessAlert from "../BaseFile/comman/SuccessAlert";
// import ErrorAlert from "../BaseFile/comman/ErrorAlert";
// import { Confirmation } from "../BaseFile/comman/Confirmation";
// import {
//   deleteTopup,
//   getAllTopupByid,
//   clearErrors,
//   clearMessage,
// } from "../redux/topupSlice";
// import { getAllPlans } from "../redux/planSlice";
// import UserRetopupModel from "./UserRetopupModel";
// import {getUser } from "../redux/userSlice";
// export default function UserRetopup() {
//   const dispatch = useDispatch();
//   const { singletopup, loading, error, message } = useSelector(
//     (state) => state.alltopup
//   );
//    const { emailuser, singleuser } = useSelector((state) => state.allusers);
//   const { auth } = useSelector((state) => state.auth);
//   const [deleteID, setDeleteID] = useState();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [openModel, setOpenModel] = useState(null);

//   useEffect(() => {
//      dispatch(getUser(auth?.id));
//     dispatch(getAllPlans());
//     if (auth?.id) {
//       dispatch(getAllTopupByid(auth?.id));
//     }
//     if (error) {
//       const errorInterval = setInterval(() => {
//         dispatch(clearErrors());
//       }, 3000);
//       return () => clearInterval(errorInterval);
//     }
//     if (message) {
//       const messageInterval = setInterval(() => {
//         dispatch(clearMessage());
//       }, 3000);
//       return () => clearInterval(messageInterval);
//     }
//   }, [dispatch, error, message]);

//   const handleDelete = (id) => {
//     setDeleteID(id);
//     setModalOpen(true);
//   };

//   const isClose = () => {
//     setModalOpen(false);
//   };

//   function modelClose() {
//     setOpenModel(false);
//   }
//   return (
//     <>
//       {message && <SuccessAlert message={message} />}
//       {error && <ErrorAlert error={error} />}
//       <Loader isLoading={loading} />
//       <div className=" ">
//         <div className="relative mb-8 overflow-hidden">
//           <div className="absolute inset-0  animate-gradient-x"></div>
//           <div className="m-0.5 rounded-md p-4 relative  border border-gray-200 shadow-md z-10">
//             <div className="grid lg:grid-cols-2 grid-cols-1 lg:space-y-0 space-y-4 gap-4">
//               <div className="flex items-center">
//                 <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-pink-600 flex items-center justify-center mr-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6 "
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
//                     <path
//                       fillRule="evenodd"
//                       d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h2 className="font-semibold text-lg text-gray-800 ">
//                     Transaction History
//                   </h2>
//                   <p className="text-gray-600 mt-1 text-sm">
//                     Manage your account top-ups and transfers
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <div className=" flex gap-2">
//                   <div className="relative flex-grow md:max-w-full max-w-xs">
//                     <input
//                       className="w-full bg-gray-100 border py-2.5 text-sm pl-12 pr-4 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                       placeholder="Search transactions..."
//                     />
//                     <div className="absolute top-2.5 left-0 pl-4 flex items-center pointer-events-none">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-gray-700"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                         />
//                       </svg>
//                     </div>
//                   </div>

//                   {/* <button
//                   type="button"
//                   onClick={() => setOpenModel(true)}
//                   className="group relative overflow-hidden rounded-md bg-blue-600 px-4 py-2 font-semibold"
//                 >
//                   <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-blue-600 to-yellow-600 transition-transform duration-300 group-hover:translate-y-0"></span>
//                   <span className="relative flex items-center justify-center text-sm">
//                     Other Top-Up
//                   </span>
//                 </button> */}
//                   <button
//                     type="button"
//                     onClick={() => {
//                       if (singleuser?.business === 0) {
//                         alert(
//                           "You don't have sufficient balance in your active wallet. Please add sufficient balance first."
//                         );
//                         return; 
//                       }
//                       setOpenModel(true);
//                     }}
//                     className="group relative overflow-hidden rounded-md bg-blue-600 px-4 py-2 font-semibold"
//                   >
//                     <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-blue-600 to-yellow-600 transition-transform duration-300 group-hover:translate-y-0"></span>
//                     <span className="relative flex items-center justify-center text-sm">
//                       Other Top-Up
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className=" overflow-hidden ">
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto custom-scroll">
//               <table className="w-full">
//                 <thead className="bg-gray-900border-b border-blue-500">
//                   <tr className="text-gray-100 text-sm">
//                     <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
//                       Recipient
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
//                       Amount
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-left font-medium  uppercase tracking-wider border-b border-gray-700">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {singletopup
//                     ?.slice()
//                     .reverse()
//                     .map((item, index) => (
//                       <tr
//                         key={index}
//                         className="hover:bg-gray-100 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-800">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-yellow-100 font-bold">
//                               {item?.userto_email?.charAt(0)?.toUpperCase()}
//                             </div>
//                             <div className="ml-3">
//                               <div className="text-sm font-medium ">
//                                 {item?.userto_email}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-semibold text-green-600">
//                             ${item?.amount}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
//                       ${
//                         item?.status === "Completed"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : item?.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                           >
//                             {item?.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-gray-800 text-sm ">
//                           {item?.createdAT}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//       {modalOpen && (
//         <Confirmation
//           isClose={isClose}
//           deletefunction={deleteTopup}
//           id={deleteID}
//         />
//       )}
//       {openModel && (
//         <UserRetopupModel openModel={openModel} modelClose={modelClose} />
//       )}
//     </>
//   );
// }
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../BaseFile/comman/Loader";
import { AiFillDelete } from "react-icons/ai";
import SuccessAlert from "../BaseFile/comman/SuccessAlert";
import ErrorAlert from "../BaseFile/comman/ErrorAlert";
import { Confirmation } from "../BaseFile/comman/Confirmation";
import {
  deleteTopup,
  getAllTopupByid,
  clearErrors,
  clearMessage,
} from "../redux/topupSlice";
import { getAllPlans } from "../redux/planSlice";
import UserRetopupModel from "./UserRetopupModel";
import { getMyProfile } from "../redux/userSlice"; // ✅ getUser → getMyProfile

export default function UserRetopup() {
  const dispatch = useDispatch();
  const { singletopup, loading, error, message } = useSelector(
    (state) => state.alltopup
  );
  const { myprofile } = useSelector((state) => state.users); // ✅ singleuser → myprofile
  const { auth } = useSelector((state) => state.auth);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [openModel, setOpenModel] = useState(null);

  useEffect(() => {
    dispatch(getMyProfile()); // ✅ token se ID lega
    dispatch(getAllPlans());
    if (auth?.id) {
      dispatch(getAllTopupByid(auth?.id));
    }
    if (error) {
      const errorInterval = setInterval(() => {
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }
    if (message) {
      const messageInterval = setInterval(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message]);

  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => {
    setModalOpen(false);
  };

  function modelClose() {
    setOpenModel(false);
  }

  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="glass-card animated-border-gold rounded-2xl p-0.5 mb-8 shadow-[0_0_60px_rgba(212,175,55,0.08)]">
          <div className="bg-black/40 rounded-[15px] overflow-hidden p-6 relative z-10 border-b border-gold-medium/30">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl border border-gold-medium/20 bg-gold-medium/10 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gold-light"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-white font-display">
                    Transaction History
                  </h2>
                  <p className="text-gold-medium/70 mt-1 text-sm">
                    Manage your account top-ups and transfers
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (myprofile?.business === 0) {
                      alert(
                        "You don't have sufficient balance in your active wallet. Please add sufficient balance first."
                      );
                      return;
                    }
                    setOpenModel(true);
                  }}
                  className="flex items-center justify-center gap-2 px-5 h-10 rounded-xl text-sm font-semibold text-gold-medium hover:text-black transition-all duration-200 uppercase tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)",
                    border: "1px solid rgba(212,175,55,0.4)",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.1)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#d4af37";
                    e.currentTarget.style.boxShadow = "0 4px 28px rgba(212,175,55,0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(212,175,55,0.1)";
                  }}
                >
                  Other Top-Up
                </button>
              </div>
            </div>
          </div>

        <div className="overflow-hidden glass-card animated-border-gold rounded-2xl p-0.5">
          <div className="bg-black/40 rounded-[15px] overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold-medium"></div>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full">
                <thead className="bg-black/20 border-b border-gold-medium/30">
                  <tr className="text-gold-medium text-[10px] uppercase tracking-widest font-semibold">
                    <th className="px-6 py-4 text-left border-b border-gold-medium/30">
                      Recipient
                    </th>
                    <th className="px-6 py-4 text-left border-b border-gold-medium/30">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left border-b border-gold-medium/30">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left border-b border-gold-medium/30">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {singletopup
                    ?.slice()
                    .reverse()
                    .map((item, index) => (
                      <tr
                        key={index}
                        className="transition-colors duration-150 border-b border-gold-medium/10 hover:bg-gold-medium/5"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-white">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full border border-gold-medium/30 bg-gold-medium/10 flex items-center justify-center text-gold-light font-bold">
                              {item?.userto_email?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">
                                {item?.userto_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gold-light">
                            ${item?.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                            ${
                              item?.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/20"
                                : item?.status === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/20"
                            }`}
                          >
                            {item?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                          {item?.createdAT}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      </div>
      {modalOpen && (
        <Confirmation
          isClose={isClose}
          deletefunction={deleteTopup}
          id={deleteID}
        />
      )}
      {openModel && (
        <UserRetopupModel openModel={openModel} modelClose={modelClose} />
      )}
    </>
  );
}