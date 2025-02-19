import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { StudentProfile } from "../../components/student/StudentProfile";
import { FeedbackForm } from "../../components/hr/FeedbackForm";
import { useUIContext } from "../../contexts/ui.context";
import { getRequest } from "../../utils/services";
import CryptoJS from "crypto-js";

export const StudentFeedback: React.FC = () => {
  const { isSidebarVisible } = useUIContext();
  const secretKey = import.meta.env.VITE_SECRET_KEY;

  const IV = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_IV as string); 

  const decryptStudentId = (encryptedId: string, secretKey: string): string => {
    const base64EncryptedId = encryptedId
      .replace(/-/g, "+") // Convert '-' back to '+'
      .replace(/_/g, "/"); // Convert '_' back to '/'
  
    const decryptedBytes = CryptoJS.AES.decrypt(base64EncryptedId, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: IV, 
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedId = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedId;
  };

  const queryParams = new URLSearchParams(window.location.search);
  const encryptedIdParam = queryParams.get("studentId");
 

  const [student, setStudent] = useState<any>(null);
  const [studentId, setStudentId] = useState<string>("");
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_DETAILS_API_URL as string;

  useEffect(() => {
    if (encryptedIdParam) {
      const decryptedStudentId = decryptStudentId(encryptedIdParam, secretKey);
      setStudentId(decryptedStudentId);
    } else {
      console.error("No encrypted student ID found in query parameters.");
    }
  }, [encryptedIdParam, token, secretKey]);

  useEffect(() => {
    if (studentId && token) {
      const fetchStudent = async () => {
        try {
          const response = await getRequest(
            `${BASE_URL}/student?studentId=${encryptedIdParam}`, // Use decrypted studentId here
            token
          );
          const { data } = response;
          setStudent(data);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };

      fetchStudent();
    }
  }, [studentId, token, encryptedIdParam]);
  return (
    <div
      className={`flex-1 p-6 md:p-8 bg-gray-50 transition-all duration-300 ${
        isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
      }`}
    >
      <a
        href="/candidates"
        className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </a>

      <div className="flex flex-col md:flex-row min-h-screen">
        <StudentProfile student={student} />
        <FeedbackForm student={student} />
      </div>
    </div>
  );
};
