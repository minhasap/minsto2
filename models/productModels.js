// const { ObjectId } = require("mongodb")
const mongoose = require("mongoose")
const ObjectId= mongoose.Schema.Types.ObjectId
const productschema = new mongoose.Schema({
    productname:{
        type:String,
    },
    brand:{
        type:String,
    },price:{
        type:Number,

    
        
    },description:{
        type:String,
        
    },quantity:{
        type:Number,
       
        
    },category:{
        type:ObjectId,
        ref:"Category"
        
    },    status: {
        type: Boolean,
        default: false,
    },
       image:{
        type:Array,
    }


})



module.exports =mongoose.model('products',productschema)