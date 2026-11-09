export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const deltaMs = date.getTime() - Date.now();
  const absSeconds = Math.round(Math.abs(deltaMs) / 1000);

  const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
    { unit: "year", seconds: 60 * 60 * 24 * 365 },
    { unit: "month", seconds: 60 * 60 * 24 * 30 },
    { unit: "week", seconds: 60 * 60 * 24 * 7 },
    { unit: "day", seconds: 60 * 60 * 24 },
    { unit: "hour", seconds: 60 * 60 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const { unit, seconds } of units) {
    if (absSeconds >= seconds || unit === "second") {
      const value = Math.round(deltaMs / (seconds * 1000));
      return formatter.format(value, unit);
    }
  }

  return formatter.format(0, "second");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}
