const couponModel = require("../models/couponModel");
const coupenModel=require("../models/couponModel");

const usermodel= require("../models/usermodel");

const loadCoupon= async(req,res)=>{
    try {
        const coupon= await coupenModel.find();
        res.render("coupon",{
            data:coupon
        })
    } catch (error) {
        console.log("coupen error",error.message);
    }
}

 const loadAddCoupon = async(req,res)=>{
    try{
        res.render("addcoupon")

    }catch(error){
        console.log("loadAddCoupon error",error.message);
    }
 }

 const postAddCoupon= async(req,res)=>{
    try {
        let coupons= couponModel({
            coupenCode: req.body.name,
            couponamounttype: req.body.coupontype,
            coupenAmount: req.body.amount,
            minCartAmt: req.body.mincart,
            
            expireyDate: req.body.date,
            limit: req.body.limit,       
 
        })
        await coupons.save();
        res.redirect("coupon") 
    } catch (error) {
        console.log("posttt add Coupon error",error.message);
    }
 }


const applyCoupon = async(req,res)=>{
    try {
        if(req.session.userData && req.session.userData._id){
            console.log('jnnnnnnnnnnnnnnnnnnnn');

            const userId = req.session.userData._id;
            const couponCode= req.body.code;
            console.log(couponCode,'kkkkkkkkkkkkk');
            const user= await usermodel.findById(userId);
            const price =req.body.amount;

            const userExist= await coupenModel.findOne({
                couponCode:couponCode,
                usedUsers:{$in:[user._id]},
                
            });
            if(userExist){
                console.log(userExist,'yyyyyyyyyyyyyyyyyyyyy');
                res.json({user:true});
            }else{
                const coupon = await coupenModel.findOne({coupenCode:couponCode});
                if(coupon){
                    if(coupon.expireyDate>= new Date()){
                        console.log(userExist,'yyyyyyyyyyyyyyyyyyyyy');
                        if(coupon.limit!=0){
                            console.log(userExist,'yyyyyyyyyyyyyyyyyyyyy');
                            if(coupon.minCartAmt<= price){
                                console.log(userExist,'yyyyyyyyyyyyyyyyyyyyy');
                                let discountedAmount= price*(coupon.coupenAmount/100);

                                if(discountedAmount>coupon.maxDiscountAmount){
                                    discountedAmount= coupon.maxDiscountAmount;
                                }

                               let discountedTotal= Math.round(price- discountedAmount)
                               let couponId = coupon._id;

                               req.session.couponId= couponId;
                               res.json({
                                couponKey: true,
                                    discountedTotal,
                                    discount: coupon.coupenAmount,
                                    couponCode,
                               })
                            }else {
                                res.json({ cartamount: true });
                            }

                        }else {
                            res.json({ limit: true });
                        }
                    } else {
                        res.json({ expire: true });
                    }
                } else {
                    res.json({ invalid: true });
                }
            }

        }
        else {
            res.redirect('/login')
        }
    } catch (error) {
       console.log("applycoupon errorrrrr",error.message); 
    }
}



 
module.exports={
    loadCoupon,
loadAddCoupon,
postAddCoupon,
applyCoupon

}