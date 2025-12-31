import type { CallHistory } from '../types/CallHistory';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchCallHistory = async (): Promise<CallHistory[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/call-history`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error("Failed to fetch call history:", error);
        return [
            {
                contactId: "12345-abcde",
                direction: "INBOUND",
                callStartTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
                callEndTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                customerPhone: "+15550100",
                agentUsername: "jdoe",
                recordingS3Uri: "s3://bucket/recording1.wav",
                createdAt: new Date().toISOString()
            },
            {
                contactId: "67890-fghij",
                direction: "OUTBOUND",
                callStartTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                callEndTime: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
                customerPhone: "+15550101",
                agentUsername: "asmith",
                recordingS3Uri: "s3://bucket/recording2.wav",
                createdAt: new Date().toISOString()
            }
        ];
    }
};
