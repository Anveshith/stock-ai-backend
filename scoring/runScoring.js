const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["ripHistorical"]
});

const db = require("../db");
const { ema, rsi } = require("../utils/indicators");
const { scoreShort } = require("./scoreShort");

async function runScoring() {
  console.log("🧠 Running scoring engine");

  const symbols = ["INFY.NS", "TATASTEEL.NS", "RELIANCE.NS"];

  for (const symbol of symbols) {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const result = await yahooFinance.chart(symbol, {
      period1: sixMonthsAgo,
      period2: now,
      interval: "1d"
    });

    const history = result.quotes;
    if (!history || history.length < 50) continue;

    const closes = history.map(d => d.close).filter(Boolean);
    if (closes.length < 50) continue;

    const ema20 = ema(closes, 20).slice(-1)[0];
    const ema50 = ema(closes, 50).slice(-1)[0];
    const rsi14 = rsi(closes).slice(-1)[0];
    const close = closes.slice(-1)[0];

    const { score, reasons } = scoreShort({
      close,
      ema20,
      ema50,
      rsi: rsi14
    });

    if (score < 50) continue;

    await db.query(
      `
      INSERT INTO final_scores
      (symbol, name, exchange, price, price_bucket, style, direction,
       final_score, risk, sentiment, explanation)
      VALUES
      ($1,$2,'NSE',$3,$4,'short','BUY',$5,'MEDIUM','NEUTRAL',$6)
      ON CONFLICT (symbol, style, direction)
      DO UPDATE SET
        final_score = EXCLUDED.final_score,
        explanation = EXCLUDED.explanation,
        price = EXCLUDED.price
      `,
      [
        symbol.replace(".NS", ""),
        symbol.replace(".NS", ""),
        close,
        close > 1000 ? "1000+" : "100-1000",
        score,
        reasons
      ]
    );
  }

  console.log("✅ Scoring completed");
}

module.exports = { runScoring };
