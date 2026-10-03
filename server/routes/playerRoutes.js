const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/', verifyToken, playerController.getAllPlayers);
router.get('/:id', verifyToken, playerController.getPlayerById);
router.put('/:id', verifyToken, playerController.updatePlayer);
router.delete('/:id', verifyToken, checkRole(['ADMIN', 'SPORTS_ADMIN']), playerController.deletePlayer);

module.exports = router;
