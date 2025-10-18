"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Avatar3DProps {
  personality?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  isAnimating?: boolean;
  className?: string;
}

// Simplified avatar component without Three.js for Vercel compatibility
export function Avatar3D({ personality, isAnimating = true, className = '' }: Avatar3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate avatar properties based on personality
  const getAvatarProperties = () => {
    if (!personality) {
      return {
        color: 'from-purple-500 to-pink-500',
        size: 'w-16 h-16',
        shape: 'rounded-full'
      };
    }

    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = personality;
    
    // Color based on personality traits
    const hue = (openness * 360 + extraversion * 120) % 360;
    const saturation = 70 + (neuroticism * 30);
    const lightness = 50 + (agreeableness * 30);
    
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Size based on conscientiousness
    const size = conscientiousness > 0.7 ? 'w-20 h-20' : conscientiousness > 0.4 ? 'w-16 h-16' : 'w-12 h-12';
    
    // Shape based on openness
    const shape = openness > 0.7 ? 'rounded-full' : openness > 0.4 ? 'rounded-2xl' : 'rounded-lg';
    
    return { color, size, shape };
  };

  const properties = getAvatarProperties();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg overflow-hidden flex items-center justify-center ${className}`}
    >
      <motion.div
        className={`${properties.size} ${properties.shape} bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-2xl`}
        animate={isAnimating ? { 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ 
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="text-white text-2xl">🧠</div>
      </motion.div>
    </motion.div>
  );
}

// Personality visualization component
export function PersonalityVisualization({ personality }: { personality: Avatar3DProps['personality'] }) {
  if (!personality) return null;

  const traits = [
    { name: 'Openness', value: personality.openness, color: '#8B5CF6' },
    { name: 'Conscientiousness', value: personality.conscientiousness, color: '#06B6D4' },
    { name: 'Extraversion', value: personality.extraversion, color: '#10B981' },
    { name: 'Agreeableness', value: personality.agreeableness, color: '#F59E0B' },
    { name: 'Neuroticism', value: personality.neuroticism, color: '#EF4444' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Personality Traits</h3>
      <div className="space-y-3">
        {traits.map((trait) => (
          <div key={trait.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{trait.name}</span>
              <span className="text-white font-medium">{Math.round(trait.value * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: trait.color }}
                initial={{ width: 0 }}
                animate={{ width: `${trait.value * 100}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}