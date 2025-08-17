'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Schema de validação para validação do convite
const validateSchema = z.object({
  securityCode: z.string().min(6, 'Código deve ter pelo menos 6 caracteres'),
});

// Schema de validação para criação de senha
const createPasswordSchema = z.object({
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  passwordConfirm: z.string().min(8, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não coincidem",
  path: ["passwordConfirm"],
});

type ValidateFormData = z.infer<typeof validateSchema>;
type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

interface InviteInfo {
  valid: boolean;
  full_name: string;
  email_masked: string;
  role_display: string;
  sector_display: string;
  security_code?: string;  // Tornar opcional
}

export default function CriarSenhaPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [step, setStep] = useState<'validate' | 'create-password' | 'success' | 'error'>('validate');
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Formulário de validação
  const validateForm = useForm<ValidateFormData>({
    resolver: zodResolver(validateSchema),
  });

  // Formulário de criação de senha
  const createPasswordForm = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
  });

  // Verificar se há token na URL
  useEffect(() => {
    if (!token) {
      setError('Token de convite não encontrado na URL');
      setStep('error');
    }
  }, [token]);

  // Validar convite
  const onValidateSubmit = async (data: ValidateFormData) => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError('');
      
      const result = await apiClient.validateInvite(token, data.securityCode);
      setInviteInfo(result);
      setStep('create-password');
    } catch (error: any) {
      console.error('Erro ao validar convite:', error);
      
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else {
        setError('Erro ao validar convite. Verifique o código e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Criar senha
  const onCreatePasswordSubmit = async (data: CreatePasswordFormData) => {
    if (!token || !inviteInfo) return;

    try {
      setIsLoading(true);
      setError('');
      
      await apiClient.acceptInvite(token, inviteInfo.security_code || '', data.password, data.passwordConfirm);
      setStep('success');
    } catch (error: any) {
      console.error('Erro ao criar senha:', error);
      
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else {
        setError('Erro ao criar senha. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar erro
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro no Convite</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar sucesso
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Conta Criada com Sucesso!</h1>
            <p className="text-gray-600 mb-6">
              Sua senha foi definida e sua conta está ativa. Agora você pode fazer login no sistema.
            </p>
            <Link
              href="/login"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              CiviTec
            </h1>
            <p className="text-gray-600">
              {step === 'validate' ? 'Validar Convite' : 'Criar Senha de Acesso'}
            </p>
          </div>

          {/* Informações do convite (se disponível) */}
          {inviteInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Informações do Convite</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Nome:</strong> {inviteInfo.full_name}</p>
                <p><strong>E-mail:</strong> {inviteInfo.email_masked}</p>
                <p><strong>Papel:</strong> {inviteInfo.role_display}</p>
                <p><strong>Setor:</strong> {inviteInfo.sector_display}</p>
              </div>
            </div>
          )}

          {/* Formulário de validação */}
          {step === 'validate' && (
            <form onSubmit={validateForm.handleSubmit(onValidateSubmit)} className="space-y-6">
              <div>
                <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Segurança
                </label>
                <input
                  {...validateForm.register('securityCode')}
                  type="text"
                  id="securityCode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite o código de 6 dígitos"
                  maxLength={8}
                />
                {validateForm.formState.errors.securityCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {validateForm.formState.errors.securityCode.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validando...
                  </div>
                ) : (
                  'Validar Código'
                )}
              </button>
            </form>
          )}

          {/* Formulário de criação de senha */}
          {step === 'create-password' && (
            <form onSubmit={createPasswordForm.handleSubmit(onCreatePasswordSubmit)} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    {...createPasswordForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {createPasswordForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {createPasswordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    {...createPasswordForm.register('passwordConfirm')}
                    type={showPasswordConfirm ? 'text' : 'password'}
                    id="passwordConfirm"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswordConfirm ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {createPasswordForm.formState.errors.passwordConfirm && (
                  <p className="mt-1 text-sm text-red-600">
                    {createPasswordForm.formState.errors.passwordConfirm.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </div>
                ) : (
                  'Criar Senha e Ativar Conta'
                )}
              </button>
            </form>
          )}

          {/* Link para voltar */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
