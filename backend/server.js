const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase=require("./config/database")

// cloudinary to upload and use profile pics
const cloudinary = require("cloudinary")

// handling uncaught exception
// console.log(youtube)  aur abhi tak youtube define na ho ---tab ye wala error hota h
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to uncaught exception`)
    process.exit(1);
})


// ```config```
dotenv.config({path:"backend/config/config.env"});

// connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log(process.env.PORT)
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is working on https://localhost:${process.env.PORT}`);
})


// unhandled promise rejections - config.env file me kuchh error
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejections`)

    server.close(()=>{
        process.exit(1);
    })
})


