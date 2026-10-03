const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/', verifyToken, trainingController.getTrainingSessions);
router.post('/', verifyToken, checkRole(['COACH', 'SPORTS_ADMIN', 'ADMIN']), trainingController.createTrainingSession);

router.get('/attendance/:playerId', verifyToken, trainingController.getAttendanceByPlayer);
router.post('/attendance', verifyToken, trainingController.markAttendance);

module.exports = router;
