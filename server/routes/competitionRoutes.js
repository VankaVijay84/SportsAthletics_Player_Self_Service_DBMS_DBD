const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/', verifyToken, competitionController.getCompetitions);
router.post('/', verifyToken, checkRole(['COACH', 'SPORTS_ADMIN', 'ADMIN']), competitionController.createCompetition);
router.post('/:id/register', verifyToken, competitionController.registerForCompetition);

router.get('/achievements/:playerId', verifyToken, competitionController.getAchievementsByPlayer);
router.post('/achievements', verifyToken, competitionController.addAchievement);

module.exports = router;
