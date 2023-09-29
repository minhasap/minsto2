

const express = require('express');
const config = require('../config/config');
const upload = require("../middleware/multer");

const adminRouter = express();
const auth = require('../middleware/adminAuth');
const session = require('express-session');
const multer=require('multer')


const adminController = require('../controller/adminController');
const productsController =require('../controller/productController');
const categoryController = require('../controller/categoryController')
const OrderController = require('../controller/order')
const coupenController= require('../controller/coupenController')
const bannerController= require('../controller/bannerController')
const offerController= require('../controller/offerController');

adminRouter.set('view engine', 'ejs');
adminRouter.set('views', './views/admin');
adminRouter.use(express.json());


adminRouter.use(session({

    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000000 
    }
}));

// Admin login routes
adminRouter.get('/',auth.isLogout, adminController.getAdminLogin);
adminRouter.post('/',adminController.verifyAdminLogin); 
adminRouter.get('/home',auth.isLogin,adminController.loadAdminHome);
adminRouter.get('/logout',auth.isLogin,adminController.getlogout);

adminRouter.get('/usermanagement',auth.isLogin,adminController.userManagement)

adminRouter.get('/category',auth.isLogin,categoryController.loadCategory);
adminRouter.get('/addCategory',auth.isLogin,categoryController.loadAddCategory);
adminRouter.post('/addCategory',categoryController.addCategory);
adminRouter.get('/editCategory/:id',auth.isLogin,categoryController.editCategory);
adminRouter.post('/editCategory',categoryController.addEditCategory);
adminRouter.get('/orders',auth.isLogin,OrderController.getOrder);



adminRouter.get('/offer_managemnet',auth.isLogin,offerController.offer_managemnet);
adminRouter.post('/offer_managemnet',auth.isLogin,offerController.add);
adminRouter.get('/add_offer',auth.isLogin, offerController.add);
adminRouter.post('/add_offers', offerController.get_Data);
adminRouter.get('/edit/:id',auth.isLogin, offerController.edit);
adminRouter.post('/edit',offerController.update);



adminRouter.get('/product_offer_management',auth.isLogin, offerController.productOffer_management)
adminRouter.get('/add_product_offer', auth.isLogin, offerController.add_product_offer)
adminRouter.post('/add_product_offer',  upload.single('image'), offerController.get_product_offer)
adminRouter.get('/edit_product_offer/:id',auth.isLogin, offerController.edit_product_offer);
adminRouter.post('/edit_product_offer', offerController.update_product_offer);


adminRouter.get("/salesReport",adminController.getSalesReport)



adminRouter.get('/singleOrder',auth.isLogin,OrderController.viewOrder)


adminRouter.get('/coupon',auth.isLogin,coupenController.loadCoupon)
adminRouter.get('/addcoupon',auth.isLogin,coupenController.loadAddCoupon)
adminRouter.post('/addcoupon',coupenController.postAddCoupon)






adminRouter.get('/products',auth.isLogin,adminController.getproducts);
adminRouter.get('/addproducts',auth.isLogin,productsController.getAddProducts);
adminRouter.post('/addproducts',upload.array("image",3),productsController.postproducts);
adminRouter.get('/editproducts',auth.isLogin,productsController.productedit)
adminRouter.post('/editproducts', upload.array("image",3),productsController.posteditproducts);
adminRouter.post('/removeimage',productsController.removeimage);
adminRouter.get('/show-products',auth.isLogin,productsController.unlistproduct);
adminRouter.get('/sales',auth.isLogin,OrderController.sales);


adminRouter.get('/banner',auth.isLogin,bannerController.loadBanner);
adminRouter.get('/addBanner',auth.isLogin,bannerController.addBanner);
adminRouter.post('/addBanner',upload.single('image'),bannerController.postAddBanner);
adminRouter.get('/showBanner',auth.isLogin,bannerController.unlistBanner);
adminRouter.get('/deleteBanner',auth.isLogin,bannerController.deletebanner);
adminRouter.post("/updateStatus",  OrderController.updatestatus)



module.exports = adminRouter; 
