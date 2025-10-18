import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { personalityEngine } from '~/lib/gemini';
import { db } from '~/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const fid = await verifyAuth(request);
    if (!fid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { responses } = await request.json();
    
    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'Invalid responses data' }, { status: 400 });
    }

    // Analyze personality using Gemini
    const personality = await personalityEngine.analyzePersonality(responses);
    personality.userId = fid.toString();

    // Save to database
    const savedPersonality = await db.createPersonalityProfile({
      user_id: fid.toString(),
      core_values: personality.coreValues,
      decision_making_style: personality.decisionMakingStyle,
      communication_style: personality.communicationStyle,
      risk_tolerance: personality.riskTolerance,
      social_preferences: personality.socialPreferences,
      career_interests: personality.careerInterests,
      relationship_patterns: personality.relationshipPatterns,
      strengths: personality.strengths,
      weaknesses: personality.weaknesses,
      goals: personality.goals,
      fears: personality.fears,
      motivations: personality.motivations,
      personality_traits: personality.personalityTraits
    });

    return NextResponse.json({ 
      success: true, 
      personality: savedPersonality 
    });

  } catch (error) {
    console.error('Error analyzing personality:', error);
    return NextResponse.json(
      { error: 'Failed to analyze personality' },
      { status: 500 }
    );
  }
}
