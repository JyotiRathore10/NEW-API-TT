const { sql, poolPromise } = require('../config/db');

// ============================================================================
// Get All Hours (Master Data)
// ============================================================================
exports.getHours = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM HRMS_Hours ORDER BY Hours ASC');

    res.status(200).json({
      success: true,
      message: 'Hours retrieved successfully',
      data: result.recordset
    });
  } catch (error) {
    console.error('Error fetching hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hours',
      error: error.message
    });
  }
};

// ============================================================================
// Add New Hours (Master Data)
// ============================================================================
exports.addHours = async (req, res) => {
  try {
    const { Hours, CreatedBy } = req.body;

    if (!Hours || !CreatedBy) {
      return res.status(400).json({
        success: false,
        message: 'Hours and CreatedBy are required'
      });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('Hours', sql.Int, Hours)
      .input('CreatedBy', sql.VarChar, CreatedBy)
      .query(`
        INSERT INTO HRMS_Hours (Hours, CreatedBy, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@Hours, @CreatedBy, GETDATE())
      `);

    res.status(201).json({
      success: true,
      message: 'Hours added successfully',
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error adding hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding hours',
      error: error.message
    });
  }
};

// ============================================================================
// Update Hours (Master Data)
// ============================================================================
exports.updateHours = async (req, res) => {
  try {
    const { HoursId, Hours, ModifiedBy } = req.body;

    if (!HoursId || !Hours || !ModifiedBy) {
      return res.status(400).json({
        success: false,
        message: 'HoursId, Hours, and ModifiedBy are required'
      });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('HoursId', sql.Int, HoursId)
      .input('Hours', sql.Int, Hours)
      .input('ModifiedBy', sql.VarChar, ModifiedBy)
      .query(`
        UPDATE HRMS_Hours
        SET Hours = @Hours, ModifiedBy = @ModifiedBy, ModifiedAt = GETDATE()
        WHERE HoursId = @HoursId
        SELECT @@ROWCOUNT AS affected
      `);

    const affected = result.recordset[0].affected;
    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hours record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hours updated successfully'
    });
  } catch (error) {
    console.error('Error updating hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hours',
      error: error.message
    });
  }
};

// ============================================================================
// Delete Hours (Master Data)
// ============================================================================
exports.deleteHours = async (req, res) => {
  try {
    const { HoursId } = req.body;

    if (!HoursId) {
      return res.status(400).json({
        success: false,
        message: 'HoursId is required'
      });
    }

    const pool = await poolPromise;

    // Check if this hours is being used by any users
    const checkUsage = await pool.request()
      .input('HoursId', sql.Int, HoursId)
      .query('SELECT COUNT(*) AS count FROM HRMS_users WHERE HoursId = @HoursId');

    const usageCount = checkUsage.recordset[0].count;
    if (usageCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete. This hours is assigned to ${usageCount} user(s)`
      });
    }

    const result = await pool.request()
      .input('HoursId', sql.Int, HoursId)
      .query(`
        DELETE FROM HRMS_Hours
        WHERE HoursId = @HoursId
        SELECT @@ROWCOUNT AS affected
      `);

    const affected = result.recordset[0].affected;
    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hours record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hours deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hours',
      error: error.message
    });
  }
};

// ============================================================================
// Get User with Hours Information
// ============================================================================
exports.getUserWithHours = async (req, res) => {
  try {
    const { EmployeeID } = req.body;

    if (!EmployeeID) {
      return res.status(400).json({
        success: false,
        message: 'EmployeeID is required'
      });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('EmployeeID', sql.Int, EmployeeID)
      .query(`
        SELECT 
          u.EmployeeID,
          u.username,
          u.email,
          u.IsManager,
          u.HoursId,
          h.Hours,
          h.CreatedAt,
          h.ModifiedAt
        FROM HRMS_users u
        LEFT JOIN HRMS_Hours h ON u.HoursId = h.HoursId
        WHERE u.EmployeeID = @EmployeeID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User hours retrieved successfully',
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error fetching user hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user hours',
      error: error.message
    });
  }
};

// ============================================================================
// Assign Hours to User
// ============================================================================
exports.assignHoursToUser = async (req, res) => {
  try {
    const { EmployeeID, HoursId, ModifiedBy } = req.body;

    if (!EmployeeID || !HoursId) {
      return res.status(400).json({
        success: false,
        message: 'EmployeeID and HoursId are required'
      });
    }

    const pool = await poolPromise;

    // Verify user exists
    const userCheck = await pool.request()
      .input('EmployeeID', sql.Int, EmployeeID)
      .query('SELECT * FROM HRMS_users WHERE EmployeeID = @EmployeeID');

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify hours exists
    const hoursCheck = await pool.request()
      .input('HoursId', sql.Int, HoursId)
      .query('SELECT * FROM HRMS_Hours WHERE HoursId = @HoursId');

    if (hoursCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hours record not found'
      });
    }

    // Update user with hours
    const result = await pool.request()
      .input('EmployeeID', sql.Int, EmployeeID)
      .input('HoursId', sql.Int, HoursId)
      .input('ModifiedBy', sql.VarChar, ModifiedBy || 'System')
      .query(`
        UPDATE HRMS_users
        SET HoursId = @HoursId, ModifiedBy = @ModifiedBy, ModifiedDate = GETDATE()
        WHERE EmployeeID = @EmployeeID
        SELECT @@ROWCOUNT AS affected
      `);

    const affected = result.recordset[0].affected;
    if (affected === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to assign hours to user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hours assigned to user successfully'
    });
  } catch (error) {
    console.error('Error assigning hours to user:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning hours to user',
      error: error.message
    });
  }
};

// ============================================================================
// Get All Users with Hours Information
// ============================================================================
exports.getAllUsersWithHours = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          u.EmployeeID,
          u.username,
          u.email,
          u.IsManager,
          u.HoursId,
          h.Hours,
          h.CreatedAt,
          h.ModifiedAt
        FROM HRMS_users u
        LEFT JOIN HRMS_Hours h ON u.HoursId = h.HoursId
        ORDER BY u.EmployeeID
      `);

    res.status(200).json({
      success: true,
      message: 'All users with hours retrieved successfully',
      data: result.recordset
    });
  } catch (error) {
    console.error('Error fetching users with hours:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users with hours',
      error: error.message
    });
  }
};
