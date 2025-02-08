const { FillFormData } = require("../Controllers/Form_Data_controller");
const { formdataValidation } = require("../Middlewares/Form_Data_Validation");
const router = require("express").Router();

router.post('/form-data',formdataValidation,FillFormData );

module.exports ={
    router
};

