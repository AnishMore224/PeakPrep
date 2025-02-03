import { ResumeData } from "./data";
const resumeData: ResumeData = {
    name: "John Doe",
    contact: {
      email: "johndoe@example.com",
      phone: "+1234567890",
      linkedin: "linkedin.com/in/johndoe"
    },
    summary: "Highly motivated software engineer with 5 years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.",
    education: [
      {
        degree: "B.Sc. in Computer Science",
        institution: "XYZ University",
        year: "2015 - 2019"
      },
      {
        degree: "M.Sc. in Software Engineering",
        institution: "ABC University",
        year: "2019 - 2021"
      }
    ],
    experience: [
      {
        title: "Full-Stack Developer",
        company: "TechCorp",
        years: "2021 - Present",
        description: "Developed scalable web applications using React and Node.js, integrated with cloud services (AWS, GCP)."
      },
      {
        title: "Software Engineer Intern",
        company: "DevSoft",
        years: "2020 - 2021",
        description: "Assisted in building internal tools and contributed to the development of microservices architecture."
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "AWS", "Docker", "TypeScript", "SQL", "Agile"]
  };
export default resumeData;