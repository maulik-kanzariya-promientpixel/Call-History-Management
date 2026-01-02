import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCallHistory } from "@/context/CallHistoryContext"

const DownloadCsvButton = () => {
    const { dateRange, searchString } = useCallHistory();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);

            const params = new URLSearchParams({
                startTime: dateRange.startTime,
                endTime: dateRange.endTime,
            });

            if (searchString) {
                params.append("searchString", searchString);
            }

            const url = `http://localhost:3000/export?${params.toString()}`;

           
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'call-history.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("CSV download started");
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
            className="cursor-pointer"
        >
            {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            Download CSV
        </Button>
    )
}

export default DownloadCsvButton
