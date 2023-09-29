const user = require ("../models/usermodel")

const isBlocked = async (req,res,next)=>{
    const userData = await user.findOne({email:req.body.email})
    if(userData?.status ==true){
        res.render("login",{message:"your account has been blocked"})
    }else{
        next()
    }
}

module.exports = isBlocked;