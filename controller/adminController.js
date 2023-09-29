const User = require ("../models/usermodel");
const bcrypt= require("bcrypt");
const admin = require('../models/adminmodel')
const products = require('../models/productModels');
const categorycollection= require('../models/categoryModel')
const Order = require("../models/orderModel");


const getAdminLogin = async (req, res) => { 
  res.render("adminlogin")
  }
  
const verifyAdminLogin = (req, res) => {
    try {
     const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {

            return res.render('adminlogin', { message: " Please fill out all the fields " });

        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {

            req.session.email = email;
            res.redirect('home'); 

        } else {
            res.render('adminlogin', { message: 'Email or password is incorrect' })
        }

    } catch (error) {
        console.log('error is on admins verifyLogin method :-  ', error.message);
    }
  };
  
  //home----------------------------------------------------
const loadAdminHome = async (req, res) => {
  const orderData = await Order.find({ status: { $eq: "Delivered" } });
  let SubTotal = 0;
  orderData.forEach(function (value) {
    SubTotal = SubTotal + value.totalPrice;
  });

  const cod = await Order.find({ paymentMethod: "cod", status:  "Delivered" }).count();
  const online = await Order.find({ paymentMethod: "razorpay",status:  "Delivered" }).count();
  const totalOrder = await Order.find({ status: { $ne: "cancelled" } }).count();
  const totalUser = await User.find().count();
  const totalProducts = await products.find().count();
  const date = new Date();
  const year = date.getFullYear();
  const currentYear = new Date(year, 0, 1);
  const value = req.query.value || "ALL";

  const salesByYear = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: currentYear },
        status:  "Delivered",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%m", date: "$createdAt" } },
        total: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);


  let sales = [];
  for (i = 1; i < 13; i++) {
    let result = true;
    for (j = 0; j < salesByYear.length; j++) {
      result = false;
      if (salesByYear[j]._id == i) {
        sales.push(salesByYear[j]);
        break;
      } else {
        result = true;
      }
    }
    if (result) {
      sales.push({ _id: i, total: 0, count: 0 });
    }
  }

  let yearChart = [];
  for (let i = 0; i < sales.length; i++) {
    yearChart.push(sales[i].total);
  }

  res.render("home", {
    data: orderData,
    total: SubTotal,
    cod,
    online,
    totalOrder,
    totalUser,
    totalProducts,
    totalAmount:SubTotal,
    yearChart,
    value
  });
};

  const userManagement = async (req, res) => { 
    try {
      const data = await User.find();
      res.render("usermanagement", { user : data });
    } catch (error) {
      console.log(error.message);
    }
  };


  const getCategory = async (req,res)=> {
    try {
         data1 =await categorycollection.find();
        res.render("category");
    } catch (error) {
     console.log(error);   
    }
  }


  const getproducts= async (req,res)=>{
    try {
        const data =await products.find().populate("category");
        res.render("products",{products:data});
    } catch (error) {
        
    }
  }
 
  
  const updatestatus = async (req, res) => {
    try {
        const status = req.body.status;
        const orderId = req.body.orderId;
        await Order.findByIdAndUpdate(orderId, { status: status });
        res.redirect("order");
    } catch (error) {
        console.log(error.message);
    }
};

// //Logout---------------------------------------------------
// const getlogout = async (req, res) => {
//   req.session.destroy();
//   res.render("adminlogin");
// }; 

const getlogout = async (req, res) => { 
  try { 
      req.session.destroy();
      res.render('adminlogin');
  } catch (error) {
      console.log('admin logout function :- ', error.message);
  }
};


const getSalesReport = async (req, res) => {
  try {
    let start;
    let end;
    req.query.start ? (start = new Date(req.query.start)) : (start = "ALL"); 
    req.query.end ? (end = new Date(req.query.end)) : (end = "ALL");
    if (start != "ALL" && end != "ALL") {
      const data = await Order.aggregate([
        {
          $match: {
            $and: [
              { Date: { $gte: start } },
              { Date: { $lte: end } },
              { status: { $eq: "Delivered" } },
            ],
          },
        },
      ]);
      let SubTotal = 0;
      console.log(data);
      data.forEach(function (value) {
        SubTotal = SubTotal + value.totalPrice;
      });

      res.render("salesReport", { data, total: SubTotal });
    } else {

      const orderData = await Order.find({ status: { $eq: "Delivered" } });
      let SubTotal = 0;
      orderData.forEach(function (value) {
        SubTotal = SubTotal + value.totalPrice; 
      });
      res.render("salesReport", { data: orderData, total: SubTotal });
    }
  } catch (error) {
    res.redirect("/serverERR", { message: error.message });
    console.log(error.message);
  }
};



 
   
  module.exports = {
    getAdminLogin,
    verifyAdminLogin,
    loadAdminHome,
    userManagement,
    getCategory,
    getproducts,
  
  updatestatus,
  getlogout,
  getSalesReport ,
  };
  