const express = require("express");
const router = express.Router();
const db = require("../db");
const { isMarketOpenIST } = require("../utils/market");

router.get("/final-scores", async (req, res) => {
  try {
    const {
      style,
      minScore = 0,
      priceBucket
    } = req.query;

    if (!style) {
      return res.status(400).json({ error: "style is required" });
    }

    const marketOpen = isMarketOpenIST();

    let query = `
      SELECT
        symbol,
        name,
        exchange,
        price,
        price_bucket AS "priceBucket",
        final_score AS score,
        direction,
        holding_type AS "holdingType",
        risk,
        sentiment,
        explanation
      FROM final_scores
      WHERE style = $1
        AND final_score >= $2
    `;

    const params = [style, minScore];

    if (priceBucket) {
      params.push(priceBucket);
      query += ` AND price_bucket = $${params.length}`;
    }

    // 🔒 Intraday short protection
    if (!marketOpen) {
      query += ` AND direction != 'SHORT'`;
    }

    query += `
      ORDER BY final_score DESC
      LIMIT 10
    `;

    const { rows } = await db.query(query, params);

    res.json({
      date: new Date().toISOString().split("T")[0],
      style,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
