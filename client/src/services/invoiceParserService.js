const extractInvoiceData = (text) => {
  if (!text || text.trim() === "") {
    return {
      invoiceNumber: "",
      vendorName: "Unknown Vendor",
      invoiceDate: "",
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      gstNumber: "",
    };
  }

  const invoiceNumber =
    text.match(
      /Invoice\s*(?:Number|No|#)?\s*:?\s*([A-Z0-9-]+)/i
    )?.[1] || "";

  const totalAmount =
    text.match(
      /Total\s*:?\s*[₹Rs.\s]*([\d,.]+)/i
    )?.[1] || 0;

  const taxAmount =
    text.match(
      /(GST|Tax)\s*:?\s*[₹Rs.\s]*([\d,.]+)/i
    )?.[2] || 0;

  const invoiceDate =
    text.match(
      /Date\s*:?\s*([0-9\/.-]+)/i
    )?.[1] || "";

  const vendorName =
    text
      .split("\n")
      .find(
        (line) => line.trim().length > 5
      ) || "Unknown Vendor";

  return {
    invoiceNumber,
    vendorName,
    invoiceDate,
    subtotal: 0,
    taxAmount: Number(
      String(taxAmount).replace(/,/g, "")
    ),
    totalAmount: Number(
      String(totalAmount).replace(/,/g, "")
    ),
    gstNumber: "",
  };
};

module.exports = {
  extractInvoiceData,
};