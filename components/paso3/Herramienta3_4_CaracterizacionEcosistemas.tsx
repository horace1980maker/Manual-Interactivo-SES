
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { EcosystemItem, EcosystemCharacterization } from '../../types';
import { ChevronLeftIcon, CheckCircleIcon, ArrowRightIcon, InformationCircleIcon, BeakerIcon } from '@heroicons/react/24/outline';

const SESSION_STORAGE_INITIAL_ECOSYSTEMS_H34 = 'detailedEcosystemsForH34'; 
const SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34 = 'allCharacterizedEcosystemsH34';

const SelectableEcosystemCardH34: React.FC<{
  item: EcosystemItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isAvailable: boolean;
}> = ({ item, isSelected, onSelect, isAvailable }) => {

  const cardClasses = isAvailable
    ? `p-3 border rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${isSelected ? 'border-[#B71373] ring-2 ring-[#B71373] bg-[#FDF0F8]' : 'border-gray-300 bg-white'}`
    : 'p-3 border border-gray-200 rounded-lg bg-gray-100 opacity-60 cursor-not-allowed';
  
  return (
    <div
      onClick={() => isAvailable && onSelect(item.id)}
      className={`${cardClasses} flex flex-col items-center text-center relative justify-center`}
      title={isAvailable ? item.nombre : `${item.nombre} (ya caracterizado)`}
      style={{ minHeight: '100px' }}
    >
      {isSelected && isAvailable && (
        <CheckCircleIcon className="h-5 w-5 text-green-500 absolute top-1 right-1" />
      )}
      <div className="flex flex-col justify-center flex-grow">
        <h4 className={`font-semibold text-sm ${isAvailable ? 'text-[#B71373]' : 'text-gray-500'} leading-tight`}>
          {item.nombre}
        </h4>
        <p className="text-xs text-gray-500 font-mono mt-1">({item.codigo})</p>
      </div>
    </div>
  );
};

export const Herramienta3_4_CaracterizacionEcosistemas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to trigger useEffect on navigation to this page
  
  const [initialEcosystems, setInitialEcosystems] = useState<EcosystemItem[] | null>(null);
  const [allCharacterizedEcosystems, setAllCharacterizedEcosystems] = useState<EcosystemCharacterization[]>([]);
  const [selectedEcosystemId, setSelectedEcosystemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Load initial ecosystems selected in H3.1
      const storedInitialRaw = sessionStorage.getItem(SESSION_STORAGE_INITIAL_ECOSYSTEMS_H34);
      const currentInitialEcosystems: EcosystemItem[] = storedInitialRaw ? JSON.parse(storedInitialRaw) : [];
      setInitialEcosystems(currentInitialEcosystems);

      // Load previously characterized ecosystems
      const storedCharacterizedRaw = sessionStorage.getItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34);
      let previouslyCharacterized: EcosystemCharacterization[] = storedCharacterizedRaw ? JSON.parse(storedCharacterizedRaw) : [];

      // Reconcile: Keep only characterizations for ecosystems that are STILL in the currentInitialEcosystems list
      const currentInitialEcosystemIds = new Set(currentInitialEcosystems.map(eco => eco.id));
      const reconciledCharacterizedList = previouslyCharacterized.filter(charEco => 
          currentInitialEcosystemIds.has(charEco.ecosystemId)
      );

      setAllCharacterizedEcosystems(reconciledCharacterizedList);
      
      sessionStorage.setItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34, JSON.stringify(reconciledCharacterizedList));

    } catch (error) {
      console.error("Error processing H3.4 data from sessionStorage:", error);
      setInitialEcosystems([]);
      setAllCharacterizedEcosystems([]);
      sessionStorage.removeItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34); 
    }
    setIsLoading(false);
  }, [location.pathname]); 

  const characterizedEcosystemIds = useMemo(() => {
    return new Set(allCharacterizedEcosystems.map(eco => eco.ecosystemId));
  }, [allCharacterizedEcosystems]);

  const availableEcosystemsForSelection = useMemo(() => {
    if (!initialEcosystems) return [];
    return initialEcosystems.filter(eco => !characterizedEcosystemIds.has(eco.id));
  }, [initialEcosystems, characterizedEcosystemIds]);

  const handleSelectEcosystem = (id: string) => {
    if (characterizedEcosystemIds.has(id)) return;
    setSelectedEcosystemId(id === selectedEcosystemId ? null : id);
  };

  const handleProceedToCharacterizeDetail = () => {
    if (!selectedEcosystemId || !initialEcosystems) return;
    const ecosystemToCharacterize = initialEcosystems.find(eco => eco.id === selectedEcosystemId);
    if (ecosystemToCharacterize) {
      navigate('caracterizar', { 
        state: { 
          ecosystemToCharacterize,
        } 
      });
    }
  };
  
  if (isLoading) {
    return (
      <ToolCard title="Herramienta 3.4 - Caracterización de Ecosistemas">
        <p className="text-gray-700">Cargando datos de ecosistemas...</p>
      </ToolCard>
    );
  }

  if (!initialEcosystems || initialEcosystems.length === 0) {
    return (
      <ToolCard 
        title="Herramienta 3.4 - Caracterización de Ecosistemas"
        objetivo="Identificar los medios de vida y servicios ecosistémicos relacionados con cada ecosistema priorizado y analizar sus principales causas de degradación."
      >
        <p className="text-gray-700 mb-4">
          No se han seleccionado ecosistemas en la Herramienta 3.1. Por favor, complete la Herramienta 3.1 y su pantalla de detalles primero.
        </p>
        <Button onClick={() => navigate('/paso3/herramienta3_1')} variant="primary">
          <ChevronLeftIcon className="h-5 w-5 mr-2 inline-block" />
          Ir a Selección (H3.1)
        </Button>
      </ToolCard>
    );
  }

  const allEcosystemsEffectivelyCharacterized = availableEcosystemsForSelection.length === 0 && initialEcosystems.length > 0;

  return (
    <ToolCard 
      title="Herramienta 3.4 - Caracterización de Ecosistemas"
      objetivo="Identificar los medios de vida y servicios ecosistémicos relacionados con cada ecosistema priorizado y analizar sus principales causas de degradación."
    >
       <Button onClick={() => navigate('/paso3/herramienta3_3')} variant="outline" size="sm" className="mb-6">
        <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
        Volver a Caracterización de Medios de Vida (H3.3)
      </Button>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#B71373] mb-2">Paso 1: Seleccionar Ecosistema a Caracterizar</h3>
        <p className="text-sm text-gray-600 mb-1">
          De los ecosistemas identificados en H3.1, seleccione el que desea caracterizar.
        </p>
        <p className="text-xs text-gray-500 mb-4">Los ecosistemas ya caracterizados se mostrarán atenuados.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          {initialEcosystems.map(item => (
            <SelectableEcosystemCardH34
              key={item.id}
              item={item}
              isSelected={selectedEcosystemId === item.id}
              onSelect={handleSelectEcosystem}
              isAvailable={!characterizedEcosystemIds.has(item.id)}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceedToCharacterizeDetail}
            disabled={!selectedEcosystemId}
            aria-label="Caracterizar Ecosistema Seleccionado"
          >
            Caracterizar Ecosistema Seleccionado
            <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
          </Button>
        </div>
      </div>
      
      {allCharacterizedEcosystems.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-[#751851] mb-3">Ecosistemas Ya Caracterizados:</h3>
          <div className="space-y-3">
            {allCharacterizedEcosystems.map(charEco => {
              const ecoItem = initialEcosystems.find(e => e.id === charEco.ecosystemId);
              return (
                <div key={charEco.id} className="p-3 bg-green-50 border border-green-200 rounded-md shadow-sm">
                  <p className="font-semibold text-green-700">
                    {ecoItem?.nombre || 'Ecosistema Desconocido'} ({ecoItem?.codigo || 'N/A'})
                  </p>
                  <ul className="text-xs text-green-600 list-disc list-inside ml-4">
                    <li>Medios de Vida Rel.: {charEco.relatedLivelihoodCodes.join(', ') || 'Ninguno'}</li>
                    <li>Servicios Ecosistémicos Rel.: {charEco.relatedServicioEcosistemicoCodes.join(', ') || 'Ninguno'}</li>
                    <li>Causas Degradación: {charEco.causasDegradacion ? 'Detalladas' : 'No especificadas'}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {allEcosystemsEffectivelyCharacterized && (
         <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 flex items-center">
            <InformationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <p className="text-sm">Todos los ecosistemas seleccionados en H3.1 han sido caracterizados. Puede proceder al siguiente paso o volver a H3.1 si necesita ajustar la selección inicial.</p>
         </div>
      )}
      
      <div className="mt-10 pt-6 border-t border-gray-300 text-center">
          <Button
            variant={allEcosystemsEffectivelyCharacterized ? "primary" : "secondary"}
            size="lg"
            onClick={() => navigate('/paso3/herramienta3_5')} 
            aria-label="Proceder a Caracterización de Servicios Ecosistémicos (H3.5)"
          >
            Proceder a Caracterización de Servicios (H3.5)
            <BeakerIcon className="h-5 w-5 ml-2 inline-block" />
          </Button>
          {!allEcosystemsEffectivelyCharacterized && (
            <p className="text-xs text-gray-500 mt-2">
                (Puede proceder a H3.5 incluso si no ha caracterizado todos los ecosistemas actualmente seleccionados.)
            </p>
          )}
      </div>

    </ToolCard>
  );
};