'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import { Assessment, Taxpayer } from '@/types/tributos';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment?: Assessment | null;
  taxpayers: Taxpayer[];
  onSubmit: (data: Partial<Assessment>) => Promise<void>;
  loading?: boolean;
}

export default function AssessmentModal({
  isOpen,
  onClose,
  assessment,
  taxpayers,
  onSubmit,
  loading = false
}: AssessmentModalProps) {
  const [formData, setFormData] = useState<Partial<Assessment>>({
    taxpayer_id: 0,
    tax_kind: 'ISS',
    competence: '',
    principal: 0,
    multa: 0,
    juros: 0,
    status: 'PENDENTE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (assessment) {
      setFormData({
        taxpayer_id: assessment.taxpayer_id,
        tax_kind: assessment.tax_kind,
        competence: assessment.competence,
        principal: assessment.principal,
        multa: assessment.multa,
        juros: assessment.juros,
        status: assessment.status
      });
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      
      setFormData({
        taxpayer_id: 0,
        tax_kind: 'ISS',
        competence: `${year}-${month}`,
        principal: 0,
        multa: 0,
        juros: 0,
        status: 'PENDENTE'
      });
    }
    setErrors({});
  }, [assessment]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.taxpayer_id) {
      newErrors.taxpayer_id = 'Contribuinte é obrigatório';
    }

    if (!formData.tax_kind) {
      newErrors.tax_kind = 'Tipo de tributo é obrigatório';
    }

    if (!formData.competence) {
      newErrors.competence = 'Competência é obrigatória';
    }

    if (!formData.principal || formData.principal <= 0) {
      newErrors.principal = 'Valor principal deve ser maior que zero';
    }

    if (formData.multa && formData.multa < 0) {
      newErrors.multa = 'Multa não pode ser negativa';
    }

    if (formData.juros && formData.juros < 0) {
      newErrors.juros = 'Juros não podem ser negativos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    }
  };

  const title = assessment ? 'Editar Avaliação' : 'Nova Avaliação';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contribuinte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contribuinte *
          </label>
          <select
            value={formData.taxpayer_id || ''}
            onChange={(e) => handleInputChange('taxpayer_id', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.taxpayer_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione um contribuinte</option>
            {taxpayers.map((taxpayer) => (
              <option key={taxpayer.id} value={taxpayer.id}>
                {taxpayer.name} - {taxpayer.doc}
              </option>
            ))}
          </select>
          {errors.taxpayer_id && (
            <p className="mt-1 text-sm text-red-600">{errors.taxpayer_id}</p>
          )}
        </div>

        {/* Tipo de Tributo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Tributo *
          </label>
          <select
            value={formData.tax_kind || 'ISS'}
            onChange={(e) => handleInputChange('tax_kind', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.tax_kind ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="ISS">ISS</option>
            <option value="IPTU">IPTU</option>
            <option value="ITBI">ITBI</option>
            <option value="OUTROS">Outros</option>
          </select>
          {errors.tax_kind && (
            <p className="mt-1 text-sm text-red-600">{errors.tax_kind}</p>
          )}
        </div>

        {/* Competência */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Competência *
          </label>
          <input
            type="month"
            value={formData.competence || ''}
            onChange={(e) => handleInputChange('competence', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.competence ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.competence && (
            <p className="mt-1 text-sm text-red-600">{errors.competence}</p>
          )}
        </div>

        {/* Valor Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Principal (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={formData.principal || ''}
            onChange={(e) => handleInputChange('principal', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.principal ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0,00"
          />
          {errors.principal && (
            <p className="mt-1 text-sm text-red-600">{errors.principal}</p>
          )}
        </div>

        {/* Multa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Multa (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.multa || ''}
            onChange={(e) => handleInputChange('multa', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.multa ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0,00"
          />
          {errors.multa && (
            <p className="mt-1 text-sm text-red-600">{errors.multa}</p>
          )}
        </div>

        {/* Juros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Juros (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.juros || ''}
            onChange={(e) => handleInputChange('juros', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.juros ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0,00"
          />
          {errors.juros && (
            <p className="mt-1 text-sm text-red-600">{errors.juros}</p>
          )}
        </div>

        {/* Total Calculado */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Calculado
          </label>
          <p className="text-lg font-semibold text-gray-900">
            R$ {((formData.principal || 0) + (formData.multa || 0) + (formData.juros || 0)).toFixed(2)}
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status || 'PENDENTE'}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="PENDENTE">Pendente</option>
            <option value="EMITIDA">Emitida</option>
            <option value="PAGA">Paga</option>
            <option value="VENCIDA">Vencida</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : (assessment ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
