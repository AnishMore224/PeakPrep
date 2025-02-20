import React, { useState } from "react";
import { Mail, ArrowRight, Lock, KeyRound, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/auth.context";
import { postRequest } from "../utils/services";
import Modal from "../components/PopUp";

function Password() {
  const { user, setIsEmailVerified } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => setShowModal(false);
  const handleBack = () => {
    window.location.href = "/";
  };
  const MAIL_API= import.meta.env.VITE_MAIL_API;
  const sendVerificationCode = async () => {
    setIsSending(true);
    try {
      const response = await postRequest(
        `${MAIL_API}/PasswordResetMail`,
        JSON.stringify({ email })
      );
      if (response.message === "Password reset email sent") {
        setVerificationStatus("success");
        setModalMessage("Password reset email sent successfully!");
      } else {
        setVerificationStatus("error");
        setModalMessage(
          "Failed to send password reset email. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setVerificationStatus("error");
      setModalMessage("An error occurred while sending the verification code.");
    }
    setShowModal(true);
    setIsSending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setVerificationStatus("error");
      setModalMessage("Passwords do not match!");
      setShowModal(true);
      return;
    }

    // Validate password strength
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await postRequest(
        `${MAIL_API}/verifyAndUpdatePassword`,
        JSON.stringify({
          email,
          verificationCode,
          newPassword,
        }),
        token
      );

      if (response.message === "Password updated successfully") {
        setVerificationStatus("success");
        setModalMessage("Password updated successfully!");
        setIsEmailVerified(true);
      } else {
        setVerificationStatus("error");
        setModalMessage(
          "Failed to verify code and update password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setVerificationStatus("error");
      setModalMessage("An error occurred while updating your password.");
    }

    setShowModal(true);
    setIsSubmitting(false);
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg px-8 py-6 space-y-6 relative">
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-5">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter verification code and set your new password
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                placeholder="your@email.com"
                disabled={true}
              />
              <Mail className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            </div>
            <button
              onClick={sendVerificationCode}
              disabled={isSending || !email}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium mt-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSending ? "Sending..." : "Send Verification Code"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500"
                placeholder="123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
                <Lock className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
                <Lock className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                !verificationCode ||
                !newPassword ||
                !confirmPassword ||
                isSubmitting
              }
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Processing..." : "Update Password"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {showModal && verificationStatus !== "idle" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-30 backdrop-blur-md z-50">
          <Modal
            message={modalMessage}
            status={verificationStatus}
            onClose={closeModal}
          />
        </div>
      )}
    </div>
  );
}

export default Password;
