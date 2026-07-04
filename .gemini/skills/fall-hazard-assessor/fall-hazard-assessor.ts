/**
 * Fall Hazard Assessor
 *
 * Rule-based fall hazard assessment for construction sites.
 * Identifies leading edges, recommends protection hierarchy, generates rescue plan.
 *
 * Korean construction fatality #1 cause (~42% of deaths).
 *
 * @version 1.0.0
 */

export interface FallHazardInput {
  work_area: string;
  work_height_m: number;           // 2m+ requires fall protection (OSHA-KR Art 99)
  workers_at_risk: number;
  leading_edges: string[];          // descriptions of fall-risk edges
  openings: string[];               // floor/roof openings
  weather_condition: 'clear' | 'wind' | 'rain' | 'snow' | 'ice';
  duration_hours: number;
  contractor_tier: 'prime' | 'first_sub' | 'second_sub_below';
}

export interface ProtectionMeasure {
  level: 'elimination' | 'passive_guardrail' | 'safety_net' | 'active_harness' | 'admin_control' | 'ppe';
  description: string;
  required: boolean;
  verified: boolean;
}

export interface FallHazardOutput {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  protection_measures: ProtectionMeasure[];
  work_suspension_recommended: boolean;
  rescue_plan_required: boolean;
  estimated_hazard_score: number;
  recommendations: string[];
}

/**
 * Assess fall hazard and generate protection plan
 */
export function assessFallHazard(input: FallHazardInput): FallHazardOutput {
  let hazardScore = 0;
  const measures: ProtectionMeasure[] = [];
  const recommendations: string[] = [];
  let suspendWork = false;
  let rescuePlan = false;

  // ── Height factor ───────────────────────────────────────────────────
  if (input.work_height_m >= 2) {
    hazardScore += 20; // OSHA-KR Art 99 threshold
    measures.push({
      level: 'passive_guardrail',
      description: `1.1m guardrail with mid-rail at ${input.work_height_m}m edge`,
      required: true,
      verified: false,
    });
  }
  if (input.work_height_m >= 6) {
    hazardScore += 15;
    measures.push({
      level: 'safety_net',
      description: 'Safety net within 10m below work area',
      required: true,
      verified: false,
    });
    rescuePlan = true;
  }
  if (input.work_height_m >= 10) {
    hazardScore += 15;
    measures.push({
      level: 'active_harness',
      description: 'Full-body harness with self-retracting lifeline for all workers',
      required: true,
      verified: false,
    });
    rescuePlan = true;
  }

  // ── Leading edges ───────────────────────────────────────────────────
  hazardScore += input.leading_edges.length * 10;
  if (input.leading_edges.length > 3) {
    recommendations.push(`${input.leading_edges.length} leading edges identified — install continuous edge protection`);
  }

  // ── Openings ────────────────────────────────────────────────────────
  hazardScore += input.openings.length * 15;
  for (const opening of input.openings) {
    measures.push({
      level: 'passive_guardrail',
      description: `Cover + secure opening: ${opening} (rated for 2x load)`,
      required: true,
      verified: false,
    });
  }

  // ── Weather conditions ──────────────────────────────────────────────
  if (input.weather_condition === 'wind') {
    hazardScore += 20;
    recommendations.push('Wind speed >14m/s — suspend work at height');
    suspendWork = true;
  }
  if (input.weather_condition === 'rain' || input.weather_condition === 'snow') {
    hazardScore += 15;
    recommendations.push(`${input.weather_condition} — slippery surface risk, apply anti-slip measures`);
  }
  if (input.weather_condition === 'ice') {
    hazardScore += 25;
    recommendations.push('Ice condition — suspend work at height immediately');
    suspendWork = true;
  }

  // ── Workers at risk ─────────────────────────────────────────────────
  if (input.workers_at_risk >= 5) {
    hazardScore += 10;
    recommendations.push(`${input.workers_at_risk} workers at risk — designate safety monitor`);
  }

  // ── Duration ────────────────────────────────────────────────────────
  if (input.duration_hours >= 4) {
    hazardScore += 5;
    recommendations.push(`Long duration (${input.duration_hours}h) — implement rotation and rest breaks`);
  }

  // ── Always required PPE ─────────────────────────────────────────────
  measures.push({
    level: 'ppe',
    description: 'Safety helmet with chinstrap + slip-resistant safety boots',
    required: true,
    verified: false,
  });

  // ── Admin controls ──────────────────────────────────────────────────
  measures.push({
    level: 'admin_control',
    description: `Permit-to-work (PTW) required for work >2m. TBM briefing before work.`,
    required: input.work_height_m >= 2,
    verified: false,
  });
  measures.push({
    level: 'admin_control',
    description: `Safety monitor: dedicated person for continuous observation`,
    required: input.workers_at_risk >= 3 || input.work_height_m >= 6,
    verified: false,
  });

  // ── Risk level determination ────────────────────────────────────────
  let riskLevel: FallHazardOutput['risk_level'] = 'low';
  if (hazardScore >= 80) riskLevel = 'critical';
  else if (hazardScore >= 50) riskLevel = 'high';
  else if (hazardScore >= 25) riskLevel = 'medium';

  // ── Rescue plan ─────────────────────────────────────────────────────
  if (rescuePlan) {
    recommendations.push('Suspension trauma risk — prepare rescue plan within 10 minutes');
    recommendations.push('Equip: tripod + retrieval line + rescue-trained personnel on standby');
    recommendations.push('Emergency contact: 119 (fire/rescue) — pre-notify for height rescue');
  }

  // ── Contractor tier SAPA ────────────────────────────────────────────
  if (input.contractor_tier === 'second_sub_below') {
    recommendations.push('SAPA Art 13: Prime contractor must verify subcontractor safety compliance');
  }

  return {
    risk_level: riskLevel,
    protection_measures: measures,
    work_suspension_recommended: suspendWork,
    rescue_plan_required: rescuePlan,
    estimated_hazard_score: hazardScore,
    recommendations,
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────

if (import.meta.main) {
  const testCases: FallHazardInput[] = [
    {
      work_area: '5th floor roof — east wing',
      work_height_m: 15,
      workers_at_risk: 4,
      leading_edges: ['East parapet 30m', 'South opening 2m × 1m'],
      openings: ['HVAC duct opening 1m × 1m'],
      weather_condition: 'clear',
      duration_hours: 6,
      contractor_tier: 'first_sub',
    },
    {
      work_area: 'Elevator shaft — level 3',
      work_height_m: 4,
      workers_at_risk: 2,
      leading_edges: ['Shaft opening 2m × 2m'],
      openings: [],
      weather_condition: 'clear',
      duration_hours: 2,
      contractor_tier: 'second_sub_below',
    },
    {
      work_area: ' Exterior scaffolding — north facade',
      work_height_m: 25,
      workers_at_risk: 6,
      leading_edges: ['Full north facade 50m'],
      openings: ['Window openings 4 units'],
      weather_condition: 'wind',
      duration_hours: 8,
      contractor_tier: 'prime',
    },
  ];

  console.log('=== Fall Hazard Assessment Test ===\n');

  for (const input of testCases) {
    const result = assessFallHazard(input);
    console.log(`Work Area: ${input.work_area}`);
    console.log(`  Height: ${input.work_height_m}m | Workers: ${input.workers_at_risk} | Weather: ${input.weather_condition}`);
    console.log(`  Hazard Score: ${result.estimated_hazard_score} | Risk: ${result.risk_level.toUpperCase()}`);
    console.log(`  Work Suspension: ${result.work_suspension_recommended ? 'YES' : 'No'}`);
    console.log(`  Rescue Plan: ${result.rescue_plan_required ? 'YES' : 'No'}`);
    console.log(`  Protection Measures (${result.protection_measures.length}):`);
    for (const m of result.protection_measures) {
      const req = m.required ? '✓' : '○';
      console.log(`    ${req} [${m.level}] ${m.description}`);
    }
    console.log(`  Recommendations:`);
    for (const r of result.recommendations) {
      console.log(`    → ${r}`);
    }
    console.log('');
  }
}
