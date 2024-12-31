const addNaturalPause = (text: string): string => {
  // Add subtle pauses after punctuation for more natural speech
  return text
    .replace(/([.!?])\s+/g, '$1... ')
    .replace(/([,;:])\s+/g, '$1.. ');
};

const optimizeUtterance = (utterance: SpeechSynthesisUtterance): void => {
  // Add slight variations to make speech more natural
  utterance.volume = 1.0;  // Full volume for clarity
  utterance.rate = Math.max(0.9, Math.min(1.1, utterance.rate));  // Keep rate natural
  utterance.pitch = Math.max(0.8, Math.min(1.2, utterance.pitch)); // Limit pitch range for naturalness
};

export const textToAudioBlob = async (
  text: string,
  voice: SpeechSynthesisVoice,
  pitch: number,
  rate: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const context = new AudioContext({ sampleRate: 48000 }); // Higher sample rate for better quality
    const mediaStreamDestination = context.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream, {
      mimeType: 'audio/webm;codecs=opus' // Use Opus codec for better quality
    });
    const audioChunks: BlobPart[] = [];

    const utterance = new SpeechSynthesisUtterance(addNaturalPause(text));
    utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    optimizeUtterance(utterance);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
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