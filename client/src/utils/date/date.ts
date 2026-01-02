import {
  startOfDay,
  endOfDay,
  differenceInCalendarDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
} from "date-fns";

/**
 * Returns default date range for initial load
 * - From today 12:00 PM
 * - To current time
 */
export function getDefaultDateRange() {
  const now = new Date();

  const noonToday = setSeconds(
    setMinutes(setHours(now, 12), 0),
    0
  );

  return {
    startTime: noonToday.toISOString(),
    endTime: now.toISOString(),
  };
}

/**
 * Normalize date range
 * - Clamps to maxDays (default 15)
 * - Start = startOfDay(from)
 * - End = endOfDay(to) or from + maxDays - 1
 * - Never exceed today
 */
export function normalizeDateRange(
  from: Date,
  to?: Date,
  maxDays = 15
) {
  const today = new Date();

  const start = startOfDay(from);
  let end = to ? endOfDay(to) : endOfDay(from);

  let isClamped = false;

  const diff = differenceInCalendarDays(end, start);
  if (diff > maxDays - 1) {
    end = endOfDay(addDays(start, maxDays - 1));
    isClamped = true;
  }

  if (isAfter(end, today)) {
    end = today;
    isClamped = true;
  }

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    isClamped,
  };
}
