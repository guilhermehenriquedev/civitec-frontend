import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface Employee {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  matricula: string;
  cargo: string;
  lotacao: string;
  regime: 'CLT' | 'ESTATUTARIO' | 'TEMPORARIO' | 'TERCEIRIZADO';
  admissao_dt: string;
  status: 'ATIVO' | 'INATIVO' | 'APOSENTADO' | 'DEMITIDO';
  nome_completo: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeStats {
  total_funcionarios: number;
  ativos: number;
  folha_pagamento: number;
  em_ferias: number;
}

export interface EmployeeFilters {
  search?: string;
  status?: string;
  regime?: string;
  lotacao?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchEmployees = async (filters: EmployeeFilters = {}, page: number = 1, size: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.regime) params.append('regime', filters.regime);
      if (filters.lotacao) params.append('lotacao', filters.lotacao);
      params.append('page', page.toString());
      params.append('page_size', size.toString());

      const response = await apiClient.get(`/api/rh/employees/?${params.toString()}`);
      const data: PaginatedResponse<Employee> = response.data;

      setEmployees(data.results);
      setTotalCount(data.count);
      setCurrentPage(page);
      setPageSize(size);

      // Calcular estatísticas localmente já que o backend não tem endpoint
      const total = data.count;
      const ativos = data.results.filter(emp => emp.status === 'ATIVO').length;
      const emFerias = 0; // Status EM_FERIAS não existe no modelo atual
      // Assumindo que folha de pagamento é um valor fixo por funcionário ativo
      const folhaPagamento = ativos * 5000; // Valor exemplo, ajustar conforme necessário
      
      setStats({
        total_funcionarios: total,
        ativos,
        folha_pagamento: folhaPagamento,
        em_ferias: emFerias
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar funcionários');
      console.error('Erro ao carregar funcionários:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeStats = async () => {
    // Como não há endpoint de stats no backend, não fazemos nada
    // As estatísticas são calculadas localmente em fetchEmployees
  };

  const fetchEmployeeById = async (id: number): Promise<Employee | null> => {
    try {
      const response = await apiClient.get(`/api/rh/employees/${id}/`);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao carregar funcionário:', err);
      return null;
    }
  };

  const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
    try {
      const response = await apiClient.post('/api/rh/employees/', employeeData);
      // Recarregar lista após criação
      await fetchEmployees();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar funcionário');
      throw err;
    }
  };

  const updateEmployee = async (id: number, employeeData: Partial<Employee>): Promise<Employee | null> => {
    try {
      const response = await apiClient.patch(`/api/rh/employees/${id}/`, employeeData);
      // Recarregar lista após atualização
      await fetchEmployees();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao atualizar funcionário');
      throw err;
    }
  };

  const deleteEmployee = async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/rh/employees/${id}/`);
      // Recarregar lista após exclusão
      await fetchEmployees();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao excluir funcionário');
      return false;
    }
  };

  return {
    employees,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    pageSize,
    fetchEmployees,
    fetchEmployeeStats,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setError,
  };
};
