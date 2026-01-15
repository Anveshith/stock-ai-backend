function ema(values, period) {
  const k = 2 / (period + 1);
  let emaPrev = values[0];

  return values.map(price => {
    emaPrev = price * k + emaPrev * (1 - k);
    return emaPrev;
  });
}

function rsi(values, period = 14) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let rs = gains / (losses || 1);
  let rsiArr = [100 - 100 / (1 + rs)];

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) {
      gains = (gains * (period - 1) + diff) / period;
      losses = (losses * (period - 1)) / period;
    } else {
      gains = (gains * (period - 1)) / period;
      losses = (losses * (period - 1) - diff) / period;
    }

    rs = gains / (losses || 1);
    rsiArr.push(100 - 100 / (1 + rs));
  }

  return rsiArr;
}

module.exports = { ema, rsi };
