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

export function triggerHaptic(intensity: HapticIntensity = 'light') {
  if (typeof window === 'undefined') return;

  try {
    // Respect user's motion preferences as a proxy for sensitivity
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // --- 1. Initialize ---
    ensureDOM();

    // --- 2. iOS Switch Hack ---
    if (hapticLabel) {
      hapticLabel.click();
    }

    // --- 3. Android / Standard Vibrate ---
    if ('vibrate' in navigator) {
      const pattern = HAPTIC_PATTERNS[intensity] || HAPTIC_PATTERNS.light;
      navigator.vibrate(pattern);
    }
  } catch (error) {
    // Silent fail
  }
}

