'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

interface ReportData {
  id: number;
  module: string;
  title: string;
  period: string;
  data: any;
}

export default function RelatoriosPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('');

  useEffect(() => {
    // Simular dados do usuário logado
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Em uma implementação real, aqui seria feita uma chamada para obter os dados do usuário
      setUserRole('MASTER_ADMIN'); // Será sobrescrito pelos dados reais
      setUserSector(''); // Será definido baseado no usuário real
    }

    // Dados mock para demonstração
    const mockReports: ReportData[] = [
      {
        id: 1,
        module: 'RH',
        title: 'Relatório de Férias Pendentes',
        period: '2024-01',
        data: { pending: 15, approved: 8, rejected: 2 }
      },
      {
        id: 2,
        module: 'TRIBUTOS',
        title: 'Relatório de Arrecadação',
        period: '2024-01',
        data: { total: 1250000, collected: 980000, pending: 270000 }
      },
      {
        id: 3,
        module: 'LICITACAO',
        title: 'Relatório de Processos por Fase',
        period: '2024-01',
        data: { planning: 5, execution: 12, completed: 8 }
      },
      {
        id: 4,
        module: 'OBRAS',
        title: 'Relatório de Progresso Físico',
        period: '2024-01',
        data: { avg_progress: 65, on_schedule: 18, delayed: 3 }
      }
    ];

    setReports(mockReports);
    setLoading(false);
  }, []);

  const handleExportPDF = (reportId: number) => {
    // Simular exportação para PDF
    alert(`Exportação para PDF do relatório ${reportId} iniciada! Em uma implementação real, aqui seria gerado o arquivo PDF.`);
  };

  const handleExportExcel = (reportId: number) => {
    // Simular exportação para Excel
    alert(`Exportação para Excel do relatório ${reportId} iniciada! Em uma implementação real, aqui seria gerado o arquivo Excel.`);
  };

  // Verificar permissões baseado no perfil
  const canViewReports = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canExportReports = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!canViewReports) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Você não tem permissão para acessar esta área.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">Relatórios gerenciais e operacionais da plataforma</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium">Perfil:</span> {
              userRole === 'MASTER_ADMIN' ? 'Administrador Geral' :
              userRole === 'SECTOR_ADMIN' ? 'Gerente de Setor' :
              userRole === 'SECTOR_OPERATOR' ? 'Operacional' :
              'Funcionário'
            }
            {userSector && ` - Setor: ${userSector}`}
          </div>
        </div>

        {/* Seletor de Período */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Período de Análise</h3>
            <div className="flex items-center space-x-4">
              <label htmlFor="period" className="text-sm font-medium text-gray-700">
                Período:
              </label>
              <select
                id="period"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2024-01">Janeiro 2024</option>
                <option value="2024-02">Fevereiro 2024</option>
                <option value="2024-03">Março 2024</option>
                <option value="2024-Q1">1º Trimestre 2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Funcionários</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Arrecadação Mensal</p>
                <p className="text-2xl font-semibold text-gray-900">R$ 1,25M</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processos Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">25</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Obras em Execução</p>
                <p className="text-2xl font-semibold text-gray-900">18</p>
              </div>
            </div>
          </div>
        </div>

        {/* Relatórios por Módulo */}
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500">Módulo: {report.module} | Período: {report.period}</p>
                  </div>
                  {canExportReports && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleExportPDF(report.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleExportExcel(report.id)}
                        className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                      >
                        Excel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {report.module === 'RH' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{report.data.pending}</div>
                      <div className="text-sm text-blue-800">Férias Pendentes</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{report.data.approved}</div>
                      <div className="text-sm text-green-800">Férias Aprovadas</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{report.data.rejected}</div>
                      <div className="text-sm text-red-800">Férias Rejeitadas</div>
                    </div>
                  </div>
                )}

                {report.module === 'TRIBUTOS' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">R$ {(report.data.total / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-blue-800">Total a Arrecadar</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">R$ {(report.data.collected / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-green-800">Arrecadado</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">R$ {(report.data.pending / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-yellow-800">Pendente</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(report.data.collected / report.data.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      Taxa de Arrecadação: {Math.round((report.data.collected / report.data.total) * 100)}%
                    </div>
                  </div>
                )}

                {report.module === 'LICITACAO' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{report.data.planning}</div>
                      <div className="text-sm text-blue-800">Em Planejamento</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{report.data.execution}</div>
                      <div className="text-sm text-yellow-800">Em Execução</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{report.data.completed}</div>
                      <div className="text-sm text-green-800">Concluídos</div>
                    </div>
                  </div>
                )}

                {report.module === 'OBRAS' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{report.data.avg_progress}%</div>
                        <div className="text-sm text-blue-800">Progresso Médio</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{report.data.on_schedule}</div>
                        <div className="text-sm text-green-800">No Prazo</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{report.data.delayed}</div>
                        <div className="text-sm text-red-800">Atrasadas</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${report.data.avg_progress}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      Progresso Geral das Obras
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
