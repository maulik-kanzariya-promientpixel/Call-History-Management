import { Button } from "@/components/ui/button"
import { SpeakerWaveIcon } from "@heroicons/react/24/outline"

const staticData = [
  { contactId: "C1234567", direction: "INBOUND", customerPhone: "+1234567890", agentUsername: "Alice", startTime: "10:00 AM", endTime: "10:15 AM", createdAt: "2026-01-01" },
  { contactId: "C2345678", direction: "OUTBOUND", customerPhone: "+1987654321", agentUsername: "Bob", startTime: "11:00 AM", endTime: "11:20 AM", createdAt: "2026-01-01" },
  { contactId: "C3456789", direction: "TRANSFER", customerPhone: "+1122334455", agentUsername: "Charlie", startTime: "12:00 PM", endTime: "12:10 PM", createdAt: "2026-01-01" },
]

const getBadgeColor = (direction: string) => {
  switch (direction.toUpperCase()) {
    case "INBOUND": return "bg-green-100 text-green-800 border-green-200"
    case "OUTBOUND": return "bg-blue-100 text-blue-800 border-blue-200"
    case "TRANSFER": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "CALLBACK": return "bg-purple-100 text-purple-800 border-purple-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const SimpleTable = () => {
  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Call History</h2>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr>
              {["Contact ID", "Direction", "Customer Phone", "Agent", "Start Time", "End Time", "Created At", "Action"].map((title, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {staticData.map((call, idx) => (
              <tr
                key={call.contactId}
                className={`transition-colors hover:bg-muted/50 ${idx % 2 === 0 ? "bg-muted/20" : ""}`}
              >
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{call.contactId}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(call.direction)}`}>
                    {call.direction}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">{call.customerPhone}</td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">{call.agentUsername}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{call.startTime}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{call.endTime}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{call.createdAt}</td>
                <td className="px-6 py-4">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <SpeakerWaveIcon className="w-4 h-4" />
                    Listen
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SimpleTable
