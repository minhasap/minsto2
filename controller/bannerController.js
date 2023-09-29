const Banner = require('../models/bannerModel');



const loadBanner = async(req,res)=>{
    try {
        const bannerData= await Banner.find();
        res.render('banner',{data:bannerData})    
    } catch (error) {
        console.log("bannererror",error.message);
    }
}

const addBanner = async(req,res)=>{
    try {
        res.render("add-banner");
    } catch (error) {
        console.log("addBannererr",error.message);
    }
}
//post add banner-------------------
const postAddBanner = async (req, res) => { 
    try {
        const heading = req.body.heading;
        const discription = req.body.discription;
        const image = req.file.filename;

        const data = new Banner({
            heading: heading,
            discription: discription,
            image 
        });

        const result = await data.save();
        if (result) {
            res.redirect("banner");
        }
    } catch (error) {
        console.log(error);
    }
};
//unlist banner--------
const unlistBanner = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await Banner.findById(id);
        if (data.status == true) {
            await Banner.findByIdAndUpdate(id, { status: false });
        } else {
            await Banner.findByIdAndUpdate(id, { status: true });
        }
        res.redirect("/admin/banner");
    } catch (error) {
        console.log(error.message);
    }
};

//delete banner-----------
const deletebanner = async (req, res) => {
    try {
        const id = req.query.id;
        await Banner.deleteOne({ _id: id });
        res.redirect("/admin/banner");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports ={
    loadBanner,
    addBanner,
    unlistBanner,
    postAddBanner,
    deletebanner
}