const extractInvoiceData = (
  text
) => {

  const invoiceNumber =
    text.match(
      /Invoice\s*Number[:\s]*([A-Z0-9-]+)/i
    )?.[1] || "";

  const dateMatch =
    text.match(
      /Invoice\s*Date[:\s]*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i
    );

  const invoiceDate =
    dateMatch?.[1] || "";

  const vendorMatch =
    text.match(
      /DEMO\s*-\s*Sliced\s*Invoices/i
    );

  const vendorName =
    vendorMatch?.[0] ||
    "Unknown Vendor";

  const taxMatch =
    text.match(
      /Tax[:\s]*\$?([\d,.]+)/i
    );

  const totalMatch =
    text.match(
      /Total(?:\s*Due)?[:\s]*\$?([\d,.]+)/i
    );

  return {
    invoiceNumber,

    vendorName,

    invoiceDate,

    gstNumber: "",

    subtotal: 0,

    taxAmount:
      Number(
        taxMatch?.[1]
          ?.replace(
            /,/g,
            ""
          )
      ) || 0,

    totalAmount:
      Number(
        totalMatch?.[1]
          ?.replace(
            /,/g,
            ""
          )
      ) || 0,
  };
};

module.exports = {
  extractInvoiceData,
};