import latex from "node-latex";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ResumeData } from "../types/collections";
import { Request, Response } from "express";

function fillTemplate(template: string, data: ResumeData): string {
  let filledTemplate = template;

  // Replace placeholders with data from the ResumeData
  filledTemplate = filledTemplate.replace("{{name}}", data.name);
  filledTemplate = filledTemplate.replace("{{contact.email}}", data.contact.email);
  filledTemplate = filledTemplate.replace("{{contact.phone}}", data.contact.phone);
  filledTemplate = filledTemplate.replace("{{contact.linkedin}}", data.contact.linkedin);
  filledTemplate = filledTemplate.replace("{{summary}}", data.summary);



  // Replace Education data
  let educationStr = "";
  data.education.forEach((edu) => {
    educationStr += `
      \\begin{twocolentry}{${edu.year}}
        \\textbf{${edu.degree}}, ${edu.institution}
      \\end{twocolentry}
    `;
  });
  filledTemplate = filledTemplate.replace("{{education1}}", educationStr).replace("{{/education}}", "");

  // Replace Experience data
  let experienceStr = "";
  data.experience.forEach((exp) => {
    experienceStr += `
      \\begin{twocolentry}{${exp.years}}
        \\textbf{${exp.title}}, ${exp.company}
      \\end{twocolentry}
      \\begin{onecolentry}
        ${exp.description}
      \\end{onecolentry}
      \\vspace{0.3 cm}
    `;
  });
  filledTemplate = filledTemplate.replace("{{experience1}}", experienceStr).replace("{{/experience}}", "");

  // Replace Skills data
  let skillsStr = data.skills.map(skill => `\\item \\textbf {${skill}} \\`).join(" ");
  filledTemplate = filledTemplate.replace("{{skills1}}", skillsStr).replace("{{/skills}}", "");

  // Replace Publications data
  let publicationStr = "";
  data.publications?.forEach((pub) => {
    publicationStr += `
      \\textbf{${pub.title}} \\newline
      Authors: ${pub.authors.join(", ")} \\
      ${pub.link ? `\\href{${pub.link}}{View Publication}` : ""} 
      \\vspace{0.3 cm}
    `;
  });
  filledTemplate = filledTemplate.replace("{{publications1}}", publicationStr).replace("{{/publications}}", "");

  // Replace Projects data
  let projectsStr = "";
  data.projects?.forEach((proj) => {
    projectsStr += `
      \\textbf{${proj.name}} \\newline
      ${proj.description} \\
      \\href{${proj.link}}{Project Link}
      \\vspace{0.3 cm}
    `;
  });
  filledTemplate = filledTemplate.replace("{{projects1}}", projectsStr).replace("{{/projects}}", "");

  // Replace Additional Info data
  let additionalInfoStr = "";
  data.additionalInfo?.forEach((info: { title: string; content: string }) => {
    additionalInfoStr += `
      \\textbf{${info.title}} \\
      ${info.content} \\
      \\vspace{0.3 cm}
    `;
  });
  filledTemplate = filledTemplate.replace("{{additionalInfo1}}", additionalInfoStr).replace("{{/additionalInfo}}", "");

  return filledTemplate;
}

export const generatePdf = async (req: Request, res: Response): Promise<any> => {
  const resumeData = req.body.resumeData;

  try {
    const templatePath = path.join(__dirname, "../utils/templates/t1.tex");
    const template = fs.readFileSync(templatePath, "utf8");
    const latexCode = fillTemplate(template, resumeData);
    console.log(latexCode);
    const pdfStream = latex(latexCode);
    res.setHeader("Content-Type", "application/pdf");

    pdfStream.pipe(res);

    pdfStream.on("error", (err) => {
      console.error("Error generating PDF:", err);
      res.status(500).send("Failed to generate PDF");
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Unexpected error occurred");
  }
};
