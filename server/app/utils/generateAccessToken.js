const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

module.exports = generateAccessToken;