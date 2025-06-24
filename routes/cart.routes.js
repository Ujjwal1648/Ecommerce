const cart_controller = require("../controllers/cart.controller");
const auth_mw = require("../middlewares/auth_mw");

module.exports = (app) => {
    app.get("/ecomm/api/v1/cart", 
        [auth_mw.verifyToken], 
        cart_controller.getCart
    );
    
    app.post("/ecomm/api/v1/cart", 
        [auth_mw.verifyToken], 
        cart_controller.addToCart
    );
    
    app.put("/ecomm/api/v1/cart", 
        [auth_mw.verifyToken], 
        cart_controller.updateCartItem
    );
    
    app.delete("/ecomm/api/v1/cart/:productId", 
        [auth_mw.verifyToken], 
        cart_controller.removeFromCart
    );
};