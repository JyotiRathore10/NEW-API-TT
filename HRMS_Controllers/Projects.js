const { sql, poolPromise } = require('../config/db');

exports.getProjectsByIds = async (req, res) => {
  try {
    const { projectIds } = req.body;
    
    if (!projectIds || !Array.isArray(projectIds)) {
      return res.status(400).json({ message: 'Invalid project IDs' });
    }

    const pool = await poolPromise;
    
    // TODO: Implement project retrieval from database
    res.status(200).json({ projects: [] });
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Error getting projects', error: error.message });
  }
};

exports.getEmployeeOptions = async (req, res) => {
  try {
    const pool = await poolPromise;
    
    const result = await pool.request()
      .query('SELECT EmployeeID as id, username as label FROM HRMS_users');

    res.status(200).json({ employees: result.recordset });
  } catch (error) {
    console.error('Error getting employee options:', error);
    res.status(500).json({ message: 'Error getting employee options', error: error.message });
  }
};

exports.getProjectOptions = async (req, res) => {
  try {
    // TODO: Implement project options retrieval
    res.status(200).json({ projects: [] });
  } catch (error) {
    console.error('Error getting project options:', error);
    res.status(500).json({ message: 'Error getting project options', error: error.message });
  }
};
