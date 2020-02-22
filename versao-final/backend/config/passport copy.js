// const { authSecret } = require('../.env')
const dotenv = require("dotenv");
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt
dotenv.config({ path: "./config/config.env" })
// substitua authSecret por process.env.APP_AUTH_SECRET

module.exports = app => {
    const params = {
        secretOrKey: process.env.APP_AUTH_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}