const { Tenant } = require('../database');
const { DBError } = require('../utils');

const router = require('express').Router();

router.route('/:slug/upgrade')
    .post(async (req, res) => {
        try {

            const { slug } = req.params;
            console.log("slug: ", slug);
            const update = await Tenant.findOneAndUpdate({ slug }, { plan: "pro" });

            if (!update) {
                throw new DBError("tenant", "plan update unsuccessfull");
            }

            res.sendStatus(200);

        } catch (err) {

            throw err
        }
    })

router.route('/:slug/invite')
    .get((req, res)=>{
        res.sendStatus(200);
    })

module.exports = router;