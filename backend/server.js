
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const { authenticateUser } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://lead-management-system-five-omega.vercel.app/",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/leads", authenticateUser, leadRoutes);

app.get("/", (req, res) => {
  res.send("Lead Management API is running");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

