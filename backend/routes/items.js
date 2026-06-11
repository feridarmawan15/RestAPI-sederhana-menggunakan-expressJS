const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true // Join dengan tabel Category
      }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// POST /api/items
router.post('/', async (req, res) => {
  try {
    const { name, quantity, price, categoryId } = req.body;
    
    if (!name || !categoryId) {
      return res.status(400).json({ message: 'Nama barang dan ID Kategori wajib diisi.' });
    }

    const item = await prisma.item.create({
      data: {
        name,
        quantity: quantity || 0,
        price: price || 0,
        categoryId: parseInt(categoryId)
      }
    });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, price, categoryId } = req.body;

    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        name,
        quantity: quantity !== undefined ? parseInt(quantity) : undefined,
        price: price !== undefined ? parseInt(price) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan atau barang tidak ditemukan.' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Barang berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus barang.' });
  }
});

module.exports = router;
