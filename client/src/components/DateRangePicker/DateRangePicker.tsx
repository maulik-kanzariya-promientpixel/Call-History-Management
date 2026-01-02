import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/utils/general/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { normalizeDateRange, getDefaultDateRange } from "@/utils/date/date";
import { useCallHistory } from "../../context/CallHistoryContext";

export function DateRangePicker() {
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [warning, setWarning] = React.useState<string | null>(null);

    const { setDateRange } = useCallHistory();

    React.useEffect(() => {
        const todayRange = getDefaultDateRange();
        setDate({
            from: new Date(todayRange.startTime),
            to: new Date(todayRange.endTime),
        });

    }, []);

    const handleSelect = (range?: DateRange) => {
        if (!range?.from) return;

        const result = normalizeDateRange(range.from, range.to);

        setDate({
            from: new Date(result.startTime),
            to: new Date(result.endTime),
        });

        setDateRange({
            startTime: result.startTime,
            endTime: result.endTime,
        });

        setWarning(result.isClamped ? "Maximum 15 days allowed" : null);
    };

    return (
        <div className="flex flex-col gap-1">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[260px] justify-start text-left font-normal",
                            "bg-background text-foreground",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} –{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-2" align="start">
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
                <span className="text-xs text-destructive">{warning}</span>
            )}
        </div>
    );
}