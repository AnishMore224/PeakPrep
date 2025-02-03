import { ResumeData } from "./data";
import resumeData from "./dummyData";

const generateLatexResume = (data: ResumeData) => {
    let latexTemplate = `
    \\documentclass[10pt, letterpaper]{article}
  
    % Packages:
    \\usepackage[
        top=2cm,
        bottom=2cm,
        left=2cm,
        right=2cm
    ]{geometry}
    \\usepackage{titlesec, tabularx, array, xcolor, enumitem, fontawesome5, amsmath, hyperref, paracol}
    \\definecolor{primaryColor}{RGB}{0, 0, 0}
    \\hypersetup{
        colorlinks=true,
        urlcolor=primaryColor
    }
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
  
    \\pagestyle{empty} % No headers/footers
    \\setlength{\\parindent}{0pt}
    \\setlength{\\columnsep}{0.15cm}
    \\pagenumbering{gobble}
  
    \\titleformat{\\section}{\\large\\bfseries}{}{0pt}{}[\\titlerule]
    \\titlespacing{\\section}{0pt}{0.3cm}{0.2cm}
  
    \\begin{document}
  
    % Header
    \\begin{center}
        {\\fontsize{25pt}{25pt}\\selectfont \\textbf{${data.name}}}\\
        \\vspace{5pt}
        \\href{mailto:${data.contact.email}}{${data.contact.email}} \\quad |
        \\quad \\href{https://linkedin.com/in/${data.contact.linkedin}}{linkedin.com/in/${data.contact.linkedin}} 
    \\end{center}
  
    \\section{Summary}
    ${data.summary}
  
    \\section{Education}
    ${data.education
      .map(
        (edu) => `
        \\textbf{${edu.institution}} \\hfill ${edu.year} \\\\
        ${edu.degree} \\\\
        `
      )
      .join("\n")}
  
    \\section{Experience}
    ${data.experience
      .map(
        (exp) => `
        \\textbf{${exp.title}} \\hfill ${exp.years} \\\\
        \\textit{${exp.company}} \\\\
        \\begin{itemize}
          ${exp.description.split("\n").map((item) => `\\item ${item}`).join("\n")}
        \\end{itemize}
        `
      )
      .join("\n")}
  
    \\section{Skills}
    \\textbf{Skills:} ${data.skills.join(", ")}
  
    \\end{document}
    `;
    return latexTemplate;
  };
  
//   const ResumeGenerator = () => {
//     const resumeLatex = generateLatexResume(resumeData);
  
//     const downloadPdf = () => {
//       // Send LaTeX data to the backend for PDF conversion
//       fetch("http://localhost:5000/generate-pdf", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ latex: resumeLatex })
//       })
//         .then((response) => response.blob())
//         .then((blob) => {
//           // Create a link to download the PDF
//           const link = document.createElement("a");
//           link.href = URL.createObjectURL(blob);
//           link.download = "resume.pdf";
//           link.click();
//         })
//         .catch((error) => {
//           console.error("Error generating PDF:", error);
//         });
//     };
  
//     return (
//       <div>
//         <h2>Generate Your Resume PDF</h2>
//         <button onClick={downloadPdf}>Download Resume as PDF</button>
//       </div>
//     );
//   };
  
//   export default ResumeGenerator;
  