const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const app = express()
const server_config = require("./Configs/server.config")
const db_config = require("./Configs/db.config")
const user_model = require("./models/user.model")
const category_model = require("./models/category.model")
const product_model = require("./models/product.model")
const bcrypt = require("bcryptjs")

// Middleware
app.use(express.json())
app.use(cors())

// Serve static files from client build
app.use(express.static(path.join(__dirname, 'client/dist')))

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
        } else {
            user = await user_model.create({
                name : "Admin User",
                userId : "admin",
                email : "admin@ecommerce.com",
                userType : "ADMIN",
                password : bcrypt.hashSync("admin123",8)
            })
            console.log("Admin created", user)
        }

        // Create default categories
        const categories = [
            { name: "Electronics", description: "Electronic devices and gadgets" },
            { name: "Clothing", description: "Fashion and apparel" },
            { name: "Books", description: "Books and educational materials" },
            { name: "Home & Garden", description: "Home improvement and garden supplies" },
            { name: "Sports", description: "Sports equipment and accessories" }
        ];

        for (let catData of categories) {
            const existingCategory = await category_model.findOne({ name: catData.name });
            if (!existingCategory) {
                await category_model.create(catData);
                console.log(`Category '${catData.name}' created`);
            }
        }

        // Create sample products
        const electronicsCategory = await category_model.findOne({ name: "Electronics" });
        const clothingCategory = await category_model.findOne({ name: "Clothing" });
        const booksCategory = await category_model.findOne({ name: "Books" });

        const sampleProducts = [
            {
                name: "Smartphone",
                description: "Latest smartphone with advanced features",
                price: 699,
                category: electronicsCategory._id,
                imageUrl: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
                stock: 50
            },
            {
                name: "Laptop",
                description: "High-performance laptop for work and gaming",
                price: 1299,
                category: electronicsCategory._id,
                imageUrl: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg",
                stock: 30
            },
            {
                name: "T-Shirt",
                description: "Comfortable cotton t-shirt",
                price: 29,
                category: clothingCategory._id,
                imageUrl: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
                stock: 100
            },
            {
                name: "Programming Book",
                description: "Learn programming with this comprehensive guide",
                price: 49,
                category: booksCategory._id,
                imageUrl: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
                stock: 25
            }
        ];

        for (let productData of sampleProducts) {
            const existingProduct = await product_model.findOne({ name: productData.name });
            if (!existingProduct) {
                await product_model.create(productData);
                console.log(`Product '${productData.name}' created`);
            }
        }

    } catch(err){
        console.log("Error during initialization", err)
    }
}

// Routes
require("./routes/auth.routes")(app)
require("./routes/category.routes")(app)
require("./routes/product.routes")(app)
require("./routes/cart.routes")(app)
require("./routes/order.routes")(app)

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})

app.listen(server_config.PORT, ()=>{
    console.log("Server Started at port num : ",server_config.PORT)
})