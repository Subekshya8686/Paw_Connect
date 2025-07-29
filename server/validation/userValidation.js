// const joi = require("joi");

// const userSchema = joi.object({
//   name: joi.string().required(),
//   age: joi.number().required(),

// });

const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/) // Allows only numbers with 10-15 digits
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Phone number must be between 10 and 15 digits and contain only numbers",
    }),
  address: Joi.string().min(5).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters long",
  }),
  role: Joi.string().valid("admin", "applicant").default("applicant").messages({
    "any.only": "Role must be either 'admin' or 'applicant'",
  }),
});

function UserValidation(req, res, next) {
  const { name, email, password, phone, address, role } = req.body;
  const { error } = userValidationSchema.validate({
    name,
    email,
    password,
    phone,
    address,
    role,
  });
  if (error) {
    return res.json(error);
  }
  next();
}

module.exports = UserValidation;

// function userValidation(req, res, next) {
//   const { name, age } = req.body;
//   const { error } = userSchema.validate({ name, age });
//   if (error) {
//     return res.status(422).json(error);
//   }
//   next();
// }

// module.exports = userValidation;
