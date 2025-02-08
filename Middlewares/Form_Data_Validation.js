const Joi = require("joi");

const formdataValidation = (req, res, next) => {
    const schema = Joi.object({
    VendorType: Joi.string().min(3).max(100).required(),
    VendorName: Joi.string().min(3).max(100).required(),
    Location: Joi.string().min(3).max(200).required(),
    Rating: Joi.number().min(0).max(5).required(),
    Price: Joi.number().min(0).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  next();
};



module.exports = {
    formdataValidation
}
