const Joi = require("joi");
const { objectId } = require("./custom.validation");

 const getUser = {
  params: Joi.object().keys({
    // for custom validation use --> .custom(custom_validation_here)
    userId: Joi.string().custom(objectId),
  }),
};

const setAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    address: Joi.string().required().min(20),
  }),
};

module.exports = {
  getUser,
  setAddress,
};
