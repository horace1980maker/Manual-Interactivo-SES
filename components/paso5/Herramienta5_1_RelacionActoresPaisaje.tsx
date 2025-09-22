

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { StyledRadioSelect } from '../common/StyledRadioSelect';
import { ActorPaisaje, LivelihoodItem, ServicioEcosistemicoCardItem, ActorRelationship } from '../../types';
import { serviciosEcosistemicosData } from '../../data/serviciosEcosistemicosData';
import { PlusIcon, TrashIcon, PencilIcon, ChevronLeftIcon, CheckIcon, UsersIcon, LinkIcon, TagIcon, GlobeAltIcon, BoltIcon, LightBulbIcon, ArrowRightIcon, UserGroupIcon, TableCellsIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const SESSION_STORAGE_KEY_H51_ACTORES = 'H51_ACTORES_PAISAJE_KEY';
const SESSION_STORAGE_LIVELIHOODS_H31 = 'detailedLivelihoodsForH34';
const SESSION_STORAGE_SERVICE_CODES_H35 = 'H35_TARGETED_SERVICE_CODES_KEY';

const initialActorPaso1State: Omit<ActorPaisaje, 'id' | 'conflictoConActorOTema' | 'colaboracionConActorOTema' | 'letraDiagrama' | 'relationships'> = {
  nombre: '',
  medioVidaServicioRelacionado: [],
  tipo: '',
  alcance: 'Local',
  poder: 0,
  interes: 0,
};

type SubStage = 'viewPaso1List' | 'addEditPaso1Actor' | 'viewPaso2ActorSelection' | 'definePaso2Relationships' | 'viewPaso3Plot';

export const Herramienta5_1_RelacionActoresPaisaje: React.FC = () => {
  const navigate = useNavigate();
  const [currentSubStage, setCurrentSubStage] = useState<SubStage>('viewPaso1List');
  const [actors, setActors] = useState<ActorPaisaje[]>([]);
  
  const [currentActorPaso1, setCurrentActorPaso1] = useState<Partial<ActorPaisaje>>(initialActorPaso1State);
  const [editingActorIdPaso1, setEditingActorIdPaso1] = useState<string | null>(null);
  const [poderError, setPoderError] = useState<string | null>(null);
  const [interesError, setInteresError] = useState<string | null>(null);
  const [mdvSeOptions, setMdvSeOptions] = useState<Array<{ value: string; label: string }>>([]);

  const [selectedActorForPaso2Id, setSelectedActorForPaso2Id] = useState<string | null>(null);
  const [relationshipEdits, setRelationshipEdits] = useState<Record<string, Omit<ActorRelationship, 'relatedActorId'>>>({});

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(SESSION_STORAGE_KEY_H51_ACTORES);
      if (storedData) {
        setActors(JSON.parse(storedData));
      }

      const options: Array<{ value: string; label: string }> = [];
      const storedLivelihoodsRaw = sessionStorage.getItem(SESSION_STORAGE_LIVELIHOODS_H31);
      if (storedLivelihoodsRaw) {
        const livelihoods: LivelihoodItem[] = JSON.parse(storedLivelihoodsRaw);
        livelihoods.forEach(l => options.push({ value: `MdV: ${l.nombre} (${l.codigo})`, label: `MdV: ${l.nombre} (${l.codigo})` }));
      }

      const storedServiceCodesRaw = sessionStorage.getItem(SESSION_STORAGE_SERVICE_CODES_H35);
      if (storedServiceCodesRaw) {
        const serviceCodes: string[] = JSON.parse(storedServiceCodesRaw);
        serviceCodes.forEach(code => {
          const service = serviciosEcosistemicosData.find(s => s.codigo === code);
          if (service) {
            options.push({ value: `SE: ${service.nombre} (${service.codigo})`, label: `SE: ${service.nombre} (${service.codigo})` });
          }
        });
      }
      setMdvSeOptions(options);
    } catch (error) {
      console.error("Error loading data from sessionStorage:", error);
    }
  }, []);

  const saveActorsToSessionStorage = (updatedActors: ActorPaisaje[]) => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY_H51_ACTORES, JSON.stringify(updatedActors));
    } catch (error) {
      console.error("Error saving H5.1 actors to sessionStorage:", error);
    }
  };

  const validatePoderInteresPaso1 = (field: 'poder' | 'interes', value: number) => {
    if (value < 0 || value > 10) {
      if (field === 'poder') setPoderError('El poder debe estar entre 0 y 10.');
      if (field === 'interes') setInteresError('El interés debe estar entre 0 y 10.');
      return false;
    }
    if (field === 'poder') setPoderError(null);
    if (field === 'interes') setInteresError(null);
    return true;
  };

  const handlePaso1InputChange = (
    field: Exclude<keyof typeof initialActorPaso1State, 'medioVidaServicioRelacionado' | 'alcance'>,
    value: string | number
  ) => {
    if (field === 'poder' || field === 'interes') {
      const numValue = Number(value);
      validatePoderInteresPaso1(field, numValue);
      setCurrentActorPaso1(prev => ({ ...prev, [field]: numValue }));
    } else {
      setCurrentActorPaso1(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handlePaso1AlcanceChange = (value: ActorPaisaje['alcance']) => {
    setCurrentActorPaso1(prev => ({ ...prev, alcance: value }));
  };

  const handlePaso1MdvSeCheckboxChange = (optionValue: string) => {
    setCurrentActorPaso1(prev => {
      const currentSelections = prev.medioVidaServicioRelacionado || [];
      const newSelections = currentSelections.includes(optionValue)
        ? currentSelections.filter(item => item !== optionValue)
        : [...currentSelections, optionValue];
      return { ...prev, medioVidaServicioRelacionado: newSelections };
    });
  };

  const handleSavePaso1Actor = () => {
    if (!currentActorPaso1.nombre?.trim()) {
      alert('El nombre del actor clave es obligatorio.');
      return;
    }
    const isPoderValid = validatePoderInteresPaso1('poder', currentActorPaso1.poder ?? 0);
    const isInteresValid = validatePoderInteresPaso1('interes', currentActorPaso1.interes ?? 0);

    if (!isPoderValid || !isInteresValid) {
      alert('Por favor, corrija los errores en Poder y/o Interés.');
      return;
    }

    let updatedActors;
    if (editingActorIdPaso1) {
      updatedActors = actors.map(actor =>
        actor.id === editingActorIdPaso1
          ? { ...actor, ...currentActorPaso1, relationships: actor.relationships || [], letraDiagrama: actor.letraDiagrama } as ActorPaisaje // Preserve letraDiagrama
          : actor
      );
    } else {
      const newActor: ActorPaisaje = {
        id: Date.now().toString(),
        conflictoConActorOTema: '',
        colaboracionConActorOTema: '',
        relationships: [],
        letraDiagrama: undefined, // Initialize letraDiagrama
        ...initialActorPaso1State,
        ...currentActorPaso1,
      } as ActorPaisaje;
      updatedActors = [...actors, newActor];
    }
    setActors(updatedActors);
    saveActorsToSessionStorage(updatedActors);
    setEditingActorIdPaso1(null);
    setCurrentActorPaso1(initialActorPaso1State);
    setPoderError(null);
    setInteresError(null);
    setCurrentSubStage('viewPaso1List');
  };

  const handleEditPaso1Actor = (actor: ActorPaisaje) => {
    setEditingActorIdPaso1(actor.id);
    setCurrentActorPaso1({
      nombre: actor.nombre,
      medioVidaServicioRelacionado: Array.isArray(actor.medioVidaServicioRelacionado) ? actor.medioVidaServicioRelacionado : [],
      tipo: actor.tipo,
      alcance: actor.alcance,
      poder: actor.poder,
      interes: actor.interes,
      // letraDiagrama and relationships are not edited here
    });
    setPoderError(null);
    setInteresError(null);
    setCurrentSubStage('addEditPaso1Actor');
  };

  const handleDeletePaso1Actor = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este actor? Esto también eliminará las relaciones asociadas en Paso 2.')) {
      const updatedActors = actors.filter(actor => actor.id !== id);
      const cleanedActors = updatedActors.map(actor => ({
        ...actor,
        relationships: actor.relationships?.filter(rel => rel.relatedActorId !== id) || []
      }));
      setActors(cleanedActors);
      saveActorsToSessionStorage(cleanedActors);
    }
  };

  const handleAddNewPaso1 = () => {
    setEditingActorIdPaso1(null);
    setCurrentActorPaso1(initialActorPaso1State);
    setPoderError(null);
    setInteresError(null);
    setCurrentSubStage('addEditPaso1Actor');
  };
  
  const alcanceOptions: Array<{ value: ActorPaisaje['alcance']; display: string }> = [
    { value: 'Local', display: 'Local' }, { value: 'Paisaje', display: 'Paisaje' }, { value: 'Nacional', display: 'Nacional' },
  ];
  const isPaso1SaveDisabled = !!poderError || !!interesError || !currentActorPaso1.nombre?.trim();

  const handleSelectActorForPaso2 = (actorId: string) => {
    setSelectedActorForPaso2Id(actorId);
    const mainActor = actors.find(a => a.id === actorId);
    const initialEdits: Record<string, Omit<ActorRelationship, 'relatedActorId'>> = {};
    if (mainActor?.relationships) {
      mainActor.relationships.forEach(rel => {
        initialEdits[rel.relatedActorId] = { relationshipType: rel.relationshipType, theme: rel.theme };
      });
    }
    setRelationshipEdits(initialEdits);
    setCurrentSubStage('definePaso2Relationships');
  };

  const handleRelationshipEditChange = (relatedActorId: string, field: 'relationshipType' | 'theme', value: string) => {
    setRelationshipEdits(prev => ({
      ...prev,
      [relatedActorId]: {
        ...(prev[relatedActorId] || { relationshipType: '', theme: '' }),
        [field]: value as ActorRelationship['relationshipType'] | string, // Cast for relationshipType
      }
    }));
  };

  const handleSavePaso2Relationships = () => {
    if (!selectedActorForPaso2Id) return;
    const updatedRelationships: ActorRelationship[] = Object.entries(relationshipEdits)
      .map(([relatedActorId, details]) => ({
        relatedActorId,
        relationshipType: details.relationshipType as ActorRelationship['relationshipType'],
        theme: details.theme,
      }))
      .filter(rel => rel.relationshipType || rel.theme.trim()); 

    const updatedActors = actors.map(actor =>
      actor.id === selectedActorForPaso2Id
        ? { ...actor, relationships: updatedRelationships }
        : actor
    );
    setActors(updatedActors);
    saveActorsToSessionStorage(updatedActors);
    setSelectedActorForPaso2Id(null);
    setRelationshipEdits({});
    setCurrentSubStage('viewPaso2ActorSelection');
  };
  
  const selectedActorForPaso2Details = useMemo(() => {
    return actors.find(actor => actor.id === selectedActorForPaso2Id);
  }, [actors, selectedActorForPaso2Id]);

  const otherActorsForPaso2 = useMemo(() => {
    if (!selectedActorForPaso2Id) return [];
    return actors.filter(actor => actor.id !== selectedActorForPaso2Id);
  }, [actors, selectedActorForPaso2Id]);

  const assignLettersToActors = () => {
    let changed = false;
    const updatedActors = actors.map((actor, index) => {
      if (!actor.letraDiagrama) {
        changed = true;
        return { ...actor, letraDiagrama: String.fromCharCode(65 + index) }; // A, B, C...
      }
      return actor;
    });
    if (changed) {
      setActors(updatedActors);
      saveActorsToSessionStorage(updatedActors);
    }
  };

  const handleProceedToPaso3 = () => {
    assignLettersToActors();
    setCurrentSubStage('viewPaso3Plot');
  };

  if (currentSubStage === 'addEditPaso1Actor') {
    return (
      <ToolCard title="H5.1. Relación de los Actores con el Paisaje">
        <h3 className="text-xl font-semibold text-[#D946EF] mb-4">Paso 1: {editingActorIdPaso1 ? 'Editar Actor Clave' : 'Añadir Nuevo Actor Clave'}</h3>
        <div className="space-y-6 p-4 border border-[#F472B6] rounded-lg bg-pink-50/30">
          <Input
            label="ACTOR CLAVE"
            value={currentActorPaso1.nombre || ''}
            onChange={(e) => handlePaso1InputChange('nombre', e.target.value)}
            placeholder="Nombre del Actor Institucional Identificado"
            className="border-[#F472B6] focus:ring-[#EC4899] focus:border-[#EC4899]"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">MdV o SE con el que se relaciona (seleccione uno o más):</label>
            <div className="max-h-48 overflow-y-auto p-2 border border-[#F472B6] rounded-md bg-white space-y-1">
              {mdvSeOptions.length > 0 ? mdvSeOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 text-sm text-gray-700 p-1.5 hover:bg-pink-50 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
                    checked={(currentActorPaso1.medioVidaServicioRelacionado || []).includes(option.value)}
                    onChange={() => handlePaso1MdvSeCheckboxChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              )) : <p className="text-xs text-gray-500 italic">No hay MdV o SE disponibles. Revise H3.1 y H3.5.</p>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Tipo"
              value={currentActorPaso1.tipo || ''}
              onChange={(e) => handlePaso1InputChange('tipo', e.target.value)}
              placeholder="Ej: Organización comunitaria, Gubernamental"
              className="border-[#F472B6] focus:ring-[#EC4899] focus:border-[#EC4899]"
            />
            <StyledRadioSelect
              label="Alcance"
              name="alcancePaso1"
              options={alcanceOptions}
              value={currentActorPaso1.alcance || 'Local'}
              onChange={(val) => handlePaso1AlcanceChange(val as ActorPaisaje['alcance'])}
              inline={true}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Poder (0-10)" type="number" min="0" max="10"
              value={currentActorPaso1.poder ?? 0}
              onChange={(e) => handlePaso1InputChange('poder', parseInt(e.target.value, 10))}
              className="border-[#F472B6] focus:ring-[#EC4899] focus:border-[#EC4899]"
              error={poderError}
            />
            <Input
              label="Interés (0-10)" type="number" min="0" max="10"
              value={currentActorPaso1.interes ?? 0}
              onChange={(e) => handlePaso1InputChange('interes', parseInt(e.target.value, 10))}
              className="border-[#F472B6] focus:ring-[#EC4899] focus:border-[#EC4899]"
              error={interesError}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => { setCurrentSubStage('viewPaso1List'); setCurrentActorPaso1(initialActorPaso1State); setEditingActorIdPaso1(null); setPoderError(null); setInteresError(null); }}>
            <ChevronLeftIcon className="h-5 w-5 mr-1" /> Cancelar
          </Button>
          <Button variant="primary" onClick={handleSavePaso1Actor} disabled={isPaso1SaveDisabled}>
            <CheckIcon className="h-5 w-5 mr-1" /> {editingActorIdPaso1 ? 'Guardar Cambios' : 'Añadir Actor'}
          </Button>
        </div>
      </ToolCard>
    );
  }

  if (currentSubStage === 'viewPaso2ActorSelection') {
    return (
      <ToolCard title="H5.1. Relación de los Actores con el Paisaje">
        <h3 className="text-xl font-semibold text-[#D946EF] mb-4">Paso 2: Relación entre Actores y Temas</h3>
        <p className="text-sm text-gray-600 mb-4">Seleccione un actor de la lista para definir sus relaciones de conflicto o colaboración con otros actores.</p>
        <div className="mb-6 space-y-2">
            {actors.length === 0 ? <p className="text-gray-500 italic">No hay actores definidos en Paso 1.</p> :
             actors.map(actor => (
                <Button key={actor.id} variant="outline" onClick={() => handleSelectActorForPaso2(actor.id)} className="w-full text-left justify-start p-3">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-pink-500"/>{actor.nombre}
                </Button>
            ))}
        </div>
        <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setCurrentSubStage('viewPaso1List')}>
                <ChevronLeftIcon className="h-5 w-5 mr-1"/> Volver a Paso 1
            </Button>
            <Button variant="secondary" onClick={handleProceedToPaso3} disabled={actors.length === 0}>
                Continuar a Paso 3: Gráfico Poder/Interés <ArrowRightIcon className="h-5 w-5 ml-1"/>
            </Button>
        </div>
      </ToolCard>
    );
  }
  
  if (currentSubStage === 'definePaso2Relationships' && selectedActorForPaso2Details) {
    return (
      <ToolCard title="H5.1. Relación de los Actores con el Paisaje">
        <h3 className="text-xl font-semibold text-[#D946EF] mb-1">Paso 2: Relación entre Actores y Temas</h3>
        <p className="text-md text-gray-700 mb-4">Definiendo relaciones para: <strong className="text-pink-600">{selectedActorForPaso2Details.nombre}</strong></p>
        
        {otherActorsForPaso2.length === 0 ? (
          <p className="text-gray-500 italic">No hay otros actores con quienes definir relaciones.</p>
        ) : (
          <div className="space-y-4">
            {otherActorsForPaso2.map(otherActor => {
              const currentRel = relationshipEdits[otherActor.id] || { relationshipType: '', theme: '' };
              return (
                <div key={otherActor.id} className="p-3 border rounded-md bg-gray-50/50">
                  <p className="font-semibold text-gray-800 mb-2">Con: {otherActor.nombre}</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Select
                      label="Relación"
                      options={[
                        { value: '', label: 'Seleccione...' },
                        { value: 'Conflicto', label: 'En Conflicto' },
                        { value: 'Colaboracion', label: 'En Colaboración' },
                        { value: 'N/A', label: 'N/A' },
                      ]}
                      value={currentRel.relationshipType}
                      onChange={(e) => handleRelationshipEditChange(otherActor.id, 'relationshipType', e.target.value)}
                    />
                    <Input
                      label="Tema/Razón"
                      value={currentRel.theme}
                      onChange={(e) => handleRelationshipEditChange(otherActor.id, 'theme', e.target.value)}
                      placeholder="Describa el tema del conflicto/colaboración"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => { setCurrentSubStage('viewPaso2ActorSelection'); setRelationshipEdits({}); setSelectedActorForPaso2Id(null); }}>
                <ChevronLeftIcon className="h-5 w-5 mr-1"/> Volver a Selección de Actor
            </Button>
            <Button variant="primary" onClick={handleSavePaso2Relationships} disabled={otherActorsForPaso2.length === 0}>
                <CheckIcon className="h-5 w-5 mr-1"/> Guardar Relaciones para {selectedActorForPaso2Details.nombre}
            </Button>
        </div>
      </ToolCard>
    );
  }

  if (currentSubStage === 'viewPaso3Plot') {
    const graphSize = 320; 
    const plotAreaSize = 300;
    const pointSize = 20; 

    return (
        <ToolCard title="H5.1. Relación de los Actores con el Paisaje">
            <h3 className="text-xl font-semibold text-[#D946EF] mb-4">Paso 3: Gráfico Poder/Interés</h3>
            <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Tabla de Actores:</h4>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-pink-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Actor</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Poder</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Interés</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase">Letra</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {actors.map(actor => (
                                <tr key={actor.id}>
                                    <td className="px-4 py-2 text-sm text-gray-800">{actor.nombre}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{actor.poder}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{actor.interes}</td>
                                    <td className="px-4 py-2 text-sm font-bold text-pink-600">{actor.letraDiagrama || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">Gráfico Poder vs. Interés:</h4>
                <div className=""> {/* Removed flex justify-center to align left */}
                    <div className="grid grid-cols-[auto,1fr] gap-0 items-end" style={{ width: `${graphSize}px`, height: `${graphSize}px` }}>
                        <div className="text-sm text-center transform -rotate-90 origin-center whitespace-nowrap translate-x-[-125px] translate-y-[140px]" style={{width:`${plotAreaSize}px`}}>Poder</div>
                        <div className="relative border-l-2 border-b-2 border-gray-700" style={{ width: `${plotAreaSize}px`, height: `${plotAreaSize}px` }}>
                            {[0, 2, 4, 5, 6, 8, 10].map(val => (
                                <div key={`y-${val}`} className="absolute text-xs text-gray-600" style={{ left: -18, bottom: `${(val / 10) * 100}%`, transform: 'translateY(50%)' }}>{val}</div>
                            ))}
                            <div className="absolute w-full border-t border-dashed border-gray-400" style={{ bottom: '50%' }}></div>
                            {[0, 2, 4, 5, 6, 8, 10].map(val => (
                                <div key={`x-${val}`} className="absolute text-xs text-gray-600" style={{ bottom: -18, left: `${(val / 10) * 100}%`, transform: 'translateX(-50%)' }}>{val}</div>
                            ))}
                            <div className="absolute h-full border-l border-dashed border-gray-400" style={{ left: '50%' }}></div>
                            {actors.filter(a=>a.letraDiagrama).map(actor => (
                                <div
                                    key={actor.id}
                                    title={`${actor.nombre} (P:${actor.poder}, I:${actor.interes})`}
                                    className="absolute bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg"
                                    style={{
                                        left: `calc(${(actor.interes / 10) * 100}% - ${pointSize / 2}px)`,
                                        bottom: `calc(${(actor.poder / 10) * 100}% - ${pointSize / 2}px)`,
                                        width: `${pointSize}px`,
                                        height: `${pointSize}px`,
                                    }}
                                >
                                    {actor.letraDiagrama}
                                </div>
                            ))}
                        </div>
                        <div></div> 
                        <div className="text-sm text-center pt-1">Interés</div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentSubStage('viewPaso2ActorSelection')}>
                    <ChevronLeftIcon className="h-5 w-5 mr-1"/> Volver a Paso 2
                </Button>
                <Button variant="primary" onClick={() => navigate('/paso5/herramienta5_2')}>
                    Finalizar H5.1 y Continuar a H5.2 <ArrowRightIcon className="h-5 w-5 ml-1"/>
                </Button>
            </div>
        </ToolCard>
    );
  }

  return (
    <ToolCard
      title="H5.1. Relación de los Actores con el Paisaje"
      objetivo="Identificar y caracterizar los actores clave en el paisaje (Paso 1), definir las relaciones de conflicto o colaboración entre ellos (Paso 2), y visualizar su poder e interés (Paso 3)."
    >
      <h3 className="text-xl font-semibold text-[#D946EF] mb-4 flex items-center">
        <UsersIcon className="h-6 w-6 mr-2"/> Paso 1: Actores y su Relación con el Paisaje
      </h3>
      <div className="mb-6 flex justify-end">
        <Button onClick={handleAddNewPaso1} variant="primary">
          <PlusIcon className="h-5 w-5 mr-1" /> Añadir Actor Clave
        </Button>
      </div>
      {actors.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No se han añadido actores todavía.</p>
      ) : (
        <div className="space-y-4">
          {actors.map(actor => (
            <div key={actor.id} className="p-4 border border-[#F472B6]/70 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-[#D946EF] flex items-center"><UserGroupIcon className="h-6 w-6 mr-2 opacity-80"/>{actor.nombre}</h4>
                <div className="space-x-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditPaso1Actor(actor)} className="border-gray-300 hover:bg-gray-100"><PencilIcon className="h-4 w-4" /></Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeletePaso1Actor(actor.id)}><TrashIcon className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4 text-sm mb-3">
                <div className="flex items-start md:col-span-3"><LinkIcon className="h-4 w-4 mr-1.5 text-gray-500 mt-0.5 flex-shrink-0"/><div><strong>Relación:</strong> {(Array.isArray(actor.medioVidaServicioRelacionado) && actor.medioVidaServicioRelacionado.length > 0) ? actor.medioVidaServicioRelacionado.join(', ') : <span className="text-gray-400 italic">N/A</span>}</div></div>
                <div className="flex items-center"><TagIcon className="h-4 w-4 mr-1.5 text-gray-500"/><div><strong>Tipo:</strong> {actor.tipo || <span className="text-gray-400 italic">N/A</span>}</div></div>
                <div className="flex items-center"><GlobeAltIcon className="h-4 w-4 mr-1.5 text-gray-500"/><div><strong>Alcance:</strong> {actor.alcance}</div></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm pt-2 border-t border-pink-100">
                <div className="flex items-center p-2 bg-pink-50/50 rounded-md"><BoltIcon className="h-5 w-5 mr-2 text-pink-500"/><div><strong>Poder:</strong> <span className="font-bold text-lg text-pink-600">{actor.poder}</span> / 10</div></div>
                <div className="flex items-center p-2 bg-pink-50/50 rounded-md"><LightBulbIcon className="h-5 w-5 mr-2 text-pink-500"/><div><strong>Interés:</strong> <span className="font-bold text-lg text-pink-600">{actor.interes}</span> / 10</div></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setCurrentSubStage('viewPaso2ActorSelection')}
          disabled={actors.length === 0}
          title={actors.length === 0 ? "Añada actores en Paso 1 antes de continuar" : ""}
        >
          Continuar a Paso 2: Relación entre Actores <ArrowRightIcon className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </ToolCard>
  );
};