import React, { useState, useEffect } from 'react';
import { Volume2, Settings, X } from 'lucide-react';
import Controls from './Controls';
import { findMatchingVoice } from '../utils/voices';
import { textToAudioBlob } from '../utils/audio';

const VOICE_PRESETS = [
  { name: 'Deep Voice', pitch: 0.5 },
  { name: 'Normal Voice', pitch: 1 },
  { name: 'High Voice', pitch: 1.5 }
];

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setSystemVoices(voices);
      
      // Pre-warm the speech synthesis
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!text) return;

    const matchedVoice = findMatchingVoice(systemVoices);
    if (!matchedVoice) {
      alert('No voice is available on your system. Please check your browser settings.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = matchedVoice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const downloadAudio = async () => {
    if (!text) return;

    const matchedVoice = findMatchingVoice(systemVoices);
    if (!matchedVoice) {
      alert('No voice is available on your system. Please check your browser settings.');
      return;
    }

    try {
      setIsProcessing(true);
      const audioBlob = await textToAudioBlob(text, matchedVoice, pitch, rate);
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'speech.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Volume2 className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Text to Speech</h1>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Voice Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Variations
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {VOICE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setPitch(preset.pitch)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          Math.abs(pitch - preset.pitch) < 0.1
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fine-tune Pitch
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed: {rate}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <Controls
            onSpeak={speak}
            onDownload={downloadAudio}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}