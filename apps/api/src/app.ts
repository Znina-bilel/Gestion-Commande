import express from "express";
import { prisma } from "./lib/prisma.js";
import customerRouter from "./routes/customer.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "gestion-commande-api",
  });
});
app.get("/test-error", (_req, _res, next) => {
  next(new Error("Test error middleware"));
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/customers", customerRouter);


app.use(errorMiddleware);


export default app;
