import { apiClient } from '@/lib/api';
import {
  WorkProject,
  WorkProgress,
  WorkPhoto,
  ObrasDashboard,
  CreateUpdateProject,
  CreateUpdateProgress,
  CreateUpdatePhoto,
  ProjectFilters,
  ProgressFilters
} from '@/types/obras';

export const obrasService = {
  // Dashboard
  async getDashboard(): Promise<ObrasDashboard> {
    const response = await apiClient.get('/api/obras/projects/dashboard/');
    return response.data;
  },

  // Projetos
  async getProjects(filters?: ProjectFilters): Promise<WorkProject[]> {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.contract) params.append('contract', filters.contract);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.responsible) params.append('responsible', filters.responsible);

    const response = await apiClient.get(`/api/obras/projects/?${params.toString()}`);
    return response.data;
  },

  async getProject(id: number): Promise<WorkProject> {
    const response = await apiClient.get(`/api/obras/projects/${id}/`);
    return response.data;
  },

  async createProject(data: CreateUpdateProject): Promise<WorkProject> {
    const response = await apiClient.post('/api/obras/projects/', data);
    return response.data;
  },

  async updateProject(id: number, data: CreateUpdateProject): Promise<WorkProject> {
    const response = await apiClient.put(`/api/obras/projects/${id}/`, data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/api/obras/projects/${id}/`);
  },

  // Progresso
  async getProjectProgress(projectId: number): Promise<WorkProgress[]> {
    const response = await apiClient.get(`/api/obras/projects/${projectId}/progress/`);
    return response.data;
  },

  async getProgress(filters?: ProgressFilters): Promise<WorkProgress[]> {
    const params = new URLSearchParams();
    if (filters?.project) params.append('project', filters.project.toString());
    if (filters?.ref_month) params.append('ref_month', filters.ref_month);
    if (filters?.physical_pct_min) params.append('physical_pct_min', filters.physical_pct_min.toString());
    if (filters?.physical_pct_max) params.append('physical_pct_max', filters.physical_pct_max.toString());

    const response = await apiClient.get(`/api/obras/progress/?${params.toString()}`);
    return response.data;
  },

  async createProgress(data: CreateUpdateProgress): Promise<WorkProgress> {
    const response = await apiClient.post('/api/obras/progress/', data);
    return response.data;
  },

  async updateProgress(id: number, data: CreateUpdateProgress): Promise<WorkProgress> {
    const response = await apiClient.put(`/api/obras/progress/${id}/`, data);
    return response.data;
  },

  async deleteProgress(id: number): Promise<void> {
    await apiClient.delete(`/api/obras/progress/${id}/`);
  },

  // Fotos
  async getProjectPhotos(projectId: number): Promise<WorkPhoto[]> {
    const response = await apiClient.get(`/api/obras/projects/${projectId}/photos/`);
    return response.data;
  },

  async getPhotos(): Promise<WorkPhoto[]> {
    const response = await apiClient.get('/api/obras/photos/');
    return response.data;
  },

  async createPhoto(data: CreateUpdatePhoto): Promise<WorkPhoto> {
    const formData = new FormData();
    formData.append('project', data.project.toString());
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('photo', data.photo);
    formData.append('taken_date', data.taken_date);
    formData.append('location', data.location);

    const response = await apiClient.post('/api/obras/photos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updatePhoto(id: number, data: Partial<CreateUpdatePhoto>): Promise<WorkPhoto> {
    const formData = new FormData();
    if (data.project) formData.append('project', data.project.toString());
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.photo) formData.append('photo', data.photo);
    if (data.taken_date) formData.append('taken_date', data.taken_date);
    if (data.location) formData.append('location', data.location);

    const response = await apiClient.put(`/api/obras/photos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deletePhoto(id: number): Promise<void> {
    await apiClient.delete(`/api/obras/photos/${id}/`);
  },

  // Contratos (para seleção)
  async getContracts(): Promise<any[]> {
    const response = await apiClient.get('/api/licitacao/contracts/');
    return response.data;
  }
};
