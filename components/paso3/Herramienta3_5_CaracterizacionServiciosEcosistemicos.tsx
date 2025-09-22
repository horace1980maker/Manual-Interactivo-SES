
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { StyledRadioSelect } from '../common/StyledRadioSelect'; // New import
import { MonthSelector } from '../common/MonthSelector'; // New import
import { SelectableDisplayCard } from '../common/SelectableDisplayCard';
import { EcosystemCharacterization, ServicioEcosistemicoCardItem, EcosystemItem, LivelihoodItem, EcosystemServiceCharacterization, AccesoDetalle } from '../../types';
import { serviciosEcosistemicosData } from '../../data/serviciosEcosistemicosData';
import { ChevronLeftIcon, ArrowRightIcon, InformationCircleIcon, PencilSquareIcon, CheckCircleIcon, BeakerIcon, UserGroupIcon, QuestionMarkCircleIcon, ChatBubbleBottomCenterTextIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34 = 'allCharacterizedEcosystemsH34';
const SESSION_STORAGE_INITIAL_ECOSYSTEMS_H31_FOR_H34_DISPLAY = 'detailedEcosystemsForH34';
const SESSION_STORAGE_LIVELIHOODS_H31 = 'detailedLivelihoodsForH34'; 
const SESSION_STORAGE_H35_PROCESSED_ECOSYSTEMS = 'ecosystemsFullyProcessedInH35';
const H35_TARGETED_SERVICE_CODES_KEY = 'H35_TARGETED_SERVICE_CODES_KEY'; // Key for services relevant to H4.2.2

const initialCharacterizationState: Omit<EcosystemServiceCharacterization, 'id' | 'ecosistemaId' | 'servicioEcosistemicoId' | 'codigoEcosistemaSE'> = {
  mediosVidaRelacionadosCodes: [],
  provisionP: '',
  flujoF: '',
  demandaD: '',
  accesoProvision: { condicion: '', barreras: '' },
  accesoFlujo: { condicion: '', barreras: '' },
  accesoDemanda: { condicion: '', barreras: '' },
  numeroUsuarios: '',
  temporalidadContribuyenMeses: [],
  temporalidadFaltanMeses: [],
  equidadImpacto: { hombres: false, mujeres: false, jovenes: false, gruposMarginados: false },
  equidadDescripcion: '',
};

const provisionCondicionOptions: Array<{ value: AccesoDetalle['condicion']; display: string }> = [
    { value: 'Disminuye', display: 'Disminuye' }, 
    { value: 'Se mantiene', display: 'Se mantiene' }, 
    { value: 'Aumenta', display: 'Aumenta' }
];
const flujoCondicionOptions: Array<{ value: AccesoDetalle['condicion']; display: string }> = [
    { value: 'Complicado', display: 'Complicado' }, 
    { value: 'Se mantiene', display: 'Se mantiene' }, 
    { value: 'Fácil', display: 'Fácil' }
];
const demandaCondicionOptions: Array<{ value: AccesoDetalle['condicion']; display: string }> = [
    { value: 'Disminuye', display: 'Disminuye' }, 
    { value: 'Se mantiene', display: 'Se mantiene' }, 
    { value: 'Aumenta', display: 'Aumenta' }
];


export const Herramienta3_5_CaracterizacionServiciosEcosistemicos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  type Stage = 'selectEcosystem' | 'selectServicesForEcosystem' | 'iterateCharacterizeServices' | 'characterizeSingleService';

  const [currentStage, setCurrentStage] = useState<Stage>('selectEcosystem');
  const [isLoading, setIsLoading] = useState(true);

  // Data from previous steps
  const [ecosystemsCharacterizedInH34, setEcosystemsCharacterizedInH34] = useState<EcosystemCharacterization[]>([]);
  const [allEcosystemItemsFromH31, setAllEcosystemItemsFromH31] = useState<EcosystemItem[]>([]);
  const [allLivelihoodsForSelection, setAllLivelihoodsForSelection] = useState<LivelihoodItem[]>([]);
  
  // User selections within H3.5
  const [targetEcosystemForH35, setTargetEcosystemForH35] = useState<EcosystemItem | null>(null);
  const [servicesRelatedToTargetEcosystem, setServicesRelatedToTargetEcosystem] = useState<ServicioEcosistemicoCardItem[]>([]);
  const [topThreeSelectedServiceIds, setTopThreeSelectedServiceIds] = useState<string[]>([]);
  const [serviceCurrentlyBeingCharacterized, setServiceCurrentlyBeingCharacterized] = useState<ServicioEcosistemicoCardItem | null>(null);
  
  // State for the characterization form
  const [characterizationData, setCharacterizationData] = useState<Omit<EcosystemServiceCharacterization, 'id' | 'ecosistemaId' | 'servicioEcosistemicoId' | 'codigoEcosistemaSE'>>(initialCharacterizationState);
  
  // Progress tracking within H3.5
  const [servicesCompletedForTargetEcosystem, setServicesCompletedForTargetEcosystem] = useState<string[]>([]);
  const [ecosystemsFullyProcessedInH35, setEcosystemsFullyProcessedInH35] = useState<string[]>([]);


  useEffect(() => {
    setIsLoading(true);
    try {
      const storedCharEcosystemsRaw = sessionStorage.getItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34);
      const h34CharEcosystems: EcosystemCharacterization[] = storedCharEcosystemsRaw ? JSON.parse(storedCharEcosystemsRaw) : [];
      setEcosystemsCharacterizedInH34(h34CharEcosystems);

      const storedInitialEcosystemsRaw = sessionStorage.getItem(SESSION_STORAGE_INITIAL_ECOSYSTEMS_H31_FOR_H34_DISPLAY);
      const h31InitialEcosystems: EcosystemItem[] = storedInitialEcosystemsRaw ? JSON.parse(storedInitialEcosystemsRaw) : [];
      setAllEcosystemItemsFromH31(h31InitialEcosystems);
      
      const storedLivelihoodsRaw = sessionStorage.getItem(SESSION_STORAGE_LIVELIHOODS_H31);
      const h31Livelihoods: LivelihoodItem[] = storedLivelihoodsRaw ? JSON.parse(storedLivelihoodsRaw) : [];
      setAllLivelihoodsForSelection(h31Livelihoods);

      const storedProcessedH35Raw = sessionStorage.getItem(SESSION_STORAGE_H35_PROCESSED_ECOSYSTEMS);
      const h35Processed: string[] = storedProcessedH35Raw ? JSON.parse(storedProcessedH35Raw) : [];
      setEcosystemsFullyProcessedInH35(h35Processed);

    } catch (error) {
      console.error("Error loading data for H3.5 from sessionStorage:", error);
      setEcosystemsCharacterizedInH34([]);
      setAllEcosystemItemsFromH31([]);
      setAllLivelihoodsForSelection([]);
      setEcosystemsFullyProcessedInH35([]);
    }
    
    setCurrentStage('selectEcosystem');
    setTargetEcosystemForH35(null);
    setServicesRelatedToTargetEcosystem([]);
    setTopThreeSelectedServiceIds([]);
    setServiceCurrentlyBeingCharacterized(null);
    setServicesCompletedForTargetEcosystem([]);
    setCharacterizationData(initialCharacterizationState);
    setIsLoading(false);
  }, [location.pathname]);

  const availableEcosystemsForH35 = useMemo(() => {
    if (!allEcosystemItemsFromH31.length || !ecosystemsCharacterizedInH34.length) return [];
    const characterizedIds = new Set(ecosystemsCharacterizedInH34.map(e => e.ecosystemId));
    return allEcosystemItemsFromH31.filter(eco => characterizedIds.has(eco.id));
  }, [allEcosystemItemsFromH31, ecosystemsCharacterizedInH34]);

  const handleEcosystemSelect = (ecosystemId: string) => {
    const selectedEcoItem = allEcosystemItemsFromH31.find(eco => eco.id === ecosystemId);
    if (!selectedEcoItem) return;
    setTargetEcosystemForH35(selectedEcoItem);

    const charDataForSelectedEco = ecosystemsCharacterizedInH34.find(char => char.ecosystemId === ecosystemId);
    let relatedServices: ServicioEcosistemicoCardItem[] = [];
    if (charDataForSelectedEco) {
      const relatedServiceCodes = charDataForSelectedEco.relatedServicioEcosistemicoCodes;
      relatedServices = serviciosEcosistemicosData.filter(se => relatedServiceCodes.includes(se.codigo));
      setServicesRelatedToTargetEcosystem(relatedServices);
    } else {
      setServicesRelatedToTargetEcosystem([]);
    }

    if (relatedServices.length === 1) {
      setTopThreeSelectedServiceIds([relatedServices[0].id]);
    } else {
      setTopThreeSelectedServiceIds([]); 
    }
    setServicesCompletedForTargetEcosystem([]); 
    setCurrentStage('selectServicesForEcosystem');
  };
  
  const handleServiceForEcosystemSelect = (serviceId: string) => {
    const numRelatedServices = servicesRelatedToTargetEcosystem.length;
    if (numRelatedServices === 0) return;
    const maxAllowed = Math.min(numRelatedServices, 3);

    setTopThreeSelectedServiceIds(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      if (prev.length < maxAllowed) {
        return [...prev, serviceId];
      }
      alert(`Solo puede seleccionar hasta ${maxAllowed} servicio(s) para caracterizar.`);
      return prev;
    });
  };

  const handleProceedToIterateCharacterization = () => {
    const numRelatedServices = servicesRelatedToTargetEcosystem.length;
    if (numRelatedServices === 0 && topThreeSelectedServiceIds.length === 0) { // Allow proceeding if no services to characterize
      setCurrentStage('iterateCharacterizeServices'); // This stage will then lead to finishing this ecosystem
      return;
    }
    const requiredCount = Math.min(numRelatedServices, 3);
    
    if (topThreeSelectedServiceIds.length === requiredCount) {
      setCurrentStage('iterateCharacterizeServices');
    } else {
      alert(`Por favor, seleccione exactamente ${requiredCount} servicio(s).`);
    }
  };
  
  const handleSelectServiceForCharacterization = (serviceId: string) => {
    const service = serviciosEcosistemicosData.find(s => s.id === serviceId);
    if (service) {
      setServiceCurrentlyBeingCharacterized(service);
      setCharacterizationData(initialCharacterizationState); // Reset form for the new service
      setCurrentStage('characterizeSingleService');
    }
  };

  const handleCompleteServiceCharacterization = () => {
    if (serviceCurrentlyBeingCharacterized && targetEcosystemForH35) {
      const fullCharacterization: EcosystemServiceCharacterization = {
        id: `${targetEcosystemForH35.id}_${serviceCurrentlyBeingCharacterized.id}_${Date.now()}`,
        ecosistemaId: targetEcosystemForH35.id,
        servicioEcosistemicoId: serviceCurrentlyBeingCharacterized.id,
        codigoEcosistemaSE: `${targetEcosystemForH35.codigo}_${serviceCurrentlyBeingCharacterized.codigo}`,
        ...characterizationData,
      };
      
      console.log("Service Characterization Completed:", fullCharacterization);
      // Here you would typically save `fullCharacterization` to a persistent store or global state.
      // For now, it's just logged. This data isn't directly passed to H4.2.2.
      // H4.2.2 will rely on the list of *all possible* service codes derived from H3.4.

      setServicesCompletedForTargetEcosystem(prev => [...prev, serviceCurrentlyBeingCharacterized.id]);
      setServiceCurrentlyBeingCharacterized(null);
      setCharacterizationData(initialCharacterizationState);

      const allSelectedServicesDone = topThreeSelectedServiceIds.every(id => 
          [...servicesCompletedForTargetEcosystem, serviceCurrentlyBeingCharacterized.id].includes(id)
      );

      if (allSelectedServicesDone) {
        const updatedProcessedEco = [...ecosystemsFullyProcessedInH35, targetEcosystemForH35.id];
        setEcosystemsFullyProcessedInH35(updatedProcessedEco);
        sessionStorage.setItem(SESSION_STORAGE_H35_PROCESSED_ECOSYSTEMS, JSON.stringify(updatedProcessedEco));
        
        setTargetEcosystemForH35(null);
        setServicesRelatedToTargetEcosystem([]);
        setTopThreeSelectedServiceIds([]);
        setServicesCompletedForTargetEcosystem([]);
        setCurrentStage('selectEcosystem');
      } else {
        setCurrentStage('iterateCharacterizeServices');
      }
    }
  };

  const handleProceedToH36 = () => {
    try {
      const h34DataRaw = sessionStorage.getItem(SESSION_STORAGE_CHARACTERIZED_ECOSYSTEMS_H34);
      const h34Characterizations: EcosystemCharacterization[] = h34DataRaw ? JSON.parse(h34DataRaw) : [];
      
      const allServiceCodesFromH34 = h34Characterizations.reduce((acc, curr) => {
        curr.relatedServicioEcosistemicoCodes.forEach(code => acc.add(code));
        return acc;
      }, new Set<string>());
      
      sessionStorage.setItem(H35_TARGETED_SERVICE_CODES_KEY, JSON.stringify(Array.from(allServiceCodesFromH34)));
      console.log('Saved targeted service codes for H4.2.2:', Array.from(allServiceCodesFromH34));
    } catch (error) {
      console.error("Error saving service codes for H4.2.2 from H3.5:", error);
    }
    navigate('/paso3/herramienta3_6');
  };

  // Generic input change handler for top-level fields
  const handleTopLevelInputChange = (field: keyof Omit<EcosystemServiceCharacterization, 'accesoProvision' | 'accesoFlujo' | 'accesoDemanda' | 'temporalidadContribuyenMeses' | 'temporalidadFaltanMeses' | 'equidadImpacto' | 'mediosVidaRelacionadosCodes' | 'id' | 'ecosistemaId' | 'servicioEcosistemicoId' | 'codigoEcosistemaSE'>, value: string) => {
    setCharacterizationData(prev => ({ ...prev, [field]: value }));
  };

  const handleAccesoCondicionChange = (
    tipo: 'provision' | 'flujo' | 'demanda', 
    value: AccesoDetalle['condicion']
  ) => {
    setCharacterizationData(prev => {
      const newState = { ...prev };
      const accesoKey = `acceso${tipo.charAt(0).toUpperCase() + tipo.slice(1)}` as 'accesoProvision' | 'accesoFlujo' | 'accesoDemanda';
      
      newState[accesoKey] = { ...newState[accesoKey], condicion: value };
      
      if (tipo === 'provision' && value !== 'Disminuye') newState.accesoProvision.barreras = '';
      if (tipo === 'flujo' && value !== 'Complicado') newState.accesoFlujo.barreras = '';
      if (tipo === 'demanda' && value !== 'Disminuye') newState.accesoDemanda.barreras = '';
      
      return newState;
    });
  };
  
  const handleAccesoBarrerasChange = (
    tipo: 'provision' | 'flujo' | 'demanda',
    value: string
  ) => {
     setCharacterizationData(prev => {
      const newState = { ...prev };
      const accesoKey = `acceso${tipo.charAt(0).toUpperCase() + tipo.slice(1)}` as 'accesoProvision' | 'accesoFlujo' | 'accesoDemanda';
      newState[accesoKey] = { ...newState[accesoKey], barreras: value };
      return newState;
    });
  };

  const handleTemporalidadMonthToggle = (
    field: 'temporalidadContribuyenMeses' | 'temporalidadFaltanMeses',
    month: string
  ) => {
    setCharacterizationData(prev => {
      const currentMonths = prev[field];
      const newMonths = currentMonths.includes(month)
        ? currentMonths.filter(m => m !== month)
        : [...currentMonths, month];
      return { ...prev, [field]: newMonths };
    });
  };
  
  const handleEquidadImpactoChange = (field: keyof EcosystemServiceCharacterization['equidadImpacto'], checked: boolean) => {
    setCharacterizationData(prev => ({
      ...prev,
      equidadImpacto: {
        ...prev.equidadImpacto,
        [field]: checked,
      }
    }));
  };

  const handleMediosVidaUsuariosChange = (livelihoodId: string) => {
    const livelihood = allLivelihoodsForSelection.find(l => l.id === livelihoodId);
    if (!livelihood) return;

    setCharacterizationData(prev => {
      const currentCodes = prev.mediosVidaRelacionadosCodes;
      if (currentCodes.includes(livelihood.codigo)) {
        return { ...prev, mediosVidaRelacionadosCodes: currentCodes.filter(code => code !== livelihood.codigo) };
      } else {
        return { ...prev, mediosVidaRelacionadosCodes: [...currentCodes, livelihood.codigo] };
      }
    });
  };

  if (isLoading) {
    return <ToolCard title="H3.5 Caracterización de Servicios Ecosistémicos"><p>Cargando...</p></ToolCard>;
  }

  // Stage: Select Ecosystem
  if (currentStage === 'selectEcosystem') {
    const allDone = availableEcosystemsForH35.length > 0 && availableEcosystemsForH35.every(eco => ecosystemsFullyProcessedInH35.includes(eco.id));
    return (
      <ToolCard 
        title="H3.5 - Paso 1: Seleccionar Ecosistema"
        objetivo="Elija un ecosistema (previamente caracterizado en H3.4) para analizar sus servicios ecosistémicos."
      >
        <Button onClick={() => navigate('/paso3/herramienta3_4')} variant="outline" size="sm" className="mb-6">
          <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
          Volver a Caracterización de Ecosistemas (H3.4)
        </Button>
        {availableEcosystemsForH35.length === 0 ? (
          <div className="p-4 border rounded-md bg-blue-50 border-blue-200 text-blue-700">
            <InformationCircleIcon className="h-6 w-6 mr-3 float-left" />
            <p className="font-semibold">No hay ecosistemas caracterizados en H3.4 o disponibles para este paso.</p>
            <p className="text-sm mt-1">Por favor, asegúrese de haber completado la Herramienta 3.4.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">Seleccione un ecosistema. Los ecosistemas ya procesados en H3.5 se marcan con <CheckCircleIcon className="h-4 w-4 inline text-green-500"/> y no son seleccionables.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {availableEcosystemsForH35.map(eco => {
                const isProcessed = ecosystemsFullyProcessedInH35.includes(eco.id);
                return (
                  <div 
                    key={eco.id} 
                    className={`relative ${isProcessed ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <SelectableDisplayCard
                      item={eco}
                      isSelected={!isProcessed && targetEcosystemForH35?.id === eco.id}
                      onToggleSelect={() => {
                        if (!isProcessed) {
                          handleEcosystemSelect(eco.id);
                        }
                      }}
                    />
                    {isProcessed && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 absolute top-2 right-2 bg-white rounded-full" title="Este ecosistema ya ha sido procesado en H3.5"/>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
         {allDone && (
             <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
                <InformationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                <p className="text-sm font-semibold">Todos los ecosistemas disponibles han sido procesados en esta herramienta.</p>
             </div>
          )}
          <div className="mt-10 pt-6 border-t border-gray-300 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToH36} // Updated to use the new handler
                aria-label="Proceder a Mapeo (H3.6)"
                disabled={!allDone && availableEcosystemsForH35.length > 0}
                title={!allDone && availableEcosystemsForH35.length > 0 ? "Complete la caracterización de servicios para todos los ecosistemas antes de proceder." : "Proceder a H3.6"}
              >
                Proceder a Mapeo de Ecosistemas y MdV (H3.6)
                <BeakerIcon className="h-5 w-5 ml-2 inline-block" />
              </Button>
          </div>
      </ToolCard>
    );
  }

  // Stage: Select Services for the chosen Ecosystem
  if (currentStage === 'selectServicesForEcosystem' && targetEcosystemForH35) {
    const numRelatedServices = servicesRelatedToTargetEcosystem.length;
    let numServicesToSelect = 0;
    let numServicesToSelectText = "";

    if (numRelatedServices > 0) {
        numServicesToSelect = Math.min(numRelatedServices, 3);
        if (numServicesToSelect === 1) numServicesToSelectText = "UN (1)";
        else if (numServicesToSelect === 2) numServicesToSelectText = "DOS (2)";
        else numServicesToSelectText = "TRES (3)";
    }
    
    return (
      <ToolCard 
        title={`H3.5 - Paso 2: Seleccionar Servicios para ${targetEcosystemForH35.nombre}`}
        objetivo={`Seleccione ${numServicesToSelectText} servicio(s) ecosistémico(s) más importante(s) relacionados con este ecosistema.`}
      >
        <Button onClick={() => setCurrentStage('selectEcosystem')} variant="outline" size="sm" className="mb-6">
          <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
          Volver a Selección de Ecosistema
        </Button>
        {numRelatedServices === 0 ? (
           <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200 text-yellow-700">
             <InformationCircleIcon className="h-6 w-6 mr-3 float-left" />
            <p className="font-semibold">El ecosistema '{targetEcosystemForH35.nombre}' no tiene servicios ecosistémicos asociados en H3.4.</p>
            <p className="text-sm mt-1">Puede continuar sin caracterizar servicios para este ecosistema, o volver a H3.4 para asociarlos.</p>
             <div className="mt-4 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToIterateCharacterization} // Will proceed with 0 selected services
              >
                Continuar sin Caracterizar Servicios
                <PencilSquareIcon className="h-5 w-5 ml-2 inline-block" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-md font-semibold text-[#B71373] mb-4">
              Seleccione {numServicesToSelectText} servicio(s) para caracterizar ({topThreeSelectedServiceIds.length}/{numServicesToSelect}):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {servicesRelatedToTargetEcosystem.map(se => (
                <SelectableDisplayCard
                  key={se.id}
                  item={se}
                  isSelected={topThreeSelectedServiceIds.includes(se.id)}
                  onToggleSelect={handleServiceForEcosystemSelect}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToIterateCharacterization}
                disabled={topThreeSelectedServiceIds.length !== numServicesToSelect}
              >
                Caracterizar {topThreeSelectedServiceIds.length}/{numServicesToSelect} Servicios Seleccionados
                <PencilSquareIcon className="h-5 w-5 ml-2 inline-block" />
              </Button>
            </div>
          </>
        )}
      </ToolCard>
    );
  }
  
  // Stage: Iterate through characterizing the selected services
  if (currentStage === 'iterateCharacterizeServices' && targetEcosystemForH35) {
    const servicesToDisplay = topThreeSelectedServiceIds.map(id => serviciosEcosistemicosData.find(s => s.id === id)).filter(Boolean) as ServicioEcosistemicoCardItem[];
    
    // If no services were selected (e.g., ecosystem had 0 services initially)
    if (servicesToDisplay.length === 0 && topThreeSelectedServiceIds.length === 0) {
        // Mark this ecosystem as processed for H3.5 and go back to ecosystem selection
        const updatedProcessedEco = [...ecosystemsFullyProcessedInH35, targetEcosystemForH35.id];
        setEcosystemsFullyProcessedInH35(updatedProcessedEco);
        sessionStorage.setItem(SESSION_STORAGE_H35_PROCESSED_ECOSYSTEMS, JSON.stringify(updatedProcessedEco));
        
        setTargetEcosystemForH35(null);
        setServicesRelatedToTargetEcosystem([]);
        setTopThreeSelectedServiceIds([]);
        setServicesCompletedForTargetEcosystem([]);
        setCurrentStage('selectEcosystem');
        return null; // Prevent rendering this stage if no services
    }

    const allCurrentSelectedDone = servicesToDisplay.every(s => servicesCompletedForTargetEcosystem.includes(s.id));
     if (allCurrentSelectedDone && servicesToDisplay.length > 0) { 
        // This case should be handled by handleCompleteServiceCharacterization to transition
        // For safety, if reached here, redirect.
        setCurrentStage('selectEcosystem');
        return null;
    }

    return (
      <ToolCard 
        title={`H3.5 - Paso 3: Caracterizar Servicios para ${targetEcosystemForH35.nombre}`}
        objetivo="Seleccione uno por uno los servicios para ingresar su caracterización detallada."
      >
        <Button onClick={() => { setCurrentStage('selectServicesForEcosystem');}} variant="outline" size="sm" className="mb-6">
          <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
          Volver a Selección de Servicios (para este Ecosistema)
        </Button>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Servicios a Caracterizar:</h3>
        <p className="text-sm text-gray-500 mb-4">Haga clic en un servicio para ingresar/ver su caracterización. Los servicios completados se marcan con <CheckCircleIcon className="h-4 w-4 inline text-green-500"/>.</p>
        <div className="space-y-3">
          {servicesToDisplay.map(service => (
            <div key={service.id} className="relative">
              <Button
                variant={servicesCompletedForTargetEcosystem.includes(service.id) ? "secondary" : "primary"}
                onClick={() => !servicesCompletedForTargetEcosystem.includes(service.id) && handleSelectServiceForCharacterization(service.id)}
                className="w-full text-left justify-start py-3"
                disabled={servicesCompletedForTargetEcosystem.includes(service.id)}
              >
                {service.nombre} ({service.codigo})
                {servicesCompletedForTargetEcosystem.includes(service.id) && 
                  <CheckCircleIcon className="h-5 w-5 text-white ml-auto" title="Caracterización completada"/>
                }
              </Button>
            </div>
          ))}
        </div>
      </ToolCard>
    );
  }

  // Stage: Characterize a single service
  if (currentStage === 'characterizeSingleService' && serviceCurrentlyBeingCharacterized && targetEcosystemForH35) {
    const combinedCodeDisplay = `${targetEcosystemForH35.codigo}_${serviceCurrentlyBeingCharacterized.codigo}`;
    return (
      <ToolCard 
        title={`H3.5 - Caracterizando: ${serviceCurrentlyBeingCharacterized.nombre} para ${targetEcosystemForH35.nombre}`}
        objetivo={`Detallar el servicio ${serviceCurrentlyBeingCharacterized.nombre} (${serviceCurrentlyBeingCharacterized.codigo}) en el contexto del ecosistema ${targetEcosystemForH35.nombre} (${targetEcosystemForH35.codigo}).`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ecosistema:</p>
            <SelectableDisplayCard item={targetEcosystemForH35} isSelected={false} onToggleSelect={() => {}} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Servicio Ecosistémico:</p>
            <SelectableDisplayCard item={serviceCurrentlyBeingCharacterized} isSelected={false} onToggleSelect={() => {}} />
          </div>
        </div>

        <Input 
          label="CÓDIGO (Ecosistema_Servicio)" 
          value={combinedCodeDisplay} 
          readOnly 
          className="bg-gray-100 font-mono"
          wrapperClassName="mb-6"
        />

        <div className="space-y-6">
          {/* Medios de Vida Relacionados (Usuarios) */}
          <div className="p-4 border rounded-md shadow-sm bg-white">
            <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-[#B71373]" />
              Medios de Vida Relacionados (Usuarios)
            </h4>
            <p className="text-xs text-gray-600 mb-3">¿Qué Medios de Vida se benefician de lo que este Servicio Ecosistémico proporciona?</p>
            {allLivelihoodsForSelection.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {allLivelihoodsForSelection.map(livelihood => (
                  <SelectableDisplayCard
                    key={livelihood.id}
                    item={livelihood}
                    isSelected={characterizationData.mediosVidaRelacionadosCodes.includes(livelihood.codigo)}
                    onToggleSelect={() => handleMediosVidaUsuariosChange(livelihood.id)}
                  />
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">No hay Medios de Vida disponibles para seleccionar (revise H3.1).</p>}
          </div>

          {/* Provisión with Acceso */}
          <div className="p-4 border rounded-md shadow-sm bg-white" style={{ contain: 'layout' }}>
            <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-[#001F89]" />
                Provisión (P)
            </h4>
            <Textarea 
                label="¿Qué puede ofrecer el Ecosistema?" 
                value={characterizationData.provisionP} 
                onChange={e => handleTopLevelInputChange('provisionP', e.target.value)}
                placeholder="Ej: Agua para consumo, leña para cocinar, frutos silvestres"
                rows={2}
                wrapperClassName="mb-4"
            />
            <StyledRadioSelect
                label="Condiciones de Acceso para Provisión:"
                name={`acceso-provision-condicion`}
                options={provisionCondicionOptions}
                value={characterizationData.accesoProvision.condicion}
                onChange={(val) => handleAccesoCondicionChange('provision', val as AccesoDetalle['condicion'])}
                inline={true}
            />
            {characterizationData.accesoProvision.condicion === 'Disminuye' && (
                <Textarea
                    label='En caso "Disminuye", indicar cuáles son las barreras:'
                    value={characterizationData.accesoProvision.barreras || ''}
                    onChange={(e) => handleAccesoBarrerasChange('provision', e.target.value)}
                    rows={2}
                    className="mt-2 bg-yellow-50 border-yellow-300"
                />
            )}
          </div>
          
          {/* Flujo with Acceso */}
           <div className="p-4 border rounded-md shadow-sm bg-white" style={{ contain: 'layout' }}>
            <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-[#001F89]" />
                Flujo (F)
            </h4>
            <Textarea 
                label="¿Cómo se obtiene el Servicio Ecosistémico?" 
                value={characterizationData.flujoF}
                onChange={e => handleTopLevelInputChange('flujoF', e.target.value)}
                placeholder="Ej: Pozo perforado, recolección directa del bosque, acuerdos comunitarios"
                rows={2}
                wrapperClassName="mb-4"
            />
            <StyledRadioSelect
                label="Condiciones de Acceso para Flujo:"
                name={`acceso-flujo-condicion`}
                options={flujoCondicionOptions}
                value={characterizationData.accesoFlujo.condicion}
                onChange={(val) => handleAccesoCondicionChange('flujo', val as AccesoDetalle['condicion'])}
                inline={true}
            />
            {characterizationData.accesoFlujo.condicion === 'Complicado' && (
                <Textarea
                    label='En caso "Complicado", indicar cuáles son las barreras:'
                    value={characterizationData.accesoFlujo.barreras || ''}
                    onChange={(e) => handleAccesoBarrerasChange('flujo', e.target.value)}
                    rows={2}
                    className="mt-2 bg-yellow-50 border-yellow-300"
                />
            )}
          </div>

          {/* Demanda with Acceso */}
          <div className="p-4 border rounded-md shadow-sm bg-white" style={{ contain: 'layout' }}>
            <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                 <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-[#001F89]" />
                Demanda (D)
            </h4>
            <Textarea 
                label="¿Quiénes se benefician del Servicio Ecosistémico?" 
                value={characterizationData.demandaD}
                onChange={e => handleTopLevelInputChange('demandaD', e.target.value)}
                placeholder="Ej: Comunidad de Agua Fría, familias ganaderas, talleres artesanales"
                rows={2}
                wrapperClassName="mb-4"
            />
            <StyledRadioSelect
                label="Condiciones de Acceso para Demanda:"
                name={`acceso-demanda-condicion`}
                options={demandaCondicionOptions}
                value={characterizationData.accesoDemanda.condicion}
                onChange={(val) => handleAccesoCondicionChange('demanda', val as AccesoDetalle['condicion'])}
                inline={true}
            />
            {characterizationData.accesoDemanda.condicion === 'Disminuye' && (
                <Textarea
                    label='En caso "Disminuye", indicar cuáles son las barreras:'
                    value={characterizationData.accesoDemanda.barreras || ''}
                    onChange={(e) => handleAccesoBarrerasChange('demanda', e.target.value)}
                    rows={2}
                    className="mt-2 bg-yellow-50 border-yellow-300"
                />
            )}
          </div>
          
          <Input 
            label="Número de usuarios (familias-área):"
            value={characterizationData.numeroUsuarios}
            onChange={e => handleTopLevelInputChange('numeroUsuarios', e.target.value)}
            placeholder="Ej: 40 familias, toda la comunidad de X"
          />

          {/* Temporalidad */}
          <div className="p-4 border rounded-md shadow-sm bg-white">
            <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-[#001F89]" />
                Temporalidad
            </h4>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                <MonthSelector
                    label="¿Cuándo contribuyen?"
                    selectedMonths={characterizationData.temporalidadContribuyenMeses}
                    onMonthToggle={(month) => handleTemporalidadMonthToggle('temporalidadContribuyenMeses', month)}
                />
                <MonthSelector
                    label="¿Cuándo faltan?"
                    selectedMonths={characterizationData.temporalidadFaltanMeses}
                    onMonthToggle={(month) => handleTemporalidadMonthToggle('temporalidadFaltanMeses', month)}
                />
            </div>
          </div>

          {/* Equidad e Inclusión */}
          <div className="p-4 border rounded-md shadow-sm bg-white">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Equidad e Inclusión</h4>
            <p className="text-sm text-gray-700 mb-1">¿Quién se beneficia principalmente de los bienes?</p>
            <div className="space-y-1 mb-3">
              {(Object.keys(characterizationData.equidadImpacto) as Array<keyof typeof characterizationData.equidadImpacto>).map(key => (
                <label key={key} className="flex items-center space-x-2 text-sm text-gray-600 p-1 hover:bg-gray-50 rounded-md">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-[#B71373] border-gray-300 rounded focus:ring-[#B71373]"
                    checked={characterizationData.equidadImpacto[key]}
                    onChange={e => handleEquidadImpactoChange(key, e.target.checked)}
                  />
                  <span>{key.charAt(0).toUpperCase() + key.slice(1).replace('gruposMarginados', 'Grupos Marginados')}</span>
                </label>
              ))}
            </div>
            <Textarea 
              label="Breve descripción (Equidad e Inclusión):"
              value={characterizationData.equidadDescripcion}
              onChange={e => handleTopLevelInputChange('equidadDescripcion', e.target.value)}
              placeholder="Ej: H, M, J: Todos por igual; Principalmente hombres por roles tradicionales"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setServiceCurrentlyBeingCharacterized(null);
                setCharacterizationData(initialCharacterizationState);
                setCurrentStage('iterateCharacterizeServices');
              }}
            >
              Cancelar y Volver a Lista de Servicios
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCompleteServiceCharacterization}
            >
              <CheckCircleIcon className="h-5 w-5 mr-2 inline-block" />
              Marcar como Caracterizado y Continuar
            </Button>
        </div>
      </ToolCard>
    );
  }

  return <ToolCard title="H3.5"><p>Estado no reconocido o datos faltantes.</p></ToolCard>;
};