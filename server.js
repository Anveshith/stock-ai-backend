require("dotenv").config();

const cron = require("node-cron");
const { runDailyJob } = require("./cron/dailyJob");

const express = require("express");
const cors = require("cors");

const scoresRoute = require("./routes/scores");

app.use(cors());
app.use(express.json());

app.use("/api", scoresRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Run every weekday at 3:40 PM IST
cron.schedule(
  "40 15 * * 1-5",
  runDailyJob,
  { timezone: "Asia/Kolkata" }
);
