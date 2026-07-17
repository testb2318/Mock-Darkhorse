import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import Confirmation from "../../components/modals/Confirmation";
import Loader from "../../components/common/Loader";
import { TbBinaryTree } from "react-icons/tb";
import {
  getAllUsers,
  clearErrors,
  deleteUsers,
  clearMessage,
} from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Income() {
  const { action } = useParams(); // Get any params (if needed for actions)
  const dispatch = useDispatch();
  const { users, loading, error, message } = useSelector(
    (state) => state.users
  );
  const [allUser, setAllUser] = useState(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalopen, setModalopen] = useState(false);
  const [deleteID, setdeleteID] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set number of items per page
  const IconContainer = ({ children }) => (
    <div className="relative z-0 flex items-center justify-center">
      {children}
    </div>
  );
  useEffect(() => {
    dispatch(getAllUsers());
    setAllUser(users);
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

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setAllUser(
      users?.filter((p) => p.username?.toLowerCase().includes(searchTerm))
    );
    setSearchQuery(e.target.value);
  };
  const totalPages = Math.ceil(
    (searchQuery ? allUser : users)?.length / itemsPerPage
  );
  const currentUsers = (searchQuery ? allUser : users)?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePagination = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Modal close function
  function isClose() {
    setModalopen(false);
  }

  // Handle delete action
  function handleDelete(id) {
    setdeleteID(id);
    if (deleteID) {
      console.log(id);
      setModalopen(true);
    }
  }

  return (
    <div className="admin-dark p-4">
      <div className="admin-table-bg rounded-md shadow-sm  p-4">
        <div className="flex justify-end">
          <label htmlFor="email" className="sr-only">
            Search
          </label>
          <input
            id="search"
            name="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e)}
            type="text"
            placeholder="search here . . ."
            className="block w-full px-2 py-2  border border-white/20 admin-primary-bg  rounded-md shadow-sm md:max-w-sm  placeholder:text-gray-300 sm:text-base sm:leading-6"
          />
        </div>

        {/* Display Success or Error Alerts */}
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error} />}

        {/* Table or Loader */}
        <div className={` ${loading ? "h-[560px] items-center" : "h-full"}`}>
          {loading ? (
            <Loader />
          ) : (
            <div className="flow-root mt-4">
              <div className="overflow-x-auto custom-scroll">
                <div className="inline-block min-w-full py-2 align-middle">
                  <table className="min-w-full border-collapse ">
                    {/* Table Headings */}
                    <thead className="text-base">
                     <tr className="bg-gold-medium/50 border-b border-gray-200">
                        <th
                          scope="col"
                          className="p-4 font-medium text-left border-r  border-white/20 "
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="p-4 font-medium text-left border-r  border-white/20 border-white/20  sm:table-cell"
                        >
                          Active Plan
                        </th>
                        {/* <th
                          scope="col"
                          className="p-4 font-medium text-left border-r  border-white/20 border-white/20  sm:table-cell"
                        >
                          Salary
                        </th> */}
                        <th
                          scope="col"
                          className="p-4 font-medium text-right border-r  sm:text-left border-r  border-white/20 "
                        >
                          Trade
                        </th>
                        {/* <th
                          scope="col"
                          className="p-4 font-medium text-right border-r  sm:text-left border-r  border-white/20 "
                        >
                          Level Day / Total
                        </th> */}
                        {/* <th
                          scope="col"
                          className="p-4 font-medium text-right border-r  sm:text-left border-r  border-white/20 "
                        >
                          Reward
                        </th> */}
                        <th
                          scope="col"
                          className="p-4 font-medium text-center"
                        >
                          Tree
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="text-center divide-y ">
                      {currentUsers?.map((item, index) => (
                        <tr
                          key={index}
                        className="border-b bg-gold-dark/20 border-white/20  hover:admin-sub-bg"
                        >
                          <td className="px-4 py-4  text-base font-medium text-left  border-r border-gray-600">
                            <div className="w-full truncate">{item?.email}</div>
                          </td>
                          <td className="px-4 py-4 text-base  border-r border-gray-600">
                            {item?.active_plan}
                          </td>
                          {/* <td className="px-4 py-4 text-base text-right    border-r border-gray-600">
                            {item?.total_salary}
                          </td> */}
                          <td className="px-4 py-4 text-base text-right  border-r border-gray-600">
                            {item?.roi_income_day} / {item?.roi_income}
                          </td>
                          {/* <td className="px-4 py-4 text-base text-right  border-r border-gray-600">
                            {item?.level_month_day} / {item?.level_month}
                          </td>
                          <td className="px-4 py-4 text-base text-right  border-r border-gray-600">
                            {item?.reward}
                          </td> */}
                          <td className="px-4 py-4 text-center">
                            <Link to={`/admin/refferal/${item?.refferal_code}`}>
                              <IconContainer>
                                <TbBinaryTree
                                  className="w-4 h-4 cursor-pointer"
                                  title="details"
                                />
                              </IconContainer>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between p-4">
          <button
            onClick={() => handlePagination("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 text-lg text-white bg-[#D4AF37] rounded"
          >
            Previous
          </button>
          <div className="text-lg ">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePagination("next")}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-lg text-white bg-[#D4AF37] rounded"
          >
            Next
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {modalopen && (
          <Confirmation
            isClose={isClose}
            deletefunction={deleteUsers}
            id={deleteID}
          />
        )}
      </div>
    </div>
  );
}
