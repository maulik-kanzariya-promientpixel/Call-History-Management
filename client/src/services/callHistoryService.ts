import type { CallHistoryApiResponse } from "@/types/CallHistory";
import { fetchMockCallHistory } from "../assets/mocks/mockCallHistory";

const API_BASE_URL = "http://localhost:3000";

interface FetchHistoryParams {
  startTime: string;
  endTime: string;
  limit?: number;
  nextToken?: string | null;
}

export async function fetchCallHistory(
  params: FetchHistoryParams
): Promise<CallHistoryApiResponse> {
  const query = new URLSearchParams({
    startTime: params.startTime,
    endTime: params.endTime,
    limit: String(params.limit ?? 10),
  });

  if (params.nextToken) {
    query.append("nextToken", params.nextToken);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/history?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch call history");

    return response.json();
  } catch (err) {
    console.warn("Backend fetch failed, using mock data", err);

    return fetchMockCallHistory(params.startTime, params.endTime, params.limit, params.nextToken ?? undefined);
  }
}
