'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WorkProject } from '@/types/obras';

interface MapComponentProps {
  projects: WorkProject[];
  onProjectClick?: (project: WorkProject) => void;
}

interface MapInstance {
  map: any;
  markers: any[];
  layerGroup: any;
}

export default function MapComponent({ projects, onProjectClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapInstance | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar o Leaflet
  const loadLeaflet = useCallback(async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Verificar se o Leaflet já está disponível
      if (typeof window !== 'undefined' && (window as any).L) {
        resolve((window as any).L);
        return;
      }

      // Verificar se estamos no browser
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject(new Error('Leaflet só pode ser carregado no browser'));
        return;
      }

      let cssLoaded = false;
      let jsLoaded = false;
      let hasError = false;

      // Função para verificar se tudo foi carregado
      const checkComplete = () => {
        if (cssLoaded && jsLoaded && !hasError) {
          const L = (window as any).L;
          if (L) {
            resolve(L);
          } else {
            reject(new Error('Leaflet não foi carregado corretamente'));
          }
        }
      };

      // Carregar CSS do Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBgI1+Uc+N9Y4uQNc8X3WRz/RiIFhtXn6Peo=';
      link.crossOrigin = 'anonymous';
      
      link.onload = () => {
        cssLoaded = true;
        checkComplete();
      };
      
      link.onerror = () => {
        console.warn('Erro ao carregar CSS do Leaflet, tentando sem CSS...');
        cssLoaded = true; // Continuar mesmo sem CSS
        checkComplete();
      };

      // Carregar JavaScript do Leaflet
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGfu2/6Yv2HoRJ1JNqzrzbW+Y=';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        jsLoaded = true;
        checkComplete();
      };
      
      script.onerror = () => {
        hasError = true;
        reject(new Error('Erro ao carregar script do Leaflet'));
      };

      // Adicionar elementos ao DOM
      try {
        document.head.appendChild(link);
        document.head.appendChild(script);
      } catch (error) {
        hasError = true;
        reject(new Error(`Erro ao adicionar elementos ao DOM: ${error}`));
      }
    });
  }, []);

  // Função para inicializar o mapa
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      setIsLoading(true);
      setMapError(null);

      // Aguardar um pouco para garantir que o DOM esteja pronto
      await new Promise(resolve => setTimeout(resolve, 100));

      const L = await loadLeaflet();
      
      // Verificar se o Leaflet foi carregado corretamente
      if (!L || !L.map) {
        throw new Error('Leaflet não foi carregado corretamente');
      }
      
      // Coordenadas padrão (São Paulo)
      const defaultLat = -23.5505;
      const defaultLng = -46.6333;

      // Criar mapa
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true
      }).setView([defaultLat, defaultLng], 12);

      // Armazenar referência do mapa
      mapInstanceRef.current = {
        map,
        markers: [],
        layerGroup: null
      };

      // Adicionar tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 3
      }).addTo(map);

      // Adicionar tile layer alternativo (Satellite)
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19,
        minZoom: 3
      });

      // Controle de camadas
      const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          minZoom: 3
        }),
        "Satellite": satelliteLayer
      };

      L.control.layers(baseMaps).addTo(map);

      // Adicionar marcadores para projetos com coordenadas
      const projectsWithLocation = projects.filter(
        p => p.location_lat && p.location_lng
      );

      const markers: any[] = [];
      const layerGroup = L.layerGroup();
      layerGroup.addTo(map);

      if (projectsWithLocation.length > 0) {
        projectsWithLocation.forEach(project => {
          // Definir cor do marcador baseado no status
          const getMarkerColor = (status: string) => {
            switch (status) {
              case 'EXECUCAO': return '#f59e0b'; // Amarelo
              case 'CONCLUIDA': return '#10b981'; // Verde
              case 'PLANEJAMENTO': return '#3b82f6'; // Azul
              case 'LICITACAO': return '#8b5cf6'; // Roxo
              case 'PARALISADA': return '#ef4444'; // Vermelho
              case 'CANCELADA': return '#6b7280'; // Cinza
              default: return '#3b82f6'; // Azul padrão
            }
          };

          const getMarkerIcon = (status: string) => {
            const color = getMarkerColor(status);
            return L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  background-color: ${color};
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  cursor: pointer;
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
          };

          const marker = L.marker([project.location_lat!, project.location_lng!], {
            icon: getMarkerIcon(project.status)
          }).addTo(layerGroup);

          // Criar popup com informações do projeto
          const popupContent = `
            <div class="p-3 min-w-[250px]">
              <h3 class="font-semibold text-sm text-gray-900 mb-2">${project.name}</h3>
              <div class="space-y-1 text-xs text-gray-600">
                <p><strong>Status:</strong> ${project.status_display}</p>
                <p><strong>Endereço:</strong> ${project.address}</p>
                <p><strong>Orçamento:</strong> R$ ${project.budget.toLocaleString()}</p>
                <p><strong>Progresso Físico:</strong> ${project.progress_physical || 0}%</p>
                <p><strong>Progresso Financeiro:</strong> ${project.progress_financial || 0}%</p>
                ${project.contract_details?.number ? `<p><strong>Contrato:</strong> ${project.contract_details.number}</p>` : ''}
              </div>
              ${onProjectClick ? `<button class="mt-3 w-full text-xs bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors" onclick="window.openProject(${project.id})">Ver Detalhes</button>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
          });

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
      } else {
        // Se não há projetos com localização, mostrar mensagem
        const infoDiv = L.control({ position: 'topright' });
        infoDiv.onAdd = () => {
          const div = L.DomUtil.create('div', 'info-legend');
          div.innerHTML = `
            <div class="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
              <h4 class="font-medium text-gray-900 mb-2">Informações</h4>
              <p class="text-sm text-gray-600">Nenhum projeto com localização cadastrada</p>
              <p class="text-xs text-gray-500 mt-1">Adicione coordenadas aos projetos para visualizá-los no mapa</p>
            </div>
          `;
          return div;
        };
        infoDiv.addTo(map);
      }

      // Salvar instância do mapa
      mapInstanceRef.current = {
        map,
        markers,
        layerGroup
      };

      setIsMapLoaded(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      setMapError('Erro ao carregar o mapa. Tente recarregar a página.');
      setIsLoading(false);
    }
  }, [projects, onProjectClick, loadLeaflet]);

  // Função para limpar o mapa
  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      const { map, layerGroup } = mapInstanceRef.current;
      if (layerGroup) {
        map.removeLayer(layerGroup);
      }
      if (map) {
        map.remove();
      }
      mapInstanceRef.current = null;
    }
    setIsMapLoaded(false);
  }, []);

  // Inicializar mapa quando o componente montar
  useEffect(() => {
    initializeMap();

    // Cleanup quando o componente desmontar
    return () => {
      cleanupMap();
    };
  }, [initializeMap, cleanupMap]);

  // Recarregar mapa quando os projetos mudarem
  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current) {
      cleanupMap();
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [projects, isMapLoaded, cleanupMap, initializeMap]);

  // Função para recarregar o mapa
  const handleReloadMap = () => {
    cleanupMap();
    setMapError(null);
    initializeMap();
  };

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar mapa</h3>
          <p className="text-gray-600 mb-4">{mapError}</p>
          <button
            onClick={handleReloadMap}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controles do mapa */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
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
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Licitação</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Paralisada</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReloadMap}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            title="Recarregar mapa"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Container do mapa */}
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200 overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>

      {/* Informações do mapa */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="font-medium text-gray-900">{projects.length}</p>
            <p className="text-gray-600">Total de Projetos</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">
              {projects.filter(p => p.location_lat && p.location_lng).length}
            </p>
            <p className="text-gray-600">Com Localização</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">
              {projects.filter(p => p.status === 'EXECUCAO').length}
            </p>
            <p className="text-gray-600">Em Execução</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Clique nos marcadores para ver detalhes dos projetos
        </p>
      </div>

      {/* Estilos CSS para o mapa */}
      <style jsx>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }
        
        .info-legend {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
