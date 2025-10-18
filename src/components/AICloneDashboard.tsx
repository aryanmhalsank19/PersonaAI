"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Bot, Settings, Play, Pause, Trash2, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { aiCloneManager, AIClone } from '~/lib/ai-clone';
import { db } from '~/lib/supabase';

interface AICloneDashboardProps {
  onCloneCreated: () => void;
}

export function AICloneDashboard({ onCloneCreated }: AICloneDashboardProps) {
  const [clones, setClones] = useState<AIClone[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCloneName, setNewCloneName] = useState('');
  const [newCloneType, setNewCloneType] = useState('general');

  const cloneTypes = [
    { value: 'general', label: 'General Purpose', description: 'Versatile AI clone for various simulations' },
    { value: 'career', label: 'Career Specialist', description: 'Focused on career and professional development' },
    { value: 'relationship', label: 'Relationship Expert', description: 'Specialized in relationship and social dynamics' },
    { value: 'decision', label: 'Decision Analyst', description: 'Optimized for decision-making scenarios' },
    { value: 'creative', label: 'Creative Mind', description: 'Enhanced for creative and artistic pursuits' }
  ];

  const handleCreateClone = async () => {
    if (!newCloneName.trim()) return;

    setIsCreating(true);
    try {
      // Get personality profile (in real app, this would come from the user's profile)
      const personalityProfile = {
        id: 'temp-profile-id',
        userId: 'temp-user-id',
        coreValues: ['growth', 'authenticity', 'creativity'],
        decisionMakingStyle: 'analytical',
        communicationStyle: 'direct',
        riskTolerance: 'medium' as const,
        socialPreferences: ['collaboration', 'networking'],
        careerInterests: ['technology', 'innovation'],
        relationshipPatterns: ['supportive', 'communicative'],
        strengths: ['problem-solving', 'leadership'],
        weaknesses: ['perfectionism', 'impatience'],
        goals: ['career growth', 'work-life balance'],
        fears: ['failure', 'stagnation'],
        motivations: ['impact', 'learning'],
        personalityTraits: {
          openness: 0.8,
          conscientiousness: 0.7,
          extraversion: 0.6,
          agreeableness: 0.8,
          neuroticism: 0.3
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newClone = await aiCloneManager.createClone(
        'temp-user-id',
        personalityProfile,
        newCloneType,
        newCloneName
      );

      // Save to database
      await db.createAIClone({
        user_id: 'temp-user-id',
        name: newClone.name,
        personality_profile_id: personalityProfile.id,
        clone_type: newClone.cloneType,
        personality_prompt: newClone.personalityPrompt,
        status: 'creating',
        stats: {
          simulations_run: 0,
          total_runtime: 0,
          success_rate: 0,
          last_active: new Date().toISOString()
        }
      });

      setClones(prev => [...prev, newClone]);
      setShowCreateForm(false);
      setNewCloneName('');
      onCloneCreated();
    } catch (error) {
      console.error('Error creating clone:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClone = async (cloneId: string) => {
    setClones(prev => prev.filter(clone => clone.id !== cloneId));
  };

  const handleToggleClone = async (cloneId: string) => {
    setClones(prev => prev.map(clone => 
      clone.id === cloneId 
        ? { ...clone, status: clone.status === 'active' ? 'idle' : 'active' }
        : clone
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-3 sm:mb-4">
          <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">AI Clone Dashboard</h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6">
          Create and manage your AI clones for different life simulations
        </p>
      </motion.div>

      {/* Create Clone Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Create New AI Clone
        </Button>
      </motion.div>

      {/* Create Clone Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Create New AI Clone</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Clone Name</label>
                <input
                  type="text"
                  value={newCloneName}
                  onChange={(e) => setNewCloneName(e.target.value)}
                  placeholder="Enter a name for your AI clone"
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Clone Type</label>
                <select
                  value={newCloneType}
                  onChange={(e) => setNewCloneType(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {cloneTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400 mt-1">
                  {cloneTypes.find(t => t.value === newCloneType)?.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 sm:mt-6">
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateClone}
                disabled={!newCloneName.trim() || isCreating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full sm:w-auto"
              >
                {isCreating ? 'Creating...' : 'Create Clone'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clones Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
        {clones.map((clone, index) => (
          <motion.div
            key={clone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{clone.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 capitalize">{clone.cloneType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleToggleClone(clone.id)}
                  size="sm"
                  variant="outline"
                  className="p-2"
                >
                  {clone.status === 'active' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={() => handleDeleteClone(clone.id)}
                  size="sm"
                  variant="outline"
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  clone.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  clone.status === 'simulating' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {clone.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Simulations</span>
                <span className="text-white">{clone.stats.simulationsRun}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-white">{Math.round(clone.stats.successRate * 100)}%</span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm sm:text-base"
                onClick={() => onCloneCreated()}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Run Simulations
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {clones.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No AI Clones Yet</h3>
          <p className="text-gray-400 mb-6">Create your first AI clone to start exploring different life paths</p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Clone
          </Button>
        </motion.div>
      )}
    </div>
  );
}
