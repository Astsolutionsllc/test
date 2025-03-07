const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController.js'); // Add .js extension
const authMiddleware = require('../middleware/authMiddleware.js');
const upload = require('../utils/upload.js');

router.post('/', authMiddleware, licenseController.addLicense);
router.post('/renew', authMiddleware, upload.single('document'), licenseController.renewLicense);
router.get('/', authMiddleware, licenseController.getLicenses);

module.exports = router;