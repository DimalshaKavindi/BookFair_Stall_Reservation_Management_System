import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/error";
import { CLIENT_ORIGIN } from "./config/env";
import rateLimit from 'express-rate-limit';

const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
