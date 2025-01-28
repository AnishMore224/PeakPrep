import React, { useState } from "react";

interface FeedbackCard {
  company: string;
  role: string;
  feedback: string;
  students: string[];
  date: string;
}

const feedbackData: FeedbackCard[] = [
  {
    company: "TechCorp",
    role: "UI/UX Designer",
    feedback:
      "The students demonstrated exceptional creativity and attention to detail in their design projects.",
    students: ["Alice Johnson", "Mark Lee"],
    date: "September 12, 2023",
  },
  {
    company: "Innovatech",
    role: "Data Scientist",
    feedback:
      "Impressive analytical skills and data interpretation capabilities were showcased by the students.",
    students: ["Sarah Brown", "Tom Harris"],
    date: "October 5, 2023",
  },
  {
    company: "WebSolutions",
    role: "Frontend Developer",
    feedback:
      "The students showed great proficiency in modern web technologies and frameworks.",
    students: ["John Doe", "Jane Smith"],
    date: "August 20, 2023",
  },
  {
    company: "DataMinds",
    role: "Data Analyst",
    feedback:
      "Excellent data analysis and visualization skills were demonstrated by the students.",
    students: ["Emily Davis", "Michael Brown"],
    date: "July 15, 2023",
  },
  {
    company: "CyberTech",
    role: "Cybersecurity Specialist",
    feedback:
      "The students displayed a strong understanding of cybersecurity principles and practices.",
    students: ["Chris Evans", "Natalie Portman"],
    date: "June 10, 2023",
  },
  {
    company: "AI Innovations",
    role: "Machine Learning Engineer",
    feedback:
      "The students showcased impressive machine learning models and data processing techniques.",
    students: ["Robert Downey", "Scarlett Johansson"],
    date: "May 25, 2023",
  },
  // Add more feedback data as needed
];

function Feedbacks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFeedback, setFilteredFeedback] = useState(feedbackData);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredFeedback(
      feedbackData.filter(
        (card) =>
          card.company.toLowerCase().includes(term) ||
          card.role.toLowerCase().includes(term) ||
          card.students.some((student) =>
            student.toLowerCase().includes(term)
          ) ||
          card.date.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 md:ml-64 ml-0">
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by company, role, student, or date"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredFeedback.map((card, index) => (
          <div
            key={index}
            className="shadow rounded-lg p-6 bg-cardBg transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-hoverBg"
          >
            <h2 className="text-lg font-semibold text-primary mb-1">
              {card.company}
            </h2>
            <p className="text-secondary text-sm mb-3">{card.role}</p>
            <p className="text-accent text-sm mb-4">"{card.feedback}"</p>
            <div className="text-secondary text-xs space-y-1">
              <p>Students: {card.students.join(", ")}</p>
              <p>Date: {card.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feedbacks;
