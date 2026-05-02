// Web Audio APIの初期化や共通操作をまとめる
export const useAudio = () => {
  const resumeAudio = async (audioCtx: AudioContext) => {
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
  };

  const createOscillator = (audioCtx: AudioContext, freq: number) => {
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    return osc;
  };

  return { resumeAudio, createOscillator };
};