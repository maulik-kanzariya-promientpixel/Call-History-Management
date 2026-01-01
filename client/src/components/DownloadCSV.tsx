import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const DownloadCsvButton = () => {
    return (
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
        </Button>
    )
}

export default DownloadCsvButton
