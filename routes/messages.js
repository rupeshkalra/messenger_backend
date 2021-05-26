const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const User = require("../models/user.model");
const Message = require("../models/message.model");
const Group = require("../models/group.model");

require("dotenv").config();


router.post("/create", jsonParser, async (req, res) => {
  const { sender, sendername,message, chatid } = req.body;
    
  const newmsg = new Message({ sender, message,sendername });
  newmsg.save();
  await Group.findById({"_id" :chatid}, (err, grp) => {
    if (err) {
      console.log(err);
    }
    const msgid = newmsg._id;
    grp.messages.push(msgid);
    
    grp.save().then(() =>
        res.status(200).json({ message: "Message sent.", newmsg })
    );  
  });
  
});

module.exports = router;
