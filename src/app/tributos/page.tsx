'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useTaxpayers, useInvoices, useAssessments } from '@/hooks/tributos';
import { 
  TaxpayerModal, 
  DeleteConfirmModal, 
  InvoiceModal, 
  AssessmentModal 
} from '@/components/tributos';
import { Taxpayer, Invoice, Assessment } from '@/types/tributos';

export default function TributosPage() {
  const [activeTab, setActiveTab] = useState('taxpayers');
  const [userRole, setUserRole] = useState<string>('MASTER_ADMIN');
  const [userSector, setUserSector] = useState<string>('TRIBUTOS');
  
  // Estados dos modais
  const [showTaxpayerModal, setShowTaxpayerModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados para edição
  const [editingTaxpayer, setEditingTaxpayer] = useState<Taxpayer | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: string; id: number; name: string } | null>(null);
  
  // Estados de loading
  const [loading, setLoading] = useState(false);

  // Hooks
  const {
    taxpayers,
    loading: taxpayersLoading,
    error: taxpayersError,
    stats: taxpayersStats,
    totalCount: taxpayersTotalCount,
    currentPage: taxpayersCurrentPage,
    pageSize: taxpayersPageSize,
    fetchTaxpayers,
    fetchTaxpayerStats,
    createTaxpayer,
    updateTaxpayer,
    deleteTaxpayer
  } = useTaxpayers();

  const {
    invoices,
    loading: invoicesLoading,
    error: invoicesError,
    stats: invoicesStats,
    totalCount: invoicesTotalCount,
    currentPage: invoicesCurrentPage,
    pageSize: invoicesPageSize,
    fetchInvoices,
    fetchInvoiceStats,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    cancelInvoice,
    downloadInvoice
  } = useInvoices();

  const {
    assessments,
    loading: assessmentsLoading,
    error: assessmentsError,
    stats: assessmentsStats,
    totalCount: assessmentsTotalCount,
    currentPage: assessmentsCurrentPage,
    pageSize: assessmentsPageSize,
    fetchAssessments,
    fetchAssessmentStats,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    generateCode,
    downloadAssessment
  } = useAssessments();

  useEffect(() => {
    // Simular dados do usuário logado
    const token = localStorage.getItem('civitec_access_token');
    if (token) {
      // Em uma implementação real, aqui seria feita uma chamada para obter os dados do usuário
      setUserRole('MASTER_ADMIN'); // Será sobrescrito pelos dados reais
      setUserSector('TRIBUTOS');
    }

    // Carregar dados iniciais
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchTaxpayers(),
        fetchInvoices(),
        fetchAssessments(),
        fetchTaxpayerStats(),
        fetchInvoiceStats(),
        fetchAssessmentStats()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  // Handlers para Contribuintes
  const handleCreateTaxpayer = async (data: Partial<Taxpayer>) => {
    setLoading(true);
    try {
      if (editingTaxpayer) {
        await updateTaxpayer(editingTaxpayer.id, data);
      } else {
        await createTaxpayer(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditTaxpayer = (taxpayer: Taxpayer) => {
    setEditingTaxpayer(taxpayer);
    setShowTaxpayerModal(true);
  };

  const handleDeleteTaxpayer = (taxpayer: Taxpayer) => {
    setDeletingItem({ type: 'taxpayer', id: taxpayer.id, name: taxpayer.name });
    setShowDeleteModal(true);
  };

  const confirmDeleteTaxpayer = async () => {
    if (deletingItem?.type === 'taxpayer') {
      setLoading(true);
      try {
        await deleteTaxpayer(deletingItem.id);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handlers para Notas Fiscais
  const handleCreateInvoice = async (data: Partial<Invoice>) => {
    setLoading(true);
    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, data);
      } else {
        await createInvoice(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setDeletingItem({ type: 'invoice', id: invoice.id, name: invoice.number });
    setShowDeleteModal(true);
  };

  const confirmDeleteInvoice = async () => {
    if (deletingItem?.type === 'invoice') {
      setLoading(true);
      try {
        await deleteInvoice(deletingItem.id);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelInvoice = async (invoice: Invoice, reason: string) => {
    setLoading(true);
    try {
      await cancelInvoice(invoice.id, reason);
    } finally {
      setLoading(false);
    }
  };

  // Handlers para Avaliações
  const handleCreateAssessment = async (data: Partial<Assessment>) => {
    setLoading(true);
    try {
      if (editingAssessment) {
        await updateAssessment(editingAssessment.id, data);
      } else {
        await createAssessment(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setShowAssessmentModal(true);
  };

  const handleDeleteAssessment = (assessment: Assessment) => {
    setDeletingItem({ type: 'assessment', id: assessment.id, name: `${assessment.tax_kind} - ${assessment.taxpayer.name}` });
    setShowDeleteModal(true);
  };

  const confirmDeleteAssessment = async () => {
    if (deletingItem?.type === 'assessment') {
      setLoading(true);
      try {
        await deleteAssessment(deletingItem.id);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGenerateCode = async (assessment: Assessment) => {
    try {
      const result = await generateCode(assessment.id);
      console.log('Código gerado:', result);
      // Aqui você pode mostrar o código em um modal ou notificação
    } catch (error) {
      console.error('Erro ao gerar código:', error);
    }
  };

  // Fechar modais
  const closeModals = () => {
    setShowTaxpayerModal(false);
    setShowInvoiceModal(false);
    setShowAssessmentModal(false);
    setShowDeleteModal(false);
    setEditingTaxpayer(null);
    setEditingInvoice(null);
    setEditingAssessment(null);
    setDeletingItem(null);
  };

  // Verificar permissões baseado no perfil
  const canViewTaxpayers = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageTaxpayers = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewInvoices = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageInvoices = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';
  const canViewAssessments = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN' || userRole === 'SECTOR_OPERATOR';
  const canManageAssessments = userRole === 'MASTER_ADMIN' || userRole === 'SECTOR_ADMIN';

  if (taxpayersLoading && invoicesLoading && assessmentsLoading) {
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
                <p className="text-2xl font-semibold text-gray-900">{taxpayersStats?.total || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{invoicesStats?.total || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{assessmentsStats?.total || 0}</p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {((invoicesStats?.total_value || 0) + (assessmentsStats?.total_value || 0)).toLocaleString()}
                </p>
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
                  Contribuintes ({taxpayersStats?.total || 0})
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
                  Notas Fiscais ({invoicesStats?.total || 0})
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
                  Avaliações ({assessmentsStats?.total || 0})
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
                    <button 
                      onClick={() => setShowTaxpayerModal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Novo Contribuinte
                    </button>
                  )}
                </div>
                
                {taxpayersError ? (
                  <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-600">{taxpayersError}</p>
                    <button
                      onClick={() => fetchTaxpayers()}
                      className="mt-3 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                ) : taxpayers.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Nenhum contribuinte encontrado</p>
                  </div>
                ) : (
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
                                <button 
                                  onClick={() => handleEditTaxpayer(taxpayer)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Editar
                                </button>
                                <button 
                                  onClick={() => handleDeleteTaxpayer(taxpayer)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Excluir
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'invoices' && canViewInvoices && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Notas Fiscais</h3>
                  {canManageInvoices && (
                    <button 
                      onClick={() => setShowInvoiceModal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Nova Nota Fiscal
                    </button>
                  )}
                </div>
                
                {invoicesError ? (
                  <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-600">{invoicesError}</p>
                    <button
                      onClick={() => fetchInvoices()}
                      className="mt-3 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Nenhuma nota fiscal encontrada</p>
                  </div>
                ) : (
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
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                invoice.status === 'EMITIDA' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {invoice.status}
                              </span>
                            </td>
                            {canManageInvoices && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button 
                                  onClick={() => handleEditInvoice(invoice)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Editar
                                </button>
                                <button 
                                  onClick={() => handleDeleteInvoice(invoice)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Excluir
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assessments' && canViewAssessments && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Avaliações</h3>
                  {canManageAssessments && (
                    <button 
                      onClick={() => setShowAssessmentModal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Nova Avaliação
                    </button>
                  )}
                </div>
                
                {assessmentsError ? (
                  <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-600">{assessmentsError}</p>
                    <button
                      onClick={() => fetchAssessments()}
                      className="mt-3 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                ) : assessments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Nenhuma avaliação encontrada</p>
                  </div>
                ) : (
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
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                assessment.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                                assessment.status === 'EMITIDA' ? 'bg-blue-100 text-blue-800' :
                                assessment.status === 'PAGA' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {assessment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleGenerateCode(assessment)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Gerar Código
                              </button>
                              {canManageAssessments && (
                                <>
                                  <button 
                                    onClick={() => handleEditAssessment(assessment)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    Editar
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAssessment(assessment)}
                                    className="text-red-600 hover:text-red-900"
                                  >
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      <TaxpayerModal
        isOpen={showTaxpayerModal}
        onClose={closeModals}
        taxpayer={editingTaxpayer}
        onSubmit={handleCreateTaxpayer}
        loading={loading}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={closeModals}
        invoice={editingInvoice}
        taxpayers={taxpayers}
        onSubmit={handleCreateInvoice}
        loading={loading}
      />

      <AssessmentModal
        isOpen={showAssessmentModal}
        onClose={closeModals}
        assessment={editingAssessment}
        taxpayers={taxpayers}
        onSubmit={handleCreateAssessment}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onConfirm={
          deletingItem?.type === 'taxpayer' ? confirmDeleteTaxpayer :
          deletingItem?.type === 'invoice' ? confirmDeleteInvoice :
          confirmDeleteAssessment
        }
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o `}
        itemName={deletingItem?.name || ''}
        loading={loading}
      />
    </Layout>
  );
}
