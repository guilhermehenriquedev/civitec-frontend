'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
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

interface Payslip {
  id: number;
  employee: {
    id: number;
    nome_completo: string;
    matricula: string;
  };
  competence: string;
  gross_salary: number;
  deductions: number;
  net_salary: number;
  status: string;
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
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && employee) {
      fetchEmployeeData();
    }
  }, [isOpen, employee]);

  const fetchEmployeeData = async () => {
    if (!employee) return;
    
    setLoading(true);
    try {
      // Buscar férias do funcionário
      const vacationsResponse = await apiClient.get(`/api/rh/vacations/?employee=${employee.id}`);
      setVacations(vacationsResponse.data.results || []);

      // Buscar contracheques do funcionário
      const payslipsResponse = await apiClient.get(`/api/rh/payslips/?employee=${employee.id}`);
      setPayslips(payslipsResponse.data.results || []);
    } catch (error) {
      console.error('Erro ao carregar dados do funcionário:', error);
    } finally {
      setLoading(false);
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

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vida do Funcionário: ${employee.nome_completo}`}
      size="lg"
    >
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
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do funcionário...</p>
        </div>
      ) : (
        <>
          {/* Tab Detalhes */}
          {activeTab === 'detalhes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Nome Completo</dt>
                      <dd className="text-sm text-gray-900">{employee.nome_completo}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Matrícula</dt>
                      <dd className="text-sm text-gray-900">{employee.matricula}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Cargo</dt>
                      <dd className="text-sm text-gray-900">{employee.cargo}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Lotação</dt>
                      <dd className="text-sm text-gray-900">{employee.lotacao}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Regime</dt>
                      <dd className="text-sm text-gray-900">{employee.regime}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Data de Admissão</dt>
                      <dd className="text-sm text-gray-900">{formatDate(employee.admissao_dt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Tab Férias */}
          {activeTab === 'ferias' && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Histórico de Férias</h4>
              {vacations.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma solicitação de férias encontrada</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Justificativa</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vacations.map((vacation) => (
                        <tr key={vacation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(vacation.period_start)} - {formatDate(vacation.period_end)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vacation.days_requested}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{vacation.reason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab Contracheques */}
          {activeTab === 'contracheques' && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Histórico de Contracheques</h4>
              {payslips.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum contracheque encontrado</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competência</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salário Bruto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descontos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salário Líquido</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payslips.map((payslip) => (
                        <tr key={payslip.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payslip.competence}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {payslip.gross_salary?.toFixed(2) || '0,00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {payslip.deductions?.toFixed(2) || '0,00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {payslip.net_salary?.toFixed(2) || '0,00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {payslip.status || 'PAGO'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
