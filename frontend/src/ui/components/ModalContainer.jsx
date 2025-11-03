import { useDispatch, useSelector } from "react-redux";
import { clearModal } from "../../store/slices/modalSlice";
import { MODALS } from "../../constants";

const ModalContainer = () => {
  const currentModal = useSelector((state) => state.modal.modal);
  const dispatch = useDispatch();

  if (!currentModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop with glass morphism */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          if (currentModal.onClose) {
            dispatch(clearModal());
          }
        }}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {MODALS[currentModal.name]}
      </div>
    </div>
  );
};

export default ModalContainer;
