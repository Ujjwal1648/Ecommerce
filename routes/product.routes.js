const product_controller = require("../controllers/product.controller");
const auth_mw = require("../middlewares/auth_mw");

module.exports = (app) => {
    // Public routes
    app.get("/ecomm/api/v1/products", product_controller.getAllProducts);
    app.get("/ecomm/api/v1/products/:id", product_controller.getProductById);
    
    // Admin only routes
    app.post("/ecomm/api/v1/products", 
        [auth_mw.verifyToken, auth_mw.isAdmin], 
        product_controller.createProduct
    );
    
    app.put("/ecomm/api/v1/products/:id", 
        [auth_mw.verifyToken, auth_mw.isAdmin], 
        product_controller.updateProduct
    );
    
    app.delete("/ecomm/api/v1/products/:id", 
        [auth_mw.verifyToken, auth_mw.isAdmin], 
        product_controller.deleteProduct
    );
};