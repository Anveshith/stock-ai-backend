function scoreShort({ close, ema20, ema50, rsi }) {
  let score = 0;
  let reasons = [];

  if (close > ema20) {
    score += 15;
    reasons.push("Price above 20 EMA");
  }

  if (ema20 > ema50) {
    score += 15;
    reasons.push("20 EMA above 50 EMA");
  }

  if (rsi >= 50 && rsi <= 65) {
    score += 20;
    reasons.push("Healthy RSI momentum");
  }

  if (rsi > 70) {
    score -= 10;
    reasons.push("RSI overbought");
  }

  return { score, reasons };
}

module.exports = { scoreShort };
