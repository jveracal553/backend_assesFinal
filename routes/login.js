const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const SchemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

router.post("/local/login", async (req, res) => {
  // validaciones
  const { error } = SchemaLogin.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ error: true, mensaje: "usuario no encontrado" });
  }

  const passValida = await bcrypt.compare(req.body.password, user.password);
  if (!passValida)
    return res
      .status(400)
      .json({ error: true, mensaje: "contraseña no valida" });

  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

module.exports = router;
