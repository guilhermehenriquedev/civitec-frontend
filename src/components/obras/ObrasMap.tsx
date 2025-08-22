'use client';

import { WorkProject } from '@/types/obras';
import dynamic from 'next/dynamic';

// Importação dinâmica do mapa para evitar problemas de SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  )
});

interface ObrasMapProps {
  projects: WorkProject[];
  onProjectClick?: (project: WorkProject) => void;
}

export function ObrasMap({ projects, onProjectClick }: ObrasMapProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Mapa das Obras</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Em Execução</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Concluída</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Planejamento</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4">
        <MapComponent 
          projects={projects} 
          onProjectClick={onProjectClick}
        />
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Projetos cadastrados:</strong> {projects.length} | 
          <strong>Com localização:</strong> {projects.filter(p => p.location_lat && p.location_lng).length}
        </p>
        <p className="text-xs mt-1">
          Clique nos marcadores para ver detalhes dos projetos
        </p>
      </div>
    </div>
  );
}


