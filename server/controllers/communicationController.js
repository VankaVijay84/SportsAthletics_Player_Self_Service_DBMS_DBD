const { query } = require('../config/db');

// --- Documents ---
exports.getDocumentsByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const docs = await query(
      `SELECT * FROM documents WHERE player_id = ? ORDER BY uploaded_date DESC`,
      [playerId]
    );

    return res.status(200).json({
      success: true,
      message: 'Documents retrieved',
      data: docs
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { player_id, doc_name, doc_type, file_url, file_size } = req.body;
    const targetPlayerId = player_id || req.user?.player_id || 1;

    if (!doc_name || !doc_type) {
      return res.status(400).json({ success: false, message: 'Document name and type are required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const url = file_url || `/documents/${doc_name.toLowerCase().replace(/\s+/g, '_')}`;

    const result = await query(
      `INSERT INTO documents (
        player_id, doc_name, doc_type, file_url, file_size, uploaded_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [targetPlayerId, doc_name, doc_type, url, file_size || '1.5 MB', today, 'Verified']
    );

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { id: result.insertId, file_url: url }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const docId = req.params.id;
    await query('DELETE FROM documents WHERE id = ?', [docId]);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Notifications ---
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifs = await query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    const unreadCount = notifs.filter(n => !n.is_read).length;

    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data: {
        notifications: notifs,
        unreadCount
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notifId = req.params.id;
    const userId = req.user.id;

    if (notifId === 'all') {
      await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    } else {
      await query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notifId, userId]);
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- Messages ---
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.query;

    if (contactId) {
      const chat = await query(
        `SELECT m.*, 
                su.email as sender_email, ru.email as receiver_email
         FROM messages m
         LEFT JOIN users su ON m.sender_id = su.id
         LEFT JOIN users ru ON m.receiver_id = ru.id
         WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
         ORDER BY m.created_at ASC`,
        [userId, contactId, contactId, userId]
      );

      // Mark unread messages as read
      await query('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?', [contactId, userId]);

      return res.status(200).json({
        success: true,
        data: chat
      });
    }

    // Get list of recent contacts / conversations
    const conversations = await query(
      `SELECT u.id as user_id, u.email, u.role, u.avatar_url,
              p.full_name as player_name, c.full_name as coach_name
       FROM users u
       LEFT JOIN players p ON u.id = p.user_id
       LEFT JOIN coaches c ON u.id = c.user_id
       WHERE u.id != ?`,
      [userId]
    );

    conversations.forEach(c => {
      c.display_name = c.player_name || c.coach_name || (c.role === 'ADMIN' ? 'System Administrator' : 'Sports Admin');
    });

    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ success: false, message: 'Receiver ID and content are required' });
    }

    const result = await query(
      `INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES (?, ?, ?, ?)`,
      [senderId, receiver_id, content, 0]
    );

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { id: result.insertId, sender_id: senderId, receiver_id, content, created_at: new Date().toISOString() }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
