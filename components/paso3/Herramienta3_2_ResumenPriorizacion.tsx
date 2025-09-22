
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { PrioritizedLivelihood } from '../../types';
import { ChevronLeftIcon, StarIcon, ArrowRightIcon } from '@heroicons/react/24/solid'; 

const SESSION_KEY_H32_PRIORITIZED_LIVELIHOODS = 'prioritizedLivelihoods_H32'; // Consistent key

export const Herramienta3_2_ResumenPriorizacion: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const prioritizationsFromState = location.state?.prioritizations as PrioritizedLivelihood[] | undefined;

  const sortedPrioritizations = useMemo(() => {
    if (!prioritizationsFromState) return [];
    return [...prioritizationsFromState].sort((a, b) => b.total - a.total);
  }, [prioritizationsFromState]);

  if (!prioritizationsFromState || prioritizationsFromState.length === 0) {
    return (
      <ToolCard title="Resumen de Priorización de Medios de Vida">
        <p className="text-gray-700 mb-4">
          No hay datos de priorización disponibles. Por favor, complete la Herramienta 3.2 primero.
        </p>
        <Button onClick={() => navigate('/paso3/herramienta3_2', { state: { prioritizations: prioritizationsFromState } })} variant="primary">
          <ChevronLeftIcon className="h-5 w-5 mr-2 inline-block" />
          Volver a Priorización (H3.2)
        </Button>
      </ToolCard>
    );
  }

  const handleProceedToCharacterization = () => {
    try {
      // Save the sorted list to sessionStorage for H4.2.1
      sessionStorage.setItem(SESSION_KEY_H32_PRIORITIZED_LIVELIHOODS, JSON.stringify(sortedPrioritizations));
    } catch (error) {
      console.error("Error saving prioritized livelihoods to sessionStorage:", error);
      // Optionally alert the user or handle the error
    }
    // Navigate to H3.3 with the sorted prioritizations in state for H3.3's direct use
    navigate('/paso3/herramienta3_3', { state: { prioritizations: sortedPrioritizations } });
  };

  return (
    <ToolCard 
      title="Resumen de Priorización de Medios de Vida"
      objetivo="Visualizar los medios de vida priorizados ordenados por su puntaje total, de mayor a menor."
    >
      <Button 
        onClick={() => navigate('/paso3/herramienta3_2', { state: { prioritizations: prioritizationsFromState } })} 
        variant="outline" 
        size="sm" 
        className="mb-6"
      >
        <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
        Volver a Editar Priorización (H3.2)
      </Button>

      <div className="space-y-4">
        {sortedPrioritizations.map((item, index) => {
          return (
            <div 
              key={item.id} 
              className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#EBF5FF] border border-[#001F89]/30 rounded-full flex items-center justify-center text-xl font-bold text-[#001F89] mr-4">
                {index + 1}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-[#001F89]">
                  {item.nombreMedioVida}
                </h3>
                <p className="text-sm text-gray-500 font-mono">
                  Código: {item.codigoMedioVida}
                </p>
              </div>
              <div className="ml-auto text-right flex flex-col items-end">
                <p className="text-3xl font-bold text-[#009EE2] flex items-center">
                  {item.total} 
                  <StarIcon className="h-6 w-6 ml-1.5 text-yellow-400" />
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Puntaje Total</p>
              </div>
            </div>
          );
        })}
      </div>
       <div className="mt-6 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-700">
        <strong>Nota:</strong> Esta vista es un resumen de los datos actualmente en memoria.
      </div>

      {sortedPrioritizations.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceedToCharacterization}
            aria-label="Proceder a Caracterización de Medios de Vida (H3.3)"
          >
            Proceder a Caracterización (H3.3)
            <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
          </Button>
        </div>
      )}
    </ToolCard>
  );
};