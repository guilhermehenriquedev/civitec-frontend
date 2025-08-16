'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

interface Procurement {
  id: number;
  modalidade: string;
  objeto: string;
  numero_processo: string;
  valor_estimado: number;
  status: string;
  fase_atual: string;
}

interface Proposal {
  id: number;
  procurement: Procurement;
  supplier: string;
  valor: number;
  classificacao: number;
  status: string;
}

interface Contract {
  id: number;
  procurement: Procurement;
  number: string;
  supplier: string;
  start_dt: string;
  end_dt: string;
  valor_total: number;
  status: string;
}

export default function LicitacaoPage() {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('procurements');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('LICITACAO');

  useEffect(() => {
    // Simular dados do usuário logado
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Em uma implementação real, aqui seria feita uma chamada para obter os dados do usuário
      setUserRole('MASTER_ADMIN'); // Será sobrescrito pelos dados reais
      setUserSector('LICITACAO');
    }

    // Dados mock para demonstração
    const mockProcurements: Procurement[] = [
      {
        id: 1,
        modalidade: 'Pregão Eletrônico',
        objeto: 'Aquisição de equipamentos de informática',
        numero_processo: '001/2024',
        valor_estimado: 150000.00,
        status: 'EM ANDAMENTO',
        fase_atual: 'Recebimento de Propostas'
      },
      {
        id: 2,
        modalidade: 'Concorrência',
        objeto: 'Construção de escola municipal',
        numero_processo: '002/2024',
        valor_estimado: 2500000.00,
        status: 'EM ANDAMENTO',
        fase_atual: 'Análise de Propostas'
      },
      {
        id: 3,
        modalidade: 'Tomada de Preços',
        objeto: 'Serviços de limpeza e conservação',
        numero_processo: '003/2024',
        valor_estimado: 80000.00,
        status: 'FINALIZADO',
        fase_atual: 'Contrato Assinado'
      }
    ];

    const mockProposals: Proposal[] = [
      {
        id: 1,
        procurement: mockProcurements[0],
        supplier: 'Tech Solutions Ltda',
        valor: 145000.00,
        classificacao: 1,
        status: 'CLASSIFICADA'
      },
      {
        id: 2,
        procurement: mockProcurements[0],
        supplier: 'Inovação Digital ME',
        valor: 152000.00,
        classificacao: 2,
        status: 'CLASSIFICADA'
      },
      {
        id: 3,
        procurement: mockProcurements[1],
        supplier: 'Construtora ABC Ltda',
        valor: 2480000.00,
        classificacao: 1,
        status: 'CLASSIFICADA'
      }
    ];

    const mockContracts: Contract[] = [
      {
        id: 1,
        procurement: mockProcurements[2],
        number: 'CT001/2024',
        supplier: 'Limpeza Express Ltda',
        start_dt: '2024-02-01',
        end_dt: '2024-12-31',
        valor_total: 80000.00,
        status: 'ATIVO'
      }
    ];

    setProcurements(mockProcurements);
    setProposals(mockProposals);
    setContracts(mockContracts);
    setLoading(false);
  }, []);

  const handleAdvancePhase = (procurementId: number) => {
    // Simular avanço de fase
    alert(`Fase avançada para o processo ${procurementId}! Em uma implementação real, aqui seria atualizada a fase no sistema.`);
  };

  const handleAdjudicate = (procurementId: number) => {
    // Simular adjudicação
    alert(`Processo ${procurementId} adjudicado! Em uma implementação real, aqui seria feita a adjudicação no sistema.`);
  };

  const handleViewProgress = (contractId: number) => {
    // Simular visualização de progresso
    alert(`Progresso do contrato ${contractId} visualizado! Em uma implementação real, aqui seria exibido o progresso detalhado.`);
  };

  // Verificar permissões baseado no perfil
  const canViewProcurements = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageProcurements = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewProposals = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageProposals = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewContracts = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageContracts = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';

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
          <h1 className="text-3xl font-bold text-gray-900">Licitação</h1>
          <p className="text-gray-600 mt-2">Gestão de processos licitatórios, propostas e contratos</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processos</p>
                <p className="text-2xl font-semibold text-gray-900">{procurements.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Propostas</p>
                <p className="text-2xl font-semibold text-gray-900">{proposals.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Contratos</p>
                <p className="text-2xl font-semibold text-gray-900">{contracts.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-semibold text-gray-900">R$ {procurements.reduce((sum, p) => sum + p.valor_estimado, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {canViewProcurements && (
                <button
                  onClick={() => setActiveTab('procurements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'procurements'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Processos ({procurements.length})
                </button>
              )}
              {canViewProposals && (
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'proposals'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Propostas ({proposals.length})
                </button>
              )}
              {canViewContracts && (
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'contracts'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Contratos ({contracts.length})
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'procurements' && canViewProcurements && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Processos Licitatórios</h3>
                  {canManageProcurements && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Novo Processo
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
                          Modalidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Objeto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Estimado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fase Atual
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
                      {procurements.map((procurement) => (
                        <tr key={procurement.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {procurement.numero_processo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {procurement.modalidade}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {procurement.objeto}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {procurement.valor_estimado.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {procurement.fase_atual}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              procurement.status === 'EM ANDAMENTO' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : procurement.status === 'FINALIZADO'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {procurement.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleAdvancePhase(procurement.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Avançar Fase
                            </button>
                            {canManageProcurements && (
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

            {activeTab === 'proposals' && canViewProposals && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Propostas</h3>
                  {canManageProposals && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Nova Proposta
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Processo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fornecedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Classificação
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
                      {proposals.map((proposal) => (
                        <tr key={proposal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {proposal.procurement.numero_processo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {proposal.supplier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {proposal.valor.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {proposal.classificacao}º
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {proposal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleAdjudicate(proposal.procurement.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Adjudicar
                            </button>
                            {canManageProposals && (
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

            {activeTab === 'contracts' && canViewContracts && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Contratos</h3>
                  {canManageContracts && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Novo Contrato
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
                          Processo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fornecedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Total
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
                      {contracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {contract.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {contract.procurement.numero_processo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {contract.supplier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(contract.start_dt).toLocaleDateString('pt-BR')} a {new Date(contract.end_dt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {contract.valor_total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              contract.status === 'ATIVO' 
                                ? 'bg-green-100 text-green-800'
                                : contract.status === 'FINALIZADO'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {contract.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleViewProgress(contract.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Progresso
                            </button>
                            {canManageContracts && (
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
