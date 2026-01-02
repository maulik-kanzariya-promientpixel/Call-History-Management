export const BASE_COLUMNS = [
    { key: "contactId", label: "Contact ID" },
    { key: "callStartTime", label: "Start Time" },
    { key: "callEndTime", label: "End Time" },
    { key: "customerPhone", label: "Customer Phone" },
    { key: "agentUsername", label: "Agent" },
] as const;

export const EXTRA_COLUMNS = [
    { key: "direction", label: "Direction" },
    { key: "queueName", label: "Queue" },
    { key: "channel", label: "Channel" },
] as const;

export type ExtraColumnKey = typeof EXTRA_COLUMNS[number]["key"];
