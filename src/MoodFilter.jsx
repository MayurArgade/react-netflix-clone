import React from 'react';

const moods = ['Happy', 'Dark', 'Chill', 'Funny', 'Romantic'];

const MoodFilter = ({ onMoodChange }) => {
  return (
    <div className="flex gap-3 justify-center py-4">
      {moods.map((mood) => (
        <button
          key={mood}
          className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-red-600 transition-all"
          onClick={() => onMoodChange(mood)}
        >
          {mood}
        </button>
      ))}
    </div>
  );
};

export default MoodFilter;
