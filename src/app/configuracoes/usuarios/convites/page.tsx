'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { apiClient, InviteData, InviteResponse } from '@/lib/api';
import Layout from '@/components/layout/Layout';
import { 
  UserPlusIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Schema de validação para criação de convites
const inviteSchema = z.object({
  email: z.string().email('E-mail inválido'),
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role_code: z.string().min(1, 'Selecione um papel'),
  sector_code: z.string().optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

// Opções para roles e setores
const roleOptions = [
  { value: 'MASTER_ADMIN', label: 'Administrador Master' },
  { value: 'SECTOR_ADMIN', label: 'Administrador de Setor' },
  { value: 'SECTOR_OPERATOR', label: 'Operador de Setor' },
  { value: 'EMPLOYEE', label: 'Funcionário' },
];

const sectorOptions = [
  { value: 'RH', label: 'Recursos Humanos' },
  { value: 'TRIBUTOS', label: 'Tributos' },
  { value: 'LICITACAO', label: 'Licitação' },
  { value: 'OBRAS', label: 'Obras' },
];

export default function GerenciadorConvitesPage() {
  const { user } = useAuth();
  const [invites, setInvites] = useState<InviteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<InviteResponse | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  // Verificar se o usuário tem permissão
  useEffect(() => {
    if (user && !user.is_master_admin) {
      setErrorMessage('Você não tem permissão para acessar esta página.');
    }
  }, [user]);

  // Carregar convites
  useEffect(() => {
    if (user?.is_master_admin) {
      loadInvites();
    }
  }, [user]);

  const loadInvites = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getInvites();
      console.log('🔍 Dados recebidos da API:', data);
      console.log('🔍 Tipo dos dados:', typeof data);
      console.log('🔍 É array?', Array.isArray(data));
      
      // Garantir que data seja um array
      if (Array.isArray(data)) {
        setInvites(data);
      } else {
        console.error('❌ Formato de dados inesperado:', data);
        setInvites([]);
      }
    } catch (error) {
      console.error('Erro ao carregar convites:', error);
      setErrorMessage('Erro ao carregar convites.');
      setInvites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: InviteFormData) => {
    try {
      setIsSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      // Limpar sector_code se estiver vazio
      const inviteData = {
        ...data,
        sector_code: data.sector_code === '' ? undefined : data.sector_code
      };

      console.log('🔍 Dados sendo enviados:', inviteData);
      await apiClient.createInvite(inviteData);
      
      setSuccessMessage('Convite enviado com sucesso!');
      reset();
      setShowInviteForm(false);
      loadInvites(); // Recarregar lista
    } catch (error: any) {
      console.error('Erro ao criar convite:', error);
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setErrorMessage(error.response.data.non_field_errors[0]);
      } else {
        setErrorMessage('Erro ao enviar convite. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelInvite = async (inviteId: number) => {
    if (!confirm('Tem certeza que deseja cancelar este convite?')) return;
    
    try {
      await apiClient.cancelInvite(inviteId);
      setSuccessMessage('Convite cancelado com sucesso!');
      loadInvites();
    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      setErrorMessage('Erro ao cancelar convite.');
    }
  };

  const handleEditInvite = (invite: InviteResponse) => {
    setSelectedInvite(invite);
    setShowEditModal(true);
  };

  const handleUpdateInvite = async (data: InviteFormData) => {
    if (!selectedInvite) return;
    
    try {
      setIsSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      const inviteData = {
        ...data,
        sector_code: data.sector_code === '' ? undefined : data.sector_code
      };

      await apiClient.updateInvite(selectedInvite.id, inviteData);
      
      setSuccessMessage('Convite atualizado com sucesso!');
      setShowEditModal(false);
      setSelectedInvite(null);
      loadInvites();
    } catch (error: any) {
      console.error('Erro ao atualizar convite:', error);
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setErrorMessage(error.response.data.non_field_errors[0]);
      } else {
        setErrorMessage('Erro ao atualizar convite. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pendente
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Aceito
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Expirado
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getRoleDisplay = (roleCode: string) => {
    const role = roleOptions.find(r => r.value === roleCode);
    return role ? role.label : roleCode;
  };

  const getSectorDisplay = (sectorCode: string | null) => {
    if (!sectorCode) return 'Não definido';
    const sector = sectorOptions.find(s => s.value === sectorCode);
    return sector ? sector.label : sectorCode;
  };

  if (!user?.is_master_admin) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Apenas administradores gerais podem acessar esta página.
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Convites</h1>
              <p className="text-gray-600 mt-2">Visualize e gerencie convites enviados para novos usuários</p>
            </div>
            <button
              onClick={() => setShowInviteForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Novo Convite
            </button>
          </div>
        </div>

        {/* Mensagens de feedback */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Tabela de Convites */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Convites Enviados</h3>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Papel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Setor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expira em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invite.full_name}</div>
                          <div className="text-sm text-gray-500">{invite.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getRoleDisplay(invite.role_code)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getSectorDisplay(invite.sector_code)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invite.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invite.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invite.expires_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditInvite(invite)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar convite"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          {invite.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancelInvite(invite.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancelar convite"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Novo Convite */}
        {showInviteForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop com blur */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
              onClick={() => setShowInviteForm(false)}
            />
            
            {/* Modal com animação */}
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out scale-100 opacity-100">
                {/* Header com gradiente */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Novo Convite</h3>
                    <button
                      onClick={() => setShowInviteForm(false)}
                      className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Conteúdo */}
                <div className="px-6 py-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        {...register('full_name')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium placeholder-gray-500 hover:border-gray-400"
                        placeholder="Digite o nome completo"
                      />
                      {errors.full_name && (
                        <p className="text-red-600 text-xs mt-2">{errors.full_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium placeholder-gray-500 hover:border-gray-400"
                        placeholder="Digite o e-mail"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-2">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Papel
                      </label>
                      <select
                        {...register('role_code')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400"
                      >
                        <option value="">Selecione um papel</option>
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors.role_code && (
                        <p className="text-red-600 text-xs mt-2">{errors.role_code.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Setor (opcional)
                      </label>
                      <select
                        {...register('sector_code')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400"
                      >
                        <option value="">Selecione um setor</option>
                        {sectorOptions.map((sector) => (
                          <option key={sector.value} value={sector.value}>
                            {sector.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowInviteForm(false)}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Enviando...</span>
                          </div>
                        ) : (
                          'Enviar Convite'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Editar Convite */}
        {showEditModal && selectedInvite && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop com blur */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
              onClick={() => setShowEditModal(false)}
            />
            
            {/* Modal com animação */}
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out scale-100 opacity-100">
                {/* Header com gradiente */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Editar Convite</h3>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Conteúdo */}
                <div className="px-6 py-6">
                  <form onSubmit={handleSubmit(handleUpdateInvite)} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedInvite.full_name}
                        {...register('full_name')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400"
                      />
                      {errors.full_name && (
                        <p className="text-red-600 text-xs mt-2">{errors.full_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        defaultValue={selectedInvite.email}
                        {...register('email')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-2">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Papel
                      </label>
                      <select
                        defaultValue={selectedInvite.role_code}
                        {...register('role_code')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors.role_code && (
                        <p className="text-red-600 text-xs mt-2">{errors.role_code.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Setor (opcional)
                      </label>
                      <select
                        defaultValue={selectedInvite.sector_code || ''}
                        {...register('sector_code')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400"
                      >
                        <option value="">Selecione um setor</option>
                        {sectorOptions.map((sector) => (
                          <option key={sector.value} value={sector.value}>
                            {sector.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Salvando...</span>
                          </div>
                        ) : (
                          'Salvar Alterações'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
