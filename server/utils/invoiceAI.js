const generateCategory = (
  vendorName = ""
) => {
  const vendor =
    vendorName.toLowerCase();

  if (
    vendor.includes("software")
  ) {
    return "Software";
  }

  if (
    vendor.includes("infosys") ||
    vendor.includes("tcs") ||
    vendor.includes("wipro")
  ) {
    return "IT Services";
  }

  if (
    vendor.includes("stationery")
  ) {
    return "Office Supplies";
  }

  if (
    vendor.includes("laptop")
  ) {
    return "Hardware";
  }

  return "General";
};

const generateSummary = (
  invoice
) => {
  return `
Invoice Number: ${invoice.invoiceNumber}
Vendor: ${invoice.vendorName}
Amount: ₹${invoice.totalAmount}
Status: ${invoice.status}
Category: ${invoice.category}
`;
};

const detectIssues = (
  invoice
) => {
  const issues = [];

  const subtotal =
    Number(invoice.subtotal);

  const tax =
    Number(invoice.taxAmount);

  const total =
    Number(invoice.totalAmount);

  if (
    subtotal + tax !== total
  ) {
    issues.push(
      "Total amount mismatch"
    );
  }

  if (
    !invoice.gstNumber
  ) {
    issues.push(
      "Missing GST Number"
    );
  }

  if (
    !invoice.vendorName
  ) {
    issues.push(
      "Missing Vendor Name"
    );
  }

  return issues;
};

module.exports = {
  generateCategory,
  generateSummary,
  detectIssues,
};