export type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'soft' | 'rigid' | 'nudge';

const HAPTIC_PATTERNS: Record<HapticIntensity, number | number[]> = {
  light: 15,
  medium: 35,
  heavy: 60,
  soft: 10,
  rigid: 25,
  nudge: [20, 40, 15],
  success: [20, 120, 40], 
  error: [15, 60, 15, 60, 15],
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

  // Increased volume for a more present, tactile feel
  audioGain.gain.value = multiplier * 0.9;

  // SIGNIFICANTLY lowered base frequency for a deep, bassy thump (Premium feel)
  const baseFreq = 150 + multiplier * 350;
  const jitter = 1 + (Math.random() - 0.5) * 0.05; 
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
      // Two-stage Apple Pay style - Slower and deeper
      playSingleThump(0.4, 0.8); 
      setTimeout(() => playSingleThump(0.8, 0.6), 250); // Increased delay
      break;
    case 'error':
      // Triple fast buzz - slowed down slightly
      playSingleThump(0.6, 1.2);
      setTimeout(() => playSingleThump(0.6, 1.2), 120);
      setTimeout(() => playSingleThump(0.6, 1.2), 240);
      break;
    case 'nudge':
      // Subtle double bump
      playSingleThump(0.5, 0.9);
      setTimeout(() => playSingleThump(0.3, 0.8), 150); // Increased delay
      break;
    case 'soft':
      playSingleThump(0.2, 1.2); // Extremely subtle
      break;
    case 'rigid':
      playSingleThump(0.9, 0.5); // Deep, solid thud (lower freq)
      break;
    case 'heavy':
      playSingleThump(0.8, 0.8);
      break;
    case 'medium':
      playSingleThump(0.5, 0.9);
      break;
    case 'light':
    default:
      playSingleThump(0.3, 1.0);
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
        audioFilter.type = 'lowpass'; // Switched to lowpass for more bass
        audioFilter.frequency.value = 800; // Cut off high frequencies
        audioFilter.Q.value = 2; // Smoother curve

        audioGain = audioCtx.createGain();
        
        audioFilter.connect(audioGain);
        audioGain.connect(audioCtx.destination);

        // Create a tiny noise buffer
        // Create a slightly longer noise buffer with slower decay for more "body"
        const duration = 0.04;
        audioBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 150);
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
