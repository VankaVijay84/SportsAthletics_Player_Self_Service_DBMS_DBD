const { query } = require('../config/db');

exports.getCompetitions = async (req, res) => {
  try {
    const { sport_id, status } = req.query;
    const userId = req.user?.id;
    const playerId = req.user?.player_id;

    let sql = `
      SELECT c.*, s.name as sport_name
      FROM competitions c
      LEFT JOIN sports s ON c.sport_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (sport_id) {
      sql += ` AND c.sport_id = ?`;
      params.push(sport_id);
    }
    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY c.competition_date ASC`;

    const competitions = await query(sql, params);

    // Attach registration status if player is logged in
    if (playerId) {
      const regs = await query(
        `SELECT competition_id, status FROM competition_registrations WHERE player_id = ?`,
        [playerId]
      );
      const regMap = {};
      regs.forEach(r => { regMap[r.competition_id] = r.status; });

      competitions.forEach(comp => {
        comp.userRegistrationStatus = regMap[comp.id] || null;
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Competitions retrieved',
      data: competitions
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.registerForCompetition = async (req, res) => {
  try {
    const competitionId = req.params.id;
    const { player_id } = req.body;
    const targetPlayerId = player_id || req.user.player_id || 1;

    // Check existing
    const existing = await query(
      `SELECT id FROM competition_registrations WHERE competition_id = ? AND player_id = ?`,
      [competitionId, targetPlayerId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'You are already registered for this competition' });
    }

    await query(
      `INSERT INTO competition_registrations (competition_id, player_id, status) VALUES (?, ?, ?)`,
      [competitionId, targetPlayerId, 'Approved']
    );

    // Update status in competitions if needed
    await query(`UPDATE competitions SET status = 'Registered' WHERE id = ? AND status = 'Upcoming'`, [competitionId]);

    // Send notification
    const player = await query('SELECT user_id FROM players WHERE id = ?', [targetPlayerId]);
    if (player.length > 0) {
      await query(
        `INSERT INTO notifications (user_id, title, message, category) VALUES (?, ?, ?, ?)`,
        [player[0].user_id, 'Competition Registered', `You have successfully registered for the competition.`, 'Competition']
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for competition'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCompetition = async (req, res) => {
  try {
    const {
      name, sport_id, category, competition_date, location, opponent, description
    } = req.body;

    if (!name || !competition_date || !location) {
      return res.status(400).json({ success: false, message: 'Competition name, date and location are required' });
    }

    const result = await query(
      `INSERT INTO competitions (
        name, sport_id, category, competition_date, location, opponent, status, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sport_id || 1, category || 'Inter-University League', competition_date, location, opponent || 'TBD', 'Upcoming', description || '']
    );

    return res.status(201).json({
      success: true,
      message: 'Competition created successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAchievementsByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const achievements = await query(
      `SELECT * FROM achievements WHERE player_id = ? ORDER BY year DESC, id DESC`,
      [playerId]
    );

    return res.status(200).json({
      success: true,
      message: 'Achievements retrieved',
      data: achievements
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.addAchievement = async (req, res) => {
  try {
    const { player_id, title, award_type, event_name, year, description, icon } = req.body;

    if (!player_id || !title || !award_type || !event_name) {
      return res.status(400).json({ success: false, message: 'Player ID, title, award type, and event name are required' });
    }

    const result = await query(
      `INSERT INTO achievements (
        player_id, title, award_type, event_name, year, description, icon
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [player_id, title, award_type, event_name, year || new Date().getFullYear(), description || '', icon || 'award']
    );

    // Send notification
    const player = await query('SELECT user_id FROM players WHERE id = ?', [player_id]);
    if (player.length > 0) {
      await query(
        `INSERT INTO notifications (user_id, title, message, category) VALUES (?, ?, ?, ?)`,
        [player[0].user_id, 'New Achievement Added', `Achievement "${title}" was published to your player profile!`, 'System']
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Achievement added successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
