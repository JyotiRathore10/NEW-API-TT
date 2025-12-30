const pool = require('../config/mysql');
 
exports.getScrapperData = async (req, res) => {
  try {
    const { from, to, connection_from, connection_type } = req.body;
    let query = `
      SELECT  
        p.profile_id,
        po.post,
        p.Designation,
        p.author,
        p.email,
        po.ISMail,
        p.contact_info,
        p.connection_type,
        p.profile_url,
        p.company,
        po.unique_post_id,
        p.connection_from,
        p.created_date
      FROM profile p
      JOIN post po ON p.profile_id = po.profile_id
      WHERE 1=1
    `;
    const params = [];
    if (from && to) {
      query += " AND p.created_date BETWEEN ? AND ?";
      params.push(from + ' 00:00:00', to + ' 23:59:59');
    }
    if (connection_from) {
      query += " AND p.connection_from = ?";
      params.push(connection_from);
    }
    if (connection_type) {
      query += " AND p.connection_type = ?";
      params.push(connection_type);
    }
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Scrapper API error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};