const express = require("express")
const mongoose = require("mongoose")
const app = express()
const server_config = require("./Configs/server.config")
const db_config = require("./Configs/db.config")
const user_model = require("./models/user.model")
const bcrypt = require("bcryptjs")
app.use(express.json())

mongoose.connect(db_config.DB_URL)
const db = mongoose.connection
db.on("error" , ()=>{
    console.log('Error while connecting to the mongoDB')
})
db.once("open", ()=>{
    console.log("Connected to MongoDB")
    init()
})

async function init(){
    try {
        let user = await user_model.findOne({userId: "admin"})
        if(user){
            console.log("Admin is already present")
            return
        }
    } catch(err){
        console.log("Error while reading the data", err)
    }
   
    try{
    user = await  user_model.create({
        name : "Ujjwal",
        userId : "admin",
        email : "singhujjw@gmail.com",
        userType : "ADMIN",
        password : bcrypt.hashSync("Welcome1",8)
    })
     console.log("Admin created", user)
    }catch(err){
        console.log("Error while create admin",err)
    }
}
require("./routes/auth.routes")(app)
require("./routes/category.routes")(app)
app.listen(server_config.PORT, ()=>{
    console.log("Server Started at port num : ",server_config.PORT)
})