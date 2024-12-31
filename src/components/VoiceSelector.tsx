import React from 'react';
import { Voice } from '../utils/speech';

interface VoiceSelectorProps {
  selectedVoice: Voice;
  onVoiceChange: (voice: Voice) => void;
  voices: Voice[];
}

export default function VoiceSelector({ selectedVoice, onVoiceChange, voices }: VoiceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {voices.map((voice) => (
        <button
          key={voice.name}
          onClick={() => onVoiceChange(voice)}
          className={`p-3 rounded-lg border-2 transition-all ${
            selectedVoice.name === voice.name
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="text-sm font-medium">{voice.name}</div>
          <div className="text-xs text-gray-500">{voice.gender}</div>
        </button>
      ))}
    </div>
  );
}