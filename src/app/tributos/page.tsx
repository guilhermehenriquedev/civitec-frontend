'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

interface Taxpayer {
  id: number;
  name: string;
  doc: string;
  address: string;
  type: 'PF' | 'PJ';
}

interface Invoice {
  id: number;
  taxpayer: Taxpayer;
  number: string;
  issue_dt: string;
  service_code: string;
  amount: number;
  status: string;
}

interface Assessment {
  id: number;
  taxpayer: Taxpayer;
  tax_kind: 'ISS' | 'IPTU' | 'ITBI';
  competence: string;
  principal: number;
  multa: number;
  juros: number;
  status: string;
}

export default function TributosPage() {
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('taxpayers');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('TRIBUTOS');

  useEffect(() => {
    // Simular dados do usuário logado
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Em uma implementação real, aqui seria feita uma chamada para obter os dados do usuário
      setUserRole('MASTER_ADMIN'); // Será sobrescrito pelos dados reais
      setUserSector('TRIBUTOS');
    }

    // Dados mock para demonstração
    const mockTaxpayers: Taxpayer[] = [
      {
        id: 1,
        name: 'Empresa ABC Ltda',
        doc: '12.345.678/0001-90',
        address: 'Rua das Flores, 123 - Centro',
        type: 'PJ'
      },
      {
        id: 2,
        name: 'João da Silva',
        doc: '123.456.789-00',
        address: 'Av. Principal, 456 - Bairro Novo',
        type: 'PF'
      },
      {
        id: 3,
        name: 'Maria Santos ME',
        doc: '98.765.432/0001-10',
        address: 'Rua do Comércio, 789 - Centro',
        type: 'PJ'
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: 1,
        taxpayer: mockTaxpayers[0],
        number: 'NF001/2024',
        issue_dt: '2024-01-15',
        service_code: '01.01.01',
        amount: 5000.00,
        status: 'EMITIDA'
      },
      {
        id: 2,
        taxpayer: mockTaxpayers[1],
        number: 'NF002/2024',
        issue_dt: '2024-01-20',
        service_code: '01.02.01',
        amount: 1200.00,
        status: 'EMITIDA'
      }
    ];

    const mockAssessments: Assessment[] = [
      {
        id: 1,
        taxpayer: mockTaxpayers[0],
        tax_kind: 'ISS',
        competence: '2024-01',
        principal: 500.00,
        multa: 0.00,
        juros: 0.00,
        status: 'EMITIDA'
      },
      {
        id: 2,
        taxpayer: mockTaxpayers[1],
        tax_kind: 'IPTU',
        competence: '2024',
        principal: 800.00,
        multa: 0.00,
        juros: 0.00,
        status: 'EMITIDA'
      }
    ];

    setTaxpayers(mockTaxpayers);
    setInvoices(mockInvoices);
    setAssessments(mockAssessments);
    setLoading(false);
  }, []);

  const handleGenerateAssessment = (taxpayerId: number) => {
    // Simular geração de avaliação
    alert(`Avaliação gerada para o contribuinte ${taxpayerId}! Em uma implementação real, aqui seria criada a avaliação no sistema.`);
  };

  const handleGenerateCode = (assessmentId: number) => {
    // Simular geração de código de barras/guia
    alert(`Código de barras gerado para a avaliação ${assessmentId}! Em uma implementação real, aqui seria gerado o código de pagamento.`);
  };

  // Verificar permissões baseado no perfil
  const canViewTaxpayers = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageTaxpayers = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewInvoices = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageInvoices = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewAssessments = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageAssessments = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Tributos</h1>
          <p className="text-gray-600 mt-2">Gestão de contribuintes, notas fiscais e avaliações</p>
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

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contribuintes</p>
                <p className="text-2xl font-semibold text-gray-900">{taxpayers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notas Fiscais</p>
                <p className="text-2xl font-semibold text-gray-900">{invoices.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avaliações</p>
                <p className="text-2xl font-semibold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Arrecadação</p>
                <p className="text-2xl font-semibold text-gray-900">R$ {assessments.reduce((sum, a) => sum + a.principal, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {canViewTaxpayers && (
                <button
                  onClick={() => setActiveTab('taxpayers')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'taxpayers'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Contribuintes ({taxpayers.length})
                </button>
              )}
              {canViewInvoices && (
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'invoices'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Notas Fiscais ({invoices.length})
                </button>
              )}
              {canViewAssessments && (
                <button
                  onClick={() => setActiveTab('assessments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'assessments'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Avaliações ({assessments.length})
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'taxpayers' && canViewTaxpayers && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Lista de Contribuintes</h3>
                  {canManageTaxpayers && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Novo Contribuinte
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome/Razão Social
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Endereço
                        </th>
                        {canManageTaxpayers && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxpayers.map((taxpayer) => (
                        <tr key={taxpayer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {taxpayer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {taxpayer.doc}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              taxpayer.type === 'PJ' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {taxpayer.type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {taxpayer.address}
                          </td>
                          {canManageTaxpayers && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                Editar
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Excluir
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && canViewInvoices && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Notas Fiscais</h3>
                  {canManageInvoices && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Nova Nota Fiscal
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Número
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contribuinte
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data Emissão
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        {canManageInvoices && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.taxpayer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(invoice.issue_dt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {invoice.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {invoice.status}
                            </span>
                          </td>
                          {canManageInvoices && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                Editar
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Excluir
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'assessments' && canViewAssessments && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Avaliações</h3>
                  {canManageAssessments && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Nova Avaliação
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contribuinte
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Tributo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Competência
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Principal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assessments.map((assessment) => (
                        <tr key={assessment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {assessment.taxpayer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              assessment.tax_kind === 'ISS' 
                                ? 'bg-blue-100 text-blue-800'
                                : assessment.tax_kind === 'IPTU'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {assessment.tax_kind}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {assessment.competence}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {assessment.principal.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {assessment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleGenerateCode(assessment.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Gerar Código
                            </button>
                            {canManageAssessments && (
                              <>
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                  Editar
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Excluir
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
