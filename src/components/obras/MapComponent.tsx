'use client';

import { useEffect, useRef, useState } from 'react';
import { WorkProject } from '@/types/obras';

interface MapComponentProps {
  projects: WorkProject[];
  onProjectClick?: (project: WorkProject) => void;
}

export default function MapComponent({ projects, onProjectClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current || isMapLoaded) return;

      try {
        // Aguardar um pouco para garantir que o DOM esteja pronto
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verificar se o Leaflet já está disponível globalmente
        if (typeof window !== 'undefined' && (window as any).L) {
          const L = (window as any).L;
          initializeMap(L);
        } else {
          // Carregar Leaflet dinamicamente
          await loadLeafletScript();
        }
      } catch (error) {
        console.error('Erro ao carregar mapa:', error);
      }
    };

    loadMap();
  }, [isMapLoaded]);

  const loadLeafletScript = async () => {
    return new Promise<void>((resolve, reject) => {
      // Carregar CSS do Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.onload = () => {
        // Carregar JavaScript do Leaflet
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          const L = (window as any).L;
          if (L) {
            initializeMap(L);
            resolve();
          } else {
            reject(new Error('Leaflet não foi carregado corretamente'));
          }
        };
        script.onerror = reject;
        document.head.appendChild(script);
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  };

  const initializeMap = (L: any) => {
    if (!mapRef.current) return;

    try {
      // Coordenadas padrão (São Paulo)
      const defaultLat = -23.5505;
      const defaultLng = -46.6333;

      // Criar mapa
      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 12);

      // Adicionar tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Adicionar marcadores para projetos com coordenadas
      const projectsWithLocation = projects.filter(
        p => p.location_lat && p.location_lng
      );

      if (projectsWithLocation.length > 0) {
        const markers: any[] = [];

        projectsWithLocation.forEach(project => {
          const marker = L.marker([project.location_lat!, project.location_lng!])
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${project.name}</h3>
                <p class="text-xs text-gray-600">Status: ${project.status_display}</p>
                <p class="text-xs text-gray-600">Orçamento: R$ ${project.budget.toLocaleString()}</p>
                ${onProjectClick ? `<button class="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onclick="window.openProject(${project.id})">Ver Projeto</button>` : ''}
              </div>
            `);

          // Adicionar evento de clique
          if (onProjectClick) {
            marker.on('click', () => {
              onProjectClick(project);
            });
          }

          markers.push(marker);
        });

        // Ajustar view para mostrar todos os marcadores
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        // Adicionar função global para abrir projeto
        if (onProjectClick) {
          (window as any).openProject = (projectId: number) => {
            const project = projects.find(p => p.id === projectId);
            if (project) {
              onProjectClick(project);
            }
          };
        }
      }

      setIsMapLoaded(true);
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg"
      style={{ minHeight: '400px' }}
    >
      {!isMapLoaded && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}
