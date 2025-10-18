"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Users, Target, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { PersonalityCapture } from './PersonalityCapture';
import { AICloneDashboard } from './AICloneDashboard';
import { SimulationRunner } from './SimulationRunner';
import { ResultsViewer } from './ResultsViewer';
import { SocialMediaArmy } from './SocialMediaArmy';
import { SkillAccelerator } from './SkillAccelerator';
import { Avatar3D, PersonalityVisualization } from './Avatar3D';

interface User {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export default function PersonaAI({ title }: { title?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'personality' | 'clones' | 'simulations' | 'social' | 'skills'>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [clones, setClones] = useState<any[]>([]);
  const [personality, setPersonality] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentStep('personality');
  };

  const handlePersonalityComplete = (personalityData: any) => {
    setPersonality(personalityData);
    setCurrentStep('clones');
  };

  const handleCloneCreated = (cloneData: any) => {
    setClones(prev => [...prev, cloneData]);
    setCurrentStep('simulations');
  };

  const handleNavigateToSocial = () => {
    setCurrentStep('social');
  };

  const handleNavigateToSkills = () => {
    setCurrentStep('skills');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-6xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                {/* Animated Logo */}
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                  className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mb-8 shadow-2xl"
                >
                  <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-pulse" />
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6"
                >
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    {title}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
                >
                  Live Multiple Digital Lives Through{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                    AI Clones
                  </span>
                </motion.p>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-lg sm:text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
                >
                  Explore infinite possibilities, make better decisions, and accelerate your growth through AI-powered life simulations
                </motion.p>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16"
              >
                {[
                  {
                    icon: Users,
                    title: "AI Clones",
                    description: "Create autonomous AI agents that think and act like you",
                    color: "from-purple-500 to-pink-500",
                    iconColor: "text-purple-400"
                  },
                  {
                    icon: Target,
                    title: "Life Simulations",
                    description: "Explore career paths, relationships, and major decisions",
                    color: "from-blue-500 to-cyan-500",
                    iconColor: "text-blue-400"
                  },
                  {
                    icon: Zap,
                    title: "Decision Making",
                    description: "Get data-driven insights before making major choices",
                    color: "from-yellow-500 to-orange-500",
                    iconColor: "text-yellow-400"
                  },
                  {
                    icon: Sparkles,
                    title: "Personal Growth",
                    description: "Accelerate skills and amplify your digital presence",
                    color: "from-pink-500 to-rose-500",
                    iconColor: "text-pink-400"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Key Features Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-16"
              >
                {[
                  { 
                    icon: "🧠", 
                    title: "AI-Powered", 
                    description: "Advanced Gemini AI for personality analysis" 
                  },
                  { 
                    icon: "⚡", 
                    title: "Real-Time", 
                    description: "Instant simulations and decision insights" 
                  },
                  { 
                    icon: "🔒", 
                    title: "Secure", 
                    description: "Your data is protected and private" 
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.9 + index * 0.1, duration: 0.6 }}
                    className="text-center p-6 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1, duration: 0.8 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                  <Button
                    onClick={handleGetStarted}
                    className="group bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  >
                    <span className="flex items-center">
                      Start Your AI Journey
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="group border-2 border-white/30 hover:border-white/60 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
                  >
                    <span className="flex items-center">
                      Watch Demo
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                      >
                        ▶️
                      </motion.div>
                    </span>
                  </Button>
                </div>

                {/* Technology Stack */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.3, duration: 0.8 }}
                  className="text-center"
                >
                  <p className="text-sm text-gray-400 mb-4">Powered by cutting-edge technology</p>
                  <div className="flex justify-center items-center space-x-6 sm:space-x-8 opacity-60">
                    <div className="text-lg sm:text-xl font-semibold text-white">Google Gemini</div>
                    <div className="text-lg sm:text-xl font-semibold text-white">Next.js</div>
                    <div className="text-lg sm:text-xl font-semibold text-white">Farcaster</div>
                    <div className="text-lg sm:text-xl font-semibold text-white">TypeScript</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 'personality' && (
            <motion.div
              key="personality"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PersonalityCapture onComplete={handlePersonalityComplete} />
            </motion.div>
          )}

          {currentStep === 'clones' && (
            <motion.div
              key="clones"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AICloneDashboard onCloneCreated={handleCloneCreated} />
            </motion.div>
          )}

          {currentStep === 'simulations' && (
            <motion.div
              key="simulations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SimulationRunner />
              <div className="flex justify-center space-x-4 mt-8">
                <Button
                  onClick={handleNavigateToSocial}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  Social Media Army
                </Button>
                <Button
                  onClick={handleNavigateToSkills}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  Skill Accelerator
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SocialMediaArmy clones={clones} />
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setCurrentStep('simulations')}
                  variant="outline"
                >
                  Back to Simulations
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SkillAccelerator clones={clones} />
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setCurrentStep('simulations')}
                  variant="outline"
                >
                  Back to Simulations
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
