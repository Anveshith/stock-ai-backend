function isMarketOpenIST() {
  const now = new Date();

  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const day = ist.getDay();
  if (day === 0 || day === 6) return false;

  const hours = ist.getHours();
  const minutes = ist.getMinutes();

  if (hours < 9 || hours > 15) return false;
  if (hours === 9 && minutes < 15) return false;
  if (hours === 15 && minutes > 30) return false;

  return true;
}

module.exports = { isMarketOpenIST };
