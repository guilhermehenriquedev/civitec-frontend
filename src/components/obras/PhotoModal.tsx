'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Button from '@/components/buttons/Button';
import { WorkPhoto, CreateUpdatePhoto, WorkProject } from '@/types/obras';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUpdatePhoto) => void;
  photo?: WorkPhoto;
  projects: WorkProject[];
  loading?: boolean;
}

export function PhotoModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  photo, 
  projects,
  loading = false 
}: PhotoModalProps) {
  const [formData, setFormData] = useState<CreateUpdatePhoto>({
    project: 0,
    title: '',
    description: '',
    photo: new File([], ''),
    taken_date: '',
    location: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (photo) {
      setFormData({
        project: photo.project,
        title: photo.title,
        description: photo.description,
        photo: new File([], ''),
        taken_date: photo.taken_date,
        location: photo.location
      });
      setPreviewUrl(photo.photo);
    } else {
      setFormData({
        project: 0,
        title: '',
        description: '',
        photo: new File([], ''),
        taken_date: '',
        location: ''
      });
      setPreviewUrl('');
    }
    setErrors({});
  }, [photo]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.project) {
      newErrors.project = 'Projeto é obrigatório';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!photo && !formData.photo.size) {
      newErrors.photo = 'Foto é obrigatória';
    }

    if (!formData.taken_date) {
      newErrors.taken_date = 'Data da foto é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateUpdatePhoto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (file: File) => {
    setFormData(prev => ({ ...prev, photo: file }));
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    
    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const projectOptions = projects.map(project => ({
    value: project.id.toString(),
    label: project.name
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={photo ? 'Editar Foto' : 'Nova Foto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          name="project"
          label="Projeto *"
          value={formData.project.toString()}
          onChange={(e) => handleInputChange('project', parseInt(e.target.value))}
          options={[{ value: '0', label: 'Selecione um projeto' }, ...projectOptions]}
          error={errors.project}
          required
        />

        <Input
          name="title"
          label="Título *"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          required
          placeholder="Ex: Fundação concluída, Estrutura em andamento"
        />

        <Input
          name="description"
          label="Descrição"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descreva o que a foto mostra"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Foto {!photo && '*'}
          </label>
          
          {!photo && (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photo-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Carregar arquivo</span>
                    <input
                      id="photo-upload"
                      name="photo-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileChange(file);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
              </div>
            </div>
          )}

          {errors.photo && (
            <p className="text-sm text-red-600">{errors.photo}</p>
          )}
        </div>

        {previewUrl && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Prévia da Foto
            </label>
            <div className="relative">
              <img
                src={previewUrl}
                alt="Prévia"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              {!photo && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, photo: new File([], '') }));
                    setPreviewUrl('');
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="taken_date"
            label="Data da Foto *"
            type="text"
            value={formData.taken_date}
            onChange={(e) => handleInputChange('taken_date', e.target.value)}
            error={errors.taken_date}
            required
            placeholder="YYYY-MM-DD"
          />

          <Input
            name="location"
            label="Localização"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Ex: Canteiro de obras, Rua das Flores"
          />
        </div>

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
            {photo ? 'Atualizar' : 'Enviar'} Foto
          </Button>
        </div>
      </form>
    </Modal>
  );
}
