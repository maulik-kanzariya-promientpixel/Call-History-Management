import { Router } from "express";
import {
  getHistory,
  getRecording,
  streamFileData,
} from "../controller/history.controller";

const historyRouter = Router();

historyRouter.get("/history", getHistory);
historyRouter.get("/recording/:contactId", getRecording);
historyRouter.get("/export", streamFileData);

export default historyRouter;
