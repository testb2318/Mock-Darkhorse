import { useSelector, useDispatch } from "react-redux";
import { getBanner } from "../../redux/notificationSlice";
import { useEffect, useState } from "react";

export default function Popup() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null);
  const { banner } = useSelector((state) => state.notifications);
  useEffect(() => {
    dispatch(getBanner());
  }, [dispatch]);

  useEffect(() => {
    if (banner) {
      setPreviewImage(`/uploads/banner/${banner}`);
    }
  }, [banner]);

  const handleClosePreview = () => {
    setPreviewImage(null);
  };
  return (
    <>
      {previewImage && (
        <>
          {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-screen object-contain"
              />
              <button
                onClick={handleClosePreview}
                className="absolute top-2 right-2 text-white text-xl bg-black p-2 rounded-full"
              >
                ×
              </button>
            </div>
          </div> */}
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-screen object-contain rounded-lg shadow-lg"
              />
              <button
                onClick={handleClosePreview}
                className="absolute top-2 right-2 text-white text-xl bg-black/70 hover:bg-black/90 p-2 rounded-full transition"
              >
                ×
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
