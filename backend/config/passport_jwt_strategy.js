const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret' // Fallback for dev, but strictly use env in prod
};

passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.log('Error in finding user from JWT');
        return done(err, false);
    }
}));

module.exports = passport;
