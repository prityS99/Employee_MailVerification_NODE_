const roles = require("../config/roles.json");

const checkPermission = (permission) => {

  return (req, res, next) => {

    const userRole = req.user.role;

    const rolePermissions = roles[userRole];

    if (!rolePermissions.includes(permission)) {

      return res.status(403).json({
        success: false,
        message: "Forbidden: Permission denied"
      });

    }

    next();

  };

};

module.exports = checkPermission;