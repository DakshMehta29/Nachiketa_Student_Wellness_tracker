-- ========================================
-- NACHIKETA WELLNESS PLATFORM - COMPLETE DATABASE SCHEMA (SAFE VERSION)
-- ========================================
-- Professional database design for hackathon demo
-- Run this in your Supabase SQL Editor
-- This version uses IF NOT EXISTS to prevent errors if tables already exist

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- Note: pgvector extension needs to be enabled in Supabase dashboard
-- Go to Database > Extensions and enable 'vector' extension
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- ========================================
-- 1. USER MANAGEMENT TABLES
-- ========================================

-- User profiles table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    user_role TEXT NOT NULL CHECK (user_role IN ('student', 'professor', 'institution', 'personal')),
    university_name TEXT,
    department TEXT,
    graduation_year INTEGER,
    phone_number TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User wellness profile (onboarding data)
CREATE TABLE IF NOT EXISTS user_wellness_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Sleep patterns
    sleep_schedule TEXT CHECK (sleep_schedule IN ('early_bird', 'night_owl', 'flexible', 'irregular')),
    bedtime_preference TIME,
    wake_time_preference TIME,
    sleep_duration_hours DECIMAL(3,1),
    sleep_quality_rating INTEGER CHECK (sleep_quality_rating BETWEEN 1 AND 10),
    sleep_issues TEXT[], -- Array of sleep problems
    
    -- Exercise habits
    exercise_frequency TEXT CHECK (exercise_frequency IN ('daily', '3-4_times_week', '1-2_times_week', 'rarely', 'never')),
    preferred_exercise_types TEXT[], -- Array of exercise types
    exercise_duration_minutes INTEGER,
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'athlete')),
    
    -- Nutrition habits
    meal_frequency INTEGER, -- Number of meals per day
    dietary_preferences TEXT[], -- Array of dietary preferences/restrictions
    water_intake_glasses INTEGER,
    nutrition_concerns TEXT[], -- Array of nutrition concerns
    
    -- Mental health & stress
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    stress_sources TEXT[], -- Array of stress sources
    coping_strategies TEXT[], -- Array of coping mechanisms
    mood_patterns TEXT CHECK (mood_patterns IN ('stable', 'variable', 'seasonal', 'stress_related')),
    
    -- Academic/Work life
    study_work_hours DECIMAL(4,1),
    academic_workload TEXT CHECK (academic_workload IN ('light', 'moderate', 'heavy', 'overwhelming')),
    productivity_peak_time TEXT CHECK (productivity_peak_time IN ('morning', 'afternoon', 'evening', 'night')),
    
    -- Social life
    social_activity_level TEXT CHECK (social_activity_level IN ('very_active', 'moderately_active', 'somewhat_active', 'minimal')),
    social_support_quality INTEGER CHECK (social_support_quality BETWEEN 1 AND 10),
    
    -- Goals and motivations
    primary_wellness_goals TEXT[], -- Array of main goals
    motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
    previous_wellness_experience TEXT,
    
    -- Additional information
    health_conditions TEXT[], -- Array of health conditions
    medications TEXT[], -- Array of medications
    lifestyle_factors TEXT[], -- Array of lifestyle factors
    
    -- Metadata
    is_completed BOOLEAN DEFAULT FALSE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- User wellness goals
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('sleep', 'exercise', 'nutrition', 'stress', 'mood', 'academic', 'social')),
    title TEXT NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit TEXT,
    target_date DATE,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User companion selection
CREATE TABLE IF NOT EXISTS user_companion_selection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    companion_type TEXT NOT NULL CHECK (companion_type IN ('pet', 'companion')),
    character TEXT, -- For pet mode: agni, tara, neer, vruksha, maya
    companion_subtype TEXT, -- For companion mode: mentor, buddy, fitness_trainer, smart_router
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- ========================================
-- 2. CHAT SYSTEM WITH RAG SUPPORT
-- ========================================

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_name TEXT,
    session_type TEXT DEFAULT 'general' CHECK (session_type IN ('general', 'wellness', 'academic', 'crisis', 'goal_setting')),
    context_data JSONB DEFAULT '{}', -- Store user context for RAG
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages with RAG support
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- Store embeddings, sources, etc.
    tokens_used INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    sentiment_score DECIMAL(3,2), -- -1 to 1
    topics TEXT[], -- Array of topics extracted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat embeddings for RAG (vector search)
-- Note: This table requires the 'vector' extension to be enabled in Supabase
-- If you don't need vector search, you can skip this table
CREATE TABLE IF NOT EXISTS chat_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    embedding TEXT, -- Store as JSON string instead of vector type for compatibility
    content_hash TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. WELLNESS TRACKING & ANALYTICS
-- ========================================

-- Daily wellness entries
CREATE TABLE IF NOT EXISTS wellness_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    
    -- Sleep metrics
    sleep_hours DECIMAL(3,1),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    bedtime TIME,
    wake_time TIME,
    
    -- Physical activity
    exercise_minutes INTEGER,
    exercise_type TEXT,
    steps_count INTEGER,
    calories_burned INTEGER,
    
    -- Mental health
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    
    -- Academic/Work
    study_hours DECIMAL(3,1),
    productivity_score INTEGER CHECK (productivity_score BETWEEN 1 AND 10),
    academic_stress INTEGER CHECK (academic_stress BETWEEN 1 AND 10),
    
    -- Social
    social_interactions INTEGER,
    social_satisfaction INTEGER CHECK (social_satisfaction BETWEEN 1 AND 10),
    
    -- Nutrition
    water_intake_glasses INTEGER,
    meals_consumed INTEGER,
    nutrition_quality INTEGER CHECK (nutrition_quality BETWEEN 1 AND 10),
    
    -- Additional notes
    notes TEXT,
    weather TEXT,
    location TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, entry_date)
);

-- Weekly/Monthly analytics summaries
CREATE TABLE IF NOT EXISTS wellness_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'quarterly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Aggregated metrics
    avg_sleep_hours DECIMAL(3,1),
    avg_mood_score DECIMAL(3,1),
    avg_stress_level DECIMAL(3,1),
    avg_energy_level DECIMAL(3,1),
    total_exercise_minutes INTEGER,
    avg_productivity_score DECIMAL(3,1),
    
    -- Trends and insights
    sleep_trend TEXT,
    mood_trend TEXT,
    stress_trend TEXT,
    productivity_trend TEXT,
    
    -- AI-generated insights
    ai_insights TEXT,
    recommendations TEXT[],
    risk_factors TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, period_type, period_start)
);

-- ========================================
-- 4. GAMIFICATION & ACHIEVEMENTS
-- ========================================

-- User achievements and badges
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL CHECK (achievement_type IN ('streak', 'milestone', 'improvement')),
    badge_name TEXT NOT NULL,
    badge_description TEXT,
    badge_icon TEXT,
    points_earned INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks tracking
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    streak_type TEXT NOT NULL CHECK (streak_type IN ('wellness_tracking', 'exercise_goal', 'chat_engagement')),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, streak_type)
);

-- ========================================
-- 5. RESOURCE MANAGEMENT
-- ========================================

-- Curated resources
CREATE TABLE IF NOT EXISTS wellness_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'podcast', 'exercise', 'tool')),
    category TEXT NOT NULL CHECK (category IN ('mental_health', 'sleep', 'exercise', 'nutrition', 'academic', 'stress_management')),
    target_audience TEXT[] DEFAULT '{}', -- ['student', 'professor', 'personal']
    content_url TEXT,
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User resource interactions
CREATE TABLE IF NOT EXISTS user_resource_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES wellness_resources(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'bookmark', 'complete', 'rate', 'share')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    notes TEXT,
    time_spent_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. NUDGES & INTERVENTIONS
-- ========================================

-- Personalized nudges
CREATE TABLE IF NOT EXISTS user_nudges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    nudge_type TEXT NOT NULL CHECK (nudge_type IN ('reminder', 'motivation', 'insight', 'intervention', 'celebration')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    trigger_condition JSONB, -- Conditions that trigger this nudge
    is_read BOOLEAN DEFAULT FALSE,
    is_action_taken BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. INDEXES FOR PERFORMANCE
-- ========================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(is_active);

-- User wellness profile indexes
CREATE INDEX IF NOT EXISTS idx_user_wellness_profile_user ON user_wellness_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wellness_profile_completed ON user_wellness_profile(is_completed);

-- Chat system indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_active ON chat_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- Wellness tracking indexes
CREATE INDEX IF NOT EXISTS idx_wellness_entries_user_date ON wellness_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_wellness_entries_date ON wellness_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_wellness_analytics_user_period ON wellness_analytics(user_id, period_type, period_start);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_type ON user_streaks(user_id, streak_type);

-- Resource indexes
CREATE INDEX IF NOT EXISTS idx_resources_category ON wellness_resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_audience ON wellness_resources USING GIN(target_audience);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON wellness_resources(is_featured);

-- ========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wellness_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companion_selection ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resource_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nudges ENABLE ROW LEVEL SECURITY;

-- RLS Policies (using IF NOT EXISTS for policies)
DO $$ 
BEGIN
    -- User profiles policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can manage own profile') THEN
        CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = id);
    END IF;
    
    -- User wellness profile policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_wellness_profile' AND policyname = 'Users can manage own wellness profile') THEN
        CREATE POLICY "Users can manage own wellness profile" ON user_wellness_profile FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- User goals policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_goals' AND policyname = 'Users can manage own goals') THEN
        CREATE POLICY "Users can manage own goals" ON user_goals FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- User companion selection policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_companion_selection' AND policyname = 'Users can manage own companion selection') THEN
        CREATE POLICY "Users can manage own companion selection" ON user_companion_selection FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Chat sessions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_sessions' AND policyname = 'Users can manage own chat sessions') THEN
        CREATE POLICY "Users can manage own chat sessions" ON chat_sessions FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Chat messages policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can manage own messages') THEN
        CREATE POLICY "Users can manage own messages" ON chat_messages FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Chat embeddings policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_embeddings' AND policyname = 'Users can manage own embeddings') THEN
        CREATE POLICY "Users can manage own embeddings" ON chat_embeddings FOR ALL USING (message_id IN (SELECT id FROM chat_messages WHERE user_id = auth.uid()));
    END IF;
    
    -- Wellness entries policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wellness_entries' AND policyname = 'Users can manage own wellness entries') THEN
        CREATE POLICY "Users can manage own wellness entries" ON wellness_entries FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Wellness analytics policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wellness_analytics' AND policyname = 'Users can manage own analytics') THEN
        CREATE POLICY "Users can manage own analytics" ON wellness_analytics FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- User achievements policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'Users can manage own achievements') THEN
        CREATE POLICY "Users can manage own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- User streaks policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_streaks' AND policyname = 'Users can manage own streaks') THEN
        CREATE POLICY "Users can manage own streaks" ON user_streaks FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- User resource interactions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_resource_interactions' AND policyname = 'Users can manage own resource interactions') THEN
        CREATE POLICY "Users can manage own resource interactions" ON user_resource_interactions FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- User nudges policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_nudges' AND policyname = 'Users can manage own nudges') THEN
        CREATE POLICY "Users can manage own nudges" ON user_nudges FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Public read access for resources
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wellness_resources' AND policyname = 'Anyone can read resources') THEN
        CREATE POLICY "Anyone can read resources" ON wellness_resources FOR SELECT USING (true);
    END IF;
END $$;

-- ========================================
-- 9. AUTOMATIC USER PROFILE CREATION
-- ========================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, user_role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'user_role', 'personal')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- 10. SAMPLE DATA FOR HACKATHON DEMO
-- ========================================

-- Insert sample wellness resources (only if they don't exist)
INSERT INTO wellness_resources (title, description, resource_type, category, target_audience, content_url, difficulty_level, tags) 
SELECT * FROM (VALUES
('5-Minute Morning Meditation', 'Quick meditation for busy students', 'video', 'mental_health', ARRAY['student', 'professor'], 'https://example.com/meditation', 'beginner', ARRAY['meditation', 'morning', 'stress-relief']),
('Sleep Hygiene Guide', 'Complete guide to better sleep', 'article', 'sleep', ARRAY['student', 'personal'], 'https://example.com/sleep-guide', 'beginner', ARRAY['sleep', 'hygiene', 'wellness']),
('Campus Exercise Routine', 'Quick workouts for students', 'exercise', 'exercise', ARRAY['student'], 'https://example.com/campus-workout', 'intermediate', ARRAY['exercise', 'campus', 'fitness']),
('Stress Management Techniques', 'Academic stress relief methods', 'article', 'stress_management', ARRAY['student', 'professor'], 'https://example.com/stress-management', 'beginner', ARRAY['stress', 'academic', 'management']),
('Nutrition for Students', 'Healthy eating on a budget', 'article', 'nutrition', ARRAY['student'], 'https://example.com/student-nutrition', 'beginner', ARRAY['nutrition', 'budget', 'healthy'])
) AS v(title, description, resource_type, category, target_audience, content_url, difficulty_level, tags)
WHERE NOT EXISTS (SELECT 1 FROM wellness_resources WHERE title = v.title);

-- ========================================
-- 11. USEFUL FUNCTIONS FOR ANALYTICS
-- ========================================

-- Function to get user wellness summary
CREATE OR REPLACE FUNCTION get_user_wellness_summary(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    avg_sleep_hours DECIMAL,
    avg_mood_score DECIMAL,
    avg_stress_level DECIMAL,
    avg_energy_level DECIMAL,
    total_exercise_minutes BIGINT,
    entries_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        AVG(we.sleep_hours)::DECIMAL(3,1),
        AVG(we.mood_score)::DECIMAL(3,1),
        AVG(we.stress_level)::DECIMAL(3,1),
        AVG(we.energy_level)::DECIMAL(3,1),
        SUM(we.exercise_minutes)::BIGINT,
        COUNT(*)::BIGINT
    FROM wellness_entries we
    WHERE we.user_id = user_uuid
    AND we.entry_date >= CURRENT_DATE - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent chat context for RAG
CREATE OR REPLACE FUNCTION get_recent_chat_context(user_uuid UUID, session_uuid UUID DEFAULT NULL, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    message_id UUID,
    content TEXT,
    message_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    IF session_uuid IS NOT NULL THEN
        RETURN QUERY
        SELECT cm.id, cm.content, cm.message_type, cm.created_at
        FROM chat_messages cm
        WHERE cm.user_id = user_uuid AND cm.session_id = session_uuid
        ORDER BY cm.created_at DESC
        LIMIT limit_count;
    ELSE
        RETURN QUERY
        SELECT cm.id, cm.content, cm.message_type, cm.created_at
        FROM chat_messages cm
        WHERE cm.user_id = user_uuid
        ORDER BY cm.created_at DESC
        LIMIT limit_count;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- SCHEMA COMPLETE
-- ========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
