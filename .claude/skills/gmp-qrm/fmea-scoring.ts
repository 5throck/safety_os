/**
 * FMEA Risk Scoring Module
 *
 * Rule-based implementation of Failure Mode and Effects Analysis (FMEA)
 * per ICH Q9 Quality Risk Management methodology.
 *
 * Risk Priority Number (RPN) = Severity × Occurrence × Detection
 *
 * @version 1.0.0
 */

export interface FMEAInput {
  failureMode: string;
  effect: string;
  severity: number;       // 1-10 (1=negligible, 10=catastrophic)
  occurrence: number;     // 1-10 (1=remote, 10=very high)
  detection: number;      // 1-10 (1=almost certain detection, 10=no detection)
  cause?: string;
  currentControls?: string[];
}

export interface FMEAOutput {
  input: FMEAInput;
  rpn: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  recommendedAction: string;
}

/**
 * Calculate Risk Priority Number
 */
export function calculateRPN(severity: number, occurrence: number, detection: number): number {
  return severity * occurrence * detection;
}

/**
 * Classify risk level based on RPN and individual scores
 */
export function classifyRisk(rpn: number, severity: number): FMEAOutput['riskLevel'] {
  if (severity >= 9) return 'critical';
  if (rpn >= 200) return 'high';
  if (rpn >= 100) return 'medium';
  return 'low';
}

/**
 * Determine if action is required and recommend action
 */
export function recommendAction(riskLevel: FMEAOutput['riskLevel'], severity: number, occurrence: number, detection: number): { required: boolean; action: string } {
  switch (riskLevel) {
    case 'critical':
      return { required: true, action: 'Immediate action required — reduce severity (design change) or occurrence (process improvement). Consider halting production.' };
    case 'high':
      return { required: true, action: `Reduce ${occurrence > detection ? 'occurrence' : 'detection'} score via additional controls. Target RPN ≤ 100.` };
    case 'medium':
      return { required: occurrence >= 7 || detection >= 7, action: 'Monitor and improve controls if trend continues. Document justification if accepted.' };
    case 'low':
      return { required: false, action: 'No action required. Continue routine monitoring.' };
  }
}

/**
 * Full FMEA scoring for a single failure mode
 */
export function scoreFMEA(input: FMEAInput): FMEAOutput {
  const rpn = calculateRPN(input.severity, input.occurrence, input.detection);
  const riskLevel = classifyRisk(rpn, input.severity);
  const { required, action } = recommendAction(riskLevel, input.severity, input.occurrence, input.detection);

  return {
    input,
    rpn,
    riskLevel,
    actionRequired: required,
    recommendedAction: action,
  };
}

/**
 * Batch score multiple failure modes and generate summary
 */
export function scoreFMEABatch(inputs: FMEAInput[]): {
  results: FMEAOutput[];
  summary: {
    totalModes: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    actionsRequired: number;
    highestRPN: number;
    averageRPN: number;
  };
} {
  const results = inputs.map(scoreFMEA);
  const summary = {
    totalModes: results.length,
    criticalCount: results.filter(r => r.riskLevel === 'critical').length,
    highCount: results.filter(r => r.riskLevel === 'high').length,
    mediumCount: results.filter(r => r.riskLevel === 'medium').length,
    lowCount: results.filter(r => r.riskLevel === 'low').length,
    actionsRequired: results.filter(r => r.actionRequired).length,
    highestRPN: Math.max(...results.map(r => r.rpn)),
    averageRPN: results.reduce((sum, r) => sum + r.rpn, 0) / results.length,
  };
  return { results, summary };
}

// ── CLI interface for testing ────────────────────────────────────────────────

if (import.meta.main) {
  const testCases: FMEAInput[] = [
    {
      failureMode: 'Incorrect raw material added to batch',
      effect: 'Product quality failure, potential patient harm',
      severity: 9,
      occurrence: 3,
      detection: 4,
      cause: 'Operator error due to similar packaging',
      currentControls: ['Raw material label verification', 'Quarantine area'],
    },
    {
      failureMode: 'Equipment calibration overdue',
      effect: 'Measurement inaccuracy, batch rejection',
      severity: 5,
      occurrence: 4,
      detection: 3,
      cause: 'Calibration schedule not updated',
    },
    {
      failureMode: 'Cleanroom particle count exceeded',
      effect: 'Product contamination, sterility assurance compromised',
      severity: 8,
      occurrence: 2,
      detection: 2,
      cause: 'HEPA filter degradation',
      currentControls: ['Continuous particle monitoring', 'Quarterly HEPA integrity test'],
    },
  ];

  console.log('=== FMEA Risk Scoring Test ===\n');
  const { results, summary } = scoreFMEABatch(testCases);

  for (const result of results) {
    console.log(`Failure Mode: ${result.input.failureMode}`);
    console.log(`  S=${result.input.severity} O=${result.input.occurrence} D=${result.input.detection}`);
    console.log(`  RPN: ${result.rpn} | Risk: ${result.riskLevel.toUpperCase()}`);
    console.log(`  Action required: ${result.actionRequired ? 'YES' : 'No'}`);
    console.log(`  → ${result.recommendedAction}`);
    console.log('');
  }

  console.log('=== Summary ===');
  console.log(`  Total: ${summary.totalModes} | Critical: ${summary.criticalCount} | High: ${summary.highCount}`);
  console.log(`  Actions required: ${summary.actionsRequired}`);
  console.log(`  Highest RPN: ${summary.highestRPN} | Average: ${summary.averageRPN.toFixed(0)}`);
}
