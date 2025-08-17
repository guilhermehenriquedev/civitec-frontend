'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { EyeIcon, EyeSlashIcon, BuildingOfficeIcon, MapIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data);
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Tratar diferentes tipos de erro
      if (error.response?.status === 401) {
        setError('root', {
          message: 'E-mail ou senha incorretos. Verifique suas credenciais.',
        });
      } else if (error.response?.data?.detail) {
        setError('root', {
          message: error.response.data.detail,
        });
      } else if (error.response?.data?.non_field_errors) {
        setError('root', {
          message: error.response.data.non_field_errors[0],
        });
      } else if (error.message) {
        setError('root', {
          message: error.message,
        });
      } else {
        setError('root', {
          message: 'Erro ao fazer login. Verifique sua conexão e tente novamente.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background com formas geométricas */}
      <div className="absolute inset-0">
        {/* Círculos decorativos */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Formas geométricas */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 transform rotate-45 opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-pink-400 transform -rotate-12 opacity-20"></div>
        
        {/* Silhueta de cidade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800/20 to-transparent">
          <div className="flex justify-center space-x-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-16 bg-gray-800/30 rounded-t-lg"
                style={{ height: `${20 + (i * 2)}px` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Card de login */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CiviTec
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Inovação pública, gestão sem papel
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo de e-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Campo de senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Sua senha"
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Erro geral */}
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              {/* Botão de login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar no Sistema'
                )}
              </button>
            </form>

            {/* Links adicionais */}
            <div className="mt-6 text-center">
              <a
                href="/convite/criar-senha"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Recebeu um convite? Criar senha
              </a>
            </div>
          </div>

          {/* Badges de funcionalidades */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                Prefeituras
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <MapIcon className="w-3 h-3 mr-1" />
                RH
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <DocumentTextIcon className="w-3 h-3 mr-1" />
                Tributos
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <DocumentTextIcon className="w-3 h-3 mr-1" />
                Licitação
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                Obras
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animações CSS */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
