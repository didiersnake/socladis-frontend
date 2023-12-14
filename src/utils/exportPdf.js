import html2pdf from "html2pdf.js";

const exportPdf = async (componentRef, filename) => {
  try {
    const input = componentRef.current;

    const pdfOptions = {
      margin: 10,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().from(input).set(pdfOptions).outputPdf().save(filename);

    /* const canvas = await html2canvas(input);

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    const maxHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(18);

    while (position < imgHeight) {
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        Math.min(maxHeight, imgHeight - position)
      );
      position += maxHeight;
      if (position < imgHeight) {
        pdf.addPage();
      }
    }

    pdf.save(filename); */
  } catch (error) {
    console.error("Error exporting to PDF:", error);
  }
};

export default exportPdf;
