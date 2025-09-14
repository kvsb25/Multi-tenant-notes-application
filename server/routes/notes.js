const router = require('express').Router();
const { validateSubscription } = require('../middleware');
const { APIError } = require('../utils');

router.route('/')
    .get(async (req, res) => {

        // const notes = await req.db.model('note').find({});
        const notes = await req.model.find({});

        if (Array.from(notes).length == 0) {
            return res.sendStatus(204);
        }

        return res.status(200).send(notes);
    })
    .post(validateSubscription, async (req, res) => {

        const { title, content } = req.body

        // const newNote = new req.db.model('note')({ title, content });
        const newNote = new req.model({ title, content });
        await newNote.save();

        return res.status(200).send(newNote);
    })

router.route('/:id')
    .get(async (req, res) => {
        try {

            const { id } = req.params;
            const note = await req.db.model('note').findById(id);

            if (Array.from(note).length == 0) {
                return res.sendStatus(204);
            }

            return res.status(200).send(note);

        } catch (err) {
            throw err;
        }
    })
    .put(async (req, res)=>{
        try{

            const {id} = req.params;
            const {title, content} = req.body;

            const update = {}
            
            if(title) update["title"] = title;
            if(content) update["content"] = content;
            update["updatedAt"] = Date.now();

            const newNote = await req.model.findByIdAndUpdate(id, update);

            res.status(200).send(newNote);

        } catch (err) {
            throw err;
        }
    })

module.exports = router;