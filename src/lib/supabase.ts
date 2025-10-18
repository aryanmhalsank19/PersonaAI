import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          fid: number;
          username: string;
          display_name: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fid: number;
          username: string;
          display_name: string;
          avatar_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fid?: number;
          username?: string;
          display_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      personality_profiles: {
        Row: {
          id: string;
          user_id: string;
          core_values: string[];
          decision_making_style: string;
          communication_style: string;
          risk_tolerance: 'low' | 'medium' | 'high';
          social_preferences: string[];
          career_interests: string[];
          relationship_patterns: string[];
          strengths: string[];
          weaknesses: string[];
          goals: string[];
          fears: string[];
          motivations: string[];
          personality_traits: {
            openness: number;
            conscientiousness: number;
            extraversion: number;
            agreeableness: number;
            neuroticism: number;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          core_values: string[];
          decision_making_style: string;
          communication_style: string;
          risk_tolerance: 'low' | 'medium' | 'high';
          social_preferences: string[];
          career_interests: string[];
          relationship_patterns: string[];
          strengths: string[];
          weaknesses: string[];
          goals: string[];
          fears: string[];
          motivations: string[];
          personality_traits: {
            openness: number;
            conscientiousness: number;
            extraversion: number;
            agreeableness: number;
            neuroticism: number;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          core_values?: string[];
          decision_making_style?: string;
          communication_style?: string;
          risk_tolerance?: 'low' | 'medium' | 'high';
          social_preferences?: string[];
          career_interests?: string[];
          relationship_patterns?: string[];
          strengths?: string[];
          weaknesses?: string[];
          goals?: string[];
          fears?: string[];
          motivations?: string[];
          personality_traits?: {
            openness: number;
            conscientiousness: number;
            extraversion: number;
            agreeableness: number;
            neuroticism: number;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_clones: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          personality_profile_id: string;
          clone_type: string;
          personality_prompt: string;
          status: 'creating' | 'active' | 'simulating' | 'idle' | 'error';
          current_simulation_id: string | null;
          created_at: string;
          updated_at: string;
          stats: {
            simulations_run: number;
            total_runtime: number;
            success_rate: number;
            last_active: string;
          };
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          personality_profile_id: string;
          clone_type: string;
          personality_prompt: string;
          status?: 'creating' | 'active' | 'simulating' | 'idle' | 'error';
          current_simulation_id?: string | null;
          created_at?: string;
          updated_at?: string;
          stats?: {
            simulations_run: number;
            total_runtime: number;
            success_rate: number;
            last_active: string;
          };
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          personality_profile_id?: string;
          clone_type?: string;
          personality_prompt?: string;
          status?: 'creating' | 'active' | 'simulating' | 'idle' | 'error';
          current_simulation_id?: string | null;
          created_at?: string;
          updated_at?: string;
          stats?: {
            simulations_run: number;
            total_runtime: number;
            success_rate: number;
            last_active: string;
          };
        };
      };
      simulations: {
        Row: {
          id: string;
          clone_id: string;
          type: 'career' | 'relationship' | 'decision' | 'skill' | 'social';
          scenario: string;
          parameters: Record<string, any>;
          status: 'running' | 'completed' | 'failed' | 'paused';
          results: {
            outcomes: string[];
            insights: string[];
            recommendations: string[];
            confidence: number;
            data: Record<string, any>;
          } | null;
          started_at: string;
          completed_at: string | null;
          duration: number | null;
        };
        Insert: {
          id?: string;
          clone_id: string;
          type: 'career' | 'relationship' | 'decision' | 'skill' | 'social';
          scenario: string;
          parameters: Record<string, any>;
          status?: 'running' | 'completed' | 'failed' | 'paused';
          results?: {
            outcomes: string[];
            insights: string[];
            recommendations: string[];
            confidence: number;
            data: Record<string, any>;
          } | null;
          started_at?: string;
          completed_at?: string | null;
          duration?: number | null;
        };
        Update: {
          id?: string;
          clone_id?: string;
          type?: 'career' | 'relationship' | 'decision' | 'skill' | 'social';
          scenario?: string;
          parameters?: Record<string, any>;
          status?: 'running' | 'completed' | 'failed' | 'paused';
          results?: {
            outcomes: string[];
            insights: string[];
            recommendations: string[];
            confidence: number;
            data: Record<string, any>;
          } | null;
          started_at?: string;
          completed_at?: string | null;
          duration?: number | null;
        };
      };
    };
  };
}

// Database helper functions
export class DatabaseService {
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUser(fid: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createPersonalityProfile(profileData: Database['public']['Tables']['personality_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('personality_profiles')
      .insert(profileData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPersonalityProfile(userId: string) {
    const { data, error } = await supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createAIClone(cloneData: Database['public']['Tables']['ai_clones']['Insert']) {
    const { data, error } = await supabase
      .from('ai_clones')
      .insert(cloneData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAIClones(userId: string) {
    const { data, error } = await supabase
      .from('ai_clones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getAIClone(cloneId: string) {
    const { data, error } = await supabase
      .from('ai_clones')
      .select('*')
      .eq('id', cloneId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAIClone(cloneId: string, updates: Database['public']['Tables']['ai_clones']['Update']) {
    const { data, error } = await supabase
      .from('ai_clones')
      .update(updates)
      .eq('id', cloneId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async createSimulation(simulationData: Database['public']['Tables']['simulations']['Insert']) {
    const { data, error } = await supabase
      .from('simulations')
      .insert(simulationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getSimulations(cloneId: string) {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('clone_id', cloneId)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async updateSimulation(simulationId: string, updates: Database['public']['Tables']['simulations']['Update']) {
    const { data, error } = await supabase
      .from('simulations')
      .update(updates)
      .eq('id', simulationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const db = new DatabaseService();
