export interface CallHistory {
    contactId: string;
    direction: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'CALLBACK' | 'API';
    callStartTime: string;
    callEndTime: string;
    customerPhone: string;
    agentUsername: string;
    recordingS3Uri: string;
    createdAt: string;
}

export interface CallHistoryResponse {
    data: CallHistory[];
    total: number;
    page: number;
}
