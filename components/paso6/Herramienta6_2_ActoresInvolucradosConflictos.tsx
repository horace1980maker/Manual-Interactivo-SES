import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Textarea } from '../common/Textarea';
import { StyledRadioSelect } from '../common/StyledRadioSelect';
import { SelectableDisplayCard } from '../common/SelectableDisplayCard';
import { 
    AmenazaMedioVidaConflicto, AmenazaServicioEcosistemicoConflicto, ConflictoEvolucion, 
    ActorPaisaje, ActorConflicto, ConflictoConActoresDetallados, ServicioEcosistemicoCardItem
} from '../../types'; 
import { serviciosEcosistemicosData } from '../../data/serviciosEcosistemicosData'; 
import { 
    PlusIcon, ChevronLeftIcon, CheckIcon as CheckMarkIcon, ArrowRightIcon, 
    InformationCircleIcon, UserGroupIcon, PencilIcon, CheckCircleIcon as ProcessedCheckIcon, 
    TrashIcon
} from '@heroicons/react/24/outline';


const SESSION_STORAGE_H421_CONFLICTS_KEY = 'characterizedMedioVidaConflicts_H421';
const SESSION_STORAGE_H422_CONFLICTS_KEY = 'characterizedServicioEcosistemicoConflicts_H422';
const SESSION_STORAGE_H51_ACTORES_KEY = 'H51_ACTORES_PAISAJE_KEY';
const SESSION_STORAGE_H61_EVOLUCION_KEY = 'H61_EVOLUCION_CONFLICTOS_KEY';
const SESSION_STORAGE_H62_ACTORES_CONFLICTO_KEY = 'H62_ACTORES_CONFLICTO_KEY';


interface CombinedConflictForH62 {
  id: string; // Original conflict ID from H4.2.x / H6.1
  amenaza: string;
  afectadoNombre: string; 
  afectadoTipo: 'Medio de Vida' | 'Servicio Ecosistémico';
  codigoAfectado?: string; // MdV Code or SE Code
  descripcionConflictoOriginal?: string;
  codigoConflictoCalculadoH62: string; // New combined code for H6.2 specific ID
}

const initialActorConflictoState: Omit<ActorConflicto, 'id' | 'actorPrincipal'> = {
    impactoConflictoEnActorSigno: 'o',
    impactoConflictoEnActorFactores: '',
    impactoActorEnConflictoSigno: 'o',
    impactoActorEnConflictoFactores: '',
    estrategiasAccionesInfluyentes: '',
};

const signoOptions: Array<{ value: '+' | 'o' | '-'; display: string }> = [
    { value: '+', display: '+' },
    { value: 'o', display: 'o' },
    { value: '-', display: '-' },
];

type Stage = 'selectConflictList' | 'addEditActorsForConflict';

export const Herramienta6_2_ActoresInvolucradosConflictos: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState<Stage>('selectConflictList');
  const [isLoading, setIsLoading] = useState(true);

  const [allEvolutions, setAllEvolutions] = useState<ConflictoEvolucion[]>([]);
  const [allH421Conflicts, setAllH421Conflicts] = useState<AmenazaMedioVidaConflicto[]>([]);
  const [allH422Conflicts, setAllH422Conflicts] = useState<AmenazaServicioEcosistemicoConflicto[]>([]);
  const [allActorsFromH51, setAllActorsFromH51] = useState<ActorPaisaje[]>([]);
  
  const [selectedConflictForActorAssignment, setSelectedConflictForActorAssignment] = useState<CombinedConflictForH62 | null>(null);
  const [actorsInCurrentConflict, setActorsInCurrentConflict] = useState<ActorConflicto[]>([]);
  
  const [allConflictActorDetails, setAllConflictActorDetails] = useState<ConflictoConActoresDetallados[]>([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      const h61EvolutionsRaw = sessionStorage.getItem(SESSION_STORAGE_H61_EVOLUCION_KEY);
      setAllEvolutions(h61EvolutionsRaw ? JSON.parse(h61EvolutionsRaw) : []);

      const h421Raw = sessionStorage.getItem(SESSION_STORAGE_H421_CONFLICTS_KEY);
      setAllH421Conflicts(h421Raw ? JSON.parse(h421Raw) : []);

      const h422Raw = sessionStorage.getItem(SESSION_STORAGE_H422_CONFLICTS_KEY);
      setAllH422Conflicts(h422Raw ? JSON.parse(h422Raw) : []);
      
      const h51ActorsRaw = sessionStorage.getItem(SESSION_STORAGE_H51_ACTORES_KEY);
      setAllActorsFromH51(h51ActorsRaw ? JSON.parse(h51ActorsRaw) : []);

      const h62DataRaw = sessionStorage.getItem(SESSION_STORAGE_H62_ACTORES_CONFLICTO_KEY);
      setAllConflictActorDetails(h62DataRaw ? JSON.parse(h62DataRaw) : []);

    } catch (error) {
      console.error("Error loading data for H6.2:", error);
    }
    setIsLoading(false);
  }, []);

  const combinedConflictsData = useMemo<CombinedConflictForH62[]>(() => {
    return allEvolutions.map(evo => {
      let originalConflict = allH421Conflicts.find(c => c.id === evo.id);
      let tipoAfectado: CombinedConflictForH62['afectadoTipo'] = 'Medio de Vida';
      let nombreAfectado = originalConflict?.medioDeVida || '';
      let codigoAfectado = originalConflict?.codigoMedioVida || '';
      let descOriginal = originalConflict?.descripcionConflicto;
      let codigoConflictoH62 = originalConflict?.mapeoConflictoCodigo || `MdV-${originalConflict?.codigoMedioVida || 'Unknown'}`;


      if (!originalConflict) {
        const h422Original = allH422Conflicts.find(c => c.id === evo.id);
        if (h422Original) {
          originalConflict = h422Original as any; // Cast to satisfy structure, specific fields accessed carefully
          tipoAfectado = 'Servicio Ecosistémico';
          const servicio = serviciosEcosistemicosData.find(s => s.codigo === h422Original.codigoSE);
          nombreAfectado = servicio ? servicio.nombre : h422Original.codigoSE;
          codigoAfectado = h422Original.codigoSE;
          descOriginal = h422Original.descripcionConflicto;
          codigoConflictoH62 = h422Original.mapeoConflictoCodigo || `SE-${h422Original.codigoSE || 'Unknown'}`;
        }
      }
      
      const amenazaNombre = originalConflict?.amenaza || 'Amenaza Desconocida';

      return {
        id: evo.id, // Original conflict ID
        amenaza: amenazaNombre,
        afectadoNombre: nombreAfectado,
        afectadoTipo: tipoAfectado,
        codigoAfectado: codigoAfectado,
        descripcionConflictoOriginal: descOriginal,
        codigoConflictoCalculadoH62: codigoConflictoH62.replace(/\s+/g, '_'),
      };
    }).filter(c => c.afectadoNombre); // Ensure only valid conflicts are processed
  }, [allEvolutions, allH421Conflicts, allH422Conflicts]);


  const handleSelectConflictForActors = (conflict: CombinedConflictForH62) => {
    setSelectedConflictForActorAssignment(conflict);
    const existingDetails = allConflictActorDetails.find(details => details.conflictoId === conflict.id);
    if (existingDetails) {
      setActorsInCurrentConflict(existingDetails.actoresDetalles);
    } else {
      // Initialize with all actors from H5.1 if no prior details exist for this conflict
      setActorsInCurrentConflict(
        allActorsFromH51.map(actor => ({
          ...initialActorConflictoState,
          id: actor.id, 
          actorPrincipal: actor.nombre,
        }))
      );
    }
    setCurrentStage('addEditActorsForConflict');
  };

  const handleActorDataChange = (actorId: string, field: keyof Omit<ActorConflicto, 'id' | 'actorPrincipal'>, value: string | ('+' | 'o' | '-')) => {
    setActorsInCurrentConflict(prev =>
      prev.map(actor => 
        actor.id === actorId ? { ...actor, [field]: value } : actor
      )
    );
  };
  
  const handleToggleActorInvolvement = (actor: ActorPaisaje) => {
    setActorsInCurrentConflict(prev => {
        const isActorPresent = prev.some(a => a.id === actor.id);
        if (isActorPresent) {
            return prev.filter(a => a.id !== actor.id);
        } else {
            return [...prev, {
                ...initialActorConflictoState,
                id: actor.id,
                actorPrincipal: actor.nombre,
            }];
        }
    });
  };

  const handleSaveActorsForConflict = () => {
    if (!selectedConflictForActorAssignment) return;

    const newDetailEntry: ConflictoConActoresDetallados = {
      conflictoId: selectedConflictForActorAssignment.id,
      codigoConflictoCalculado: selectedConflictForActorAssignment.codigoConflictoCalculadoH62,
      actoresDetalles: actorsInCurrentConflict,
    };

    const existingEntryIndex = allConflictActorDetails.findIndex(d => d.conflictoId === selectedConflictForActorAssignment.id);
    let updatedAllDetails;
    if (existingEntryIndex > -1) {
      updatedAllDetails = [...allConflictActorDetails];
      updatedAllDetails[existingEntryIndex] = newDetailEntry;
    } else {
      updatedAllDetails = [...allConflictActorDetails, newDetailEntry];
    }
    
    setAllConflictActorDetails(updatedAllDetails);
    sessionStorage.setItem(SESSION_STORAGE_H62_ACTORES_CONFLICTO_KEY, JSON.stringify(updatedAllDetails));
    
    setSelectedConflictForActorAssignment(null);
    setActorsInCurrentConflict([]);
    setCurrentStage('selectConflictList');
  };
  

  const renderConflictSelectionList = (list: CombinedConflictForH62[], title: string) => (
    <>
        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-2">{title}</h4>
        {list.length === 0 ? (
            <p className="text-sm text-gray-500">No hay conflictos de este tipo disponibles (desde H6.1).</p>
        ) : (
            <div className="space-y-3">
                {list.map(conflict => {
                    const isProcessed = allConflictActorDetails.some(details => details.conflictoId === conflict.id);
                    return (
                        <div key={conflict.id} className={`p-4 border rounded-lg shadow-sm transition-shadow hover:shadow-md ${isProcessed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Amenaza: <span className="font-medium text-gray-700">{conflict.amenaza}</span></p>
                                    <p className="text-sm text-gray-500">Afectando a: <span className="font-medium text-gray-700">{conflict.afectadoNombre} ({conflict.afectadoTipo})</span></p>
                                    <p className="text-sm text-gray-500">Código Conflicto (H6.2): <span className="font-mono text-indigo-600">{conflict.codigoConflictoCalculadoH62}</span></p>
                                </div>
                                {isProcessed && <ProcessedCheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" title="Actores asignados"/>}
                            </div>
                            <div className="mt-2 text-right">
                                <Button onClick={() => handleSelectConflictForActors(conflict)} variant="secondary" size="sm" className="w-full sm:w-auto">
                                    <PencilIcon className="h-4 w-4 mr-1"/> {isProcessed ? "Editar Actores" : "Asignar/Detallar Actores"}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </>
  );

  const { mdvConflicts, seConflicts } = useMemo(() => {
    const mdv: CombinedConflictForH62[] = [];
    const se: CombinedConflictForH62[] = [];
    combinedConflictsData.forEach(conflict => {
        if (conflict.afectadoTipo === 'Medio de Vida') mdv.push(conflict);
        else se.push(conflict);
    });
    return { mdvConflicts: mdv, seConflicts: se };
  }, [combinedConflictsData]);


  if (isLoading) {
    return <ToolCard title="H6.2 Actores Involucrados en los Conflictos"><p>Cargando datos...</p></ToolCard>;
  }

  if (currentStage === 'addEditActorsForConflict' && selectedConflictForActorAssignment) {
    
    return (
      <ToolCard 
        title={`H6.2 - Asignar Actores a Conflicto: ${selectedConflictForActorAssignment.codigoConflictoCalculadoH62}`}
        objetivo={`Identificar y detallar el rol de los actores (de H5.1) en el conflicto: ${selectedConflictForActorAssignment.descripcionConflictoOriginal || selectedConflictForActorAssignment.amenaza + " -> " + selectedConflictForActorAssignment.afectadoNombre}.`}
      >
        <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
            <p className="text-sm text-indigo-700"><strong>Conflicto (Contexto H4.2):</strong> {selectedConflictForActorAssignment.descripcionConflictoOriginal || 'No detallado en H4.2'}</p>
            <p className="text-xs text-indigo-600">Amenaza: {selectedConflictForActorAssignment.amenaza} | Afecta a: {selectedConflictForActorAssignment.afectadoNombre} ({selectedConflictForActorAssignment.afectadoTipo})</p>
        </div>
        
        <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Paso 1: Seleccionar Actores Involucrados en Este Conflicto (de H5.1)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allActorsFromH51.map(actor => (
                    <SelectableDisplayCard
                        key={actor.id}
                        item={{ 
                            id: actor.id,
                            nombre: actor.nombre,
                            codigo: actor.tipo.substring(0,4).toUpperCase() || 'ACTR',
                            categoria: 'actor',
                            tipoActor: actor.tipo
                        }} 
                        isSelected={actorsInCurrentConflict.some(a => a.id === actor.id)}
                        onToggleSelect={() => handleToggleActorInvolvement(actor)}
                    />
                ))}
            </div>
        </div>

        {actorsInCurrentConflict.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Paso 2: Detallar Rol de Actores Seleccionados</h4>
            {actorsInCurrentConflict.map(actorDetail => {
              const actorInfo = allActorsFromH51.find(a => a.id === actorDetail.id);
              return (
                <div key={actorDetail.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <h5 className="text-lg font-semibold text-indigo-700 mb-3">{actorDetail.actorPrincipal}</h5>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-3" style={{ contain: 'layout' }}>
                      <p className="text-sm font-medium text-gray-600">Impacto del Conflicto EN el Actor</p>
                      <StyledRadioSelect
                        label="Signo:"
                        name={`impactoEnActorSigno-${actorDetail.id}`}
                        options={signoOptions}
                        value={actorDetail.impactoConflictoEnActorSigno}
                        onChange={(val) => handleActorDataChange(actorDetail.id, 'impactoConflictoEnActorSigno', val as '+' | 'o' | '-')}
                        inline
                      />
                      <Textarea
                        label="Factores:"
                        value={actorDetail.impactoConflictoEnActorFactores}
                        onChange={(e) => handleActorDataChange(actorDetail.id, 'impactoConflictoEnActorFactores', e.target.value)}
                        rows={2} placeholder="Describa factores..."
                      />
                    </div>
                    <div className="space-y-3" style={{ contain: 'layout' }}>
                      <p className="text-sm font-medium text-gray-600">Impacto del Actor EN el Conflicto</p>
                      <StyledRadioSelect
                        label="Signo:"
                        name={`impactoActorEnConflictoSigno-${actorDetail.id}`}
                        options={signoOptions}
                        value={actorDetail.impactoActorEnConflictoSigno}
                        onChange={(val) => handleActorDataChange(actorDetail.id, 'impactoActorEnConflictoSigno', val as '+' | 'o' | '-')}
                        inline
                      />
                      <Textarea
                        label="Factores:"
                        value={actorDetail.impactoActorEnConflictoFactores}
                        onChange={(e) => handleActorDataChange(actorDetail.id, 'impactoActorEnConflictoFactores', e.target.value)}
                        rows={2} placeholder="Describa factores..."
                      />
                    </div>
                  </div>
                  <Textarea
                    label="Estrategias y acciones de influencia del actor:"
                    value={actorDetail.estrategiasAccionesInfluyentes}
                    onChange={(e) => handleActorDataChange(actorDetail.id, 'estrategiasAccionesInfluyentes', e.target.value)}
                    rows={2} placeholder="Describa estrategias..."
                    wrapperClassName="mt-4"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button onClick={() => { setCurrentStage('selectConflictList'); setSelectedConflictForActorAssignment(null); setActorsInCurrentConflict([]); }} variant="outline">
            <ChevronLeftIcon className="h-5 w-5 mr-1"/> Volver a Lista de Conflictos
          </Button>
          <Button onClick={handleSaveActorsForConflict} variant="primary" size="lg">
            <CheckMarkIcon className="h-5 w-5 mr-1"/> Guardar Actores para este Conflicto
          </Button>
        </div>
      </ToolCard>
    );
  }

  return (
    <ToolCard 
        title="H6.2 Actores Involucrados en los Conflictos"
        objetivo="Identificar los actores clave (de H5.1) para cada conflicto relevante (de H6.1), y analizar su rol e influencia en dicho conflicto."
    >
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={() => navigate('/paso6/herramienta6_1')} variant="outline" size="sm">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a H6.1 (Evolución)
        </Button>
      </div>

      {combinedConflictsData.length === 0 ? (
        <div className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-700 flex items-center">
            <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />
            No hay conflictos procesados en H6.1. Por favor, complete ese paso primero.
        </div>
      ) : (
        <>
            {renderConflictSelectionList(mdvConflicts, "Conflictos Relacionados con Medios de Vida")}
            {renderConflictSelectionList(seConflicts, "Conflictos Relacionados con Servicios Ecosistémicos")}
        </>
      )}
      
      <div className="mt-10 pt-6 border-t border-gray-300 text-center space-y-4">
        <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/paso7')}
            aria-label="Continuar al Paso 7"
        >
            Ir a Paso 7: Capacidad Adaptativa <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
        </Button>
      </div>
    </ToolCard>
  );
};