export function centsToDollar(cents) {
  const dollars = Number(cents) / 100;
  return dollars;
}

export function dollarToCents(amount) {
  return Math.round(100 * parseFloat(amount));
}

export function getTotalSells(close, sellsInCard) {
  return dollarToCents(close + sellsInCard);
}
