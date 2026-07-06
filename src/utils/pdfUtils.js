import { PDFDocument } from 'pdf-lib';

export async function mergePDFs(pdfFiles) {
  const mergedPdf = await PDFDocument.create();
  
  for (const pdfFile of pdfFiles) {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}

export async function getPDFPageCount(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
}
