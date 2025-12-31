import { Request, Response } from "express";
import getCallsByEndTime from "../service/history.service";
import getCallRecordingsWithSignedUrls from "../service/recording.service";

export async function getHistory(req: Request, res: Response) {
  try {
    console.log("GOTCHA");
    const { limit = "10", lastKey } = req.query;

    const parsedLimit = parseInt(limit as string, 10) || 10;
    const parsedLastKey = lastKey ? JSON.parse(lastKey as string) : null;

    const history = await getCallsByEndTime(parsedLimit, parsedLastKey);

    res.status(200).json(history);
  } catch (error) {
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
