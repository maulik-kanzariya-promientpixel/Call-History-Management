import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallHistory } from "@/context/CallHistoryContext";

const Searchbar = () => {
    const { setSearchString } = useCallHistory();
    const [query, setQuery] = React.useState("");

    const handleSearch = () => {
        setSearchString(query.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="flex items-center gap-2">
            <Input
                placeholder="Search..."
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
