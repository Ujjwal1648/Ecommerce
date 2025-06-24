const product_model = require("../models/product.model");
const category_model = require("../models/category.model");

exports.createProduct = async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            imageUrl: req.body.imageUrl || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
            stock: req.body.stock || 0
        };

        const product = await product_model.create(productData);
        const populatedProduct = await product_model.findById(product._id).populate('category');
        
        res.status(201).send(populatedProduct);
    } catch (err) {
        console.log("Error while creating product", err);
        res.status(500).send({
            message: "Error while creating the product"
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        let filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await product_model.find(filter).populate('category');
        res.status(200).send(products);
    } catch (err) {
        console.log("Error while fetching products", err);
        res.status(500).send({
            message: "Error while fetching products"
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await product_model.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }
        res.status(200).send(product);
    } catch (err) {
        console.log("Error while fetching product", err);
        res.status(500).send({
            message: "Error while fetching product"
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await product_model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('category');
        
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }
        
        res.status(200).send(product);
    } catch (err) {
        console.log("Error while updating product", err);
        res.status(500).send({
            message: "Error while updating product"
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await product_model.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }
        
        res.status(200).send({
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.log("Error while deleting product", err);
        res.status(500).send({
            message: "Error while deleting product"
        });
    }
};