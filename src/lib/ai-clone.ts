import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, CLONE_STATUS, SIMULATION_TYPES } from './constants';
import { PersonalityProfile } from './gemini';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface AIClone {
  id: string;
  userId: string;
  name: string;
  personalityProfile: PersonalityProfile;
  cloneType: string;
  personalityPrompt: string;
  status: keyof typeof CLONE_STATUS;
  currentSimulation?: string;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    simulationsRun: number;
    totalRuntime: number;
    successRate: number;
    lastActive: Date;
  };
}

export interface Simulation {
  id: string;
  cloneId: string;
  type: keyof typeof SIMULATION_TYPES;
  scenario: string;
  parameters: Record<string, any>;
  status: 'running' | 'completed' | 'failed' | 'paused';
  results?: SimulationResults;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
}

export interface SimulationResults {
  outcomes: string[];
  insights: string[];
  recommendations: string[];
  confidence: number;
  data: Record<string, any>;
}

export class AICloneManager {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  private async testGeminiConnection(): Promise<boolean> {
    try {
      console.log('Testing Gemini API connection...');
      const result = await this.model.generateContent('Hello, respond with "API working"');
      const response = await result.response;
      const text = response.text();
      console.log('Gemini API test successful:', text);
      return true;
    } catch (error) {
      console.error('Gemini API test failed:', error);
      return false;
    }
  }

  async createClone(
    userId: string,
    personality: PersonalityProfile,
    cloneType: string,
    name: string
  ): Promise<AIClone> {
    console.log('Creating AI clone:', { userId, cloneType, name });
    
    // Test Gemini connection first
    const isGeminiWorking = await this.testGeminiConnection();
    if (!isGeminiWorking) {
      console.warn('Gemini API not working, using fallback personality prompt');
    }
    
    const personalityPrompt = await this.generatePersonalityPrompt(personality, cloneType);
    
    const clone: AIClone = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      userId,
      name,
      personalityProfile: personality,
      cloneType,
      personalityPrompt,
      status: CLONE_STATUS.CREATING,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        simulationsRun: 0,
        totalRuntime: 0,
        successRate: 0,
        lastActive: new Date()
      }
    };
    
    console.log('AI clone created successfully:', clone);
    return clone;
  }

  private async generatePersonalityPrompt(
    personality: PersonalityProfile,
    cloneType: string
  ): Promise<string> {
    console.log('Generating personality prompt...', { cloneType });
    
    // Check if Gemini API is available
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured, using fallback prompt');
      return this.createFallbackPersonalityPrompt(personality, cloneType);
    }

    const prompt = `
    Create a detailed personality prompt for an AI clone based on this profile:
    
    Personality Profile:
    ${JSON.stringify(personality, null, 2)}
    
    Clone Type: ${cloneType}
    
    Generate a comprehensive prompt that will make this AI clone:
    1. Think and reason like the person
    2. Communicate in their style
    3. Make decisions based on their values and patterns
    4. Respond authentically to different scenarios
    
    Include specific behavioral patterns, communication style, decision-making approach, and core values.
    Make it detailed and actionable for creating a realistic AI clone.
    `;

    try {
      console.log('Sending request to Gemini API for personality prompt...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Personality prompt generated successfully');
      return text;
    } catch (error) {
      console.error('Error generating personality prompt:', error);
      console.error('Falling back to default prompt');
      return this.createFallbackPersonalityPrompt(personality, cloneType);
    }
  }

  private createFallbackPersonalityPrompt(personality: PersonalityProfile, cloneType: string): string {
    const { coreValues, decisionMakingStyle, communicationStyle, strengths, goals } = personality;
    
    return `You are an AI clone representing a person with these characteristics:

Core Values: ${coreValues.join(', ')}
Decision Making Style: ${decisionMakingStyle}
Communication Style: ${communicationStyle}
Key Strengths: ${strengths.join(', ')}
Main Goals: ${goals.join(', ')}

Clone Type: ${cloneType}

Behavior Guidelines:
- Make decisions based on the core values and decision-making style
- Communicate in the specified style (${communicationStyle})
- Focus on achieving the main goals while leveraging your strengths
- Be authentic to the personality profile in all interactions
- Consider the clone type specialization when making choices

When faced with scenarios, think through them using the person's values and decision-making patterns. Provide thoughtful, authentic responses that reflect this personality.`;
  }

  async runSimulation(
    clone: AIClone,
    simulationType: keyof typeof SIMULATION_TYPES,
    scenario: string,
    parameters: Record<string, any> = {}
  ): Promise<Simulation> {
    const simulation: Simulation = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      cloneId: clone.id,
      type: simulationType,
      scenario,
      parameters,
      status: 'running',
      startedAt: new Date()
    };

    try {
      const results = await this.executeSimulation(clone, simulation);
      simulation.results = results;
      simulation.status = 'completed';
      simulation.completedAt = new Date();
      simulation.duration = simulation.completedAt.getTime() - simulation.startedAt.getTime();
    } catch (error) {
      console.error('Simulation failed:', error);
      simulation.status = 'failed';
      simulation.completedAt = new Date();
    }

    return simulation;
  }

  private async executeSimulation(
    clone: AIClone,
    simulation: Simulation
  ): Promise<SimulationResults> {
    const prompt = `
    You are an AI clone with this personality:
    
    ${clone.personalityPrompt}
    
    Simulation Type: ${simulation.type}
    Scenario: ${simulation.scenario}
    Parameters: ${JSON.stringify(simulation.parameters, null, 2)}
    
    Run this simulation as if you are the person. Think through the scenario step by step, make decisions based on your personality, and provide:
    
    1. Multiple possible outcomes based on your decision-making style
    2. Key insights about how your personality affects the situation
    3. Recommendations for the real person
    4. Confidence level (0-1) in your analysis
    5. Any relevant data or metrics
    
    Be thorough and authentic to the personality profile.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response to extract structured results
      return this.parseSimulationResults(text);
    } catch (error) {
      console.error('Error executing simulation:', error);
      throw error;
    }
  }

  private parseSimulationResults(text: string): SimulationResults {
    // This is a simplified parser - in production, you'd want more robust parsing
    const outcomes = this.extractSection(text, 'outcomes');
    const insights = this.extractSection(text, 'insights');
    const recommendations = this.extractSection(text, 'recommendations');
    
    return {
      outcomes: outcomes || ['Simulation completed'],
      insights: insights || ['Analysis completed'],
      recommendations: recommendations || ['Consider the outcomes carefully'],
      confidence: 0.8, // Default confidence
      data: {
        rawResponse: text,
        timestamp: new Date().toISOString()
      }
    };
  }

  private extractSection(text: string, section: string): string[] {
    const regex = new RegExp(`${section}[\\s\\S]*?\\n\\n`, 'i');
    const match = text.match(regex);
    if (match) {
      return match[0]
        .split('\n')
        .filter(line => line.trim() && !line.toLowerCase().includes(section))
        .map(line => line.replace(/^[-*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }
    return [];
  }

  async runCareerSimulation(
    clone: AIClone,
    careerPath: string,
    timeframe: string = '5 years'
  ): Promise<Simulation> {
    const scenario = `Career simulation: ${careerPath} over ${timeframe}`;
    const parameters = {
      careerPath,
      timeframe,
      focusAreas: ['growth', 'challenges', 'opportunities', 'work-life balance']
    };

    return this.runSimulation(clone, SIMULATION_TYPES.CAREER, scenario, parameters);
  }

  async runRelationshipSimulation(
    clone: AIClone,
    relationshipType: string,
    partnerProfile: string
  ): Promise<Simulation> {
    const scenario = `Relationship simulation: ${relationshipType} with ${partnerProfile}`;
    const parameters = {
      relationshipType,
      partnerProfile,
      focusAreas: ['compatibility', 'challenges', 'growth', 'long-term potential']
    };

    return this.runSimulation(clone, SIMULATION_TYPES.RELATIONSHIP, scenario, parameters);
  }

  async runDecisionSimulation(
    clone: AIClone,
    decision: string,
    options: string[]
  ): Promise<Simulation> {
    const scenario = `Decision simulation: ${decision}`;
    const parameters = {
      decision,
      options,
      focusAreas: ['pros and cons', 'long-term implications', 'risk assessment', 'recommendations']
    };

    return this.runSimulation(clone, SIMULATION_TYPES.DECISION, scenario, parameters);
  }
}

export const aiCloneManager = new AICloneManager();
