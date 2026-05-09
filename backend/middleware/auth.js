const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const internalKey = process.env.INTERNAL_API_KEY;

  if (!apiKey || apiKey !== internalKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }

  next();
};

module.exports = authMiddleware;
