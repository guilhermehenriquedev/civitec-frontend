'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Button from '@/components/buttons/Button';
import { WorkProgress, CreateUpdateProgress, WorkProject } from '@/types/obras';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUpdateProgress) => void;
  progress?: WorkProgress;
  projects: WorkProject[];
  loading?: boolean;
}

export function ProgressModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  progress, 
  projects,
  loading = false 
}: ProgressModalProps) {
  const [formData, setFormData] = useState<CreateUpdateProgress>({
    project: undefined as any,
    ref_month: '',
    physical_pct: 0,
    financial_pct: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (progress) {
      setFormData({
        project: progress.project,
        ref_month: progress.ref_month.substring(0, 7), // Converter YYYY-MM-DD para YYYY-MM
        physical_pct: progress.physical_pct,
        financial_pct: progress.financial_pct,
        notes: progress.notes
      });
    } else {
      setFormData({
        project: undefined as any,
        ref_month: '',
        physical_pct: 0,
        financial_pct: 0,
        notes: ''
      });
    }
    setErrors({});
  }, [progress]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.project || formData.project === undefined) {
      newErrors.project = 'Projeto é obrigatório';
    }

    if (!formData.ref_month) {
      newErrors.ref_month = 'Mês de referência é obrigatório';
    }

    if (formData.physical_pct < 0 || formData.physical_pct > 100) {
      newErrors.physical_pct = 'Progresso físico deve estar entre 0% e 100%';
    }

    if (formData.financial_pct < 0 || formData.financial_pct > 100) {
      newErrors.financial_pct = 'Progresso financeiro deve estar entre 0% e 100%';
    }

    // Validar se o mês não é futuro
    const selectedDate = new Date(formData.ref_month + '-01');
    const today = new Date();
    if (selectedDate > today) {
      newErrors.ref_month = 'Mês de referência não pode ser futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Converter ref_month de YYYY-MM para YYYY-MM-01 (data completa)
      const submitData = {
        ...formData,
        ref_month: formData.ref_month + '-01' // Adicionar dia para formar data completa
      };
      
      onSubmit(submitData);
    }
  };

  const handleInputChange = (field: keyof CreateUpdateProgress, value: any) => {
    let processedValue = value;
    
    // Garantir que project seja sempre um número válido
    if (field === 'project') {
      processedValue = value ? parseInt(value) : undefined;
    }
    
    // Garantir que as porcentagens sejam sempre números válidos
    if (field === 'physical_pct' || field === 'financial_pct') {
      processedValue = parseFloat(value) || 0;
      // Limitar a 100%
      if (processedValue > 100) processedValue = 100;
      if (processedValue < 0) processedValue = 0;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const projectOptions = projects.map(project => ({
    value: project.id.toString(),
    label: `${project.name} (${project.status_display})`
  }));

  // Gerar opções de mês para os últimos 36 meses
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 36; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7); // YYYY-MM
      const label = date.toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      });
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  // Função para formatar porcentagem
  const formatPercentage = (value: number) => {
    return Math.round(value * 100) / 100;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={progress ? 'Editar Progresso' : 'Novo Progresso'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          name="project"
          label="Projeto *"
          value={formData.project?.toString() || ''}
          onChange={(e) => handleInputChange('project', e.target.value ? parseInt(e.target.value) : undefined)}
          options={[{ value: '', label: 'Selecione um projeto' }, ...projectOptions]}
          error={errors.project}
          required
        />

        <Select
          name="ref_month"
          label="Mês de Referência *"
          value={formData.ref_month}
          onChange={(e) => handleInputChange('ref_month', e.target.value)}
          options={[{ value: '', label: 'Selecione o mês' }, ...monthOptions]}
          error={errors.ref_month}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              name="physical_pct"
              label="Progresso Físico (%) *"
              type="number"
              value={formData.physical_pct}
              onChange={(e) => handleInputChange('physical_pct', parseFloat(e.target.value) || 0)}
              error={errors.physical_pct}
              required
              min="0"
              max="100"
              step="0.01"
            />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${formData.physical_pct}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Progresso atual: {formatPercentage(formData.physical_pct)}%</p>
          </div>

          <div className="space-y-2">
            <Input
              name="financial_pct"
              label="Progresso Financeiro (%) *"
              type="number"
              value={formData.financial_pct}
              onChange={(e) => handleInputChange('financial_pct', parseFloat(e.target.value) || 0)}
              error={errors.financial_pct}
              required
              min="0"
              max="100"
              step="0.01"
            />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${formData.financial_pct}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Progresso atual: {formatPercentage(formData.financial_pct)}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Descreva o progresso realizado, desafios encontrados, próximos passos, etc."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
              transition-all duration-200 bg-white text-gray-900 font-medium 
              hover:border-gray-400 resize-none"
          />
        </div>

        {/* Resumo do progresso */}
        {formData.project && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Resumo do Progresso</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Físico:</span>
                <span className="ml-2 font-medium text-blue-900">{formatPercentage(formData.physical_pct)}%</span>
              </div>
              <div>
                <span className="text-blue-700">Financeiro:</span>
                <span className="ml-2 font-medium text-blue-900">{formatPercentage(formData.financial_pct)}%</span>
              </div>
            </div>
            {formData.physical_pct > formData.financial_pct && (
              <p className="text-xs text-blue-600 mt-2">
                ⚠️ Progresso físico maior que financeiro - verifique se há atrasos no pagamento
              </p>
            )}
            {formData.financial_pct > formData.physical_pct && (
              <p className="text-xs text-blue-600 mt-2">
                ⚠️ Progresso financeiro maior que físico - verifique se há adiantamentos
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {progress ? 'Atualizar' : 'Registrar'} Progresso
          </Button>
        </div>
      </form>
    </Modal>
  );
}
