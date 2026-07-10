/**
 * GHS Hazard Classifier
 *
 * Rule-based GHS (Globally Harmonized System) hazard classification
 * for chemical substances per UN GHS Rev 9.
 *
 * Classifies into hazard classes and generates H-statements (hazard phrases)
 * and P-statements (precautionary phrases).
 *
 * @version 1.0.0
 */

export interface SubstanceProperty {
  name: string;
  cas?: string;
  concentration_pct: number;
  // Physical hazards
  flammable?: boolean;
  flash_point_c?: number;
  initial_boiling_point_c?: number;
  // Health hazards
  acute_toxicity_oral_mgkg?: number;
  acute_toxicity_dermal_mgkg?: number;
  acute_toxicity_inhalation_ppm?: number;
  skin_corrosion?: boolean;
  skin_irritation?: boolean;
  eye_damage?: boolean;
  eye_irritation?: boolean;
  respiratory_sensitizer?: boolean;
  skin_sensitizer?: boolean;
  carcinogen?: boolean;
  mutagen?: boolean;
  reproductive_toxin?: boolean;
  // Environmental hazards
  aquatic_toxicity_mgl?: number;
  aquatic_toxicity_chronic_mgl?: number;
}

export interface GHSClassification {
  hazard_classes: string[];
  category: string;
  h_statements: string[];
  p_statements: string[];
  signal_word: 'Danger' | 'Warning' | 'None';
  pictograms: string[];
}

/**
 * Classify a substance based on its properties
 */
export function classifySubstance(prop: SubstanceProperty): GHSClassification {
  const hazardClasses: string[] = [];
  const hStatements: string[] = [];
  const pStatements: string[] = [];
  const pictograms: string[] = [];
  let maxSeverity: 'Danger' | 'Warning' | 'None' = 'None';

  // ── Flammability (GHS Chapter 2.6 — Flammable Liquids) ──────────────────
  if (prop.flammable || (prop.flash_point_c !== undefined && prop.flash_point_c < 93)) {
    if (prop.flash_point_c !== undefined && prop.flash_point_c < 23) {
      // Cat 1: flash point < 23°C AND initial boiling point ≤ 35°C
      // Cat 2: flash point < 23°C AND initial boiling point > 35°C
      if (prop.initial_boiling_point_c !== undefined && prop.initial_boiling_point_c <= 35) {
        hazardClasses.push('Flammable Liquids Category 1');
        hStatements.push('H224: Extremely flammable liquid and vapour');
      } else {
        hazardClasses.push('Flammable Liquids Category 2');
        hStatements.push('H225: Highly flammable liquid and vapour');
      }
      pictograms.push('GHS02');
      maxSeverity = 'Danger';
    } else if (prop.flash_point_c !== undefined && prop.flash_point_c <= 60) {
      hazardClasses.push('Flammable Liquids Category 3');
      hStatements.push('H226: Flammable liquid and vapour');
      pictograms.push('GHS02');
      if (maxSeverity !== 'Danger') maxSeverity = 'Warning';
    } else if (prop.flash_point_c !== undefined && prop.flash_point_c <= 93) {
      // Category 4 added in GHS Rev 9
      hazardClasses.push('Flammable Liquids Category 4');
      hStatements.push('H227: Combustible liquid');
      if (maxSeverity !== 'Danger') maxSeverity = 'Warning';
    }
  }

  // ── Acute Toxicity (GHS Chapter 3.1) ────────────────────────────────
  // Classify each route independently, then use the most severe category
  // for the combined H-statement, pictogram, and signal word.
  let acuteToxOverallCat: number | undefined;

  function classifyAcuteRoute(
    value: number | undefined,
    routeLabel: string,
    thresholds: number[],
  ): number | undefined {
    if (value === undefined || value === 0) return undefined;
    for (let i = 0; i < thresholds.length; i++) {
      if (value <= thresholds[i]) {
        hazardClasses.push(`Acute Toxicity (${routeLabel}) Category ${i + 1}`);
        return i + 1; // category number (1 = most severe)
      }
    }
    return undefined; // above Cat 4 threshold — not classified
  }

  const oralCat = classifyAcuteRoute(
    prop.acute_toxicity_oral_mgkg,
    'Oral',
    [5, 50, 300, 2000],
  );

  const dermalCat = classifyAcuteRoute(
    prop.acute_toxicity_dermal_mgkg,
    'Dermal',
    [50, 200, 1000, 2000],
  );

  // Inhalation: treat ppm value as gas/vapor, use vapor thresholds
  const inhalationCat = classifyAcuteRoute(
    prop.acute_toxicity_inhalation_ppm,
    'Inhalation',
    [0.5, 2.0, 10, 20], // mg/L vapor thresholds — input assumed mg/L
  );

  // Determine the most severe (lowest category number) across all routes
  const acuteToxCats = [oralCat, dermalCat, inhalationCat].filter(
    (c): c is number => c !== undefined,
  );
  if (acuteToxCats.length > 0) {
    acuteToxOverallCat = Math.min(...acuteToxCats);
  }

  // Emit combined H-statement, pictogram, signal word based on most severe category
  if (acuteToxOverallCat !== undefined) {
    if (acuteToxOverallCat <= 2) {
      hStatements.push('H300: Fatal if swallowed');
      pictograms.push('GHS06');
      maxSeverity = 'Danger';
    } else if (acuteToxOverallCat === 3) {
      hStatements.push('H301: Toxic if swallowed');
      pictograms.push('GHS06');
      maxSeverity = 'Danger';
    } else if (acuteToxOverallCat === 4) {
      hStatements.push('H302: Harmful if swallowed');
      if (maxSeverity !== 'Danger') maxSeverity = 'Warning';
    }
  }

  // ── Skin Corrosion/Irritation (GHS Chapter 3.2) ─────────────────────
  if (prop.skin_corrosion) {
    hazardClasses.push('Skin Corrosion Category 1');
    hStatements.push('H314: Causes severe skin burns and eye damage');
    pictograms.push('GHS05');
    maxSeverity = 'Danger';
  } else if (prop.skin_irritation) {
    hazardClasses.push('Skin Irritation Category 2');
    hStatements.push('H315: Causes skin irritation');
    if (maxSeverity !== 'Danger') maxSeverity = 'Warning';
  }

  // ── Eye Damage/Irritation (GHS Chapter 3.3) ────────────────────────
  if (prop.eye_damage) {
    hazardClasses.push('Eye Damage Category 1');
    hStatements.push('H318: Causes serious eye damage');
    pictograms.push('GHS05');
    maxSeverity = 'Danger';
  } else if (prop.eye_irritation) {
    hazardClasses.push('Eye Irritation Category 2');
    hStatements.push('H319: Causes serious eye irritation');
    if (maxSeverity !== 'Danger') maxSeverity = 'Warning';
  }

  // ── Sensitization (GHS Chapter 3.4) ────────────────────────────────
  if (prop.respiratory_sensitizer) {
    hazardClasses.push('Respiratory Sensitization Category 1');
    hStatements.push('H334: May cause allergy or asthma symptoms');
    pictograms.push('GHS08');
    maxSeverity = 'Danger';
  }
  if (prop.skin_sensitizer) {
    hazardClasses.push('Skin Sensitization Category 1');
    hStatements.push('H317: May cause an allergic skin reaction');
    pictograms.push('GHS07'); // Exclamation mark — required for skin sensitizers per GHS Rev 9
    if (maxSeverity !== 'Danger') maxSeverity = 'Warning';
  }

  // ── Carcinogenicity / Mutagenicity / Reproductive Toxicity ─────────
  if (prop.carcinogen) {
    hazardClasses.push('Carcinogenicity Category 1');
    hStatements.push('H350: May cause cancer');
    pictograms.push('GHS08');
    maxSeverity = 'Danger';
  }
  if (prop.mutagen) {
    hazardClasses.push('Germ Cell Mutagenicity Category 1');
    hStatements.push('H340: May cause genetic defects');
    pictograms.push('GHS08');
    maxSeverity = 'Danger';
  }
  if (prop.reproductive_toxin) {
    hazardClasses.push('Reproductive Toxicity Category 1');
    hStatements.push('H360: May damage fertility or the unborn child');
    pictograms.push('GHS08');
    maxSeverity = 'Danger';
  }

  // ── Aquatic Toxicity (GHS Chapter 4.1 — Acute + Chronic) ─────────────
  if (prop.aquatic_toxicity_mgl !== undefined && prop.aquatic_toxicity_mgl <= 1) {
    hazardClasses.push('Aquatic Toxicity (Acute) Category 1');
    hStatements.push('H400: Very toxic to aquatic life');
    pictograms.push('GHS09');
  } else if (prop.aquatic_toxicity_mgl !== undefined && prop.aquatic_toxicity_mgl <= 10) {
    hazardClasses.push('Aquatic Toxicity (Acute) Category 2');
    hStatements.push('H401: Toxic to aquatic life');
  }
  // Chronic aquatic toxicity (GHS Rev 9)
  if (prop.aquatic_toxicity_chronic_mgl !== undefined && prop.aquatic_toxicity_chronic_mgl <= 0.1) {
    hazardClasses.push('Aquatic Toxicity (Chronic) Category 1');
    hStatements.push('H410: Very toxic to aquatic life with long lasting effects');
    pictograms.push('GHS09');
  } else if (prop.aquatic_toxicity_chronic_mgl !== undefined && prop.aquatic_toxicity_chronic_mgl <= 1) {
    hazardClasses.push('Aquatic Toxicity (Chronic) Category 2');
    hStatements.push('H411: Toxic to aquatic life with long lasting effects');
    pictograms.push('GHS09');
  } else if (prop.aquatic_toxicity_chronic_mgl !== undefined && prop.aquatic_toxicity_chronic_mgl <= 10) {
    hazardClasses.push('Aquatic Toxicity (Chronic) Category 3');
    hStatements.push('H412: Harmful to aquatic life with long lasting effects');
  }

  // ── Generate P-statements based on hazard classes ───────────────────
  if (hazardClasses.length > 0) {
    pStatements.push('P260: Do not breathe dust/fume/gas/mist/vapours/spray');
    pStatements.push('P264: Wash hands thoroughly after handling');
    pStatements.push('P280: Wear protective gloves/eye protection/face protection');
  }
  if (prop.flammable) {
    pStatements.push('P210: Keep away from heat/sparks/open flames — No smoking');
    pStatements.push('P233: Keep container tightly closed');
  }
  if (prop.skin_corrosion || acuteToxOverallCat !== undefined) {
    pStatements.push('P301+P330+P331: IF SWALLOWED — rinse mouth, do NOT induce vomiting');
    pStatements.push('P303+P361+P353: IF ON SKIN — remove contaminated clothing, rinse skin');
  }
  if (hazardClasses.some(h => h.includes('Eye'))) {
    pStatements.push('P305+P351+P338: IF IN EYES — rinse cautiously with water for several minutes');
  }
  pStatements.push('P403+P233: Store in well-ventilated place, keep container tightly closed');
  pStatements.push('P501: Dispose of contents/container to approved waste facility');

  // ── Category determination ──────────────────────────────────────────
  let category = 'Not classified';
  if (hazardClasses.some(h => h.includes('Category 1'))) {
    category = 'Category 1 (Most hazardous)';
  } else if (hazardClasses.some(h => h.includes('Category 2'))) {
    category = 'Category 2';
  } else if (hazardClasses.some(h => h.includes('Category 3') || h.includes('Category 4'))) {
    category = 'Category 3/4';
  }

  return {
    hazard_classes: hazardClasses,
    category,
    h_statements: hStatements,
    p_statements: pStatements,
    signal_word: maxSeverity,
    pictograms: [...new Set(pictograms)], // deduplicate
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────

if (import.meta.main) {
  const testSubstances: SubstanceProperty[] = [
    {
      name: 'Methanol',
      cas: '67-56-1',
      concentration_pct: 100,
      flammable: true,
      flash_point_c: 11,
      acute_toxicity_oral_mgkg: 5628,
    },
    {
      name: 'Hydrochloric Acid (37%)',
      cas: '7647-01-0',
      concentration_pct: 37,
      skin_corrosion: true,
      eye_damage: true,
      acute_toxicity_inhalation_ppm: 3000,
    },
    {
      name: 'Toluene',
      cas: '108-88-3',
      concentration_pct: 100,
      flammable: true,
      flash_point_c: 4,
      skin_irritation: true,
      eye_irritation: true,
      reproductive_toxin: true,
      aquatic_toxicity_mgl: 0.5,
    },
  ];

  console.log('=== GHS Hazard Classification Test ===\n');

  for (const substance of testSubstances) {
    const result = classifySubstance(substance);
    console.log(`Substance: ${substance.name} (CAS: ${substance.cas})`);
    console.log(`  Signal Word: ${result.signal_word}`);
    console.log(`  Pictograms: ${result.pictograms.join(', ') || 'None'}`);
    console.log(`  Category: ${result.category}`);
    console.log(`  Hazard Classes:`);
    for (const hc of result.hazard_classes) {
      console.log(`    - ${hc}`);
    }
    console.log(`  H-Statements:`);
    for (const h of result.h_statements) {
      console.log(`    - ${h}`);
    }
    console.log('');
  }
}
