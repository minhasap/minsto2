const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('../config/config');
const auth = require('../middleware/auth');
const nocache = require('nocache');


const userRouter = express();

userRouter.use(express.urlencoded({ extended: false }));
userRouter.use(express.json());
userRouter.use(cookieParser());
userRouter.use(nocache());
const cartController = require('../controller/cartController');
const userController = require('../controller/usercontroller');
const orderController = require('../controller/order');
const couponController= require('../controller/coupenController')
userRouter.set('view engine', 'ejs');
userRouter.set('views', './views/user');


const bodyParser = require('body-parser');
userRouter.use(express.json()); // To parse JSON data
userRouter.use(express.urlencoded({ extended: true }));

const isBlockedd = require('../middleware/blocked')
userRouter.get('/',nocache(), userController.loadHome);

userRouter.get('/login',nocache(),auth.isLogout,userController.loginLoad)
userRouter.get('/signup',nocache(),auth.isLogout,userController.loadSignup)
userRouter.get('/otp',nocache(), userController.loadOTP);
userRouter.get('/resendotp',nocache(), userController.resendOTP);
userRouter.get('/resendotplogin',nocache(), userController.resendOTP);


userRouter.get('/home',nocache(), auth.blockedstatus,userController.loadHome);
userRouter.get('/shop',nocache(),auth.blockedstatus,userController.loadShop);
userRouter.get('/productdetail',nocache(),auth.blockedstatus, userController.productDetail);
userRouter.get('/logout',nocache(), auth.isLogin, userController.userLogout);
userRouter.get('/block',nocache(),userController.blockUser)
userRouter.get('/unblock',nocache(),userController.unblockUser)
userRouter.get('/cart',nocache(),auth.blockedstatus,auth.isLogin,cartController.loadCart)
userRouter.get('/addtocart',nocache(),auth.blockedstatus,auth.isLogin,cartController.addToCart)
userRouter.get('/Wishlist',nocache(),auth.isLogin,userController.loadWishlist)
userRouter.post('/Wishlist',auth.isLogin,userController.addtowishlist)
// userRouter.get('/addtowishlist',auth.isLogin,userController.addtowishlist)
userRouter.get("/addtowishlist",nocache(),auth.isLogin,nocache(),userController.addtowishlist);


userRouter.get('/profile',nocache(),auth.isLogin,userController.detaileprofile)
userRouter.get('/checkout',nocache(),auth.isLogin,orderController.loadCheckout)

userRouter.get('/addAddressList',nocache(),userController.loadAddressList);
userRouter.get('/addAddress',nocache(),userController.loadAddAddress);
userRouter.get("/addressList",nocache(), auth.isLogin, userController.loadAddressList);

userRouter.get('/editAddress',nocache(),auth.isLogin,userController.loadEditAddress);
userRouter.get('/deleteAddress',nocache(),auth.isLogin,userController.deleteAddress);

userRouter.get("/updateProfile",nocache(), auth.isLogin, userController.loadUpdateData);
userRouter.post("/updateProfile", auth.isLogin, userController.updateData);

userRouter.get('/about', nocache(), userController.loadAbout);
userRouter.get('/contact', nocache(), userController.loadContacts);


userRouter.get('/orderPlaced',nocache(),auth.isLogin,orderController.loadOrderPLaced)
userRouter.post('/placeOrder',auth.isLogin,orderController.placeOrder)
userRouter.get('/viewOrders',nocache(),auth.isLogin,orderController.loadOrderList)
userRouter.get('/cancelOrder',nocache(),auth.isLogin,orderController.cancelOrder);



userRouter.get("/wallethsitory",nocache(), auth.isLogin, userController.loadWalletHistory);

userRouter.get("/changePass", auth.isLogin, nocache(), userController.loadChangePass);
userRouter.post('/changePass', userController.changePass);

userRouter.post('/forgotPass', userController.forgotPass);
userRouter.get("/forgotPass", nocache(), userController.forgotPass);

userRouter.post('/verifyForgotOtp', userController.verifyFotp);
userRouter.post('/updatePass', userController.updatePass); 



userRouter.post('/addAddress',userController.addAddress);
userRouter.post('/addCheckoutAddress', orderController.addAddress);
userRouter.post('/editAddress',auth.isLogin,userController.editAddress);
userRouter.post('/checkotp', userController.verifyOTP);
userRouter.post('/login',isBlockedd, userController.verifyLogin);
userRouter.post('/signup', userController.insertUser);
// userRouter.post('/signup',userController.loadSignup)
userRouter.post('/', userController.verifyLogin);

userRouter.post('/addtocart',auth.isLogin,cartController.addToCart);
userRouter.post('/changeQty',auth.isLogin,cartController.changeQty)
userRouter.post('/removeCartItem',auth.isLogin,cartController.removeItemCart);
userRouter.post('/removeWish',auth.isLogin,userController.removeWishItem);

userRouter.post('/verifyPayment', orderController.verifyPayment);
userRouter.post('/applyCoupon',couponController.applyCoupon);


module.exports = userRouter;  

