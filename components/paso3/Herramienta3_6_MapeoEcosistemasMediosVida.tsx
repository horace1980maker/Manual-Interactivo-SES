
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline';

export const Herramienta3_6_MapeoEcosistemasMediosVida: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ToolCard 
      title="Herramienta 3.6 - Mapeo de Ecosistemas y Medios de Vida"
      objetivo="Visualizar la distribución espacial y las interacciones entre los ecosistemas identificados y los medios de vida priorizados, facilitando la comprensión de las dinámicas territoriales y la identificación de zonas críticas o de oportunidad."
      >
      <p className="text-sm text-gray-600 mb-4">
        Esta herramienta implica un ejercicio de mapeo participativo, generalmente realizado con mapas físicos y marcadores. La aplicación web puede servir para registrar observaciones y la leyenda construida.
      </p>
      
      <div className="my-6 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
        <MapPinIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-xl font-semibold text-gray-700">Esta herramienta se la desarrolla en un mapa impreso</p>
      </div>

      <Textarea 
        label="Notas y Leyenda del Mapeo:" 
        placeholder="Describa aquí los elementos mapeados, códigos utilizados, y observaciones relevantes del ejercicio de mapeo..." 
        rows={6} 
        className="mt-4"
      />
      <div className="mt-8 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/paso4/herramienta4_1')}
          aria-label="Continuar a Paso 4: Identificación de Amenazas e Impactos"
        >
          Continuar a Paso 4: Identificación de Amenazas e Impactos
          <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
        </Button>
      </div>
    </ToolCard>
  );
};
