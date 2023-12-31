const Cart = require('../models/cartmodel');
const Products = require('../models/productModels');
const User = require('../models/usermodel');
const productOff= require('../models/productoffer_Model');



let length = 0;

const loadCart = async (req, res) => {
   try {
      if (req.session.userData._id) {
         const user = await User.findOne({ _id: req.session.userData });
         const id = user._id;
         const cart = await Cart.findOne({ user: id });

         if (cart) {
            const cartData = await Cart.findOne({ user: id })
               .populate("products.product_id")
               .lean();

            if (cartData) {
               if (cartData.products.length > 0) {
                  length = cartData.products.length;
               };
               if (cartData.products.length) {
                  const total = await Cart.aggregate([
                     {
                        $match: { user: id },
                     },
                     {
                        $unwind: "$products",
                     },
                     {
                        $project: {
                           price: "$products.price",
                           quantity: "$products.quantity",
                           image: "$products.image",
                           total_price: {
                              $multiply: ["$products.price", "$products.quantity"], // Calculate the total price
                           },
                        },
                     },
                     {
                        $group: {
                           _id: null,
                           total: {
                              $sum: "$total_price",
                           },
                        },
                     },
                  ]).exec();

                  const Total = total[0].total;



                  // Set the length value in the request object
                  req.length = length;

                  return res.render("cart", {
                     user: req.session.userData.userName,
                     data: cartData.products,
                     userId: id,
                     total: Total,
                     req: req,
                     length: length,
                  });
               } else {
                  return res.render("cart", {
                     user: req.session.userData.userName,
                     data2: "hi",
                     req: req,
                  });
               }
            } else {
               return res.render("cart", {
                  user: req.session.userData.userName,
                  data2: "hi",
                  req: req,
               });
            }
         } else {
            return res.render("cart", {
               user: req.session.userData.userName,
               data2: "hi",
               req: req,
            });
         }
      } else {
         return res.redirect("login");
      }
   } catch (error) {
      console.log("loadCart Method:", error.message);
   }
};
const addToCart = async (req, res) => {
   try {
       if (req.session.userData && req.session.userData._id) {
           const user = req.session.userData;
           const productId = req.query.id;
           const userData = await User.findOne({ _id: user._id });
           const userId = userData._id;
           const productData = await Products.findById(productId);
           const userCart = await Cart.findOne({ user: userId });
           const discount = await productOff.findOne({ product_name: productId });

           // Calculate the price based on whether a discount exists
           const price = discount ? productData.price - (productData.price * (discount.discountPercentage / 100)) : productData.price;

           if (!productData || productData.quantity <= 0) {
               return res.json({ success: false, outOfStock: true });
           }

           if (userCart) {
               const productExists = userCart.products.findIndex((product) =>
                   product.product_id.equals(productId)
               );
               if (productExists != -1) {
                   await Cart.findOneAndUpdate(
                       { user: userId, "products.product_id": productId },
                       { $inc: { "products.$.quantity": 1 } }
                   );
               } else {
                   await Cart.findOneAndUpdate(
                       { user: userId },
                       {
                           $push: {
                               products: {
                                   product_id: productId,
                                   price,
                                   quantity: 1,
                                   total_price: price,
                               },
                           },
                       }
                   );
               }
           } else {
               const data = new Cart({
                   user: userId,
                   products: [
                       {
                           product_id: productId,
                           price,
                           quantity: 1,
                           total_price: price,
                       },
                   ],
               });
               await data.save();
           }
           res.json({ success: true });
       } else {
           res.json({ success: false, error: "User not logged in" });
       }
   } catch (error) {
       console.log("addToCart Method:", error.message);
       res.json({ success: false, error: error.message });
   }
};

const changeQty = async (req, res) => {
    try {
       if (req.session.userData) {
          const userId = req.session.userData._id;
          const productId = req.body.product;
          const quantity = req.body.qty;
          const product = await Products.findById(productId);
          const discount = await productOff.findOne({product_name:productId});


          const price=product.price-(product.price*(discount.discountPercentage/100))

 
          if (product.quantity >= quantity) {
             const updatedCart = await Cart.findOneAndUpdate(
                {
                   user: userId,
                   'products.product_id': productId
                },
                {
                   $set: {
                      'products.$.quantity': quantity,
                      'products.$.total_price': price * quantity
                   }
                },
                { new: true } // Return the updated document
             )
                .populate('products.product_id')
                .lean();
 
             let updatedTotal = '0.00';
             if (updatedCart && updatedCart.products.length > 0) {
                updatedTotal = updatedCart.products.reduce((total, item) => {
                   return total + item.total_price;
                }, 0).toFixed(2);
             }
 
             res.json({ success: true, price: updatedTotal });
          } else {
             res.json({ success: false });
          }
       } else {
          res.redirect('login');
       }
    } catch (error) {
       console.log('changeQty Method:', error.message);
    }
 };
 

const removeItemCart = async (req, res) => {

    try {
 
       const id = req.body.id;
       const data = await Cart.findOneAndUpdate(
          { 'products.product_id': id },
          { $pull: { products: { product_id: id } } }
       );
       if (data) {
          res.json({ success: true });
       }
 
    } catch (error) {
       console.log('removeItemCart Method :-  ', error.message);
    }
 
 }

module.exports ={
    loadCart,
    addToCart,
    changeQty,
    removeItemCart

}