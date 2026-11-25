function generateCategory(vendorName) {
  const vendor = vendorName.toLowerCase();

  if (vendor.includes("software"))
    return "Software";

  if (vendor.includes("laptop"))
    return "IT Equipment";

  if (vendor.includes("stationery"))
    return "Office Supplies";

  return "General";
}

function generateSummary(invoice) {
  return `
Invoice Number: ${invoice.invoiceNumber}
Vendor: ${invoice.vendorName}
Date: ${invoice.invoiceDate}
Total Amount: ₹${invoice.totalAmount}
Status: ${invoice.status}
`;
}

function detectWarning(invoice) {
  const calculatedTotal =
    Number(invoice.subtotal) + Number(invoice.taxAmount);

  if (calculatedTotal !== Number(invoice.totalAmount)) {
    return "Subtotal + Tax does not match Total Amount";
  }

  return "";
}

module.exports = {
  generateCategory,
  generateSummary,
  detectWarning,
};