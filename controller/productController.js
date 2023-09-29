const productscollection = require("../models/productModels");
const categorycollection= require("../models/categoryModel")
const upload = require("../middleware/multer")


const getAddProducts = async (req,res)=>{
    try {
       const category= await categorycollection.find().populate("category").lean();
       res.render("addproducts",{category});
    } catch (error) {
       console.log(error); 
    }
}
 const postproducts = async (req, res) => {
    try {
        const { productname, brand, price, description, quantity,category1 } = req.body;
   

        // Check if a product with the same name already exists
        const existingProduct = await productscollection.findOne({ productname: productname });
        const category = await categorycollection.find().populate("category").lean();
        
        if (existingProduct) {
            return res.render( "addproducts",{category, message: 'Product with the same name already exists' });
        }if (price <0 || quantity <0) {
            return res.render( "addproducts",{category, message: 'negetive value not support' });
        }

        const img = req.files.map((image) => image.filename);
        console.log(req.files);
        const product = new productscollection({
            productname: productname,
            brand: brand,
            price: price,
            description: description,
            quantity: quantity,
            category: category1,
            image: img,
        });

        const productdata = await product.save();
        console.log(productdata);
        if (productdata) {
            res.redirect("products");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'nottt adddddddddddddd' });
    }
}


const productedit =async(req,res)=>{
    try{
        const categoryData =await categorycollection.find().lean();
        const id = req.query.id;
        const productData= await productscollection.findOne({_id: id}).lean();


        if (productData){
            res.render("editproducts",{

                user:productData,
                category: categoryData
            })
        }else{
            res.redirect("editproducts")
        }
    }catch (error){
        console.log(error);
    }
}
const posteditproducts =  async (req,res)=>{
    try {
        if(req.files){
            const existingproduct = await productscollection.findById(req.query.id);
            let images = existingproduct.image;
            req.files.forEach((file)=>{
                images.push(file.filename);
            })
            var img =images; 
        }


        await productscollection.updateOne(
            {_id:req.query.id},
            { $set :{
                productname: req.body.productname,
                brand: req.body.brand,
                price: req.body.price,
                description: req.body.description,
                quantity: req.body.quantity,
                category: req.body.categoryId, // Use the correct field name for category ID
                image: img,
            }}
        );
        res.redirect("products");
        
    } catch (error) {
        console.log(error);
    }
}


const removeimage = async (req,res)=>{
    try {
        let id =req.body.id;
        let position = req.body.position;
        let productImg = await productscollection.findById(id)
        let image = productImg.image[position];
        await productscollection.updateOne({_id:id},{$pullAll:{image:[image]}});
        res.json({remove : true});
    
    } catch (error) {
        res.render("500");
        console.log(error);
    }
};



const unlistproduct = async (req, res) => {
    const id = req.query.id;
    const data = await productscollection.findById({ _id: id });
  
    if (data.status == true) {
      await productscollection.findOneAndUpdate(
        { _id: id },
        { $set: { status: false } }
      );
    } else { 
      await productscollection.findOneAndUpdate(
        { _id: id },
        { $set: { status: true } } 
      );
    }
    res.redirect("/admin/products");  
  };
  




module.exports ={
    getAddProducts,
    postproducts,
    productedit,
    posteditproducts,
    removeimage,
    unlistproduct,


}
