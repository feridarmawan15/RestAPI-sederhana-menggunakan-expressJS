const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token is usually in the format: Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_super_aman', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
