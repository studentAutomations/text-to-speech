import { Voice } from './types';

// Enhanced voice detection with quality preferences
const MALE_VOICE_PATTERNS = [
  'premium male', // Some systems have premium quality voices
  'enhanced male',
  'neural male', // Neural voices tend to sound more natural
  'google uk english male', // Google voices are typically high quality
  'microsoft david',
  'microsoft mark',
  'male',
];

export const findMatchingVoice = (
  systemVoices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined => {
  // Sort voices by quality (some systems indicate quality in the name)
  const sortedVoices = [...systemVoices].sort((a, b) => {
    const aQuality = a.name.toLowerCase().includes('premium') || 
                    a.name.toLowerCase().includes('enhanced') || 
                    a.name.toLowerCase().includes('neural') ? 1 : 0;
    const bQuality = b.name.toLowerCase().includes('premium') || 
                    b.name.toLowerCase().includes('enhanced') || 
                    b.name.toLowerCase().includes('neural') ? 1 : 0;
    return bQuality - aQuality;
  });

  // Try each male voice pattern until we find a match
  for (const pattern of MALE_VOICE_PATTERNS) {
    const match = sortedVoices.find(voice => 
      voice.name.toLowerCase().includes(pattern) &&
      voice.lang.startsWith('en')
    );
    if (match) return match;
  }

  // Last resort: return the first English voice available
  return sortedVoices.find(voice => voice.lang.startsWith('en'));
};