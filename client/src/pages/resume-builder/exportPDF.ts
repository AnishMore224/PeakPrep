import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportToPdf = (elementId: string) => {
  const input = document.getElementById(elementId);
  if (!input) return;

  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("resume.pdf"); 
  });
};
