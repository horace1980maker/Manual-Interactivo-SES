
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Textarea } from '../common/Textarea';
import { EcosystemItem, LivelihoodItem, ServicioEcosistemicoCardItem, EcosystemCharacterization } from '../../types';
import { serviciosEcosistemicosData } from '../../data/serviciosEcosistemicosData';
import { ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { SelectableDisplayCard } from '../common/SelectableDisplayCard'; // Import the new common card

const SESSION_STORAGE_LIVELIHOODS_H31 = 'detailedLivelihoodsForH34'; 
const SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34 = 'allCharacterizedEcosystemsH34';


export const Herramienta3_4_DetalleEcosistema: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ecosystemToCharacterize = location.state?.ecosystemToCharacterize as EcosystemItem | undefined;
  
  const [allLivelihoodsFromH31, setAllLivelihoodsFromH31] = useState<LivelihoodItem[]>([]);
  const allServicioEcosistemicoCards = serviciosEcosistemicosData;

  const [selectedLivelihoodIds, setSelectedLivelihoodIds] = useState<string[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [causasDegradacion, setCausasDegradacion] = useState('');

  // Load existing characterization if available to pre-fill form
  useEffect(() => {
    try {
      const storedLivelihoods = sessionStorage.getItem(SESSION_STORAGE_LIVELIHOODS_H31);
      if (storedLivelihoods) {
        setAllLivelihoodsFromH31(JSON.parse(storedLivelihoods));
      }

      if (ecosystemToCharacterize) {
        const storedCharacterizationsRaw = sessionStorage.getItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34);
        if (storedCharacterizationsRaw) {
          const existingCharacterizations: EcosystemCharacterization[] = JSON.parse(storedCharacterizationsRaw);
          const currentEcoChar = existingCharacterizations.find(ec => ec.ecosystemId === ecosystemToCharacterize.id);
          if (currentEcoChar) {
            // Pre-fill selected livelihoods
            const livelihoodItems = storedLivelihoods ? JSON.parse(storedLivelihoods) as LivelihoodItem[] : [];
            setSelectedLivelihoodIds(
              currentEcoChar.relatedLivelihoodCodes
                .map(code => livelihoodItems.find(l => l.codigo === code)?.id)
                .filter((id): id is string => !!id) 
            );
            // Pre-fill selected services
            setSelectedServiceIds(
              currentEcoChar.relatedServicioEcosistemicoCodes
                .map(code => serviciosEcosistemicosData.find(s => s.codigo === code)?.id)
                .filter((id): id is string => !!id)
            );
            setCausasDegradacion(currentEcoChar.causasDegradacion || '');
          }
        }
      }
    } catch (error) {
      console.error("Error loading data for H3.4 Detail:", error);
    }
  }, [ecosystemToCharacterize]);


  if (!ecosystemToCharacterize) {
    return (
      <ToolCard title="Error en Caracterización de Ecosistema">
        <p className="text-gray-700 mb-4">
          No se ha especificado un ecosistema para caracterizar. Por favor, vuelva a la selección.
        </p>
        <Button onClick={() => navigate('/paso3/herramienta3_4')} variant="primary">
          <ChevronLeftIcon className="h-5 w-5 mr-2 inline-block" />
          Volver a Selección (H3.4)
        </Button>
      </ToolCard>
    );
  }

  const handleToggleSelect = (id: string, type: 'medioDeVida' | 'ecosistema' | 'servicio' | 'actor') => {
    if (type === 'medioDeVida') {
      setSelectedLivelihoodIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else if (type === 'servicio') {
      setSelectedServiceIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
    // 'ecosistema' type is not handled here as this component deals with livelihoods and services for a given ecosystem.
  };

  const handleSaveCharacterization = () => {
    if (!ecosystemToCharacterize) return;

    const newCharacterization: EcosystemCharacterization = {
      id: ecosystemToCharacterize.id, 
      ecosystemId: ecosystemToCharacterize.id,
      relatedLivelihoodCodes: selectedLivelihoodIds.map(id => allLivelihoodsFromH31.find(l => l.id === id)?.codigo || '').filter(Boolean),
      relatedServicioEcosistemicoCodes: selectedServiceIds.map(id => allServicioEcosistemicoCards.find(s => s.id === id)?.codigo || '').filter(Boolean),
      causasDegradacion,
    };

    try {
      const storedCharacterizationsRaw = sessionStorage.getItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34);
      let existingCharacterizations: EcosystemCharacterization[] = storedCharacterizationsRaw ? JSON.parse(storedCharacterizationsRaw) : [];
      
      existingCharacterizations = existingCharacterizations.filter(ec => ec.ecosystemId !== ecosystemToCharacterize.id);
      existingCharacterizations.push(newCharacterization);
      
      sessionStorage.setItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34, JSON.stringify(existingCharacterizations));
    } catch (error) {
      console.error("Error saving ecosystem characterization to sessionStorage:", error);
    }
    
    navigate('/paso3/herramienta3_4');
  };

  return (
    <ToolCard 
      title={`Caracterizando Ecosistema: ${ecosystemToCharacterize.nombre}`}
      objetivo="Vincular medios de vida y servicios ecosistémicos al ecosistema actual, y detallar sus causas de degradación."
    >
      <Button onClick={() => navigate('/paso3/herramienta3_4')} variant="outline" size="sm" className="mb-6">
        <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
        Volver a Selección de Ecosistemas
      </Button>

      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold text-[#B71373]">{ecosystemToCharacterize.nombre}</h3>
        <p className="text-sm text-gray-600 font-mono">Código: {ecosystemToCharacterize.codigo}</p>
      </div>

      {/* Medios de Vida Relacionados */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-[#751851] mb-3">Seleccionar Medios de Vida Relacionados con este Ecosistema:</h4>
        {allLivelihoodsFromH31.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allLivelihoodsFromH31.map(item => (
                <SelectableDisplayCard // Use the common component
                  key={item.id}
                  item={item}
                  isSelected={selectedLivelihoodIds.includes(item.id)}
                  onToggleSelect={handleToggleSelect}
                />
            ))}
            </div>
        ) : <p className="text-sm text-gray-500">No hay medios de vida disponibles (revise H3.1 Detalle).</p>}
      </div>

      {/* Servicios Ecosistémicos Relacionados */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-[#751851] mb-3">Seleccionar Servicios Ecosistémicos Relacionados con este Ecosistema:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allServicioEcosistemicoCards.map(item => (
            <SelectableDisplayCard // Use the common component
              key={item.id}
              item={item}
              isSelected={selectedServiceIds.includes(item.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      </div>

      {/* Causas de Degradación */}
      <div className="mb-8">
        <Textarea
          label="Principales Causas de Degradación de este Ecosistema:"
          value={causasDegradacion}
          onChange={(e) => setCausasDegradacion(e.target.value)}
          placeholder="Describa las causas principales, ej: Tala, Frontera agrícola y pecuaria, Extracción madera, Uso de agroquímicos, Residuos sólidos, Quemas..."
          rows={5}
        />
      </div>

      <div className="mt-8 text-center">
        <Button
            variant="primary"
            size="lg"
            onClick={handleSaveCharacterization}
        >
            <CheckIcon className="h-5 w-5 mr-2 inline-block" />
            Guardar Caracterización del Ecosistema
        </Button>
      </div>
    </ToolCard>
  );
};