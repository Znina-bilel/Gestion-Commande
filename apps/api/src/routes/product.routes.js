const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération des produits",
    });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        orderItems: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération du produit",
    });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Le nom et le prix sont obligatoires",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: stock !== undefined ? Number(stock) : 0,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la création du produit",
    });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      description,
      price,
      stock,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Le nom et le prix sont obligatoires",
      });
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        price: Number(price),
        stock: stock !== undefined ? Number(stock) : 0,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    res.status(500).json({
      message: "Erreur lors de la modification du produit",
    });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "Produit supprimé avec succès",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Produit introuvable",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        message: "Impossible de supprimer ce produit car il est utilisé dans une commande",
      });
    }

    res.status(500).json({
      message: "Erreur lors de la suppression du produit",
    });
  }
});

module.exports = router;