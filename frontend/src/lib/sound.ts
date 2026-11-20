// Short, quiet answer cues made with Web Audio, so there are no sound files
// to load. A right answer is two soft rising notes; a wrong one a low,
// slightly falling blip. Nothing plays for visitors who ask for reduced
// motion, and any audio failure is ignored.

let context: AudioContext | null = null;

function audio() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}

/** One soft note: a quick attack and an exponential fade. */
function note(
  ctx: AudioContext,
  frequency: number,
  start: number,
  length: number,
  {
    type = 'sine',
    volume = 0.08,
    slideTo,
  }: {
    type?: OscillatorType;
    volume?: number;
    slideTo?: number;
  } = {},
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (slideTo)
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + length);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + length + 0.02);
}

export function playCorrect() {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, 880, t, 0.12); // A5
  note(ctx, 1318.5, t + 0.08, 0.2); // E6
}

export function playWrong() {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, 220, t, 0.22, { type: 'triangle', volume: 0.1, slideTo: 165 });
}
