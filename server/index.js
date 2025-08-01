require("dotenv").config();
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { generateSSLCertificates } = require("./generateSSL");
const connectDB = require("./config/db");
const userRoute = require("./route/userRoute");
const petRoute = require("./route/petRoute");
const adoptionRoute = require("./route/adoptionRoute");
// const authRoute = require("./route/authRoute");
const fosterRoute = require("./route/fosterRoute");
const cors = require("cors");

const app = express();
app.use("/uploads", express.static("uploads"));

connectDB();
app.use(express.json());
app.use(
  cors({
    origin: ["https://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/pet", petRoute);
app.use("/api/v1/adopt", adoptionRoute);
app.use("/api/v1/foster", fosterRoute);

app.get("/", (req, res) => {
  res.send("Hello World! 🐾");
});

app.post("/data", (req, res) => {
  res.send("Data has been added!");
});

const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5443;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS !== "false";

// Start HTTP server
app.listen(PORT, () => {
});

// Start HTTPS server if enabled
if (ENABLE_HTTPS) {
  try {
    const certificates = generateSSLCertificates();

    if (certificates) {
      const sslOptions = {
        key: certificates.key,
        cert: certificates.cert,
      };

      https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      });
    }
  } catch (error) {
  }
}

module.exports = app;
