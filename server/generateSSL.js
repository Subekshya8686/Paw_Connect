const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Function to generate self-signed certificates
function generateSSLCertificates() {
  const sslDir = path.join(__dirname, "ssl");

  // Ensure SSL directory exists
  if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
  }

  const keyPath = path.join(sslDir, "key.pem");
  const certPath = path.join(sslDir, "cert.pem");

  // Generate certificates using Node.js crypto (alternative to OpenSSL)
  try {
    const selfsigned = require("selfsigned");

    const attrs = [
      { name: "commonName", value: "localhost" },
      { name: "countryName", value: "US" },
      { shortName: "ST", value: "California" },
      { name: "localityName", value: "San Francisco" },
      { name: "organizationName", value: "PawConnect" },
    ];

    const pems = selfsigned.generate(attrs, {
      keySize: 2048,
      days: 365,
      algorithm: "sha256",
    });

    // Write certificates to files
    fs.writeFileSync(keyPath, pems.private);
    fs.writeFileSync(certPath, pems.cert);

    return { key: pems.private, cert: pems.cert };
  } catch (error) {
    return null;
  }
}

module.exports = { generateSSLCertificates };
