const express = require("express");
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');

require('dotenv').config();


//import routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const ProductRoutes = require('./routes/product');
const CategoryRoutes = require('./routes/category');
const SubCategoryRoutes = require('./routes/subCategory');
const OrderRoutes = require('./routes/order');
const CarousalRoutes = require('./routes/carousal');
const BannerRoutes = require('./routes/banner');
const TrendingBannerRoutes = require('./routes/trendingBanner');


//app
const app = express();

//db
mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0-b73ox.mongodb.net/cluster0?retryWrites=true&w=majority`, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=> console.log('DATABASE connected'))
.catch(()=> console.log("Error Connecting DATABASE"));


//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


//routes middlewares
app.use("/api",userRoutes);
app.use("/api",authRoutes);
app.use("/api",ProductRoutes);
app.use("/api",CategoryRoutes);
app.use("/api",SubCategoryRoutes);
app.use("/api",OrderRoutes);
app.use("/api", CarousalRoutes);
app.use("/api", BannerRoutes);
app.use("/api", TrendingBannerRoutes);


//port
const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
    console.log(`Server is listening at ${PORT}`);
});
