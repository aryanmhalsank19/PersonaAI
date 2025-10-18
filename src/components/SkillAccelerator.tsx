"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, Clock, Trophy, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Progress } from './ui/Progress';

interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  timeAccelerated: number;
  progress: number;
  status: 'idle' | 'practicing' | 'completed';
}

interface SkillSession {
  id: string;
  skillId: string;
  duration: number;
  progress: number;
  completedAt: Date;
  achievements: string[];
}

interface SkillAcceleratorProps {
  clones: any[];
}

export function SkillAccelerator({ clones }: SkillAcceleratorProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedClone, setSelectedClone] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const skillCategories = [
    { id: 'programming', name: 'Programming', icon: Brain, color: 'text-blue-400' },
    { id: 'design', name: 'Design', icon: Target, color: 'text-purple-400' },
    { id: 'writing', name: 'Writing', icon: Zap, color: 'text-green-400' },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'text-pink-400' },
    { id: 'languages', name: 'Languages', icon: Brain, color: 'text-yellow-400' },
  ];

  const predefinedSkills = [
    { name: 'React Development', category: 'programming', targetLevel: 5 },
    { name: 'UI/UX Design', category: 'design', targetLevel: 4 },
    { name: 'Content Writing', category: 'writing', targetLevel: 3 },
    { name: 'Digital Marketing', category: 'marketing', targetLevel: 4 },
    { name: 'Spanish', category: 'languages', targetLevel: 3 },
    { name: 'Python', category: 'programming', targetLevel: 4 },
    { name: 'Photography', category: 'design', targetLevel: 3 },
    { name: 'Public Speaking', category: 'writing', targetLevel: 4 },
  ];

  useEffect(() => {
    // Initialize skills from predefined list
    const initialSkills: Skill[] = predefinedSkills.map((skill, index) => ({
      id: `skill-${index}`,
      name: skill.name,
      category: skill.category,
      currentLevel: Math.floor(Math.random() * 2) + 1,
      targetLevel: skill.targetLevel,
      timeAccelerated: 0,
      progress: 0,
      status: 'idle'
    }));
    setSkills(initialSkills);
  }, []);

  const startPractice = async () => {
    if (!selectedClone || !selectedSkill) return;

    setIsPracticing(true);
    setSessionProgress(0);
    setSessionTime(0);
    setAchievements([]);

    // Simulate practice session
    const sessionDuration = 30; // 30 seconds for demo
    const interval = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;
        const progress = (newTime / sessionDuration) * 100;
        setSessionProgress(progress);

        // Simulate achievements
        if (newTime === 10 && !achievements.includes('First Milestone')) {
          setAchievements(prev => [...prev, 'First Milestone']);
        }
        if (newTime === 20 && !achievements.includes('Halfway There')) {
          setAchievements(prev => [...prev, 'Halfway There']);
        }

        if (newTime >= sessionDuration) {
          completeSession();
          clearInterval(interval);
        }
        return newTime;
      });
    }, 1000);
  };

  const completeSession = () => {
    if (!selectedSkill) return;

    setIsPracticing(false);
    
    // Update skill progress
    setSkills(prev => prev.map(skill => 
      skill.id === selectedSkill.id 
        ? {
            ...skill,
            currentLevel: Math.min(skill.currentLevel + 1, skill.targetLevel),
            timeAccelerated: skill.timeAccelerated + sessionTime,
            progress: Math.min(skill.progress + 20, 100),
            status: skill.currentLevel + 1 >= skill.targetLevel ? 'completed' : 'idle'
          }
        : skill
    ));

    // Add final achievement
    setAchievements(prev => [...prev, 'Session Complete!']);
  };

  const resetSkill = (skillId: string) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId 
        ? { ...skill, currentLevel: 1, progress: 0, status: 'idle' }
        : skill
    ));
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = skillCategories.find(c => c.id === categoryId);
    return category?.icon || Brain;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = skillCategories.find(c => c.id === categoryId);
    return category?.color || 'text-gray-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Skill Accelerator</h2>
        <p className="text-xl text-gray-300 mb-6">
          Accelerate skill learning through AI-powered time-compressed simulations
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Clone Selection & Skills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Clone Selection */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Select AI Clone</CardTitle>
              <CardDescription className="text-gray-400">
                Choose which AI clone will practice the skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {clones.map((clone) => (
                  <div
                    key={clone.id}
                    onClick={() => setSelectedClone(clone)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedClone?.id === clone.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">{clone.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill) => {
              const Icon = getCategoryIcon(skill.category);
              const color = getCategoryColor(skill.category);
              const isCompleted = skill.status === 'completed';
              
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedSkill?.id === skill.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : isCompleted
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Icon className={`w-5 h-5 mr-2 ${color}`} />
                      <div>
                        <h4 className="font-semibold text-white">{skill.name}</h4>
                        <p className="text-xs text-gray-400 capitalize">{skill.category}</p>
                      </div>
                    </div>
                    {isCompleted && <Trophy className="w-5 h-5 text-yellow-400" />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Level {skill.currentLevel}/{skill.targetLevel}</span>
                      <span className="text-white">{Math.round(skill.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted ? 'bg-green-400' : 'bg-purple-400'
                        }`}
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Time: {formatTime(skill.timeAccelerated)}</span>
                      <span className={isCompleted ? 'text-green-400' : ''}>
                        {isCompleted ? 'Completed' : skill.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Practice Session */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Practice Controls */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Practice Session</CardTitle>
              <CardDescription className="text-gray-400">
                {selectedSkill ? `Practice ${selectedSkill.name}` : 'Select a skill to practice'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSkill && (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatTime(sessionTime)}
                    </div>
                    <div className="text-sm text-gray-400">Session Time</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{Math.round(sessionProgress)}%</span>
                    </div>
                    <Progress value={sessionProgress} className="h-2" />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={startPractice}
                      disabled={isPracticing || selectedSkill.status === 'completed'}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      {isPracticing ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Practicing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Practice
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => resetSkill(selectedSkill.id)}
                      variant="outline"
                      className="p-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Achievements</CardTitle>
              <CardDescription className="text-gray-400">
                Track your learning milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {achievements.length === 0 ? (
                  <p className="text-gray-400 text-sm">No achievements yet</p>
                ) : (
                  achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-2 bg-white/5 rounded-lg"
                    >
                      <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-white text-sm">{achievement}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Skills</span>
                  <span className="text-white font-semibold">{skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-white font-semibold">
                    {skills.filter(s => s.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Time</span>
                  <span className="text-white font-semibold">
                    {formatTime(skills.reduce((acc, skill) => acc + skill.timeAccelerated, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
