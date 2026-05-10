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
  light: 65,
  medium: 110,
  heavy: 180,
  soft: 45,
  rigid: 150,
  nudge: [50, 80, 50],
  success: [45, 110, 90], // Stronger nudge then deep thud
  purchase: [45, 110, 90],
  error: [70, 60, 70, 60, 70],
  error_buzz: [70, 60, 70, 60, 70],
  cart: 200, // Very solid heavy thump
  menu: 130, // Rigid mechanical click
  tick: 50, // More present tick
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
 */
function initAudioEngine() {
  if (audioCtx || typeof window === 'undefined') return;

  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;

    audioCtx = new Ctx();
    audioFilter = audioCtx.createBiquadFilter();
    audioFilter.type = 'lowpass';
    audioFilter.frequency.value = 300; // Even deeper for "Stronger" feel
    audioFilter.Q.value = 2.0; // Higher resonance

    audioGain = audioCtx.createGain();
    audioFilter.connect(audioGain);
    audioGain.connect(audioCtx.destination);

    const duration = 0.08; // Slightly longer for more "body"
    const sampleRate = audioCtx.sampleRate;
    audioBuffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < channelData.length; i++) {
      const decay = Math.exp(-i / (sampleRate * 0.02)); 
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

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;

  const now = audioCtx.currentTime;
  audioGain.gain.cancelScheduledValues(now);
  audioGain.gain.setValueAtTime(0, now);
  audioGain.gain.linearRampToValueAtTime(volume * 1.5, now + 0.002); // Boosted volume
  audioGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  audioFilter.frequency.setValueAtTime(frequency, now);

  source.connect(audioFilter);
  source.start(now);
  source.stop(now + 0.08);
}

// 2. Play the audio thump with support for multi-stage patterns
function playAudioThump(intensity: HapticIntensity) {
  switch (intensity) {
    case 'purchase':
    case 'success':
      playSingleThump(0.5, 400); 
      setTimeout(() => playSingleThump(1.0, 120), 180);
      break;
    
    case 'error':
    case 'error_buzz':
      playSingleThump(0.8, 450);
      setTimeout(() => playSingleThump(0.8, 450), 100);
      setTimeout(() => playSingleThump(0.8, 450), 200);
      break;

    case 'cart':
    case 'heavy':
      playSingleThump(1.2, 100); // Massive thump
      break;

    case 'menu':
    case 'rigid':
      playSingleThump(0.9, 200);
      break;

    case 'tick':
    case 'soft':
    case 'light':
      playSingleThump(0.4, 450);
      break;

    case 'medium':
    case 'nudge':
    default:
      playSingleThump(0.7, 250);
      break;
  }
}

export function triggerHaptic(intensity: HapticIntensity = 'light') {
  if (typeof window === 'undefined') return;

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ensureDOM();
    initAudioEngine();

    if (hapticLabel) {
      hapticLabel.click();
    }

    playAudioThump(intensity);

    if ('vibrate' in navigator) {
      const pattern = HAPTIC_PATTERNS[intensity] || HAPTIC_PATTERNS.light;
      navigator.vibrate(pattern);
    }
  } catch (error) {
    // Silent fail
  }
}


