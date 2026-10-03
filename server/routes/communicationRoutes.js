const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { verifyToken } = require('../middleware/auth');

// Documents
router.get('/documents/:playerId', verifyToken, communicationController.getDocumentsByPlayer);
router.post('/documents', verifyToken, communicationController.uploadDocument);
router.delete('/documents/:id', verifyToken, communicationController.deleteDocument);

// Notifications
router.get('/notifications', verifyToken, communicationController.getNotifications);
router.put('/notifications/:id/read', verifyToken, communicationController.markNotificationRead);

// Messages
router.get('/messages', verifyToken, communicationController.getMessages);
router.post('/messages', verifyToken, communicationController.sendMessage);

module.exports = router;
