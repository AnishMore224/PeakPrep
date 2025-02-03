import React from 'react';
import latex from 'latex.js';

const generatePDF = () => {
  // LaTeX code for resume content
  const latexCode = `
    \\documentclass[10pt, letterpaper]{article}
    \\usepackage[utf8]{inputenc}
    \\usepackage{amsmath}
    \\usepackage{hyperref}
    \\usepackage{geometry}
    \\geometry{top=2cm, bottom=2cm, left=2cm, right=2cm}
    \\pagestyle{empty}
    
    \\begin{document}
    
    \\begin{center}
      {\\LARGE \\textbf{John Doe}} \\\\
      \\href{mailto:johndoe@example.com}{johndoe@example.com} \\\\
      \\href{https://linkedin.com/in/johndoe}{linkedin.com/in/johndoe}
    \\end{center}
    
    \\section*{Summary}
    Highly motivated software engineer with 5 years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.
    
    \\section*{Education}
    \\textbf{XYZ University}, B.Sc. in Computer Science (2015 - 2019) \\\\
    \\textbf{ABC University}, M.Sc. in Software Engineering (2019 - 2021)
    
    \\section*{Experience}
    \\textbf{Full-Stack Developer}, TechCorp (2021 - Present) \\\\
    Developed scalable web applications using React and Node.js, integrated with AWS and GCP.
    
    \\textbf{Software Engineer Intern}, DevSoft (2020 - 2021) \\\\
    Assisted in building internal tools and contributed to the development of microservices architecture.
    
    \\section*{Skills}
    JavaScript, React, Node.js, AWS, Docker, TypeScript, SQL, Agile
    
    \\end{document}
  `;

  // Compile the LaTeX code to a PDF buffer using latex.js
  const pdf = latex.compile(latexCode);

  // Create a Blob from the PDF buffer
  const blob = new Blob([pdf.buffer], { type: 'application/pdf' });

  // Create a download link for the PDF
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'resume.pdf';  // Set the filename for the downloaded PDF
  link.click();  // Trigger the download
};

const Resume = () => (
  <div>
    <button onClick={generatePDF}>Generate LaTeX Resume</button>
  </div>
);

export default Resume;
