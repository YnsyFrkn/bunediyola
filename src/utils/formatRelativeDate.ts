const formatter = new Intl.RelativeTimeFormat("tr-TR", {
  numeric: "auto",
});

const units = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "week", seconds: 60 * 60 * 24 * 7 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
] as const;

export function formatRelativeDate(date: Date | string) {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.round((targetDate.getTime() - Date.now()) / 1000);
  const absoluteDiff = Math.abs(diffInSeconds);

  for (const { unit, seconds } of units) {
    if (absoluteDiff >= seconds) {
      return formatter.format(Math.round(diffInSeconds / seconds), unit);
    }
  }

  return "simdi";
}
