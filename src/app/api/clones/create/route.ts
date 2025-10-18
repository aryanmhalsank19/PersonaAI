import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { aiCloneManager } from '~/lib/ai-clone';
import { db } from '~/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const fid = await verifyAuth(request);
    if (!fid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, cloneType, personalityProfileId } = await request.json();
    
    if (!name || !cloneType || !personalityProfileId) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, cloneType, personalityProfileId' 
      }, { status: 400 });
    }

    // Get personality profile
    const personalityProfile = await db.getPersonalityProfile(fid.toString());
    if (!personalityProfile) {
      return NextResponse.json({ 
        error: 'Personality profile not found' 
      }, { status: 404 });
    }

    // Create AI clone
    const aiClone = await aiCloneManager.createClone(
      fid.toString(),
      personalityProfile,
      cloneType,
      name
    );

    // Save to database
    const savedClone = await db.createAIClone({
      user_id: fid.toString(),
      name: aiClone.name,
      personality_profile_id: personalityProfileId,
      clone_type: aiClone.cloneType,
      personality_prompt: aiClone.personalityPrompt,
      status: 'creating',
      stats: {
        simulations_run: 0,
        total_runtime: 0,
        success_rate: 0,
        last_active: new Date().toISOString()
      }
    });

    return NextResponse.json({ 
      success: true, 
      clone: savedClone 
    });

  } catch (error) {
    console.error('Error creating AI clone:', error);
    return NextResponse.json(
      { error: 'Failed to create AI clone' },
      { status: 500 }
    );
  }
}
