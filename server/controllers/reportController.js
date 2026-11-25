
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");

const getReports = async (req, res) => {
  try {
    // 1. Get authenticated user's ID
    const userId = req.user?.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing user authentication",
      });
    }

    // 2. Get optional date filters
    const { startDate, endDate } = req.query;

    // 3. Build MongoDB filter
    const filter = {
      uploadedBy: new mongoose.Types.ObjectId(userId),
    };

    // Both dates must be provided together
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return res.status(400).json({
        success: false,
        message: "Please provide both start date and end date",
      });
    }

    // 4. Validate and apply date filters
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }

      if (start > end) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be after end date",
        });
      }

      filter.invoiceDate = {
        $gte: start,
        $lte: end,
      };
    }

    // 5. Fetch user's invoices
    const invoices = await Invoice.find(filter).lean();

    // 6. Calculate total revenue from approved invoices
    const totalRevenue = invoices
      .filter((invoice) => invoice.status === "Approved")
      .reduce(
        (sum, invoice) => sum + Number(invoice.totalAmount || 0),
        0
      );

    // 7. Calculate invoice statistics
    const totalInvoices = invoices.length;

    const approved = invoices.filter(
      (invoice) => invoice.status === "Approved"
    ).length;

    const pending = invoices.filter(
      (invoice) => invoice.status === "Pending"
    ).length;

    const rejected = invoices.filter(
      (invoice) => invoice.status === "Rejected"
    ).length;

    const totalVendors = new Set(
      invoices
        .map((invoice) => invoice.vendorName?.trim().toLowerCase())
        .filter(Boolean)
    ).size;

    // 8. Calculate vendor-wise reports
    const vendorMap = new Map();

    invoices.forEach((invoice) => {
      const vendor = invoice.vendorName?.trim() || "Unknown Vendor";

      if (!vendorMap.has(vendor)) {
        vendorMap.set(vendor, {
          vendor,
          invoices: 0,
          amount: 0,
        });
      }

      const vendorData = vendorMap.get(vendor);

      vendorData.invoices += 1;
      vendorData.amount += Number(invoice.totalAmount || 0);
    });

    const topVendors = Array.from(vendorMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // 9. Calculate monthly reports
    const monthlyMap = new Map();

    invoices.forEach((invoice) => {
      if (!invoice.invoiceDate) return;

      const date = new Date(invoice.invoiceDate);

      if (isNaN(date.getTime())) return;

      const monthKey = `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthKey,
          revenue: 0,
          invoices: 0,
        });
      }

      const monthData = monthlyMap.get(monthKey);

      monthData.invoices += 1;

      if (invoice.status === "Approved") {
        monthData.revenue += Number(invoice.totalAmount || 0);
      }
    });

    const monthlyReports = Array.from(monthlyMap.values()).sort(
      (a, b) => a.month.localeCompare(b.month)
    );

    // 10. Send report response
    return res.status(200).json({
      success: true,
      totalRevenue,
      totalInvoices,
      totalVendors,
      approved,
      pending,
      rejected,
      topVendors,
      monthlyReports,
    });

  } catch (error) {
    console.error("REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate reports",
      error: error.message,
    });
  }
};

module.exports = {
  getReports,
};
