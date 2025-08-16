'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

interface WorkProject {
  id: number;
  name: string;
  contract?: string;
  location_lat: number;
  location_lng: number;
  budget: number;
  status: string;
}

interface WorkProgress {
  id: number;
  project: WorkProject;
  ref_month: string;
  physical_pct: number;
  financial_pct: number;
  notes: string;
}

export default function ObrasPage() {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [progress, setProgress] = useState<WorkProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('OBRAS');

  useEffect(() => {
    // Simular dados do usuário logado
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Em uma implementação real, aqui seria feita uma chamada para obter os dados do usuário
      setUserRole('MASTER_ADMIN'); // Será sobrescrito pelos dados reais
      setUserSector('OBRAS');
    }

    // Dados mock para demonstração
    const mockProjects: WorkProject[] = [
      {
        id: 1,
        name: 'Construção da Escola Municipal',
        contract: 'CT001/2024',
        location_lat: -23.5505,
        location_lng: -46.6333,
        budget: 2500000.00,
        status: 'EM EXECUÇÃO'
      },
      {
        id: 2,
        name: 'Reforma da Praça Central',
        contract: 'CT002/2024',
        location_lat: -23.5510,
        location_lng: -46.6340,
        budget: 800000.00,
        status: 'PLANEJAMENTO'
      },
      {
        id: 3,
        name: 'Pavimentação da Rua das Flores',
        contract: 'CT003/2024',
        location_lat: -23.5490,
        location_lng: -46.6320,
        budget: 1200000.00,
        status: 'CONCLUÍDO'
      }
    ];

    const mockProgress: WorkProgress[] = [
      {
        id: 1,
        project: mockProjects[0],
        ref_month: '2024-01',
        physical_pct: 35,
        financial_pct: 28,
        notes: 'Fundação concluída, iniciando estrutura'
      },
      {
        id: 2,
        project: mockProjects[1],
        ref_month: '2024-01',
        physical_pct: 15,
        financial_pct: 12,
        notes: 'Projeto executivo em aprovação'
      },
      {
        id: 3,
        project: mockProjects[2],
        ref_month: '2024-01',
        physical_pct: 100,
        financial_pct: 95,
        notes: 'Obra concluída, aguardando vistoria final'
      }
    ];

    setProjects(mockProjects);
    setProgress(mockProgress);
    setLoading(false);
  }, []);

  const handleViewProgress = (projectId: number) => {
    // Simular visualização de progresso
    alert(`Progresso do projeto ${projectId} visualizado! Em uma implementação real, aqui seria exibido o progresso detalhado.`);
  };

  const handleUploadPhoto = (projectId: number) => {
    // Simular upload de foto
    alert(`Upload de foto para o projeto ${projectId} iniciado! Em uma implementação real, aqui seria feito o upload da imagem.`);
  };

  const handleUpdateProgress = (projectId: number) => {
    // Simular atualização de progresso
    alert(`Atualização de progresso para o projeto ${projectId} iniciada! Em uma implementação real, aqui seria aberto o formulário de atualização.`);
  };

  // Verificar permissões baseado no perfil
  const canViewProjects = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageProjects = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewProgress = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageProgress = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canViewMap = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';

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
          <h1 className="text-3xl font-bold text-gray-900">Obras</h1>
          <p className="text-gray-600 mt-2">Gestão de projetos de obras e infraestrutura</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projetos</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Execução</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.filter(p => p.status === 'EM EXECUÇÃO').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(progress.reduce((sum, p) => sum + p.physical_pct, 0) / progress.length)}%
                </p>
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
                <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
                <p className="text-2xl font-semibold text-gray-900">R$ {projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {canViewProjects && (
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'projects'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Projetos ({projects.length})
                </button>
              )}
              {canViewProgress && (
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'progress'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Progresso
                </button>
              )}
              {canViewMap && (
                <button
                  onClick={() => setActiveTab('map')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'map'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mapa
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'projects' && canViewProjects && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Projetos de Obras</h3>
                  {canManageProjects && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Novo Projeto
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome do Projeto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contrato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orçamento
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
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {project.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {project.contract || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {project.budget.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              project.status === 'EM EXECUÇÃO' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : project.status === 'CONCLUÍDO'
                                ? 'bg-green-100 text-green-800'
                                : project.status === 'PLANEJAMENTO'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleViewProgress(project.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Progresso
                            </button>
                            <button 
                              onClick={() => handleUploadPhoto(project.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Foto
                            </button>
                            {canManageProjects && (
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

            {activeTab === 'progress' && canViewProgress && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Progresso das Obras</h3>
                  {canManageProgress && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                      Atualizar Progresso
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Projeto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês de Referência
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progresso Físico
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progresso Financeiro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Observações
                        </th>
                        {canManageProgress && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {progress.map((prog) => (
                        <tr key={prog.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {prog.project.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {prog.ref_month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${prog.physical_pct}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{prog.physical_pct}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${prog.financial_pct}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{prog.financial_pct}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {prog.notes}
                          </td>
                          {canManageProgress && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleUpdateProgress(prog.project.id)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
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

            {activeTab === 'map' && canViewMap && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Mapa das Obras</h3>
                
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Integração com Leaflet</h4>
                  <p className="text-gray-600">
                    Em uma implementação real, aqui seria exibido o mapa interativo com as localizações das obras.
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Projetos cadastrados: {projects.length}</p>
                    <p>Coordenadas disponíveis: {projects.filter(p => p.location_lat && p.location_lng).length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
