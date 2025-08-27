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

// Classe de erro customizada para o serviço de obras
export class ObrasServiceError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ObrasServiceError';
  }
}

// Função para tratar erros da API  
const handleApiError = (error: any, operation: string): never => {
  console.error(`Erro na operação ${operation}:`, error);
  
  if (error.response) {
    const { status, data } = error.response;
    
    // Erros específicos por status
    switch (status) {
      case 400:
        if (data.detail) {
          throw new ObrasServiceError(`Dados inválidos: ${data.detail}`, status, 'VALIDATION_ERROR', data);
        } else if (data.non_field_errors) {
          throw new ObrasServiceError(`Erro de validação: ${data.non_field_errors.join(', ')}`, status, 'VALIDATION_ERROR', data);
        } else {
          throw new ObrasServiceError('Dados inválidos fornecidos', status, 'VALIDATION_ERROR', data);
        }
      
      case 401:
        throw new ObrasServiceError('Não autorizado. Faça login novamente.', status, 'UNAUTHORIZED');
      
      case 403:
        throw new ObrasServiceError('Acesso negado. Você não tem permissão para esta operação.', status, 'FORBIDDEN');
      
      case 404:
        throw new ObrasServiceError('Recurso não encontrado', status, 'NOT_FOUND');
      
      case 409:
        throw new ObrasServiceError('Conflito: o recurso já existe ou está em uso', status, 'CONFLICT');
      
      case 422:
        throw new ObrasServiceError('Dados inválidos: verifique os campos obrigatórios', status, 'VALIDATION_ERROR', data);
      
      case 500:
        throw new ObrasServiceError('Erro interno do servidor. Tente novamente mais tarde.', status, 'SERVER_ERROR');
      
      default:
        throw new ObrasServiceError(
          data?.detail || data?.message || `Erro ${status}: ${operation} falhou`,
          status,
          'API_ERROR',
          data
        );
    }
  } else if (error.request) {
    throw new ObrasServiceError(
      'Erro de conexão. Verifique sua internet e tente novamente.',
      undefined,
      'NETWORK_ERROR'
    );
  } else {
    throw new ObrasServiceError(
      error.message || `Erro inesperado: ${operation} falhou`,
      undefined,
      'UNKNOWN_ERROR'
    );
  }
};

export const obrasService = {
  // Dashboard
  async getDashboard(): Promise<ObrasDashboard> {
    try {
      const response = await apiClient.get('/api/obras/projects/dashboard/');
      return response.data;
    } catch (error) {
      handleApiError(error, 'obter dashboard');
      throw error; // TypeScript satisfaction
    }
  },

  // Projetos
  async getProjects(filters?: ProjectFilters): Promise<WorkProject[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.name) params.append('name', filters.name);
      if (filters?.contract) params.append('contract', filters.contract);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.responsible) params.append('responsible', filters.responsible);

      const response = await apiClient.get(`/api/obras/projects/?${params.toString()}`);
      return response.data || [];
    } catch (error) {
      handleApiError(error, 'obter projetos');
      return []; // Nunca executará, mas satisfaz o TypeScript
    }
  },

  async getProject(id: number): Promise<WorkProject> {
    try {
      if (!id || id <= 0) {
        throw new ObrasServiceError('ID do projeto inválido', 400, 'INVALID_ID');
      }
      
      const response = await apiClient.get(`/api/obras/projects/${id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error, `obter projeto ${id}`);
      throw error; // TypeScript satisfaction
    }
  },

  async createProject(data: CreateUpdateProject): Promise<WorkProject> {
    try {
      // Validações básicas
      if (!data.name?.trim()) {
        throw new ObrasServiceError('Nome do projeto é obrigatório', 400, 'MISSING_NAME');
      }
      
      if (!data.address?.trim()) {
        throw new ObrasServiceError('Endereço é obrigatório', 400, 'MISSING_ADDRESS');
      }
      
      if (!data.budget || data.budget <= 0) {
        throw new ObrasServiceError('Orçamento deve ser maior que zero', 400, 'INVALID_BUDGET');
      }
      
      if (!data.start_date) {
        throw new ObrasServiceError('Data de início é obrigatória', 400, 'MISSING_START_DATE');
      }
      
      if (!data.expected_end_date) {
        throw new ObrasServiceError('Data prevista de conclusão é obrigatória', 400, 'MISSING_END_DATE');
      }
      
      if (!data.description?.trim()) {
        throw new ObrasServiceError('Descrição é obrigatória', 400, 'MISSING_DESCRIPTION');
      }
      
      if (!data.responsible?.trim()) {
        throw new ObrasServiceError('Responsável é obrigatório', 400, 'MISSING_RESPONSIBLE');
      }

      const response = await apiClient.post('/api/obras/projects/', data);
      return response.data;
    } catch (error) {
      if (error instanceof ObrasServiceError) {
        throw error;
      }
      handleApiError(error, 'criar projeto');
      throw error; // TypeScript satisfaction
    }
  },

  async updateProject(id: number, data: CreateUpdateProject): Promise<WorkProject> {
    try {
      if (!id || id <= 0) {
        throw new ObrasServiceError('ID do projeto inválido', 400, 'INVALID_ID');
      }
      
      // Validações básicas (mesmas do create)
      if (!data.name?.trim()) {
        throw new ObrasServiceError('Nome do projeto é obrigatório', 400, 'MISSING_NAME');
      }
      
      if (!data.address?.trim()) {
        throw new ObrasServiceError('Endereço é obrigatório', 400, 'MISSING_ADDRESS');
      }
      
      if (!data.budget || data.budget <= 0) {
        throw new ObrasServiceError('Orçamento deve ser maior que zero', 400, 'INVALID_BUDGET');
      }
      
      if (!data.start_date) {
        throw new ObrasServiceError('Data de início é obrigatória', 400, 'MISSING_START_DATE');
      }
      
      if (!data.expected_end_date) {
        throw new ObrasServiceError('Data prevista de conclusão é obrigatória', 400, 'MISSING_END_DATE');
      }
      
      if (!data.description?.trim()) {
        throw new ObrasServiceError('Descrição é obrigatória', 400, 'MISSING_DESCRIPTION');
      }
      
      if (!data.responsible?.trim()) {
        throw new ObrasServiceError('Responsável é obrigatório', 400, 'MISSING_RESPONSIBLE');
      }

      const response = await apiClient.put(`/api/obras/projects/${id}/`, data);
      return response.data;
    } catch (error) {
      if (error instanceof ObrasServiceError) {
        throw error;
      }
      handleApiError(error, `atualizar projeto ${id}`);
      throw error; // TypeScript satisfaction
    }
  },

  async deleteProject(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new ObrasServiceError('ID do projeto inválido', 400, 'INVALID_ID');
      }
      
      await apiClient.delete(`/api/obras/projects/${id}/`);
    } catch (error) {
      handleApiError(error, `excluir projeto ${id}`);
    }
  },

  // Progresso
  async getProjectProgress(projectId: number): Promise<WorkProgress[]> {
    try {
      if (!projectId || projectId <= 0) {
        throw new ObrasServiceError('ID do projeto inválido', 400, 'INVALID_PROJECT_ID');
      }
      
      const response = await apiClient.get(`/api/obras/projects/${projectId}/progress/`);
      return response.data || [];
    } catch (error) {
      handleApiError(error, `obter progresso do projeto ${projectId}`);
      return []; // Nunca executará, mas satisfaz o TypeScript
    }
  },

  async getProgress(filters?: ProgressFilters): Promise<WorkProgress[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.project) params.append('project', filters.project.toString());
      if (filters?.ref_month) params.append('ref_month', filters.ref_month);
      if (filters?.physical_pct_min) params.append('physical_pct_min', filters.physical_pct_min.toString());
      if (filters?.physical_pct_max) params.append('physical_pct_max', filters.physical_pct_max.toString());

      const response = await apiClient.get(`/api/obras/progress/?${params.toString()}`);
      return response.data || [];
    } catch (error) {
      handleApiError(error, 'obter progresso');
      return []; // Nunca executará, mas satisfaz o TypeScript
    }
  },

  async createProgress(data: CreateUpdateProgress): Promise<WorkProgress> {
    try {
      // Validações básicas
      if (!data.project || data.project <= 0) {
        throw new ObrasServiceError('Projeto é obrigatório', 400, 'MISSING_PROJECT');
      }
      
      if (!data.ref_month) {
        throw new ObrasServiceError('Mês de referência é obrigatório', 400, 'MISSING_REF_MONTH');
      }
      
      if (data.physical_pct < 0 || data.physical_pct > 100) {
        throw new ObrasServiceError('Progresso físico deve estar entre 0% e 100%', 400, 'INVALID_PHYSICAL_PCT');
      }
      
      if (data.financial_pct < 0 || data.financial_pct > 100) {
        throw new ObrasServiceError('Progresso financeiro deve estar entre 0% e 100%', 400, 'INVALID_FINANCIAL_PCT');
      }

      const response = await apiClient.post('/api/obras/progress/', data);
      return response.data;
    } catch (error) {
      if (error instanceof ObrasServiceError) {
        throw error;
      }
      handleApiError(error, 'criar progresso');
      throw error; // TypeScript satisfaction
    }
  },

  async updateProgress(id: number, data: CreateUpdateProgress): Promise<WorkProgress> {
    try {
      if (!id || id <= 0) {
        throw new ObrasServiceError('ID do progresso inválido', 400, 'INVALID_ID');
      }
      
      // Validações básicas (mesmas do create)
      if (!data.project || data.project <= 0) {
        throw new ObrasServiceError('Projeto é obrigatório', 400, 'MISSING_PROJECT');
      }
      
      if (!data.ref_month) {
        throw new ObrasServiceError('Mês de referência é obrigatório', 400, 'MISSING_REF_MONTH');
      }
      
      if (data.physical_pct < 0 || data.physical_pct > 100) {
        throw new ObrasServiceError('Progresso físico deve estar entre 0% e 100%', 400, 'INVALID_PHYSICAL_PCT');
      }
      
      if (data.financial_pct < 0 || data.financial_pct > 100) {
        throw new ObrasServiceError('Progresso financeiro deve estar entre 0% e 100%', 400, 'INVALID_FINANCIAL_PCT');
      }

      const response = await apiClient.put(`/api/obras/progress/${id}/`, data);
      return response.data;
    } catch (error) {
      if (error instanceof ObrasServiceError) {
        throw error;
      }
      handleApiError(error, `atualizar progresso ${id}`);
      throw error; // TypeScript satisfaction
    }
  },

  async deleteProgress(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new ObrasServiceError('ID do progresso inválido', 400, 'INVALID_ID');
      }
      
      await apiClient.delete(`/api/obras/progress/${id}/`);
    } catch (error) {
      handleApiError(error, `excluir progresso ${id}`);
    }
  },

  // Fotos
  async getProjectPhotos(projectId: number): Promise<WorkPhoto[]> {
    try {
      if (!projectId || projectId <= 0) {
        throw new ObrasServiceError('ID do projeto inválido', 400, 'INVALID_PROJECT_ID');
      }
      
      const response = await apiClient.get(`/api/obras/projects/${projectId}/photos/`);
      return response.data || [];
    } catch (error) {
      handleApiError(error, `obter fotos do projeto ${projectId}`);
      return []; // Nunca executará, mas satisfaz o TypeScript
    }
  },

  async getPhotos(): Promise<WorkPhoto[]> {
    try {
      const response = await apiClient.get('/api/obras/photos/');
      return response.data || [];
    } catch (error) {
      handleApiError(error, 'obter fotos');
      return []; // Nunca executará, mas satisfaz o TypeScript
    }
  },

  async createPhoto(data: CreateUpdatePhoto): Promise<WorkPhoto> {
    try {
      // Validações básicas
      if (!data.project || data.project <= 0) {
        throw new ObrasServiceError('Projeto é obrigatório', 400, 'MISSING_PROJECT');
      }
      
      if (!data.title?.trim()) {
        throw new ObrasServiceError('Título é obrigatório', 400, 'MISSING_TITLE');
      }
      
      if (!data.photo || data.photo.size === 0) {
        throw new ObrasServiceError('Foto é obrigatória', 400, 'MISSING_PHOTO');
      }
      
      if (!data.taken_date) {
        throw new ObrasServiceError('Data da foto é obrigatória', 400, 'MISSING_TAKEN_DATE');
      }
      
      // Validar tamanho do arquivo (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (data.photo.size > maxSize) {
        throw new ObrasServiceError('Arquivo muito grande. Tamanho máximo: 10MB', 400, 'FILE_TOO_LARGE');
      }
      
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(data.photo.type)) {
        throw new ObrasServiceError('Tipo de arquivo não suportado. Use: JPG, PNG, GIF ou WebP', 400, 'INVALID_FILE_TYPE');
      }

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
    } catch (error) {
      if (error instanceof ObrasServiceError) {
        throw error;
      }
      handleApiError(error, 'criar foto');
      throw error; // TypeScript satisfaction
    }
  },

  async updatePhoto(id: number, data: Partial<CreateUpdatePhoto>): Promise<WorkPhoto> {
    try {
      if (!id || id <= 0) {
        throw new ObrasServiceError('ID da foto inválido', 400, 'INVALID_ID');
      }
      
      // Validações básicas para campos fornecidos
      if (data.title !== undefined && !data.title?.trim()) {
        throw new ObrasServiceError('Título não pode ser vazio', 400, 'EMPTY_TITLE');
      }
      
      if (data.photo && data.photo.size > 0) {
        // Validar tamanho do arquivo (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (data.photo.size > maxSize) {
          throw new ObrasServiceError('Arquivo muito grande. Tamanho máximo: 10MB', 400, 'FILE_TOO_LARGE');
        }
        
        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(data.photo.type)) {
          throw new ObrasServiceError('Tipo de arquivo não suportado. Use: JPG, PNG, GIF ou WebP', 400, 'INVALID_FILE_TYPE');
        }
      }

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
    } catch (error) {
      if (error instanceof ObrasServiceError) {
        throw error;
      }
      handleApiError(error, `atualizar foto ${id}`);
      throw error; // TypeScript satisfaction
    }
  },

  async deletePhoto(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new ObrasServiceError('ID da foto inválido', 400, 'INVALID_ID');
      }
      
      await apiClient.delete(`/api/obras/photos/${id}/`);
    } catch (error) {
      handleApiError(error, `excluir foto ${id}`);
    }
  },

  // Contratos (para seleção)
  async getContracts(): Promise<any[]> {
    try {
      const response = await apiClient.get('/api/licitacao/contracts/');
      return response.data || [];
    } catch (error) {
      handleApiError(error, 'obter contratos');
      return []; // Nunca executará, mas satisfaz o TypeScript
    }
  },

  // Métodos utilitários
  validateProjectData(data: CreateUpdateProject): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.name?.trim()) errors.push('Nome do projeto é obrigatório');
    if (!data.address?.trim()) errors.push('Endereço é obrigatório');
    if (!data.budget || data.budget <= 0) errors.push('Orçamento deve ser maior que zero');
    if (!data.start_date) errors.push('Data de início é obrigatória');
    if (!data.expected_end_date) errors.push('Data prevista de conclusão é obrigatória');
    if (!data.description?.trim()) errors.push('Descrição é obrigatória');
    if (!data.responsible?.trim()) errors.push('Responsável é obrigatório');
    
    if (data.start_date && data.expected_end_date && data.expected_end_date < data.start_date) {
      errors.push('Data de conclusão deve ser posterior à data de início');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateProgressData(data: CreateUpdateProgress): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.project || data.project <= 0) errors.push('Projeto é obrigatório');
    if (!data.ref_month) errors.push('Mês de referência é obrigatório');
    if (data.physical_pct < 0 || data.physical_pct > 100) errors.push('Progresso físico deve estar entre 0% e 100%');
    if (data.financial_pct < 0 || data.financial_pct > 100) errors.push('Progresso financeiro deve estar entre 0% e 100%');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validatePhotoData(data: CreateUpdatePhoto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.project || data.project <= 0) errors.push('Projeto é obrigatório');
    if (!data.title?.trim()) errors.push('Título é obrigatório');
    if (!data.photo || data.photo.size === 0) errors.push('Foto é obrigatória');
    if (!data.taken_date) errors.push('Data da foto é obrigatória');
    
    if (data.photo && data.photo.size > 0) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (data.photo.size > maxSize) errors.push('Arquivo muito grande. Tamanho máximo: 10MB');
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(data.photo.type)) {
        errors.push('Tipo de arquivo não suportado. Use: JPG, PNG, GIF ou WebP');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
