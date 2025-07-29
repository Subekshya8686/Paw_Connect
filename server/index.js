require("dotenv").config();
const express = require("express");
const https = require("https");
const { generateSSLCertificates } = require("./generateSSL");
const connectDB = require("./config/db");
const userRoute = require("./route/userRoute");
const petRoute = require("./route/petRoute");
const adoptionRoute = require("./route/adoptionRoute");
const fosterRoute = require("./route/fosterRoute");
const cors = require("cors");

const app = express();
app.use("/uploads", express.static("uploads"));

connectDB();
app.use(express.json());

app.use(
  cors({
    origin: ["https://localhost:5173", "https://192.168.196.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

const HTTPS_PORT = process.env.HTTPS_PORT || 5443;

try {
  const certificates = generateSSLCertificates();

  if (certificates && certificates.key && certificates.cert) {
    const sslOptions = {
      key: certificates.key,
      cert: certificates.cert,
    };

    https.createServer(sslOptions, app).listen(HTTPS_PORT, "0.0.0.0", () => {
      console.log(`HTTPS Server running on https://0.0.0.0:${HTTPS_PORT}`);
    });
  } else {
    console.error("SSL certificates missing or invalid");
  }
} catch (error) {
  console.error("Failed to start HTTPS server:", error);
}

module.exports = app;
