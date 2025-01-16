const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            return next();
        }
        res.status(403).send('Akses ditolak');
    };
};

module.exports = authorizeRole;