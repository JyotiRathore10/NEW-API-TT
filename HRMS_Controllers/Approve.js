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
      .query('UPDATE HRMS_TimesheetEntries SET Status = @status WHERE EntryID = @entryId');

    res.status(200).json({ message: 'Entry approved successfully' });
  } catch (error) {
    console.error('Error approving entry:', error);
    res.status(500).json({ message: 'Error approving entry', error: error.message });
  }
};

exports.bulkApproveTimesheetEntries = async (req, res) => {
  try {
    // Support two payload formats:
    // 1) { entryIds: [1,2,3], status: 'Approved' }
    // 2) { entries: [{ EntryID, EmployeeID, Status, ManagerComment, TotalHours }, ...] }
    const { entryIds, status, entries } = req.body;

    const pool = await poolPromise;

    if (Array.isArray(entries) && entries.length > 0) {
      // Handle detailed entries payload
      for (const e of entries) {
        const eid = e.EntryID || e.entryId || e.entryID;
        if (!eid) continue; // skip invalid
        const newStatus = e.Status || status || 'Approved';
        const managerComment = e.ManagerComment || e.managerComment || null;
        const totalHours = typeof e.TotalHours !== 'undefined' ? e.TotalHours : null;

        const reqBuilder = pool.request()
          .input('entryId', sql.Int, eid)
          .input('status', sql.VarChar, newStatus)
          .input('managerComment', sql.NVarChar(500), managerComment);

        if (totalHours !== null) reqBuilder.input('totalHours', sql.Decimal(4,2), totalHours);

        // Update status, manager comment and optionally TotalHours
        await reqBuilder.query(`
          UPDATE HRMS_TimesheetEntries
          SET Status = @status,
              ManagerComment = @managerComment
              ${totalHours !== null ? ', TotalHours = @totalHours' : ''}
          WHERE EntryID = @entryId
        `);
      }

      return res.status(200).json({ message: 'Entries approved successfully' });
    }

    // Legacy simple payload
    if (!entryIds || !Array.isArray(entryIds) || !status) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    for (const entryId of entryIds) {
      await pool.request()
        .input('entryId', sql.Int, entryId)
        .input('status', sql.VarChar, status)
        .query('UPDATE HRMS_TimesheetEntries SET Status = @status WHERE EntryID = @entryId');
    }

    res.status(200).json({ message: 'Entries approved successfully' });
  } catch (error) {
    console.error('Error bulk approving entries:', error);
    res.status(500).json({ message: 'Error bulk approving entries', error: error.message });
  }
};
