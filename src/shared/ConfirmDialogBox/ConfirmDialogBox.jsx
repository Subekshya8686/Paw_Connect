import React from "react";

const ConfirmDialogBox = ({
  open,
  handleClose,
  handleConfirm,
  label,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center font-lora z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-80 p-6">
        <p className="text-lg font-medium text-center mb-4">{label}</p>
        <div className="flex justify-center gap-4">
          <button
            className={`btn bg-[#66AEA6] text-white w-24 ${
              isLoading ? "loading" : ""
            }`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "" : "Yes"}
          </button>
          <button
            className="btn btn-outline btn-error w-24"
            onClick={handleClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialogBox;
