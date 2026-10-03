const { query } = require('../config/db');

exports.getAllPlayers = async (req, res) => {
  try {
    const { search, sportId, teamId, sortBy, order } = req.query;

    let sql = `
      SELECT p.*, s.name as sport_name, t.name as team_name, u.avatar_url
      FROM players p
      LEFT JOIN sports s ON p.sport_id = s.id
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (p.full_name LIKE ? OR p.player_id_code LIKE ? OR p.email LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (sportId) {
      sql += ` AND p.sport_id = ?`;
      params.push(sportId);
    }

    if (teamId) {
      sql += ` AND p.team_id = ?`;
      params.push(teamId);
    }

    let sortCol = 'p.full_name';
    if (sortBy === 'performance') sortCol = 'p.performance_score';
    else if (sortBy === 'attendance') sortCol = 'p.attendance_percentage';
    else if (sortBy === 'code') sortCol = 'p.player_id_code';

    const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${sortCol} ${sortOrder}`;

    const players = await query(sql, params);

    return res.status(200).json({
      success: true,
      message: 'Players list retrieved successfully',
      data: players
    });
  } catch (err) {
    console.error('getAllPlayers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch players' });
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const playerId = req.params.id;
    const players = await query(
      `SELECT p.*, s.name as sport_name, s.category as sport_category, 
              t.name as team_name, c.full_name as coach_name, u.avatar_url
       FROM players p
       LEFT JOIN sports s ON p.sport_id = s.id
       LEFT JOIN teams t ON p.team_id = t.id
       LEFT JOIN coaches c ON t.coach_id = c.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = ? OR p.user_id = ?`,
      [playerId, playerId]
    );

    if (players.length === 0) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    const player = players[0];

    // Fetch counts for dashboard & profile card
    const trainingCount = await query(`SELECT COUNT(*) as count FROM training_attendance WHERE player_id = ?`, [player.id]);
    const compCount = await query(`SELECT COUNT(*) as count FROM competition_registrations WHERE player_id = ?`, [player.id]);
    const achCount = await query(`SELECT COUNT(*) as count FROM achievements WHERE player_id = ?`, [player.id]);

    player.stats = {
      trainingSessions: trainingCount[0]?.count || 0,
      competitions: compCount[0]?.count || 0,
      achievements: achCount[0]?.count || 0
    };

    return res.status(200).json({
      success: true,
      message: 'Player details fetched',
      data: player
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const playerId = req.params.id;
    const {
      full_name, phone, dob, gender, address, emergency_contact,
      sport_id, team_id, position, jersey_number, playing_level, experience_years, avatar_url
    } = req.body;

    const players = await query('SELECT user_id FROM players WHERE id = ?', [playerId]);
    if (players.length === 0) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    const userId = players[0].user_id;

    // Check authorization: user updating self or admin/coach
    if (req.user.role === 'PLAYER' && req.user.player_id != playerId && req.user.id != userId) {
      return res.status(403).json({ success: false, message: 'You can only edit your own profile' });
    }

    // Calculate updated completion score
    let filledFields = 0;
    const fieldsToTest = [full_name, phone, dob, gender, address, emergency_contact, position, jersey_number, playing_level];
    fieldsToTest.forEach(val => { if (val) filledFields++; });
    const profileCompletion = Math.min(100, Math.max(60, Math.round((filledFields / fieldsToTest.length) * 100)));

    await query(
      `UPDATE players SET 
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        dob = COALESCE(?, dob),
        gender = COALESCE(?, gender),
        address = COALESCE(?, address),
        emergency_contact = COALESCE(?, emergency_contact),
        sport_id = COALESCE(?, sport_id),
        team_id = COALESCE(?, team_id),
        position = COALESCE(?, position),
        jersey_number = COALESCE(?, jersey_number),
        playing_level = COALESCE(?, playing_level),
        experience_years = COALESCE(?, experience_years),
        profile_completion = ?
       WHERE id = ?`,
      [
        full_name, phone, dob, gender, address, emergency_contact,
        sport_id, team_id, position, jersey_number, playing_level, experience_years,
        profileCompletion, playerId
      ]
    );

    if (avatar_url) {
      await query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatar_url, userId]);
    }

    return res.status(200).json({
      success: true,
      message: 'Player profile updated successfully'
    });
  } catch (err) {
    console.error('updatePlayer error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update player profile' });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const playerId = req.params.id;
    const players = await query('SELECT user_id FROM players WHERE id = ?', [playerId]);
    if (players.length === 0) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    const userId = players[0].user_id;
    await query('DELETE FROM users WHERE id = ?', [userId]);

    return res.status(200).json({
      success: true,
      message: 'Player account deleted successfully'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
