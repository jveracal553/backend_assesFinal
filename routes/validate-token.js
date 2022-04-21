const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.slice(7);
  const { email } = jwt.verify(token, process.env.TOKEN_SECRET);
  req.email = email;
  next();
};

module.exports = verifyToken;
