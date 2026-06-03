const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const authCheck = require ("../middlewares/authMiddleware");
const refreshController = require('../controllers/refreshController');

// 🔐 Admin Auth
router.post("/register", adminController.register);
router.post("/verify", adminController.verify);
router.post("/login", adminController.login);
router.post("/refresh", refreshController.refresh); 
router.post("/logout", adminController.logout); 
router.delete('/delete-employee/:id', authCheck, adminController.deleteEmployee);
router.post("/change-password-by-email", authCheck, adminController.changePasswordByEmail);
router.get("/me", adminController.getMe)
// 👨‍💼 Employee
router.post("/create-employee", adminController.createEmployee);
router.post("/employee/login",  adminController.employeeLogin);
router.post("/reset-password/:id", authCheck, adminController.resetPassword);

// 📊 Dashboard
router.get("/dashboard", authCheck, adminController.dashboard);
router.get("/employee", adminController.getEmployee)

module.exports = router;