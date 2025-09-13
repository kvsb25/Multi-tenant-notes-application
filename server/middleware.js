const jwt = require('jsonwebtoken');
const { APIError } = require('./utils');

const userAuth = (req, res, next) => {
    try {

        const token = req.signedCookies.token;
        if (!token) throw new APIError(401, "UNAUTHORIZED, Please login");

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (user._id/** validate user JWT with JoiSchema */) {
            req.user = user;
        } else {
            throw new APIError(401, "UNAUTHORIZED, Please login");
        }

        return next();

    } catch (err) {

        if (err instanceof APIError) {
            next(err);
        }
    }
}

const verifyRole = (role) => {
    return (req, res, next) => {

        try {

            if (req.user.role != role) {
                throw new APIError(403, `FORBIDDEN, Only ${role} have access`);
            }
            next()

        } catch (err) {
            if (err instanceof APIError) {
                next(err);
            }
        }
    }
}

module.exports = {
    userAuth, 
    verifyRole
}