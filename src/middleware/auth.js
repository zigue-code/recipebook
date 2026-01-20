const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Récupérer le token du header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    
    req.user = user; // Ajouter l'utilisateur à la requête
    next();
  });
};

module.exports = authenticateToken;
