import app from "./app";
import { PORT } from "./config/env";
import prisma from "./config/db";

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
  console.log(`Backend running on http://localhost:${PORT}`);
});
