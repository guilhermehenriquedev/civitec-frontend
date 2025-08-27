'use client';

import React, { useState } from 'react';
import Modal from '@/components/modals/Modal';

interface VacationRejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
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

export default function VacationRejectDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  vacation, 
  loading = false 
}: VacationRejectDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('');

  if (!vacation) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason.trim());
      setRejectionReason('');
    }
  };

  const handleClose = () => {
    setRejectionReason('');
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={handleClose}
        disabled={loading}
        className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="reject-form"
        disabled={loading || !rejectionReason.trim()}
        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Rejeitando...</span>
          </div>
        ) : (
          'Confirmar Rejeição'
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Rejeitar Solicitação de Férias"
      size="md"
      footer={footer}
    >
      <form id="reject-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Informações da solicitação - EXATAMENTE igual a Gerenciar Usuários */}
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Rejeitar solicitação de férias</p>
              <p className="text-sm text-red-700">Esta ação não pode ser desfeita.</p>
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

          <div>
            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo da Rejeição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 font-medium hover:border-gray-400 resize-none"
              placeholder="Descreva o motivo da rejeição..."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
