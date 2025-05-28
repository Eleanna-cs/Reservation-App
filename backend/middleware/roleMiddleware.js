const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    console.log('Checking role:', req.user.role, 'against allowed:', roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = roleMiddleware;
