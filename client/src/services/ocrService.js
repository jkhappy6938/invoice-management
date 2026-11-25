const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromInvoice = async (
  filePath,
  mimeType
) => {
  try {
    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);

      try {
        const pdfData = await pdfParse(dataBuffer);

        return pdfData.text || "";
      } catch (pdfError) {
        console.error(
          "PDF PARSE ERROR:",
          pdfError.message
        );

        return "";
      }
    }

    return "";
  } catch (error) {
    console.error(
      "OCR SERVICE ERROR:",
      error.message
    );

    return "";
  }
};

module.exports = {
  extractTextFromInvoice,
};