export interface WorkProject {
  id: number;
  name: string;
  contract?: number;
  contract_details?: Contract;
  location_lat: number | null;
  location_lng: number | null;
  address: string;
  budget: number;
  status: string;
  status_display: string;
  start_date: string;
  expected_end_date: string;
  actual_end_date?: string;
  description: string;
  responsible: string;
  progress_set: WorkProgress[];
  photos: WorkPhoto[];
  progress_physical: number;
  progress_financial: number;
  created_at: string;
  updated_at: string;
}

export interface WorkProgress {
  id: number;
  project: number;
  ref_month: string;
  physical_pct: number;
  financial_pct: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface WorkPhoto {
  id: number;
  project: number;
  title: string;
  description: string;
  photo: string;
  taken_date: string;
  location: string;
  created_at: string;
}

export interface Contract {
  id: number;
  number: string;
  objeto: string;
  supplier_name: string;
  valor_total: number;
  start_dt: string;
  end_dt: string;
}

export interface ObrasDashboard {
  total_projects: number;
  projects_in_execution: number;
  average_progress: number;
  total_budget: number;
  projects_by_status: Record<string, number>;
  recent_progress: WorkProgress[];
}

export interface CreateUpdateProject {
  name: string;
  contract?: number;
  location_lat?: number;
  location_lng?: number;
  address: string;
  budget: number;
  status: string;
  start_date: string;
  expected_end_date: string;
  actual_end_date?: string;
  description: string;
  responsible: string;
}

export interface CreateUpdateProgress {
  project: number;
  ref_month: string;
  physical_pct: number;
  financial_pct: number;
  notes: string;
}

export interface CreateUpdatePhoto {
  project: number;
  title: string;
  description: string;
  photo: File;
  taken_date: string;
  location: string;
}

export interface ProjectFilters {
  name?: string;
  contract?: string;
  status?: string;
  responsible?: string;
}

export interface ProgressFilters {
  project?: number;
  ref_month?: string;
  physical_pct_min?: number;
  physical_pct_max?: number;
}
