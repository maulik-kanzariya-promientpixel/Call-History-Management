import { Router } from "express";
import { getHistory, getRecording } from "../controller/history.controller";

const historyRouter = Router();

historyRouter.get("/history", getHistory);
historyRouter.get("/recording/:contactId", getRecording);

export default historyRouter;
 