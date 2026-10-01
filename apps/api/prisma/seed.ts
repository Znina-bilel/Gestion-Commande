import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data in dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  // --------------------------------------------------
  // CUSTOMERS
  // --------------------------------------------------

  const customers = await prisma.customer.createMany({
    data: [
      {
        firstName: "Ahmed",
        lastName: "Ben Ali",
        email: "ahmed.benali@example.com",
        phone: "+216 20 111 222",
      },
      {
        firstName: "Sarra",
        lastName: "Trabelsi",
        email: "sarra.trabelsi@example.com",
        phone: "+216 21 333 444",
      },
      {
        firstName: "Mohamed",
        lastName: "Jaziri",
        email: "mohamed.jaziri@example.com",
        phone: "+216 22 555 666",
      },
      {
        firstName: "Amine",
        lastName: "Mansour",
        email: "amine.mansour@example.com",
        phone: "+216 23 777 888",
      },
    ],
  });

  console.log(`👥 ${customers.count} customers created`);

  // --------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------

  const products = await prisma.product.createMany({
    data: [
      {
        name: "Laptop Lenovo ThinkPad",
        sku: "LAP-LEN-001",
        price: new Prisma.Decimal("2800.00"),
        stock: 15,
      },
      {
        name: "Souris Logitech MX Master",
        sku: "MOU-LOG-001",
        price: new Prisma.Decimal("250.00"),
        stock: 40,
      },
      {
        name: "Clavier mécanique Keychron",
        sku: "KEY-KEY-001",
        price: new Prisma.Decimal("380.00"),
        stock: 25,
      },
      {
        name: "Écran Dell 27 pouces",
        sku: "MON-DEL-001",
        price: new Prisma.Decimal("1200.00"),
        stock: 12,
      },
      {
        name: "Casque Sony WH-1000XM5",
        sku: "CAS-SON-001",
        price: new Prisma.Decimal("950.00"),
        stock: 18,
      },
      {
        name: "Webcam Logitech C920",
        sku: "CAM-LOG-001",
        price: new Prisma.Decimal("320.00"),
        stock: 30,
      },
    ],
  });

  console.log(`📦 ${products.count} products created`);

  // Retrieve products by SKU
  const laptop = await prisma.product.findUniqueOrThrow({
    where: { sku: "LAP-LEN-001" },
  });

  const mouse = await prisma.product.findUniqueOrThrow({
    where: { sku: "MOU-LOG-001" },
  });

  const keyboard = await prisma.product.findUniqueOrThrow({
    where: { sku: "KEY-KEY-001" },
  });

  const monitor = await prisma.product.findUniqueOrThrow({
    where: { sku: "MON-DEL-001" },
  });

  const headset = await prisma.product.findUniqueOrThrow({
    where: { sku: "CAS-SON-001" },
  });

  const webcam = await prisma.product.findUniqueOrThrow({
    where: { sku: "CAM-LOG-001" },
  });

  // Retrieve customers by email
  const ahmed = await prisma.customer.findUniqueOrThrow({
    where: { email: "ahmed.benali@example.com" },
  });

  const sarra = await prisma.customer.findUniqueOrThrow({
    where: { email: "sarra.trabelsi@example.com" },
  });

  const mohamed = await prisma.customer.findUniqueOrThrow({
    where: { email: "mohamed.jaziri@example.com" },
  });

  const amine = await prisma.customer.findUniqueOrThrow({
    where: { email: "amine.mansour@example.com" },
  });

  // --------------------------------------------------
  // ORDERS
  // --------------------------------------------------

  await prisma.order.create({
    data: {
      customerId: ahmed.id,
      status: "CONFIRMED",
      total: new Prisma.Decimal("3430.00"),
      items: {
        create: [
          {
            productId: laptop.id,
            quantity: 1,
            unitPrice: laptop.price,
            subtotal: new Prisma.Decimal("2800.00"),
          },
          {
            productId: mouse.id,
            quantity: 1,
            unitPrice: mouse.price,
            subtotal: new Prisma.Decimal("250.00"),
          },
          {
            productId: keyboard.id,
            quantity: 1,
            unitPrice: keyboard.price,
            subtotal: new Prisma.Decimal("380.00"),
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customerId: sarra.id,
      status: "DELIVERED",
      total: new Prisma.Decimal("2150.00"),
      items: {
        create: [
          {
            productId: monitor.id,
            quantity: 1,
            unitPrice: monitor.price,
            subtotal: new Prisma.Decimal("1200.00"),
          },
          {
            productId: headset.id,
            quantity: 1,
            unitPrice: headset.price,
            subtotal: new Prisma.Decimal("950.00"),
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customerId: mohamed.id,
      status: "PENDING",
      total: new Prisma.Decimal("640.00"),
      items: {
        create: [
          {
            productId: webcam.id,
            quantity: 2,
            unitPrice: webcam.price,
            subtotal: new Prisma.Decimal("640.00"),
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customerId: amine.id,
      status: "CONFIRMED",
     
       total: new Prisma.Decimal("1900.00"),
      items: {
        create: [
          {
            productId: headset.id,
            quantity: 1,
            unitPrice: headset.price,
            subtotal: new Prisma.Decimal("950.00"),
          },
          {
            productId: mouse.id,
            quantity: 1,
            unitPrice: mouse.price,
            subtotal: new Prisma.Decimal("250.00"),
          },
          {
            productId: webcam.id,
            quantity: 1,
            unitPrice: webcam.price,
            subtotal: new Prisma.Decimal("320.00"),
          },
          {
            productId: keyboard.id,
            quantity: 1,
            unitPrice: keyboard.price,
            subtotal: new Prisma.Decimal("380.00"),
          },
        ],
      },
    },
  });

  console.log("🛒 4 orders created");
  console.log("✅ Database seed completed successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });