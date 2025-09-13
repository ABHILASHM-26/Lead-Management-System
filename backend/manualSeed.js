const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Lead = require("./models/Lead");
const fs = require("fs");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("MongoDB error:", err));

const leads = JSON.parse(fs.readFileSync("leads.json", "utf-8"));

const seedLeads = async () => {
  try {
    await Lead.deleteMany(); 
    await Lead.insertMany(leads);
    console.log(` Inserted ${leads.length} leads`);
    process.exit();
  } catch (err) {
    console.error(" Seeding failed:", err.message);
    process.exit(1);
  }
};

seedLeads();
