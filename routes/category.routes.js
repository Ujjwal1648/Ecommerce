const category_controller = require("../controllers/category.controller")
const auth_mw = require("../middlewares/auth_mw")

module.exports = (app)=>{
    // Public route
    app.get("/ecomm/api/v1/categories", category_controller.getAllCategories);
    
    // Admin only routes
    app.post("/ecomm/api/v1/categories",
        [auth_mw.verifyToken, auth_mw.isAdmin],
        category_controller.createNewCategory
    );
    
    app.put("/ecomm/api/v1/categories/:id",
        [auth_mw.verifyToken, auth_mw.isAdmin],
        category_controller.updateCategory
    );
    
    app.delete("/ecomm/api/v1/categories/:id",
        [auth_mw.verifyToken, auth_mw.isAdmin],
        category_controller.deleteCategory
    );
}