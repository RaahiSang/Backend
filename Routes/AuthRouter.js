const { signup, login,forgetpassword, resetPassword } = require("../Controllers/Auth_controller");
const { signupValidation, loginValidation,forgetValidation, resetValidation } = require("../Middlewares/AuthValidation");
const { formdataValidation } = require("../Middlewares/Form_Data_Validation");
const router = require("express").Router();

router.post('/signup',signupValidation,signup);
router.post('/login',loginValidation,login);
router.post('/forget-password',forgetValidation,forgetpassword);
router.post('/reset-password',resetValidation, resetPassword);

module.exports ={
    router
};

