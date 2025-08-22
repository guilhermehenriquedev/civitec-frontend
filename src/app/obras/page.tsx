'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { ProjectModal } from '@/components/obras/ProjectModal';
import { ProgressModal } from '@/components/obras/ProgressModal';
import { PhotoModal } from '@/components/obras/PhotoModal';
import { ObrasMap } from '@/components/obras/ObrasMap';
import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import { obrasService } from '@/services/obrasService';
import {
  WorkProject,
  WorkProgress,
  WorkPhoto,
  ObrasDashboard,
  CreateUpdateProject,
  CreateUpdateProgress,
  CreateUpdatePhoto,
  ProjectFilters
} from '@/types/obras';

export default function ObrasPage() {
  // Estados principais
  const [dashboard, setDashboard] = useState<ObrasDashboard | null>(null);
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [progress, setProgress] = useState<WorkProgress[]>([]);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('OBRAS');
  
  // Estados dos modais
  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    project?: WorkProject;
  }>({ isOpen: false });
  
  const [progressModal, setProgressModal] = useState<{
    isOpen: boolean;
    progress?: WorkProgress;
  }>({ isOpen: false });
  
  const [photoModal, setPhotoModal] = useState<{
    isOpen: boolean;
    photo?: WorkPhoto;
  }>({ isOpen: false });
  
  // Estados de operações
  const [operationLoading, setOperationLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);
  
  // Estados de filtros
  const [projectFilters, setProjectFilters] = useState<ProjectFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Dados mock temporários para teste
      const mockProjects = [
        {
          id: 1,
          name: 'Construção da Escola Municipal',
          contract: 1,
          contract_details: { id: 1, number: 'CT001/2024', objeto: 'Construção de escola', supplier_name: 'Construtora ABC', valor_total: 2500000, start_dt: '2024-01-01', end_dt: '2024-12-31' },
          location_lat: -23.5505,
          location_lng: -46.6333,
          address: 'Rua das Flores, 123 - Centro',
          budget: 2500000,
          status: 'EXECUCAO',
          status_display: 'Em Execução',
          start_date: '2024-01-15',
          expected_end_date: '2024-12-30',
          actual_end_date: undefined,
          description: 'Construção de escola municipal com 12 salas de aula',
          responsible: 'Eng. Carlos Mendes',
          progress_set: [],
          photos: [],
          progress_physical: 65,
          progress_financial: 55,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const mockDashboard = {
        total_projects: 1,
        projects_in_execution: 1,
        average_progress: 65,
        total_budget: 2500000,
        projects_by_status: { 'EXECUCAO': 1 },
        recent_progress: []
      };

      const mockContracts = [
        { id: 1, number: 'CT001/2024', objeto: 'Construção de escola', supplier_name: 'Construtora ABC', valor_total: 2500000, start_dt: '2024-01-01', end_dt: '2024-12-31' }
      ];

      console.log('Usando dados mock para teste');
      
      // Usar dados mock por enquanto
      setProjects(mockProjects);
      setContracts(mockContracts);
      setDashboard(mockDashboard);
      
      // Simular dados do usuário (em produção seria obtido do contexto de auth)
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Aqui seria feita uma chamada para obter os dados do usuário
        setUserRole('MASTER_ADMIN');
        setUserSector('OBRAS');
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro, definir arrays vazios
      setProjects([]);
      setContracts([]);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const progressData = await obrasService.getProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  const loadPhotos = async () => {
    try {
      const photosData = await obrasService.getPhotos();
      setPhotos(photosData);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    }
  };

  // Handlers para projetos
  const handleCreateProject = async (data: CreateUpdateProject) => {
    try {
      setOperationLoading(true);
      await obrasService.createProject(data);
      await loadInitialData();
      setProjectModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      alert('Erro ao criar projeto. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateProject = async (data: CreateUpdateProject) => {
    if (!projectModal.project) return;
    
    try {
      setOperationLoading(true);
      await obrasService.updateProject(projectModal.project.id, data);
      await loadInitialData();
      setProjectModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      alert('Erro ao atualizar projeto. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    try {
      setOperationLoading(true);
      await obrasService.deleteProject(projectId);
      await loadInitialData();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      alert('Erro ao excluir projeto. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  // Handlers para progresso
  const handleCreateProgress = async (data: CreateUpdateProgress) => {
    try {
      setOperationLoading(true);
      console.log('Dados sendo enviados para criar progresso:', data);
      await obrasService.createProgress(data);
      await loadProgress();
      setProgressModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao criar progresso:', error);
      alert('Erro ao criar progresso. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateProgress = async (data: CreateUpdateProgress) => {
    if (!progressModal.progress) return;
    
    try {
      setOperationLoading(true);
      await obrasService.updateProgress(progressModal.progress.id, data);
      await loadProgress();
      setProgressModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      alert('Erro ao atualizar progresso. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteProgress = async (progressId: number) => {
    if (!confirm('Tem certeza que deseja excluir este registro de progresso?')) return;
    
    try {
      setOperationLoading(true);
      await obrasService.deleteProgress(progressId);
      await loadProgress();
    } catch (error) {
      console.error('Erro ao excluir progresso:', error);
      alert('Erro ao excluir progresso. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  // Handlers para fotos
  const handleCreatePhoto = async (data: CreateUpdatePhoto) => {
    try {
      setOperationLoading(true);
      await obrasService.createPhoto(data);
      await loadPhotos();
      setPhotoModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao criar foto:', error);
      alert('Erro ao criar foto. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdatePhoto = async (data: Partial<CreateUpdatePhoto>) => {
    if (!photoModal.photo) return;
    
    try {
      setOperationLoading(true);
      await obrasService.updatePhoto(photoModal.photo.id, data);
      await loadPhotos();
      setPhotoModal({ isOpen: false });
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      alert('Erro ao atualizar foto. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;
    
    try {
      setOperationLoading(true);
      await obrasService.deletePhoto(photoId);
      await loadPhotos();
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      alert('Erro ao excluir foto. Tente novamente.');
    } finally {
      setOperationLoading(false);
    }
  };

  // Handlers de UI
  const handleProjectClick = (project: WorkProject) => {
    setSelectedProject(project);
    setActiveTab('projects');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Carregar dados específicos da aba
    if (tab === 'progress') {
      loadProgress();
    } else if (tab === 'map') {
      loadPhotos();
    }
  };

  const handleProjectSubmit = (data: CreateUpdateProject) => {
    if (projectModal.project) {
      handleUpdateProject(data);
    } else {
      handleCreateProject(data);
    }
  };

  const handleProgressSubmit = (data: CreateUpdateProgress) => {
    if (progressModal.progress) {
      handleUpdateProgress(data);
    } else {
      handleCreateProgress(data);
    }
  };

  const handlePhotoSubmit = (data: CreateUpdatePhoto) => {
    if (photoModal.photo) {
      handleUpdatePhoto(data);
    } else {
      handleCreatePhoto(data);
    }
  };

  // Verificar permissões baseado no perfil
  const canViewProjects = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR' || userRole === 'EMPLOYEE';
  const canManageProjects = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewProgress = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR' || userRole === 'EMPLOYEE';
  const canManageProgress = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canViewMap = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR' || userRole === 'EMPLOYEE';

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

        {/* Cards de Resumo */}
        {dashboard && (
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
                  <p className="text-2xl font-semibold text-gray-900">{dashboard.total_projects}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{dashboard.projects_in_execution}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{dashboard.average_progress}%</p>
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
                  <p className="text-2xl font-semibold text-gray-900">R$ {dashboard.total_budget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {canViewProjects && (
                <button
                  onClick={() => handleTabChange('projects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'projects'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Projetos ({Array.isArray(projects) ? projects.length : 0})
                </button>
              )}
              {canViewProgress && (
                <button
                  onClick={() => handleTabChange('progress')}
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
                  onClick={() => handleTabChange('map')}
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
            {/* Aba Projetos */}
            {activeTab === 'projects' && canViewProjects && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Projetos de Obras</h3>
                  {canManageProjects && (
                    <Button
                      onClick={() => setProjectModal({ isOpen: true })}
                      variant="primary"
                    >
                      Novo Projeto
                    </Button>
                  )}
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    name="search"
                    label="Buscar por nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite para buscar..."
                  />
                  <Select
                    name="status"
                    label="Status"
                    value={projectFilters.status || ''}
                    onChange={(e) => setProjectFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'PLANEJAMENTO', label: 'Planejamento' },
                      { value: 'LICITACAO', label: 'Licitação' },
                      { value: 'EXECUCAO', label: 'Em Execução' },
                      { value: 'PARALISADA', label: 'Paralisada' },
                      { value: 'CONCLUIDA', label: 'Concluída' },
                      { value: 'CANCELADA', label: 'Cancelada' }
                    ]}
                  />
                </div>
                
                {/* Tabela de Projetos */}
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
                      {Array.isArray(projects) && projects
                        .filter(project => 
                          !searchTerm || 
                          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.contract_details?.number?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .filter(project => 
                          !projectFilters.status || project.status === projectFilters.status
                        )
                        .map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {project.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {project.contract_details?.number || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            R$ {project.budget.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              project.status === 'EXECUCAO' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : project.status === 'CONCLUIDA'
                                ? 'bg-green-100 text-green-800'
                                : project.status === 'PLANEJAMENTO'
                                ? 'bg-blue-100 text-blue-800'
                                : project.status === 'LICITACAO'
                                ? 'bg-purple-100 text-purple-800'
                                : project.status === 'PARALISADA'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status_display}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              onClick={() => setProgressModal({ isOpen: true })}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Progresso
                            </Button>
                            <Button
                              onClick={() => setPhotoModal({ isOpen: true })}
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Foto
                            </Button>
                            {canManageProjects && (
                              <>
                                <Button
                                  onClick={() => setProjectModal({ isOpen: true, project })}
                                  variant="outline"
                                  size="sm"
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => handleDeleteProject(project.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-900"
                                  disabled={operationLoading}
                                >
                                  Excluir
                                </Button>
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

            {/* Aba Progresso */}
            {activeTab === 'progress' && canViewProgress && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Progresso das Obras</h3>
                  {canManageProgress && (
                    <Button
                      onClick={() => setProgressModal({ isOpen: true })}
                      variant="primary"
                    >
                      Atualizar Progresso
                    </Button>
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
                      {Array.isArray(progress) && progress.map((prog) => {
                        const project = Array.isArray(projects) ? projects.find(p => p.id === prog.project) : null;
                        return (
                          <tr key={prog.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {project?.name || 'Projeto não encontrado'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(prog.ref_month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
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
                                <Button
                                  onClick={() => setProgressModal({ isOpen: true, progress: prog })}
                                  variant="outline"
                                  size="sm"
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => handleDeleteProgress(prog.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-900"
                                  disabled={operationLoading}
                                >
                                  Excluir
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba Mapa */}
            {activeTab === 'map' && canViewMap && (
              <ObrasMap 
                projects={projects} 
                onProjectClick={handleProjectClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      <ProjectModal
        isOpen={projectModal.isOpen}
        onClose={() => setProjectModal({ isOpen: false })}
        onSubmit={handleProjectSubmit}
        project={projectModal.project}
        contracts={contracts}
        loading={operationLoading}
      />

      <ProgressModal
        isOpen={progressModal.isOpen}
        onClose={() => setProgressModal({ isOpen: false })}
        onSubmit={handleProgressSubmit}
        progress={progressModal.progress}
        projects={projects}
        loading={operationLoading}
      />

      <PhotoModal
        isOpen={photoModal.isOpen}
        onClose={() => setPhotoModal({ isOpen: false })}
        onSubmit={handlePhotoSubmit}
        photo={photoModal.photo}
        projects={projects}
        loading={operationLoading}
      />
    </Layout>
  );
}
