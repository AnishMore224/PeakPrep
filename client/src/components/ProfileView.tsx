import { Admin, Hr, Student } from "../contexts/auth.context.tsx";
import { useNavigate } from "react-router-dom";

interface ProfileViewProps {
  user: Student | Hr | Admin | null;
}

export const ProfileView = ({ user }: ProfileViewProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-200 rounded-3xl p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user?.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        {user?.role === "student" ? (
          <>
            <ProfileField label="Name" value={(user as Student).name} />
            <ProfileField
              label="Registration Number"
              value={(user as Student).username}
            />
            <ProfileField label="Username" value={(user as Student).username} />
            <ProfileField label="Email" value={(user as Student).email} />
            <ProfileField label="Branch" value={(user as Student).branch} />
            <ProfileField label="Section" value={(user as Student).section} />
            <button
              className="w-full mt-4 py-2 px-4 text-white font-semibold rounded-lg 
                 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md 
                 hover:from-blue-600 hover:to-indigo-700 
                 focus:ring-2 focus:ring-blue-300 
                 transition-all duration-300"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </>
        ) : user?.role === "hr" ? (
          <>
            <ProfileField label="Name" value={(user as Hr).name} />
            <ProfileField label="Username" value={(user as Hr).username} />
            <ProfileField label="Email" value={(user as Hr).email} />
            <ProfileField
              label="Company Name"
              value={(user as Hr).companyName}
            />
            <button
              className="w-full mt-4 py-2 px-4 text-white font-semibold rounded-lg 
                   bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md 
                   hover:from-blue-600 hover:to-indigo-700 
                   focus:ring-2 focus:ring-blue-300 
                   transition-all duration-300"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </>
        ) : (
          <>
            <ProfileField label="Name" value={(user as Admin).name} />
            <ProfileField label="Username" value={(user as Admin).username} />
            <ProfileField label="Email" value={(user as Admin).email} />
            <button
              className="w-full mt-4 py-2 px-4 text-white font-semibold rounded-lg 
                 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md 
                 hover:from-blue-600 hover:to-indigo-700 
                 focus:ring-2 focus:ring-blue-300 
                 transition-all duration-300"
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-3">
    <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
      <div key={label}>
        <label className="block text-lg text-gray-600 mb-1">{label}</label>
        <input
          type={"text"}
          value={value}
          className="w-full px-4 py-3 rounded-lg bg-white border-0   text-gray-900 text-md outline-none"
          readOnly
        />
      </div>
    </div>
  </div>
);
