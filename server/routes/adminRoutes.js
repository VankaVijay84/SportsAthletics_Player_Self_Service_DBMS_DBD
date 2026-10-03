const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/stats', verifyToken, adminController.getAdminStats);

router.get('/sports', verifyToken, adminController.getSports);
router.post('/sports', verifyToken, checkRole(['SPORTS_ADMIN', 'ADMIN']), adminController.createSport);

router.get('/teams', verifyToken, adminController.getTeams);
router.post('/teams', verifyToken, checkRole(['SPORTS_ADMIN', 'ADMIN']), adminController.createTeam);

router.get('/coaches', verifyToken, adminController.getCoaches);

module.exports = router;
