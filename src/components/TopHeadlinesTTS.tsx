import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, Radio, Pause, Play } from 'lucide-react';
import { newsReader } from '@/lib/utils/speech';
import type { Article } from '@/types';

interface TopHeadlinesTTSProps {
  articles: Article[];
}

export function TopHeadlinesTTS({ articles }: TopHeadlinesTTSProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (isPlaying) {
        newsReader.stop();
      }
    };
  }, [isPlaying]);

  const formatNewscast = () => {
    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const intro = `Good ${getTimeOfDay()}! This is your news update for ${currentTime}.`;
    const headlines = articles
      .slice(0, 5)
      .map((article, index) => {
        const source = article.source ? ` according to ${article.source}` : '';
        return `Story ${index + 1}: ${article.title}${source}`;
      });
    
    return [intro, ...headlines, "That's all for now. Thank you for listening!"].join('. ');
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const handlePlay = async () => {
    if (isPaused) {
      newsReader.resume();
      setIsPaused(false);
      return;
    }

    if (!articles.length) return;

    setLoading(true);
    try {
      const newscast = formatNewscast();
      await newsReader.speak(newscast, true);
      setIsPlaying(true);
    } catch (error) {
      if (error instanceof Error && error.message !== 'interrupted') {
        console.error('Newscast error:', error);
      }
    } finally {
      setLoading(false);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    newsReader.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    newsReader.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!articles.length) return null;

  return (
    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 via-primary/10 to-blue-500/10 rounded-lg animate-fade-in">
      <Radio className="w-4 h-4 text-red-500 animate-pulse" />
      <span className="text-sm font-medium">Live News Bulletin</span>
      
      <div className="flex items-center gap-1">
        {isPlaying ? (
          <>
            {isPaused ? (
              <button
                onClick={handlePlay}
                className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                title="Resume newscast"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                title="Pause newscast"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleStop}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              title="Stop newscast"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handlePlay}
            disabled={loading}
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Listen to news bulletin"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}