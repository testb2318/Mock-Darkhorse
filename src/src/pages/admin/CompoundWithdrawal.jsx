import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useParams } from "react-router-dom";

import {
  getAllWithdrawal,
  deleteWithdrawal,
  clearErrors,
  clearMessage,
  updateCompoundWithdrawal
} from "../../redux/withdrawalSlice";

import Confirmation from "../../components/modals/Confirmation";
import { getAllUsers } from "../../redux/userSlice";
import { Copy, Check } from "lucide-react";
import WagmiCryptoComponent from "../../components/shared/WagmiCryptoComponent";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";

// ✅ Copy Button Component
const CopyButton = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center text-[#F5C518] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md px-2 py-1 text-xs transition-colors"
    >
      {copied ? (
        <>
          <Check size={14} className="mr-1" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy size={14} className="mr-1" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default function UserCompoundWithdrawal() {
  const { action } = useParams();
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [editableWithdrawal, setEditableWithdrawal] = useState(null);
  const [allWithdrawalRequest, setAllWithdrawalRequest] = useState([]);
  const [deleteID, setDeleteID] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState();
  const [filterquery, setFilterquery] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const { allwithdrawal, loading, error, message } = useSelector(
    (state) => state.allwithdrawal
  );

  // 🔹 Fetch withdrawals
  useEffect(() => {
    dispatch(getAllWithdrawal()); // yahan backend se sare withdrawal aayenge
    dispatch(getAllUsers());

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

  // 🔹 Pre-filter based on route param
  useEffect(() => {
    if (action) {
      setFilterquery(action);
    }
  }, [action]);

  // 🔹 Search function
  const handleSearch = (e) => {
    setAllWithdrawalRequest(
      allwithdrawal?.filter((p) => p.email?.includes(e.target.value))
    );
    setSearchQuery(e.target.value);
  };

  // 🔹 Delete
  const handleDelete = (id) => {
    setDeleteID(id);
    setModalOpen(true);
  };

  const isClose = () => {
    setModalOpen(false);
  };

  // 🔹 Edit
  const handleEdit = (item) => {
    setEditableWithdrawal(item);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableWithdrawal(null);
  };

  const handleChange = (e) => {
    setValues(e.target.value);
  };

  // 🔹 Save Update
  const handleSaveChange = (id) => {
    if (editableWithdrawal) {
      dispatch(
        updateCompoundWithdrawal({
          id: id,
          status: values,
          amount: editableWithdrawal?.amount + editableWithdrawal?.deduction,
          user_id: editableWithdrawal?.user_id,
        })
      );
      setEditMode(false);
      setEditableWithdrawal(null);
    }
  };

  // 🔹 Helpers
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toTimeString().split(" ")[0];
    return `${formattedDate} - ${formattedTime}`;
  };

  const formatAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="admin-dark p-4">
      <div className="admin-table-bg p-4 rounded-md shadow-sm">
        {/* Filter & Search */}
        <div className="sm:flex gap-3 items-center justify-end">
          <div>
            <select
              id="filterquery"
              name="filterquery"
              value={filterquery}
              onChange={(e) => setFilterquery(e.target.value)}
              className="block w-full px-2 py-2 pr-10 border border-white/20 admin-primary-bg rounded-md shadow-sm placeholder:text-gray-300 sm:text-base sm:leading-6"
            >
              <option value="" disabled>
                Select status...
              </option>
              <option value="complete">Complete</option>
              <option value="decline">Decline</option>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
            </select>
          </div>
          <div>
            <input
              id="search"
              name="search"
              value={searchQuery}
              onChange={handleSearch}
              type="text"
              placeholder="search here . . ."
              className="block w-full px-2 py-2 pr-10 border border-white/20 admin-primary-bg rounded-md shadow-sm placeholder:text-gray-300 sm:text-base sm:leading-6"
            />
          </div>
        </div>

        {/* Alerts */}
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error} />}

        {/* Table */}
        <div className="overflow-x-auto custom-scroll mt-4">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full text-left border-collapse whitespace-nowrap bg-gray-900 border-b border-[#F5C518] text-gray-300">
              <thead className="text-sm">
                <tr className="admin-thead border-b border-white/20">
                  <th className="px-4 py-3 border-r border-white/20">Name</th>
                  <th className="px-4 py-3 border-r border-white/20">Amount</th>
                  <th className="px-4 py-3 border-r border-white/20">Deduction</th>
                  <th className="px-4 py-3 border-r border-white/20">Total</th>
                  <th className="px-4 py-3 text-right border-r border-white/20">Status</th>
                  <th className="px-4 py-3 border-r border-white/20">Request/Action</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-base">
                {(searchQuery ? allWithdrawalRequest : allwithdrawal)
                  ?.filter(
                    (item) =>
                      item?.type === "compound" &&
                      (filterquery ? item?.status === filterquery : true)
                  )
                  ?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b admin-primary-bg border-white/20 hover:admin-sub-bg"
                    >
                      <td className="py-4 px-4 border-r border-white/20 lg:w-[200px]">
                        <span className="block text-[12px]">{item?.email}</span>
                        {item.status==="pending" && item?.bep20 && (
                          <WagmiCryptoComponent
                            mode="withdrawal"
                            val={parseFloat(item?.amount)}
                            toAddress={item?.withdrawal_address}
                            onTransactionComplete={(data) => {
                              console.log("Withdrawal completed:", data);
                            }}
                          />
                        )}
                      </td>
                      <td className="px-4 py-4 border-r border-white/20">
                        ${item?.amount}
                      </td>
                      <td className="px-4 py-4 border-r border-white/20">
                        ${item?.deduction}
                      </td>
                      <td className="px-4 py-4 border-r border-white/20">
                        ${item?.amount + item?.deduction}
                      </td>
                      <td className="px-4 py-4 text-right border-r border-white/20">
                        {editMode && editableWithdrawal?.id === item?.id ? (
                          <select
                            id="status"
                            name="status"
                            className="w-full px-3 py-1 admin-table-bg border-0 rounded-sm shadow focus:outline-none"
                            onChange={handleChange}
                            defaultValue={item?.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="decline">Decline</option>
                            <option value="complete">Complete</option>
                          </select>
                        ) : (
                          <span className="px-2 py-1 font-medium rounded admin-table-bg ring-1 ring-gray-300">
                            {item?.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 border-r border-white/20">
                        {formatDateTime(item?.createdAt)} /{" "}
                        {formatDateTime(item?.acceptat)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center space-x-4">
                          <Link to={`/admin/check/profile/${item?.user_id}`}>
                            <FaEye className="w-4 h-4 text-green-700 cursor-pointer" />
                          </Link>
                          {editMode && editableWithdrawal?.id === item?.id ? (
                            <>
                              <FaCheck
                                className="w-4 h-4 text-green-700 cursor-pointer"
                                onClick={() => handleSaveChange(item?.id)}
                              />
                              <FaTimes
                                className="w-4 h-4 text-red-700 cursor-pointer"
                                onClick={handleCancelEdit}
                              />
                            </>
                          ) : (
                            <>
                              {item?.status === "decline" ||
                              item?.status === "complete" ? null : (
                                <GrEdit
                                  className="w-4 h-4 text-[#F5C518] cursor-pointer"
                                  onClick={() => handleEdit(item)}
                                />
                              )}
                              <AiFillDelete
                                className="w-4 h-4 text-red-400 cursor-pointer"
                                onClick={() => handleDelete(item?.id)}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && (
          <Confirmation
            isClose={isClose}
            deletefunction={deleteWithdrawal}
            id={deleteID}
          />
        )}
      </div>
    </div>
  );
}
