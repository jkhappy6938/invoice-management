const Invoice = require("../models/Invoice");

const {
  extractTextFromInvoice,
} = require("../services/ocrService");

const {
  extractInvoiceData,
} = require("../services/invoiceParserService");

const {
  generateCategory,
  generateSummary,
  detectIssues,
} = require("../utils/invoiceAI");


// =====================
// CREATE INVOICE
// =====================

const createInvoice = async (
  req,
  res
) => {
  try {
    const {
      invoiceNumber,
      vendorName,
      gstNumber,
      invoiceDate,
      subtotal,
      taxAmount,
      totalAmount,
    } = req.body;

    const existing =
      await Invoice.findOne({
        invoiceNumber,
        uploadedBy:
          req.user.userId,
      });

    const invoice =
      await Invoice.create({
        invoiceNumber,
        vendorName,
        gstNumber,

        invoiceDate:
          invoiceDate
            ? new Date(
              invoiceDate
            )
            : new Date(),

        subtotal:
          Number(subtotal) || 0,

        taxAmount:
          Number(taxAmount) || 0,

        totalAmount:
          Number(totalAmount) || 0,

        status: "Pending",

        uploadedBy:
          req.user.userId,

        fileUrl: "",

        isDuplicate:
          Boolean(existing),

        category:
          generateCategory(
            vendorName
          ),

        warning: "",

        history: [
          {
            action:
              "Invoice Created",
            performedBy:
              req.user.userId,
          },
        ],
      });

    invoice.summary =
      generateSummary(
        invoice
      );

    await invoice.save();

    res.status(201).json({
      success: true,
      invoice,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to create invoice",
    });

  }
};


// =====================
// UPLOAD INVOICE
// =====================

const uploadInvoice = async (req, res) => {
  try {
    console.log("========== UPLOAD START ==========");
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Invoice file required",
      });
    }

    let extractedText = "";

    try {
      extractedText = await extractTextFromInvoice(
        req.file.path,
        req.file.mimetype
      );

      console.log("OCR SUCCESS");
    } catch (error) {
      console.error("OCR ERROR:", error);

      extractedText = "";
    }

    const parsedData =
      extractInvoiceData(extractedText);

    console.log("PARSED DATA:", parsedData);

    const duplicate = parsedData.invoiceNumber
      ? await Invoice.findOne({
          invoiceNumber:
            parsedData.invoiceNumber,
          uploadedBy:
            req.user.userId,
        })
      : null;

    let invoiceDate = new Date();

    if (parsedData.invoiceDate) {
      const date = new Date(
        parsedData.invoiceDate
      );

      if (!isNaN(date.getTime())) {
        invoiceDate = date;
      }
    }

    const category = generateCategory(
      parsedData.vendorName || ""
    );

    const warning = detectIssues({
      vendorName:
        parsedData.vendorName,
      gstNumber:
        parsedData.gstNumber,
      subtotal:
        parsedData.subtotal,
      taxAmount:
        parsedData.taxAmount,
      totalAmount:
        parsedData.totalAmount,
    }).join(", ");

    const invoice = await Invoice.create({
      invoiceNumber:
        parsedData.invoiceNumber ||
        `INV-${Date.now()}`,

      vendorName:
        parsedData.vendorName ||
        "Unknown Vendor",

      gstNumber:
        parsedData.gstNumber || "",

      invoiceDate,

      subtotal:
        Number(parsedData.subtotal) || 0,

      taxAmount:
        Number(parsedData.taxAmount) || 0,

      totalAmount:
        Number(parsedData.totalAmount) || 0,

      uploadedBy:
        req.user.userId,

      fileUrl:
        req.file.filename,

      extractedText,

      category,

      warning,

      isDuplicate:
        Boolean(duplicate),

      status: "Pending",

      history: [
        {
          action:
            "Invoice Uploaded",
          performedBy:
            req.user.userId,
        },
      ],
    });

    invoice.summary =
      generateSummary(invoice);

    await invoice.save();

    console.log("INVOICE SAVED");

    return res.status(201).json({
      success: true,
      duplicate:
        Boolean(duplicate),
      invoice,
      extractedData:
        parsedData,
      extractedText,
    });
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
      message:
        "Failed to process invoice",
    });
  }
};

// =====================
// GET ALL
// =====================

const getInvoices =
  async (req, res) => {
    try {

      const invoices =
        await Invoice.find({
          uploadedBy:
            req.user.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(invoices);

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to fetch invoices",
      });

    }
  };


// =====================
// GET ONE
// =====================

const getInvoiceById =
  async (req, res) => {
    try {

      const invoice =
        await Invoice.findById(
          req.params.id
        );

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message:
            "Invoice not found",
        });
      }

      res.json(invoice);

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };


// =====================
// UPDATE
// =====================

const updateInvoice =
  async (req, res) => {
    try {

      const invoice =
        await Invoice.findById(
          req.params.id
        );

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message:
            "Invoice not found",
        });
      }

      Object.assign(
        invoice,
        req.body
      );

      invoice.history.push({
        action:
          "Invoice Updated",
        performedBy:
          req.user.userId,
      });

      await invoice.save();

      res.json({
        success: true,
        invoice,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };


// =====================
// APPROVE
// =====================

const approveInvoice =
  async (req, res) => {
    try {

      const invoice =
        await Invoice.findById(
          req.params.id
        );

      if (!invoice) {
        return res.status(404).json({
          message:
            "Invoice not found",
        });
      }

      invoice.status =
        "Approved";

      invoice.history.push({
        action:
          "Invoice Approved",
        performedBy:
          req.user.userId,
      });

      await invoice.save();

      res.json(invoice);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


// =====================
// REJECT
// =====================

const rejectInvoice =
  async (req, res) => {
    try {

      const invoice =
        await Invoice.findById(
          req.params.id
        );

      if (!invoice) {
        return res.status(404).json({
          message:
            "Invoice not found",
        });
      }

      invoice.status =
        "Rejected";

      invoice.history.push({
        action:
          "Invoice Rejected",
        performedBy:
          req.user.userId,
      });

      await invoice.save();

      res.json(invoice);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };


// =====================
// DELETE
// =====================

const deleteInvoice =
  async (req, res) => {
    try {

      await Invoice.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Invoice deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

module.exports = {
  createInvoice,
  uploadInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  approveInvoice,
  rejectInvoice,
  deleteInvoice,
};