import express from "express";
import historyRouter from "./routes/history.router";
const app = express();

import dotenv from "dotenv";
dotenv.config();

app.use("/", historyRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
