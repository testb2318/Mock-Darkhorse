// import React, { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createNotification,
//   resetState,
//   addBanner,
// } from "../../redux/notificationSlice";
// import Spinner from "../../components/common/Spinner";
// import { getAllUsers } from "../../redux/userSlice";
// import SuccessAlert from "../../components/common/SuccessAlert";
// import ErrorAlert from "../../components/common/ErrorAlert";
// // Validation schema
// const validationSchema = Yup.object().shape({
//   title: Yup.string().required("Title is required"),
//   message: Yup.string().required("Message is required"),
//   users: Yup.boolean(),
//   type: Yup.string()
//     .oneOf(["notification", "site_popup"], "Invalid type")
//     .required("Type is required"),
// });

// const NotificationForm = () => {
//   const dispatch = useDispatch();
//   const { users } = useSelector((state) => state.users);
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]); // Track selected users
//   const [open, setOpen] = useState(false);
//   const [openError, setOpenError] = useState(false);
//   const [file, setFile] = useState(null);

//   const { loading, error, message } = useSelector(
//     (state) => state.notifications
//   );

//   useEffect(() => {
//     if (message) {
//       setOpen(true);
//     }
//     if (error) {
//       setOpenError(true);
//     }
//   }, [message, error]);

//   useEffect(() => {
//     dispatch(getAllUsers());
//   }, [dispatch]);

//   const handleUserSearch = (searchTerm) => {
//     if (searchTerm) {
//       const filteredUsers = users?.filter((user) =>
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setSearchResults(filteredUsers);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const handleUserSelect = (user) => {
//     if (selectedUsers.includes(user.id)) {
//       setSelectedUsers(selectedUsers.filter((id) => id !== user.id)); // Remove user if already selected
//     } else {
//       setSelectedUsers([...selectedUsers, user.id]); // Add user to selection
//     }
//   };

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) {
//       console.log("Select a file");
//       return;
//     }
//     setFile(selectedFile);
//     const formData = new FormData();
//     formData.append("image", selectedFile);

//     dispatch(addBanner(formData))
//       .then((response) => {
//         console.log("Banner added successfully", response);
//       })
//       .catch((error) => {
//         console.error("Error adding banner:", error);
//       });
//   };
//   return (
//     <>
//       {message && <SuccessAlert message={message} />}
//      {error && <ErrorAlert error={error?.message} />}  // ✅
//       <div className="admin-dark p-4">
//         <div className="grid grid-cols-1 admin-table-bg rounded-md shadow-sm   ">
//           <h1 className=" text-2xl font-medium p-4 border-b border-white/20">
//             Create Notification
//           </h1>
//           <div className="p-4">
//             <Formik
//               initialValues={{
//                 title: "",
//                 message: "",
//                 users: true,
//                 type: "notification",
//               }}
//               validationSchema={validationSchema}
//               onSubmit={(values, { resetForm }) => {
//                 // Prepare values including selected user IDs
//                 const notificationData = {
//                   ...values,
//                   recipients: selectedUsers,
//                 };
//                 // console.log(notificationData);
//                 dispatch(createNotification(notificationData));
//                 resetForm();
//               }}
//             >
//               {({ errors, touched, setFieldValue, values }) => (
//                 <Form className="">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="">
//                       <label className="block mb-1 text-base  font-semibold ">
//                         Title
//                       </label>
//                       <Field
//                         name="title"
//                         as="input"
//                         placeholder="Enter Title"
//                         className="block w-full placeholder:text-gray-400 p-2 text-base  admin-primary-bg border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5C518]"
//                       />
//                       <ErrorMessage
//                         name="title"
//                         component="div"
//                         className="mt-1 text-base text-red-600"
//                       />
//                     </div>
//                     <div className="mb-4">
//                       <label className="block mb-1 text-base  font-semibold ">
//                         Upload Banner
//                       </label>
//                       <div className="">
//                         <input
//                           id="file"
//                           type="file"
//                           name="image"
//                           onChange={handleFileChange}
//                           className="  cursor-pointer w-full py-[8px] border px-3 border-white/20 placeholder:text-gray-400    rounded-md text-base admin-primary-bg"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block mb-1 text-base   font-semibold ">
//                       Message
//                     </label>
//                     <Field
//                       name="message"
//                       as="textarea"
//                       className="block w-full placeholder:text-gray-400  p-3 admin-primary-bg  border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5C518]"
//                       rows="4"
//                     />
//                     <ErrorMessage
//                       name="message"
//                       component="div"
//                       className="mt-1 text-base text-red-600"
//                     />
//                   </div>

//                   <div className="flex items-center mb-4">
//                     <Field
//                       type="checkbox"
//                       name="users"
//                       checked={values.users}
//                       className="mr-2"
//                       onChange={(e) => {
//                         const isChecked = e.target.checked;
//                         setFieldValue("users", isChecked);
//                         if (isChecked) {
//                           setSelectedUsers([]); // Clear selected users when checked
//                         }
//                       }}
//                     />
//                     <label className="text-base  font-medium   ">
//                       All Users
//                     </label>
//                   </div>

//                   {!errors.users && !values.users && (
//                     <div className="mb-4">
//                       <label className="block mb-1 text-base font-semibold text-gray-300">
//                         Search User
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="Search user"
//                         onChange={(e) => handleUserSearch(e.target.value)}
//                         className="block w-full p-3 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F5C518]"
//                       />
//                       {searchResults.length > 0 && (
//                         <div className="p-2 mt-2 bg-gray-100 border border-white/20 rounded-md">
//                           {searchResults.map((user) => (
//                             <div
//                               key={user.id}
//                               className="flex items-center mb-2"
//                             >
//                               <Field
//                                 type="checkbox"
//                                 name="userId"
//                                 checked={selectedUsers.includes(user.id)}
//                                 onChange={() => handleUserSelect(user)}
//                                 className="w-4 h-4 mr-2 text-[#D4AF37] border-white/20 rounded focus:ring-[#F5C518]"
//                               />
//                               <label className="text-gray-300">
//                                 {user.username}{" "}
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Show selected users */}
//                   {selectedUsers.length > 0 && (
//                     <div className="mb-4">
//                       <label className="block mb-1 text-base font-semibold text-gray-700">
//                         Selected Users:
//                       </label>
//                       <div className="p-2 border border-white/20 rounded-md bg-gray-50">
//                         {selectedUsers.map((userId) => {
//                           // const user = allusers.find((u) => u.id === userId);
//                           const user = users.find((u) => u.id === userId);  // ✅
//                           return user ? (
//                             <span
//                               key={userId}
//                               className="px-2 py-1 mr-2 text-blue-800 bg-blue-100 rounded"
//                             >
//                               {user.username}
//                             </span>
//                           ) : null;
//                         })}
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className={` py-2 px-6 rounded-md text-white font-medium ${
//                         loading
//                           ? "bg-blue-300 opacity-70 cursor-not-allowed"
//                           : "bg-[#F5C518] hover:bg-[#D4AF37] transition duration-200"
//                       }`}
//                     >
//                       {loading ? <Spinner /> : "Create"}
//                     </button>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NotificationForm;



























import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createNotification,
  resetState,
  addBanner,
} from "../../redux/notificationSlice";
import Spinner from "../../components/common/Spinner";
import { getAllUsers } from "../../redux/userSlice";
import SuccessAlert from "../../components/common/SuccessAlert";
import ErrorAlert from "../../components/common/ErrorAlert";
import { 
  Bell, 
  Upload, 
  Users as UsersIcon, 
  Search, 
  X, 
  CheckCircle,
  AlertCircle,
  Send,
  Image
} from "lucide-react";

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Message is required"),
  users: Yup.boolean(),
  type: Yup.string()
    .oneOf(["notification", "site_popup"], "Invalid type")
    .required("Type is required"),
});

const NotificationForm = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const { loading, error, message } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (message) {
      setOpen(true);
      const timer = setTimeout(() => setOpen(false), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      setOpenError(true);
      const timer = setTimeout(() => setOpenError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleUserSearch = (searchTerm) => {
    if (searchTerm) {
      const filteredUsers = users?.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.includes(user.id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user.id]);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      console.log("Select a file");
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
    const formData = new FormData();
    formData.append("image", selectedFile);

    dispatch(addBanner(formData))
      .then((response) => {
        console.log("Banner added successfully", response);
      })
      .catch((error) => {
        console.error("Error adding banner:", error);
      });
  };

  const clearSelectedUsers = () => {
    setSelectedUsers([]);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#0a0a0a] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* Alerts */}
        {message && <SuccessAlert message={message} />}
        {error && <ErrorAlert error={error?.message || error} />}

        {/* Main Form Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5C518] shadow-lg shadow-[#F5C518]/30">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                  Create Notification
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Send notifications to users
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5">
            <Formik
              initialValues={{
                title: "",
                message: "",
                users: true,
                type: "notification",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                const notificationData = {
                  ...values,
                  recipients: selectedUsers,
                };
                dispatch(createNotification(notificationData));
                resetForm();
                clearSelectedUsers();
              }}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form className="space-y-5">
                  {/* Title and Banner Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Title Field */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Title <span className="text-rose-400">*</span>
                      </label>
                      <Field
                        name="title"
                        as="input"
                        placeholder="Enter notification title"
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="mt-1 text-sm text-rose-400"
                      />
                    </div>

                    {/* Banner Upload Field */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Upload Banner
                      </label>
                      <div className="relative">
                        <input
                          id="file"
                          type="file"
                          name="image"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <label
                          htmlFor="file"
                          className="flex items-center gap-2 w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-slate-300 cursor-pointer hover:bg-white/20 transition-all duration-300"
                        >
                          <Image className="w-5 h-5 text-[#F5C518]" />
                          <span>{fileName || "Choose banner image"}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message <span className="text-rose-400">*</span>
                    </label>
                    <Field
                      name="message"
                      as="textarea"
                      placeholder="Enter notification message..."
                      rows="4"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50 transition-all resize-none"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="mt-1 text-sm text-rose-400"
                    />
                  </div>

                  {/* All Users Checkbox */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Field
                      type="checkbox"
                      name="users"
                      checked={values.users}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFieldValue("users", isChecked);
                        if (isChecked) {
                          setSelectedUsers([]);
                          setSearchResults([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#D4AF37] focus:ring-[#F5C518] focus:ring-offset-0"
                    />
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-[#F5C518]" />
                      Send to All Users
                    </label>
                  </div>

                  {/* User Search Section */}
                  {!values.users && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Search Users
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by email..."
                          onChange={(e) => handleUserSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50"
                        />
                      </div>

                      {/* Search Results */}
                      {searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto rounded-xl bg-white/10 border border-white/10 p-2 custom-scroll">
                          {searchResults.map((user) => (
                            <label
                              key={user.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all"
                            >
                              <Field
                                type="checkbox"
                                name="userId"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleUserSelect(user)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#D4AF37] focus:ring-[#F5C518]"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white">
                                  {user.username}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {user.email}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Selected Users Tags */}
                      {selectedUsers.length > 0 && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Selected Users ({selectedUsers.length})
                          </label>
                          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                            {selectedUsers.map((userId) => {
                              const user = users?.find((u) => u.id === userId);
                              return user ? (
                                <span
                                  key={userId}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#F5C518]/20 text-[#F5C518] border border-[#F5C518]/30"
                                >
                                  {user.username}
                                  <button
                                    type="button"
                                    onClick={() => handleUserSelect(user)}
                                    className="hover:text-white transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F5C518] hover:from-[#F5C518] hover:to-indigo-500 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F5C518]/25"
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          Send Notification
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 to-[#F5C518]/10 backdrop-blur-md border border-[#F5C518]/20 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Notification Info</p>
              <p className="text-xs text-slate-400">
                Notifications will be sent instantly to selected users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;