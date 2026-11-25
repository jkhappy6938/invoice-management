const express = require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/authMiddleware"
  );

const {
  exportExcel,
  exportPDF,
} = require(
  "../controllers/exportController"
);

router.get(
  "/excel",
  protect,
  exportExcel
);

router.get(
  "/pdf",
  protect,
  exportPDF
);

module.exports = router;