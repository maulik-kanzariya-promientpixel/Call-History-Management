import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import docClient from "../config/dynamodb.client";
import s3Client from "../config/s3.client";

export default async function getCallRecordingsWithSignedUrls(
  contactId: string
) {
  const params = {
    TableName: "CallHistory",
    KeyConditionExpression: "contactId = :contactId",
    ExpressionAttributeValues: {
      ":contactId": contactId,
    },
    Limit: 1,
  };

  const response = await docClient.send(new QueryCommand(params));

  if (!response.Items || response.Items.length === 0) {
    return null;
  }

  const item = response.Items[0];

  if (!item) {
    return null;
  }

  if (!item.recordingUrl) {
    return null;
  }

  const s3UrlMatch =
    item.recordingUrl.match(/s3:\/\/([^\/]+)\/(.+)/) ||
    item.recordingUrl.match(/https:\/\/([^.]+)\.s3\.amazonaws\.com\/(.+)/);

  if (!s3UrlMatch) {
    throw new Error(`Invalid S3 URL format: ${item.recordingUrl}`);
  }

  const [, bucket, key] = s3UrlMatch;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return signedUrl;
}
