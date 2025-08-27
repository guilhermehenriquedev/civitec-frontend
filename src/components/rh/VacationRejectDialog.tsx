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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Rejeitar Solicitação de Férias"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Rejeitar solicitação de férias
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Esta ação não pode ser desfeita.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Funcionário</label>
            <p className="mt-1 text-sm text-gray-900">{vacation.employee.nome_completo}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Período</label>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(vacation.period_start)} a {formatDate(vacation.period_end)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Dias Solicitados</label>
            <p className="mt-1 text-sm text-gray-900">{vacation.days_requested} dias</p>
          </div>

          <div>
            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700">
              Motivo da Rejeição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Digite o motivo da rejeição..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !rejectionReason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rejeitando...
              </>
            ) : (
              'Rejeitar Férias'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
