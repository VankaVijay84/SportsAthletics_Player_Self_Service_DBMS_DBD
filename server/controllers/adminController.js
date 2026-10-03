const { query } = require('../config/db');

exports.getAdminStats = async (req, res) => {
  try {
    const totalPlayers = (await query('SELECT COUNT(*) as count FROM players'))[0].count;
    const totalCoaches = (await query('SELECT COUNT(*) as count FROM coaches'))[0].count;
    const totalSports = (await query('SELECT COUNT(*) as count FROM sports'))[0].count;
    const totalTeams = (await query('SELECT COUNT(*) as count FROM teams'))[0].count;
    const totalCompetitions = (await query('SELECT COUNT(*) as count FROM competitions'))[0].count;
    const totalSessions = (await query('SELECT COUNT(*) as count FROM training_sessions'))[0].count;

    const avgAttendance = (await query('SELECT AVG(attendance_percentage) as avg FROM players'))[0].avg || 92;
    const avgPerformance = (await query('SELECT AVG(performance_score) as avg FROM players'))[0].avg || 87;

    return res.status(200).json({
      success: true,
      data: {
        totalPlayers,
        totalCoaches,
        totalSports,
        totalTeams,
        totalCompetitions,
        totalSessions,
        avgAttendance: Math.round(avgAttendance),
        avgPerformance: Math.round(avgPerformance)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSports = async (req, res) => {
  try {
    const sports = await query('SELECT * FROM sports ORDER BY name ASC');
    return res.status(200).json({ success: true, data: sports });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSport = async (req, res) => {
  try {
    const { name, code, category, icon, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Sport name and code are required' });
    }

    const result = await query(
      `INSERT INTO sports (name, code, category, icon, description) VALUES (?, ?, ?, ?, ?)`,
      [name, code, category || 'Team Sport', icon || 'trophy', description || '']
    );

    return res.status(201).json({ success: true, message: 'Sport created', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await query(
      `SELECT t.*, s.name as sport_name, c.full_name as coach_name, 
              (SELECT COUNT(*) FROM players p WHERE p.team_id = t.id) as player_count
       FROM teams t
       LEFT JOIN sports s ON t.sport_id = s.id
       LEFT JOIN coaches c ON t.coach_id = c.id
       ORDER BY t.name ASC`
    );
    return res.status(200).json({ success: true, data: teams });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, sport_id, coach_id, season } = req.body;
    if (!name || !sport_id) {
      return res.status(400).json({ success: false, message: 'Team name and sport are required' });
    }

    const result = await query(
      `INSERT INTO teams (name, sport_id, coach_id, season) VALUES (?, ?, ?, ?)`,
      [name, sport_id, coach_id || 1, season || '2026 Season']
    );

    return res.status(201).json({ success: true, message: 'Team created', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCoaches = async (req, res) => {
  try {
    const coaches = await query(
      `SELECT c.*, s.name as sport_name 
       FROM coaches c 
       LEFT JOIN sports s ON c.sport_id = s.id 
       ORDER BY c.full_name ASC`
    );
    return res.status(200).json({ success: true, data: coaches });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
