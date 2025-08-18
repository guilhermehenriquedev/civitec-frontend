'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import Layout from '@/components/layout/Layout';
import { 
  UserIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Schema de validação para edição de usuários
const userEditSchema = z.object({
  role: z.string().min(1, 'Selecione um papel'),
  sector: z.string().optional(),
  is_active: z.boolean(),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

// Interface para usuário
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  sector: string | null;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

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

export default function GerenciadorUsuariosPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });

  // Verificar se o usuário tem permissão
  useEffect(() => {
    if (user && !user.is_master_admin) {
      setErrorMessage('Você não tem permissão para acessar esta página.');
    }
  }, [user]);

  // Carregar usuários
  useEffect(() => {
    if (user?.is_master_admin) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getUsers();
      console.log('🔍 Usuários recebidos da API:', data);
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('❌ Formato de dados inesperado:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setErrorMessage('Erro ao carregar usuários.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    reset({
      role: user.role,
      sector: user.sector || '',
      is_active: user.is_active,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (data: UserEditFormData) => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      const userData = {
        ...data,
        sector: data.sector === '' ? null : data.sector
      };

      await apiClient.updateUser(selectedUser.id, userData);
      
      setSuccessMessage('Usuário atualizado com sucesso!');
      setShowEditModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setErrorMessage(error.response.data.non_field_errors[0]);
      } else {
        setErrorMessage('Erro ao atualizar usuário. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
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

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Ativo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Inativo
        </span>
      );
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Usuários</h1>
              <p className="text-gray-600 mt-2">Visualize e gerencie usuários ativos no sistema</p>
            </div>
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

        {/* Tabela de Usuários */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Usuários do Sistema</h3>
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
                      Cadastrado em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.first_name} {userItem.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{userItem.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {getRoleDisplay(userItem.role)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {getSectorDisplay(userItem.sector)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(userItem.is_active)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(userItem.date_joined).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userItem.last_login 
                          ? new Date(userItem.last_login).toLocaleDateString('pt-BR')
                          : 'Nunca'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(userItem)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar usuário"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Editar Usuário */}
        {showEditModal && selectedUser && (
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
                    <h3 className="text-lg font-semibold text-white">Editar Usuário</h3>
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
                  {/* Informações do usuário */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedUser.first_name} {selectedUser.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Formulário */}
                  <form onSubmit={handleSubmit(handleUpdateUser)} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Papel
                      </label>
                      <select
                        defaultValue={selectedUser.role}
                        {...register('role')}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors.role && (
                        <p className="text-red-600 text-xs mt-2">{errors.role.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Setor (opcional)
                      </label>
                      <select
                        defaultValue={selectedUser.sector || ''}
                        {...register('sector')}
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

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        defaultChecked={selectedUser.is_active}
                        {...register('is_active')}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-900">
                        Usuário ativo
                      </label>
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
