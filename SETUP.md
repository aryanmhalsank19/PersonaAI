# Persona AI - Setup Instructions

## Overview
Persona AI is a Next.js application that allows users to create AI clones for life simulations, decision-making, and personal growth. The app uses Google Gemini API for AI functionality and Supabase for data storage.

## Prerequisites
- Node.js 18+ 
- npm or pnpm
- Google Gemini API key
- Supabase account
- Farcaster account (for authentication)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Farcaster Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_FRAME_NAME=Persona AI
NEXT_PUBLIC_FRAME_DESCRIPTION=Live Multiple Digital Lives Through AI Clones
NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY=AI
NEXT_PUBLIC_FRAME_TAGS=AI,Simulation,Decision Making,Personal Growth,Farcaster
NEXT_PUBLIC_FRAME_BUTTON_TEXT=Start Your AI Journey
NEXT_PUBLIC_USE_WALLET=true

# Neynar API Configuration
NEYNAR_API_KEY=your_neynar_api_key_here
NEYNAR_CLIENT_ID=your_neynar_client_id_here

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Database Setup

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from the project settings

### 2. Create Database Tables
Run the following SQL in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid INTEGER UNIQUE NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personality profiles table
CREATE TABLE personality_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  core_values TEXT[] NOT NULL,
  decision_making_style TEXT NOT NULL,
  communication_style TEXT NOT NULL,
  risk_tolerance TEXT NOT NULL CHECK (risk_tolerance IN ('low', 'medium', 'high')),
  social_preferences TEXT[] NOT NULL,
  career_interests TEXT[] NOT NULL,
  relationship_patterns TEXT[] NOT NULL,
  strengths TEXT[] NOT NULL,
  weaknesses TEXT[] NOT NULL,
  goals TEXT[] NOT NULL,
  fears TEXT[] NOT NULL,
  motivations TEXT[] NOT NULL,
  personality_traits JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI clones table
CREATE TABLE ai_clones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  personality_profile_id UUID REFERENCES personality_profiles(id) ON DELETE CASCADE,
  clone_type TEXT NOT NULL,
  personality_prompt TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('creating', 'active', 'simulating', 'idle', 'error')),
  current_simulation_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stats JSONB NOT NULL DEFAULT '{"simulations_run": 0, "total_runtime": 0, "success_rate": 0, "last_active": "1970-01-01T00:00:00Z"}'
);

-- Simulations table
CREATE TABLE simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clone_id UUID REFERENCES ai_clones(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('career', 'relationship', 'decision', 'skill', 'social')),
  scenario TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'paused')),
  results JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER
);

-- Create indexes for better performance
CREATE INDEX idx_personality_profiles_user_id ON personality_profiles(user_id);
CREATE INDEX idx_ai_clones_user_id ON ai_clones(user_id);
CREATE INDEX idx_ai_clones_personality_profile_id ON ai_clones(personality_profile_id);
CREATE INDEX idx_simulations_clone_id ON simulations(clone_id);
CREATE INDEX idx_simulations_type ON simulations(type);
CREATE INDEX idx_simulations_status ON simulations(status);
```

## API Keys Setup

### 1. Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### 2. Neynar API (Optional)
1. Go to [Neynar](https://neynar.com)
2. Create an account and get your API key
3. Add it to your `.env.local` file

## Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

### Core Functionality
- **Personality Capture**: Conversational AI interview to understand user's personality
- **AI Clone Generation**: Create autonomous AI agents that think like the user
- **Life Simulations**: Explore career paths, relationships, and major decisions
- **Social Media Army**: Deploy AI clones to create content across platforms
- **Skill Accelerator**: Time-compressed skill learning simulations

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **AI**: Google Gemini API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Farcaster QuickAuth

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Troubleshooting

### Common Issues

1. **Gemini API Errors**: Make sure your API key is correct and has sufficient quota
2. **Database Connection**: Verify your Supabase credentials
3. **Authentication Issues**: Check your Farcaster configuration

### Support
For issues and questions, please check the documentation or create an issue in the repository.
