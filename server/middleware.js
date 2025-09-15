const jwt = require('jsonwebtoken');
const { APIError } = require('./utils');
const { getTenantDbConnection } = require('./database');
const { Tenant } = require('./database');

const userAuth = (req, res, next) => {
    try {

        // const token = req.signedCookies.token;
        const authHeader = req.headers.authorization;
        
        if(authHeader){

            const token = authHeader.split(' ')[1];
            if (!token) throw new APIError(401, "UNAUTHORIZED, Please login");
            
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
                if(err){
                    throw new APIError(401, "UNAUTHORIZED, Please login");
                }
                req.user = user;
                console.log("in userAuth req.user: ", req.user);
                console.log("authorized successfully");
                next();
            });
    
            // if (user._id/** validate user JWT with JoiSchema */) {
            //     req.user = user;
            // } else {
            // }
    
            // return next();
        } else {
            throw new APIError(401, "UNAUTHORIZED, Please login");
        }


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
        const {plan} = await Tenant.findOne({ slug: tenant.trim().toLowerCase() }).select('plan -_id');
        console.log("in validateSubscription plan: ", plan);

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