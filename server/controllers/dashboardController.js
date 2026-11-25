const Invoice = require("../models/Invoice");

const getDashboardStats = async (
  req,
  res
) => {
  try {
    const invoices =
      await Invoice.find({
        uploadedBy:
          req.user.userId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5);

    const allInvoices =
      await Invoice.find({
        uploadedBy:
          req.user.userId,
      });

    const total =
      allInvoices.length;

    const approved =
      allInvoices.filter(
        (invoice) =>
          invoice.status ===
          "Approved"
      ).length;

    const pending =
      allInvoices.filter(
        (invoice) =>
          invoice.status ===
          "Pending"
      ).length;

    const rejected =
      allInvoices.filter(
        (invoice) =>
          invoice.status ===
          "Rejected"
      ).length;

    const duplicates =
      allInvoices.filter(
        (invoice) =>
          invoice.isDuplicate
      ).length;

    const revenue =
      allInvoices
        .filter(
          (invoice) =>
            invoice.status ===
            "Approved"
        )
        .reduce(
          (sum, invoice) =>
            sum +
            Number(
              invoice.totalAmount || 0
            ),
          0
        );

    res.status(200).json({
      total,
      approved,
      pending,
      rejected,
      duplicates,
      revenue,
      recentInvoices:
        invoices,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch dashboard stats",
    });

  }
};

module.exports = {
  getDashboardStats,
};