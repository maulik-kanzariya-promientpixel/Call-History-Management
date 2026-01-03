import * as React from "react";
import { format, differenceInCalendarDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../utils/general/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { normalizeDateRange } from "../../utils/date/date";
import { useCallHistory } from "@/context/CallHistoryContext";

const MAX_DAYS = 15;

export function DateRangePicker() {
    const { dateRange, setDateRange } = useCallHistory();
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [warning, setWarning] = React.useState<string | null>(null);

    React.useEffect(() => {
        setDate({
            from: new Date(dateRange.startTime),
            to: new Date(dateRange.endTime),
        });
    }, [dateRange.startTime, dateRange.endTime]);

    const handleSelect = (range?: DateRange) => {
        if (!range?.from) return;

        const toDate = range.to ?? range.from;
        const selectedDays =
            differenceInCalendarDays(toDate, range.from) + 1;

        const result = normalizeDateRange(range.from, range.to);

        setDate({
            from: new Date(result.startTime),
            to: new Date(result.endTime),
        });

        setDateRange({
            startTime: result.startTime,
            endTime: result.endTime,
        });

        setWarning(selectedDays > MAX_DAYS ? "Maximum 15 days allowed" : null);
    };

    return (
        <div className="relative">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            "bg-background text-foreground",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} – {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-auto rounded-lg p-3 bg-white text-black"
                    align="start"
                >
                    <Calendar
                        mode="range"
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={1}
                        disabled={{ after: new Date() }}
                    />
                </PopoverContent>
            </Popover>

            {warning && (
                <div className="absolute left-0 top-full mt-2 text-xs text-destructive font-medium">
                    {warning}
                </div>
            )}
        </div>
    );
}
