import { useEffect, useMemo, useRef, useState } from 'react';

const noteNames = ['C', 'C# / D♭', 'D', 'D# / E♭', 'E', 'F', 'F# / G♭', 'G', 'G# / A♭', 'A', 'A# / B♭', 'B'];
const historySize = 96;

const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
  let rms = 0;
  for (const value of buffer) rms += value * value;
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.01) return -1;

  let bestOffset = -1;
  let bestCorrelation = 0;
  const maxSamples = Math.floor(buffer.length / 2);
  const correlations = new Array<number>(maxSamples);

  for (let offset = 8; offset < maxSamples; offset += 1) {
    let correlation = 0;
    for (let index = 0; index < maxSamples; index += 1) {
      correlation += Math.abs(buffer[index] - buffer[index + offset]);
    }
    correlation = 1 - correlation / maxSamples;
    correlations[offset] = correlation;
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestCorrelation <= 0.01 || bestOffset === -1) return -1;
  const previous = correlations[bestOffset - 1] ?? bestCorrelation;
  const next = correlations[bestOffset + 1] ?? bestCorrelation;
  const shift = (next - previous) / (2 * (2 * bestCorrelation - next - previous));
  return sampleRate / (bestOffset + shift);
};

const frequencyToNote = (frequency: number, concertPitch: number) => {
  const midi = Math.round(12 * Math.log2(frequency / concertPitch) + 69);
  const targetFrequency = concertPitch * 2 ** ((midi - 69) / 12);
  const cents = 1200 * Math.log2(frequency / targetFrequency);
  return {
    name: noteNames[((midi % 12) + 12) % 12],
    octave: Math.floor(midi / 12) - 1,
    cents,
    targetFrequency,
  };
};

const Tuner = () => {
  const [concertPitch, setConcertPitch] = useState(442);
  const [frequency, setFrequency] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState<number[]>(Array(historySize).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const note = useMemo(() => (frequency > 0 ? frequencyToNote(frequency, concertPitch) : null), [concertPitch, frequency]);

  const stopListening = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
    animationRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
  };

  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 4096;
    ctx.createMediaStreamSource(stream).connect(analyser);
    streamRef.current = stream;
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    setIsListening(true);

    const buffer = new Float32Array(analyser.fftSize);
    const analyse = () => {
      analyser.getFloatTimeDomainData(buffer);
      const pitch = autoCorrelate(buffer, ctx.sampleRate);
      if (pitch > 35 && pitch < 2000) {
        setFrequency(pitch);
        const cents = frequencyToNote(pitch, concertPitch).cents;
        setHistory((values) => [...values.slice(1), Math.max(-50, Math.min(50, cents))]);
      } else {
        setHistory((values) => [...values.slice(1), 0]);
      }
      animationRef.current = requestAnimationFrame(analyse);
    };
    analyse();
  };

  useEffect(() => stopListening, []);

  return (
    <section className="screen tuner-screen" aria-label="チューナー">
      <header className="screen-header">
        <p className="eyebrow">Chromatic tuner</p>
        <h1>チューナー</h1>
      </header>

      <div className="tuner-display">
        <div className="note-name">{note ? `${note.name}${note.octave}` : '--'}</div>
        <p>{frequency > 0 ? `${frequency.toFixed(1)} Hz / 目標 ${note?.targetFrequency.toFixed(1)} Hz` : 'マイク入力を開始してください'}</p>
        <div className="cent-meter">
          <span>-50</span><div><i style={{ left: `${50 + (note?.cents ?? 0)}%` }} /></div><span>+50</span>
        </div>
        <strong className={Math.abs(note?.cents ?? 99) < 5 ? 'in-tune' : 'out-tune'}>{note ? `${note.cents > 0 ? '+' : ''}${note.cents.toFixed(1)} cents` : '待機中'}</strong>
      </div>

      <div className="pitch-history" aria-label="音程履歴グラフ">
        <div className="center-line" />
        {history.map((cents, index) => (
          <span key={`${index}-${cents}`} style={{ top: `${(index / (history.length - 1)) * 100}%`, left: `${50 + cents}%` }} />
        ))}
      </div>

      <label className="offset-control">基準音 A = <strong>{concertPitch}Hz</strong><input type="range" min="430" max="450" step="1" value={concertPitch} onChange={(event) => setConcertPitch(Number(event.target.value))} /></label>
      <div className="bpm-panel compact">
        <button onClick={() => setConcertPitch((value) => Math.max(430, value - 1))}>-1Hz</button>
        <button onClick={() => setConcertPitch(442)}>442Hz</button>
        <button onClick={() => setConcertPitch((value) => Math.min(450, value + 1))}>+1Hz</button>
      </div>
      <button className="primary-action" onClick={() => (isListening ? stopListening() : startListening())}>{isListening ? '解析を停止' : '音解析を開始'}</button>
    </section>
  );
};

export default Tuner;
