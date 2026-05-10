export type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'soft' | 'rigid' | 'nudge';

const HAPTIC_PATTERNS: Record<HapticIntensity, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  soft: 5,
  rigid: 15,
  nudge: [15, 30, 10],
  success: [15, 100, 30], // Two-stage Apple Pay style
  error: [10, 50, 10, 50, 10], // Triple buzz
};

// --- Advanced Web Haptics State ---
let hapticLabel: HTMLLabelElement | null = null;
let audioCtx: AudioContext | null = null;
let audioFilter: BiquadFilterNode | null = null;
let audioGain: GainNode | null = null;
let audioBuffer: AudioBuffer | null = null;
let domInitialized = false;

// 1. Ensure the invisible DOM switch exists for the iOS Safari hack
function ensureDOM() {
  if (domInitialized || typeof document === 'undefined') return;

  const id = 'ios-haptic-switch-hack';
  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.style.position = 'fixed';
  label.style.bottom = '-9999px';
  label.style.left = '-9999px';
  label.style.opacity = '0';
  label.style.pointerEvents = 'none';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', ''); // The magic iOS 17 attribute
  input.id = id;

  label.appendChild(input);
  document.body.appendChild(label);

  hapticLabel = label;
  domInitialized = true;
}

// Helper to play a single mechanical tick
function playSingleThump(multiplier: number, freqModifier: number = 1) {
  if (!audioCtx || !audioFilter || !audioGain || !audioBuffer) return;

  audioGain.gain.value = multiplier;

  // Add slight randomization to frequency for a more mechanical feel
  const baseFreq = 2000 + multiplier * 2000;
  const jitter = 1 + (Math.random() - 0.5) * 0.2;
  audioFilter.frequency.value = baseFreq * jitter * freqModifier;

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioFilter);
  source.onended = () => source.disconnect();
  source.start();
}

// 2. Play the audio thump with support for multi-stage patterns
function playAudioThump(intensity: HapticIntensity) {
  switch (intensity) {
    case 'success':
      // Two-stage Apple Pay style (light click, then deep solid click)
      playSingleThump(0.6, 1.2); 
      setTimeout(() => playSingleThump(1.0, 0.8), 120);
      break;
    case 'error':
      // Triple fast buzz
      playSingleThump(0.8, 1.5);
      setTimeout(() => playSingleThump(0.8, 1.5), 80);
      setTimeout(() => playSingleThump(0.8, 1.5), 160);
      break;
    case 'nudge':
      playSingleThump(0.7);
      setTimeout(() => playSingleThump(0.4), 80);
      break;
    case 'soft':
      playSingleThump(0.3, 1.5); // Higher pitch, lower volume = softer click
      break;
    case 'rigid':
      playSingleThump(1.0, 0.7); // Lower pitch, high volume = rigid thud
      break;
    case 'heavy':
      playSingleThump(1.0);
      break;
    case 'medium':
      playSingleThump(0.7);
      break;
    case 'light':
    default:
      playSingleThump(0.4);
      break;
  }
}

export function triggerHaptic(intensity: HapticIntensity = 'light') {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  try {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // --- 1. Initialize DOM & Audio on first use ---
    // Must be triggered synchronously inside a user gesture (like a click)
    ensureDOM();

    if (!audioCtx && typeof window !== 'undefined') {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        audioCtx = new Ctx();

        audioFilter = audioCtx.createBiquadFilter();
        audioFilter.type = 'bandpass';
        audioFilter.frequency.value = 4000;
        audioFilter.Q.value = 8;

        audioGain = audioCtx.createGain();
        
        audioFilter.connect(audioGain);
        audioGain.connect(audioCtx.destination);

        // Create a tiny noise buffer
        const duration = 0.004;
        audioBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 25);
        }
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      // Resume silently
      audioCtx.resume().catch(() => {});
    }

    // --- 2. The iOS Switch Hack ---
    // Clicking this triggers the native iOS system haptic for switches
    if (hapticLabel) {
      hapticLabel.click();
    }

    // --- 3. The Audio Thump Hack ---
    // Plays a mechanical thump sound
    playAudioThump(intensity);

    // --- 4. The Standard Web Vibration API ---
    // This handles Android devices perfectly
    if ('vibrate' in navigator) {
      navigator.vibrate(HAPTIC_PATTERNS[intensity]);
    }
  } catch (error) {
    // Silently fail if blocked by browser policies or unsupported
    console.warn('Haptic feedback failed or blocked:', error);
  }
}
