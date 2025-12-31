import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../config/dynamodb.client";

export default async function getCallsByEndTime(
  limit = 10,
  lastKey = null,
  direction = null
) {
  if (direction) {
    const params: any = {
      TableName: "call-history-db",
      IndexName: "DirectionEndTimeIndex",
      KeyConditionExpression: "direction = :direction",
      ExpressionAttributeValues: {
        ":direction": direction,
      },
      ScanIndexForward: false,
      Limit: limit,
    };

    if (lastKey) {
      params.ExclusiveStartKey = lastKey;
    }

    const response = await docClient.send(new QueryCommand(params));
    return {
      items: response.Items || [],
      nextKey: response.LastEvaluatedKey || null,
    };
  } else {
    const inboundParams = {
      TableName: "call-history-db",
      IndexName: "DirectionEndTimeIndex",
      KeyConditionExpression: "direction = :direction",
      ExpressionAttributeValues: {
        ":direction": "INBOUND",
      },
      ScanIndexForward: false,
      Limit: Math.ceil(limit / 2),
    };

    const outboundParams = {
      TableName: "call-history-db",
      IndexName: "DirectionEndTimeIndex",
      KeyConditionExpression: "direction = :direction",
      ExpressionAttributeValues: {
        ":direction": "OUTBOUND",
      },
      ScanIndexForward: false,
      Limit: Math.ceil(limit / 2),
    };

    const [inboundResponse, outboundResponse] = await Promise.all([
      docClient.send(new QueryCommand(inboundParams)),
      docClient.send(new QueryCommand(outboundParams)),
    ]);

    const allItems = [
      ...(inboundResponse.Items || []),
      ...(outboundResponse.Items || []),
    ]
      .sort((a, b) => {
        return (
          new Date(b.callEndTime).getTime() - new Date(a.callEndTime).getTime()
        );
      })
      .slice(0, limit);

    return {
      items: allItems,
      nextKey: null,
    };
  }
}
