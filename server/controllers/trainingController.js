const { query } = require('../config/db');

exports.getTrainingSessions = async (req, res) => {
  try {
    const { sport_id, team_id, status } = req.query;

    let sql = `
      SELECT ts.*, s.name as sport_name, t.name as team_name, c.full_name as coach_name
      FROM training_sessions ts
      LEFT JOIN sports s ON ts.sport_id = s.id
      LEFT JOIN teams t ON ts.team_id = t.id
      LEFT JOIN coaches c ON ts.coach_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (sport_id) {
      sql += ` AND ts.sport_id = ?`;
      params.push(sport_id);
    }
    if (team_id) {
      sql += ` AND ts.team_id = ?`;
      params.push(team_id);
    }
    if (status) {
      sql += ` AND ts.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY ts.session_date DESC, ts.start_time ASC`;

    const sessions = await query(sql, params);

    return res.status(200).json({
      success: true,
      message: 'Training sessions retrieved',
      data: sessions
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTrainingSession = async (req, res) => {
  try {
    const {
      title, sport_id, team_id, session_date, start_time, end_time,
      location, session_type, instructions
    } = req.body;

    if (!title || !session_date || !start_time || !location) {
      return res.status(400).json({ success: false, message: 'Title, date, start time, and location are required' });
    }

    const result = await query(
      `INSERT INTO training_sessions (
        title, sport_id, team_id, coach_id, session_date, start_time, end_time, location, session_type, instructions, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, sport_id || 1, team_id || 1, 1, session_date, start_time,
        end_time || '08:30:00', location, session_type || 'Tactical & Conditioning', instructions || '', 'Upcoming'
      ]
    );

    // Notify team players
    const playersInTeam = await query('SELECT user_id FROM players WHERE team_id = ? OR sport_id = ?', [team_id || 1, sport_id || 1]);
    for (const p of playersInTeam) {
      await query(
        `INSERT INTO notifications (user_id, title, message, category) VALUES (?, ?, ?, ?)`,
        [p.user_id, 'New Training Session Scheduled', `Session "${title}" set for ${session_date} at ${start_time}.`, 'Training']
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Training session created successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAttendanceByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    const records = await query(
      `SELECT ta.*, ts.title, ts.session_date, ts.start_time, ts.location, ts.session_type
       FROM training_attendance ta
       JOIN training_sessions ts ON ta.session_id = ts.id
       WHERE ta.player_id = ?
       ORDER BY ts.session_date DESC`,
      [playerId]
    );

    // Calculate totals
    const presentCount = records.filter(r => r.status === 'Present').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;
    const lateCount = records.filter(r => r.status === 'Late').length;
    const totalSessions = records.length;
    const attendancePercentage = totalSessions > 0 ? Math.round(((presentCount + (lateCount * 0.5)) / totalSessions) * 100) : 92;

    return res.status(200).json({
      success: true,
      message: 'Attendance record fetched',
      data: {
        summary: {
          totalSessions,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          attendancePercentage
        },
        records
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { session_id, player_id, status, notes } = req.body;

    if (!session_id || !player_id) {
      return res.status(400).json({ success: false, message: 'Session ID and Player ID are required' });
    }

    // Check existing
    const existing = await query(
      'SELECT id FROM training_attendance WHERE session_id = ? AND player_id = ?',
      [session_id, player_id]
    );

    if (existing.length > 0) {
      await query(
        'UPDATE training_attendance SET status = ?, notes = ? WHERE id = ?',
        [status || 'Present', notes || null, existing[0].id]
      );
    } else {
      await query(
        'INSERT INTO training_attendance (session_id, player_id, status, notes) VALUES (?, ?, ?, ?)',
        [session_id, player_id, status || 'Present', notes || null]
      );
    }

    // Recalculate attendance %
    const all = await query('SELECT status FROM training_attendance WHERE player_id = ?', [player_id]);
    const present = all.filter(r => r.status === 'Present').length;
    const late = all.filter(r => r.status === 'Late').length;
    const pct = all.length > 0 ? Math.round(((present + (late * 0.5)) / all.length) * 100) : 92;
    await query('UPDATE players SET attendance_percentage = ? WHERE id = ?', [pct, player_id]);

    return res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: { attendancePercentage: pct }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
