const order_controller = require("../controllers/order.controller");
const auth_mw = require("../middlewares/auth_mw");

module.exports = (app) => {
    app.post("/ecomm/api/v1/orders", 
        [auth_mw.verifyToken], 
        order_controller.createOrder
    );
    
    app.get("/ecomm/api/v1/orders", 
        [auth_mw.verifyToken], 
        order_controller.getUserOrders
    );
    
    app.get("/ecomm/api/v1/admin/orders", 
        [auth_mw.verifyToken, auth_mw.isAdmin], 
        order_controller.getAllOrders
    );
    
    app.put("/ecomm/api/v1/admin/orders/:id", 
        [auth_mw.verifyToken, auth_mw.isAdmin], 
        order_controller.updateOrderStatus
    );
};