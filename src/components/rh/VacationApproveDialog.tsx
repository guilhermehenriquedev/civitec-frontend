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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Aprovação de Férias"
      size="sm"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Confirmar aprovação de férias
              </h3>
              <div className="mt-2 text-sm text-blue-700">
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
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Aprovando...
              </>
            ) : (
              'Aprovar Férias'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
