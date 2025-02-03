import React, { useState } from "react";
import { useUIContext } from "../../contexts/ui.context";
import ResumePreview from "./Resume";
import { exportToPdf } from "./exportPDF";

interface ResumeData {
  name: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
  };
  summary: string;
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    title: string;
    company: string;
    years: string;
    description: string;
  }[];
  skills: string[];
  [key: string]: any;
}

const initialResumeData: ResumeData = {
  name: "",
  contact: {
    email: "",
    phone: "",
    linkedin: "",
  },
  summary: "",
  education: [],
  experience: [],
  skills: [],
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  exportToPdf("resume-preview");
};

const ResumeForm: React.FC = () => {
  const [resume, setResume] = useState<ResumeData>(initialResumeData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResume((prevResume) => ({
      ...prevResume,
      [name]: value,
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResume((prevResume) => ({
      ...prevResume,
      contact: {
        ...prevResume.contact,
        [name]: value,
      },
    }));
  };

  const { isSidebarVisible } = useUIContext();

  return (
    <div
      className={`flex-1 p-6 md:p-8 bg-gray-50 transition-all duration-300 ${
        isSidebarVisible ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
      }`}
    >
      <form className="resume-form">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={resume.name}
            onChange={handleChange}
          />
        </div>
        <div className="contact">
          <h2>Contact</h2>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={resume.contact.email}
            onChange={handleContactChange}
          />
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={resume.contact.phone}
            onChange={handleContactChange}
          />
          <label>LinkedIn:</label>
          <input
            type="url"
            name="linkedin"
            value={resume.contact.linkedin}
            onChange={handleContactChange}
          />
        </div>
        <div className="summary">
          <h2>Summary</h2>
          <textarea
            name="summary"
            value={resume.summary}
            onChange={handleChange}
          />
        </div>
        {/* Add similar input fields for education, experience, and skills */}
        <button type="submit" onClick={handleSubmit}>
          Save
        </button>
      </form>
      <ResumePreview data={resume} />
    </div>
  );
};

export default ResumeForm;
