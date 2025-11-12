import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
// import { errorHandler, notFound } from "./middleware/error";
import { CLIENT_ORIGIN } from "./config/env";


const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", routes);

// app.use(notFound);
// app.use(errorHandler);

export default app;
