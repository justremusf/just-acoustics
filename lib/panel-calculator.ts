export type RoomType =
  | "office"
  | "restaurant"
  | "tuition"
  | "gym"
  | "church"
  | "residential"
  | "studio"
  | "other";

export type MainProblem =
  | "echo"
  | "speech"
  | "loud"
  | "video"
  | "music"
  | "noise"
  | "unsure";

export type TreatmentArea = "walls" | "ceiling" | "both" | "unsure";
export type Severity = "light" | "noticeable" | "severe";

export interface CalculatorInputs {
  roomType: RoomType;
  mainProblem: MainProblem;
  length: number | "";
  width: number | "";
  height: number | "";
  treatmentArea: TreatmentArea;
  severity: Severity;
}

export interface CalculatorResults {
  floorArea: number;
  volume: number;
  recommendedMin: number;
  recommendedMax: number;
  coverageMin: number;
  coverageMax: number;
  treatmentLabel: string;
  placementGuidance: string;
  isNoiseWarning: boolean;
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  office: "Office / Meeting Room",
  restaurant: "Restaurant / Café",
  tuition: "Tuition Centre / Classroom",
  gym: "Gym / Fitness Studio",
  church: "Church / Worship Hall",
  residential: "Residential Room",
  studio: "Home Studio / Music Room",
  other: "Other Space",
};

export const MAIN_PROBLEM_LABELS: Record<MainProblem, string> = {
  echo: "Echo / Reverb",
  speech: "Speech is unclear",
  loud: "Room gets too loud",
  video: "Video calls sound bad",
  music: "Music sounds harsh",
  noise: "Noise travelling to another room (Soundproofing)",
  unsure: "Not sure",
};

export const TREATMENT_AREA_LABELS: Record<TreatmentArea, string> = {
  walls: "Walls only",
  ceiling: "Ceiling only",
  both: "Walls + Ceiling",
  unsure: "Not sure",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  light: "Light echo",
  noticeable: "Noticeable echo",
  severe: "Very echoey",
};

export const ROOM_FACTORS: Record<RoomType, number> = {
  office: 0.28,
  restaurant: 0.35,
  tuition: 0.32,
  gym: 0.4,
  church: 0.38,
  residential: 0.22,
  studio: 0.36,
  other: 0.3,
};

export const SEVERITY_MULTIPLIERS: Record<Severity, number> = {
  light: 0.8,
  noticeable: 1.0,
  severe: 1.25,
};

export const TREATMENT_MULTIPLIERS: Record<TreatmentArea, number> = {
  walls: 0.95,
  ceiling: 0.9,
  both: 1.1,
  unsure: 1.0,
};

export const PANEL_AREA = 0.72; // 1.2m x 0.6m = 0.72 sqm

export function getHeightMultiplier(height: number): number {
  if (height <= 2.8) return 1.0;
  if (height <= 3.5) return 1.1;
  if (height <= 4.5) return 1.25;
  return 1.4;
}

export function getPlacementGuidance(roomType: RoomType): string {
  switch (roomType) {
    case "office":
      return "Wall reflections at sitting height (ear level) + meeting zones / phone booth areas first.";
    case "restaurant":
      return "Distribute across the ceiling directly above dining areas first to capture chatter at the source.";
    case "tuition":
      return "Teacher-facing wall, rear wall reflections, and ceiling clarity zones to ensure clean speech transmission.";
    case "gym":
      return "Heavy ceiling cloud treatment combined with upper wall coverage to manage high impact noise.";
    case "church":
      return "Ceiling clouds above congregation + rear wall treatment to minimize delayed sound reflections.";
    case "residential":
      return "Position near TV, desk, or main living seating reflection points for domestic comfort.";
    case "studio":
      return "Focus on first reflection points (sides and ceiling) + behind speakers & listening position.";
    case "other":
      return "Prioritize largest reflective surfaces and parallel hard walls first to eliminate flutter echo.";
  }
}

export function getTreatmentLabel(panels: number): string {
  if (panels <= 8) return "Light treatment";
  if (panels <= 20) return "Standard treatment";
  if (panels <= 40) return "Strong treatment";
  return "Large-space treatment";
}

function roundToNextEven(val: number): number {
  const rounded = Math.ceil(val);
  return rounded % 2 === 0 ? rounded : rounded + 1;
}

export function calculatePanels(
  inputs: CalculatorInputs,
): CalculatorResults | null {
  const {
    roomType,
    mainProblem,
    length,
    width,
    height,
    treatmentArea,
    severity,
  } = inputs;

  if (
    length === "" ||
    width === "" ||
    height === "" ||
    isNaN(length as number) ||
    isNaN(width as number) ||
    isNaN(height as number) ||
    (length as number) <= 0 ||
    (width as number) <= 0 ||
    (height as number) <= 0
  ) {
    return null;
  }

  const floorArea = (length as number) * (width as number);
  const volume = (length as number) * (width as number) * (height as number);

  const baseFactor = ROOM_FACTORS[roomType] ?? ROOM_FACTORS.other;
  const severityMultiplier =
    SEVERITY_MULTIPLIERS[severity] ?? SEVERITY_MULTIPLIERS.noticeable;
  const treatmentMultiplier =
    TREATMENT_MULTIPLIERS[treatmentArea] ?? TREATMENT_MULTIPLIERS.unsure;
  const heightMultiplier = getHeightMultiplier(height as number);

  const targetCoverage =
    floorArea *
    baseFactor *
    severityMultiplier *
    treatmentMultiplier *
    heightMultiplier;
  const rawPanelCount = Math.ceil(targetCoverage / PANEL_AREA);

  const rawMin = Math.max(4, Math.floor(rawPanelCount * 0.85));
  const rawMax = Math.max(rawMin + 2, Math.ceil(rawPanelCount * 1.15));

  const recommendedMin = roundToNextEven(rawMin);
  const recommendedMax = roundToNextEven(rawMax);

  const coverageMin = recommendedMin * PANEL_AREA;
  const coverageMax = recommendedMax * PANEL_AREA;

  const treatmentLabel = getTreatmentLabel(recommendedMin);
  const placementGuidance = getPlacementGuidance(roomType);
  const isNoiseWarning = mainProblem === "noise";

  return {
    floorArea,
    volume,
    recommendedMin,
    recommendedMax,
    coverageMin,
    coverageMax,
    treatmentLabel,
    placementGuidance,
    isNoiseWarning,
  };
}

export function generateWhatsAppUrl(
  inputs: CalculatorInputs,
  results: CalculatorResults,
  productName?: string,
): string {
  const phone = "6589301905";
  const baseUrl = "https://wa.me/" + phone;

  const roomText = ROOM_TYPE_LABELS[inputs.roomType] || inputs.roomType;
  const problemText =
    MAIN_PROBLEM_LABELS[inputs.mainProblem] || inputs.mainProblem;
  const treatmentText =
    TREATMENT_AREA_LABELS[inputs.treatmentArea] || inputs.treatmentArea;
  const severityText = SEVERITY_LABELS[inputs.severity] || inputs.severity;

  const message = `Hello Just Acoustics, I would like to get a quote.

${productName ? `- *Product*: ${productName}\n` : ""}Here are my room details:
- *Room Type*: ${roomText}
- *Main Problem*: ${problemText}
- *Dimensions*: ${inputs.length}m (L) x ${inputs.width}m (W) x ${inputs.height}m (H)
- *Floor Area*: ${results.floorArea.toFixed(1)} sqm
- *Volume*: ${results.volume.toFixed(1)} m³
- *Treatment Area*: ${treatmentText}
- *Severity*: ${severityText}

*Estimated Requirement*:
- Recommended Panels: ${results.recommendedMin}-${results.recommendedMax} panels
- Coverage: ${results.coverageMin.toFixed(1)}-${results.coverageMax.toFixed(1)} sqm (${results.treatmentLabel})

Please advise on the next steps!`;

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
