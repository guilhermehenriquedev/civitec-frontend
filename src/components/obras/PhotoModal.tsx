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
  const [dragActive, setDragActive] = useState(false);

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
        taken_date: new Date().toISOString().split('T')[0], // Data atual como padrão
        location: ''
      });
      setPreviewUrl('');
    }
    setErrors({});
  }, [photo]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.project || formData.project === 0) {
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
    } else {
      // Validar se a data não é futura
      const selectedDate = new Date(formData.taken_date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.taken_date = 'Data da foto não pode ser futura';
      }
    }

    // Validar arquivo se for uma nova foto
    if (!photo && formData.photo.size > 0) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (formData.photo.size > maxSize) {
        newErrors.photo = 'Arquivo muito grande. Tamanho máximo: 10MB';
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(formData.photo.type)) {
        newErrors.photo = 'Tipo de arquivo não suportado. Use: JPG, PNG, GIF ou WebP';
      }
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
    if (file) {
      // Validar arquivo
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, photo: 'Arquivo muito grande. Tamanho máximo: 10MB' }));
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: 'Tipo de arquivo não suportado. Use: JPG, PNG, GIF ou WebP' }));
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const projectOptions = projects.map(project => ({
    value: project.id.toString(),
    label: `${project.name} (${project.address})`
  }));

  // Função para formatar tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={photo ? 'Editar Foto' : 'Nova Foto'} size="lg">
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
          placeholder="Ex: Fundação concluída, Estrutura em andamento, Acabamentos finais"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descreva o que a foto mostra, contexto da obra, detalhes importantes..."
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
              transition-all duration-200 bg-white text-gray-900 font-medium 
              hover:border-gray-400 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Foto {!photo && '*'}
          </label>
          
          {!photo && (
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors duration-200 ${
                dragActive 
                  ? 'border-indigo-400 bg-indigo-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <svg
                  className={`mx-auto h-12 w-12 ${
                    dragActive ? 'text-indigo-400' : 'text-gray-400'
                  }`}
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
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP até 10MB
                </p>
                {formData.photo.size > 0 && (
                  <p className="text-xs text-indigo-600">
                    Arquivo selecionado: {formData.photo.name} ({formatFileSize(formData.photo.size)})
                  </p>
                )}
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
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  title="Remover foto"
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
            type="date"
            value={formData.taken_date}
            onChange={(e) => handleInputChange('taken_date', e.target.value)}
            error={errors.taken_date}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          <Input
            name="location"
            label="Localização"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Ex: Canteiro de obras, Rua das Flores, Setor A"
          />
        </div>

        {/* Informações da foto */}
        {formData.photo.size > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Informações do Arquivo</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Nome:</span>
                <span className="ml-2">{formData.photo.name}</span>
              </div>
              <div>
                <span className="font-medium">Tamanho:</span>
                <span className="ml-2">{formatFileSize(formData.photo.size)}</span>
              </div>
              <div>
                <span className="font-medium">Tipo:</span>
                <span className="ml-2">{formData.photo.type || 'Não identificado'}</span>
              </div>
              <div>
                <span className="font-medium">Última modificação:</span>
                <span className="ml-2">
                  {new Date(formData.photo.lastModified).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
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
            {photo ? 'Atualizar' : 'Enviar'} Foto
          </Button>
        </div>
      </form>
    </Modal>
  );
}
