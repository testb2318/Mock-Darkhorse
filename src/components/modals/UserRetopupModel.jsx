import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../../components/common/Spinner";
import { getUserbyemail } from "../../redux/userSlice";
import { addTopup, clearErrors, clearMessage } from "../../redux/topupSlice";


export default function UserRetopupModel({ openModel, modelClose }) {
  const dispatch = useDispatch();
  const { allplans } = useSelector((state) => state.allplans);
  const { emailuser, singleuser } = useSelector((state) => state.allusers);
  const { auth } = useSelector((state) => state.auth);
  const { loading, error, message } = useSelector((state) => state.alltopup);
  const [investment_amount, setInvestment_amount] = useState(null);
  const [amount, setAmount] = useState();
  const [plan, setPlan] = useState();
  const [userby, setUserby] = useState();

  useEffect(() => {
    if (userby && userby !== auth?.email) {
      dispatch(getUserbyemail(userby));
    }
  }, [userby]);

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

  useEffect(() => {
    if (emailuser && emailuser?.entry_fees === 0) {
    }
  }, [emailuser]);

  const handleSaveChanges = (e) => {
    if (amount < plan?.min || (plan?.max !== null && amount > plan?.max)) {
      alert(
        `Amount must be between ${plan?.min} and ${
          plan?.max ? plan?.max : "infinity"
        }.`
      );
      return;
    }
    e.preventDefault();
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      const allValues = {
        userby_id: auth?.id,
        userto_id: emailuser?.id,
        id: plan?.id,
        amount: plan?.id === 4 ? plan?.monthly_price : investment_amount,
      };
      dispatch(addTopup({ values: allValues }));
      modelClose();
    } else {
      form.reportValidity();
    }
  };

  return (
    <Dialog open={openModel} onClose={modelClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-md bg-white border border-gray-200 text-left shadow-md transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Other Top-Up
              </h2>
              <button
                onClick={modelClose}
                className="rounded-full p-2 hover:bg-blue-700 bg-blue-600 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Form content */}
            <div className="p-6">
              <form>
                <div className="space-y-6">
                  {/* User email field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-800"
                    >
                      User Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-500"
                        >
                          <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path>
                          <polyline points="15,9 18,9 18,11"></polyline>
                          <path d="M6 8v8"></path>
                          <path d="M2 11V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        className="block w-full pl-10 pr-4 py-3 text-gray-800 rounded-xl bg-gray-200 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200 placeholder-gray-500 shadow-sm transition-all duration-200"
                        placeholder="Enter user email & username "
                        onChange={(e) => setUserby(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Plan selection */}
                  {emailuser && (
                    <div className="space-y-2">
                      <label
                        htmlFor="plan"
                        className="block text-sm font-medium text-gray-800"
                      >
                        Select Plan
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a1.94 1.94 0 0 0-.2 3.33l12.35 6.61c.52.28 1.13.25 1.62 0l3.8-1.91c.8-.39 1.21-1.22.99-2.02a1.93 1.93 0 0 0-.75-1.3z"></path>
                            <path d="M3.09 8.84v12.58c0 .47.28.9.7 1.1l3.78 1.9c.5.23 1.1.23 1.6 0l12.09-6.05c.5-.23.83-.74.83-1.3V4.49"></path>
                          </svg>
                        </div>
                        <select
                          id="plan"
                          name="id"
                          className="block w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 bg-gray-200 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm appearance-none transition-all duration-200"
                          onChange={(e) => {
                            const selectedPlanId = e.target.value;
                            const selectedPlan = allplans.find(
                              (plan) => plan.id.toString() === selectedPlanId
                            );
                            setPlan(selectedPlan);
                          }}
                          required
                        >
                          <option value="">Select a plan</option>
                          {allplans
                            ?.filter((item) => {
                              if (emailuser && emailuser?.entry_fees === 0) {
                                return item.name === "agreement";
                              } else {
                                return item.name !== "agreement";
                              }
                            })
                            .map((plan) => (
                              <option key={plan.id} value={plan.id}>
                                {plan.name} - ${plan.monthly_price} Activation
                                Plan
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investment amount */}
                  {emailuser && emailuser?.is_active === "active" && (
                    <div className="space-y-2">
                      <label
                        htmlFor="investment_amount"
                        className="block text-sm font-medium text-gray-800"
                      >
                        Investment Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <path d="M12 2v20"></path>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                        <input
                          type="number"
                          id="investment_amount"
                          name="investment_amount"
                          className="block w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 bg-gray-200 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500 shadow-sm transition-all duration-200"
                          placeholder="Multiple of 100, minimum 200"
                          onChange={(e) => setInvestment_amount(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Enter an amount that is a multiple of 100, with a
                        minimum value of 200.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={!emailuser}
                    onClick={handleSaveChanges}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                      emailuser
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25"
                        : "bg-gray-700 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M12 2v4"></path>
                          <path d="m4.93 10.93 2.83-2.83"></path>
                          <path d="M2 18h4"></path>
                          <path d="M19.07 10.93l-2.83-2.83"></path>
                          <path d="M22 18h-4"></path>
                          <path d="M12 22v-4"></path>
                          <path d="m16 16 2-2"></path>
                          <path d="m6 16 2-2"></path>
                          <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                        </svg>
                        Complete Top-Up
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            {emailuser && (
              <div className="bg-gray-200 px-6 py-4 border-t border-gray-200 text-xs text-gray-800">
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Your transaction is secured with end-to-end encryption
                </p>
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
