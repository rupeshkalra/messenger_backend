const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('../models/user.model');
const mongoose =require('mongoose');



const generateToken = () => {
    const randomToken = require('random-token').create('DCCEA77AFF7BB9');
    return randomToken(50);
}

router.post('/register', jsonParser, (req, res) => {
    const {name, password, email} = req.body;
    User.findOne({email}, (err, user) => {
        if(err) res.status(500).json("Error has occured. Please refresh page")
        else if(user) res.status(400).json("Email has been taken.")
        else{
                const token = generateToken();
                const newUser = new User({name, password, email, token});
                newUser.save()
                .then(() => {
                    res.status(200).json({"Message": "Success", token,newUser});
                })
                .catch(err => res.status(500).json(err));
            }
        })
    
})

router.post('/login', jsonParser, (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if(err){res.status(500).json("Error has occured.")}
        else if(!user)
        {res.status(400).json("User not found")}
        else{
                if(user.password!=password)
                {res.status(400).json("Wrong Password.")}
                else if(user.password==password){
                    const token = generateToken();
                    user.token = token;        
                    user.save();
                    res.status(200).json({"message": "Success", token,user});
                }
        }
    })
})


module.exports = router;