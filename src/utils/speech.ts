export interface Voice {
  name: string;
  lang: string;
  gender: 'male' | 'female';
}

// These voices are widely supported across different browsers and systems
export const defaultVoices: Voice[] = [
  { name: 'Google US English', lang: 'en-US', gender: 'female' },
  { name: 'Google UK English Female', lang: 'en-GB', gender: 'female' },
  { name: 'Google UK English Male', lang: 'en-GB', gender: 'male' },
  { name: 'Google US English', lang: 'en-US', gender: 'male' }
];

export const findMatchingVoice = (
  systemVoices: SpeechSynthesisVoice[],
  targetVoice: Voice
): SpeechSynthesisVoice | undefined => {
  // First try to find an exact match
  let match = systemVoices.find(voice => 
    voice.name === targetVoice.name
  );

  // If no exact match, try to find a voice with matching language and gender
  if (!match) {
    match = systemVoices.find(voice => 
      voice.lang.startsWith(targetVoice.lang) && 
      voice.name.toLowerCase().includes(targetVoice.gender)
    );
  }

  // If still no match, fall back to any voice with matching language
  if (!match) {
    match = systemVoices.find(voice => 
      voice.lang.startsWith(targetVoice.lang)
    );
  }

  return match;
};

export const textToAudioBlob = async (
  text: string,
  voice: SpeechSynthesisVoice,
  pitch: number,
  rate: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const context = new AudioContext();
    const mediaStreamDestination = context.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    const audioChunks: BlobPart[] = [];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      resolve(audioBlob);
    };

    mediaRecorder.start();
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      mediaRecorder.stop();
      context.close();
    };

    utterance.onerror = (event) => {
      reject(event.error);
    };
  });
};