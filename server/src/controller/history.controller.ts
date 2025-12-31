import { Request, Response } from "express";
import getCallsByEndTime from "../service/history.service";

export async function getHistory(req: Request, res: Response) {
  try {
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
