-- Initialize database schema

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE players (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Words table
CREATE TABLE words (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    phonetic_spelling VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scores table
CREATE TABLE scores (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id uuid REFERENCES players(id),
    word_id uuid REFERENCES words(id),
    points INTEGER NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 1,
    time_taken INTEGER NOT NULL, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weekly leaderboard view
CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT 
    p.display_name,
    p.username,
    SUM(s.points) as total_points,
    COUNT(DISTINCT s.word_id) as words_completed,
    AVG(s.attempts) as avg_attempts,
    DATE_TRUNC('week', s.created_at) as week_start
FROM players p
JOIN scores s ON p.id = s.player_id
WHERE s.created_at >= DATE_TRUNC('week', CURRENT_TIMESTAMP)
GROUP BY 
    p.id,
    p.display_name,
    p.username,
    DATE_TRUNC('week', s.created_at)
ORDER BY total_points DESC;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for players table
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();