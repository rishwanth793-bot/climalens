export * from './canonical';
export * from './canonicalReport';

export type MetricCategory = 'Energy' | 'Water' | 'Emissions' | 'Waste' | 'Production' | 'Intensity';

export type ConfidenceTier = 'high' | 'medium' | 'needs_review';

export type VerificationStatus = 'verified' | 'flagged' | 'adjusted' | 'pending' | 'dismissed';

export interface EnvironmentalMetric {
  id: string;
  metricName: string;
  category: MetricCategory;
  value: string;
  numericValue: number;
  unit: string;
  reportingPeriod: string;
  confidenceScore: number;
  confidenceTier: ConfidenceTier;
  sourceDocument: string;
  sourcePage: number;
  sourceSection: string;
  sourceSnippet: string;
  tableReference?: string;
  verificationStatus: VerificationStatus;
  ambiguityReason?: string;
  reviewer?: string;
  reviewedAt?: string;
  notes?: string;
  standardizedValue?: string;
  previousPeriodValue?: number;
  varianceFromPrevious?: number;
}

export type FlagCategory =
  | 'Historical Variance'
  | 'Arithmetic Consistency'
  | 'Unit Consistency'
  | 'Reporting Boundary Change'
  | 'Methodology Change'
  | 'Environmental Context'
  | 'Missing Data';

export type FlagSeverity = 'Low' | 'Medium' | 'High';

export type FlagStatus = 'Requires Review' | 'Investigating' | 'Verified - Explained' | 'Flagged - Follow Up';

export interface VerificationFlag {
  id: string;
  category: FlagCategory;
  metric: string;
  severity: FlagSeverity;
  reportedValue: string;
  referenceValue: string;
  variancePercent: string;
  explanation: string;
  possibleCauses: string[];
  sourceDocument: string;
  sourcePage: number;
  sourceSection: string;
  status: FlagStatus;
  reviewerNote?: string;
  recommendedAction: string;
  createdAt: string;
  relatedMetricId?: string;
}

export interface RegionalIndicatorData {
  id: string;
  location: string;
  reportingPeriod: string;
  indicatorName: string;
  category: 'Air Quality' | 'Water Stress' | 'Regional Emissions' | 'Climate & Temperature';
  currentValue: number;
  unit: string;
  indexBaseline: number; // 100 base
  historicalTrend: { period: string; value: number; index: number }[];
  sourceAgency: string; // e.g., 'TNPCB / CPCB CAAQMS Station Manali Industrial Area'
  stationId: string;
  confidence: number;
  statusNotes: string;
}

export interface HistoricalDataPoint {
  period: string;
  scope1: number;
  scope2: number;
  totalEmissions: number;
  energyMWh: number;
  waterKL: number;
  wasteTonnes: number;
  productionTonnes: number;
  carbonIntensity: number; // tCO2e / tonne cement
  renewableShare: number; // %
  regionalAirIndex: number;
  regionalEmissionsIndex: number;
  regionalWaterStressIndex: number;
}

export interface ReviewerActionLog {
  id: string;
  metricId: string;
  metricName: string;
  action: 'Verify' | 'Flag' | 'Adjust' | 'Dismiss' | 'Clarification Requested' | 'AI Audit Re-Check';
  previousValue: string;
  newValue: string;
  reason: string;
  reviewer: string;
  timestamp: string;
}

export interface ReportItem {
  id: string;
  fileName: string;
  title: string;
  companyName: string;
  facilityName: string;
  location: string;
  reportingPeriod: string;
  uploadedAt: string;
  fileSize: string;
  pageCount: number;
  detectedMetricsCount: number;
  flagsCount: number;
  status: 'Under Review' | 'Processing' | 'Verified' | 'Requires Review' | 'Completed';
  type: 'Integrated Sustainability Report' | 'Unit Energy Disclosure' | 'Water & Effluent Special Disclosure' | 'GHG Inventory';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  linkPage?: string;
}
