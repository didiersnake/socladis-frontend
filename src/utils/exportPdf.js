import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const exportPdf = (name) => {
  const capture = document.querySelector(".actual-receipt");
  html2canvas(capture).then((canvas) => {
    const imgData = canvas.toDataURL("img/png");
    const doc = new jsPDF("portrait", "mm", "a4");
    const imgProperties = doc.getImageProperties(imgData);
    const componentWidth = doc.internal.pageSize.getWidth();
    const componentHeight =
      (imgProperties.height * componentWidth) / imgProperties.width;
    doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);

    doc.save(`${name}.pdf`);
  });
};

export default exportPdf;
