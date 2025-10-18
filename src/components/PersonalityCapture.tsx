"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ArrowLeft, CheckCircle, Zap } from 'lucide-react';
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

  // Dummy answers for testing
  const dummyAnswers = {
    'values': [
      "I value honesty and integrity above all else. I believe in treating others with respect and kindness, and I think it's important to stand up for what's right even when it's difficult.",
      "Family and close relationships are my top priority. I believe in loyalty, trust, and being there for the people I care about through thick and thin.",
      "I value creativity and self-expression. I believe everyone has unique talents and should be encouraged to pursue their passions and dreams."
    ],
    'decision-making': [
      "I usually take time to gather all the information I can before making important decisions. I like to weigh the pros and cons and consider different perspectives.",
      "I trust my intuition but also seek advice from trusted friends and family. I believe in making decisions that align with my values and long-term goals.",
      "I'm comfortable with taking calculated risks when I believe the potential benefits outweigh the risks. I learn from both successes and failures."
    ],
    'relationships': [
      "I believe in open and honest communication in relationships. I think it's important to listen actively and express feelings clearly without being hurtful.",
      "I value quality over quantity when it comes to friendships. I prefer having a few close, deep relationships rather than many superficial ones.",
      "I think relationships require effort from both sides. I believe in compromise, understanding, and being willing to grow and change together."
    ],
    'career': [
      "I'm passionate about work that allows me to make a positive impact on others. I want to use my skills to contribute to something meaningful and help solve real problems.",
      "I value work-life balance and believe in finding a career that challenges me intellectually while still allowing time for personal interests and relationships.",
      "I'm interested in continuous learning and growth. I want a career where I can develop new skills and take on increasing responsibilities over time."
    ],
    'goals': [
      "My main goal is to build a successful career while maintaining strong relationships with family and friends. I want to achieve financial stability and personal fulfillment.",
      "I want to travel more and experience different cultures. I believe travel broadens perspectives and helps me grow as a person.",
      "I'm working on developing better habits around health and fitness. I want to be more consistent with exercise and maintain a healthy lifestyle."
    ],
    'fears': [
      "I fear disappointing the people I care about. I worry about letting down my family, friends, or colleagues who depend on me.",
      "I have some anxiety about the future and uncertainty. I sometimes worry about making the wrong decisions or missing out on opportunities.",
      "I fear not living up to my potential. I want to make sure I'm making the most of my abilities and not wasting opportunities that come my way."
    ],
    'strengths': [
      "I'm a good listener and can usually understand different perspectives. People often come to me for advice because I'm empathetic and non-judgmental.",
      "I'm organized and detail-oriented. I can break down complex problems into manageable steps and follow through on commitments.",
      "I'm creative and enjoy thinking outside the box. I like coming up with innovative solutions and exploring new ideas and approaches."
    ],
    'weaknesses': [
      "I sometimes overthink decisions and can be indecisive when there are too many options. I tend to second-guess myself more than I should.",
      "I can be too hard on myself and set unrealistic expectations. I sometimes struggle with perfectionism and need to learn to accept 'good enough.'",
      "I have trouble saying no to people and can overcommit myself. I need to work on setting better boundaries and prioritizing my own needs."
    ]
  };

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

  const fillDummyAnswers = () => {
    const currentCategoryName = categories[currentCategory];
    const categoryDummyAnswers = dummyAnswers[currentCategoryName as keyof typeof dummyAnswers];
    
    if (categoryDummyAnswers && questions.length > 0) {
      const newResponses = { ...responses };
      
      questions.forEach((question, index) => {
        // Use the dummy answer that corresponds to the question index, cycling through if needed
        const dummyAnswer = categoryDummyAnswers[index % categoryDummyAnswers.length];
        newResponses[question.id] = dummyAnswer;
      });
      
      setResponses(newResponses);
    }
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
      console.log('Starting personality analysis with responses:', responses);
      
      // Check if we have responses
      const responseCount = Object.keys(responses).length;
      if (responseCount === 0) {
        throw new Error('No responses provided for analysis');
      }
      
      console.log(`Analyzing ${responseCount} responses...`);
      const personality = await personalityEngine.analyzePersonality(responses);
      console.log('Personality analysis completed:', personality);
      
      // Save to database (skip for now if database is not configured)
      try {
        await db.createPersonalityProfile({
          user_id: 'temp-user-id', // Will be replaced with actual user ID
          ...personality
        });
        console.log('Personality profile saved to database');
      } catch (dbError) {
        console.warn('Database save failed, continuing without save:', dbError);
        // Continue without database save for now
      }

      onComplete();
    } catch (error) {
      console.error('Error analyzing personality:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        responses: responses
      });
      
      // Show user-friendly error message
      alert('Failed to analyze personality. Please try again or contact support if the issue persists.');
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
        
        {/* Fill Dummy Answers Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Button
            onClick={fillDummyAnswers}
            disabled={isLoading || isAnalyzing || questions.length === 0}
            variant="outline"
            className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/50 text-sm px-4 py-2"
          >
            <Zap className="w-4 h-4 mr-2" />
            Fill Dummy Answers (Testing)
          </Button>
        </motion.div>
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
