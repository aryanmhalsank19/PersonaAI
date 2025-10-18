export const APP_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
export const APP_NAME = "Persona AI";
export const APP_DESCRIPTION = "Live Multiple Digital Lives Through AI Clones - Explore career paths, relationships, and major decisions through AI-powered simulations";
export const APP_PRIMARY_CATEGORY = "AI";
export const APP_TAGS = ["AI", "Simulation", "Decision Making", "Personal Growth", "Farcaster"];
export const APP_ICON_URL = `${APP_URL}/icon.png`;
export const APP_OG_IMAGE_URL = `${APP_URL}/api/opengraph-image`;
export const APP_SPLASH_URL = `${APP_URL}/splash.png`;
export const APP_SPLASH_BACKGROUND_COLOR = "#0a0a0a";
export const APP_BUTTON_TEXT = "Start Your AI Journey";
export const APP_WEBHOOK_URL = process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID 
    ? `https://api.neynar.com/f/app/${process.env.NEYNAR_CLIENT_ID}/event`
    : `${APP_URL}/api/webhook`;
export const USE_WALLET = process.env.NEXT_PUBLIC_USE_WALLET === 'true';

// Persona AI specific constants
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCXdREphbYuP7FZkxofa2tcaUDDPtwnfBU';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Simulation types
export const SIMULATION_TYPES = {
  CAREER: 'career',
  RELATIONSHIP: 'relationship', 
  DECISION: 'decision',
  SKILL: 'skill',
  SOCIAL: 'social'
} as const;

// AI Clone status
export const CLONE_STATUS = {
  CREATING: 'creating',
  ACTIVE: 'active',
  SIMULATING: 'simulating',
  IDLE: 'idle',
  ERROR: 'error'
} as const;
