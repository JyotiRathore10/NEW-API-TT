const express = require('express');
const multer = require('multer');
const upload = multer();


const authenticateToken = require('../middlewares/authMiddleware');
const {
  getTimesheetEntriesByEmployee,
  createTimesheetEntry,
  updateTimesheetEntry,
  deleteTimesheetEntry,
} = require('../HRMS_Controllers/timesheetController');

const { approveTimesheetEntry, bulkApproveTimesheetEntries } = require('../HRMS_Controllers/Approve');
const { getProjectsByIds, getEmployeeOptions, getProjectOptions } = require('../HRMS_Controllers/Projects');
const { bulkUpdateTimesheetStatus, submitTimesheet } = require('../HRMS_Controllers/Submite');

const loginController = require('../HRMS_Controllers/login');
const { changePassword, forgetPassword } = require('../HRMS_Controllers/UserManagment');
const { getUserData, getAllHRMSDataWithAutoFill, sendWelcomeMails, sendBulkMails, sendmailwithattachments } = require('../HRMS_Controllers/Mail');
const { sendTemplateMail } = require('../HRMS_Controllers/mailController');



const router = express.Router();

// ✅ Log all incoming requests to this router
router.use((req, res, next) => {
  console.log(`📨 HRMS Route: ${req.method} ${req.path}`);
  console.log('📦 Request Body:', req.body);
  next();
});

// Public route
router.post('/login', loginController.login);

// Protected routes
router.post('/assigned', (req, res, next) => {
  console.log('🎯 /assigned endpoint called');
  getTimesheetEntriesByEmployee(req, res, next);
});
router.post('/entries', (req, res, next) => {
  console.log('🎯 /entries endpoint called');
  getTimesheetEntriesByEmployee(req, res, next);
});
router.post('/projects', getProjectsByIds);
router.post('/entry', createTimesheetEntry);
router.post('/edit', updateTimesheetEntry);
router.post('/delete', deleteTimesheetEntry);
router.post('/approve', approveTimesheetEntry);
router.post('/bulk-update', bulkUpdateTimesheetStatus);
router.post('/submit', submitTimesheet);
router.post('/bulk', bulkApproveTimesheetEntries);
router.post('/changePassword', changePassword);
router.post('/forgetPassword', forgetPassword);
router.post('/getUserData', getUserData);
router.post('/getAllHRMSDataWithAutoFill', getAllHRMSDataWithAutoFill);
router.post('/sendTemplateMail', sendTemplateMail); // New route for sending template mail
router.post('/sendBulkMails', sendBulkMails);
router.post('/sendmailwithattachments',upload.array('pdfs'),sendmailwithattachments);
router.post('/sendWelcomeMails', sendWelcomeMails);
router.get('/employeeOptions', getEmployeeOptions);
router.get('/projectOptions', getProjectOptions);

module.exports = router;