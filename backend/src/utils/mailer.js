const nodemailer = require('nodemailer');
require('dotenv').config();

let cachedTransporter = null;

const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_PASS || process.env.SMTP_PASS;

  if (user && pass) {
    console.log(`✉️ Mailer configured with Gmail account: ${user}`);
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
    return cachedTransporter;
  }

  // Create Ethereal test SMTP account if no Gmail credentials provided in .env
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log(`✉️ Created Ethereal Test Email Account: ${testAccount.user}`);
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      },
      tls: { rejectUnauthorized: false }
    });
    return cachedTransporter;
  } catch (e) {
    console.warn('Fallback to default transport:', e.message);
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true
    });
    return cachedTransporter;
  }
};

const sendRegistrationEmail = async (userEmail, userName, rollNo, dept) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: '"GDG Connect - AI Freshers Portal" <no-reply@freshersconnect.edu>',
      to: userEmail,
      subject: '🎉 Welcome to GDG Connect Portal - Official Student Registration Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #4285F4; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="color: #4285F4; margin: 0;">🎓 GDG Connect Portal</h1>
            <p style="color: #666; margin: 4px 0 0 0;">Official AI Freshers Orientation Portal</p>
          </div>
          
          <h2 style="color: #333;">Welcome on board, ${userName}! 🎉</h2>
          <p style="color: #555; line-height: 1.6;">Your student registration for <strong>GDG Connect</strong> has been successfully confirmed!</p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #34A853; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #34A853;">📋 Student Profile Summary</h3>
            <p style="margin: 4px 0;"><strong>Name:</strong> ${userName}</p>
            <p style="margin: 4px 0;"><strong>Registered Email:</strong> ${userEmail}</p>
            <p style="margin: 4px 0;"><strong>Department:</strong> ${dept || 'Computer Science & Engineering'}</p>
            <p style="margin: 4px 0;"><strong>Roll Number:</strong> ${rollNo || 'CSE2026001'}</p>
          </div>

          <p style="color: #555;">You can now access your Digital Student ID Card, register for the Freshers Party Fiesta 2026, join campus clubs, and download Regulation 2024 Syllabuses!</p>
          
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px; color: #888; font-size: 12px;">
            <p>© 2026 GDG Campus Ambassador Team. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📬 EMAIL DISPATCHED TO: ${userEmail}`);
    if (previewUrl) {
      console.log(`🔗 PREVIEW DELIVERED EMAIL IN BROWSER: ${previewUrl}`);
    }
    return { success: true, previewUrl };
  } catch (err) {
    console.log(`✉️ Email dispatch error: ${err.message}`);
    return { success: false };
  }
};

const sendPartyPassEmail = async (userEmail, userName, foodPref, tshirtSize) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: '"GDG Connect - Freshers Fiesta" <fiesta@freshersconnect.edu>',
      to: userEmail,
      subject: '🎟️ Your Freshers Fiesta 2026 Party Entry Pass Confirmed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <div style="text-align: center; background: linear-gradient(135deg, #6200ee, #03dac6); padding: 20px; border-radius: 8px; color: white; margin-bottom: 20px;">
            <h1 style="margin: 0;">🎉 Freshers Fiesta 2026</h1>
            <p style="margin: 4px 0 0 0; font-weight: bold;">OFFICIAL ENTRY PASS</p>
          </div>
          
          <h2>Hey ${userName}! 🚀</h2>
          <p>Your registration for the grand <strong>Freshers Welcome Fiesta 2026</strong> is locked and confirmed!</p>
          
          <div style="background-color: #f1f3f4; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6200ee;">🎟️ Pass Details</h3>
            <p style="margin: 4px 0;"><strong>Attendee:</strong> ${userName} (${userEmail})</p>
            <p style="margin: 4px 0;"><strong>Catering Choice:</strong> ${foodPref === 'veg' ? '🥗 Vegetarian Dinner Box' : '🍗 Non-Vegetarian Dinner Box'}</p>
            <p style="margin: 4px 0;"><strong>Souvenir T-Shirt Size:</strong> Size ${tshirtSize}</p>
            <p style="margin: 4px 0;"><strong>Date & Venue:</strong> August 15, 2026 at Main Campus Auditorium (6:00 PM)</p>
          </div>

          <p style="color: #555;">Please present your digital QR pass from the portal at the auditorium gate for entry!</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`📬 PARTY PASS EMAIL DISPATCHED TO: ${userEmail}`);
    if (previewUrl) {
      console.log(`🔗 PREVIEW PARTY PASS EMAIL IN BROWSER: ${previewUrl}`);
    }
    return { success: true, previewUrl };
  } catch (err) {
    return { success: false };
  }
};

const sendClubRegistrationEmail = async (userEmail, userName, clubName) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: '"GDG Connect - Student Clubs" <clubs@freshersconnect.edu>',
      to: userEmail,
      subject: `🚀 Membership Confirmed: Welcome to ${clubName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <h2 style="color: #4285F4;">Welcome to ${clubName}, ${userName}! 🎉</h2>
          <p style="color: #555;">Your registration for <strong>${clubName}</strong> has been officially processed.</p>
          <p style="color: #555;">You will receive event schedules, workshop links, and mentor meeting updates directly at <strong>${userEmail}</strong>.</p>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    return { success: true, previewUrl };
  } catch (err) {
    return { success: false };
  }
};

module.exports = { sendRegistrationEmail, sendPartyPassEmail, sendClubRegistrationEmail };
