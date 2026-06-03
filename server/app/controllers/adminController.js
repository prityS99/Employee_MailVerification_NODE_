const mongoose = require("mongoose");
const User = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");
const OTPModel = require("../models/otpModel");
const { sendOtpEmail, sendCredentialsEmail } = require("../utils/sendMail");
const generatePassword = require("../utils/generatePassword");
const tokenModel = require("../models/token");
const generateAccessToken = require("../utils/generateAccessToken");

class AdminController {
  //REGISTER//

  async register(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: "admin",
      });

      if (!user || !user._id) {
        return res.status(500).json({
          success: false,
          message: "User creation failed",
        });
      }

      await sendOtpEmail(req, user);
      return res.status(201).json({
        success: true,
        message: "Registered successfully. OTP sent to email, please verify.",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  }


  // VERIFY MAIL //
  async verify(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Already verified",
        });
      }

      const otpRecord = await OTPModel.findOne({
        userId: user._id,
        otp: otp.toString(),
      });
      if (!otpRecord) {
        await sendEmail(req, user);
        return res.status(400).json({
          success: false,
          message: "Invalid OTP, new OTP sent",
        });
      }

      user.isVerified = true;
      await user.save();

      await OTPModel.deleteMany({ userId: user._id });

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Verification failed",
      });
    }
  }

  //LOGIN //

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }

      // 1️⃣ Access token (JWT)
      const accessToken = generateAccessToken({
        userId: user._id,
        role: user.role,
      });

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "10d" },
      );

      await tokenModel.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
      });

      // 3️⃣ Cookies
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 5, // 10 seconds
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
      });

      // ✅ Return data (no `token` variable, just `accessToken`)
      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DASHBOARD //
  async dashboard(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "welcome to user dashboard",
        data: req.user,
      });
    } catch (error) {
      console.log(error);
    }
  }


  // PROFILE //
  async profile(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Welcome to user dashboard",
        data: req.user,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // GET ME //
  async getMe(req, res) {
    try {
      const token = req.cookies.access_token;

      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Use the exact property name you used during jwt.sign()
      const user = await User.findById(decoded.userId || decoded.id).select(
        "-password",
      );

      if (!user) {
        return res.status(404).json({ message: "User no longer exists" });
      }

      // Return the user object in the format your frontend expects
      res.json({
        success: true,
        user: user,
      });
    } catch (err) {
      // If token is expired or secret is wrong, clear the cookie to be safe
      res.clearCookie("access_token");
      res.status(401).json({ message: "Invalid or expired token" });
    }
  }
  // LOGOUT //

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        // Remove from DB
        await tokenModel.deleteOne({ token: refreshToken });
      }

      // Clear cookies
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.json({
        success: true,
        message: "Logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }

  // CREATE EMPLOYEE /

  async createEmployee(req, res) {
    try {
      const { name, email } = req.body;

      // 1. Basic Validation
      if (!name || !email) {
        return res
          .status(400)
          .json({ success: false, message: "Name and email are required" });
      }

      // 2. Check existence
      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Employee already exists" });
      }

      // 3. Generate Credentials
      const tempPassword = generatePassword(6);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const loginUrl = `${frontendUrl}/login?email=${encodeURIComponent(email)}`;
      try {
        await sendCredentialsEmail(
          email,
          "Welcome to the Team",
          `
      <div style="font-family: sans-serif; max-width: 500px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333;">Hi ${name},</h2>
        <p>Your admin account has been created. Please log in using the button below:</p>
        
        <div style="margin: 20px 0;">
          <a href="${loginUrl}" 
             style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Login to Dashboard
          </a>
        </div>

        <p style="font-size: 13px; color: #666;">
          <strong>Credentials:</strong><br>
          Email: ${email}<br>
          Temp Password: <b>${tempPassword}</b>
        </p>
        <hr />
        <p style="font-size: 11px; color: #999;">If the button doesn't work, copy this: ${loginUrl}</p>
      </div>
      `,
        );
      } catch (emailError) {
        console.error("Email failed to send:", emailError);
        return res.status(500).json({
          success: false,
          message: "Failed to send credential email. Employee not created.",
        });
      }

      // 5. Create the User
      const employee = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "employee",
        isVerified: true,
        isFirstLogin: true,
      });

      return res.status(201).json({
        success: true,
        message: "Employee created and credentials sent",
        data: {
          _id: employee._id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        },
      });
    } catch (error) {
      console.error("System Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // DELETE EMPLOYEE //

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;

      // 🔍 LOG EVERYTHING
      console.log("🆔 ID received:", id);
      console.log("🆔 ID type:", typeof id);
      console.log("🔑 Auth user:", req.user?._id);

      // 1. VALIDATE ID FORMAT
      if (!id || id.length !== 24) {
        console.log("❌ ID invalid length");
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID",
        });
      }

      // 2. CHECK EXISTS FIRST
      const employee = await User.findById(id);
      console.log("👤 Employee found:", employee ? employee.name : "NOT FOUND");

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      if (employee.role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "Can only delete employees",
        });
      }

      // 3. CLEANUP OTP FIRST
      await OTPModel.deleteMany({ userId: id });

      // 4. DELETE
      const result = await User.findByIdAndDelete(id);
      console.log("🗑️ Delete result:", result);

      return res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      console.error("💥 DELETE ERROR:", error.message);
      console.error("💥 FULL ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete employee",
      });
    }
  }

  // EMPLOYEE LOGIN //

  async employeeLogin(req, res) {
    try {
      const { email, password } = req.body;

      // 1️⃣ Find employee
      const user = await User.findOne({ email, role: "employee" });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // 2️⃣ Check password exists
      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: "Password not set. Please reset password first.",
        });
      }

      // 3️⃣ Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      console.log("Entered:", password);
      console.log("Stored:", user.password);
      console.log("Match:", isMatch);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }

      // 4️⃣ Generate token
      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );

      // 5️⃣ Send response
      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
        },
      });
    } catch (error) {
      console.error("Employee login error:", error);

      return res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  }

  // async employeeLogin(req, res) {
  //   const { email, password } = req.body;

  //   const user = await User.findOne({ email, role: "employee" });
  //   console.log("PLAIN password:", password);
  //   console.log("HASH in DB:", user.password);
  //   console.log("user.password:", user?.password); // must be $2b$...
  //   console.log("isMatch:", isMatch);

  //   if (!user) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Employee not found" });
  //   }

  //   const isMatch = await bcrypt.compare(password, user.password);

  //   if (!isMatch) {
  //     return res
  //       .status(400)
  //       .json({ success: false, message: "Invalid password" });
  //   }

  //   const token = jwt.sign(
  //     { id: user._id, role: user.role },
  //     process.env.JWT_SECRET_KEY,
  //     { expiresIn: "1d" },
  //   );

  //   return res.status(200).json({
  //     success: true,
  //     message: "Login successful",
  //     isFirstLogin: user.isFirstLogin,
  //     role: user.role,
  //     token,
  //   });
  // }

  // CHANGE PASSWORD //
  async changePasswordByEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // 1. Find employee
      const employee = await User.findOne({
        email,
        role: "employee",
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // 2. Generate random 6-char password
      const newPassword = generatePassword(6);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 3. Update password
      employee.password = hashedPassword;
      employee.isFirstLogin = true;
      await employee.save();

      await sendCredentialsEmail(
        email,
        "New Password Generated",
        `
      <h2>New Password</h2>
      <p>Your new password: <strong>${newPassword}</strong></p>
      <p>Please login and change your password.</p>
      `,
      );

      return res.status(200).json({
        success: true,
        message: `New 6-digit password sent to ${email}`,
      });
    } catch (error) {
      console.error("changePasswordByEmail error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to reset password",
      });
    }
  }

  // ALL EMPLOYEE //
  async getEmployee(req, res) {
    try {
      const data = await User.find();
      console.log("Usersfetched : ", data.length);

      return res.status(201).json({
        success: true,
        message: "Employee List",
        total: data.length,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  //RESET PASSWORD //
  async resetPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const userId = req.user.id;

      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: "Password is required",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      console.log("newPassword:", newPassword);
      console.log("hashedPassword:", hashedPassword);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
          isFirstLogin: false,
        },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Password updated successfully. Welcome back!",
      });
    } catch (error) {
      console.error("Reset password error:", error);

      return res.status(500).json({
        success: false,
        message: "Update failed",
      });
    }
  }
}

module.exports = new AdminController();
