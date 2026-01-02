import { Request, Response } from "express";
import getCallRecordingsWithSignedUrls from "../service/recording.service";
import getRecords from "../service/interval.service";

export async function getHistory(req: Request, res: Response) {
  try {
    const {
      startTime,
      endTime,
      limit = "10",
      nextToken,
      searchString,
    } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "startTime and endTime are required parameters",
      });
    }

    const parsedLimit = parseInt(limit as string, 10) || 10;

    const history = await getRecords(
      startTime as string,
      endTime as string,
      parsedLimit,
      (nextToken as string) || null,
      (searchString as string) || undefined
    );

    res.status(200).json(history);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid pagination token"
    ) {
      return res.status(400).json({
        message: "Invalid pagination token",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
}

export async function getRecording(req: Request, res: Response) {
  try {
    const { contactId } = req.params;

    if (!contactId) {
      return res.status(400).json({
        message: "Contact Id Not Found",
      });
    }

    const url = await getCallRecordingsWithSignedUrls(contactId);

    if (!url) {
      return res.status(404).json({
        message: "Recording not found for this contact",
      });
    }

    res.status(200).json({
      signedUrl: url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
}

export async function streamFileData(req: Request, res: Response) {
  try {
    const { startTime, endTime, searchString } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "startTime and endTime are required parameters",
      });
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="call-history.csv"'
    );
    res.setHeader("Transfer-Encoding", "chunked");

    const csvHeader =
      "contactId,callStartTime,callEndTime,customerPhone,agentUsername,direction,recordingS3Uri,createdAt,monthKey\n";
    res.write(csvHeader);

    let nextToken: string | null = null;
    let totalRecords = 0;
    const batchSize = 100;

    do {
      try {
        const batch = await getRecords(
          startTime as string,
          endTime as string,
          batchSize,
          nextToken,
          searchString as string
        );

        for (const item of batch.items) {
          const csvRow =
            [
              item.contactId || "",
              item.callStartTime || "",
              item.callEndTime || "",
              item.customerPhone || "",
              item.agentUsername || "",
              item.direction || "",
              item.recordingS3Uri || "",
              item.createdAt || "",
              item.monthKey || "",
            ]
              .map((field) => {
                if (
                  typeof field === "string" &&
                  (field.includes(",") ||
                    field.includes('"') ||
                    field.includes("\n"))
                ) {
                  return `"${field.replace(/"/g, '""')}"`;
                }
                return field;
              })
              .join(",") + "\n";

          res.write(csvRow);
        }

        totalRecords += batch.items.length;
        nextToken = batch.nextToken;

        console.log(
          `[DEBUG] Streamed ${batch.items.length} records, total: ${totalRecords}`
        );

        if (batch.hasMore) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      } catch (batchError) {
        console.error("[ERROR] Error processing batch:", batchError);
        res.write(`# Error processing batch: ${batchError}\n`);
        break;
      }
    } while (nextToken);

    res.write(`# Total records exported: ${totalRecords}\n`);
    res.write(`# Export completed at: ${new Date().toISOString()}\n`);

    res.end();
    console.log(`[INFO] CSV export completed. Total records: ${totalRecords}`);
  } catch (error) {
    console.error("[ERROR] CSV streaming error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal Server Error during CSV export",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } else {
      res.write(
        `# Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      );
      res.end();
    }
  }
}
