import React from 'react';
import { Play, Download } from 'lucide-react';

interface ControlsProps {
  onSpeak: () => void;
  onDownload: () => void;
  isProcessing: boolean;
}

export default function Controls({ onSpeak, onDownload, isProcessing }: ControlsProps) {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={onSpeak}
        disabled={isProcessing}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Play className="w-5 h-5" />
        Speak
      </button>
      <button
        onClick={onDownload}
        disabled={isProcessing}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Download className="w-5 h-5" />
        Download MP3
      </button>
    </div>
  );
}