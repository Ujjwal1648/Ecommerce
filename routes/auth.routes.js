
const authController = require("../controllers/auth.controller")
const authMW = require("../middlewares/auth_mw")
module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/signup",[authMW.verifySignUpBody], authController.signup)

    app.post("/ecomm/api/v1/auth/signin",[authMW.verifySignInBody],authController.signin)
}