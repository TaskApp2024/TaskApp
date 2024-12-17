const express = require('express');
const company = require('../controllers/companyController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/signup', upload.single('companyLogo'), company.signupCompany);
router.get('/verify-email', company.verifyEmail);
router.post('/login',company.login);
router.post('/resend-verification',company.resendMail);

module.exports = router;
