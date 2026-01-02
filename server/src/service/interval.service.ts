import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../config/dynamodb.client";
import { encodeNextToken, decodeNextToken } from "../utils/token.helper";
import { getMonthsBetween, getMonthDateRange } from "../utils/date.helper";

export default async function getRecords(
  startDate: string,
  endDate: string,
  limit: number = 10,
  nextToken: string | null = null,
  searchString?: string
) {
  try {
    const allMonths = getMonthsBetween(startDate, endDate);
    let currentMonthIndex = 0;
    let lastKey = decodeNextToken(nextToken);

    if (lastKey && lastKey.monthIndex !== undefined) {
      currentMonthIndex = lastKey.monthIndex;
      const { monthIndex, ...dynamoKey } = lastKey;
      lastKey = Object.keys(dynamoKey).length > 0 ? dynamoKey : null;
    }

    const allResults: any[] = [];
    let totalScanned = 0;
    let finalNextToken: string | null = null;
    let hasMore = false;

    for (let i = currentMonthIndex; i < allMonths.length; i++) {
      const monthKey = allMonths[i];
      if (!monthKey) continue;

      const { start: monthStartDate, end: monthEndDate } = getMonthDateRange(
        monthKey,
        startDate,
        endDate
      );

      if (monthStartDate > monthEndDate) {
        continue;
      }

      const tableName = process.env.TABLE_NAME || "call-history";
      const gsiName = "dateIndex";

      const commandParams: any = {
        TableName: tableName,
        IndexName: gsiName,
        KeyConditionExpression:
          "monthKey = :monthKey AND callStartTime BETWEEN :startTime AND :endTime",
        ExpressionAttributeValues: {
          ":monthKey": monthKey,
          ":startTime": monthStartDate,
          ":endTime": monthEndDate,
        },
        ScanIndexForward: false,
        Limit: limit - allResults.length,
        ...(lastKey &&
          i === currentMonthIndex && { ExclusiveStartKey: lastKey }),
      };

      if (searchString) {
        commandParams.FilterExpression = "contains(compositeKey, :searchString)";
        commandParams.ExpressionAttributeValues[":searchString"] = searchString;
      }

      const command = new QueryCommand(commandParams);

      console.log(
        `[DEBUG] Querying table: ${tableName}, GSI: ${gsiName}, Month: ${monthKey}`
      );
      console.log(`[DEBUG] Date range: ${monthStartDate} to ${monthEndDate}`);

      const response = await docClient.send(command);
      const items = response.Items || [];

      allResults.push(...items);
      totalScanned += response.Count || 0;

      if (response.LastEvaluatedKey) {
        hasMore = true;
        finalNextToken = encodeNextToken({
          ...response.LastEvaluatedKey,
          monthIndex: i,
        });
        break;
      } else if (allResults.length >= limit) {
        if (i + 1 < allMonths.length) {
          hasMore = true;
          finalNextToken = encodeNextToken({
            monthIndex: i + 1,
          });
        }
        break;
      }

      lastKey = null;

      if (allResults.length >= limit) {
        break;
      }
    }

    if (currentMonthIndex + 1 >= allMonths.length && !hasMore) {
      hasMore = false;
      finalNextToken = null;
    }

    return {
      items: allResults.slice(0, limit),
      nextToken: finalNextToken,
      hasMore,
      totalScanned,
      monthsQueried: allMonths.slice(
        currentMonthIndex,
        currentMonthIndex + Math.max(1, allMonths.length - currentMonthIndex)
      ),
      dateRange: {
        start: startDate,
        end: endDate,
        totalMonths: allMonths.length,
      },
    };
  } catch (error) {
    console.log("[Service] [Interval-history]" + error);
    throw error;
  }
}