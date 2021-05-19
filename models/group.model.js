const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    id:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    messages:{
        type:Array,
        required:false
    }
}, {
    timestamps: true
})

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group