const { sql, poolPromise } = require('../config/db');

exports.changePassword = async (req, res) => {
  try {
    const { EmployeeID, oldPassword, newPassword } = req.body;

    if (!EmployeeID || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const pool = await poolPromise;

    // Verify old password
    const user = await pool.request()
      .input('EmployeeID', sql.Int, EmployeeID)
      .input('password', sql.VarChar, oldPassword)
      .query('SELECT * FROM HRMS_users WHERE EmployeeID = @EmployeeID AND password = @password');

    if (user.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // Update password
    await pool.request()
      .input('EmployeeID', sql.Int, EmployeeID)
      .input('newPassword', sql.VarChar, newPassword)
      .query('UPDATE HRMS_users SET password = @newPassword WHERE EmployeeID = @EmployeeID');

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // TODO: Implement password reset email logic
    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Error in forget password:', error);
    res.status(500).json({ message: 'Error processing forget password request', error: error.message });
  }
};
