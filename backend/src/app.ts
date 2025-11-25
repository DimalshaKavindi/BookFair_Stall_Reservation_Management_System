import cors from "cors";
import express from "express";
import helmet from "helmet";
import { CLIENT_ORIGIN } from "./config/env";
import { errorHandler, notFound } from "./middleware/error";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", 'PATCH'],
    allowedHeaders: ["Content-Type", "Authorization"],
   
  })
);
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));




app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;