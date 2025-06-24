const cart_model = require("../models/cart.model");
const product_model = require("../models/product.model");

exports.getCart = async (req, res) => {
    try {
        let cart = await cart_model.findOne({ user: req.user._id })
            .populate('items.product');
        
        if (!cart) {
            cart = await cart_model.create({ user: req.user._id, items: [] });
        }
        
        res.status(200).send(cart);
    } catch (err) {
        console.log("Error while fetching cart", err);
        res.status(500).send({
            message: "Error while fetching cart"
        });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        const product = await product_model.findById(productId);
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }
        
        if (product.stock < quantity) {
            return res.status(400).send({
                message: "Insufficient stock"
            });
        }
        
        let cart = await cart_model.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = await cart_model.create({
                user: req.user._id,
                items: [{ product: productId, quantity }]
            });
        } else {
            const existingItem = cart.items.find(item => 
                item.product.toString() === productId
            );
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            
            await cart.save();
        }
        
        // Calculate total amount
        await calculateCartTotal(cart._id);
        
        const updatedCart = await cart_model.findById(cart._id)
            .populate('items.product');
        
        res.status(200).send(updatedCart);
    } catch (err) {
        console.log("Error while adding to cart", err);
        res.status(500).send({
            message: "Error while adding to cart"
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const cart = await cart_model.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }
        
        const item = cart.items.find(item => 
            item.product.toString() === productId
        );
        
        if (!item) {
            return res.status(404).send({
                message: "Item not found in cart"
            });
        }
        
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => 
                item.product.toString() !== productId
            );
        } else {
            item.quantity = quantity;
        }
        
        await cart.save();
        await calculateCartTotal(cart._id);
        
        const updatedCart = await cart_model.findById(cart._id)
            .populate('items.product');
        
        res.status(200).send(updatedCart);
    } catch (err) {
        console.log("Error while updating cart", err);
        res.status(500).send({
            message: "Error while updating cart"
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const cart = await cart_model.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }
        
        cart.items = cart.items.filter(item => 
            item.product.toString() !== productId
        );
        
        await cart.save();
        await calculateCartTotal(cart._id);
        
        const updatedCart = await cart_model.findById(cart._id)
            .populate('items.product');
        
        res.status(200).send(updatedCart);
    } catch (err) {
        console.log("Error while removing from cart", err);
        res.status(500).send({
            message: "Error while removing from cart"
        });
    }
};

async function calculateCartTotal(cartId) {
    const cart = await cart_model.findById(cartId).populate('items.product');
    let total = 0;
    
    cart.items.forEach(item => {
        total += item.product.price * item.quantity;
    });
    
    cart.totalAmount = total;
    await cart.save();
}