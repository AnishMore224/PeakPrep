import React, { useState } from "react";
import {  Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/auth.context";
import { postRequest } from "../utils/services";
import Modal from "../components/PopUp";

function Verification() {
  const { user, setIsEmailVerified } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showModal, setShowModal] = useState(false);

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };
  const MAIL_API = import.meta.env.VITE_MAIL_API;
  const sendVerificationCode = async () => {
    setIsSending(true);
    try {
      const response = await postRequest(
        `${MAIL_API}/VerificationMail`,
        JSON.stringify({ email })
      );
      if (response.message === "Verification email sent") {
        setVerificationStatus("success");
        setShowModal(true);
      } else {
        setVerificationStatus("error");
        setShowModal(true);
      }
    } catch (error) {
        console.error("Error sending verification code:", error);
      setVerificationStatus("error");
      setShowModal(true);
    }
    setIsSending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
        const token = localStorage.getItem('token');
      const response = await postRequest(`${MAIL_API}/verifyCode`, JSON.stringify({ email, verificationCode }),token);
      if (response.message === "Verification successful") {
        setVerificationStatus("success");
        setIsEmailVerified(true);
      } else {
        setVerificationStatus("error");
      }
    } catch {
      setVerificationStatus("error");
    }
    setIsVerifying(false);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify your email
          </h1>
          <p className="text-gray-600">
            Please enter your email to receive a verification code
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
              placeholder="your@email.com"
              disabled={true}
            />
            <button
              onClick={sendVerificationCode}
              disabled={isSending || !email}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium mt-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send Code"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
                placeholder="123456"
              />
            </div>

            <button
              type="submit"
              disabled={verificationCode.length !== 6 || isVerifying}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Modal for showing success or error message */}
      {showModal && verificationStatus !== "idle" && (
       <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-30 backdrop-blur-md z-50">
       <Modal
         message={
           verificationStatus === "success"
             ? "Verification code sent successfully!"
             : "Invalid verification code. Please try again."
         }
         status={verificationStatus}
         onClose={closeModal}
       />
     </div>
     
      )}
    </div>
  );
}

export default Verification;
