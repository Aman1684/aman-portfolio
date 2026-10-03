export function formatDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  },
) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  isCurrent = false,
) {
  const startLabel = formatDate(start) ?? "Present";
  if (isCurrent) return `${startLabel} — Present`;
  const endLabel = formatDate(end);
  if (!endLabel) return startLabel;
  return `${startLabel} — ${endLabel}`;
}
