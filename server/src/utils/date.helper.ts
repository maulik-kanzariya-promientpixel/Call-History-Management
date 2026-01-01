// Helper function to generate all months between two dates
export function getMonthsBetween(startDate: string, endDate: string): string[] {
  const months: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= endMonth) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}`);
    current.setMonth(current.getMonth() + 1);
  }
  console.log("helper getMonthsBetween" + months);

  return months;
}

export function getMonthDateRange(
  monthKey: string,
  startDate: string,
  endDate: string
): { start: string; end: string } {
  const [year, month] = monthKey.split("-");
  const monthStart = `${year}-${month}-01T00:00:00Z`;
  const monthEnd = `${year}-${month}-31T23:59:59Z`;

  const rangeStart = startDate > monthStart ? startDate : monthStart;
  const rangeEnd = endDate < monthEnd ? endDate : monthEnd;

  console.log("helper getMonthDateRange" + rangeStart + " " + rangeEnd);

  return { start: rangeStart, end: rangeEnd };
}
