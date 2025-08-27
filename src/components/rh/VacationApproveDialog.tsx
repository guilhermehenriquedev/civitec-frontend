'use client';

import React from 'react';
import Modal from '@/components/modals/Modal';

interface VacationApproveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vacation: {
    employee: {
      nome_completo: string;
    };
    period_start: string;
    period_end: string;
    days_requested: number;
  } | null;
  loading?: boolean;
}

export default function VacationApproveDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  vacation, 
  loading = false 
}: VacationApproveDialogProps) {
  if (!vacation) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Aprovando...</span>
          </div>
        ) : (
          'Confirmar Aprovação'
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Aprovação de Férias"
      size="md"
      footer={footer}
    >
      {/* Informações da solicitação - EXATAMENTE igual a Gerenciar Usuários */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Confirmar aprovação de férias</p>
            <p className="text-sm text-green-700">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
      </div>

      {/* Detalhes da solicitação */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Funcionário</label>
          <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{vacation.employee.nome_completo}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
          <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">
            {formatDate(vacation.period_start)} a {formatDate(vacation.period_end)}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dias Solicitados</label>
          <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{vacation.days_requested} dias</p>
        </div>
      </div>
    </Modal>
  );
}
