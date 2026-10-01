const express = require("express");
const cors = require("cors");

const prisma = require("./prisma");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Gestion Commande API",
    status: "OK"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "UP",
      database: "Connected"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "DOWN",
      database: "Disconnected"
    });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});