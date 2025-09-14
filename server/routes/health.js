const router = require('express').Router();

router.route('/')
    .get((req, res)=>{
        console.log('health route hit. STATUS: OK')
        return res.status(200).send('OK');
    })

module.exports = router;