import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type ModalProps = {
  message: string;
  status: "success" | "error";
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ message, status, onClose }) => {
  return (
    // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-2 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="text-center">
          <div
            className={`mb-4 ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="w-12 h-12 mx-auto" />
            ) : (
              <XCircle className="w-12 h-12 mx-auto" />
            )}
          </div>
          <p className="text-lg font-semibold">{message}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    // </div>
  );
};

export default Modal;
