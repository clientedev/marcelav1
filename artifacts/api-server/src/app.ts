/// <reference types="node" />
import path from "path";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const publicPath = path.resolve(process.cwd(), "artifacts/alunos-dashboard/dist/public");
app.use(express.static(publicPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;
