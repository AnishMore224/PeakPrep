import React, { useState } from "react";
import { ResumeData, dummyData, initialResumeData } from "./data";

const ResumeForm: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  // Handle input changes 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    index?: number,
    subIndex?: number
  ) => {
    const { name, value } = e.target;
  
    if (field === "contact") {
      setResumeData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [name]: value },
      }));
    } else if (index !== undefined && subIndex !== undefined) {
      // Handle nested fields like authors in publications
      setResumeData((prev) => {
        const updatedArray = [...(prev as any)[field]];
        const updatedSubArray = [...updatedArray[index].authors];
        updatedSubArray[subIndex] = value;
        updatedArray[index] = { ...updatedArray[index], authors: updatedSubArray };
        return { ...prev, [field]: updatedArray };
      });
    } else if (index !== undefined) {
      // Handle nested fields like education or experience
      setResumeData((prev) => {
        const updatedArray = [...(prev as any)[field]];
        updatedArray[index] = { ...updatedArray[index], [name]: value };
        return { ...prev, [field]: updatedArray };
      });
    } else {
      // Handle simple fields like name, email, etc.
      setResumeData((prev) => ({ ...prev, [field]: value }));
    }
  };
  
  // Add new education entry
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  // Add new experience entry
  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: "", company: "", years: "", description: "" }],
    }));
  };

  // Add new skill entry
  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  // Add new publication entry
  const addPublication = () => {
    setResumeData((prev) => ({
      ...prev,
      publications: [...(prev.publications || []), { title: "", authors: [""], link: "" }],
    }));
  };

  // Add new author to a publication
  const addAuthor = (index: number) => {
    setResumeData((prev) => {
      const updatedPublications = [...(prev.publications || [])];
      const updatedAuthors = [...updatedPublications[index].authors, ""];
      updatedPublications[index] = { ...updatedPublications[index], authors: updatedAuthors };
      return { ...prev, publications: updatedPublications };
    });
  };

  // Add new project entry
  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects || [], { name: "", description: "", link: "" }],
    }));
  };

  const generatePDF = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch('http://localhost:3030/api/genResume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ resumeData })
    });
  
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf'; 
    link.click();
  };
  const [latexOutput, setLatexOutput] = useState<React.ReactNode>(null);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Resume Generator</h1>

      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={resumeData.name}
        onChange={(e) => handleChange(e, "name")}
        className="border p-2 mb-2 w-full"
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={resumeData.contact.email}
        onChange={(e) => handleChange(e, "contact")}
        className="border p-2 mb-2 w-full"
      />

      {/* Phone */}
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={resumeData.contact.phone}
        onChange={(e) => handleChange(e, "contact")}
        className="border p-2 mb-2 w-full"
      />

      {/* LinkedIn */}
      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn URL"
        value={resumeData.contact.linkedin}
        onChange={(e) => handleChange(e, "contact")}
        className="border p-2 mb-2 w-full"
      />

      {/* Summary */}
      <textarea
        name="summary"
        placeholder="Summary"
        value={resumeData.summary}
        onChange={(e) => handleChange(e, "summary")}
        className="border p-2 mb-2 w-full"
      />

      {/* Education */}
      <h2 className="font-bold">Education</h2>
      {resumeData.education.map((edu, index) => (
        <div key={index} className="border p-2 mb-2">
          <input
            type="text"
            name="degree"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => handleChange(e, "education", index)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="institution"
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => handleChange(e, "education", index)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={edu.year}
            onChange={(e) => handleChange(e, "education", index)}
            className="border p-2 mb-2 w-full"
          />
        </div>
      ))}
      <button onClick={addEducation} className="bg-green-500 text-white p-2 rounded mb-4">
        Add Education
      </button>

      {/* Experience */}
      <h2 className="font-bold">Experience</h2>
      {resumeData.experience.map((exp, index) => (
        <div key={index} className="border p-2 mb-2">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={exp.title}
            onChange={(e) => handleChange(e, "experience", index)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleChange(e, "experience", index)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="years"
            placeholder="Years"
            value={exp.years}
            onChange={(e) => handleChange(e, "experience", index)}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={exp.description}
            onChange={(e) => handleChange(e, "experience", index)}
            className="border p-2 mb-2 w-full"
          />
        </div>
      ))}
      <button onClick={addExperience} className="bg-green-500 text-white p-2 rounded mb-4">
        Add Experience
      </button>

      {/* Skills */}
      <h2 className="font-bold">Skills</h2>
      {resumeData.skills.map((skill, index) => (
        <div key={index} className="border p-2 mb-2">
          <input
            type="text"
            name="skill"
            placeholder="Skill"
            value={skill}
            onChange={(e) =>{ 
              const updatedSkills = [...resumeData.skills];
              updatedSkills[index] = e.target.value;
              setResumeData((prev) => ({ ...prev, skills: updatedSkills }));
            }}
            className="border p-2 mb-2 w-full"
          />
        </div>
      ))}
      <button onClick={addSkill} className="bg-green-500 text-white p-2 rounded mb-4">
        Add Skill
      </button>

      {/* Publications */}
      <h2 className="font-bold">Publications</h2>
      {(resumeData.publications || []).map((pub, index) => (
        <div key={index} className="border p-2 mb-2">
          <input
            type="text"
            name="title"
            placeholder="Publication Title"
            value={pub.title}
            onChange={(e) => handleChange(e, "publications", index)}
            className="border p-2 mb-2 w-full"
          />
          {pub.authors.map((author, subIndex) => (
            <input
              key={subIndex}
              type="text"
              name="author"
              placeholder="Author"
              value={author}
              onChange={(e) => handleChange(e, "publications", index, subIndex)}
              className="border p-2 mb-2 w-full"
            />
          ))}
          <button onClick={() => addAuthor(index)} className="bg-blue-500 text-white p-2 rounded mb-2">
            Add Author
          </button>
          <input
            type="text"
            name="link"
            placeholder="Link"
            value={pub.link}
            onChange={(e) => handleChange(e, "publications", index)}
            className="border p-2 mb-2 w-full"
          />
        </div>
      ))}
      <button onClick={addPublication} className="bg-green-500 text-white p-2 rounded mb-4">
        Add Publication
      </button>

      {/* Projects */}
      <h2 className="font-bold">Projects</h2>
      {(resumeData.projects || []).map((project, index) => (
        <div key={index} className="border p-2 mb-2">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={project.name}
            onChange={(e) => handleChange(e, "projects", index)}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={project.description}
            onChange={(e) => handleChange(e, "projects", index)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="link"
            placeholder="Project Link"
            value={project.link}
            onChange={(e) => handleChange(e, "projects", index)}
            className="border p-2 mb-2 w-full"
          />
        </div>
      ))}
      <button onClick={addProject} className="bg-green-500 text-white p-2 rounded mb-4">
        Add Project
      </button>

      {/* Generate PDF */}
      <button
        onClick={() => generatePDF()}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Generate PDF
      </button>
      <pre className="border p-4 mt-4">{latexOutput}</pre>
    </div>
  );
};

export default ResumeForm;
