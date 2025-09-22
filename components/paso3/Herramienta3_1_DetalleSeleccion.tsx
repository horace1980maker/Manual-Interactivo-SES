
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { DetailedItemCard } from '../common/DetailedItemCard';
import { LivelihoodItem, EcosystemItem } from '../../types';
import { ArrowRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const SESSION_STORAGE_DETAILED_LIVELIHOODS = 'detailedLivelihoodsForH34';
const SESSION_STORAGE_DETAILED_ECOSYSTEMS = 'detailedEcosystemsForH34';

export const Herramienta3_1_DetalleSeleccion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedLivelihoods: initialLivelihoods, selectedEcosystems: initialEcosystems } = location.state || { selectedLivelihoods: [], selectedEcosystems: [] };

  const [detailedLivelihoods, setDetailedLivelihoods] = useState<LivelihoodItem[]>([]);
  const [detailedEcosystems, setDetailedEcosystems] = useState<EcosystemItem[]>([]);

  useEffect(() => {
    // Priority 1: Data passed from H3.1 selection screen via navigation state.
    // This ensures that any new selection (even an empty one) overrides old persisted data.
    if (location.state) {
        setDetailedLivelihoods(initialLivelihoods || []);
        setDetailedEcosystems(initialEcosystems || []);
    } else {
        // Priority 2: Fallback to session storage if no data is passed (e.g., on page refresh).
        try {
            const storedLivelihoodsRaw = sessionStorage.getItem(SESSION_STORAGE_DETAILED_LIVELIHOODS);
            setDetailedLivelihoods(storedLivelihoodsRaw ? JSON.parse(storedLivelihoodsRaw) : []);

            const storedEcosystemsRaw = sessionStorage.getItem(SESSION_STORAGE_DETAILED_ECOSYSTEMS);
            setDetailedEcosystems(storedEcosystemsRaw ? JSON.parse(storedEcosystemsRaw) : []);
        } catch(e) {
            console.error("Error loading detailed data from sessionStorage.", e);
            setDetailedLivelihoods([]);
            setDetailedEcosystems([]);
        }
    }
  }, [initialLivelihoods, initialEcosystems, location.state]);

  const updateLivelihoodDetail = (id: string, detail: 'isAutoconsumo' | 'isComercial', value: boolean) => {
    const newLivelihoods = detailedLivelihoods.map(item => 
      item.id === id ? { ...item, [detail]: value } : item
    );
    setDetailedLivelihoods(newLivelihoods);
  };
  
  const updateEcosystemHealth = (id: string, health: 1 | 2 | 3) => {
    const newEcosystems = detailedEcosystems.map(item => 
      item.id === id ? { ...item, salud: health } : item
    );
    setDetailedEcosystems(newEcosystems);
  };

  const handleProceedToPrioritization = () => {
    // Save detailed data to session storage for later use (e.g., in H3.4)
    sessionStorage.setItem(SESSION_STORAGE_DETAILED_LIVELIHOODS, JSON.stringify(detailedLivelihoods));
    sessionStorage.setItem(SESSION_STORAGE_DETAILED_ECOSYSTEMS, JSON.stringify(detailedEcosystems));
    
    // Prepare data for H3.2 (only livelihoods are prioritized)
    const livelihoodsToPrioritize = detailedLivelihoods.map(l => ({
        id: l.id,
        nombreMedioVida: l.nombre,
        codigoMedioVida: l.codigo,
        productosPrincipales: '',
        seguridadAlimentaria: 0,
        area: 0,
        desarrolloLocal: 0,
        ambiente: 0,
        inclusion: 0,
        total: 0,
    }));
    
    navigate('/paso3/herramienta3_2', { state: { livelihoodsToPrioritize } });
  };
  
  const hasLivelihoods = detailedLivelihoods && detailedLivelihoods.length > 0;
  const hasEcosystems = detailedEcosystems && detailedEcosystems.length > 0;

  if (!hasLivelihoods && !hasEcosystems) {
    return (
        <ToolCard title="H3.1 - Especificar Detalles">
            <p className="text-gray-700 mb-4">No se han seleccionado medios de vida o ecosistemas. Por favor, vuelva al paso anterior.</p>
            <Button onClick={() => navigate('/paso3/herramienta3_1')} variant="primary">
              <ChevronLeftIcon className="h-5 w-5 mr-2 inline-block" />
              Volver a Selección
            </Button>
        </ToolCard>
    );
  }

  return (
    <ToolCard 
      title="H3.1 - Especificar Detalles"
      objetivo="Añadir detalles clave a los medios de vida y ecosistemas seleccionados, como su tipo de uso y nivel de salud."
    >
      <Button onClick={() => navigate('/paso3/herramienta3_1')} variant="outline" size="sm" className="mb-6">
        <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
        Volver a Selección
      </Button>

      {hasLivelihoods && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#001F89] mb-3">Detallar Medios de Vida Seleccionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailedLivelihoods.map(item => (
              <DetailedItemCard
                key={item.id}
                item={item}
                onUpdateLivelihoodDetail={updateLivelihoodDetail}
              />
            ))}
          </div>
        </div>
      )}

      {hasEcosystems && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#001F89] mb-3">Detallar Ecosistemas Seleccionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailedEcosystems.map(item => (
              <DetailedItemCard
                key={item.id}
                item={item}
                onUpdateEcosystemHealth={updateEcosystemHealth}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-gray-300 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleProceedToPrioritization}
          disabled={!hasLivelihoods} // Can only prioritize livelihoods
          title={!hasLivelihoods ? "Se requiere al menos un Medio de Vida para priorizar." : ""}
        >
          Proceder a Priorización (H3.2)
          <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
        </Button>
      </div>
    </ToolCard>
  );
};
