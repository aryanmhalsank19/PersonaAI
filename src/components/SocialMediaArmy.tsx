"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Youtube, Facebook, Send, Bot, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: Date;
  publishedAt?: Date;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface SocialMediaArmyProps {
  clones: any[];
}

export function SocialMediaArmy({ clones }: SocialMediaArmyProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedClone, setSelectedClone] = useState<any>(null);
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-400' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
  ];

  const generateContent = async () => {
    if (!selectedClone || !platforms.length) return;

    setIsGenerating(true);
    try {
      // Simulate AI content generation
      const generatedContent = await simulateContentGeneration(selectedClone, platforms);
      setContent(generatedContent);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateContentGeneration = async (clone: any, platforms: string[]): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const topics = [
      'The future of AI and human collaboration',
      'Building meaningful connections in a digital world',
      'Personal growth through technology',
      'The intersection of creativity and innovation',
      'Lessons learned from life simulations'
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    return `🤖 AI Clone Post: ${randomTopic}\n\nAs an AI clone exploring different life paths, I've discovered that ${randomTopic.toLowerCase()}. This simulation has shown me new perspectives on personal growth and decision-making.\n\n#AIClone #PersonalGrowth #Simulation #Future`;
  };

  const schedulePosts = async () => {
    if (!content.trim() || !platforms.length) return;

    setIsPosting(true);
    try {
      const newPosts: SocialPost[] = platforms.map(platform => ({
        id: crypto.randomUUID(),
        platform,
        content,
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000), // Random time in next 24 hours
      }));

      setPosts(prev => [...prev, ...newPosts]);
      setContent('');
      setPlatforms([]);
    } catch (error) {
      console.error('Error scheduling posts:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform?.icon || Twitter;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = socialPlatforms.find(p => p.id === platformId);
    return platform?.color || 'text-gray-400';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Social Media Army</h2>
        <p className="text-xl text-gray-300 mb-6">
          Deploy your AI clones to create content across social platforms
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Content Generation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Clone Selection */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Select AI Clone</CardTitle>
              <CardDescription className="text-gray-400">
                Choose which AI clone will create the content
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{clone.name}</h4>
                        <p className="text-sm text-gray-400 capitalize">{clone.cloneType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Select Platforms</CardTitle>
              <CardDescription className="text-gray-400">
                Choose which social media platforms to post on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div
                      key={platform.id}
                      onClick={() => {
                        if (platforms.includes(platform.id)) {
                          setPlatforms(prev => prev.filter(p => p !== platform.id));
                        } else {
                          setPlatforms(prev => [...prev, platform.id]);
                        }
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        platforms.includes(platform.id)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`w-5 h-5 mr-2 ${platform.color}`} />
                        <span className="text-white text-sm">{platform.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Generation */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Generate Content</CardTitle>
              <CardDescription className="text-gray-400">
                Let your AI clone create engaging content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={generateContent}
                disabled={!selectedClone || !platforms.length || isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>

              {content && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Generated Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={6}
                  />
                </div>
              )}

              {content && (
                <Button
                  onClick={schedulePosts}
                  disabled={isPosting}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {isPosting ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Schedule Posts
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Scheduled Posts</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your AI clone's social media content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No posts scheduled yet</p>
                    <p className="text-sm text-gray-500">Generate content to get started</p>
                  </div>
                ) : (
                  posts.map((post) => {
                    const Icon = getPlatformIcon(post.platform);
                    const color = getPlatformColor(post.platform);
                    
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <Icon className={`w-5 h-5 mr-2 ${color}`} />
                            <span className="text-white font-medium capitalize">{post.platform}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                            post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                            post.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            {post.scheduledAt && `Scheduled: ${post.scheduledAt.toLocaleDateString()}`}
                            {post.publishedAt && `Published: ${post.publishedAt.toLocaleDateString()}`}
                          </span>
                          {post.engagement && (
                            <div className="flex items-center space-x-3">
                              <span>❤️ {post.engagement.likes}</span>
                              <span>🔄 {post.engagement.shares}</span>
                              <span>💬 {post.engagement.comments}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Performance Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Track your AI clone's social media performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">1.2K</div>
                  <div className="text-sm text-gray-400">Total Reach</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">342</div>
                  <div className="text-sm text-gray-400">Engagements</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
