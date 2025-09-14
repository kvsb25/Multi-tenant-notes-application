const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Tenant, getTenantDbConnection } = require('../database');
const { APIError } = require('../utils');

router.route('/signup')
    .get((req, res) => {

    })
    .post(async (req, res) => {

        try {

            let { email, password, tenant, role } = req.body;

            if (!email) {
                throw new APIError(400, "No Email sent");
            }

            if (!tenant) {
                tenant = email.split('@')[1].split(".")[0];
            }
            if (!role) {
                role = (email.split('@')[0] == 'user') ? 'member' : 'admin';
            }

            password = await bcrypt.hash(password, 10);

            const conn = await getTenantDbConnection(tenant.trim().toLowerCase());
            const newUser = new conn.model('user')({ email, password, role });
            await newUser.save();

            const payload = {
                _id: foundUser._id.toString(),
                email: foundUser.email,
                tenant: tenant,
                role: foundUser.role
            }

            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

            res.cookie('token', accessToken, {
                signed: true,
                httpOnly: true,
                // secure: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000,
                // sameSite: 'Strict'
            });

            return res.status(200).send({
                token: accessToken,
                user: payload
            });

        } catch (err) {

            throw err;
        }
    })

router.route('/login')
    .get((req, res) => {

    })
    .post(async (req, res) => {

        try {

            let { email, password, tenant } = req.body;

            if (!email) {
                throw new APIError(400, "No Email sent");
            }

            if (!tenant) {
                tenant = email.split('@')[1].split(".")[0];
            }
            if (!role) {
                role = (email.split('@')[0] == 'user') ? 'member' : 'admin';
            }

            const conn = await getTenantDbConnection(tenant.trim().toLowerCase())
            let foundUser = await conn.model('user').find({ email });

            if (!foundUser) {
                throw new APIError(400, "Incorrect email");
            }

            if (await bcrypt.compare(password, foundUser.password)) {

                const payload = {
                    _id: foundUser._id.toString(),
                    email: foundUser.email,
                    role: foundUser.role
                }

                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

                res.cookie('token', accessToken, {
                    signed: true,
                    httpOnly: true,
                    // secure: true, 
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    // sameSite: 'Strict'
                });

                return res.status(200).send({
                    token: accessToken,
                    user: payload
                });

            } else {
                return res.status(401).send("Incorrect password");
            };

        } catch (err) {
            throw err;
        }
    })

module.exports = router;