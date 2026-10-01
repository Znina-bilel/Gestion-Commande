const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed...");

  // Nettoyage des anciennes données
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  // =========================
  // CUSTOMERS
  // =========================

  const customer1 = await prisma.customer.create({
    data: {
      firstName: "Bilel",
      lastName: "Znina",
      email: "bilel@example.com",
      phone: "+21620111111"
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      firstName: "Ahmed",
      lastName: "Ben Ali",
      email: "ahmed@example.com",
      phone: "+21620222222"
    }
  });

  const customer3 = await prisma.customer.create({
    data: {
      firstName: "Sarra",
      lastName: "Trabelsi",
      email: "sarra@example.com",
      phone: "+21620333333"
    }
  });

  // =========================
  // PRODUCTS
  // =========================

  const product1 = await prisma.product.create({
    data: {
      name: "Laptop Lenovo",
      description: "Laptop professionnel Lenovo",
      price: 2499.99,
      stock: 10
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Souris Logitech",
      description: "Souris sans fil Logitech",
      price: 89.90,
      stock: 50
    }
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Clavier mécanique",
      description: "Clavier mécanique RGB",
      price: 179.90,
      stock: 25
    }
  });

  const product4 = await prisma.product.create({
    data: {
      name: "Écran Samsung",
      description: "Écran 24 pouces Full HD",
      price: 699.00,
      stock: 15
    }
  });

  // =========================
  // ORDER 1
  // =========================

  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: "CONFIRMED",
      total: 2669.89,
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: product1.price
          },
          {
            productId: product2.id,
            quantity: 1,
            unitPrice: product2.price
          },
          {
            productId: product3.id,
            quantity: 1,
            unitPrice: product3.price
          }
        ]
      }
    }
  });

  // =========================
  // ORDER 2
  // =========================

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      status: "PENDING",
      total: 1398.00,
      orderItems: {
        create: [
          {
            productId: product4.id,
            quantity: 2,
            unitPrice: product4.price
          }
        ]
      }
    }
  });

  // =========================
  // ORDER 3
  // =========================

  const order3 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: "DELIVERED",
      total: 269.70,
      orderItems: {
        create: [
          {
            productId: product2.id,
            quantity: 3,
            unitPrice: product2.price
          }
        ]
      }
    }
  });

  console.log("✅ Customers créés :", 3);
  console.log("✅ Products créés :", 4);
  console.log("✅ Orders créées :", 3);
  console.log("🌱 Seed terminé !");
}

main()
  .catch((error) => {
    console.error("❌ Erreur pendant le seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });