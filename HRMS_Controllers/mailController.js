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

exports.sendTemplateMail = async (req, res) => {
  try {
    const { email, template, data } = req.body;
    
    if (!email || !template) {
      return res.status(400).json({ message: 'Email and template are required' });
    }

    // TODO: Implement template rendering based on template name
    let htmlContent = `<p>Template: ${template}</p>`;
    
    if (data) {
      htmlContent += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `AstroGuru - ${template}`,
      html: htmlContent
    });

    res.status(200).json({ message: 'Template email sent successfully' });
  } catch (error) {
    console.error('Error sending template email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};
