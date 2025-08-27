import { useState } from 'react';
import { apiClient } from '@/lib/api';

export interface VacationRequest {
  id: number;
  employee: {
    id: number;
    nome_completo: string;
    matricula: string;
    cargo: string;
  };
  employee_id: number;
  period_start: string;
  period_end: string;
  days_requested: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approver?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface VacationStats {
  total: number;
  pendentes: number;
  aprovadas: number;
  rejeitadas: number;
}

export interface VacationFilters {
  search?: string;
  status?: string;
  employee_id?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useVacations = () => {
  const [vacations, setVacations] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VacationStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchVacations = async (filters: VacationFilters = {}, page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.employee_id) params.append('employee_id', filters.employee_id.toString());
      params.append('page', page.toString());
      params.append('page_size', size.toString());

      const response = await apiClient.get(`/api/rh/vacations/?${params.toString()}`);
      const data: PaginatedResponse<VacationRequest> = response.data;

      console.log('Dados recebidos da API:', data);
      console.log('Resultados:', data.results);

      // Validar se os dados têm a estrutura esperada
      const validatedResults = (data.results || []).map(vacation => {
        if (!vacation || !vacation.employee) {
          console.warn('Vacation inválida:', vacation);
          return {
            id: vacation?.id || 0,
            employee: {
              id: 0,
              nome_completo: 'Funcionário não encontrado',
              matricula: '-',
              cargo: '-'
            },
            employee_id: vacation?.employee_id || 0,
            period_start: vacation?.period_start || '',
            period_end: vacation?.period_end || '',
            days_requested: vacation?.days_requested || 0,
            reason: vacation?.reason || '',
            status: vacation?.status || 'PENDING',
            approver: vacation?.approver,
            approved_at: vacation?.approved_at,
            rejection_reason: vacation?.rejection_reason,
            created_at: vacation?.created_at || '',
            updated_at: vacation?.updated_at || ''
          };
        }
        return vacation;
      });

      setVacations(validatedResults);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
      setPageSize(size);

      // Calcular estatísticas localmente já que o backend não tem endpoint
      const total = data.count || 0;
      const pendentes = validatedResults.filter(vac => vac.status === 'PENDING').length;
      const aprovadas = validatedResults.filter(vac => vac.status === 'APPROVED').length;
      const rejeitadas = validatedResults.filter(vac => vac.status === 'REJECTED').length;
      
      setStats({
        total,
        pendentes,
        aprovadas,
        rejeitadas
      });
    } catch (err: any) {
      console.error('Erro completo:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar solicitações de férias');
      console.error('Erro ao carregar solicitações de férias:', err);
      // Em caso de erro, definir arrays vazios
      setVacations([]);
      setStats({ total: 0, pendentes: 0, aprovadas: 0, rejeitadas: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchVacationStats = async () => {
    // Como não há endpoint de stats no backend, não fazemos nada
    // As estatísticas são calculadas localmente em fetchVacations
  };

  const createVacationRequest = async (vacationData: Partial<VacationRequest>): Promise<VacationRequest | null> => {
    try {
      const response = await apiClient.post('/api/rh/vacations/', vacationData);
      // Recarregar lista após criação
      await fetchVacations();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar solicitação de férias');
      throw err;
    }
  };

  const approveVacation = async (id: number): Promise<VacationRequest | null> => {
    try {
      const response = await apiClient.post(`/api/rh/vacations/${id}/approve/`);
      // Recarregar lista após aprovação
      await fetchVacations();
      // Recarregar estatísticas
      await fetchVacationStats();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao aprovar solicitação de férias');
      throw err;
    }
  };

  const rejectVacation = async (id: number, rejectionReason: string): Promise<VacationRequest | null> => {
    try {
      const response = await apiClient.post(`/api/rh/vacations/${id}/reject/`, {
        rejection_reason: rejectionReason
      });
      // Recarregar lista após rejeição
      await fetchVacations();
      // Recarregar estatísticas
      await fetchVacationStats();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao rejeitar solicitação de férias');
      throw err;
    }
  };

  const updateVacationRequest = async (id: number, vacationData: Partial<VacationRequest>): Promise<VacationRequest | null> => {
    try {
      const response = await apiClient.patch(`/api/rh/vacations/${id}/`, vacationData);
      // Recarregar lista após atualização
      await fetchVacations();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao atualizar solicitação de férias');
      throw err;
    }
  };

  const deleteVacationRequest = async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/rh/vacations/${id}/`);
      // Recarregar lista após exclusão
      await fetchVacations();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao excluir solicitação de férias');
      return false;
    }
  };

  return {
    vacations,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchVacations,
    fetchVacationStats,
    createVacationRequest,
    approveVacation,
    rejectVacation,
    updateVacationRequest,
    deleteVacationRequest,
    setError,
  };
};
