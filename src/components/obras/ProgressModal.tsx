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
        ref_month: progress.ref_month,
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
      console.log('Dados do formulário antes do envio:', formData);
      console.log('Dados convertidos para envio:', submitData);
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
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const projectOptions = projects.map(project => ({
    value: project.id.toString(),
    label: project.name
  }));

  // Gerar opções de mês para os últimos 24 meses
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 24; i++) {
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
          <Input
            name="physical_pct"
            label="Progresso Físico (%) *"
            type="number"
            value={formData.physical_pct}
            onChange={(e) => handleInputChange('physical_pct', parseFloat(e.target.value) || 0)}
            error={errors.physical_pct}
            required
          />

          <Input
            name="financial_pct"
            label="Progresso Financeiro (%) *"
            type="number"
            value={formData.financial_pct}
            onChange={(e) => handleInputChange('financial_pct', parseFloat(e.target.value) || 0)}
            error={errors.financial_pct}
            required
          />
        </div>

        <Input
          name="notes"
          label="Observações"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Descreva o progresso realizado, desafios encontrados, etc."
        />

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
