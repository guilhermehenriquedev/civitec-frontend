import { useState } from 'react';
import { apiClient } from '@/lib/api';

export interface Payslip {
  id: number;
  employee: {
    id: number;
    nome_completo: string;
    matricula: string;
    cargo: string;
  };
  employee_id: number;
  competencia: string;
  bruto: number;
  descontos: number;
  liquido: number;
  pdf_url?: string;
  pdf_file?: string;
  created_at: string;
  updated_at: string;
}

export interface PayslipStats {
  total: number;
  pagos: number;
  total_bruto: number;
  total_liquido: number;
}

export interface PayslipFilters {
  search?: string;
  status?: string;
  competencia?: string;
  employee_id?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const usePayslips = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PayslipStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchPayslips = async (filters: PayslipFilters = {}, page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.competencia) params.append('competencia', filters.competencia);
      if (filters.employee_id) params.append('employee_id', filters.employee_id.toString());
      params.append('page', page.toString());
      params.append('page_size', size.toString());

      const response = await apiClient.get(`/api/rh/payslips/?${params.toString()}`);
      const data: PaginatedResponse<Payslip> = response.data;

      setPayslips(data.results);
      setTotalCount(data.count);
      setCurrentPage(page);
      setPageSize(size);

      // Calcular estatísticas localmente já que o backend não tem endpoint
      const total = data.count;
      const totalBruto = data.results.reduce((sum, payslip) => sum + (payslip.bruto || 0), 0);
      const totalLiquido = data.results.reduce((sum, payslip) => sum + (payslip.liquido || 0), 0);
      
      setStats({
        total,
        pagos: total, // Assumindo que todos os contracheques listados são pagos
        total_bruto: totalBruto,
        total_liquido: totalLiquido
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar contracheques');
      console.error('Erro ao carregar contracheques:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayslipStats = async () => {
    // Como não há endpoint de stats no backend, não fazemos nada
    // As estatísticas são calculadas localmente em fetchPayslips
  };

  const fetchPayslipById = async (id: number): Promise<Payslip | null> => {
    try {
      const response = await apiClient.get(`/api/rh/payslips/${id}/`);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao carregar contracheque:', err);
      return null;
    }
  };

  const downloadPayslip = async (id: number): Promise<Blob | null> => {
    try {
      const response = await apiClient.get(`/api/rh/payslips/${id}/download/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (err: any) {
      console.error('Erro ao baixar contracheque:', err);
      return null;
    }
  };

  const createPayslip = async (payslipData: Partial<Payslip>): Promise<Payslip | null> => {
    try {
      const response = await apiClient.post('/api/rh/payslips/', payslipData);
      // Recarregar lista após criação
      await fetchPayslips();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar contracheque:', err);
      throw err;
    }
  };

  const updatePayslip = async (id: number, payslipData: Partial<Payslip>): Promise<Payslip | null> => {
    try {
      const response = await apiClient.patch(`/api/rh/payslips/${id}/`, payslipData);
      // Recarregar lista após atualização
      await fetchPayslips();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar contracheque:', err);
      throw err;
    }
  };

  const deletePayslip = async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/rh/payslips/${id}/`);
      // Recarregar lista após exclusão
      await fetchPayslips();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir contracheque:', err);
      return false;
    }
  };

  return {
    payslips,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchPayslips,
    fetchPayslipStats,
    fetchPayslipById,
    downloadPayslip,
    createPayslip,
    updatePayslip,
    deletePayslip
  };
};
