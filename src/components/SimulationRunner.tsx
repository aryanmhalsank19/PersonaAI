"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Target, Users, Brain, Zap, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { aiCloneManager, AIClone, Simulation } from '~/lib/ai-clone';
import { SIMULATION_TYPES } from '~/lib/constants';

export function SimulationRunner() {
  const [clones, setClones] = useState<AIClone[]>([]);
  const [selectedClone, setSelectedClone] = useState<AIClone | null>(null);
  const [simulationType, setSimulationType] = useState<keyof typeof SIMULATION_TYPES>('career');
  const [scenario, setScenario] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const simulationTemplates = {
    career: {
      title: 'Career Simulation',
      icon: TrendingUp,
      description: 'Explore different career paths and their outcomes',
      examples: [
        'Software Engineer at a startup vs. big tech company',
        'Freelance consultant vs. corporate executive',
        'Academic researcher vs. industry practitioner'
      ]
    },
    relationship: {
      title: 'Relationship Simulation',
      icon: Users,
      description: 'Simulate relationship dynamics and outcomes',
      examples: [
        'Long-distance relationship challenges',
        'Career vs. relationship priorities',
        'Different personality types compatibility'
      ]
    },
    decision: {
      title: 'Decision Simulation',
      icon: Brain,
      description: 'Analyze major life decisions and their consequences',
      examples: [
        'Buying a house vs. investing in stocks',
        'Changing careers vs. staying current path',
        'Starting a business vs. getting a job'
      ]
    },
    skill: {
      title: 'Skill Development',
      icon: Zap,
      description: 'Accelerate skill learning through AI practice',
      examples: [
        'Learning a new programming language',
        'Developing public speaking skills',
        'Mastering a musical instrument'
      ]
    }
  };

  const handleRunSimulation = async () => {
    if (!selectedClone || !scenario.trim()) return;

    setIsRunning(true);
    try {
      const simulation = await aiCloneManager.runSimulation(
        selectedClone,
        simulationType,
        scenario
      );
      
      setCurrentSimulation(simulation);
      setSimulationResults(simulation.results);
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setScenario(template);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
          <Play className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Life Simulations</h2>
        <p className="text-xl text-gray-300 mb-6">
          Run AI-powered simulations to explore different life paths
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simulation Setup */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Clone Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">Select AI Clone</h3>
            <div className="space-y-3">
              {clones.map((clone) => (
                <div
                  key={clone.id}
                  onClick={() => setSelectedClone(clone)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedClone?.id === clone.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{clone.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{clone.cloneType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Type */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">Simulation Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(simulationTemplates).map(([key, template]) => {
                const Icon = template.icon;
                return (
                  <div
                    key={key}
                    onClick={() => setSimulationType(key as keyof typeof SIMULATION_TYPES)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      simulationType === key
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 hover:border-white/30'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <h4 className="font-semibold text-sm">{template.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scenario Input */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">Scenario</h3>
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder={`Describe your ${simulationTemplates[simulationType].title.toLowerCase()} scenario...`}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
            
            {/* Template Examples */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Quick templates:</p>
              <div className="space-y-2">
                {simulationTemplates[simulationType].examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(example)}
                    className="block w-full text-left p-2 text-sm bg-white/5 hover:bg-white/10 rounded border border-white/10 hover:border-white/20 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Run Button */}
          <Button
            onClick={handleRunSimulation}
            disabled={!selectedClone || !scenario.trim() || isRunning}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isRunning ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Running Simulation...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {simulationResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold">Simulation Results</h3>
                </div>

                <div className="space-y-6">
                  {/* Outcomes */}
                  <div>
                    <h4 className="font-semibold mb-3 text-purple-400">Possible Outcomes</h4>
                    <ul className="space-y-2">
                      {simulationResults.outcomes?.map((outcome: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-300">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-400">Key Insights</h4>
                    <ul className="space-y-2">
                      {simulationResults.insights?.map((insight: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-300">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 text-green-400">Recommendations</h4>
                    <ul className="space-y-2">
                      {simulationResults.recommendations?.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-300">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Confidence */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Confidence Level</span>
                      <span className="text-white font-semibold">
                        {Math.round((simulationResults.confidence || 0) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(simulationResults.confidence || 0) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
              >
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Simulate</h3>
                <p className="text-gray-400">
                  Select a clone, choose a simulation type, and describe your scenario to get started.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
