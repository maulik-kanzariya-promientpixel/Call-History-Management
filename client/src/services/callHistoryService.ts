import type { CallHistory } from '../types/CallHistory';

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if environment variable exists

export const fetchCallHistory = async (): Promise<CallHistory[]> => {
    try {
        // In a real scenario, you might pass pagination params here
        const response = await fetch(`${API_BASE_URL}/call-history`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        // Assuming the API returns an array or an object with a data property
        // Adjust based on actual API contract
        return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
        console.error("Failed to fetch call history:", error);
        // Fallback/Mock data for demonstration if API fails or doesn't exist yet
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
