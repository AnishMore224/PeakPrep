import { useStudent } from "../../contexts/student.context";
import CryptoJS from "crypto-js";

interface CandidateListProps {
  filter: string;
  majorFilter: string;
}

export function CandidateList({ filter, majorFilter }: CandidateListProps) {
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  const IV = CryptoJS.enc.Utf8.parse(import.meta.env.SECRET_IV); // 16-byte IV (fixed) // Ensure your secret key is securely stored
  const { students } = useStudent();
  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(filter.toLowerCase()) ||
        student.status.toLowerCase().includes(filter.toLowerCase())) &&
      student.branch.toLowerCase().includes(majorFilter.toLowerCase())
  );

  function encryptData(data: string, secretKey: string): string {
    const key = CryptoJS.enc.Utf8.parse(secretKey.trim()); // Trim to avoid accidental spaces
    const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // Fixed 16-byte IV (same everywhere)
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  
    return encrypted.toString(); // No need to replace characters
  }
  
  
  function encodeURIComponentSafe(encryptedData: string): string {
    return encodeURIComponent(encryptedData);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-blue-600">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Branch</th>
            <th className="py-3 px-4">Batch</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredStudents.map((student, index) => {
            // Encrypt the studentId

            return (
              <tr key={index}>
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">{student.branch.toUpperCase()}</td>
                <td className="py-3 px-4">{student.admissionYear + 4}</td>
                <td className="py-2 px-4">
                  <span
                    className={`w-24 inline-block px-3 py-1 text-center rounded-full text-sm font-semibold shadow-sm
                      ${
                        student.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          : student.status === "Selected" ||
                            student.status === "Placed"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : student.status === "Completed"
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {(() => {
                    const encryptedStudentId = encryptData(
                      student.id,
                      secretKey,
                    );
                    const urlSafeEncryptedId =
                      encodeURIComponentSafe(encryptedStudentId);
                    return (
                      <button
                        onClick={() =>
                          (window.location.href = `/feedbackform?studentId=${urlSafeEncryptedId}`)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Feedback
                      </button>
                    );
                  })()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
