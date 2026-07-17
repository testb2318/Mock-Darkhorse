import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Check } from "lucide-react";
import {
  entryPlanActivation,
  clearErrors,
  clearMessage,
} from "../../redux/topupSlice";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UserEntryFeeConfirmation({ isclose, user_id }) {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.alltopup);

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
  }, [dispatch, error, message, clearErrors, clearMessage]);

  const handleSaveChanges = () => {
    dispatch(entryPlanActivation({ id: user_id }));
    isclose();
  };
  return (
    <Dialog open={open} onClose={isclose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg bg-gray-900 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-600/20 p-2">
                  <Check className="h-6 w-6 text-blue-500" />
                </div>
                <DialogTitle as="h3" className="text-lg font-semibold">
                  Purchase Agreement
                </DialogTitle>
              </div>
              <button
                onClick={isclose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm text-gray-300">
                Are you sure you want to start this agreement?
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-700 px-6 py-4">
              <button
                type="button"
                onClick={isclose}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition"
              >
                Buy Now
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
