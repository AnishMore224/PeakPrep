import React from "react";
import { ProfileField } from "../types";
import "../../public/profile.png";

export const ProfileView = () => {
  const profileFields: ProfileField[] = [
    { label: "Name", value: "JohnDoe123" },
    { label: "Email", value: "john.doe@university.edu" },
    { label: "Registration Number", value: "1234567890" },
    { label: "Branch", value: "CSE" },
    { label: "Year", value: "2023" },
    { label: "Section", value: "A" },
  ];

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
          <h2 className="text-lg font-semibold">{profileFields[0].value}</h2>
          <button className="text-sm text-gray-600 hover:text-gray-800">
            Change profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        {profileFields.map((field) => (
          <div
            key={field.label}
            className={field.fullWidth ? "col-span-full" : ""}
          >
            <label className="block text-md text-gray-600 mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              value={field.value}
              className="w-full px-4 py-2 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#00B6F0]"
              readOnly
            />
          </div>
        ))}
      </div>
    </div>
  );
};
