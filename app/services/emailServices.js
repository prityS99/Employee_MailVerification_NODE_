

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // 👇 ADD THIS
  pool: true,
  name: "Admin"  // Gmail needs sender name
});


// Define your frontend URL here
const LOGIN_URL = process.env.FRONTEND_URL || "http://localhost:3000/login";
exports.sendCredentialsEmail = async (email, subject, htmlContent) => {
  const mailOptions = {
    from: '"HR System" <your-email@gmail.com>',
    to: email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
          .container { max-width: 500px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; border-radius: 16px 16px 0 0; }
          .password-box { background: #fef3c7; border: 3px solid #f59e0b; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 10px 25px rgba(245,158,11,0.2); }
          .password { font-size: 36px; font-weight: 900; letter-spacing: 6px; color: #b45309; font-family: 'Courier New', monospace; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
          .action-btn { display: inline-block; padding: 16px 32px; background: #3b82f6; color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 New Password</h1>
            <p>Your temporary login password</p>
          </div>
          
          <div class="password-box">
            <div style="font-size: 18px; color: #92400e; margin-bottom: 15px; font-weight: 600;">
              Your New Password:
            </div>
            <div class="password">${htmlContent.match(/New Password:\s*(.+)/)?.[1] || '****'}</div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${LOGIN_URL}" class="action-btn">Login Now →</a>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <p><strong>Next Steps:</strong></p>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
              <li>Login with this password</li>
              <li>Change to your own secure password</li>
              <li>Password expires in 24 hours</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>© HR System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  return transporter.sendMail(mailOptions);
};

