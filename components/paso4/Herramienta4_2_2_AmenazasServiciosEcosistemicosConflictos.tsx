import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { StyledRadioSelect } from '../common/StyledRadioSelect';
import { AmenazaClimatica, AmenazaNoClimatica, ServicioEcosistemicoCardItem, AmenazaServicioEcosistemicoConflicto } from '../../types';
import { serviciosEcosistemicosData } from '../../data/serviciosEcosistemicosData';
import { PlusIcon, TrashIcon, ArrowRightIcon, ChevronLeftIcon, CheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const H4_1_CLIMATIC_THREATS_KEY = 'climaticThreatsData_H41';
const H4_1_NON_CLIMATIC_THREATS_KEY = 'nonClimaticThreatsData_H41';
const H4_2_2_CHARACTERIZED_CONFLICTS_KEY = 'characterizedServicioEcosistemicoConflicts_H422';
const H35_TARGETED_SERVICE_CODES_KEY = 'H35_TARGETED_SERVICE_CODES_KEY'; // For loading relevant services

type Stage = 'viewList' | 'selectThreat' | 'selectService' | 'detailConflict';

const initialConflictDetailState: Omit<AmenazaServicioEcosistemicoConflicto, 'id' | 'amenaza' | 'codigoSE' | 'nombreServicioEcosistemico'> = {
  medioDeVida: '', 
  economica: 0, alimentaria: 0, sanitaria: 0, ambiental: 0, personal: 0, comunitaria: 0, politica: 0,
  numeroFamilias: '', 
  impactoDiferenciado: '',
  observacionesImpacto: '', 
  familiasImpactadas: '',
  conflictoGenerado: '', 
  tipoConflictoCodigo: '', 
  nivelConflicto: 'NINGUNO', 
  descripcionConflicto: '', 
  mapeoConflictoCodigo: '',
};

const initialImpactoDiferenciadoCheckboxes = {
    hombres: false,
    mujeres: false,
    jovenes: false,
    gruposMarginados: false,
};

const ratingOptions: Array<{ value: number; display: string }> = [
  { value: 0, display: '0' }, { value: 1, display: '1' },
  { value: 2, display: '2' }, { value: 3, display: '3' }
];

const nivelConflictoOptions: Array<{ value: 'L' | 'M' | 'G' | 'NINGUNO'; display: string }> = [
  { value: 'NINGUNO', display: 'No hay Conflicto' },
  { value: 'L', display: 'L (Leves)' },
  { value: 'M', display: 'M (Moderados)' },
  { value: 'G', display: 'G (Graves)' },
];

const tipoConflictoCodesC1C7: Array<{ code: string; label: string }> = Array.from({ length: 7 }, (_, i) => ({
  code: `C${i + 1}`, label: `C${i + 1}`
}));

type AmenazaServicioEcosistemicoDimensionKey = 'politica' | 'economica' | 'alimentaria' | 'sanitaria' | 'ambiental' | 'personal' | 'comunitaria';

export const Herramienta4_2_2_AmenazasServiciosEcosistemicosConflictos: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState<Stage>('viewList');
  const [isLoading, setIsLoading] = useState(true);
  
  // Updated state for climatic threats and their names
  const [allClimaticThreats, setAllClimaticThreats] = useState<AmenazaClimatica[]>([]);
  const [climaticThreatNames, setClimaticThreatNames] = useState<Set<string>>(new Set());

  const [allNonClimaticThreats, setAllNonClimaticThreats] = useState<AmenazaNoClimatica[]>([]);
  const [relevantEcosystemServices, setRelevantEcosystemServices] = useState<ServicioEcosistemicoCardItem[]>([]);

  const [selectedThreat, setSelectedThreat] = useState<AmenazaClimatica | AmenazaNoClimatica | null>(null);
  const [selectedService, setSelectedService] = useState<ServicioEcosistemicoCardItem | null>(null);
  
  const [conflictDetails, setConflictDetails] = useState(initialConflictDetailState);
  const [impactoDiferenciadoChecks, setImpactoDiferenciadoChecks] = useState(initialImpactoDiferenciadoCheckboxes);
  const [selectedTipoConflictoCodes, setSelectedTipoConflictoCodes] = useState<string[]>([]);
  const [characterizedConflicts, setCharacterizedConflicts] = useState<AmenazaServicioEcosistemicoConflicto[]>([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      const climaticRaw = sessionStorage.getItem(H4_1_CLIMATIC_THREATS_KEY);
      const loadedClimaticThreats: AmenazaClimatica[] = climaticRaw ? JSON.parse(climaticRaw) : [];
      setAllClimaticThreats(loadedClimaticThreats);
      setClimaticThreatNames(new Set(loadedClimaticThreats.map(t => t.nombre)));

      const nonClimaticRaw = sessionStorage.getItem(H4_1_NON_CLIMATIC_THREATS_KEY);
      setAllNonClimaticThreats(nonClimaticRaw ? JSON.parse(nonClimaticRaw) : []);
      
      const targetedServiceCodesRaw = sessionStorage.getItem(H35_TARGETED_SERVICE_CODES_KEY);
      const targetedServiceCodes: string[] = targetedServiceCodesRaw ? JSON.parse(targetedServiceCodesRaw) : [];
      setRelevantEcosystemServices(serviciosEcosistemicosData.filter(s => targetedServiceCodes.includes(s.codigo)));
            
      const characterizedRaw = sessionStorage.getItem(H4_2_2_CHARACTERIZED_CONFLICTS_KEY);
      setCharacterizedConflicts(characterizedRaw ? JSON.parse(characterizedRaw) : []);

    } catch (error) {
      console.error("Error loading data for H4.2.2:", error);
    }
    setIsLoading(false);
  }, []);

  const handleAddNewCharacterization = () => {
    setSelectedThreat(null);
    setSelectedService(null);
    setConflictDetails(initialConflictDetailState);
    setImpactoDiferenciadoChecks(initialImpactoDiferenciadoCheckboxes);
    setSelectedTipoConflictoCodes([]);
    setCurrentStage('selectThreat');
  };

  const handleThreatSelect = (threat: AmenazaClimatica | AmenazaNoClimatica) => {
    setSelectedThreat(threat);
    setCurrentStage('selectService');
  };

  const handleServiceSelect = (service: ServicioEcosistemicoCardItem) => {
    setSelectedService(service);
    setCurrentStage('detailConflict');
  };

  const handleDetailChange = (field: keyof typeof initialConflictDetailState, value: any) => {
    setConflictDetails(prev => {
        const newState = { ...prev, [field]: value };
        if (field === 'nivelConflicto' && value === 'NINGUNO') {
            newState.tipoConflictoCodigo = '';
            newState.descripcionConflicto = '';
            setSelectedTipoConflictoCodes([]);
        }
        return newState;
    });
  };

   const handleTipoConflictoCodeChange = (code: string) => {
    setSelectedTipoConflictoCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

   const handleImpactoDiferenciadoCheckChange = (field: keyof typeof initialImpactoDiferenciadoCheckboxes) => {
    setImpactoDiferenciadoChecks(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveConflict = () => {
    if (!selectedThreat || !selectedService) return;

    const impactoDifArray: string[] = [];
    if (impactoDiferenciadoChecks.hombres) impactoDifArray.push('H');
    if (impactoDiferenciadoChecks.mujeres) impactoDifArray.push('M');
    if (impactoDiferenciadoChecks.jovenes) impactoDifArray.push('J');
    if (impactoDiferenciadoChecks.gruposMarginados) impactoDifArray.push('GM');
    const impactoDiferenciadoString = impactoDifArray.join(',');

    const newEntry: AmenazaServicioEcosistemicoConflicto = {
      id: `${selectedThreat.id}_${selectedService.id}_${Date.now()}`,
      amenaza: selectedThreat.nombre,
      codigoSE: selectedService.codigo,
      nombreServicioEcosistemico: selectedService.nombre, // Store the name
      ...conflictDetails,
      tipoConflictoCodigo: selectedTipoConflictoCodes.join(','),
      impactoDiferenciado: impactoDiferenciadoString,
      medioDeVida: '', 
    };
    const updatedConflicts = [...characterizedConflicts, newEntry];
    setCharacterizedConflicts(updatedConflicts);
    sessionStorage.setItem(H4_2_2_CHARACTERIZED_CONFLICTS_KEY, JSON.stringify(updatedConflicts));
    setCurrentStage('viewList');
  };
  
  const handleDeleteConflict = (id: string) => {
      const updatedConflicts = characterizedConflicts.filter(c => c.id !== id);
      setCharacterizedConflicts(updatedConflicts);
      sessionStorage.setItem(H4_2_2_CHARACTERIZED_CONFLICTS_KEY, JSON.stringify(updatedConflicts));
  };
  
  const categorizedConflicts = useMemo(() => {
    const climatic: AmenazaServicioEcosistemicoConflicto[] = [];
    const nonClimatic: AmenazaServicioEcosistemicoConflicto[] = [];
    characterizedConflicts.forEach(conflict => {
      if (climaticThreatNames.has(conflict.amenaza)) {
        climatic.push(conflict);
      } else {
        nonClimatic.push(conflict);
      }
    });
    return { climatic, nonClimatic };
  }, [characterizedConflicts, climaticThreatNames]);


  if (isLoading) {
    return <ToolCard title="H4.2.2"><p>Cargando datos...</p></ToolCard>;
  }

  if (currentStage === 'selectThreat') {
    return (
      <ToolCard 
        title="H4.2.2 - Paso 1: Seleccionar Amenaza"
        objetivo="Elija una amenaza (climática o no climática) previamente identificada en H4.1."
        >
        <Button onClick={() => setCurrentStage('viewList')} variant="outline" size="sm" className="mb-4">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Lista
        </Button>
        <h4 className="text-lg font-semibold text-[#001F89] mb-2">Amenazas Climáticas</h4>
        {allClimaticThreats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {allClimaticThreats.map(t => <Button key={t.id} onClick={() => handleThreatSelect(t)} variant="outline" className="text-left justify-start p-3 h-auto">{t.nombre}</Button>)}
          </div>
        ) : <p className="text-sm text-gray-500 mb-4">No hay amenazas climáticas definidas en H4.1.</p>}

        <h4 className="text-lg font-semibold text-[#001F89] mb-2">Amenazas No Climáticas</h4>
        {allNonClimaticThreats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {allNonClimaticThreats.map(t => <Button key={t.id} onClick={() => handleThreatSelect(t)} variant="outline" className="text-left justify-start p-3 h-auto">{t.nombre}</Button>)}
          </div>
        ) : <p className="text-sm text-gray-500">No hay amenazas no climáticas definidas en H4.1.</p>}
      </ToolCard>
    );
  }

  if (currentStage === 'selectService' && selectedThreat) {
    return (
      <ToolCard 
        title={`H4.2.2 - Paso 2: Seleccionar Servicio Ecosistémico para "${selectedThreat.nombre}"`}
        objetivo="Elija un servicio ecosistémico (de los relevantes de H3.5) que es afectado por la amenaza seleccionada."
      >
        <Button onClick={() => setCurrentStage('selectThreat')} variant="outline" size="sm" className="mb-4">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Seleccionar Amenaza
        </Button>
        <h4 className="text-lg font-semibold text-[#001F89] mb-2">Servicios Ecosistémicos Relevantes (de H3.5)</h4>
        {relevantEcosystemServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {relevantEcosystemServices.map(se => <Button key={se.id} onClick={() => handleServiceSelect(se)} variant="outline" className="text-left justify-start p-3 h-auto">{se.nombre} ({se.codigo})</Button>)}
          </div>
        ) : <p className="text-sm text-gray-500">No hay servicios ecosistémicos relevantes identificados desde H3.5. Verifique la caracterización de ecosistemas en H3.4 y el flujo de H3.5.</p>}
      </ToolCard>
    );
  }
  
  if (currentStage === 'detailConflict' && selectedThreat && selectedService) {
     const dimensionFields: Array<{key: AmenazaServicioEcosistemicoDimensionKey, label: string}> = [
        {key: 'politica', label: 'Política'}, {key: 'economica', label: 'Económica'},
        {key: 'alimentaria', label: 'Alimentaria'}, {key: 'sanitaria', label: 'Sanitaria'},
        {key: 'ambiental', label: 'Ambiental'}, {key: 'personal', label: 'Personal'},
        {key: 'comunitaria', label: 'Comunitaria'}
    ];
    const isConflictoDisabled = conflictDetails.nivelConflicto === 'NINGUNO';

    return (
      <ToolCard 
        title="H4.2.2 - Paso 3: Detallar Impacto y Conflicto"
        objetivo="Caracterizar cómo la amenaza impacta las dimensiones de seguridad relacionadas con el servicio ecosistémico y los conflictos resultantes."
        >
        <div className="mb-6 p-4 bg-[#FDF0F8] border border-[#B71373]/30 rounded-lg shadow">
            <p className="font-bold text-lg text-[#B71373]">Amenaza: <span className="font-normal text-gray-700">{selectedThreat.nombre}</span></p>
            <p className="font-bold text-lg text-[#B71373]">Servicio Ecosistémico: <span className="font-normal text-gray-700">{selectedService.nombre} ({selectedService.codigo})</span></p>
        </div>
        
        <div className="md:flex md:space-x-6">
            <div className="md:w-1/2 space-y-3 mb-6 md:mb-0">
                <h4 className="text-md font-semibold text-gray-800 mb-1">¿Cómo impacta esta AMENAZA sobre las DIMENSIONES DE SEGURIDAD? (0=Nulo, 3=Alto)</h4>
                <div style={{ contain: 'layout' }}> {/* Wrapper for all dimension ratings */}
                    {dimensionFields.map(field => (
                        <div key={field.key} className="mb-1"> {/* Minimal margin for individual items */}
                            <StyledRadioSelect
                                label={field.label}
                                name={`dim-${field.key}`}
                                options={ratingOptions}
                                value={conflictDetails[field.key] as number}
                                onChange={(val) => handleDetailChange(field.key, val)}
                                inline
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:w-1/2 space-y-4">
                 <div className="p-3 border rounded-md bg-gray-50">
                    <p className="text-sm font-medium text-gray-700">Servicio Ecosistémico (SE)</p>
                    <p className="text-lg font-semibold text-[#B71373]">{selectedService.nombre}</p>
                 </div>
                 <Input 
                    label="#familias (dependientes del SE)" 
                    value={String(conflictDetails.numeroFamilias)} 
                    onChange={e => handleDetailChange('numeroFamilias', e.target.value)} 
                    placeholder="Ej: 150"
                    type="text"
                 />
                 <Input 
                    label="Mapeo (código)" 
                    value={String(conflictDetails.mapeoConflictoCodigo)} 
                    onChange={e => handleDetailChange('mapeoConflictoCodigo', e.target.value)} 
                    placeholder="Ej: MC1"
                 />
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-300">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">El impacto sobre <span className="text-[#B71373] font-bold">{selectedService.nombre}</span> ha generado conflictos</h4>
            <div className="grid md:grid-cols-1 gap-x-6 gap-y-4" style={{ contain: 'layout' }}> {/* Scroll fix for Nivel Conflicto */}
                <StyledRadioSelect
                    label="Nivel de Conflicto:"
                    name="nivelConflicto"
                    options={nivelConflictoOptions}
                    value={conflictDetails.nivelConflicto || 'NINGUNO'}
                    onChange={(val) => handleDetailChange('nivelConflicto', val as 'L'|'M'|'G'|'NINGUNO')}
                    inline
                />
            </div>
            <div className={`mt-4 ${isConflictoDisabled ? 'opacity-50' : ''}`} style={{ contain: 'layout' }}> {/* Scroll fix for Tipo Conflicto */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Del tipo (Código - seleccione los que apliquen):</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-3">
                    {tipoConflictoCodesC1C7.map(tc => (
                        <label key={tc.code} className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${selectedTipoConflictoCodes.includes(tc.code) ? 'bg-[#009EE2] text-white' : 'bg-white hover:bg-gray-50'}`}>
                            <input 
                                type="checkbox" 
                                className="sr-only"
                                checked={selectedTipoConflictoCodes.includes(tc.code)}
                                onChange={() => handleTipoConflictoCodeChange(tc.code)}
                                disabled={isConflictoDisabled}
                            />
                            {tc.label}
                        </label>
                    ))}
                </div>
                <Textarea 
                    label="Detalle (del conflicto):" 
                    value={conflictDetails.descripcionConflicto} 
                    onChange={e => handleDetailChange('descripcionConflicto', e.target.value)} 
                    rows={3}
                    placeholder="Describa el conflicto en detalle..."
                    wrapperClassName="mt-4"
                    disabled={isConflictoDisabled}
                    className={isConflictoDisabled ? "bg-gray-100" : ""}
                />
            </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
             <h4 className="text-lg font-semibold text-gray-800 mb-3">Impacto Diferenciado</h4>
             <div className="space-y-2 mb-4">
                {(Object.keys(initialImpactoDiferenciadoCheckboxes) as Array<keyof typeof initialImpactoDiferenciadoCheckboxes>).map(key => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-md">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-[#009EE2] border-gray-300 rounded focus:ring-[#009EE2]"
                            checked={impactoDiferenciadoChecks[key]}
                            onChange={() => handleImpactoDiferenciadoCheckChange(key)}
                        />
                        <span className="text-sm text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1).replace('gruposMarginados', 'Grupos Marginados')}</span>
                    </label>
                ))}
            </div>
            <Input 
                label="Número de familias específicamente impactadas (por la amenaza directa al SE):" 
                value={String(conflictDetails.familiasImpactadas)} 
                onChange={e => handleDetailChange('familiasImpactadas', e.target.value)} 
                placeholder="Ej: 30 o 20%"
            />
            <Textarea 
                label="Observaciones adicionales sobre el impacto:" 
                value={String(conflictDetails.observacionesImpacto)} 
                onChange={e => handleDetailChange('observacionesImpacto', e.target.value)} 
                rows={2}
                placeholder="Detalles sobre cómo afecta a diferentes grupos, si no capturado arriba."
            />
        </div>

        <div className="mt-8 flex justify-between">
          <Button onClick={() => setCurrentStage('selectService')} variant="outline" size="md">
            <ChevronLeftIcon className="h-5 w-5 mr-1"/> Cancelar / Volver
          </Button>
          <Button onClick={handleSaveConflict} variant="primary" size="lg">
            <CheckIcon className="h-5 w-5 mr-1"/> Guardar Caracterización
          </Button>
        </div>
      </ToolCard>
    );
  }

  // viewList Stage (Default)
  const renderConflictList = (list: AmenazaServicioEcosistemicoConflicto[], title: string) => (
    list.length > 0 && (
      <>
        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-2">{title}</h4>
        <div className="space-y-3">
        {list.map(item => {
            const serviceName = item.nombreServicioEcosistemico || serviciosEcosistemicosData.find(s => s.codigo === item.codigoSE)?.nombre || item.codigoSE;
            return (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                      <h5 className="font-semibold text-md text-[#001F89]">{item.amenaza}</h5>
                      <p className="text-sm text-gray-600">afectando a <span className="font-medium">{serviceName} ({item.codigoSE})</span></p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteConflict(item.id)}><TrashIcon className="h-4 w-4"/></Button>
                </div>
                 <p className="text-sm text-gray-700"><strong>Conflicto:</strong> {item.descripcionConflicto || "N/A"} (Nivel: {nivelConflictoOptions.find(opt => opt.value === item.nivelConflicto)?.display || item.nivelConflicto}, Tipo: {item.tipoConflictoCodigo || "N/A"})</p>
                <details className="text-xs mt-2">
                  <summary className="cursor-pointer text-purple-600 hover:text-purple-800 text-sm">Ver más detalles...</summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded space-y-1">
                      <p><strong>Impacto Dimensiones:</strong> P: {item.politica}, E: {item.economica}, A: {item.alimentaria}, S: {item.sanitaria}, Am: {item.ambiental}, Pe: {item.personal}, C: {item.comunitaria}</p>
                      <p><strong>Familias (dependen SE):</strong> {item.numeroFamilias}, <strong>Impactadas (Amenaza al SE):</strong> {item.familiasImpactadas}</p>
                      <p><strong>Impacto Diferenciado:</strong> {item.impactoDiferenciado || "N/A"}</p>
                      {item.observacionesImpacto && <p><strong>Obs. Impacto:</strong> {item.observacionesImpacto}</p>}
                      {item.mapeoConflictoCodigo && <p><strong>Mapeo Conflicto (Cód.):</strong> {item.mapeoConflictoCodigo}</p>}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </>
    )
  );


  return (
    <ToolCard 
        title="H4.2.2. CARACTERIZACIÓN DE AMENAZAS (PARA SERVICIOS ECOSISTÉMICOS) E IDENTIFICACIÓN DE CONFLICTOS"
        objetivo="Caracterizar cómo las amenazas identificadas impactan los servicios ecosistémicos y qué conflictos se generan o exacerban."
    >
      <div className="mb-6 flex justify-between items-center">
         <Button onClick={() => navigate('/paso4/herramienta4_2_1')} variant="outline" size="sm">
            <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
            Ir a H4.2.1 (Amenazas-MdV)
        </Button>
        <Button onClick={handleAddNewCharacterization} variant="primary" size="md">
            <PlusIcon className="h-5 w-5 mr-1 inline-block" /> Añadir Nueva Caracterización
        </Button>
      </div>
      
      {characterizedConflicts.length === 0 ? (
        <div className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-700 flex items-center">
            <InformationCircleIcon className="h-6 w-6 mr-2 flex-shrink-0" />
            No hay caracterizaciones de amenazas-servicios ecosistémicos-conflictos añadidas todavía.
        </div>
      ) : (
        <>
          {renderConflictList(categorizedConflicts.climatic, "Conflictos Relacionados con Amenazas Climáticas")}
          {renderConflictList(categorizedConflicts.nonClimatic, "Conflictos Relacionados con Amenazas No Climáticas")}
        </>
      )}
       <div className="mt-10 text-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/paso5')} // Assuming H5.1 is the start of Paso 5
              aria-label="Continuar al Paso 5 (Gobernanza)"
            >
              Continuar al Paso 5 (Gobernanza) <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
            </Button>
        </div>
    </ToolCard>
  );
};