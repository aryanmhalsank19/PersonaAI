import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from './constants';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface PersonalityProfile {
  id: string;
  userId: string;
  coreValues: string[];
  decisionMakingStyle: string;
  communicationStyle: string;
  riskTolerance: 'low' | 'medium' | 'high';
  socialPreferences: string[];
  careerInterests: string[];
  relationshipPatterns: string[];
  strengths: string[];
  weaknesses: string[];
  goals: string[];
  fears: string[];
  motivations: string[];
  personalityTraits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  followUp?: string;
  weight: number;
}

export class PersonalityCaptureEngine {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  async generateInterviewQuestions(category: string): Promise<InterviewQuestion[]> {
    const prompt = `
    Generate 5-7 interview questions for personality assessment in the category: ${category}
    
    Categories include: values, decision-making, relationships, career, goals, fears, strengths, weaknesses
    
    Return as JSON array with this structure:
    {
      "id": "unique_id",
      "category": "${category}",
      "question": "Question text",
      "followUp": "Optional follow-up question",
      "weight": 1-5
    }
    
    Make questions conversational and insightful for understanding personality.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse interview questions');
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw error;
    }
  }

  async analyzePersonality(interviewResponses: Record<string, string>): Promise<PersonalityProfile> {
    console.log('Gemini API Key available:', !!GEMINI_API_KEY);
    console.log('Gemini API Key length:', GEMINI_API_KEY?.length);
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key is not configured properly');
    }

    const prompt = `
    Analyze these interview responses to create a comprehensive personality profile:
    
    ${JSON.stringify(interviewResponses, null, 2)}
    
    Return a JSON object with this exact structure:
    {
      "coreValues": ["value1", "value2", "value3"],
      "decisionMakingStyle": "analytical/emotional/intuitive/collaborative",
      "communicationStyle": "direct/indirect/assertive/passive",
      "riskTolerance": "low/medium/high",
      "socialPreferences": ["preference1", "preference2"],
      "careerInterests": ["interest1", "interest2"],
      "relationshipPatterns": ["pattern1", "pattern2"],
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "goals": ["goal1", "goal2"],
      "fears": ["fear1", "fear2"],
      "motivations": ["motivation1", "motivation2"],
      "personalityTraits": {
        "openness": 0.0-1.0,
        "conscientiousness": 0.0-1.0,
        "extraversion": 0.0-1.0,
        "agreeableness": 0.0-1.0,
        "neuroticism": 0.0-1.0
      }
    }
    
    Be thorough and accurate in your analysis.
    `;

    try {
      console.log('Sending request to Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Gemini API response received:', text.substring(0, 200) + '...');
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        console.log('Parsed personality analysis:', analysis);
        return {
          id: crypto.randomUUID(),
          userId: '', // Will be set by caller
          ...analysis,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      throw new Error('Could not parse personality analysis from response: ' + text.substring(0, 500));
    } catch (error) {
      console.error('Error analyzing personality:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback: Create a basic personality profile based on responses
      console.log('Creating fallback personality profile...');
      return this.createFallbackPersonalityProfile(interviewResponses);
    }
  }

  private createFallbackPersonalityProfile(responses: Record<string, string>): PersonalityProfile {
    console.log('Creating fallback personality profile from responses:', Object.keys(responses).length);
    
    // Extract some basic insights from responses
    const allText = Object.values(responses).join(' ').toLowerCase();
    
    // Simple keyword analysis
    const isAnalytical = allText.includes('analyze') || allText.includes('data') || allText.includes('logic');
    const isEmotional = allText.includes('feel') || allText.includes('heart') || allText.includes('emotion');
    const isSocial = allText.includes('people') || allText.includes('friends') || allText.includes('social');
    const isRiskTaker = allText.includes('risk') || allText.includes('adventure') || allText.includes('bold');
    
    return {
      id: crypto.randomUUID(),
      userId: '',
      coreValues: ['Honesty', 'Growth', 'Relationships'],
      decisionMakingStyle: isAnalytical ? 'analytical' : isEmotional ? 'emotional' : 'intuitive',
      communicationStyle: isSocial ? 'direct' : 'indirect',
      riskTolerance: isRiskTaker ? 'high' : 'medium',
      socialPreferences: isSocial ? ['Group activities', 'Networking'] : ['One-on-one', 'Quiet environments'],
      careerInterests: ['Technology', 'Innovation', 'Problem-solving'],
      relationshipPatterns: ['Loyal', 'Supportive', 'Communicative'],
      strengths: ['Adaptable', 'Creative', 'Determined'],
      weaknesses: ['Perfectionist', 'Overthinker', 'Impatient'],
      goals: ['Personal growth', 'Career advancement', 'Meaningful relationships'],
      fears: ['Failure', 'Disappointing others', 'Missing opportunities'],
      motivations: ['Making a difference', 'Learning', 'Connecting with others'],
      personalityTraits: {
        openness: 0.7,
        conscientiousness: 0.8,
        extraversion: isSocial ? 0.7 : 0.4,
        agreeableness: 0.8,
        neuroticism: 0.3
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async generateAIClone(personality: PersonalityProfile, cloneType: string): Promise<string> {
    const prompt = `
    Create an AI clone based on this personality profile:
    
    ${JSON.stringify(personality, null, 2)}
    
    Clone type: ${cloneType}
    
    Generate a detailed personality prompt that will make this AI clone think, communicate, and act like the person.
    Include:
    - Core personality traits and values
    - Communication style and preferences
    - Decision-making patterns
    - Behavioral tendencies
    - Goals and motivations
    - Fears and concerns
    
    Make it comprehensive and specific for creating a realistic AI clone.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating AI clone:', error);
      throw error;
    }
  }
}

export const personalityEngine = new PersonalityCaptureEngine();
