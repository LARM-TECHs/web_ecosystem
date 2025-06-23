module.exports = function (err, req, res, next) {
  console.error('Error:', err.stack || err.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
};
