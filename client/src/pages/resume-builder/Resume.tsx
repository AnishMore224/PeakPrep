import React from "react";
import { ResumeData } from "./data";

const ResumePreview: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div id="resume-preview">
      <h1>{data.name}</h1>
      <p>Email: {data.contact.email} | Phone: {data.contact.phone}</p>
      <p>LinkedIn: <a href={data.contact.linkedin}>{data.contact.linkedin}</a></p>

      <h2>Summary</h2>
      <p>{data.summary}</p>

      <h2>Education</h2>
      {data.education.map((edu: any, index: number) => (
        <div key={index}>
          <h3>{edu.degree}</h3>
          <p>{edu.institution}, {edu.year}</p>
        </div>
      ))}

      <h2>Experience</h2>
      {data.experience.map((exp: any, index: number) => (
        <div key={index}>
          <h3>{exp.title} at {exp.company}</h3>
          <p>{exp.years}</p>
          <p>{exp.description}</p>
        </div>
      ))}

      <h2>Skills</h2>
      <ul>
        {data.skills.map((skill: string, index: number) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResumePreview;
