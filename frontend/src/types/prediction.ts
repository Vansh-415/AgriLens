export interface CalculatedDosage {
  active_ingredient: string;
  product_name: string;
  dosage_per_acre: string;
  water_per_acre_litres: number;
  total_water_litres: number;
  dosage_summary: string;
  application_interval_days: number;
  pre_harvest_interval_days: number;
}

export interface BiologicalOrganic {
  remedy: string;
  description: string;
}

export interface PersonalizedAdvisory {
  disease_name: string;
  scientific_name: string;
  severity: string;
  description: string;
  land_acres: number;
  emergency_action: string;
  calculated_dosage: CalculatedDosage;
  biological_organic: BiologicalOrganic;
  cultural_preventative: string[];
  weather_safety_rule: string;
}

export interface PredictionData {
  predicted_class: string;
  confidence: number;
  confidence_pct: string;
  prediction_time_ms: number;
  total_time_ms: number;
  model_version: string;
  class_probabilities: Record<string, number>;
  personalized_advisory: PersonalizedAdvisory;
  saved_scan_id: string | null;
}

export interface PredictionResponse {
  success: boolean;
  message: string;
  data: PredictionData;
}
