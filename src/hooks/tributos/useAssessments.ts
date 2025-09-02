import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Assessment, AssessmentStats } from '@/types/tributos';

export interface AssessmentFilters {
  search?: string;
  taxpayer_id?: number;
  tax_kind?: string;
  status?: string;
  competence?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AssessmentStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchAssessments = async (filters: AssessmentFilters = {}, page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.taxpayer_id) params.append('taxpayer_id', filters.taxpayer_id.toString());
      if (filters.tax_kind) params.append('tax_kind', filters.tax_kind);
      if (filters.status) params.append('status', filters.status);
      if (filters.competence) params.append('competence', filters.competence);
      params.append('page', page.toString());
      params.append('page_size', size.toString());

      const response = await apiClient.get(`/api/tributos/assessments/?${params.toString()}`);
      const data: PaginatedResponse<Assessment> = response.data;

      setAssessments(data.results);
      setTotalCount(data.count);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar avaliações');
      console.error('Erro ao carregar avaliações:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentStats = async () => {
    try {
      const response = await apiClient.get('/api/tributos/assessments/stats/');
      setStats(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const createAssessment = async (assessmentData: Partial<Assessment>): Promise<Assessment | null> => {
    try {
      const response = await apiClient.post('/api/tributos/assessments/', assessmentData);
      // Recarregar lista e estatísticas após criação
      await fetchAssessments();
      await fetchAssessmentStats();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar avaliação:', err);
      throw err;
    }
  };

  const updateAssessment = async (id: number, assessmentData: Partial<Assessment>): Promise<Assessment | null> => {
    try {
      const response = await apiClient.patch(`/api/tributos/assessments/${id}/`, assessmentData);
      // Recarregar lista e estatísticas após atualização
      await fetchAssessments();
      await fetchAssessmentStats();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar avaliação:', err);
      throw err;
    }
  };

  const deleteAssessment = async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/tributos/assessments/${id}/`);
      // Recarregar lista e estatísticas após exclusão
      await fetchAssessments();
      await fetchAssessmentStats();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir avaliação:', err);
      return false;
    }
  };

  const generateCode = async (id: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/api/tributos/assessments/${id}/generate_code/`);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao gerar código:', err);
      throw err;
    }
  };

  const downloadAssessment = async (id: number): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/api/tributos/assessments/${id}/download/`, {
        responseType: 'blob'
      });
      
      // Processar download
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `guia-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      console.error('Erro ao baixar avaliação:', err);
      return false;
    }
  };

  return {
    assessments,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchAssessments,
    fetchAssessmentStats,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    generateCode,
    downloadAssessment
  };
};
