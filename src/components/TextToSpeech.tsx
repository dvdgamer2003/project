import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, Pause, Play } from 'lucide-react';
import { newsReader } from '@/lib/utils/speech';

interface TextToSpeechProps {
  text: string;
  className?: string;
}

export function TextToSpeech({ text, className = '' }: TextToSpeechProps) {
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

  const handlePlay = async () => {
    if (isPaused) {
      newsReader.resume();
      setIsPaused(false);
      return;
    }

    setLoading(true);
    try {
      await newsReader.speak(text);
      setIsPlaying(true);
    } catch (error) {
      if (error instanceof Error && error.message !== 'interrupted') {
        console.error('Article reading error:', error);
      }
    } finally {
      setLoading(false);
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

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      {isPlaying ? (
        <>
          {isPaused ? (
            <button
              onClick={handlePlay}
              className="p-2 rounded-full backdrop-blur-md bg-primary text-white hover:bg-primary-dark transition-colors"
              title="Resume reading"
            >
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="p-2 rounded-full backdrop-blur-md bg-primary text-white hover:bg-primary-dark transition-colors"
              title="Pause reading"
            >
              <Pause className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleStop}
            className="p-2 rounded-full backdrop-blur-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            title="Stop reading"
          >
            <VolumeX className="w-5 h-5" />
          </button>
        </>
      ) : (
        <button
          onClick={handlePlay}
          disabled={loading}
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${
            loading
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-white/90 text-gray-600 hover:bg-gray-100/90'
          } ${className}`}
          title="Listen to article"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
}