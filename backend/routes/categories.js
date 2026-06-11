const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/auth');

// Gunakan middleware autentikasi untuk semua route di bawah ini
router.use(authenticateToken);

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });

    const category = await prisma.category.create({
      data: { name, description }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan atau kategori tidak ditemukan.' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Hapus juga semua item yang terkait dengan kategori ini (Optional, tergantung business logic)
    // Di sini kita biarkan error jika masih ada item yang terkait, atau kita bisa hapus:
    // await prisma.item.deleteMany({ where: { categoryId: parseInt(id) } });

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus kategori. Pastikan tidak ada barang di kategori ini.' });
  }
});

module.exports = router;
