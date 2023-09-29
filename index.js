require('dotenv/config'); // This will load the variables from the .env file



const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE).then(()=>{
  console.log('Database Is Connected');
}).catch((err)=>{
  console.log('Database Connection Failed');
});
const upload = require ('./middleware/multer')


require('dotenv/config');
const express = require("express");
const session = require('express-session');
const path = require('path');
const app = express();
const nocache = require("nocache");

// DATABASE="mongodb://127.0.0.1:27017/newproject"


const userRoute = require('./routes/userRoutes');
const adminRoute = require('./routes/adminRoutes');

app.use(session({
  secret: 'my secret is nothing', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 6000000 
  }
}));

app.use(nocache());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/', userRoute);

app.use('/admin', adminRoute);


app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(process.env.port, function () {
  console.log(`Server is running on ${process.env.port}`);
});
