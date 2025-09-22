import React, { useState, useEffect } from 'react';
import { ToolCard } from '../ToolCard';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';

const SESSION_KEY = 'H22_ESTRATEGIA_KEY';

interface StrategyState {
  conformacionTaller: string;
  medidasInclusion: string;
  manejoConflictos: string;
  otrasEstrategias: string;
}

const initialState: StrategyState = {
  conformacionTaller: '',
  medidasInclusion: '',
  manejoConflictos: '',
  otrasEstrategias: '',
};

export const Herramienta2_2_EstrategiaParticipacion: React.FC = () => {
  const [strategy, setStrategy] = useState<StrategyState>(initialState);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(SESSION_KEY);
      if (storedData) {
        setStrategy(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error parsing strategy data from session storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(strategy));
    } catch (error) {
      console.error("Error saving strategy data to session storage:", error);
    }
  }, [strategy]);

  const handleTextChange = (field: keyof StrategyState, value: string) => {
    setStrategy(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ToolCard 
      title="Herramienta 2.2 - Estrategia de Participación e Inclusión"
      objetivo="Reflexionar y definir las estrategias clave para la conformación del taller, la inclusión de todos los actores, el manejo de conflictos y otras consideraciones importantes para garantizar un proceso participativo exitoso."
    >
      <p className="text-sm text-gray-600 mb-4">
        Utilice los siguientes campos para desarrollar su estrategia. Sus notas se guardarán automáticamente.
      </p>
      <div className="space-y-6">
        <Textarea
          label="1. ¿Cómo se conformará el taller?"
          value={strategy.conformacionTaller}
          onChange={(e) => handleTextChange('conformacionTaller', e.target.value)}
          placeholder="¿Es posible y recomendable trabajar con todos los actores identificados en un solo taller? ¿Qué actores se propone convocar al taller de diagnóstico? ¿Qué actores se propone convocar a un taller diferenciado? ¿Por qué?"
          rows={5}
          className="bg-white"
        />
        <Textarea
          label="2. ¿Qué medidas de inclusión se proponen?"
          value={strategy.medidasInclusion}
          onChange={(e) => handleTextChange('medidasInclusion', e.target.value)}
          placeholder="Estrategias para garantizar la participación equitativa y la escucha activa de todos los grupos (ej. mujeres, jóvenes, grupos marginados)."
          rows={5}
          className="bg-white"
        />
        <Textarea
          label="3. ¿Cuáles son las pautas para el manejo de conflictos y tensiones?"
          value={strategy.manejoConflictos}
          onChange={(e) => handleTextChange('manejoConflictos', e.target.value)}
          placeholder="Defina un protocolo o pautas de convivencia para el taller, y cómo se manejarán posibles tensiones o conflictos entre los participantes."
          rows={5}
          className="bg-white"
        />
        <Textarea
          label="4. ¿Qué otras estrategias deben considerarse?"
          value={strategy.otrasEstrategias}
          onChange={(e) => handleTextChange('otrasEstrategias', e.target.value)}
          placeholder="Anote aquí cualquier otra consideración logística, metodológica o cultural que sea importante para el éxito del taller."
          rows={5}
          className="bg-white"
        />
      </div>
    </ToolCard>
  );
};