const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();
const reportRoutes = require("./routes/reportRoutes");
const exportRoutes = require("./routes/exportRoutes");


// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse URL encoded requests
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use("/uploads",express.static(path.join(__dirname, "uploads")));

app.use("/api/dashboard",dashboardRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Invoice Management API is running successfully",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/invoices", invoiceRoutes);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/export",
  exportRoutes
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


const startServer = async () => {
  try {
    await connectDB();

    const PORT =
      process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();