const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId , ref:'User',
      required: true
    },
    sendername:{
      type:String,
      required:true
    },
    message: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
