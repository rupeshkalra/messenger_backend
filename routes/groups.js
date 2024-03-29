const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const Group = require("../models/group.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const mongoose = require("mongoose");

const generateToken = () => {
  const randomToken = require("random-token").create("DCCEA77AFF7BB9");
  return randomToken(50);
};

router.post("/create", jsonParser, (req, res) => {
  const { user, name, email } = req.body;
  Group.findOne({ name }, (err, grp) => {
    if (err) {
      res.status(500).json("Error has occured.");
    } else if (grp) {
      res.status(400).json("Name exists");
    } else {
      const id = generateToken(25);
      const newgrp = new Group({ name, id });
      newgrp.save();
      User.findOne({ email }, (err, user) => {
        if (err) {
          console.log("some issue!");
        }

        user.communications.push(newgrp._id);
        user
          .save()
          .then(() =>
            res.status(200).json({ message: "Group created.", newgrp })
          );
      });
    }
  });
});


// router.delete("/delete", jsonParser, (req, res) => {
//   const { mail,chatid } = req.body;

//   Group.findOne({ chatid }, (err, grp) => {
//     if (err) {
//       res.status(500).json("Error has occured.");
//     } else if (!grp) {
//       res.status(400).json("Error exists");
//     } else {

//       for(let i=0;i<grp.messages.length;i++){
//         grp.messages = Message.findByIdAndDelete(grp.messages[i]._id,(err,res)=>{
//           if(err){
//             console.log(err);
//           }
//           console.log(res);
//         });
//         grp.save();
//       }
//       console.log(grp);

//       User.findOne({ email }, (err, user) => {
//         if (err) {
//           console.log("some issue!");
//         }

//         let comm = user.communications.filter((curr)=>{chatid!=curr});

//         user.communications=comm;
//         user
//           .save()
//           .then((res) =>console.log(res));
//       });

//       Group.findByIdAndDelete(chatid,(err,res)=>{
//         if(err){
//           console.log(err);
//         }
//         console.log(res);
//         res.status(200).json({message:"group deleted"});
//       });
//     }
//   });

// });

router.post("/getchatdetails", jsonParser, (req, res) => {
  const { chatid } = req.body;

  Group.findById(chatid, async (err, grp) => {
    if (err) {
      res.status(500).json("Error has occured.");
    } else if (!grp) {
      res.status(400).json("error");
    } else {
      const chatname = grp.name;
      const messageids = grp.messages;
      const userchats = [];

      for (let i = 0; i < messageids.length; i++) {
        let messages = await Message.findById({ _id: messageids[i] }).exec();
        
        userchats.push(messages);
      }
      res.status(200).json({ userchats: userchats, chatname: chatname });
    }
  });
});

router.post("/searchchat", jsonParser, (req, res) => {
    const { user,email,name } = req.body;
    
    Group.findOne({name}, async (err, grp) => {
      if (err) {
        res.status(500).json("Error has occured.");
      } else if (!grp) {
        
        res.status(200).json({ message: "working..."})

      } else {
        let dontadd=false;
        const user = await User.findOne({email}).exec();
        for(let i=0;i<user.communications.length;i++){
          if(user.communications[i]==grp._id){
            dontadd=true;
          }
        }
        if(!dontadd){
          user.communications.push(grp._id);
        }
        user.save()
        .then(() =>
          res.status(200).json({ message: "Group added.", user })
        );
      }
    });
});

router.post("/getrooms", jsonParser, (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, async (err, user) => {
    var groupnames = new Array();
    if (err) res.status(500).json("Error has occured. Please refresh page");
    else if (!user) res.status(400).json("User not found.");
    else {
      const grps = user.communications;

      for (let i = 0; i < grps.length; i++) {
        const finder = grps[i];
        let group=await Group.find({ _id: finder }).exec();
          
            const groupdata = group[0];
            groupnames.push(groupdata);
      }

      res.status(200).json({ userchats: groupnames });
    }
  });
});

module.exports = router;
