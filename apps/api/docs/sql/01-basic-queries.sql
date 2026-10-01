-- ============================================================
-- 01 - BASIC SQL QUERIES
-- Gestion-Commande
-- ============================================================

-- ------------------------------------------------------------
-- 1. SELECT : récupérer tous les produits
-- ------------------------------------------------------------

SELECT *
FROM products;


-- ------------------------------------------------------------
-- 2. SELECT : récupérer uniquement certaines colonnes
-- ------------------------------------------------------------

SELECT
    id,
    name,
    sku,
    price,
    stock
FROM products;


-- ------------------------------------------------------------
-- 3. WHERE : produits dont le stock est inférieur à 20
-- ------------------------------------------------------------

SELECT
    id,
    name,
    sku,
    stock
FROM products
WHERE stock < 20;


-- ------------------------------------------------------------
-- 4. WHERE : produits dont le prix est supérieur à 500
-- ------------------------------------------------------------

SELECT
    id,
    name,
    price
FROM products
WHERE price > 500;


-- ------------------------------------------------------------
-- 5. ORDER BY : produits du moins cher au plus cher
-- ------------------------------------------------------------

SELECT
    id,
    name,
    price
FROM products
ORDER BY price ASC;


-- ------------------------------------------------------------
-- 6. ORDER BY : produits du plus cher au moins cher
-- ------------------------------------------------------------

SELECT
    id,
    name,
    price
FROM products
ORDER BY price DESC;


-- ------------------------------------------------------------
-- 7. LIMIT : afficher les 3 produits les plus chers
-- ------------------------------------------------------------

SELECT
    id,
    name,
    price
FROM products
ORDER BY price DESC
LIMIT 3;


-- ------------------------------------------------------------
-- 8. Recherche par nom
-- ------------------------------------------------------------

SELECT
    id,
    name,
    sku,
    price
FROM products
WHERE name ILIKE '%Logitech%';


-- ------------------------------------------------------------
-- 9. Plusieurs conditions avec AND
-- ------------------------------------------------------------

SELECT
    id,
    name,
    price,
    stock
FROM products
WHERE price > 300
  AND stock > 10;


-- ------------------------------------------------------------
-- 10. Produits avec stock faible
-- ------------------------------------------------------------

SELECT
    id,
    name,
    sku,
    stock
FROM products
WHERE stock <= 15
ORDER BY stock ASC;