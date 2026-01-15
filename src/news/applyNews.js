const db = require("../db");
const { fetchNews } = require("./fetchNews");
const { analyzeNewsAI } = require("./analyzeNews");

async function applyNewsImpact() {
  const { rows: stocks } = await db.query(
    `SELECT symbol, style, final_score FROM final_scores`
  );

  for (const stock of stocks) {
    const news = await fetchNews(stock.symbol);
    const ai = await analyzeNewsAI(stock.symbol, news);

    let maxImpact = 0;
    if (stock.style === "short") maxImpact = 10;
    if (stock.style === "mid") maxImpact = 8;
    if (stock.style === "long") maxImpact = 5;

    const impact = Math.max(
      -maxImpact,
      Math.min(maxImpact, ai.adjustment)
    );

    await db.query(
      `
      UPDATE final_scores
      SET
        final_score = final_score + $1,
        sentiment = $2,
        risk = $3,
        explanation = explanation || $4
      WHERE symbol = $5 AND style = $6
      `,
      [
        impact,
        ai.sentiment,
        ai.risk,
        [ai.summary],
        stock.symbol,
        stock.style
      ]
    );
  }

  console.log("📰 News & AI adjustments applied");
}

module.exports = { applyNewsImpact };
