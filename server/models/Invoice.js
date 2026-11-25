const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  action: {
    type: String,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },

    vendorName: {
      type: String,
      required: true,
    },

    vendorEmail: {
      type: String,
      default: "",
    },

    gstNumber: {
      type: String,
      default: "",
    },

    invoiceDate: {
      type: Date,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      default: "Uncategorized",
    },

    summary: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },

    warning: {
      type: String,
      default: "",
    },

    isDuplicate: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    extractedText: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    history: [historySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);