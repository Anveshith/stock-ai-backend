async function analyzeNewsAI(stock, newsItems) {
  if (!newsItems.length) {
    return {
      sentiment: "NEUTRAL",
      confidence: 0,
      risk: "LOW",
      adjustment: 0,
      summary: "No significant news impact"
    };
  }

  // TEMP RULE-BASED AI (safe placeholder)
  const combinedText = newsItems
    .map(n => n.title + " " + n.description)
    .join(" ")
    .toLowerCase();

  let sentiment = "NEUTRAL";
  let adjustment = 0;
  let risk = "LOW";

  if (combinedText.includes("profit") || combinedText.includes("growth")) {
    sentiment = "POSITIVE";
    adjustment = +6;
  }

  if (combinedText.includes("loss") || combinedText.includes("regulatory")) {
    sentiment = "NEGATIVE";
    adjustment = -6;
    risk = "HIGH";
  }

  return {
    sentiment,
    confidence: 70,
    risk,
    adjustment,
    summary: "News-based sentiment adjustment applied"
  };
}

module.exports = { analyzeNewsAI };
