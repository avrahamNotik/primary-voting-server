import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api", routes);

export default app;
