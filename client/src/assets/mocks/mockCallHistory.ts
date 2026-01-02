import type { CallHistoryApiResponse, CallHistory, CallDirection } from "@/types/CallHistory";

const directions: CallDirection[] = ["INBOUND", "OUTBOUND", "TRANSFER", "CALLBACK", "API"];
const agents = ["Alice", "Bob", "Charlie", "Dana", null];
const queues = ["Support", "Sales", "Billing", "Tech", "General"];
const channels = ["VOICE", "CHAT"];
const systemPhones = ["+10000000001", "+10000000002", "+10000000003"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomTimeOnDate(date: string) {
  const day = new Date(date);
  const hour = randomInt(0, 23);
  const minute = randomInt(0, 59);
  const second = randomInt(0, 59);
  day.setHours(hour, minute, second, 0);
  return day;
}

const SINGLE_DAY = "2025-12-12";
const TOTAL_ITEMS = 250;
const MOCK_ITEMS: CallHistory[] = Array.from({ length: TOTAL_ITEMS }).map((_, i) => {
  const start = randomTimeOnDate(SINGLE_DAY);
  const end = new Date(start.getTime() + randomInt(1, 60) * 60000);

  return {
    contactId: `C${100000 + i}`,
    direction: directions[randomInt(0, directions.length - 1)],
    callStartTime: start.toISOString(),
    callEndTime: end.toISOString(),
    customerPhone: `+91${randomInt(6000000000, 9999999999)}`,
    agentUsername: agents[randomInt(0, agents.length - 1)],
    recordingS3Uri: Math.random() > 0.5 ? `s3://recordings/${i}.mp3` : null,
    createdAt: new Date().toISOString(),
    monthKey: SINGLE_DAY.slice(0, 7),
    channel: channels[randomInt(0, channels.length - 1)],
    queueName: queues[randomInt(0, queues.length - 1)],
    systemPhone: systemPhones[randomInt(0, systemPhones.length - 1)],
  };
});

// Simulate network delay
export function fetchMockCallHistory(
  startTime: string,
  endTime: string,
  limit: number = 10,
  nextToken?: string
): Promise<CallHistoryApiResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let startIndex = 0;
      if (nextToken) {
        startIndex = parseInt(nextToken, 10);
        if (isNaN(startIndex)) startIndex = 0;
      }

      const filtered = MOCK_ITEMS.filter(
        item => item.callStartTime >= startTime && item.callStartTime <= endTime
      );

      const items = filtered.slice(startIndex, startIndex + limit);
      const newNextToken = startIndex + limit < filtered.length ? String(startIndex + limit) : null;

      resolve({
        items,
        nextToken: newNextToken,
        hasMore: newNextToken !== null,
        totalScanned: filtered.length,
      });
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  });
}
