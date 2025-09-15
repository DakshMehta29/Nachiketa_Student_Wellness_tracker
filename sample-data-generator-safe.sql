-- ========================================
-- SAMPLE DATA GENERATOR (WORKS WITH SAFE SCHEMA)
-- ========================================
-- Must be run AFTER database-schema-complete-safe.sql
-- Safe for re-runs: uses ON CONFLICT DO NOTHING
-- Seeds auth.users first, then user_profiles and related data
-- ========================================

-- 1. DEMO USERS in auth.users
INSERT INTO auth.users (id, email)
VALUES
('11111111-1111-1111-1111-111111111111', 'alice.johnson@university.edu'),
('22222222-2222-2222-2222-222222222222', 'bob.smith@university.edu'),
('33333333-3333-3333-3333-333333333333', 'charlie.brown@university.edu'),
('44444444-4444-4444-4444-444444444444', 'diana.prince@university.edu'),
('55555555-5555-5555-5555-555555555555', 'prof.wilson@university.edu'),
('66666666-6666-6666-6666-666666666666', 'prof.davis@university.edu'),
('77777777-7777-7777-7777-777777777777', 'emma.watson@email.com'),
('88888888-8888-8888-8888-888888888888', 'james.bond@email.com')
ON CONFLICT (id) DO NOTHING;

-- 2. USER PROFILES
INSERT INTO user_profiles (id, email, full_name, user_role, university_name, department, graduation_year, gender)
VALUES
('11111111-1111-1111-1111-111111111111', 'alice.johnson@university.edu', 'Alice Johnson', 'student', 'ABC University', 'Computer Science', 2026, 'female'),
('22222222-2222-2222-2222-222222222222', 'bob.smith@university.edu', 'Bob Smith', 'student', 'ABC University', 'Mechanical Engineering', 2025, 'male'),
('33333333-3333-3333-3333-333333333333', 'charlie.brown@university.edu', 'Charlie Brown', 'student', 'XYZ University', 'Psychology', 2027, 'male'),
('44444444-4444-4444-4444-444444444444', 'diana.prince@university.edu', 'Diana Prince', 'student', 'XYZ University', 'Biology', 2026, 'female'),
('55555555-5555-5555-5555-555555555555', 'Prof. Wilson', 'Prof. Wilson', 'professor', 'ABC University', 'Computer Science', NULL, 'male'),
('66666666-6666-6666-6666-666666666666', 'Prof. Davis', 'Prof. Davis', 'professor', 'XYZ University', 'Psychology', NULL, 'female'),
('77777777-7777-7777-7777-777777777777', 'emma.watson@email.com', 'Emma Watson', 'personal', NULL, NULL, NULL, 'female'),
('88888888-8888-8888-8888-888888888888', 'james.bond@email.com', 'James Bond', 'personal', NULL, NULL, NULL, 'male')
ON CONFLICT (id) DO NOTHING;

-- 3. WELLNESS GOALS
INSERT INTO user_goals (user_id, goal_type, title, description, target_value, unit, target_date, priority)
VALUES
('11111111-1111-1111-1111-111111111111', 'sleep', 'Improve Sleep', 'Aim for 8 hours of sleep daily', 8, 'hours', CURRENT_DATE + INTERVAL '30 days', 2),
('22222222-2222-2222-2222-222222222222', 'stress', 'Reduce Stress', 'Lower stress levels during exams', 3, 'level', CURRENT_DATE + INTERVAL '45 days', 1),
('33333333-3333-3333-3333-333333333333', 'exercise', 'Stay Active', 'Exercise 4 times a week', 4, 'sessions', CURRENT_DATE + INTERVAL '60 days', 3)
ON CONFLICT DO NOTHING;

-- 4. WELLNESS ENTRIES (7-day history for each user)
DO $$
DECLARE 
    u RECORD;
    i INT;
BEGIN
    FOR u IN SELECT id, user_role FROM user_profiles LOOP
        FOR i IN 0..6 LOOP
            INSERT INTO wellness_entries (user_id, entry_date, sleep_hours, stress_level, exercise_minutes, productivity_score, mood_score, notes)
            VALUES (
                u.id,
                CURRENT_DATE - i,
                (CASE 
                    WHEN u.user_role = 'student' THEN 5 + floor(random()*3)
                    WHEN u.user_role = 'professor' THEN 6 + floor(random()*2)
                    ELSE 7 + floor(random()*2)
                 END),
                1 + floor(random()*5),
                floor(random()*40),
                5 + floor(random()*5),
                5 + floor(random()*5),
                'Auto-generated sample wellness entry'
            )
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END$$;

-- 5. CHAT SESSIONS + MESSAGES
INSERT INTO chat_sessions (id, user_id, session_name, session_type)
VALUES
('aaaa0000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Sleep Issues Chat', 'wellness'),
('aaaa0000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'Stress Management Chat', 'wellness')
ON CONFLICT (id) DO NOTHING;

INSERT INTO chat_messages (session_id, user_id, message_type, content, sentiment_score, topics)
VALUES
('aaaa0000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'user', 'I am not sleeping well during exams.', -0.5, ARRAY['sleep','stress']),
('aaaa0000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'assistant', 'Try maintaining a consistent sleep schedule.', 0.3, ARRAY['advice','sleep']),
('aaaa0000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'user', 'I feel overwhelmed by grading work.', -0.6, ARRAY['stress','work']),
('aaaa0000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'assistant', 'Taking short breaks may help reduce stress.', 0.4, ARRAY['stress','relief'])
ON CONFLICT DO NOTHING;

-- 6. STREAKS
INSERT INTO user_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date)
VALUES
('11111111-1111-1111-1111-111111111111', 'wellness_tracking', 3, 5, CURRENT_DATE - 1),
('55555555-5555-5555-5555-555555555555', 'chat_engagement', 2, 2, CURRENT_DATE - 2),
('77777777-7777-7777-7777-777777777777', 'exercise_goal', 4, 4, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- 7. NUDGES
INSERT INTO user_nudges (user_id, nudge_type, title, message, priority, scheduled_for)
VALUES
('11111111-1111-1111-1111-111111111111', 'reminder', 'Drink Water', 'Stay hydrated by drinking 8 glasses today!', 2, CURRENT_TIMESTAMP + INTERVAL '2 hours'),
('55555555-5555-5555-5555-555555555555', 'motivation', 'Keep Going!', 'You are making great progress, keep it up!', 1, CURRENT_TIMESTAMP + INTERVAL '4 hours')
ON CONFLICT DO NOTHING;

-- 8. RESOURCE INTERACTIONS
INSERT INTO user_resource_interactions (user_id, resource_id, interaction_type, rating, notes, time_spent_minutes)
SELECT up.id, wr.id, 'view', 5, 'Very useful resource', 10
FROM user_profiles up, wellness_resources wr
WHERE wr.title = 'Sleep Hygiene Guide'
ON CONFLICT DO NOTHING;

-- 9. WELLNESS ANALYTICS (weekly summaries)
INSERT INTO wellness_analytics (user_id, period_type, period_start, period_end, avg_sleep_hours, avg_mood_score, avg_stress_level, total_exercise_minutes, ai_insights, recommendations)
VALUES
('11111111-1111-1111-1111-111111111111', 'weekly', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, 6.5, 6.0, 4.0, 120, 'Sleep patterns are irregular during exams.', ARRAY['Maintain bedtime','Reduce screen time']),
('55555555-5555-5555-5555-555555555555', 'weekly', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, 7.0, 7.0, 3.0, 90, 'Stress spikes during grading workload.', ARRAY['Take breaks','Delegate tasks'])
ON CONFLICT DO NOTHING;

-- ========================================
-- SAMPLE DATA COMPLETE
-- ========================================
