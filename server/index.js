const express = require("express");
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
    origin: "*",
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/pet", petRoute);
app.use("/api/v1/adopt", adoptionRoute);
app.use("/api/v1/foster", fosterRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/data", (req, res) => {
  res.send("Data has been added!");
  console.log(req.body);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
