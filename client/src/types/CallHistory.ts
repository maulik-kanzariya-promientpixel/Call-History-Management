export type CallDirection =
    | "INBOUND"
    | "OUTBOUND"
    | "TRANSFER"
    | "CALLBACK"
    | "API";

export interface CallHistory {
    contactId: string;
    direction: CallDirection;
    callStartTime: string;
    callEndTime: string;
    customerPhone: string;
    agentUsername: string | null;
    recordingS3Uri: string | null;
    createdAt: string;
    monthKey?: string;
    channel?: string;
    queueName?: string;
    systemPhone?: string;
}

export interface CallHistoryApiResponse {
    items: CallHistory[];
    nextToken: string | null;
    hasMore: boolean;
    totalScanned: number;
}
