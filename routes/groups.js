const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Group = require('../models/group.model');
const User = require('../models/user.model');
const mongoose =require('mongoose');



const generateToken = () => {
    const randomToken = require('random-token').create('DCCEA77AFF7BB9');
    return randomToken(50);
}

router.post('/create', jsonParser, (req, res) => {
    const {user, name,email} = req.body;
    Group.findOne({name}, (err, grp) => {
        if(err){res.status(500).json("Error has occured.")}
        else if(grp)
        {res.status(400).json("Name exists")}
        else{         
                const id = generateToken(25);
                const newgrp = new Group({name,id});
                newgrp.save();
                User.findOne({email},(err,user)=>{
                    if(err){
                        console.log("some issue!");
                    }

                    user.communications.push(newgrp._id);
                    user.save()
                    .then(() => res.status(200).json({message: "Group created.", newgrp}))
                });
        }
    })
})

router.post('/getrooms', jsonParser, (req, res) => {
    const {email} = req.body;
    console.log(email);
    User.findOne({email}, (err, user) => {
        if(err) res.status(500).json("Error has occured. Please refresh page")
        else if(!user) res.status(400).json("User not found.")
        else{
                const grps=user.communications;
                const groupnames=[];
                for(let i=0;i<grps.length;i++){
                    Group.findById(grps[i],(err,grp)=>{
                        if(err){
                            console.log(err);
                        }
                        groupname=grp.name;
                        groupnames.push(groupname);
                    })
                }
                res.status(200).json({userchats:groupnames});
            }
        })
})


module.exports = router;