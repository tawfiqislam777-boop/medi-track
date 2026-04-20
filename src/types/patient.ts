export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  condition: string;
  notes?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientsResponse {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PatientFormData = Omit<Patient, "id" | "createdAt" | "updatedAt">;

export const CONDITIONS = [
  "Hypertension",
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Asthma",
  "Arthritis",
  "Heart Disease",
  "Migraine",
  "Anxiety",
  "Depression",
  "Cancer",
  "Alzheimer's",
  "Parkinson's",
  "Epilepsy",
  "Chronic Pain",
  "Other",
] as const;

export const STATUSES = ["Active", "Inactive", "Critical", "Recovered"] as const;
