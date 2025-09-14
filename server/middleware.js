const jwt = require('jsonwebtoken');
const { APIError } = require('./utils');
const { getTenantDbConnection } = require('./database');
const { Tenant } = require('./database');

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

        next(err);
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

            next(err);
        }
    }
}

const setTenantDbConnection = async (req, res, next) => {
    try {

        const { tenant } = req.user;
        req.db = await getTenantDbConnection(tenant.trim().toLowerCase());
        next();

    } catch (err) {

        next(err);
    }
}

const validateSubscription = async (req, res, next) => {
    try {
        
        const { tenant } = req.user;
        const plan = await Tenant.find({ slug: tenant.trim().toLowerCase() }).select('plan');
        const num = await req.db.model('note').countDocuments({});
        if (plan != 'pro' && num >= 3) {
            return res.status(403).send("Free Plan limit reached. Upgrade to Pro to create more notes");
        }
        next()

    } catch (err) {

        next(err);
    }
}

module.exports = {
    userAuth,
    verifyRole,
    setTenantDbConnection,
    validateSubscription
}