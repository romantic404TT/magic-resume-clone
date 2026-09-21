import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4 = { width: 595.28, height: 841.89 };

/** 与上游一致：html2canvas 截图 + jsPDF 分页，输出真正的多页 A4 PDF */
export const exportElementToPdf = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
  });

  const imgWidth = A4.width;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const image = canvas.toDataURL("image/jpeg", 0.94);

  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  let offset = 0;
  pdf.addImage(image, "JPEG", 0, offset, imgWidth, imgHeight);
  let remaining = imgHeight - A4.height;
  while (remaining > 0) {
    pdf.addPage();
    offset -= A4.height;
    pdf.addImage(image, "JPEG", 0, offset, imgWidth, imgHeight);
    remaining -= A4.height;
  }

  const safe = filename.replace(/[\\/:*?"<>|]/g, "_");
  pdf.save(safe.endsWith(".pdf") ? safe : `${safe}.pdf`);
  return { pages: Math.max(1, Math.ceil(imgHeight / A4.height)), pixelSize: `${canvas.width}x${canvas.height}` };
};

export const printElement = () => window.print();
