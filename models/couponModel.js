const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const couponSchema = mongoose.Schema({
   valid_from: {
    type: Date,
    default: new Date(),
    required: true,
  },
  expireyDate: {
    type: Date,
    required: true,
  },
  coupenCode: {
    type: String,
    required: true,
  },
  coupenCode: {
    type: String,
    required: true,
  },
  coupenAmount: {
    type: Number,
    required: true,
  },
  usedUsers: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
  minCartAmt: {
    type: Number,
    required: true,
  },
 
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
    default: 10,
  },

})

module.exports= mongoose.model('coupon',couponSchema)