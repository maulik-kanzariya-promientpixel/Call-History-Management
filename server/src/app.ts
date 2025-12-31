import express from "express";
import historyRouter from "./routes/history.router";
import cors from "cors";

const app = express();

app.use(cors());

app.use("/", historyRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});
