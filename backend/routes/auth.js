const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = 'Harryisagoodb$oy';


router.post('/createuser', [
    body('name','enter a valid name').isLength({ min: 3 }),
    body('email','enter a valid mail').isEmail(),
    body('password',"password must be atleast 5 character long").isLength({ min: 5 })
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
try{
    let salt= await bcrypt.genSalt(10);
    const secPas=await bcrypt.hash(req.body.password,salt);;
    let user= await User.findOne({email:req.body.email})
    if(user){
        res.status(400).json({email:"Email already exist"})
    }
    user= await User.create({
        name:req.body.name,
        password:secPas,
        email:req.body.email
    })

    const data={
        user:{
            id:user.id
        }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    res.json({authToken})
}catch(err){
    res.status(500).send("Some error occured");
}
})

router.post('/login', [
    body('email','enter a valid mail').isEmail(),
    body('password',"password cant be blank").exists()
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    const {email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please login with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            let success=false;
            return res.status(400).json({success,error:"Please login with correct credentials"})
        }
        const data={
            user:{
                id:user.id
            }
        }
        let success=true;
        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({success,authToken})
    }catch(err){
        res.status(500).send("Some error occured");
    }
    
})

router.post('/getuser',fetchuser,async (req, res) => {
    try {
        let userId=req.user.id;
        let user=await User.findById(userId).select("-password");
        res.send(user);
    }catch(err){
        res.status(500).send("Some error occured");
    }
    
})

module.exports = router