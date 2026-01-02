import { addDays, isAfter } from "date-fns";

export function clampToMaxDays(
    from: Date,
    to: Date,
    maxDays = 15
): { from: Date; to: Date; clamped: boolean } {
    const maxTo = addDays(from, maxDays);

    if (isAfter(to, maxTo)) {
        return { from, to: maxTo, clamped: true };
    }

    return { from, to, clamped: false };
}
