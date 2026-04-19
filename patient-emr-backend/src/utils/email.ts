import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Create email transporter
 * Uses SMTP config from environment variables
 * Falls back to Ethereal (test) email in development
 */
const createTransporter = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Development: use Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('📧 Dev email account:', testAccount.user);
  return transporter;
};

/**
 * Send an email
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Patient EMR System" <noreply@emr.health>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email sent:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw — email failure shouldn't break the auth flow in dev
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Failed to send email');
    }
  }
};

/**
 * Email templates
 */
export const emailTemplates = {
  welcomeNewUser: (firstName: string, email: string, tempPassword: string, role: string) => ({
    subject: 'Welcome to Patient EMR System — Your Account is Ready',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Patient EMR</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background: #F8F9FA; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
          .header { background: linear-gradient(135deg, #4A90E2 0%, #2ECC71 100%); padding: 40px 32px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; }
          .body { padding: 40px 32px; }
          .greeting { font-size: 20px; font-weight: 600; color: #202124; margin-bottom: 16px; }
          .text { color: #5F6368; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
          .credentials-box { background: #F0F7FF; border: 1px solid #C7E0FE; border-radius: 12px; padding: 24px; margin: 24px 0; }
          .credentials-box h3 { color: #4A90E2; margin: 0 0 16px; font-size: 16px; }
          .credential-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #E0EFFE; }
          .credential-row:last-child { border-bottom: none; }
          .credential-label { color: #5F6368; font-size: 14px; }
          .credential-value { color: #202124; font-weight: 600; font-size: 14px; font-family: monospace; background: white; padding: 4px 8px; border-radius: 6px; }
          .role-badge { display: inline-block; background: #4A90E2; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: capitalize; }
          .cta-button { display: block; background: linear-gradient(135deg, #4A90E2, #2ECC71); color: white; text-decoration: none; text-align: center; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; margin: 32px 0; }
          .warning { background: #FFF8E1; border: 1px solid #FFE082; border-radius: 8px; padding: 16px; color: #F57F17; font-size: 14px; }
          .footer { background: #F8F9FA; padding: 24px 32px; text-align: center; color: #9CA3AF; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 Patient EMR System</h1>
            <p>Healthcare Management Reimagined</p>
          </div>
          <div class="body">
            <p class="greeting">Welcome, ${firstName}! 👋</p>
            <p class="text">
              Your account has been created by the system administrator. You now have access to the 
              Patient EMR System as a <span class="role-badge">${role}</span>.
            </p>
            <div class="credentials-box">
              <h3>🔐 Your Login Credentials</h3>
              <div class="credential-row">
                <span class="credential-label">Email Address</span>
                <span class="credential-value">${email}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Temporary Password</span>
                <span class="credential-value">${tempPassword}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Role</span>
                <span class="credential-value">${role}</span>
              </div>
            </div>
            <div class="warning">
              ⚠️ <strong>Important:</strong> Please change your password immediately after your first login. 
              This temporary password will expire in 48 hours.
            </div>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="cta-button">
              Login to Your Account →
            </a>
            <p class="text">
              If you have any questions or need assistance, please contact your system administrator.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Patient EMR System. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Patient EMR System!\n\nYour account has been created.\nEmail: ${email}\nTemporary Password: ${tempPassword}\nRole: ${role}\n\nPlease login and change your password immediately.`,
  }),

  passwordReset: (firstName: string, resetUrl: string) => ({
    subject: 'Reset Your Password — Patient EMR System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background: #F8F9FA; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
          .header { background: linear-gradient(135deg, #4A90E2 0%, #2ECC71 100%); padding: 40px 32px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .body { padding: 40px 32px; }
          .greeting { font-size: 20px; font-weight: 600; color: #202124; margin-bottom: 16px; }
          .text { color: #5F6368; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
          .cta-button { display: block; background: linear-gradient(135deg, #4A90E2, #2ECC71); color: white; text-decoration: none; text-align: center; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; margin: 32px 0; }
          .expiry-note { background: #FFF3E0; border: 1px solid #FFCC80; border-radius: 8px; padding: 16px; color: #E65100; font-size: 14px; }
          .footer { background: #F8F9FA; padding: 24px 32px; text-align: center; color: #9CA3AF; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Patient EMR System</p>
          </div>
          <div class="body">
            <p class="greeting">Hi ${firstName},</p>
            <p class="text">
              We received a request to reset your password. Click the button below to create a new password.
              If you didn't request this, you can safely ignore this email.
            </p>
            <a href="${resetUrl}" class="cta-button">Reset My Password →</a>
            <div class="expiry-note">
              ⏰ This link will expire in <strong>24 hours</strong>. After that, you'll need to request a new reset link.
            </div>
            <p class="text" style="margin-top: 24px; font-size: 13px; color: #9CA3AF;">
              If the button doesn't work, copy and paste this URL into your browser:<br>
              <a href="${resetUrl}" style="color: #4A90E2; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Patient EMR System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${firstName},\n\nReset your password by visiting:\n${resetUrl}\n\nThis link expires in 24 hours.`,
  }),

  passwordChanged: (firstName: string) => ({
    subject: 'Password Changed Successfully — Patient EMR System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; background: #F8F9FA; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
          .header { background: linear-gradient(135deg, #2ECC71 0%, #4A90E2 100%); padding: 40px 32px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .body { padding: 40px 32px; }
          .text { color: #5F6368; font-size: 15px; line-height: 1.6; }
          .success-box { background: #F0FDF4; border: 1px solid #BBFBCF; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
          .footer { background: #F8F9FA; padding: 24px 32px; text-align: center; color: #9CA3AF; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>✅ Password Updated</h1></div>
          <div class="body">
            <p class="text">Hi ${firstName},</p>
            <div class="success-box">
              <p style="color: #16A34A; font-weight: 600; font-size: 16px; margin: 0;">Your password has been changed successfully.</p>
            </div>
            <p class="text">If you did not make this change, please contact your administrator immediately.</p>
          </div>
          <div class="footer"><p>© ${new Date().getFullYear()} Patient EMR System</p></div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${firstName}, your password has been changed successfully. If you didn't do this, contact your administrator.`,
  }),
};
