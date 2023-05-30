const express = require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    const obj = {
        a:"hello",
        b:1 
    }
    res.json(obj);
})

module.exports = router