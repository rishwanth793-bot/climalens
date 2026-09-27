/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ClimateLens Canonical Data Model
 * Standardized ISO 14064-3, GHG Protocol, and BRSR-aligned environmental intelligence entity schemas.
 */

export type StandardAuthority =
  | 'GHG Protocol'
  | 'ISO 14064-3'
  | 'CPCB / MoEFCC'
  | 'SEBI BRSR Core'
  | 'CEA Grid Baseline'
  | 'BEE PAT Scheme';

export type GroundingStatus = 'VERIFIED_ALIGNED' | 'REQUIRES_REVIEW' | 'BOUNDARY_AMBIGUITY' | 'HISTORICAL_VARIANCE';

export interface GroundingRuleEvaluation {
  ruleId: string;
  authority: StandardAuthority;
  title: string;
  citation: string;
  status: 'PASS' | 'OBSERVATION' | 'ATTENTION_REQUIRED';
  explanation: string;
  recommendedAction?: string;
}

export interface MetricSourceGrounding {
  documentName: string;
  documentId: string;
  pageNumber: number;
  sectionTitle: string;
  tableOrParagraph: string;
  exactExcerpt: string;
  confidenceScore: number; // 0 - 100
  confidenceTier: 'high' | 'medium' | 'needs_review';
  extractionMethod: 'Direct Table Extraction' | 'Narrative Text Parser' | 'Footnote Anchor' | 'Telemetry Reconciliation';
}

export interface MetricVerificationState {
  status: 'verified' | 'flagged' | 'adjusted' | 'pending' | 'dismissed';
  reviewer?: string;
  reviewedAt?: string;
  notes?: string;
  originalReportedValue?: string;
  adjustedValue?: string;
  adjustmentReason?: string;
}

export interface MetricLongitudinalData {
  previousPeriodValue?: number;
  variancePercent?: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
  historicalSeries: Array<{
    period: string; // e.g. 'FY23', 'FY24', 'FY25', 'FY26'
    value: number;
    unit: string;
  }>;
}

export interface CanonicalMetric {
  canonicalId: string; // e.g. 'GHG_SCOPE1_DIRECT', 'ENERGY_GRID_CONSUMPTION'
  legacyId: string; // matches id like 'm-01'
  metricName: string;
  category: 'Emissions' | 'Energy' | 'Water' | 'Waste' | 'Production' | 'Intensity';
  subcategory: string;
  ghgScope?: 'Scope 1' | 'Scope 2 Location' | 'Scope 2 Market' | 'Scope 3' | 'Non-GHG';
  standardTaxonomyCode: string; // e.g. 'GHG-P:SCOPE-1-DIR', 'ISO-14064-1:CAT-1'

  // Values & SI Standardization
  disclosedValue: string;
  numericValue: number;
  disclosedUnit: string;
  standardizedValue: string;
  standardizedNumericValue: number;
  standardizedUnit: string;
  unitConversionExplanation?: string;

  reportingPeriod: string;
  boundaryScope: string; // e.g. 'Operational Control — Dry Process Kiln Line 1'

  sourceGrounding: MetricSourceGrounding;
  verificationState: MetricVerificationState;
  longitudinalData: MetricLongitudinalData;
  groundingEvaluations: GroundingRuleEvaluation[];
}

export interface ArithmeticReconciliationSummary {
  ghgFootprint: {
    scope1: number;
    scope2Location: number;
    calculatedGrossSum: number;
    disclosedGrossTotal: number;
    divergence: number;
    status: 'BALANCED' | 'DISCREPANCY_DETECTED';
    explanation: string;
  };
  energyBalance: {
    gridPowerMWh: number;
    captiveSolarMWh: number;
    totalElectricMWh: number;
    totalGigajoules: number;
    specificPowerIntensityKWhPerTonne: number;
    benchmarkStatus: string;
  };
  waterClosedLoop: {
    freshWithdrawalKL: number;
    effluentRecycledKL: number;
    grossCirculationKL: number;
    recyclingFractionPercent: number;
    zeroLiquidDischargeConfirmed: boolean;
  };
}

export interface CanonicalVerificationDossier {
  dossierId: string;
  facility: {
    companyName: string;
    facilityName: string;
    facilityCode: string;
    industry: string;
    location: string;
    reportingPeriod: string;
    baselineYear: string;
    clinkerCapacity: string;
    cementProduction: string;
    gridRegion: string;
    leadAuditor: string;
  };
  auditTimestamp: string;
  overallAssuranceOpinion: 'Limited Assurance Confirmed' | 'Verified with Observations' | 'Action Required Prior to Sign-off';
  auditConfidenceScore: number;
  totalMetricsAudited: number;
  metrics: CanonicalMetric[];
  arithmeticReconciliation: ArithmeticReconciliationSummary;
  itemizedFlagsCount: {
    requiresReview: number;
    investigating: number;
    verifiedExplained: number;
    flaggedFollowUp: number;
  };
  executiveSummary: string;
  leadVerifierSignOff: {
    verifierName: string;
    verifierRole: string;
    agency: string;
    attestationDate: string;
    digitalCertificateHash: string;
  };
}
