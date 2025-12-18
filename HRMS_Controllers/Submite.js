const { sql, poolPromise } = require('../config/db');

exports.bulkUpdateTimesheetStatus = async (req, res) => {
  try {
    const { entryIds, status } = req.body;
    
    if (!entryIds || !Array.isArray(entryIds) || !status) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    const pool = await poolPromise;
    
    for (const entryId of entryIds) {
      await pool.request()
        .input('entryId', sql.Int, entryId)
        .input('status', sql.VarChar, status)
        .query('UPDATE timesheet_entries SET status = @status WHERE id = @entryId');
    }

    res.status(200).json({ message: 'Timesheet status updated successfully' });
  } catch (error) {
    console.error('Error updating timesheet status:', error);
    res.status(500).json({ message: 'Error updating timesheet status', error: error.message });
  }
};

exports.submitTimesheet = async (req, res) => {
  try {
    const { timesheetId, employeeId } = req.body;
    
    if (!timesheetId || !employeeId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const pool = await poolPromise;
    
    await pool.request()
      .input('timesheetId', sql.Int, timesheetId)
      .input('status', sql.VarChar, 'submitted')
      .query('UPDATE timesheets SET status = @status WHERE id = @timesheetId');

    res.status(200).json({ message: 'Timesheet submitted successfully' });
  } catch (error) {
    console.error('Error submitting timesheet:', error);
    res.status(500).json({ message: 'Error submitting timesheet', error: error.message });
  }
};
