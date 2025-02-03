import jsPDF from "jspdf";
import { ResumeData } from "./data";

export const generatePDF = (resumeData: ResumeData) => {
  const pdf = new jsPDF();
  const margin = 20;
  let yPos = margin;
  const lineHeight = 7;

  // Helper function to add text and handle pagination
  const addText = (text: string, size = 12, isBold = false) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    
    if (yPos > pdf.internal.pageSize.height - margin) {
      pdf.addPage();
      yPos = margin;
    }
    
    pdf.text(text, margin, yPos);
    yPos += lineHeight;
  };

  // Name
  addText(resumeData.name, 24, true);
  yPos += 5;

  // Contact Info
  addText(`Email: ${resumeData.contact.email}`);
  addText(`Phone: ${resumeData.contact.phone}`);
  addText(`LinkedIn: ${resumeData.contact.linkedin}`);
  yPos += 5;

  // Summary
  addText("Summary", 16, true);
  addText(resumeData.summary);
  yPos += 5;

  // Education
  addText("Education", 16, true);
  resumeData.education.forEach(edu => {
    addText(`${edu.institution}`, 12, true);
    addText(`${edu.degree} (${edu.year})`);
    yPos += 2;
  });

  // Experience
  addText("Experience", 16, true);
  resumeData.experience.forEach(exp => {
    addText(`${exp.title} at ${exp.company}`, 12, true);
    addText(`${exp.years}`);
    exp.description.split('\n').forEach(line => addText(line));
    yPos += 2;
  });

  // Skills
  addText("Skills", 16, true);
  addText(resumeData.skills.join(", "));

  // Save the PDF
  pdf.save("resume.pdf");
};

// export const exportToPdf = (elementId: string) => {
//   const input = document.getElementById(elementId);
//   if (!input) return;

//   const pdf = new jsPDF();
//   const textContent = input.innerText || input.textContent;

//   if (textContent) {
//     const margin = 10;
//     const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
//     const pageHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
    
//     const textLines = pdf.splitTextToSize(textContent, pageWidth);
//     let y = margin;

//     textLines.forEach((line: string) => {
//       if (y + 10 > pageHeight) {
//         pdf.addPage();
//         y = margin;
//       }
//       pdf.text(line, margin, y);
//       y += 10;
//     });

//     pdf.save("resume.pdf");
//   }
// };
