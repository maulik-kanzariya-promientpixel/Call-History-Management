export interface CallHistory {
    contactId: string;
    direction: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'CALLBACK' | 'API';
    callStartTime: string; // ISO Date string
    callEndTime: string;   // ISO Date string
    customerPhone: string;
    agentUsername: string;
    recordingS3Uri: string;
    createdAt: string;     // ISO Date string
}

export interface CallHistoryResponse {
    data: CallHistory[];
    total: number;
    page: number;
}
