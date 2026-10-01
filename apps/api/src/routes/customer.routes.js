const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// GET /api/customers
router.get("/", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération des clients",
    });
  }
});

// GET /api/customers/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
      include: {
        orders: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Client introuvable",
      });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération du client",
    });
  }
});

// POST /api/customers
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "firstName, lastName et email sont obligatoires",
      });
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Cette adresse email existe déjà",
      });
    }

    res.status(500).json({
      message: "Erreur lors de la création du client",
    });
  }
});

// PUT /api/customers/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "firstName, lastName et email sont obligatoires",
      });
    }

    const customer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    res.json(customer);
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Client introuvable",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Cette adresse email existe déjà",
      });
    }

    res.status(500).json({
      message: "Erreur lors de la modification du client",
    });
  }
});

// DELETE /api/customers/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.customer.delete({
      where: {
        id: id,
      },
    });

    res.json({
      message: "Client supprimé avec succès",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Client introuvable",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        message: "Impossible de supprimer ce client car il possède des commandes",
      });
    }

    res.status(500).json({
      message: "Erreur lors de la suppression du client",
    });
  }
});

module.exports = router;