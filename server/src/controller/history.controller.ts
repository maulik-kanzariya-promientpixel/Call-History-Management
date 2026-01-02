import { Request, Response } from "express";
import getCallRecordingsWithSignedUrls from "../service/recording.service";
import getRecords from "../service/interval.service";

export async function getHistory(req: Request, res: Response) {
  try {
    const { startTime, endTime, limit = "10", nextToken, searchString } = req.query;

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
      searchString as string || undefined
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




