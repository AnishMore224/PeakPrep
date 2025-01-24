import React, { useState } from "react";
import { LoginForm, SignUpForm } from "../types/index";
import "../../public/signup.png";

export const SignUp = () => {
  const [formData, setFormData] = useState<SignUpForm>({
    userType: "student",
    name: "",
    username: "",
    email: "",
    password: "",
    branch: "",
    section: "",
    company: "",
    collegeId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, userType: e.target.value as "student" | "hr" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="signup min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className=" w-full max-w-[1200px] grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              PeakPrep
            </h1>
          </div>

          <div className="signupi h-110 overflow-y-auto mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-3">
              <div>
                <label
                  htmlFor="userType"
                  className="block text-base font-medium text-gray-700 mb-1"
                >
                  I am a
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleUserTypeChange}
                  className="input-field text-base"
                >
                  <option value="student">Student</option>
                  <option value="hr">HR</option>
                </select>
              </div>

              {formData.userType === "student" && (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-base font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="regdno"
                      className="block text-base font-medium text-gray-700 mb-1"
                    >
                      Registration Number
                    </label>
                    <input
                      id="regdno"
                      name="regdno"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      placeholder="Enter your registration number"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="branch"
                      className="block text-base font-medium text-gray-700 mb-1"
                    >
                      Branch
                    </label>
                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      placeholder="Enter your branch"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="section"
                      className="block text-base font-medium text-gray-700 mb-1"
                    >
                      Section
                    </label>
                    <input
                      id="section"
                      name="section"
                      type="text"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      placeholder="Enter your section"
                      required
                    />
                  </div>
                </>
              )}

              {formData.userType === "hr" && (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-base font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-base font-medium text-gray-700 mb-1"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      placeholder="Enter your company"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="collegeId"
                      className="block text-base font-medium text-gray-700 mb-1"
                    >
                      College ID
                    </label>
                    <input
                      id="collegeId"
                      name="collegeId"
                      type="text"
                      value={formData.collegeId}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      placeholder="Enter your college ID"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="btn-primary text-base py-2 px-4">
                Sign up
              </button>
            </form>
          </div>
          <div className="mt-5 text-center">
            <p className="text-lg text-gray-700">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-medium">
                Log in
              </a>
            </p>
            </div>

        </div>
        <div className="image bg-gray-200 p-6 flex items-center justify-center">
          <img
            src="/signup.png"
            alt="Graduate illustration"
            className="w-full max-w-[450px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
