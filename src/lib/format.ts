const zarFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function formatZar(amount: number) {
  return zarFormatter.format(amount);
}

export function centsToZar(cents: number | null | undefined) {
  return (cents ?? 0) / 100;
}

export function zarToCents(zar: number) {
  return Math.round(zar * 100);
}
