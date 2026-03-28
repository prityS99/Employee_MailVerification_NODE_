const jwt = require("jsonwebtoken");
const tokenModel = require("./../models/token");

const verifyRefreshToken = async (refreshToken) => {
  try {
    const existToken = await tokenModel.findOne({ token: refreshToken });

    if (!existToken) {
      return {
        data: null,
        message: "Invalid refresh token",
      };
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    return {
      data: decoded,
      message: "Valid refresh token",
    };
  } catch (err) {
    return {
      data: null,
      message: "Invalid or expired refresh token",
    };
  }
};

module.exports = verifyRefreshToken;