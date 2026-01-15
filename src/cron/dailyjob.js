const { runScoring } = require("../scoring/runScoring");
const { applyNewsImpact } = require("../news/applyNews");

async function runDailyJob() {
  console.log("🔁 Daily automation started");

  await runScoring();        // Phase 2
  await applyNewsImpact();   // Phase 3

  console.log("✅ Daily automation completed");
}

module.exports = { runDailyJob };
