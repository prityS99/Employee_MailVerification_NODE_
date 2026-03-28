const jwt = require("jsonwebtoken");

const authCheck = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authCheck;





// const jwt = require("jsonwebtoken");

// const authCheck = async (req, res, next) => {
//   try {
//     let token;

//     // ✅ 1. Get token from Authorization header
//     if (req.headers.authorization) {
//       // Format: "Bearer TOKEN"
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // ✅ 2. Fallbacks (optional)
//     if (!token) token = req.body?.token;
//     if (!token) token = req.query?.token;

//     // ❌ No token
//     if (!token) {
//       return res.status(401).json({
//         status: false,
//         message: "Token is required",
//       });
//     }

//     // ✅ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = {
//       id: decoded.userId,
//       role: decoded.role,
//     };

//     next();

//   } catch (err) {
//     return res.status(401).json({
//       status: false,
//       message: "Invalid token",
//     });
//   }
// };

// module.exports = authCheck;

