import { useCallHistory } from "@/context/CallHistoryContext";
import { Phone, Clock, Users, FileAudio } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

const UserDashboard = () => {
  const { history, loading, dateRange } = useCallHistory();

  const stats = useMemo(() => {
    const totalCalls = history.length;
    const totalRecordings = history.filter(call => call.recordingS3Uri).length;
    
    const totalDuration = history.reduce((acc, call) => {
      const start = new Date(call.callStartTime);
      const end = new Date(call.callEndTime);
      return acc + differenceInMinutes(end, start);
    }, 0);

    const uniqueAgents = new Set(
      history
        .map(call => call.agentUsername)
        .filter(Boolean) as string[]
    ).size;

    return {
      totalCalls,
      totalRecordings,
      totalDuration,
      uniqueAgents,
    };
  }, [history]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your call history from{" "}
          {format(new Date(dateRange.startTime), "MMM dd, yyyy")} to{" "}
          {format(new Date(dateRange.endTime), "MMM dd, yyyy")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalCalls.toLocaleString()}
            </div>
            <CardDescription className="mt-1">
              Calls in selected period
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatDuration(stats.totalDuration)}
            </div>
            <CardDescription className="mt-1">
              Combined call time
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recordings</CardTitle>
            <FileAudio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalRecordings.toLocaleString()}
            </div>
            <CardDescription className="mt-1">
              {stats.totalCalls > 0
                ? `${Math.round((stats.totalRecordings / stats.totalCalls) * 100)}% recorded`
                : "No recordings"}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.uniqueAgents.toLocaleString()}
            </div>
            <CardDescription className="mt-1">
              Agents with calls
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Navigate to call history or explore your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Visit the <strong>Call History</strong> page to view detailed records, search, filter, and export your call data.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;