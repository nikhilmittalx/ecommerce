const mongoose = require("mongoose");

// mongoose.connect("mongo://localhost:27017/Ecommerce", {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true}).then((data)=>{
//     console.log("Mongo db connected with serber: ${data.connection.host}");
// }).catch((err)=>{
//     console.log(err);
// })
const connectDatabase = ()=>{
    mongoose.set('strictQuery', true);
    mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useCreateIndex:true
    })
    .then((data)=>{
        console.log(`Mongo db connected with serber: ${data.connection.host}`);
    })
    // .catch((err)=>{
    //     console.log(err);
    // })  
    // isko hatane se unhandled ho gya lkin hmne unhandled error ka ServiceWorkerRegistration.js me likh liya
}

module.exports = connectDatabase