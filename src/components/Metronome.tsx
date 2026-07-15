import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ToneType = 'wood' | 'sine' | 'square' | 'beep';
type Subdivision = 'off' | 'eighth' | 'triplet';

const toneLabels: Record<ToneType, string> = {
  wood: 'ウッド',
  sine: 'サイン',
  square: 'スクエア',
  beep: 'ビープ',
};

const subdivisionLabels: Record<Subdivision, string> = {
  off: 'なし',
  eighth: '八分音符',
  triplet: '三連符',
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const Metronome = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [swing, setSwing] = useState(0);
  const [toneType, setToneType] = useState<ToneType>('wood');
  const [subdivision, setSubdivision] = useState<Subdivision>('eighth');
  const audioContextRef = useRef<AudioContext | null>(null);
  const timersRef = useRef<number[]>([]);

  const beatMs = useMemo(() => 60000 / bpm, [bpm]);
  const phaseOffsetMs = useMemo(() => (swing / 100) * beatMs, [beatMs, swing]);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const playTone = useCallback((accent: boolean, quiet = false) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const frequencyBase = accent ? 1320 : 880;

    oscillator.type = toneType === 'wood' || toneType === 'beep' ? 'triangle' : toneType;
    oscillator.frequency.setValueAtTime(toneType === 'wood' ? frequencyBase * 0.75 : frequencyBase, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(quiet ? 0.12 : accent ? 0.45 : 0.32, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (toneType === 'wood' ? 0.07 : 0.12));
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
  }, [toneType]);

  useEffect(() => {
    timersRef.current.forEach(window.clearInterval);
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];

    if (!isPlaying) return;

    let beatIndex = 0;
    const tick = () => {
      const normalizedBeat = beatIndex % beatsPerBar;
      setCurrentBeat(normalizedBeat + 1);
      playTone(normalizedBeat === 0);
      beatIndex += 1;
    };

    const firstDelay = Math.max(0, phaseOffsetMs);
    const startTimer = window.setTimeout(() => {
      tick();
      timersRef.current.push(window.setInterval(tick, beatMs));
    }, firstDelay);
    timersRef.current.push(startTimer);

    if (subdivision !== 'off') {
      const divisionCount = subdivision === 'eighth' ? 2 : 3;
      const scheduleSubdivision = () => {
        for (let index = 1; index < divisionCount; index += 1) {
          const timer = window.setTimeout(() => playTone(false, true), firstDelay + (beatMs / divisionCount) * index);
          timersRef.current.push(timer);
        }
      };
      scheduleSubdivision();
      timersRef.current.push(window.setInterval(scheduleSubdivision, beatMs));
    }

    return () => {
      timersRef.current.forEach(window.clearInterval);
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
    };
  }, [beatMs, beatsPerBar, isPlaying, phaseOffsetMs, playTone, subdivision]);

  const pendulumAngle = isPlaying && currentBeat > 0 ? (currentBeat % 2 === 0 ? 24 : -24) : 0;

  return (
    <section className="screen metronome-screen" aria-label="メトロノーム">
      <header className="screen-header">
        <p className="eyebrow">Metoroo</p>
        <h1>メトロノーム</h1>
      </header>

      <div className="pendulum-card">
        <div className="pendulum-stage">
          <div className="pendulum-rod" style={{ transform: `rotate(${pendulumAngle}deg)` }}>
            <span className="pendulum-weight" />
          </div>
        </div>
        <div className="beat-dots" aria-label="拍子表示">
          {Array.from({ length: beatsPerBar }, (_, index) => (
            <span key={index} className={currentBeat === index + 1 ? 'active' : ''} />
          ))}
        </div>
      </div>

      <div className="bpm-panel">
        <button onClick={() => setBpm((value) => clamp(value - 5, 30, 260))}>-5</button>
        <button onClick={() => setBpm((value) => clamp(value - 1, 30, 260))}>-</button>
        <div className="bpm-readout"><strong>{bpm}</strong><span>BPM</span></div>
        <button onClick={() => setBpm((value) => clamp(value + 1, 30, 260))}>+</button>
        <button onClick={() => setBpm((value) => clamp(value + 5, 30, 260))}>+5</button>
      </div>
      <input className="wide-slider" type="range" min="30" max="260" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} />

      <div className="control-grid">
        <label>拍子<select value={beatsPerBar} onChange={(event) => setBeatsPerBar(Number(event.target.value))}>{[2, 3, 4, 5, 6, 7].map((beat) => <option key={beat} value={beat}>{beat}/4</option>)}</select></label>
        <label>音色<select value={toneType} onChange={(event) => setToneType(event.target.value as ToneType)}>{Object.entries(toneLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>間の音<select value={subdivision} onChange={(event) => setSubdivision(event.target.value as Subdivision)}>{Object.entries(subdivisionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>

      <label className="offset-control">一拍内の発音ずらし: <strong>{phaseOffsetMs.toFixed(0)}ms</strong><input type="range" min="-45" max="45" value={swing} onChange={(event) => setSwing(Number(event.target.value))} /></label>
      <button className="primary-action" onClick={() => {
        setIsPlaying((value) => {
          if (value) setCurrentBeat(0);
          return !value;
        });
      }}>{isPlaying ? '停止' : '再生'}</button>
    </section>
  );
};

export default Metronome;
