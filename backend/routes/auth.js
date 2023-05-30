const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');



router.post('/createuser', [
    body('name','enter a valid name').isLength({ min: 3 }),
    body('email','enter a valid mail').isEmail(),
    body('password',"password must be atleast 5 character long").isLength({ min: 5 })
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    
    let user= await User.findOne({email:req.body.email})
    if(user){
        res.status(400).json({email:"Email already exist"})
    }
    user= await User.create({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email
    })
    res.json({"Hello":1})
})

module.exports = router