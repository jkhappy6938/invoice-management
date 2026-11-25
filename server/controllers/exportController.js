const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const Invoice = require("../models/Invoice");

const exportExcel = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      uploadedBy: req.user.userId,
    });

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Invoices"
      );

    worksheet.columns = [
      {
        header: "Invoice No",
        key: "invoiceNumber",
        width: 20,
      },
      {
        header: "Vendor",
        key: "vendorName",
        width: 25,
      },
      {
        header: "Amount",
        key: "totalAmount",
        width: 15,
      },
      {
        header: "Status",
        key: "status",
        width: 15,
      },
    ];

    invoices.forEach(
      (invoice) => {
        worksheet.addRow({
          invoiceNumber:
            invoice.invoiceNumber,
          vendorName:
            invoice.vendorName,
          totalAmount:
            invoice.totalAmount,
          status:
            invoice.status,
        });
      }
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=invoices.xlsx"
    );

    await workbook.xlsx.write(
      res
    );

    res.end();

  } catch (error) {

    res.status(500).json({
      message:
        "Excel export failed",
    });

  }
};

const exportPDF = async (
  req,
  res
) => {
  try {

    const invoices =
      await Invoice.find({
        uploadedBy:
          req.user.userId,
      });

    const doc =
      new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=invoices.pdf"
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text(
        "Invoice Report",
        {
          align: "center",
        }
      );

    doc.moveDown();

    invoices.forEach(
      (invoice) => {

        doc
          .fontSize(12)
          .text(
            `Invoice: ${invoice.invoiceNumber}`
          );

        doc.text(
          `Vendor: ${invoice.vendorName}`
        );

        doc.text(
          `Amount: ₹${invoice.totalAmount}`
        );

        doc.text(
          `Status: ${invoice.status}`
        );

        doc.moveDown();
      }
    );

    doc.end();

  } catch (error) {

    res.status(500).json({
      message:
        "PDF export failed",
    });

  }
};

module.exports = {
  exportExcel,
  exportPDF,
};
