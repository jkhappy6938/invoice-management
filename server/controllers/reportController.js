const Invoice = require("../models/Invoice");

const getReports = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      uploadedBy: req.user.userId,
    });

    const totalRevenue = invoices
      .filter(
        (invoice) =>
          invoice.status === "Approved"
      )
      .reduce(
        (sum, invoice) =>
          sum +
          Number(invoice.totalAmount || 0),
        0
      );

    const totalInvoices =
      invoices.length;

    const totalVendors =
      new Set(
        invoices.map(
          (invoice) =>
            invoice.vendorName
        )
      ).size;

    const approved =
      invoices.filter(
        (invoice) =>
          invoice.status ===
          "Approved"
      ).length;

    const pending =
      invoices.filter(
        (invoice) =>
          invoice.status ===
          "Pending"
      ).length;

    const rejected =
      invoices.filter(
        (invoice) =>
          invoice.status ===
          "Rejected"
      ).length;

    const vendorMap = {};

    invoices.forEach(
      (invoice) => {
        const vendor =
          invoice.vendorName ||
          "Unknown Vendor";

        if (!vendorMap[vendor]) {
          vendorMap[vendor] = {
            vendor,
            invoices: 0,
            amount: 0,
          };
        }

        vendorMap[vendor]
          .invoices += 1;

        vendorMap[vendor]
          .amount +=
          Number(
            invoice.totalAmount || 0
          );
      }
    );

    const topVendors =
      Object.values(vendorMap)
        .sort(
          (a, b) =>
            b.amount -
            a.amount
        )
        .slice(0, 5);

    res.status(200).json({
      totalRevenue,
      totalInvoices,
      totalVendors,
      approved,
      pending,
      rejected,
      topVendors,
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Failed to generate reports",
    });

  }
};

module.exports = {
  getReports,
};