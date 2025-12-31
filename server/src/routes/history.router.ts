import { Router } from "express";
import { getHistory } from "../controller/history.controller";

const historyRouter = Router();

historyRouter.get("/history", getHistory);

export default historyRouter;
