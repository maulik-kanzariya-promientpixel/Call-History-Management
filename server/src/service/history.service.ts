import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../config/dynamodb.client";

export default async function getCallsByEndTime(limit = 10, lastKey = null) {
  const params: any = {
    TableName: "call-history-db",
    IndexName: "endTime",
    Limit: limit,
    ScanIndexForward: false,
  };

  if (lastKey) {
    params.ExclusiveStartKey = lastKey;
  }

  const response = await docClient.send(new ScanCommand(params));

  return {
    items: response.Items,
    nextKey: response.LastEvaluatedKey || null,
  };
}
