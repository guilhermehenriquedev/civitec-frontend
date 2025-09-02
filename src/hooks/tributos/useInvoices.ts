import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Invoice, InvoiceStats } from '@/types/tributos';

export interface InvoiceFilters {
  search?: string;
  taxpayer_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchInvoices = async (filters: InvoiceFilters = {}, page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.taxpayer_id) params.append('taxpayer_id', filters.taxpayer_id.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      params.append('page', page.toString());
      params.append('page_size', size.toString());

      const response = await apiClient.get(`/api/tributos/invoices/?${params.toString()}`);
      const data: PaginatedResponse<Invoice> = response.data;

      setInvoices(data.results);
      setTotalCount(data.count);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar notas fiscais');
      console.error('Erro ao carregar notas fiscais:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceStats = async () => {
    try {
      const response = await apiClient.get('/api/tributos/invoices/stats/');
      setStats(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const createInvoice = async (invoiceData: Partial<Invoice>): Promise<Invoice | null> => {
    try {
      const response = await apiClient.post('/api/tributos/invoices/', invoiceData);
      // Recarregar lista e estatísticas após criação
      await fetchInvoices();
      await fetchInvoiceStats();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar nota fiscal:', err);
      throw err;
    }
  };

  const updateInvoice = async (id: number, invoiceData: Partial<Invoice>): Promise<Invoice | null> => {
    try {
      const response = await apiClient.patch(`/api/tributos/invoices/${id}/`, invoiceData);
      // Recarregar lista e estatísticas após atualização
      await fetchInvoices();
      await fetchInvoiceStats();
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar nota fiscal:', err);
      throw err;
    }
  };

  const deleteInvoice = async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/tributos/invoices/${id}/`);
      // Recarregar lista e estatísticas após exclusão
      await fetchInvoices();
      await fetchInvoiceStats();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir nota fiscal:', err);
      return false;
    }
  };

  const cancelInvoice = async (id: number, reason: string): Promise<boolean> => {
    try {
      await apiClient.post(`/api/tributos/invoices/${id}/cancel/`, { reason });
      // Recarregar lista e estatísticas após cancelamento
      await fetchInvoices();
      await fetchInvoiceStats();
      return true;
    } catch (err: any) {
      console.error('Erro ao cancelar nota fiscal:', err);
      return false;
    }
  };

  const validateInvoice = async (number: string, code: string): Promise<any> => {
    try {
      const response = await apiClient.post('/api/tributos/invoices/validate/', { number, code });
      return response.data;
    } catch (err: any) {
      console.error('Erro ao validar nota fiscal:', err);
      throw err;
    }
  };

  const downloadInvoice = async (id: number): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/api/tributos/invoices/${id}/download/`, {
        responseType: 'blob'
      });
      
      // Processar download
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nf-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      console.error('Erro ao baixar nota fiscal:', err);
      return false;
    }
  };

  return {
    invoices,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchInvoices,
    fetchInvoiceStats,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    cancelInvoice,
    validateInvoice,
    downloadInvoice
  };
};
