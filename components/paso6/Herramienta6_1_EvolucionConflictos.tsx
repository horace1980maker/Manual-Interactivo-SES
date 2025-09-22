import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { StyledRadioSelect } from '../common/StyledRadioSelect';
import { AmenazaMedioVidaConflicto, AmenazaServicioEcosistemicoConflicto, ConflictoEvolucion, EventoConflicto, ServicioEcosistemicoCardItem } from '../../types';
import { serviciosEcosistemicosData } from '../../data/serviciosEcosistemicosData';
import { PlusIcon, TrashIcon, ChevronLeftIcon, CheckIcon as CheckMarkIcon, ArrowRightIcon, InformationCircleIcon, ArrowsUpDownIcon, CalendarDaysIcon, HandThumbUpIcon, HandThumbDownIcon, ChatBubbleBottomCenterTextIcon, CalculatorIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SESSION_STORAGE_H421_CONFLICTS_KEY = 'characterizedMedioVidaConflicts_H421';
const SESSION_STORAGE_H422_CONFLICTS_KEY = 'characterizedServicioEcosistemicoConflicts_H422';
const SESSION_STORAGE_H61_EVOLUCION_KEY = 'H61_EVOLUCION_CONFLICTOS_KEY';

const CONFLICT_TYPE_DESCRIPTIONS: Record<string, string> = {
  'C1': "Competencia por recursos naturales: Disputas o tensiones por el acceso, uso o control del agua, suelo, bosques, biodiversidad, entre otros.",
  'C2': "Desigualdad intergeneracional o de género: Diferencias marcadas en el acceso a recursos, toma de decisiones o beneficios, que afectan especialmente a mujeres, jóvenes o personas mayores.",
  'C3': "Marginalización, tensión comunitaria o disturbios sociales: Exclusión de grupos sociales, conflictos internos en comunidades o manifestaciones por demandas no atendidas.",
  'C4': "Falta de comunicación y colaboración entre actores: Descoordinación o desconfianza entre comunidades, autoridades, empresas u otras instituciones clave.",
  'C5': "Instituciones frágiles o ineficientes: Falta de presencia estatal, debilidad en la gobernanza local o ausencia de mecanismos eficaces de resolución de conflictos.",
  'C6': "Violencia, asesinatos o presencia de grupos armados: Situaciones de alto riesgo asociadas a actores armados, violencia directa o amenazas a líderes sociales o ambientales.",
  'C7': "Migración y desplazamientos forzados: Movilidad obligada de poblaciones por causas ambientales, sociales o de seguridad, que genera presión o conflicto en otras áreas."
};

const initialEventoFormData: Omit<EventoConflicto, 'totalTension'> = {
    acontecimiento: '',
    ano: '',
    diferencias: 0, 
    factorDiferencias: '',
    cooperacion: 0, 
    factorCooperacion: '',
};

const diferenciasOptions: Array<{ value: 1 | 0 | -1; display: string }> = [
    { value: 1, display: "Tolerables (+1)" },
    { value: 0, display: "Intermedias (0)" },
    { value: -1, display: "Intolerables (-1)" },
];

const cooperacionOptions: Array<{ value: 1 | 0 | -1; display: string }> = [
    { value: 1, display: "Alta (+1)" },
    { value: 0, display: "Media (0)" },
    { value: -1, display: "Baja (-1)" },
];

const getTextForValue = (options: typeof diferenciasOptions | typeof cooperacionOptions, val: number) => {
    return options.find(opt => opt.value === val)?.display || 'N/A';
};

interface CombinedConflictDisplay {
  id: string; // Original conflict ID from H4.2.x
  amenaza: string;
  afectadoNombre: string; // MdV name or SE name
  afectadoTipo: 'Medio de Vida' | 'Servicio Ecosistémico';
  nivelConflicto?: 'L' | 'M' | 'G' | 'NINGUNO';
  tipoConflictoCodigo?: string;
  descripcionConflicto?: string;
}

type Stage = 'selectConflict' | 'detailEventos';

export const Herramienta6_1_EvolucionConflictos: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState<Stage>('selectConflict');
  const [isLoading, setIsLoading] = useState(true);

  const [allH421Conflicts, setAllH421Conflicts] = useState<AmenazaMedioVidaConflicto[]>([]);
  const [allH422Conflicts, setAllH422Conflicts] = useState<AmenazaServicioEcosistemicoConflicto[]>([]);
  const [serviciosData, setServiciosData] = useState<ServicioEcosistemicoCardItem[]>(serviciosEcosistemicosData);

  const [selectedConflictContext, setSelectedConflictContext] = useState<CombinedConflictDisplay | null>(null);
  
  const [currentEventoForm, setCurrentEventoForm] = useState(initialEventoFormData);
  
  const [eventosForSelectedConflict, setEventosForSelectedConflict] = useState<EventoConflicto[]>([]);
  const [allConflictEvolutions, setAllConflictEvolutions] = useState<ConflictoEvolucion[]>([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      const h421Raw = sessionStorage.getItem(SESSION_STORAGE_H421_CONFLICTS_KEY);
      setAllH421Conflicts(h421Raw ? JSON.parse(h421Raw) : []);

      const h422Raw = sessionStorage.getItem(SESSION_STORAGE_H422_CONFLICTS_KEY);
      setAllH422Conflicts(h422Raw ? JSON.parse(h422Raw) : []);
      
      const h61EvolutionsRaw = sessionStorage.getItem(SESSION_STORAGE_H61_EVOLUCION_KEY);
      setAllConflictEvolutions(h61EvolutionsRaw ? JSON.parse(h61EvolutionsRaw) : []);

    } catch (error) {
      console.error("Error loading data for H6.1:", error);
    }
    setIsLoading(false);
  }, []);

  const combinedConflictsForSelection = useMemo<CombinedConflictDisplay[]>(() => {
    const combined: CombinedConflictDisplay[] = [];
    allH421Conflicts.forEach(c => {
      if (c.amenaza && c.medioDeVida) { 
        combined.push({
          id: c.id,
          amenaza: c.amenaza,
          afectadoNombre: c.medioDeVida,
          afectadoTipo: 'Medio de Vida',
          nivelConflicto: c.nivelConflicto,
          tipoConflictoCodigo: c.tipoConflictoCodigo,
          descripcionConflicto: c.descripcionConflicto,
        });
      }
    });
    allH422Conflicts.forEach(c => {
      if (c.amenaza && c.codigoSE) { 
        const servicio = serviciosData.find(s => s.codigo === c.codigoSE);
        combined.push({
          id: c.id,
          amenaza: c.amenaza,
          afectadoNombre: servicio ? `${servicio.nombre} (${c.codigoSE})` : c.codigoSE,
          afectadoTipo: 'Servicio Ecosistémico',
          nivelConflicto: c.nivelConflicto,
          tipoConflictoCodigo: c.tipoConflictoCodigo,
          descripcionConflicto: c.descripcionConflicto,
        });
      }
    });
    return combined;
  }, [allH421Conflicts, allH422Conflicts, serviciosData]);

  const { mdvConflicts, seConflicts } = useMemo(() => {
    const mdv: CombinedConflictDisplay[] = [];
    const se: CombinedConflictDisplay[] = [];
    combinedConflictsForSelection.forEach(conflict => {
        if (conflict.afectadoTipo === 'Medio de Vida') {
            mdv.push(conflict);
        } else {
            se.push(conflict);
        }
    });
    return { mdvConflicts: mdv, seConflicts: se };
  }, [combinedConflictsForSelection]);


  const handleSelectConflict = (conflict: CombinedConflictDisplay) => {
    setSelectedConflictContext(conflict);
    const existingEvolution = allConflictEvolutions.find(e => e.id === conflict.id);
    setEventosForSelectedConflict(existingEvolution ? existingEvolution.eventos : []);
    setCurrentEventoForm(initialEventoFormData);
    setCurrentStage('detailEventos');
  };
  
  const handleEventoFormChange = (field: keyof typeof initialEventoFormData, value: string | number) => {
    setCurrentEventoForm(prev => ({ ...prev, [field]: value }));
  };


  const handleAddEvento = () => {
    if (!currentEventoForm.acontecimiento.trim() || !currentEventoForm.ano.trim()) {
      alert("Por favor, ingrese tanto el Acontecimiento como el Año.");
      return;
    }
    const newEvento: EventoConflicto = {
      ...currentEventoForm,
      acontecimiento: currentEventoForm.acontecimiento.trim(),
      ano: currentEventoForm.ano.trim(),
      totalTension: (currentEventoForm.diferencias as number) + (currentEventoForm.cooperacion as number),
    };
    setEventosForSelectedConflict(prev => [...prev, newEvento]);
    setCurrentEventoForm(initialEventoFormData); // Reset form
  };

  const handleDeleteEvento = (index: number) => {
    setEventosForSelectedConflict(prev => prev.filter((_, i) => i !== index));
  };

  const handleSortEventosByYear = () => {
    setEventosForSelectedConflict(prev => 
        [...prev].sort((a, b) => {
            const yearA = parseInt(a.ano);
            const yearB = parseInt(b.ano);
            if (isNaN(yearA) && isNaN(yearB)) return 0;
            if (isNaN(yearA)) return 1; // Put non-numeric years at the end
            if (isNaN(yearB)) return -1;
            return yearA - yearB;
        })
    );
  };
  
  const handleSaveEvolucionYVolver = () => {
    if (!selectedConflictContext) return;

    const newEvolutionEntry: ConflictoEvolucion = {
      id: selectedConflictContext.id,
      eventos: eventosForSelectedConflict,
    };

    const existingEntryIndex = allConflictEvolutions.findIndex(e => e.id === selectedConflictContext.id);
    let updatedEvolutions;
    if (existingEntryIndex > -1) {
      updatedEvolutions = [...allConflictEvolutions];
      updatedEvolutions[existingEntryIndex] = newEvolutionEntry;
    } else {
      updatedEvolutions = [...allConflictEvolutions, newEvolutionEntry];
    }
    
    setAllConflictEvolutions(updatedEvolutions);
    sessionStorage.setItem(SESSION_STORAGE_H61_EVOLUCION_KEY, JSON.stringify(updatedEvolutions));
    
    setSelectedConflictContext(null);
    setEventosForSelectedConflict([]);
    setCurrentStage('selectConflict');
  };

  const renderConflictSelectionList = (list: CombinedConflictDisplay[], title: string) => (
    <>
        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-2">{title}</h4>
        {list.length === 0 ? (
            <p className="text-sm text-gray-500">No hay conflictos de este tipo disponibles.</p>
        ) : (
            <div className="space-y-3">
                {list.map(conflict => {
                    const isProcessed = allConflictEvolutions.some(ev => ev.id === conflict.id);
                    return (
                        <div key={conflict.id} 
                             className={`p-4 border rounded-lg shadow-sm transition-shadow hover:shadow-md ${isProcessed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Amenaza: <span className="font-medium text-gray-700">{conflict.amenaza}</span></p>
                                    <p className="text-sm text-gray-500">Afecta a: <span className="font-medium text-gray-700">{conflict.afectadoNombre} ({conflict.afectadoTipo})</span></p>
                                </div>
                                {isProcessed && <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" title="Evolución registrada"/>}
                            </div>
                            <div className="mt-2 mb-2 p-2 bg-gray-50 rounded-md">
                                <p className="text-xs font-semibold text-gray-700">Detalles del Conflicto Original (H4.2):</p>
                                <p className="text-xs text-gray-600"><strong>Nivel:</strong> {conflict.nivelConflicto || "N/A"}</p>
                                <p className="text-xs text-gray-600"><strong>Tipo(s):</strong> {conflict.tipoConflictoCodigo || "N/A"}</p>
                                <p className="text-xs text-gray-600"><strong>Descripción:</strong> {conflict.descripcionConflicto || "N/A"}</p>
                                {conflict.tipoConflictoCodigo?.split(',').map(code => CONFLICT_TYPE_DESCRIPTIONS[code.trim()] ? (
                                    <p key={code} className="text-[10px] text-gray-500 pl-2 mt-0.5"><em>{code.trim()}: {CONFLICT_TYPE_DESCRIPTIONS[code.trim()]}</em></p>
                                ) : null)}
                            </div>
                            <Button onClick={() => handleSelectConflict(conflict)} variant="secondary" size="sm" className="w-full sm:w-auto">
                                {isProcessed ? "Editar Evolución" : "Analizar Evolución"} de Este Conflicto <ArrowRightIcon className="h-4 w-4 ml-1"/>
                            </Button>
                        </div>
                    );
                })}
            </div>
        )}
    </>
  );


  if (isLoading) {
    return <ToolCard title="H6.1 Evolución de los Conflictos"><p>Cargando datos...</p></ToolCard>;
  }

  if (currentStage === 'selectConflict') {
    return (
      <ToolCard 
        title="Herramienta 6.1 - Paso 1: Seleccionar Conflicto para Analizar Evolución"
        objetivo="Elija una situación de conflicto o tensión (identificada en H4.2.1 o H4.2.2) para detallar su evolución a través de acontecimientos clave."
      >
        {combinedConflictsForSelection.length === 0 ? (
          <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200 text-yellow-700 flex items-center">
            <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />
            No hay situaciones de conflicto/tensión caracterizadas en H4.2.1 o H4.2.2. Por favor, complete esos pasos primero.
          </div>
        ) : (
          <>
            {renderConflictSelectionList(mdvConflicts, "Conflictos y Medios de Vida (de H4.2.1)")}
            {renderConflictSelectionList(seConflicts, "Conflictos y Servicios Ecosistémicos (de H4.2.2)")}
          </>
        )}
        <div className="mt-8 text-center">
            <Button onClick={() => navigate('/paso6/herramienta6_2')} variant="primary" size="lg" disabled={combinedConflictsForSelection.length === 0}>
                Ir a H6.2 (Actores Involucrados) <ArrowRightIcon className="h-5 w-5 ml-2"/>
            </Button>
        </div>
      </ToolCard>
    );
  }

  if (currentStage === 'detailEventos' && selectedConflictContext) {
    return (
      <ToolCard 
        title={`Herramienta 6.1 - Paso 2: Detallar Evolución del Conflicto`}
        objetivo={`Añadir los acontecimientos clave en la evolución del conflicto seleccionado, incluyendo año, nivel de diferencias, cooperación y factores asociados.`}
      >
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-indigo-700 mb-1">Conflicto Seleccionado:</h4>
            <p className="text-sm text-gray-700"><strong>Amenaza:</strong> {selectedConflictContext.amenaza}</p>
            <p className="text-sm text-gray-700"><strong>Afectando a:</strong> {selectedConflictContext.afectadoNombre} ({selectedConflictContext.afectadoTipo})</p>
            <p className="text-sm text-gray-600 mt-1"><em>Descripción Original (H4.2): {selectedConflictContext.descripcionConflicto || "N/A"}</em></p>
        </div>

        <div className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-md">
            <h5 className="text-md font-semibold text-gray-800 mb-3">Añadir Nuevo Acontecimiento</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                    label="Acontecimiento (Descripción)"
                    value={currentEventoForm.acontecimiento}
                    onChange={e => handleEventoFormChange('acontecimiento', e.target.value)}
                    placeholder="Describa el evento clave..."
                    rows={3}
                    wrapperClassName="md:col-span-2"
                />
                <Input
                    label="Año"
                    type="text" 
                    value={currentEventoForm.ano}
                    onChange={e => handleEventoFormChange('ano', e.target.value)}
                    placeholder="Ej: 2023"
                />
                 <div> {/* Placeholder for alignment */} </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                 <div style={{ contain: 'layout' }}> {/* Wrapper for Diferencias */}
                    <StyledRadioSelect
                        label="Diferencias"
                        name="diferencias"
                        options={diferenciasOptions}
                        value={currentEventoForm.diferencias}
                        onChange={(val) => handleEventoFormChange('diferencias', val as -1 | 0 | 1)}
                    />
                    <Textarea
                        label="Factor Diferencias"
                        value={currentEventoForm.factorDiferencias}
                        onChange={e => handleEventoFormChange('factorDiferencias', e.target.value)}
                        placeholder="Causas o factores clave..."
                        rows={2}
                        wrapperClassName="mt-2"
                    />
                </div>
                <div style={{ contain: 'layout' }}> {/* Wrapper for Cooperación */}
                    <StyledRadioSelect
                        label="Cooperación"
                        name="cooperacion"
                        options={cooperacionOptions}
                        value={currentEventoForm.cooperacion}
                        onChange={(val) => handleEventoFormChange('cooperacion', val as -1 | 0 | 1)}
                    />
                    <Textarea
                        label="Factor Cooperación"
                        value={currentEventoForm.factorCooperacion}
                        onChange={e => handleEventoFormChange('factorCooperacion', e.target.value)}
                        placeholder="Acciones o factores clave..."
                        rows={2}
                        wrapperClassName="mt-2"
                    />
                </div>
            </div>
            <div className="mt-4 text-right">
                <Button onClick={handleAddEvento} variant="primary" size="md">
                    <PlusIcon className="h-5 w-5 mr-1"/>Añadir Acontecimiento
                </Button>
            </div>
        </div>

        {eventosForSelectedConflict.length > 0 && (
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h5 className="text-md font-semibold text-gray-700">Acontecimientos Añadidos:</h5>
                    <Button onClick={handleSortEventosByYear} variant="outline" size="sm">
                        <ArrowsUpDownIcon className="h-4 w-4 mr-1"/> Ordenar por Año
                    </Button>
                </div>
                <div className="space-y-3">
                    {eventosForSelectedConflict.map((evento, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-white shadow">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm font-semibold text-indigo-600">
                                    <CalendarDaysIcon className="h-4 w-4 inline mr-1 opacity-70"/> Año {evento.ano}: <span className="text-gray-800 font-normal">{evento.acontecimiento}</span>
                                </p>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteEvento(index)}>
                                    <TrashIcon className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                <div>
                                    <p className="font-medium text-gray-600 flex items-center"><HandThumbDownIcon className="h-4 w-4 mr-1 text-red-500 opacity-80"/>Diferencias: <span className="font-normal ml-1">{getTextForValue(diferenciasOptions, evento.diferencias)}</span></p>
                                    <p className="text-gray-500 pl-4 whitespace-pre-wrap">Factor: {evento.factorDiferencias || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-600 flex items-center"><HandThumbUpIcon className="h-4 w-4 mr-1 text-green-500 opacity-80"/>Cooperación: <span className="font-normal ml-1">{getTextForValue(cooperacionOptions, evento.cooperacion)}</span></p>
                                    <p className="text-gray-500 pl-4 whitespace-pre-wrap">Factor: {evento.factorCooperacion || "N/A"}</p>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100 text-right">
                                <p className="text-sm font-semibold text-indigo-700 flex items-center justify-end">
                                  <CalculatorIcon className="h-4 w-4 mr-1 opacity-70"/> Total Tensión: <span className="text-lg ml-1.5 px-2 py-0.5 rounded bg-indigo-100">{evento.totalTension}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div> {/* Corrected from </ul> to </div> */}
            </div>
        )}

        <div className="mt-8 flex justify-between">
            <Button onClick={() => {
                setSelectedConflictContext(null);
                setEventosForSelectedConflict([]);
                setCurrentStage('selectConflict');
            }} variant="outline" size="md">
                <ChevronLeftIcon className="h-5 w-5 mr-1"/> Cancelar y Volver
            </Button>
            <Button onClick={handleSaveEvolucionYVolver} variant="secondary" size="lg">
                <CheckMarkIcon className="h-5 w-5 mr-1"/> Guardar Evolución y Volver
            </Button>
        </div>
      </ToolCard>
    );
  }
  
  return <ToolCard title="H6.1"><p>Error: Estado no reconocido.</p></ToolCard>;
};