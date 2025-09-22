
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { AmenazaClimatica, AmenazaNoClimatica, MagnitudImpacto, FrecuenciaAmenaza, TendenciaAmenaza } from '../../types';
import { PlusIcon, TrashIcon, ArrowRightIcon, ChevronLeftIcon, ListBulletIcon } from '@heroicons/react/24/outline';

type Stage = 'climatic' | 'nonClimatic' | 'prioritizationSummary';

// Session storage keys for H4.1 output, to be used by H4.2.x
const H4_1_CLIMATIC_THREATS_KEY = 'climaticThreatsData_H41';
const H4_1_NON_CLIMATIC_THREATS_KEY = 'nonClimaticThreatsData_H41';

// Helper to get descriptive label for enum keys (used for Tendencia primarily now)
const getEnumKeyLabel = (enumObj: any, value: number): string => {
  const entry = Object.entries(enumObj).find(([key, val]) => val === value);
  return entry ? entry[0].replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Desconocido';
};

const magnitudOptions = [
  { value: MagnitudImpacto.MUY_BAJO, label: "1 - Muy bajo, “Casi no nos afecta”" },
  { value: MagnitudImpacto.BAJO, label: "2 - Bajo, “Nos afecta un poco, pero lo podemos manejar”" },
  { value: MagnitudImpacto.MODERADO, label: "3 - Moderado, “Nos complica bastante”" },
  { value: MagnitudImpacto.ALTO, label: "4 - Alto “Nos golpea duro”" },
  { value: MagnitudImpacto.MUY_ALTO, label: "5 - Muy alto “Nos deja sin nada”" },
];

const frecuenciaOptions = [
  { value: FrecuenciaAmenaza.OCASIONAL, label: "1 - Ocasional: Ocurre de manera poco frecuente o esporádica." },
  { value: FrecuenciaAmenaza.RECURRENTE, label: "2 - Recurrente: Ocurre con cierta regularidad." },
  { value: FrecuenciaAmenaza.CONSTANTE, label: "3 - Constante: siempre presente o se manifiesta de forma continua." },
];
  
const tendenciaOptions = Object.values(TendenciaAmenaza)
  .filter(value => typeof value === 'number')
  .map(value => ({ value: value as number, label: `${value} - ${getEnumKeyLabel(TendenciaAmenaza, value as number)}` }));


const initialThreatFormState = {
  nombre: '',
  magnitud: magnitudOptions[0]?.value || 1,
  frecuencia: frecuenciaOptions[0]?.value || 1,
  tendencia: tendenciaOptions.find(opt => opt.value === 0)?.value ?? (tendenciaOptions[0]?.value || 0), // Default to 0 (Estable) or first
  sitiosAfectados: '',
  ubicacionMapaCodigo: '',
};

export const Herramienta4_1_MatricesAmenazas: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState<Stage>('climatic');

  const [climaticThreatsData, setClimaticThreatsData] = useState<AmenazaClimatica[]>([]);
  const [nonClimaticThreatsData, setNonClimaticThreatsData] = useState<AmenazaNoClimatica[]>([]);
  const [threatFormState, setThreatFormState] = useState(initialThreatFormState);

  useEffect(() => {
    try {
      const climaticRaw = sessionStorage.getItem(H4_1_CLIMATIC_THREATS_KEY);
      if (climaticRaw) setClimaticThreatsData(JSON.parse(climaticRaw));

      const nonClimaticRaw = sessionStorage.getItem(H4_1_NON_CLIMATIC_THREATS_KEY);
      if (nonClimaticRaw) setNonClimaticThreatsData(JSON.parse(nonClimaticRaw));
    } catch (error) {
      console.error("Error loading data for H4.1 from sessionStorage:", error);
    }
  }, []);

  const calculatePrioritization = (threat: typeof initialThreatFormState) => {
    return (threat.magnitud || 0) + (threat.frecuencia || 0) + (threat.tendencia || 0);
  };
  
  const handleInputChange = (field: keyof typeof initialThreatFormState, value: string | number) => {
    setThreatFormState(prev => ({...prev, [field]: value}));
  };

  const handleAddThreat = () => {
    if (!threatFormState.nombre.trim()) {
        alert("El nombre de la amenaza es obligatorio.");
        return;
    }
    const newThreat = {
      id: `${currentStage}_${Date.now()}`,
      ...threatFormState,
      priorizacionSuma: calculatePrioritization(threatFormState),
    };

    if (currentStage === 'climatic') {
      const updatedThreats = [...climaticThreatsData, newThreat];
      setClimaticThreatsData(updatedThreats);
      sessionStorage.setItem(H4_1_CLIMATIC_THREATS_KEY, JSON.stringify(updatedThreats));
    } else { // nonClimatic
      const updatedThreats = [...nonClimaticThreatsData, newThreat];
      setNonClimaticThreatsData(updatedThreats);
      sessionStorage.setItem(H4_1_NON_CLIMATIC_THREATS_KEY, JSON.stringify(updatedThreats));
    }
    setThreatFormState(initialThreatFormState); // Reset form
  };
  
  const handleDeleteThreat = (id: string) => {
    if (currentStage === 'climatic') {
        const updatedThreats = climaticThreatsData.filter(t => t.id !== id);
        setClimaticThreatsData(updatedThreats);
        sessionStorage.setItem(H4_1_CLIMATIC_THREATS_KEY, JSON.stringify(updatedThreats));
    } else { // nonClimatic
        const updatedThreats = nonClimaticThreatsData.filter(t => t.id !== id);
        setNonClimaticThreatsData(updatedThreats);
        sessionStorage.setItem(H4_1_NON_CLIMATIC_THREATS_KEY, JSON.stringify(updatedThreats));
    }
  };

  const sortedClimaticThreats = useMemo(() => 
    [...climaticThreatsData].sort((a, b) => b.priorizacionSuma - a.priorizacionSuma), 
    [climaticThreatsData]
  );
  
  const sortedNonClimaticThreats = useMemo(() => 
    [...nonClimaticThreatsData].sort((a, b) => b.priorizacionSuma - a.priorizacionSuma),
    [nonClimaticThreatsData]
  );

  const renderThreatsTable = (threats: (AmenazaClimatica | AmenazaNoClimatica)[]) => (
    <div className="overflow-x-auto shadow-md rounded-lg mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#EBF5FF]">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-[#001F89] uppercase tracking-wider">Amenaza</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-[#001F89] uppercase tracking-wider">Magnitud</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-[#001F89] uppercase tracking-wider">Frecuencia</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-[#001F89] uppercase tracking-wider">Tendencia</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-[#001F89] uppercase tracking-wider">Priorización (Suma)</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-[#001F89] uppercase tracking-wider">Sitios Afectados</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-[#001F89] uppercase tracking-wider">Mapeo (Cód.)</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-[#001F89] uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {threats.length > 0 ? threats.map(threat => (
            <tr key={threat.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-normal text-sm font-medium text-gray-900">{threat.nombre}</td>
              <td className="px-3 py-2 text-center text-sm text-gray-500">{threat.magnitud}</td>
              <td className="px-3 py-2 text-center text-sm text-gray-500">{threat.frecuencia}</td>
              <td className="px-3 py-2 text-center text-sm text-gray-500">{threat.tendencia}</td>
              <td className="px-3 py-2 text-center text-sm font-bold text-[#001F89]">{threat.priorizacionSuma}</td>
              <td className="px-3 py-2 whitespace-normal text-sm text-gray-500">{threat.sitiosAfectados}</td>
              <td className="px-3 py-2 text-sm text-gray-500">{threat.ubicacionMapaCodigo}</td>
              <td className="px-3 py-2 text-center">
                <Button variant="danger" size="sm" onClick={() => handleDeleteThreat(threat.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={8} className="px-3 py-4 text-center text-sm text-gray-500">No hay amenazas de este tipo añadidas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (currentStage === 'prioritizationSummary') {
    return (
      <ToolCard 
        title="H4.1 - Resumen de Priorización de Amenazas"
        objetivo="Visualizar y comparar las amenazas climáticas y no climáticas priorizadas para informar los análisis de impacto posteriores."
      >
        <div className="mb-6">
            <Button onClick={() => setCurrentStage('climatic')} variant="outline" size="sm">
                <ChevronLeftIcon className="h-4 w-4 mr-1"/> Volver a Matrices de Amenazas
            </Button>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenazas Climáticas (Ordenadas por Prioridad)</h3>
            {renderThreatsTable(sortedClimaticThreats)}
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenazas No Climáticas (Ordenadas por Prioridad)</h3>
            {renderThreatsTable(sortedNonClimaticThreats)}
        </div>

        <div className="mt-10 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/paso4/herramienta4_2_1')}
              aria-label="Proceder a H4.2.1 (Amenazas - Medios de Vida - Conflictos)"
            >
              Proceder a Caracterización de Impactos y Conflictos (H4.2.1)
              <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
            </Button>
        </div>
      </ToolCard>
    );
  }

  return (
    <ToolCard 
        title={`H4.1 - Matriz de Amenazas ${currentStage === 'climatic' ? 'Climáticas' : 'No Climáticas'}`}
        objetivo="Identificar y priorizar las amenazas que afectan el paisaje, diferenciando entre climáticas y no climáticas, para comprender los principales factores de presión."
    >
        <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button
                    onClick={() => setCurrentStage('climatic')}
                    className={`${currentStage === 'climatic' ? 'border-[#009EE2] text-[#001F89]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                    Amenazas Climáticas
                </button>
                <button
                    onClick={() => setCurrentStage('nonClimatic')}
                    className={`${currentStage === 'nonClimatic' ? 'border-[#009EE2] text-[#001F89]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                    Amenazas No Climáticas
                </button>
                 <button
                    onClick={() => setCurrentStage('prioritizationSummary')}
                    className={`border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ml-auto flex items-center`}
                >
                    <ListBulletIcon className="h-5 w-5 mr-1" />
                    Ver Resumen de Priorización
                </button>
            </nav>
        </div>
        
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <h4 className="text-lg font-semibold text-[#001F89] mb-3">Añadir Nueva Amenaza {currentStage === 'climatic' ? 'Climática' : 'No Climática'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                    label="Nombre de la Amenaza"
                    value={threatFormState.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ej: Sequía, Contaminación de ríos"
                    wrapperClassName="lg:col-span-3"
                />
                <Select
                    label="Magnitud del Impacto"
                    options={magnitudOptions}
                    value={threatFormState.magnitud}
                    onChange={(e) => handleInputChange('magnitud', parseInt(e.target.value, 10))}
                />
                <Select
                    label="Frecuencia"
                    options={frecuenciaOptions}
                    value={threatFormState.frecuencia}
                    onChange={(e) => handleInputChange('frecuencia', parseInt(e.target.value, 10))}
                />
                 <Select
                    label="Tendencia"
                    options={tendenciaOptions}
                    value={threatFormState.tendencia}
                    onChange={(e) => handleInputChange('tendencia', parseInt(e.target.value, 10))}
                />
                 <Input
                    label="Sitios Afectados"
                    value={threatFormState.sitiosAfectados}
                    onChange={(e) => handleInputChange('sitiosAfectados', e.target.value)}
                    placeholder="Ej: Parcelas de la parte alta"
                    wrapperClassName="md:col-span-2"
                />
                 <Input
                    label="Mapeo (código)"
                    value={threatFormState.ubicacionMapaCodigo}
                    onChange={(e) => handleInputChange('ubicacionMapaCodigo', e.target.value)}
                    placeholder="Ej: A1"
                />
            </div>
             <div className="mt-4 text-right">
                <Button onClick={handleAddThreat} variant="primary">
                    <PlusIcon className="h-5 w-5 mr-1"/> Añadir a la Matriz
                </Button>
            </div>
        </div>

        {currentStage === 'climatic' ? renderThreatsTable(sortedClimaticThreats) : renderThreatsTable(sortedNonClimaticThreats)}

    </ToolCard>
  );
};
