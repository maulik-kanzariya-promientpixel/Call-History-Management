import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallHistory } from "@/context/CallHistoryContext";
import { cn } from "@/utils/general/utils";

const Searchbar = () => {
    const { setSearchString, searchString } = useCallHistory();
    const [query, setQuery] = React.useState("");

    React.useEffect(() => {
        setQuery(searchString);
    }, [searchString]);

    const handleSearch = () => {
        setSearchString(query.trim());
    };

    const handleClear = () => {
        setQuery("");
        setSearchString("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="relative flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search calls, agents, phones..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={cn(
                        "w-[280px] pl-9 pr-9",
                        query && "pr-9"
                    )}
                />
                {query && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
            <Button 
                size="sm" 
                onClick={handleSearch} 
                variant="default"
                className="shrink-0"
            >
                Search
            </Button>
        </div>
    );
};

export default Searchbar;
