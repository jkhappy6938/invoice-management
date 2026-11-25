const express = require("express");

const router = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const upload = require(
    "../middleware/uploadMiddleware"
);

const {
    createInvoice,
    uploadInvoice,
    approveInvoice,
    rejectInvoice,
    getInvoices,
    deleteInvoice,
    getInvoiceById,
    updateInvoice,
} = require(
    "../controllers/invoiceController"
);


router.post(
    "/",
    protect,
    createInvoice
);

router.post(
    "/upload",
    protect,
    upload.single("invoice"),
    uploadInvoice
);

router.patch(
    "/:id/approve",
    protect,
    approveInvoice
);

router.patch(
    "/:id/reject",
    protect,
    rejectInvoice
);
router.get(
    "/",
    protect,
    getInvoices
);

router.delete(
    "/:id",
    protect,
    deleteInvoice
);

router.get(
  "/:id",
  protect,
  getInvoiceById
);

router.put(
  "/:id",
  protect,
  updateInvoice
);
module.exports = router;