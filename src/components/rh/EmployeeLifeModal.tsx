'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import { usePayslips } from '@/hooks/rh/usePayslips';
import { apiClient } from '@/lib/api';

interface VacationRequest {
  id: number;
  employee: {
    id: number;
    nome_completo: string;
    matricula: string;
    cargo: string;
  };
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
  rejection_reason?: string;
  created_at: string;
}

interface EmployeeLifeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: number;
    nome_completo: string;
    matricula: string;
    cargo: string;
    lotacao: string;
    regime: string;
    status: string;
    admissao_dt: string;
  } | null;
}

export default function EmployeeLifeModal({ isOpen, onClose, employee }: EmployeeLifeModalProps) {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'ferias' | 'contracheques'>('detalhes');
  const [vacations, setVacations] = useState<VacationRequest[]>([]);
  const [vacationsLoading, setVacationsLoading] = useState(false);
  const [vacationsError, setVacationsError] = useState<string | null>(null);
  
  // Hook para contracheques com paginação e filtros
  const {
    payslips,
    loading: payslipsLoading,
    error: payslipsError,
    totalCount: payslipsTotalCount,
    currentPage: payslipsCurrentPage,
    pageSize: payslipsPageSize,
    fetchPayslips
  } = usePayslips();

  useEffect(() => {
    if (isOpen && employee) {
      fetchEmployeeData();
    }
  }, [isOpen, employee]);

  // Buscar contracheques quando mudar para a aba
  useEffect(() => {
    if (activeTab === 'contracheques' && employee) {
      fetchEmployeePayslips();
    }
  }, [activeTab, employee]);

  const fetchEmployeeData = async () => {
    if (!employee) return;
    
    setVacationsLoading(true);
    setVacationsError(null);
    try {
      // Buscar férias do funcionário
      const vacationsResponse = await apiClient.get(`/api/rh/vacations/?employee=${employee.id}`);
      setVacations(vacationsResponse.data.results || []);
    } catch (error) {
      console.error('Erro ao carregar férias do funcionário:', error);
      setVacationsError('Erro ao carregar férias do funcionário');
    } finally {
      setVacationsLoading(false);
    }
  };

  const fetchEmployeePayslips = async (page: number = 1, size: number = 20) => {
    if (!employee) return;
    
    try {
      await fetchPayslips(
        { employee_id: employee.id },
        page,
        size
      );
    } catch (error) {
      console.error('Erro ao carregar contracheques do funcionário:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'EM_FERIAS':
        return 'bg-blue-100 text-blue-800';
      case 'LICENCA':
        return 'bg-yellow-100 text-yellow-800';
      case 'INATIVO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  const formatCurrency = (value: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handlePayslipPageChange = (newPage: number) => {
    fetchEmployeePayslips(newPage, payslipsPageSize);
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vida do Funcionário: ${employee.nome_completo}`}
      size="lg"
    >
      {/* Informações do funcionário - EXATAMENTE igual a Gerenciar Usuários */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{employee.nome_completo}</p>
            <p className="text-sm text-gray-600">Matrícula: {employee.matricula}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'detalhes', label: 'Detalhes' },
            { id: 'ferias', label: 'Férias' },
            { id: 'contracheques', label: 'Contracheques' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      <>
        {/* Tab Detalhes */}
        {activeTab === 'detalhes' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{employee.nome_completo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matrícula</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{employee.matricula}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{employee.cargo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lotação</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{employee.lotacao}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regime</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{employee.regime}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`inline-flex px-3 py-2 text-sm font-medium rounded-xl ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Admissão</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{formatDate(employee.admissao_dt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Férias */}
        {activeTab === 'ferias' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Histórico de Férias</h4>
            
            {vacationsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : vacationsError ? (
              <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="mt-2 text-sm text-red-600">{vacationsError}</p>
                <button
                  onClick={fetchEmployeeData}
                  className="mt-3 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : vacations.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Nenhuma solicitação de férias encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vacations.map((vacation) => (
                  <div key={vacation.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Período</label>
                        <p className="text-sm text-gray-900">
                          {formatDate(vacation.period_start)} - {formatDate(vacation.period_end)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Dias</label>
                        <p className="text-sm text-gray-900">{vacation.days_requested}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          vacation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          vacation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          vacation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vacation.status === 'PENDING' ? 'PENDENTE' :
                           vacation.status === 'APPROVED' ? 'APROVADA' :
                           vacation.status === 'REJECTED' ? 'REJEITADA' :
                           vacation.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Justificativa</label>
                        <p className="text-sm text-gray-900">{vacation.reason || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Contracheques - IMPLEMENTAÇÃO COMPLETA */}
        {activeTab === 'contracheques' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Histórico de Contracheques</h4>
              <div className="text-sm text-gray-500">
                Total: {payslipsTotalCount} contracheque{payslipsTotalCount !== 1 ? 's' : ''}
              </div>
            </div>
            
            {payslipsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : payslipsError ? (
              <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="mt-2 text-sm text-red-600">{payslipsError}</p>
                <button
                  onClick={() => fetchEmployeePayslips()}
                  className="mt-3 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : payslips.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Nenhum contracheque encontrado</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {payslips.map((payslip) => (
                    <div key={payslip.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Competência</label>
                          <p className="text-sm text-gray-900">{payslip.competencia}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Salário Bruto</label>
                          <p className="text-sm text-gray-900 font-medium">
                            {formatCurrency(payslip.bruto)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Descontos</label>
                          <p className="text-sm text-gray-900 font-medium text-red-600">
                            {formatCurrency(payslip.descontos)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Salário Líquido</label>
                          <p className="text-sm text-gray-900 font-semibold text-green-600">
                            {formatCurrency(payslip.liquido)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Data de Geração</label>
                          <p className="text-sm text-gray-900">{formatDate(payslip.created_at)}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            PAGO
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                {payslipsTotalCount > payslipsPageSize && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Mostrando {((payslipsCurrentPage - 1) * payslipsPageSize) + 1} a{' '}
                      {Math.min(payslipsCurrentPage * payslipsPageSize, payslipsTotalCount)} de{' '}
                      {payslipsTotalCount} resultados
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePayslipPageChange(payslipsCurrentPage - 1)}
                        disabled={payslipsCurrentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg">
                        {payslipsCurrentPage}
                      </span>
                      <button
                        onClick={() => handlePayslipPageChange(payslipsCurrentPage + 1)}
                        disabled={payslipsCurrentPage * payslipsPageSize >= payslipsTotalCount}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </>
    </Modal>
  );
}
