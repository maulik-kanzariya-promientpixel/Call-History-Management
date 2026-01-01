import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import docClient from "../config/dynamodb.client";
import s3Client from "../config/s3.client";

export default async function getCallRecordingsWithSignedUrls(
  contactId: string
) {
  try {
    const params = {
      TableName: "call-history",
      KeyConditionExpression: "contactId = :contactId",
      ExpressionAttributeValues: {
        ":contactId": contactId,
      },
      Limit: 1,
    };

    const response = await docClient.send(new QueryCommand(params));

    if (!response.Items || response.Items.length === 0) {
      console.log("No items found for contactId:", contactId);
      return null;
    }

    const item = response.Items[0];

    if (!item) {
      return null;
    }

    if (!item.recordingS3Uri) {
      console.log("No recordingS3Uri found in item");
      return null;
    }

    let bucket, key;

    if (item.recordingS3Uri.startsWith("s3://")) {
      const s3Match = item.recordingS3Uri.match(/s3:\/\/([^\/]+)\/(.+)/);
      if (s3Match) {
        [, bucket, key] = s3Match;
      }
    } else if (item.recordingS3Uri.startsWith("https://")) {
      const httpsMatch = item.recordingS3Uri.match(
        /https:\/\/([^.]+)\.s3\.([^.]+\.)?amazonaws\.com\/(.+)/
      );
      if (httpsMatch) {
        [, bucket, , key] = httpsMatch;
      }
    } else if (item.recordingS3Uri.includes("/")) {
      const parts = item.recordingS3Uri.split("/");
      bucket = parts[0];
      key = parts.slice(1).join("/");
    } else {
      throw new Error(`Invalid S3 URL format: ${item.recordingS3Uri}`);
    }

    if (!bucket || !key) {
      throw new Error(
        `Could not parse bucket and key from: ${item.recordingS3Uri}`
      );
    }

    key = decodeURIComponent(key);

    console.log("Found recording - Bucket:", bucket, "Key:", key);

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log("URL : ", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error in getCallRecordingsWithSignedUrls:", error);
    throw error;
  }
}
