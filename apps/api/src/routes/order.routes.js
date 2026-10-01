const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        orderDate: "desc",
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
    });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Commande introuvable",
      });
    }

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération de la commande",
    });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      status,
      items,
    } = req.body;

    // Vérification du client
    if (!customerId) {
      return res.status(400).json({
        message: "customerId est obligatoire",
      });
    }

    // Vérification des produits
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "La commande doit contenir au moins un produit",
      });
    }

    // Vérifier que le client existe
    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(customerId),
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Client introuvable",
      });
    }

    // Transaction Prisma
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;

      const orderItemsData = [];

      for (const item of items) {
        const productId = Number(item.productId);
        const quantity = Number(item.quantity);

        // Vérification de la quantité
        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error(
            "La quantité doit être un entier supérieur à 0"
          );
        }

        // Récupérer le produit
        const product = await tx.product.findUnique({
          where: {
            id: productId,
          },
        });

        // Produit inexistant
        if (!product) {
          throw new Error(
            `Produit ${productId} introuvable`
          );
        }

        // Vérifier le stock
        if (product.stock < quantity) {
          throw new Error(
            `Stock insuffisant pour le produit "${product.name}". Stock disponible : ${product.stock}`
          );
        }

        const unitPrice = Number(product.price);

        // Calcul du total
        total += unitPrice * quantity;

        // Préparer OrderItem
        orderItemsData.push({
          productId: product.id,
          quantity,
          unitPrice,
        });

        // Diminuer le stock
        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });
      }

      // Créer la commande
      return await tx.order.create({
        data: {
          customerId: Number(customerId),
          status: status || "PENDING",
          total,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    res.status(201).json(order);

  } catch (error) {
    console.error(error);

    res.status(400).json({
      message:
        error.message ||
        "Erreur lors de la création de la commande",
    });
  }
});

// PUT /api/orders/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Statut de commande invalide",
      });
    }

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Commande introuvable",
      });
    }

    res.status(500).json({
      message: "Erreur lors de la modification de la commande",
    });
  }
});

// DELETE /api/orders/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.order.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Commande supprimée avec succès",
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Commande introuvable",
      });
    }

    res.status(500).json({
      message: "Erreur lors de la suppression de la commande",
    });
  }
});

module.exports = router;