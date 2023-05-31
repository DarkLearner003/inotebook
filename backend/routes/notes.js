const express = require('express');
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


router.get('/fetchalluser', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes);

    } catch (err) {
        res.status(500).send("Some error occured");
    }
})

router.post('/addnotes', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', "description must be atleast 5 character long").isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednotes = await note.save()
        res.json(savednotes);
    } catch (err) {
        res.status(500).send("Some error occured");
    }
})

router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

        const newNotes = {};
        if (title) { newNotes.title = title; }
        if (description) { newNotes.description = description; }
        if (tag) { newNotes.tag = tag; }

        let notes = await Notes.findById(req.params.id)
        if (!notes) { return res.status(404).send("Not found") }
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNotes }, { new: true });
        res.json({ notes });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {
        let notes = await Notes.findById(req.params.id)
        if (!notes) { return res.status(404).send("Not found") }
        if (notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        notes = await Notes.findByIdAndDelete(req.params.id);
        res.json({"success":"Dleted successfully",notes:notes});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router