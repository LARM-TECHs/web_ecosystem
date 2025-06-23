const authenticateUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];
  const userRole = req.headers['x-user-role'];

  if (!userId || !userEmail || !userRole) {
    console.warn('Auth Middleware: Faltan headers de autenticación.');
    return res.status(401).json({ message: 'No autorizado. Encabezados de usuario faltantes.' });
  }

  req.user = {
    id: userId,
    email: userEmail,
    role: userRole
  };

  next();
};

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Acceso denegado: Información del rol no disponible.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`Auth Middleware: Usuario con rol '${req.user.role}' intentó acceder sin permisos.`);
      return res.status(403).json({ message: 'Acceso denegado: Permisos insuficientes.' });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles
};
