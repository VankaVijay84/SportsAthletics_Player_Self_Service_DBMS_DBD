const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/:playerId', verifyToken, performanceController.getPerformanceByPlayer);
router.post('/', verifyToken, checkRole(['COACH', 'SPORTS_ADMIN', 'ADMIN']), performanceController.addPerformanceRecord);

router.get('/fitness/:playerId', verifyToken, performanceController.getFitnessByPlayer);
router.post('/fitness', verifyToken, performanceController.addFitnessRecord);

module.exports = router;
