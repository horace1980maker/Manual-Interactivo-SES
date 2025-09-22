
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { PrioritizedLivelihood, LivelihoodCharacterization } from '../../types';
import { CheckCircleIcon, ArrowRightIcon, ChevronLeftIcon, InformationCircleIcon, BeakerIcon } from '@heroicons/react/24/outline';

const SelectablePrioritizedCard: React.FC<{
  item: PrioritizedLivelihood;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isAvailable: boolean; // To visually distinguish already characterized items
}> = ({ item, isSelected, onSelect, isAvailable }) => {

  const cardClasses = isAvailable
    ? `p-3 border rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${isSelected ? 'border-[#009EE2] ring-2 ring-[#009EE2] bg-[#EBF5FF]' : 'border-gray-300 bg-white'}`
    : 'p-3 border border-gray-200 rounded-lg bg-gray-100 opacity-60 cursor-not-allowed';

  return (
    <div
      onClick={() => isAvailable && onSelect(item.id)}
      className={`${cardClasses} flex flex-col items-center text-center relative`}
      style={{ minHeight: '120px' }}
      title={isAvailable ? item.nombreMedioVida : `${item.nombreMedioVida} (ya asignado a un sistema)`}
    >
      {isSelected && isAvailable && (
        <CheckCircleIcon className="h-5 w-5 text-green-500 absolute top-1 right-1" />
      )}
      <div className="flex flex-col justify-center flex-grow">
          <h4 className={`font-semibold text-sm ${isAvailable ? 'text-[#001F89]' : 'text-gray-500'} leading-tight`}>
          {item.nombreMedioVida}
        </h4>
        <p className="text-xs text-gray-500 font-mono">({item.codigoMedioVida})</p>
      </div>
      <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200 w-full">Puntaje: <span className="font-bold">{item.total}</span></p>
    </div>
  );
};

export const Herramienta3_3_CaracterizacionMediosVida: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [initialPrioritizedLivelihoods, setInitialPrioritizedLivelihoods] = useState<PrioritizedLivelihood[] | null>(null);
  const [allCharacterizedSystems, setAllCharacterizedSystems] = useState<LivelihoodCharacterization[]>([]);
  const [selectedLivelihoodIdsForNewSystem, setSelectedLivelihoodIdsForNewSystem] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = location.state as {
      prioritizations?: PrioritizedLivelihood[];
      allCharacterizedSystems?: LivelihoodCharacterization[];
    } | null;

    if (state?.prioritizations && initialPrioritizedLivelihoods === null) {
      setInitialPrioritizedLivelihoods(state.prioritizations);
    }

    if (state?.allCharacterizedSystems) {
      setAllCharacterizedSystems(state.allCharacterizedSystems);
    }
    
    setSelectedLivelihoodIdsForNewSystem([]);
    setIsLoading(false);
  }, [location.state, initialPrioritizedLivelihoods]);


  const characterizedLivelihoodIds = useMemo(() => {
    return new Set(allCharacterizedSystems.flatMap(system => system.livelihoodIdsInSystem));
  }, [allCharacterizedSystems]);

  const availableLivelihoodsForSelection = useMemo(() => {
    if (!initialPrioritizedLivelihoods) return [];
    return initialPrioritizedLivelihoods.filter(l => !characterizedLivelihoodIds.has(l.id));
  }, [initialPrioritizedLivelihoods, characterizedLivelihoodIds]);


  const toggleSelectLivelihood = (id: string) => {
    if (characterizedLivelihoodIds.has(id)) return; 

    setSelectedLivelihoodIdsForNewSystem(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleProceedToCharacterization = () => {
    const selectedItems = initialPrioritizedLivelihoods?.filter(l => selectedLivelihoodIdsForNewSystem.includes(l.id)) || [];
    navigate('caracterizar', { 
      state: { 
        currentSystemItemsToCharacterize: selectedItems,
        initialPrioritizedLivelihoodsFromH32: initialPrioritizedLivelihoods,
        previouslyCharacterizedSystems: allCharacterizedSystems 
      } 
    });
  };
  
  if (isLoading) {
    return (
      <ToolCard title="Herramienta 3.3 - Caracterización de Medios de Vida">
        <p className="text-gray-700">Cargando datos...</p>
      </ToolCard>
    );
  }

  if (!initialPrioritizedLivelihoods) {
    return (
      <ToolCard 
        title="Herramienta 3.3 - Caracterización de Medios de Vida"
        objetivo="Definir Sistemas Productivos a partir de los medios de vida priorizados y caracterizar su tamaño, tenencia, importancia y cadena de valor."
      >
        <p className="text-gray-700 mb-4">
          No se han proporcionado medios de vida priorizados. Por favor, complete la Herramienta 3.2 y su resumen primero.
        </p>
        <Button onClick={() => navigate('/paso3/herramienta3_2')} variant="primary">
          <ChevronLeftIcon className="h-5 w-5 mr-2 inline-block" />
          Ir a Priorización de Medios de Vida (H3.2)
        </Button>
      </ToolCard>
    );
  }

  const allLivelihoodsCharacterized = availableLivelihoodsForSelection.length === 0 && initialPrioritizedLivelihoods.length > 0;

  return (
    <ToolCard 
      title="Herramienta 3.3 - Caracterización de Medios de Vida"
      objetivo="Definir Sistemas Productivos a partir de los medios de vida priorizados y caracterizar su tamaño, tenencia, importancia y cadena de valor."
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#001F89] mb-2">Paso 1: Agrupar Medios de Vida en Sistemas Productivos</h3>
        <p className="text-sm text-gray-600 mb-1">
          De los medios de vida priorizados en H3.2, seleccione aquellos que desee agrupar para formar un nuevo <strong>Sistema Productivo</strong>.
        </p>
        <p className="text-xs text-gray-500 mb-4">Los medios de vida ya asignados a un sistema se mostrarán atenuados.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          {initialPrioritizedLivelihoods.map(item => (
            <SelectablePrioritizedCard
              key={item.id}
              item={item}
              isSelected={selectedLivelihoodIdsForNewSystem.includes(item.id)}
              onSelect={toggleSelectLivelihood}
              isAvailable={!characterizedLivelihoodIds.has(item.id)}
            />
          ))}
        </div>

        {selectedLivelihoodIdsForNewSystem.length > 0 && (
          <div className="mt-4 p-3 bg-[#EBF5FF] rounded-md border border-[#009EE2]/20">
            <h4 className="font-semibold text-[#001F89]">Nuevo Sistema Productivo a Caracterizar:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {selectedLivelihoodIdsForNewSystem.map(id => {
                const item = initialPrioritizedLivelihoods.find(l => l.id === id);
                return <li key={id}>{item?.nombreMedioVida} ({item?.codigoMedioVida})</li>;
              })}
            </ul>
          </div>
        )}

        <div className="mt-6 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceedToCharacterization}
            disabled={selectedLivelihoodIdsForNewSystem.length === 0}
            aria-label="Formar y Caracterizar Nuevo Sistema Productivo"
          >
            Formar y Caracterizar Nuevo Sistema
            <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
          </Button>
        </div>
      </div>
      
      {allCharacterizedSystems.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-[#009EE2] mb-3">Sistemas Productivos Ya Definidos:</h3>
          <div className="space-y-3">
            {allCharacterizedSystems.map(system => (
              <div key={system.id} className="p-3 bg-green-50 border border-green-200 rounded-md shadow-sm">
                <p className="font-semibold text-green-700">
                  Sistema ID: <span className="font-mono">{system.sistemaProductivoId}</span>
                </p>
                <ul className="text-xs text-green-600 list-disc list-inside ml-4">
                  {system.livelihoodIdsInSystem.map(lvId => {
                    const livelihood = initialPrioritizedLivelihoods.find(l => l.id === lvId);
                    return <li key={lvId}>{livelihood?.nombreMedioVida || 'Desconocido'}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {initialPrioritizedLivelihoods.length > 0 && allLivelihoodsCharacterized && (
         <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 flex items-center">
            <InformationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <p className="text-sm">Todos los medios de vida priorizados han sido asignados a un sistema productivo. Puede proceder a la caracterización de ecosistemas.</p>
         </div>
      )}
      
      {allLivelihoodsCharacterized && (
        <div className="mt-10 pt-6 border-t border-gray-300 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/paso3/herramienta3_4')}
              aria-label="Proceder a Caracterización de Ecosistemas (H3.4)"
            >
              Proceder a Caracterización de Ecosistemas (H3.4)
              <BeakerIcon className="h-5 w-5 ml-2 inline-block" />
            </Button>
        </div>
      )}

    </ToolCard>
  );
};