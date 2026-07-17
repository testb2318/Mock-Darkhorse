// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getAllWithdrawalByid,
//   deleteWithdrawal,
//   clearErrors,
//   clearMessage,
// } from "../../redux/withdrawalSlice";
// import { getUser } from "../../redux/userSlice";
// import {
//   Banknote,
//   CalendarIcon,
//   ClockIcon,
//   CreditCard,
//   Search,
// } from "lucide-react";
// // import WalletTransferModal from "../../User/TransferToActive";
// // Components
// import Loader from "../../components/common/Loader";
// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";
// import Confirmation from "../../components/modals/Confirmation";
// import WithdrawalModel from "../../components/modals/WithdrawalModel";
// import ROIWithdrawalConfirmation from "../../components/modals/ROIWithdrawalConfirmation";
// import PrincipleWithdrawal from "../../components/modals/PrincipleWithdrawal";
// import BebModal from "../../components/modals/BebModal";
// import BalanceDetail from "../../components/user/BalanceDetail";
// import { selectUser } from "../../redux/authSlice";
// import { has72HoursPassed } from "../../components/common/Timer";

// export default function UserCompoundWithdrawal() {
//   const dispatch = useDispatch();
//   const { singleWithdrawal, loading, error, message } = useSelector(
//     (state) => state.allwithdrawal
//   );
//   const { singleuser } = useSelector((state) => state.users);
//   const auth = useSelector(selectUser);

//   // Local state
//   const [deleteID, setDeleteID] = useState();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [bebModal, setBebModal] = useState(false);
//   const [detail, setDetail] = useState(false);

//   // Withdrawal modals
//   const [openModel, setOpenModel] = useState(false);
//   const [withdrawalROIModel, setWithdrawalROIModel] = useState(false);
//   const [withdrawalPrincipleModel, setWithdrawalPrincipleModel] =
//     useState(false);

//   // Check for pending withdrawals
//   const pendingWithdrawals = singleWithdrawal?.filter(
//     (item) => item.status === "pending"
//   );

//   const hasPendingWithdrawals = pendingWithdrawals?.length > 0;
//   const checkpending = pendingWithdrawals?.length || 0;

//   useEffect(() => {
//     // Load user data
//     if (auth?.id) {
//       dispatch(getUser(auth.id));
//       dispatch(getAllWithdrawalByid(auth.id));
//     }
//   }, [auth?.id, dispatch]);

//   useEffect(() => {
//     // Handle errors and messages
//     if (error) {
//       const errorInterval = setInterval(() => {
//         window.location.reload();
//         dispatch(clearErrors());
//       }, 3000);
//       return () => clearInterval(errorInterval);
//     }

//     if (message) {
//       const messageInterval = setInterval(() => {
//         window.location.reload();
//         dispatch(clearMessage());
//       }, 3000);
//       return () => clearInterval(messageInterval);
//     }
//   }, [dispatch, error, message]);

//   // Modal close handlers
//   const handleBebClose = () => setBebModal(false);
//   const isClose = () => {
//     setModalOpen(false);
//     setDetail(false);
//   };

//   const closeAllModals = () => {
//     setOpenModel(false);
//     setWithdrawalROIModel(false);
//     setWithdrawalPrincipleModel(false);
//   };

//   // Wallet connection check and open appropriate modal
//   const openWithdrawalModal = (type) => {
//     // if (hasPendingWithdrawals) {
//     //   alert("You have pending withdrawal requests");
//     //   return;
//     // }

//     if (!has72HoursPassed(singleuser?.updated_at)) {
//       return alert("You can make request only 72 hours after updation");
//     }

//     if (singleuser?.bep20 || singleuser?.trc20) {
//       if (type === "compound") {
//         setWithdrawalPrincipleModel(true); 
//       }
//     } else {
//       setBebModal(true); // Open wallet connect modal
//     }
//   };

//   // Filter withdrawals based on search term
//   const filteredWithdrawals = singleWithdrawal?.filter(
//     (item) =>
//       item?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item?.type?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Gets status badge styling
//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return (
//           <span className="flex items-center gap-1 px-2 py-1 text-amber-700 bg-amber-100 rounded-full">
//             <ClockIcon className="w-4 h-4" />
//             <span>Pending</span>
//           </span>
//         );
//       case "completed":
//       case "approved":
//         return (
//           <span className="flex items-center gap-1 px-2 py-1 text-green-700 bg-green-100 rounded-full">
//             <CheckCircleIcon className="w-4 h-4" />
//             <span>{status}</span>
//           </span>
//         );
//       case "rejected":
//       case "failed":
//         return (
//           <span className="flex items-center gap-1 px-2 py-1 text-red-700 bg-red-100 rounded-full">
//             <ExclamationCircleIcon className="w-4 h-4" />
//             <span>{status}</span>
//           </span>
//         );
//       default:
//         return (
//           <span className="px-2 py-1 text-gray-700 bg-gray-100 rounded-full">
//             {status}
//           </span>
//         );
//     }
//   };

//   return (
//     <>
//       {/* Alerts and Loader */}
//       {message && <SuccessAlert message={message} />}
//       {error && <ErrorAlert error={error} />}
//       <Loader isLoading={loading} />

//       {/* Main Content */}
//       <div className="tableBg  rounded-md mb-2">
//         {/* Header Section */}
//         <div className="p-4 border-b border-white/20">
//           <div>
//             <h3 className="text-xl font-semibold text-yellow-400">
//               Withdrawal Dashboard
//             </h3>
//             <p className="subtext text-base">
//               Manage and track all your withdrawal requests in one place.
//             </p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//           <div className="relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-600/20 rounded-3xl blur-xl"></div>
//             <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500">
//               <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
//               <div className="relative z-10 flex flex-col items-center text-center">
//                 <div className="relative mb-6">
//                   <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
//                     <CreditCard className="w-10 h-10 text-white" />
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl animate-ping opacity-20"></div>
//                 </div>
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-3">
//                   compound Wallet
//                 </h2>

//                 <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mb-4 opacity-60"></div>

//                 <p className="text-gray-300 text-sm mb-8 leading-relaxed opacity-90">
//                   Investment returns and rental income management center
//                 </p>
//                 <button
//                   onClick={() => openWithdrawalModal("compound")}
//                   className="w-full relative group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:shadow-2xl"
//                 >
//                   <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <span className="relative">Income Wallet</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="p-4">
//           <div className="flex flex-col space-y-4 md:flex-row md:justify-end  md:items-center md:space-y-0 mb-6">
//             <div className="relative w-full ">
//               <input
//                 className="w-full h-10 pl-10 pr-4 text-sm transition duration-200 border rounded-md primeryBg border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 placeholder="Search withdrawals..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
//             </div>
//           </div>
//           <div className="overflow-hidden shadow  rounded-lg">
//             <div className="overflow-x-auto custom-scroll">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-thead p-4 ">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       ID
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Email
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Amount
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Status
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Request Date
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Type
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Processed On
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="subtext divide-y  divide-gray-200">
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="py-10 text-center">
//                         <Loader />
//                       </td>
//                     </tr>
//                   ) : filteredWithdrawals?.length > 0 ? (
//                     filteredWithdrawals
//                       .slice()
//                       .reverse()
//                       .map((item, index) => (
//                         <tr
//                           key={index}
//                           className={
//                             index % 2 === 0
//                               ? "primeryBg bg-opacity-20"
//                               : "primerysub bg-opacity-20"
//                           }
//                         >
//                           <td className="px-4 py-4 whitespace-nowrap text-sm ">
//                             #{index + 1}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm ">
//                             {item?.email}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium ">
//                             ${(item?.amount + item?.deduction).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm">
//                             {getStatusBadge(item?.status)}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
//                             <div className="flex items-center">
//                               <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
//                               {item?.createdAT}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm  capitalize">
//                             {item?.type === "ROI" ? "Rent" : item?.type}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
//                             {item?.acceptat || "-"}
//                           </td>
//                         </tr>
//                       ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         className="px-4 py-4 text-base primeryBg text-center subtext"
//                       >
//                         No withdrawal requests found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {modalOpen && (
//         <Confirmation
//           isClose={isClose}
//           deletefunction={deleteWithdrawal}
//           id={deleteID}
//         />
//       )}
//       {/* {openModel && (
//         <WithdrawalModel openModel={openModel} modelClose={closeAllModals} />
//       )} */}
//       {/* {withdrawalROIModel && (
//         <ROIWithdrawalConfirmation
//           openModel={withdrawalROIModel}
//           modelClose={closeAllModals}
//           id={auth?.id}
//         />
//       )} */}
//       {withdrawalPrincipleModel && (
//         <PrincipleWithdrawal
//           openModel={withdrawalPrincipleModel}
//           modelClose={closeAllModals}
//           id={auth?.id}
//         />
//       )}
//       {bebModal && <BebModal handleBebClose={handleBebClose} />}
//       {detail && (
//         <BalanceDetail
//           detail={singleuser?.business}
//           detail2={singleuser?.wallet}
//           isClose={isClose}
//         />
//       )}
//     </>
//   );
// }



// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   getAllWithdrawalByid,
//   deleteWithdrawal,
//   clearErrors,
//   clearMessage,
// } from "../../redux/withdrawalSlice";
// import { getUser } from "../../redux/userSlice";
// import {
//   Banknote,
//   CalendarIcon,
//   ClockIcon,
//   CreditCard,
//   Search,
// } from "lucide-react";

// import Loader from "../../components/common/Loader";
// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";

// import PrincipleWithdrawal from "../../components/modals/PrincipleWithdrawal";
// import BebModal from "../../components/modals/BebModal";
// import { selectUser } from "../../redux/authSlice";
// import { has72HoursPassed } from "../../components/common/Timer";

// export default function UserCompoundWithdrawal() {
//   const dispatch = useDispatch();
//   const { singleWithdrawal, loading, error, message } = useSelector(
//     (state) => state.allwithdrawal
//   );
//   const { singleuser } = useSelector((state) => state.users);
//   const auth = useSelector(selectUser);

//   // Local state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [bebModal, setBebModal] = useState(false);


//   // Withdrawal modals
//   const [withdrawalPrincipleModel, setWithdrawalPrincipleModel] =
//     useState(false);

//   // Check for pending withdrawals
//   const pendingWithdrawals = singleWithdrawal?.filter(
//     (item) => item.status === "pending"
//   );


//   const checkpending = pendingWithdrawals?.length || 0;

//   useEffect(() => {
//     // Load user data
//     if (auth?.id) {
//       dispatch(getUser(auth.id));
//       dispatch(getAllWithdrawalByid(auth.id));
//     }
//   }, [auth?.id, dispatch]);

//   useEffect(() => {
//     // Handle errors and messages
//     if (error) {
//       const errorInterval = setInterval(() => {
//         window.location.reload();
//         dispatch(clearErrors());
//       }, 3000);
//       return () => clearInterval(errorInterval);
//     }

//     if (message) {
//       const messageInterval = setInterval(() => {
//         window.location.reload();
//         dispatch(clearMessage());
//       }, 3000);
//       return () => clearInterval(messageInterval);
//     }
//   }, [dispatch, error, message]);

//   // Modal close handlers
//   const handleBebClose = () => setBebModal(false);


//   const closeAllModals = () => {
//     setWithdrawalPrincipleModel(false);
//   };

//   // Wallet connection check and open appropriate modal
//   const openWithdrawalModal = (type) => {
//     //   if (!has72HoursPassed(singleuser?.updated_at)) {
//     //   return alert("You can make request only 72 hours after updation");
//     // }

//     if (singleuser?.bep20 || singleuser?.trc20) {
//       if (type === "compound") {
//         setWithdrawalPrincipleModel(true);
//       } 
//     } else {
//       setBebModal(true); // Open wallet connect modal
//     }
//   };

//   // Filter withdrawals based on search term
//   const filteredWithdrawals = singleWithdrawal?.filter(
//     (item) =>
//       item?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item?.type?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Gets status badge styling
//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return (
//           <span className="flex items-center gap-1 px-2 py-1 text-amber-700 bg-amber-100 rounded-full">
//             <ClockIcon className="w-4 h-4" />
//             <span>Pending</span>
//           </span>
//         );
//       case "completed":
//       case "approved":
//         return (
//           <span className="flex items-center gap-1 px-2 py-1 text-green-700 bg-green-100 rounded-full">
//             <CheckCircleIcon className="w-4 h-4" />
//             <span>{status}</span>
//           </span>
//         );
//       case "rejected":
//       case "failed":
//         return (
//           <span className="flex items-center gap-1 px-2 py-1 text-red-700 bg-red-100 rounded-full">
//             <ExclamationCircleIcon className="w-4 h-4" />
//             <span>{status}</span>
//           </span>
//         );
//       default:
//         return (
//           <span className="px-2 py-1 text-gray-700 bg-gray-100 rounded-full">
//             {status}
//           </span>
//         );
//     }
//   };

//   return (
//     <>
//       {/* Alerts and Loader */}
//       {message && <SuccessAlert message={message} />}
//       {error && <ErrorAlert error={error} />}
//       <Loader isLoading={loading} />

//       {/* Main Content */}
//       <div className="tableBg  rounded-md mb-2">
//         {/* Header Section */}
//         <div className="p-4 border-b border-white/20">
//           <div>
//             <h3 className="text-xl font-semibold text-yellow-400">
//               Withdrawal Dashboard
//             </h3>
//             <p className="subtext text-base">
//               Manage and track all your withdrawal requests in one place.
//             </p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//           <div className="relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-600/20 rounded-3xl blur-xl"></div>
//             <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500">
//               <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
//               <div className="relative z-10 flex flex-col items-center text-center">
//                 <div className="relative mb-6">
//                   <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
//                     <CreditCard className="w-10 h-10 text-white" />
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl animate-ping opacity-20"></div>
//                 </div>
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-3">
//                   compound Wallet
//                 </h2>

//                 <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mb-4 opacity-60"></div>

//                 <p className="text-gray-300 text-sm mb-8 leading-relaxed opacity-90">
//                   Investment returns and rental income management center
//                 </p>
//                 <button
//                   onClick={() => openWithdrawalModal("compound")}
//                   className="w-full relative group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:shadow-2xl"
//                 >
//                   <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <span className="relative">Compound Wallet</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="p-4">
//           <div className="flex flex-col space-y-4 md:flex-row md:justify-end  md:items-center md:space-y-0 mb-6">
//             <div className="relative w-full ">
//               <input
//                 className="w-full h-10 pl-10 pr-4 text-sm transition duration-200 border rounded-md primeryBg border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 placeholder="Search withdrawals..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
//             </div>
//           </div>
//           <div className="overflow-hidden shadow  rounded-lg">
//             <div className="overflow-x-auto custom-scroll">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-thead p-4 ">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       ID
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Email
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Amount
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Status
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Request Date
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Type
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
//                     >
//                       Processed On
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="subtext divide-y  divide-gray-200">
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="py-10 text-center">
//                         <Loader />
//                       </td>
//                     </tr>
//                   ) : filteredWithdrawals?.length > 0 ? (
//                     filteredWithdrawals
//                       .slice()
//                       .reverse()
//                       .map((item, index) => (
//                         <tr
//                           key={index}
//                           className={
//                             index % 2 === 0
//                               ? "primeryBg bg-opacity-20"
//                               : "primerysub bg-opacity-20"
//                           }
//                         >
//                           <td className="px-4 py-4 whitespace-nowrap text-sm ">
//                             #{index + 1}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm ">
//                             {item?.email}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium ">
//                             ${(item?.amount + item?.deduction).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm">
//                             {getStatusBadge(item?.status)}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
//                             <div className="flex items-center">
//                               <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
//                               {item?.createdAT}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm  capitalize">
//                             {item?.type === "ROI" ? "Rent" : item?.type}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
//                             {item?.acceptat || "-"}
//                           </td>
//                         </tr>
//                       ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         className="px-4 py-4 text-base primeryBg text-center subtext"
//                       >
//                         No withdrawal requests found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>


//       {withdrawalPrincipleModel && (
//         <PrincipleWithdrawal
//           openModel={withdrawalPrincipleModel}
//           modelClose={closeAllModals}
//           id={auth?.id}
//         />
//       )}
//       {bebModal && <BebModal handleBebClose={handleBebClose} />}

//     </>
//   );
// }
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllWithdrawalByid,
  deleteWithdrawal,
  clearErrors,
  clearMessage,
} from "../../redux/withdrawalSlice";
import { getMyProfile } from "../../redux/userSlice"; // ✅ FIXED
import {
  Banknote,
  CalendarIcon,
  ClockIcon,
  CreditCard,
  Search,
} from "lucide-react";

import Loader from "../../components/common/Loader";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";

import PrincipleWithdrawal from "../../components/modals/PrincipleWithdrawal";
import BebModal from "../../components/modals/BebModal";
import { selectUser } from "../../redux/authSlice";
import { has72HoursPassed } from "../../components/common/Timer";

export default function UserCompoundWithdrawal() {
  const dispatch = useDispatch();
  const { singleWithdrawal, loading, error, message } = useSelector(
    (state) => state.allwithdrawal
  );
  const { myprofile: singleuser } = useSelector((state) => state.users); // ✅ FIXED
  const auth = useSelector(selectUser);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [bebModal, setBebModal] = useState(false);


  // Withdrawal modals
  const [withdrawalPrincipleModel, setWithdrawalPrincipleModel] =
    useState(false);

  // Check for pending withdrawals
  const pendingWithdrawals = singleWithdrawal?.filter(
    (item) => item.status === "pending"
  );


  const checkpending = pendingWithdrawals?.length || 0;

  useEffect(() => {
    // Load user data
    dispatch(getMyProfile());       // ✅ FIXED — token se ID lega
    dispatch(getAllWithdrawalByid()); // ✅ FIXED — token se ID lega
  }, [dispatch]);

  useEffect(() => {
    // Handle errors and messages
    if (error) {
      const errorInterval = setInterval(() => {
        window.location.reload();
        dispatch(clearErrors());
      }, 3000);
      return () => clearInterval(errorInterval);
    }

    if (message) {
      const messageInterval = setInterval(() => {
        window.location.reload();
        dispatch(clearMessage());
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, error, message]);

  // Modal close handlers
  const handleBebClose = () => setBebModal(false);


  const closeAllModals = () => {
    setWithdrawalPrincipleModel(false);
  };

  // Wallet connection check and open appropriate modal
  const openWithdrawalModal = (type) => {
    //   if (!has72HoursPassed(singleuser?.updated_at)) {
    //   return alert("You can make request only 72 hours after updation");
    // }

    if (singleuser?.bep20 || singleuser?.trc20) {
      if (type === "compound") {
        setWithdrawalPrincipleModel(true);
      } 
    } else {
      setBebModal(true); // Open wallet connect modal
    }
  };

  // Filter withdrawals based on search term
  const filteredWithdrawals = singleWithdrawal?.filter(
    (item) =>
      item?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gets status badge styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-amber-700 bg-amber-100 rounded-full">
            <ClockIcon className="w-4 h-4" />
            <span>Pending</span>
          </span>
        );
      case "completed":
      case "approved":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-green-700 bg-green-100 rounded-full">
            <CheckCircleIcon className="w-4 h-4" />
            <span>{status}</span>
          </span>
        );
      case "rejected":
      case "failed":
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-red-700 bg-red-100 rounded-full">
            <ExclamationCircleIcon className="w-4 h-4" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-gray-700 bg-gray-100 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* Alerts and Loader */}
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <Loader isLoading={loading} />

      {/* Main Content */}
      <div className="tableBg  rounded-md mb-2">
        {/* Header Section */}
        <div className="p-4 border-b border-white/20">
          <div>
            <h3 className="text-xl font-semibold text-yellow-400">
              Withdrawal Dashboard
            </h3>
            <p className="subtext text-base">
              Manage and track all your withdrawal requests in one place.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <CreditCard className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl animate-ping opacity-20"></div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-3">
                  compound Wallet
                </h2>

                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mb-4 opacity-60"></div>

                <p className="text-gray-300 text-sm mb-8 leading-relaxed opacity-90">
                  Investment returns and rental income management center
                </p>
                <button
                  onClick={() => openWithdrawalModal("compound")}
                  className="w-full relative group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Compound Wallet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-end  md:items-center md:space-y-0 mb-6">
            <div className="relative w-full ">
              <input
                className="w-full h-10 pl-10 pr-4 text-sm transition duration-200 border rounded-md primeryBg border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            </div>
          </div>
          <div className="overflow-hidden shadow  rounded-lg">
            <div className="overflow-x-auto custom-scroll">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-thead p-4 ">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
                    >
                      Request Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-medium  tracking-wider"
                    >
                      Processed On
                    </th>
                  </tr>
                </thead>
                <tbody className="subtext divide-y  divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : filteredWithdrawals?.length > 0 ? (
                    filteredWithdrawals
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0
                              ? "primeryBg bg-opacity-20"
                              : "primerysub bg-opacity-20"
                          }
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm ">
                            #{index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm ">
                            {item?.email}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium ">
                            ${(item?.amount + item?.deduction).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {getStatusBadge(item?.status)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                              {item?.createdAT}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm  capitalize">
                            {item?.type === "ROI" ? "Rent" : item?.type}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                            {item?.acceptat || "-"}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-4 text-base primeryBg text-center subtext"
                      >
                        No withdrawal requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {withdrawalPrincipleModel && (
        <PrincipleWithdrawal
          openModel={withdrawalPrincipleModel}
          modelClose={closeAllModals}
          id={auth?.id}
        />
      )}
      {bebModal && <BebModal handleBebClose={handleBebClose} />}

    </>
  );
}