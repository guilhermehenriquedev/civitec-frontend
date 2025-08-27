'use client';

import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { ProjectModal } from '@/components/obras/ProjectModal';
import { ProgressModal } from '@/components/obras/ProgressModal';
import { PhotoModal } from '@/components/obras/PhotoModal';
import { ObrasMap } from '@/components/obras/ObrasMap';
import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import { obrasService } from '@/services/obrasService';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
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

// Componente de notificação toast
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
      <span className="text-lg">{icon}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">✕</button>
    </div>
  );
};

export default function ObrasPage() {
  const { user } = useAuth();
  
  // Estados principais
  const [dashboard, setDashboard] = useState<ObrasDashboard | null>(null);
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [progress, setProgress] = useState<WorkProgress[]>([]);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [operationLoading, setOperationLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);
  
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
  
  // Estados de filtros
  const [projectFilters, setProjectFilters] = useState<ProjectFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de notificação
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Função para mostrar notificações
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Função para carregar dados iniciais
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Carregar dashboard
      try {
        const dashboardData = await obrasService.getDashboard();
        setDashboard(dashboardData);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        // Dashboard não é crítico, continuar
      }
      
      // Carregar projetos
      const projectsData = await obrasService.getProjects();
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      
      // Carregar contratos
      try {
        const contractsData = await obrasService.getContracts();
        setContracts(Array.isArray(contractsData) ? contractsData : []);
      } catch (error) {
        console.error('Erro ao carregar contratos:', error);
        // Contratos não são críticos, continuar
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      showToast('Erro ao carregar dados. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados específicos da aba
  const loadTabData = useCallback(async (tab: string) => {
    if (tab === 'progress') {
      try {
        const progressData = await obrasService.getProgress();
        setProgress(Array.isArray(progressData) ? progressData : []);
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
        showToast('Erro ao carregar progresso.', 'error');
      }
    } else if (tab === 'map') {
      try {
        const photosData = await obrasService.getPhotos();
        setPhotos(Array.isArray(photosData) ? photosData : []);
      } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        showToast('Erro ao carregar fotos.', 'error');
      }
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handlers para projetos
  const handleCreateProject = async (data: CreateUpdateProject) => {
    try {
      setOperationLoading(true);
      await obrasService.createProject(data);
      await loadInitialData();
      setProjectModal({ isOpen: false });
      showToast('Projeto criado com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      let errorMessage = 'Erro ao criar projeto.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        } else {
          const fieldErrors = [];
          for (const [field, errors] of Object.entries(error.response.data)) {
            if (Array.isArray(errors)) {
              fieldErrors.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              fieldErrors.push(`${field}: ${errors}`);
            }
          }
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n');
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
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
      showToast('Projeto atualizado com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao atualizar projeto:', error);
      let errorMessage = 'Erro ao atualizar projeto.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
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
      showToast('Projeto excluído com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao excluir projeto:', error);
      let errorMessage = 'Erro ao excluir projeto.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  // Handlers para progresso
  const handleCreateProgress = async (data: CreateUpdateProgress) => {
    try {
      setOperationLoading(true);
      await obrasService.createProgress(data);
      await loadTabData('progress');
      setProgressModal({ isOpen: false });
      showToast('Progresso registrado com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao criar progresso:', error);
      let errorMessage = 'Erro ao criar progresso.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateProgress = async (data: CreateUpdateProgress) => {
    if (!progressModal.progress) return;
    
    try {
      setOperationLoading(true);
      await obrasService.updateProgress(progressModal.progress.id, data);
      await loadTabData('progress');
      setProgressModal({ isOpen: false });
      showToast('Progresso atualizado com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao atualizar progresso:', error);
      let errorMessage = 'Erro ao atualizar progresso.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteProgress = async (progressId: number) => {
    if (!confirm('Tem certeza que deseja excluir este registro de progresso?')) return;
    
    try {
      setOperationLoading(true);
      await obrasService.deleteProgress(progressId);
      await loadTabData('progress');
      showToast('Progresso excluído com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao excluir progresso:', error);
      let errorMessage = 'Erro ao excluir progresso.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  // Handlers para fotos
  const handleCreatePhoto = async (data: CreateUpdatePhoto) => {
    try {
      setOperationLoading(true);
      await obrasService.createPhoto(data);
      await loadTabData('map');
      setPhotoModal({ isOpen: false });
      showToast('Foto enviada com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao criar foto:', error);
      let errorMessage = 'Erro ao enviar foto.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdatePhoto = async (data: Partial<CreateUpdatePhoto>) => {
    if (!photoModal.photo) return;
    
    try {
      setOperationLoading(true);
      await obrasService.updatePhoto(photoModal.photo.id, data);
      await loadTabData('map');
      setPhotoModal({ isOpen: false });
      showToast('Foto atualizada com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao atualizar foto:', error);
      let errorMessage = 'Erro ao atualizar foto.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;
    
    try {
      setOperationLoading(true);
      await obrasService.deletePhoto(photoId);
      await loadTabData('map');
      showToast('Foto excluída com sucesso!', 'success');
    } catch (error: any) {
      console.error('Erro ao excluir foto:', error);
      let errorMessage = 'Erro ao excluir foto.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
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
    loadTabData(tab);
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

  // Verificar permissões baseado no perfil do usuário
  const canViewProjects = user && (user.role === 'MASTER_ADMIN' || user.role === 'SECTOR_ADMIN' || user.role === 'SECTOR_OPERATOR' || user.role === 'EMPLOYEE');
  const canManageProjects = user && (user.role === 'MASTER_ADMIN' || user.role === 'SECTOR_ADMIN');
  const canViewProgress = user && (user.role === 'MASTER_ADMIN' || user.role === 'SECTOR_ADMIN' || user.role === 'SECTOR_OPERATOR' || user.role === 'EMPLOYEE');
  const canManageProgress = user && (user.role === 'MASTER_ADMIN' || user.role === 'SECTOR_ADMIN' || user.role === 'SECTOR_OPERATOR');
  const canViewMap = user && (user.role === 'MASTER_ADMIN' || user.role === 'SECTOR_ADMIN' || user.role === 'SECTOR_OPERATOR' || user.role === 'EMPLOYEE');

  // Filtrar projetos baseado nos filtros aplicados
  const filteredProjects = (projects || []).filter(project => {
    const matchesSearch = !searchTerm || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.contract_details?.number && project.contract_details.number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !projectFilters.status || project.status === projectFilters.status;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados das obras...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute module="obras">
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900">Obras</h1>
            <p className="text-gray-600 mt-2">Gestão de projetos de obras e infraestrutura</p>
            {user && (
              <div className="mt-2 text-sm text-gray-500">
                <span className="font-medium">Perfil:</span> {
                  user.role === 'MASTER_ADMIN' ? 'Administrador Geral' :
                  user.role === 'SECTOR_ADMIN' ? 'Gerente de Setor' :
                  user.role === 'SECTOR_OPERATOR' ? 'Operacional' :
                  'Funcionário'
                }
                {user.sector && ` - Setor: ${user.sector}`}
              </div>
            )}
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
                    Projetos ({filteredProjects.length})
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
                    Progresso ({progress.length})
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
                    Mapa ({photos.length})
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
                      label="Buscar por nome ou contrato"
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
                        {filteredProjects.length > 0 ? (
                          filteredProjects.map((project) => (
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
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    onClick={() => setProgressModal({ isOpen: true })}
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Progresso
                                  </Button>
                                  <Button
                                    onClick={() => setPhotoModal({ isOpen: true })}
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Foto
                                  </Button>
                                  {canManageProjects && (
                                    <>
                                      <Button
                                        onClick={() => setProjectModal({ isOpen: true, project })}
                                        variant="outline"
                                        size="sm"
                                        className="text-indigo-600 hover:text-indigo-900"
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
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              {searchTerm || projectFilters.status 
                                ? 'Nenhum projeto encontrado com os filtros aplicados.'
                                : 'Nenhum projeto cadastrado ainda.'
                              }
                            </td>
                          </tr>
                        )}
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
                        {progress.length > 0 ? (
                          progress.map((prog) => {
                            const project = projects.find(p => p.id === prog.project);
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
                                  {prog.notes || '-'}
                                </td>
                                {canManageProgress && (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        onClick={() => setProgressModal({ isOpen: true, progress: prog })}
                                        variant="outline"
                                        size="sm"
                                        className="text-indigo-600 hover:text-indigo-900"
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
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={canManageProgress ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                              Nenhum registro de progresso encontrado.
                            </td>
                          </tr>
                        )}
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

        {/* Toast de notificação */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
}
