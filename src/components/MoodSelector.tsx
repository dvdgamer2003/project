import React from 'react';
import { MOODS, type Mood } from '@/types/mood';

interface MoodSelectorProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood | undefined) => void;
}

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.entries(MOODS) as [Mood, typeof MOODS[Mood]][]).map(([mood, info]) => (
          <button
            key={mood}
            onClick={() => onMoodSelect(selectedMood === mood ? undefined : mood)}
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              selectedMood === mood
                ? 'bg-primary text-white scale-105'
                : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-2xl mb-2">{info.emoji}</span>
            <span className="font-medium">{info.label}</span>
            <span className="text-xs text-center mt-1 opacity-80">
              {info.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}