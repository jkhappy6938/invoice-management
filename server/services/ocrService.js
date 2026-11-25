const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const extractTextFromInvoice = async (
    filePath,
    mimeType
) => {
    try {
        // Handle PDF files
        if (mimeType === "application/pdf") {
            const buffer = fs.readFileSync(filePath);

            const pdfData = await pdfParse(buffer);

            return pdfData.text;
        }

        // Handle Images
        const result = await Tesseract.recognize(
            filePath,
            "eng"
        );

        return result.data.text;
    } catch (error) {
        console.error(
            "OCR SERVICE ERROR:",
            error
        );

        throw error;
    }
};

module.exports = {
    extractTextFromInvoice,
};
