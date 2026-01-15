// src/runNow.js
require("dotenv").config();
const { runDailyJob } = require("./cron/dailyJob");

(async () => {
  try {
    await runDailyJob();
    console.log("RunNow finished OK");
    process.exit(0);
  } catch (err) {
    console.error("RunNow errored:", err);
    process.exit(1);
  }
})();
