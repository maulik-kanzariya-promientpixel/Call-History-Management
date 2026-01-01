export function encodeNextToken(lastEvaluatedKey: any): string | null {
  if (!lastEvaluatedKey) return null;
  return Buffer.from(JSON.stringify(lastEvaluatedKey)).toString("base64");
}

export function decodeNextToken(token: string | null): any {
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch (error) {
    throw new Error("Invalid pagination token");
  }
}