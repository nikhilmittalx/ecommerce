const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

// admin ke kaam
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    // product kisne add kiya h us admin ka name aa jaega
    req.body.user = req.user.id;
    // console.log(req.body.user);
    // console.log(typeof(req.body.user));

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// update product -- admin
exports.updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
})

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(ErrorHandler("Product not found", 400));
        // return res.status(500).json({
        //     success:false,
        //     message:"Product not found"
        // })
    }
    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        // return res.status(500).json({
        //     success:false,
        //     message:"Product not found"
        // })
        return next(ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})



// get all product
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    // console.log(productCount , "here in productController")
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();
    // .pagination(resultPerPage);

    let products = await apiFeature.query.clone();
    let filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query;
    // const product = await Product.find();
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount,
    })
})


// create review or update existing 
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment,

    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg += rev.rating
    })
    avg = avg/product.numOfReviews;
    product.ratings = avg;

    await product.save({validateBeforeSave: false})
    res.status(200).json({
        success:true
    })
})


// get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.user.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success:true,
        reviews: product.reviews,
    })
})


// delete review 
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.user.productId);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    // reviews me vo sare reviews h jo hme delete nhi krne
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())
    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating
    })
    const ratings = avg / reviews.length
    const numOfReviews = reviews.length
    await Product.findByIdAndUpdate(req.query.productId,{
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    )

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})