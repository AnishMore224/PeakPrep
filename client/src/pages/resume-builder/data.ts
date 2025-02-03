const initialResumeData = {
  name: "",
  contact: {
    email: "",
    phone: "",
    linkedin: "",
  },
  summary: "",
  education: [{ degree: "", institution: "", year: "" }],
  experience: [{ title: "", company: "", years: "", description: "" }],
  skills: [""],
};

export interface ResumeData {
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
  [key: string]: any; // Add this line
}

export default initialResumeData;
