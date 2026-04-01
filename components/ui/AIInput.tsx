'use client';

import { useState } from 'react';

interface AIInputProps {
  onSubmit?: (value: string) => void;
}

const suggestions = [
  "Budget-friendly",
  "Ocean view",
  "Luxury suite",
  "City center",
  "Free breakfast",
];

export default function AIInput({
  onSubmit,
}: AIInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && onSubmit) {
      onSubmit(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (onSubmit) {
      onSubmit(suggestion);
    }
  };

  return (
    <div className="fixed inset-0 flex mt-60 justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-3xl px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Where Do You Want{' '}
            <span className="bg-linear-to-r from-orange-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
              To Stay?
            </span>
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            🏨 Tell us your preferences and let AI find your perfect hotel
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-full px-7 py-4 shadow-2xl border border-white/40">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="e.g., 'City center in Tashkent'"
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-lg"
            />
            <button
              type="submit"
              className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-7 py-2 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Search
            </button>
          </div>

          {/* Suggestion Chips */}
          {showSuggestions && !input && (
            <div className="space-y-3 animate-fadeIn">
              {/* <p className="text-sm text-white/80 drop-shadow px-2">💡 Try these suggestions:</p> */}
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full text-sm transition-all hover:shadow-lg hover:scale-105 backdrop-blur-sm border border-white/30 font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}