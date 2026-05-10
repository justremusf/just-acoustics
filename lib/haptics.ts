export type HapticIntensity = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'success' 
  | 'error' 
  | 'soft' 
  | 'rigid' 
  | 'nudge'
  | 'cart'
  | 'purchase'
  | 'menu'
  | 'tick'
  | 'error_buzz';

const HAPTIC_PATTERNS: Record<string, number | number[]> = {
  light: 40,
  medium: 60,
  heavy: 85,
  soft: 30,
  rigid: 75,
  nudge: [35, 60, 35],
  success: [30, 80, 70], // Light nudge then deep thud
  purchase: [30, 80, 70],
  error: [50, 50, 50, 50, 50],
  error_buzz: [50, 50, 50, 50, 50],
  cart: 90, // Solid heavy thump
  menu: 70, // Rigid mechanical click
  tick: 30, // Soft tick
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
  if (document.getElementById(id)) {
    hapticLabel = document.querySelector(`label[for="${id}"]`);
    domInitialized = true;
    return;
  }

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.style.position = 'fixed';
  label.style.bottom = '-9999px';
  label.style.left = '-9999px';
  label.style.opacity = '0';
  label.style.pointerEvents = 'none';
  label.style.zIndex = '-1';

  const input = document.createElement('input');
  input.type = 'checkbox';
  // @ts-ignore - 'switch' is a non-standard attribute that triggers native haptics on iOS 17.4+
  input.setAttribute('switch', ''); 
  input.id = id;

  label.appendChild(input);
  document.body.appendChild(label);

  hapticLabel = label;
  domInitialized = true;
}

/**
 * Builds the Web Audio "Thump" Engine
 * Uses a BiquadFilter (lowpass) and a noise buffer with exponential decay
 * to simulate premium mechanical feedback.
 */
function initAudioEngine() {
  if (audioCtx || typeof window === 'undefined') return;

  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;

    audioCtx = new Ctx();
    audioFilter = audioCtx.createBiquadFilter();
    audioFilter.type = 'lowpass';
    audioFilter.frequency.value = 350; // Deep and bassy by default
    audioFilter.Q.value = 1.5;

    audioGain = audioCtx.createGain();
    audioFilter.connect(audioGain);
    audioGain.connect(audioCtx.destination);

    // Create a 0.06s noise buffer for "body" and weight
    const duration = 0.06;
    const sampleRate = audioCtx.sampleRate;
    audioBuffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < channelData.length; i++) {
      // White noise with exponential decay
      // Decay factor adjusted for "mechanical" weight (longer tail)
      const decay = Math.exp(-i / (sampleRate * 0.015)); 
      channelData[i] = (Math.random() * 2 - 1) * decay;
    }
  } catch (e) {
    console.warn('Web Audio initialization failed', e);
  }
}

// Helper to play a single mechanical thump
function playSingleThump(volume: number, frequency: number) {
  if (!audioCtx || !audioFilter || !audioGain || !audioBuffer) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // Create source
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;

  // Configure dynamics for this specific thump
  const now = audioCtx.currentTime;
  audioGain.gain.cancelScheduledValues(now);
  audioGain.gain.setValueAtTime(0, now);
  audioGain.gain.linearRampToValueAtTime(volume, now + 0.002);
  audioGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  audioFilter.frequency.setValueAtTime(frequency, now);

  source.connect(audioFilter);
  source.start(now);
  source.stop(now + 0.06);
}

// 2. Play the audio thump with support for multi-stage patterns
function playAudioThump(intensity: HapticIntensity) {
  switch (intensity) {
    case 'purchase':
    case 'success':
      // Two-stage "Apple Pay" style - light nudge followed by deep thud
      playSingleThump(0.3, 450); 
      setTimeout(() => playSingleThump(0.8, 150), 180);
      break;
    
    case 'error':
    case 'error_buzz':
      // Triple fast buzz
      playSingleThump(0.6, 500);
      setTimeout(() => playSingleThump(0.6, 500), 100);
      setTimeout(() => playSingleThump(0.6, 500), 200);
      break;

    case 'cart':
    case 'heavy':
      // Solid, heavy rigid thump (like a heavy object landing)
      playSingleThump(1.0, 120);
      break;

    case 'menu':
    case 'rigid':
      // Rigid mechanical click - feels like a physical latch
      playSingleThump(0.7, 250);
      break;

    case 'tick':
    case 'soft':
    case 'light':
      // Soft, high-end "tick"
      playSingleThump(0.3, 500);
      break;

    case 'medium':
    case 'nudge':
    default:
      playSingleThump(0.5, 300);
      break;
  }
}

export function triggerHaptic(intensity: HapticIntensity = 'light') {
  if (typeof window === 'undefined') return;

  try {
    // Respect user's motion preferences as a proxy for sensitivity
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // --- 1. Initialize ---
    ensureDOM();
    initAudioEngine();

    // --- 2. iOS Switch Hack ---
    if (hapticLabel) {
      hapticLabel.click();
    }

    // --- 3. Web Audio Thump ---
    playAudioThump(intensity);

    // --- 4. Android / Standard Vibrate ---
    if ('vibrate' in navigator) {
      const pattern = HAPTIC_PATTERNS[intensity] || HAPTIC_PATTERNS.light;
      navigator.vibrate(pattern);
    }
  } catch (error) {
    // Silent fail
  }
}

