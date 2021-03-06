const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const schemaRegister = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

router.post("/register", async (req, res) => {
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existeElEmail = await User.findOne({ email: req.body.email });

  if (existeElEmail)
    return res
      .status(400)
      .json({ error: true, mensaje: "email ya registrado" });

  // hash contraseña
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: password,
  });
  try {
    const userDB = await user.save();
    res.json({
      error: null,
      data: userDB,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
