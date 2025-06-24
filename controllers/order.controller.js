const order_model = require("../models/order.model");
const cart_model = require("../models/cart.model");
const product_model = require("../models/product.model");

exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        
        const cart = await cart_model.findOne({ user: req.user._id })
            .populate('items.product');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).send({
                message: "Cart is empty"
            });
        }
        
        // Check stock availability
        for (let item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).send({
                    message: `Insufficient stock for ${item.product.name}`
                });
            }
        }
        
        // Create order items
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));
        
        const order = await order_model.create({
            user: req.user._id,
            items: orderItems,
            totalAmount: cart.totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'CASH_ON_DELIVERY'
        });
        
        // Update product stock
        for (let item of cart.items) {
            await product_model.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }
        
        // Clear cart
        await cart_model.findByIdAndUpdate(cart._id, {
            items: [],
            totalAmount: 0
        });
        
        const populatedOrder = await order_model.findById(order._id)
            .populate('items.product')
            .populate('user', 'name email');
        
        res.status(201).send(populatedOrder);
    } catch (err) {
        console.log("Error while creating order", err);
        res.status(500).send({
            message: "Error while creating order"
        });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await order_model.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        
        res.status(200).send(orders);
    } catch (err) {
        console.log("Error while fetching orders", err);
        res.status(500).send({
            message: "Error while fetching orders"
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await order_model.find()
            .populate('items.product')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).send(orders);
    } catch (err) {
        console.log("Error while fetching orders", err);
        res.status(500).send({
            message: "Error while fetching orders"
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await order_model.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('items.product').populate('user', 'name email');
        
        if (!order) {
            return res.status(404).send({
                message: "Order not found"
            });
        }
        
        res.status(200).send(order);
    } catch (err) {
        console.log("Error while updating order", err);
        res.status(500).send({
            message: "Error while updating order"
        });
    }
};