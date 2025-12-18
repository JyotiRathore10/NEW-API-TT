const { sql, poolPromise } = require('../config/db');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('EmployeeID', sql.Int, userId)
      .query('SELECT * FROM HRMS_users WHERE EmployeeID = @EmployeeID');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: result.recordset[0] });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ message: 'Error getting user data', error: error.message });
  }
};

exports.getAllHRMSDataWithAutoFill = async (req, res) => {
  try {
    const pool = await poolPromise;
    
    // TODO: Implement comprehensive HRMS data retrieval
    res.status(200).json({ data: {} });
  } catch (error) {
    console.error('Error getting HRMS data:', error);
    res.status(500).json({ message: 'Error getting HRMS data', error: error.message });
  }
};

exports.sendWelcomeMails = async (req, res) => {
  try {
    const { emails, userName } = req.body;
    
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ message: 'Invalid email list' });
    }

    for (const email of emails) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Welcome to AstroGuru',
        html: `<p>Welcome ${userName || 'User'}! Thank you for joining AstroGuru.</p>`
      });
    }

    res.status(200).json({ message: 'Welcome emails sent successfully' });
  } catch (error) {
    console.error('Error sending welcome emails:', error);
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
};

exports.sendBulkMails = async (req, res) => {
  try {
    const { emails, subject, body } = req.body;
    
    if (!emails || !Array.isArray(emails) || !subject || !body) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    for (const email of emails) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: subject,
        html: body
      });
    }

    res.status(200).json({ message: 'Bulk emails sent successfully' });
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    res.status(500).json({ message: 'Error sending bulk emails', error: error.message });
  }
};

exports.sendmailwithattachments = async (req, res) => {
  try {
    const { emails, subject, body } = req.body;
    const files = req.files;
    
    if (!emails || !subject || !body) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const attachments = files ? files.map(file => ({
      filename: file.originalname,
      buffer: file.buffer
    })) : [];

    for (const email of emails) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: subject,
        html: body,
        attachments: attachments
      });
    }

    res.status(200).json({ message: 'Emails with attachments sent successfully' });
  } catch (error) {
    console.error('Error sending emails with attachments:', error);
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
};
