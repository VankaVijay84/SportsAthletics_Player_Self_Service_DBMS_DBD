-- Sports & Athletics Mobile App Seed Data
USE sports_athletics_db;

-- 1. Sports
INSERT INTO sports (id, name, code, category, icon, description) VALUES
(1, 'Football', 'FTB', 'Team Sport', 'dribbble', 'University 11-a-side Football Championship Division'),
(2, 'Cricket', 'CRK', 'Team Sport', 'target', 'University T20 & ODI Cricket League'),
(3, 'Basketball', 'BSK', 'Team Sport', 'activity', 'Men & Women Premier Basketball League'),
(4, 'Athletics', 'ATH', 'Individual & Relay', 'zap', 'Track & Field, Sprinting, High Jump, Javelin'),
(5, 'Volleyball', 'VLB', 'Team Sport', 'shield', 'Indoor & Beach Volleyball Varsity Team'),
(6, 'Badminton', 'BDM', 'Racquet Sport', 'disc', 'Singles & Doubles Regional Tournament'),
(7, 'Tennis', 'TNS', 'Racquet Sport', 'sun', 'Court Tennis Singles & Doubles');

-- 2. Users (Passwords hashed for 'password123')
-- $2a$10$wN3M0.2n/U8yUu2o84LdSeJ0b2tQY7jU.8L.b4V3zZ3S3Z3S3Z3S3 is bcrypt for 'password123'
INSERT INTO users (id, email, password, role, avatar_url) VALUES
(1, 'vijay@university.edu', '$2a$10$7vM/LwJ8oE/.mXj0H4Zq8e9zD8a4b3c2d1e0f9g8h7i6j5k4l3m2n', 'PLAYER', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'),
(2, 'ananya@university.edu', '$2a$10$7vM/LwJ8oE/.mXj0H4Zq8e9zD8a4b3c2d1e0f9g8h7i6j5k4l3m2n', 'PLAYER', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300'),
(3, 'rahul.coach@university.edu', '$2a$10$7vM/LwJ8oE/.mXj0H4Zq8e9zD8a4b3c2d1e0f9g8h7i6j5k4l3m2n', 'COACH', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'),
(4, 'priya.admin@university.edu', '$2a$10$7vM/LwJ8oE/.mXj0H4Zq8e9zD8a4b3c2d1e0f9g8h7i6j5k4l3m2n', 'SPORTS_ADMIN', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'),
(5, 'admin@university.edu', '$2a$10$7vM/LwJ8oE/.mXj0H4Zq8e9zD8a4b3c2d1e0f9g8h7i6j5k4l3m2n', 'ADMIN', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300');

-- 3. Coaches
INSERT INTO coaches (id, user_id, full_name, email, phone, specialization, experience_years, sport_id) VALUES
(1, 3, 'Rahul Dravid', 'rahul.coach@university.edu', '+91 98765 43210', 'High Performance & Tactical Strategy', 12, 1);

-- 4. Teams
INSERT INTO teams (id, name, sport_id, coach_id, season) VALUES
(1, 'University Eagles FC', 1, 1, '2026 Season'),
(2, 'Strikers Cricket XI', 2, 1, '2026 Season'),
(3, 'Titan Basketball Varsity', 3, 1, '2026 Season'),
(4, 'Apex Track & Field Squad', 4, 1, '2026 Season');

-- 5. Players
INSERT INTO players (id, user_id, player_id_code, full_name, email, phone, dob, gender, address, emergency_contact, sport_id, team_id, position, jersey_number, playing_level, experience_years, profile_completion, performance_score, attendance_percentage) VALUES
(1, 1, 'ATH001', 'Vijay Kumar', 'vijay@university.edu', '+91 98123 45678', '2003-05-14', 'Male', 'Campus Hostel Block A, Room 402, State University', 'Mr. Suresh Kumar (+91 94111 22233)', 1, 1, 'Attacking Midfielder', 10, 'University Varsity', 3, 90, 88, 94),
(2, 2, 'ATH002', 'Ananya Sharma', 'ananya@university.edu', '+91 98987 65432', '2004-08-22', 'Female', 'Campus Hostel Block C, Room 215, State University', 'Mrs. Sunita Sharma (+91 94222 33344)', 4, 4, '100m & 200m Sprinter', 7, 'National Junior', 4, 85, 92, 96);

-- 6. Player Teams Junction
INSERT INTO player_teams (id, player_id, team_id) VALUES
(1, 1, 1),
(2, 2, 4);

-- 7. Training Sessions
INSERT INTO training_sessions (id, title, sport_id, team_id, coach_id, session_date, start_time, end_time, location, session_type, instructions, status) VALUES
(1, 'Morning Endurance & Tactical Drills', 1, 1, 1, '2026-10-02', '06:30:00', '08:30:00', 'Main Sports Stadium Field 1', 'Tactical & Conditioning', 'Focus on high-press transitions, set pieces, and 5km warm-up sprint.', 'Upcoming'),
(2, 'Agility & High-Intensity Interval Training', 1, 1, 1, '2026-10-04', '16:00:00', '18:00:00', 'University Indoor Gym Arena', 'Fitness & Speed', 'Wear indoor agility turf shoes. Bring hydration packs.', 'Upcoming'),
(3, 'Set Piece Specialization & Free Kicks', 1, 1, 1, '2026-09-28', '07:00:00', '09:00:00', 'Practice Pitch B', 'Skill & Technique', 'Practiced corner kick routines and defensive wall organization.', 'Completed'),
(4, 'Track Sprint Drills & Baton Relay', 4, 4, 1, '2026-10-03', '07:00:00', '09:00:00', 'Athletic Synthetic Track', 'Sprint Technique', 'Explosive start off blocks and smooth blind baton exchange practice.', 'Upcoming'),
(5, 'Full Squad Practice Match', 1, 1, 1, '2026-09-25', '16:30:00', '18:30:00', 'Main Sports Stadium Field 1', 'Match Simulation', 'Played 90 minutes test match against Alumni Squad.', 'Completed');

-- 8. Training Attendance
INSERT INTO training_attendance (id, session_id, player_id, status, notes) VALUES
(1, 3, 1, 'Present', 'Arrived 10 mins early. Excellent execution on set pieces.'),
(2, 5, 1, 'Present', 'Completed full 90 mins with 1 goal and 2 assists.'),
(3, 3, 2, 'Present', 'Completed light recovery sprint session.'),
(4, 5, 2, 'Present', 'Assisted on timing logs.');

-- 9. Performance Records
INSERT INTO performance_records (id, player_id, recorded_date, speed, strength, endurance, agility, flexibility, reaction_time, accuracy, overall_score, remarks, coach_id) VALUES
(1, 1, '2026-07-01', 82, 75, 80, 78, 72, 80, 85, 79, 'Solid start to pre-season training.', 1),
(2, 1, '2026-08-15', 85, 78, 83, 81, 75, 83, 88, 82, 'Noticeable boost in agility and acceleration.', 1),
(3, 1, '2026-09-01', 88, 82, 86, 84, 78, 85, 90, 86, 'Excellent tactical positioning during squad matches.', 1),
(4, 1, '2026-09-25', 91, 85, 89, 88, 80, 88, 92, 88, 'Peak performance level reached ahead of derby match.', 1),
(5, 2, '2026-09-01', 95, 78, 90, 92, 85, 94, 86, 90, 'Exceptional block start reaction times in 100m.', 1);

-- 10. Fitness Records
INSERT INTO fitness_records (id, player_id, recorded_date, height_cm, weight_kg, bmi, body_fat_percentage, resting_hr, vo2_max, flexibility_score, strength_score, fitness_score) VALUES
(1, 1, '2026-06-01', 178.00, 74.00, 23.36, 13.50, 62, 52.0, 75, 78, 80),
(2, 1, '2026-07-15', 178.00, 73.20, 23.10, 12.80, 60, 53.5, 78, 80, 83),
(3, 1, '2026-08-20', 178.00, 72.80, 22.98, 12.20, 58, 55.0, 82, 83, 86),
(4, 1, '2026-09-25', 178.00, 72.50, 22.88, 11.80, 56, 56.5, 85, 86, 89),
(5, 2, '2026-09-25', 165.00, 55.00, 20.20, 14.00, 52, 58.0, 92, 80, 92);

-- 11. Competitions
INSERT INTO competitions (id, name, sport_id, category, competition_date, location, opponent, status, description, result_summary) VALUES
(1, 'All India Inter-University Football Cup 2026', 1, 'National Inter-Varsity', '2026-10-15', 'Central Sports Complex Stadium', 'St. Xavier Varsity FC', 'Registered', 'Championship quarter-final match with live broadcast.', 'Pending Match'),
(2, 'State Athletics Meet Sprint Finals', 4, 'State Championship', '2026-10-20', 'State Olympic Athletics Arena', 'State Competitors', 'Upcoming', '100m & 200m track finals for university qualifyers.', 'Pending Event'),
(3, 'Regional Collegiate Football Derby', 1, 'Regional League', '2026-09-18', 'Metropolitan Stadium', 'City Engineering College', 'Completed', 'Annual derby match between top regional rivals.', 'Won 3-1 (Vijay scored 2 goals)'),
(4, 'National Varsity Basketball Trophy', 3, 'Inter-State League', '2026-11-05', 'Indoor Arena Stadium', 'National Tech Tigers', 'Upcoming', 'Group stage matches starting in November.', 'Upcoming Schedule');

-- 12. Competition Registrations
INSERT INTO competition_registrations (id, competition_id, player_id, status) VALUES
(1, 1, 1, 'Approved'),
(2, 3, 1, 'Approved'),
(3, 2, 2, 'Approved');

-- 13. Achievements
INSERT INTO achievements (id, player_id, title, award_type, event_name, year, description, icon) VALUES
(1, 1, 'Man of the Match & Gold Medal', 'Gold Medal', 'Regional Collegiate Football Derby', 2026, 'Scored 2 decisive goals in the 3-1 victory over City Engineering College.', 'trophy'),
(2, 1, 'Best Midfielder Award', 'Award', 'State University Sports Meet', 2025, 'Awarded Most Valuable Player and Best Midfielder for highest assists.', 'award'),
(3, 1, 'Inter-College Cup Trophy', 'Trophy', 'Inter-College Football Championship', 2025, 'Captain of the winning team scoring the winning goal in extra time.', 'shield'),
(4, 2, 'Gold Medal 100m Sprint', 'Gold Medal', 'State Athletics Championship', 2026, 'Set a record timing of 11.45 seconds in the women 100m sprint.', 'zap');

-- 14. Documents
INSERT INTO documents (id, player_id, doc_name, doc_type, file_url, file_size, uploaded_date, status) VALUES
(1, 1, 'Vijay_Player_ID_Card.pdf', 'ID Proof', '/documents/vijay_id.pdf', '1.4 MB', '2026-01-10', 'Verified'),
(2, 1, 'Medical_Fitness_Clearance_2026.pdf', 'Medical Certificate', '/documents/vijay_medical.pdf', '2.8 MB', '2026-06-05', 'Verified'),
(3, 1, 'National_Sports_Participation_Cert.pdf', 'Sports Certificate', '/documents/vijay_cert.pdf', '3.1 MB', '2026-03-12', 'Verified'),
(4, 1, 'University_Insurance_Policy.pdf', 'Insurance Document', '/documents/vijay_insurance.pdf', '980 KB', '2026-01-15', 'Verified');

-- 15. Notifications
INSERT INTO notifications (id, user_id, title, message, category, is_read) VALUES
(1, 1, 'Upcoming Training Session', 'Reminder: Morning Endurance & Tactical Drills scheduled for Oct 2 at 06:30 AM.', 'Training', 0),
(2, 1, 'Competition Registration Approved', 'Your registration for All India Inter-University Football Cup 2026 has been approved!', 'Competition', 0),
(3, 1, 'New Performance Log Recorded', 'Coach Rahul Dravid updated your overall performance score to 88/100.', 'Performance', 1),
(4, 1, 'Achievement Verified', 'Your Gold Medal in Regional Collegiate Football Derby has been published to your profile.', 'System', 1);

-- 16. Messages
INSERT INTO messages (id, sender_id, receiver_id, content, is_read, created_at) VALUES
(1, 3, 1, 'Hi Vijay, great work in yesterday setup session. Make sure to hydrate well before Friday training.', 1, '2026-09-29 10:15:00'),
(2, 1, 3, 'Thank you Coach! I worked on free-kick curve angles as discussed. Ready for Friday.', 1, '2026-09-29 10:20:00'),
(3, 3, 1, 'Excellent! We will also review video analysis of St. Xavier Varsity on Thursday afternoon.', 0, '2026-09-29 11:05:00');
