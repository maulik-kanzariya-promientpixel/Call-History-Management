import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCallHistory } from "@/context/CallHistoryContext";

const SEARCH_OPTIONS = [
    { label: "Call ID", value: "callId" },
    { label: "Agent Name", value: "agent" },
    { label: "Phone Number", value: "phone" },
    { label: "Queue", value: "queue" },
];

const Searchbar = () => {
    const { setSearchString } = useCallHistory();
    const [type, setType] = React.useState("callId");
    const [query, setQuery] = React.useState("");

    const handleSearch = () => {
        setSearchString(query.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="flex items-center gap-2">
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                    {SEARCH_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                placeholder={`Search by ${SEARCH_OPTIONS.find((o) => o.value === type)?.label
                    }`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-[220px]"
            />

            <Button size="icon" onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Searchbar;
