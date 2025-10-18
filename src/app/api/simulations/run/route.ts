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

    const { cloneId, simulationType, scenario, parameters } = await request.json();
    
    if (!cloneId || !simulationType || !scenario) {
      return NextResponse.json({ 
        error: 'Missing required fields: cloneId, simulationType, scenario' 
      }, { status: 400 });
    }

    // Get AI clone
    const aiClone = await db.getAIClone(cloneId);
    if (!aiClone) {
      return NextResponse.json({ 
        error: 'AI clone not found' 
      }, { status: 404 });
    }

    // Check if clone belongs to user
    if (aiClone.user_id !== fid.toString()) {
      return NextResponse.json({ 
        error: 'Unauthorized access to AI clone' 
      }, { status: 403 });
    }

    // Create simulation record
    const simulation = await db.createSimulation({
      clone_id: cloneId,
      type: simulationType,
      scenario,
      parameters: parameters || {},
      status: 'running',
      started_at: new Date().toISOString()
    });

    // Run simulation
    const simulationResults = await aiCloneManager.runSimulation(
      aiClone,
      simulationType,
      scenario,
      parameters
    );

    // Update simulation with results
    const updatedSimulation = await db.updateSimulation(simulation.id, {
      status: 'completed',
      results: simulationResults.results,
      completed_at: new Date().toISOString(),
      duration: simulationResults.duration
    });

    // Update clone stats
    await db.updateAIClone(cloneId, {
      stats: {
        simulations_run: aiClone.stats.simulations_run + 1,
        total_runtime: aiClone.stats.total_runtime + (simulationResults.duration || 0),
        success_rate: 1.0, // Simplified for now
        last_active: new Date().toISOString()
      }
    });

    return NextResponse.json({ 
      success: true, 
      simulation: updatedSimulation,
      results: simulationResults.results
    });

  } catch (error) {
    console.error('Error running simulation:', error);
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    );
  }
}
