const mongoose =require("mongoose");

const categoryschema= new mongoose.Schema({
    category:{
        type:String,
        require: true,
    },
    
    status:{
        type:Boolean,
        default:false
    },
}); 

module.exports = mongoose.model("Category", categoryschema)