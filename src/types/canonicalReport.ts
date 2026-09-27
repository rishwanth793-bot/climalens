/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ClimateLens Single Source of Truth — Canonical Data & Provenance Model
 * Enforces strict data provenance, deterministic calculations, synchronization,
 * and pre-download PDF audit validation.
 */

export type CanonicalSourceType =
  | 'REPORTED'
  | 'CALCULATED'
  | 'EXTERNALLY_SOURCED'
  | 'ESTIMATED'
  | 'UNAVAILABLE'
  | 'REQUIRES_REVIEW';

export type CanonicalValidationStatus =
  | 'VALIDATED'
  | 'REQUIRES_REVIEW'
  | 'INSUFFICIENT_EVIDENCE'
  | 'DISCREPANCY_DETECTED';

export type CanonicalExtractionStatus =
  | 'EXTRACTED_EXACT'
  | 'EXTRACTED_FOOTNOTE'
  | 'EXTRACTED_TABLE'
  | 'DERIVED'
  | 'NOT_DISCLOSED';

export type CanonicalCalculationType =
  | 'DIRECT_SUM'
  | 'RATIO'
  | 'INTENSITY'
  | 'SI_CONVERSION'
  | 'NONE';

export interface CanonicalMetricRecord {
  id: string; // Unique canonical key e.g. 'scope1', 'scope2_loc', 'total_ghg'
  name: string;
  category: 'Emissions' | 'Energy' | 'Water' | 'Waste' | 'Production' | 'Intensity';
  value: string; // Formatted display value or explicit unavailable statement
  numericValue: number | null; // Null if unavailable
  unit: string;
  
  // Provenance (Section 2)
  sourceType: CanonicalSourceType;
  sourceDocument: string;
  sourcePage: number | null;
  sourceSection: string;
  sourceText: string;
  
  reportingPeriod: string;
  
  extractionStatus: CanonicalExtractionStatus;
  validationStatus: CanonicalValidationStatus;
  
  // Calculation & Dependency (Sections 15, 16, 18)
  calculationType: CanonicalCalculationType;
  calculationFormula?: string;
  calculationInputs?: string[]; // IDs of dependent inputs
  calculatedResult?: number | null;
  
  // External Source (Section 13)
  externalSource?: string;
  externalSourceUrl?: string;
  externalSourcePublisher?: string;
  externalSourceYear?: number;
  externalSourceMethodology?: string;
  
  // Auditing & Standardization (Sections 8, 9, 33)
  assumptions?: string;
  limitations?: string;
  standardTaxonomyCode: string;
  standardizedUnit?: string;
  standardizedValue?: string;
  standardizedNumericValue?: number | null;
  conversionFactorApplied?: string;
  
  // Longitudinal (Section 10)
  previousPeriodValue?: number | null;
  varianceFromPrevious?: number | null;
  historicalSeries?: Array<{ period: string; value: number | null; unit: string }>;
  
  // Verification Review State
  verificationStatus: 'verified' | 'flagged' | 'adjusted' | 'pending' | 'dismissed';
  reviewer?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  ambiguityReason?: string;
}

export interface ConsistencyCheckRecord {
  id: string;
  name: string;
  category: string;
  formula: string;
  inputs: Array<{
    id: string;
    name: string;
    value: string;
    numericValue: number | null;
    unit: string;
  }>;
  calculatedResultFormatted: string;
  calculatedNumericResult: number | null;
  reportedResultFormatted: string;
  reportedNumericResult: number | null;
  differenceFormatted: string;
  differenceNumeric: number | null;
  unit: string;
  status: 'CONSISTENT' | 'INCONSISTENT' | 'CANNOT_EVALUATE';
  explanation: string;
  recommendedAction?: string;
}

export interface ExternalBenchmarkRecord {
  id: string;
  metricId: string;
  metricName: string;
  benchmarkName: string;
  benchmarkValue: string;
  benchmarkNumeric: number;
  unit: string;
  sourceName: string;
  publisher: string;
  publication: string;
  year: number;
  dataYear: string;
  url: string;
  geographicScope: string;
  industryScope: string;
  methodology: string;
  retrievedDate: string;
  comparabilityStatus: 'COMPARABLE' | 'REQUIRES_NORMALIZATION' | 'NOT_RELIABLE';
  comparabilityExplanation: string;
  facilityValueFormatted: string;
  variancePercentage?: number;
}

export interface FacilityProfileRecord {
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
  isDemo: boolean;
  demoLabel: string;
}

export interface CanonicalReportSnapshot {
  snapshotId: string;
  reportId: string;
  reportVersion: string; // e.g. 'v1', 'v2', 'v3'
  versionNumber: number;
  generatedAt: string;
  facility: FacilityProfileRecord;
  summaryCounts: {
    totalMetrics: number;
    sourceMatched: number; // REPORTED
    calculated: number;
    externallySourced: number;
    requiresReview: number;
    unavailable: number;
    invalid: number;
    averageConfidence: number;
  };
  metrics: Record<string, CanonicalMetricRecord>;
  metricsList: CanonicalMetricRecord[];
  consistencyChecks: ConsistencyCheckRecord[];
  benchmarks: ExternalBenchmarkRecord[];
  historicalData: Array<{
    period: string;
    scope1: number;
    scope2: number;
    totalEmissions: number;
    energyMWh: number;
    waterKL: number;
    wasteTonnes: number;
    productionTonnes: number;
    carbonIntensity: number;
    renewableShare: number;
    regionalAirIndex: number;
    regionalEmissionsIndex: number;
    regionalWaterStressIndex: number;
  }>;
  regionalIndicators: Array<{
    id: string;
    location: string;
    reportingPeriod: string;
    indicatorName: string;
    category: 'Air Quality' | 'Water Stress' | 'Regional Emissions' | 'Climate & Temperature';
    currentValue: number;
    unit: string;
    indexBaseline: number;
    historicalTrend: { period: string; value: number; index: number }[];
    sourceAgency: string;
    stationId: string;
    confidence: number;
    statusNotes: string;
  }>;
  executiveSummary: string;
  limitations: string[];
  references: Array<{
    title: string;
    publisher: string;
    year: string;
    url: string;
    context: string;
  }>;
  checksum: string;
}
