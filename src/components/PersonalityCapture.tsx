"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { personalityEngine, InterviewQuestion } from '~/lib/gemini';
import { db } from '~/lib/supabase';

interface PersonalityCaptureProps {
  onComplete: () => void;
}

export function PersonalityCapture({ onComplete }: PersonalityCaptureProps) {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = [
    'values',
    'decision-making',
    'relationships',
    'career',
    'goals',
    'fears',
    'strengths',
    'weaknesses'
  ];

  useEffect(() => {
    loadQuestions();
  }, [currentCategory]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const categoryQuestions = await personalityEngine.generateInterviewQuestions(
        categories[currentCategory]
      );
      setQuestions(categoryQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (questionId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(prev => prev + 1);
    } else {
      analyzePersonality();
    }
  };

  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1);
    }
  };

  const analyzePersonality = async () => {
    setIsAnalyzing(true);
    try {
      const personality = await personalityEngine.analyzePersonality(responses);
      
      // Save to database
      await db.createPersonalityProfile({
        user_id: 'temp-user-id', // Will be replaced with actual user ID
        ...personality
      });

      onComplete();
    } catch (error) {
      console.error('Error analyzing personality:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const progress = ((currentCategory + 1) / categories.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 sm:mb-4">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Personality Capture</h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6">
          Let's understand your personality to create accurate AI clones
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4 sm:mb-8">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="text-xs sm:text-sm text-gray-400">
          Category {currentCategory + 1} of {categories.length}: {categories[currentCategory].replace('-', ' ')}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-300">Loading questions...</p>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-300">Analyzing your personality...</p>
          </motion.div>
        ) : (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{question.question}</h3>
                {question.followUp && (
                  <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">{question.followUp}</p>
                )}
                <textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base"
                  rows={3}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8"
      >
        <Button
          onClick={handlePrevious}
          disabled={currentCategory === 0}
          variant="outline"
          className="flex items-center justify-center w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isLoading || isAnalyzing}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center w-full sm:w-auto"
        >
          {currentCategory === categories.length - 1 ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Analysis
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
