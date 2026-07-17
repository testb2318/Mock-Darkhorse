
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";

// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";
// import {
//   getQrLink,
//   clearErrors,
//   clearMessage,
// } from "../../redux/qrSlice";

// import Loader from "../../components/common/Loader";

// const Web3Address = () => {
//   const dispatch = useDispatch();
//   const { qr, loading, message, error } = useSelector((state) => state.qr);

//   useEffect(() => {
//     dispatch(getQrLink());
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

//   return (
//     <>
//       {message && <SuccessAlert message={message} />}
//       {error && <ErrorAlert error={error} />}
//       <div className="admin-dark p-4">
//         <div className="admin-table-bg rounded-md shadow-sm">
//           <div className="flex items-center justify-between w-full border-b p-4 border-white/20">
//             <div>
//               <h3 className="text-lg font-semibold">Payment Settings Detail</h3>
//               <p className="text-lg">Overview of the Deposit History.</p>
//             </div>
//             <div className="ml-3">
//               <div className="relative flex items-center w-full max-w-3xl gap-4">
//                 <div className="relative">
//                   <input
//                     className="block w-full px-2 py-2 pr-10 border border-white/20 admin-primary-bg rounded-md shadow-sm placeholder:text-gray-300 sm:text-base sm:leading-6"
//                     placeholder="Search for invoice..."
//                   />
//                   <button
//                     className="absolute flex items-center bg-gray-800 w-8 h-8 px-2 my-auto rounded right-1 top-1"
//                     type="button"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="3"
//                       stroke="currentColor"
//                       className="w-8 h-8 text-slate-100"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className={`${loading ? "h-[260px] items-center" : "h-full"}`}>
//             {loading ? (
//               <Loader />
//             ) : (
//               <div className="p-4">
//                 <div className="flow-root">
//                   <div className="overflow-x-auto custom-scroll">
//                     <div className="inline-block min-w-full align-middle">
//                       <h1 className="text-lg font-semibold mb-2">QR Link History</h1>
//                       <table className="z-10 w-full text-left whitespace-nowrap">
//                         <thead className="text-base">
//                           <tr className="admin-thead border-b border-gray-200">
//                             <th
//                               scope="col"
//                               className="hidden p-2 font-semibold sm:table-cell"
//                             >
//                               ID
//                             </th>
//                             <th
//                               scope="col"
//                               className="hidden p-2 font-semibold sm:table-cell"
//                             >
//                               USDT BEP20
//                             </th>
//                             <th
//                               scope="col"
//                               className="py-2 pl-0 pr-4 font-semibold text-right sm:text-left lg:pr-20"
//                             >
//                               Set at
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y bg-white text-gray-800 divide-white/5">
//                           <tr className="border-b admin-primary-bg border-white/20 hover:admin-sub-bg">
//                             <td className="hidden p-2 sm:table-cell">
//                               <div className="">
//                                 <div className="font-mono text-lg leading-6">
//                                   {qr?.id}
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="hidden p-2 sm:table-cell">
//                               <div className="">
//                                 <div className="font-mono text-lg leading-6">
//                                   {qr?.BEB20}
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="hidden p-2 sm:table-cell">
//                               <div className="">
//                                 <div className="px-2 py-1 text-xs font-medium rounded-md bg-gray-700/40 ring-1 ring-inset ring-white/10">
//                                   {qr?.createdAT}
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };


// export default Web3Address;





import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import {
  getQrLink,
  addQrLink,
  deleteQrLink,
  clearErrors,
  clearMessage,
} from "../../redux/qrSlice";

import Loader from "../../components/common/Loader";

const Web3Address = () => {
  const dispatch = useDispatch();
  const { qr, loading, message, error } = useSelector((state) => state.qr);

  const [bep20Input, setBep20Input] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(getQrLink());
  }, [dispatch]);

  useEffect(() => {
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!bep20Input.trim()) return;

    setSubmitting(true);
    const result = await dispatch(addQrLink({ values: { BEB20: bep20Input.trim() } }));
    setSubmitting(false);

    if (addQrLink.fulfilled.match(result)) {
      setBep20Input("");
      dispatch(getQrLink());
    }
  };

  const handleDelete = async () => {
    if (!qr?.id) return;
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    setDeletingId(qr.id);
    const result = await dispatch(deleteQrLink(qr.id));
    setDeletingId(null);

    if (deleteQrLink.fulfilled.match(result)) {
      dispatch(getQrLink());
    }
  };

  return (
    <>
      {message && <SuccessAlert message={message} />}
      {error && <ErrorAlert error={error} />}
      <div className="admin-dark p-4">
        <div className="admin-table-bg rounded-md shadow-sm">
          <div className="flex items-center justify-between w-full border-b p-4 border-white/20">
            <div>
              <h3 className="text-lg text-gold-dark font-semibold">Payment Settings Detail</h3>
              <p className="text-lg">Overview of the Deposit History.</p>
            </div>
          </div>

          <div className={`${loading ? "h-[260px] items-center" : "h-full"}`}>
            {loading ? (
              <Loader />
            ) : (
              <div className="p-4">
                {/* Add form — only shown when no QR address is set */}
                {!qr && (
                  <form
                    onSubmit={handleAddSubmit}
                    className="mb-6 flex flex-col sm:flex-row items-start sm:items-end gap-3"
                  >
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium mb-1">
                        USDT BEP20 Address
                      </label>
                      <input
                        type="text"
                        value={bep20Input}
                        onChange={(e) => setBep20Input(e.target.value)}
                        placeholder="0x..."
                        required
                        className="block w-full px-3 py-2 border border-gold-medium admin-primary-bg rounded-md shadow-sm placeholder:text-gray-400 sm:text-base"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-gold-dark hover:bg-green-700 disabled:opacity-50 text-white rounded-md font-medium"
                    >
                      {submitting ? "Adding..." : "Add Address"}
                    </button>
                  </form>
                )}

                {/* Info banner shown when a QR address already exists */}
                {qr && (
                  <div className="mb-4 px-4 py-2 rounded-md bg-yellow-700/20 ring-1 ring-inset ring-yellow-500/30 text-sm">
                    An address is already set. Please delete it before adding a new one.
                  </div>
                )}

                <div className="flow-root">
                  <div className="overflow-x-auto custom-scroll">
                    <div className="inline-block min-w-full align-middle">
                      <h1 className="text-lg font-semibold mb-2">QR Link History</h1>
                      <table className="z-10 w-full text-left whitespace-nowrap">
                        <thead className="text-base">
                          <tr className="admin-thead border-b border-gold-medium">
                            <th scope="col" className="hidden p-2 font-semibold sm:table-cell">
                              ID
                            </th>
                            <th scope="col" className="hidden p-2 font-semibold sm:table-cell">
                              USDT BEP20
                            </th>
                            <th scope="col" className="py-2 pl-0 pr-4 font-semibold text-right sm:text-left lg:pr-20">
                              Set at
                            </th>
                            <th scope="col" className="py-2 pl-0 pr-4 font-semibold text-right sm:text-left">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y bg-gold-dark/20 text-gray-800 divide-white/5">
                          {qr ? (
                            <tr className="border-b admin-primary-bg border-gold-medium hover:admin-sub-bg">
                              <td className="hidden p-2 sm:table-cell">
                                <div className="font-mono text-lg leading-6">{qr?.id}</div>
                              </td>
                              <td className="hidden p-2 sm:table-cell">
                                <div className="font-mono text-lg leading-6">{qr?.BEB20}</div>
                              </td>
                              <td className="hidden p-2 sm:table-cell">
                                <div className="px-2 py-1 text-xs font-medium rounded-md bg-gray-700/40 ring-1 ring-inset ring-white/10">
                                  {qr?.created_at}
                                </div>
                              </td>
                              <td className="p-2">
                                <button
                                  onClick={handleDelete}
                                  disabled={deletingId === qr.id}
                                  className="px-3 py-1 bg-gold-dark hover:bg-gold-medium disabled:opacity-50 text-white rounded-md text-sm font-medium"
                                >
                                  {deletingId === qr.id ? "Deleting..." : "Delete"}
                                </button>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-gray-400">
                                No address is set.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Web3Address;
