const { sql, poolPromise } = require('../config/db');

exports.approveTimesheetEntry = async (req, res) => {
  try {
    const { entryId, status } = req.body;
    
    if (!entryId || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const pool = await poolPromise;
    await pool.request()
      .input('entryId', sql.Int, entryId)
      .input('status', sql.VarChar, status)
      .query('UPDATE timesheet_entries SET status = @status WHERE id = @entryId');

    res.status(200).json({ message: 'Entry approved successfully' });
  } catch (error) {
    console.error('Error approving entry:', error);
    res.status(500).json({ message: 'Error approving entry', error: error.message });
  }
};

exports.bulkApproveTimesheetEntries = async (req, res) => {
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

    res.status(200).json({ message: 'Entries approved successfully' });
  } catch (error) {
    console.error('Error bulk approving entries:', error);
    res.status(500).json({ message: 'Error bulk approving entries', error: error.message });
  }
};
