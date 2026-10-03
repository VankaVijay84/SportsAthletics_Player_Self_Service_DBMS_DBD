const { query } = require('../config/db');

exports.getPerformanceByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const records = await query(
      `SELECT pr.*, c.full_name as coach_name
       FROM performance_records pr
       LEFT JOIN coaches c ON pr.coach_id = c.id
       WHERE pr.player_id = ?
       ORDER BY pr.recorded_date ASC`,
      [playerId]
    );

    return res.status(200).json({
      success: true,
      message: 'Performance metrics retrieved',
      data: records
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.addPerformanceRecord = async (req, res) => {
  try {
    const {
      player_id, recorded_date, speed, strength, endurance, agility,
      flexibility, reaction_time, accuracy, remarks
    } = req.body;

    if (!player_id) {
      return res.status(400).json({ success: false, message: 'Player ID is required' });
    }

    const dateVal = recorded_date || new Date().toISOString().split('T')[0];
    const s = Number(speed) || 80;
    const st = Number(strength) || 80;
    const e = Number(endurance) || 80;
    const a = Number(agility) || 80;
    const f = Number(flexibility) || 80;
    const r = Number(reaction_time) || 80;
    const ac = Number(accuracy) || 80;

    const overall = Math.round((s + st + e + a + f + r + ac) / 7);

    const result = await query(
      `INSERT INTO performance_records (
        player_id, recorded_date, speed, strength, endurance, agility, flexibility, reaction_time, accuracy, overall_score, remarks, coach_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [player_id, dateVal, s, st, e, a, f, r, ac, overall, remarks || 'Regular assessment log', 1]
    );

    // Update player performance_score
    await query(`UPDATE players SET performance_score = ? WHERE id = ?`, [overall, player_id]);

    // Send notification
    const player = await query('SELECT user_id FROM players WHERE id = ?', [player_id]);
    if (player.length > 0) {
      await query(
        `INSERT INTO notifications (user_id, title, message, category) VALUES (?, ?, ?, ?)`,
        [player[0].user_id, 'Performance Record Updated', `New overall score updated to ${overall}/100.`, 'Performance']
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Performance record added successfully',
      data: { id: result.insertId, overall_score: overall }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFitnessByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;
    const records = await query(
      `SELECT * FROM fitness_records WHERE player_id = ? ORDER BY recorded_date ASC`,
      [playerId]
    );

    return res.status(200).json({
      success: true,
      message: 'Fitness metrics retrieved',
      data: records
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.addFitnessRecord = async (req, res) => {
  try {
    const {
      player_id, recorded_date, height_cm, weight_kg, body_fat_percentage,
      resting_hr, vo2_max, flexibility_score, strength_score
    } = req.body;

    if (!player_id) {
      return res.status(400).json({ success: false, message: 'Player ID is required' });
    }

    const dateVal = recorded_date || new Date().toISOString().split('T')[0];
    const h = Number(height_cm) || 178;
    const w = Number(weight_kg) || 72;
    const bmi = parseFloat((w / ((h / 100) * (h / 100))).toFixed(2));
    const bf = Number(body_fat_percentage) || 12;
    const rhr = Number(resting_hr) || 58;
    const vo2 = Number(vo2_max) || 54;
    const flex = Number(flexibility_score) || 85;
    const str = Number(strength_score) || 82;
    const fitnessScore = Math.round((flex + str + (vo2 > 50 ? 90 : 75) + (bmi >= 18.5 && bmi <= 24.9 ? 95 : 80)) / 4);

    const result = await query(
      `INSERT INTO fitness_records (
        player_id, recorded_date, height_cm, weight_kg, bmi, body_fat_percentage, resting_hr, vo2_max, flexibility_score, strength_score, fitness_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [player_id, dateVal, h, w, bmi, bf, rhr, vo2, flex, str, fitnessScore]
    );

    return res.status(201).json({
      success: true,
      message: 'Fitness assessment logged',
      data: { id: result.insertId, bmi, fitness_score: fitnessScore }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
