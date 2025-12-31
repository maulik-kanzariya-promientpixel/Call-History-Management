import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let client;

if (process.env.NODE_ENV == "dev") {
  console.log("{local creds}");
  client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      sessionToken: process.env.AWS_SESSION_TOKEN!,
    },
  });
} else {
  client = new DynamoDBClient();
}

const docClient = DynamoDBDocumentClient.from(client);

export default docClient;
