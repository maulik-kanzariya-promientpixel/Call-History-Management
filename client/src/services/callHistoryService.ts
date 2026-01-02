import type { CallHistoryApiResponse } from "@/types/CallHistory";
import { fetchMockCallHistory } from "../assets/mocks/mockCallHistory";

const API_BASE_URL = "http://localhost:3000";

interface FetchHistoryParams {
  startTime: string;
  endTime: string;
  limit?: number;
  nextToken?: string | null;
  searchString?: string;
}

export interface RecordingResponse {
  signedUrl: string;
}

export async function fetchCallHistory(
  params: FetchHistoryParams
): Promise<CallHistoryApiResponse> {
  const query = new URLSearchParams({
    startTime: params.startTime,
    endTime: params.endTime,
    limit: String(params.limit ?? 10),
  });

  if (params.nextToken) query.append("nextToken", params.nextToken);
  if (params.searchString) query.append("searchString", params.searchString);

  try {
    const response = await fetch(`${API_BASE_URL}/history?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch call history");
    return response.json();
  } catch {
    return fetchMockCallHistory(
      params.startTime,
      params.endTime,
      params.limit,
      params.nextToken ?? undefined,
      params.searchString
    );
  }
}


export async function fetchRecording(contactId: string): Promise<RecordingResponse> {
  try {
    const res = await fetch(`http://localhost:3000/recording/${contactId}`);
    if (!res.ok) throw new Error("Failed to fetch recording");
    return res.json();
  } catch (err) {
    console.error("Error fetching recording:", err);
    throw err;
  }
}
