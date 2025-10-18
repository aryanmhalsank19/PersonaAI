"use client";

import { motion } from 'framer-motion';
import { TrendingUp, Users, Brain, Zap, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { SimulationResults } from '~/lib/ai-clone';

interface ResultsViewerProps {
  results: SimulationResults;
  simulationType: string;
  scenario: string;
}

export function ResultsViewer({ results, simulationType, scenario }: ResultsViewerProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'career': return TrendingUp;
      case 'relationship': return Users;
      case 'decision': return Brain;
      case 'skill': return Zap;
      default: return CheckCircle;
    }
  };

  const getColorScheme = (type: string) => {
    switch (type) {
      case 'career': return {
        primary: 'from-purple-500 to-pink-500',
        secondary: 'text-purple-400',
        accent: 'bg-purple-500/20'
      };
      case 'relationship': return {
        primary: 'from-pink-500 to-red-500',
        secondary: 'text-pink-400',
        accent: 'bg-pink-500/20'
      };
      case 'decision': return {
        primary: 'from-blue-500 to-indigo-500',
        secondary: 'text-blue-400',
        accent: 'bg-blue-500/20'
      };
      case 'skill': return {
        primary: 'from-green-500 to-teal-500',
        secondary: 'text-green-400',
        accent: 'bg-green-500/20'
      };
      default: return {
        primary: 'from-gray-500 to-gray-600',
        secondary: 'text-gray-400',
        accent: 'bg-gray-500/20'
      };
    }
  };

  const Icon = getIcon(simulationType);
  const colors = getColorScheme(simulationType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 bg-gradient-to-r ${colors.primary} rounded-full flex items-center justify-center mr-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold">Simulation Results</h3>
          <p className="text-gray-400 capitalize">{simulationType} Analysis</p>
        </div>
      </div>

      {/* Scenario */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h4 className="font-semibold mb-2 text-gray-300">Scenario</h4>
        <p className="text-gray-400">{scenario}</p>
      </div>

      {/* Confidence Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Confidence Level</span>
          <span className={`font-semibold ${colors.secondary}`}>
            {Math.round(results.confidence * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className={`bg-gradient-to-r ${colors.primary} h-3 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${results.confidence * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Outcomes */}
      <div className="mb-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
          Possible Outcomes
        </h4>
        <div className="space-y-3">
          {results.outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-300">{outcome}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mb-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-400" />
          Key Insights
        </h4>
        <div className="space-y-3">
          {results.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (results.outcomes.length + index) * 0.1 }}
              className="flex items-start p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-300">{insight}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
          Recommendations
        </h4>
        <div className="space-y-3">
          {results.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (results.outcomes.length + results.insights.length + index) * 0.1 }}
              className="flex items-start p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-300">{recommendation}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Data */}
      {results.data && Object.keys(results.data).length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-gray-400" />
            Additional Data
          </h4>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <pre className="text-sm text-gray-400 overflow-x-auto">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-6 border-t border-white/10">
        <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
          Run Another Simulation
        </button>
        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 border border-white/20">
          Save Results
        </button>
      </div>
    </motion.div>
  );
}
