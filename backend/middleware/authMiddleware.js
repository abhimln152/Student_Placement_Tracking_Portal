const passport = require('passport');

const verifyToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal Server Error during Authentication' });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid or expired token'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = verifyToken;
