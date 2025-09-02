import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Taxpayer, TaxpayerStats } from '@/types/tributos';

export interface TaxpayerFilters {
  search?: string;
  type?: string;
  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useTaxpayers = () => {
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TaxpayerStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchTaxpayers = async (filters: TaxpayerFilters = {}, page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      params.append('page', page.toString());
      params.append('page_size', size.toString());

      const response = await apiClient.get(`/api/tributos/taxpayers/?${params.toString()}`);
      const data: PaginatedResponse<Taxpayer> = response.data;

      setTaxpayers(data.results);
      setTotalCount(data.count);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar contribuintes');
      console.error('Erro ao carregar contribuintes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxpayerStats = async () => {
    try {
      const response = await apiClient.get('/api/tributos/taxpayers/stats/');
      setStats(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const createTaxpayer = async (taxpayerData: Partial<Taxpayer>): Promise<Taxpayer | null> => {
    try {
      const response = await apiClient.post('/api/tributos/taxpayers/', taxpayerData);
      // Recarregar lista e estatísticas após criação
      await fetchTaxpayers();
      await fetchTaxpayerStats();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar contribuinte:', err);
      throw err;
    }
  };

  const updateTaxpayer = async (id: number, taxpayerData: Partial<Taxpayer>): Promise<Taxpayer | null> => {
    try {
      const response = await apiClient.patch(`/api/tributos/taxpayers/${id}/`, taxpayerData);
      // Recarregar lista e estatísticas após atualização
      await fetchTaxpayers();
      await fetchTaxpayerStats();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar contribuinte:', err);
      throw err;
    }
  };

  const deleteTaxpayer = async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/tributos/taxpayers/${id}/`);
      // Recarregar lista e estatísticas após exclusão
      await fetchTaxpayers();
      await fetchTaxpayerStats();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir contribuinte:', err);
      return false;
    }
  };

  return {
    taxpayers,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchTaxpayers,
    fetchTaxpayerStats,
    createTaxpayer,
    updateTaxpayer,
    deleteTaxpayer
  };
};
