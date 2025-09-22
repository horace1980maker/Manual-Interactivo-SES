
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { StyledRadioSelect } from '../common/StyledRadioSelect';
import { PrioritizedLivelihood, LivelihoodCharacterization } from '../../types';
import { ChevronLeftIcon, ScaleIcon, ClipboardIcon, BriefcaseIcon, ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CheckboxGroupProps {
  label: string;
  options: Array<{ name: keyof LivelihoodCharacterization['destinoProduccion']; label: string }>;
  values: LivelihoodCharacterization['destinoProduccion'];
  onChange: (name: keyof LivelihoodCharacterization['destinoProduccion'], checked: boolean) => void;
  helpText?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, values, onChange, helpText }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {helpText && <p className="text-xs text-gray-500 mb-1">{helpText}</p>}
    <div className="mt-2 space-y-2">
      {options.map(option => (
        <label key={option.name} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50">
          <input
            type="checkbox"
            name={option.name}
            checked={values[option.name]}
            onChange={(e) => onChange(option.name, e.target.checked)}
            className="form-checkbox h-4 w-4 text-[#009EE2] border-gray-300 rounded focus:ring-[#009EE2]"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);


export const Herramienta3_3_DetalleSistemaProductivo: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentSystemItemsToCharacterize = location.state?.currentSystemItemsToCharacterize as PrioritizedLivelihood[] | undefined;
  const initialPrioritizedLivelihoodsFromH32 = location.state?.initialPrioritizedLivelihoodsFromH32 as PrioritizedLivelihood[] | undefined;
  const previouslyCharacterizedSystems = location.state?.previouslyCharacterizedSystems as LivelihoodCharacterization[] | undefined;
  
  const [unidadTamanio, setUnidadTamanio] = useState<string>('hectáreas');
  const [minValor, setMinValor] = useState<string>('');
  const [maxValor, setMaxValor] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [tenenciaTipo1Nombre, setTenenciaTipo1Nombre] = useState('');
  const [tenenciaTipo2Nombre, setTenenciaTipo2Nombre] = useState('');
  const [tenenciaTipo3Nombre, setTenenciaTipo3Nombre] = useState('');

  const [tenenciaPequenoTipo1Pct, setTenenciaPequenoTipo1Pct] = useState<string>('');
  const [tenenciaPequenoTipo2Pct, setTenenciaPequenoTipo2Pct] = useState<string>('');
  const [tenenciaPequenoTipo3Pct, setTenenciaPequenoTipo3Pct] = useState<string>('');

  const [tenenciaMedianoTipo1Pct, setTenenciaMedianoTipo1Pct] = useState<string>('');
  const [tenenciaMedianoTipo2Pct, setTenenciaMedianoTipo2Pct] = useState<string>('');
  const [tenenciaMedianoTipo3Pct, setTenenciaMedianoTipo3Pct] = useState<string>('');

  const [tenenciaGrandeTipo1Pct, setTenenciaGrandeTipo1Pct] = useState<string>('');
  const [tenenciaGrandeTipo2Pct, setTenenciaGrandeTipo2Pct] = useState<string>('');
  const [tenenciaGrandeTipo3Pct, setTenenciaGrandeTipo3Pct] = useState<string>('');
  
  const [tenenciaWarnings, setTenenciaWarnings] = useState<{pequeno?: string, mediano?: string, grande?: string}>({});

  const [importanciaPorMedioDeVida, setImportanciaPorMedioDeVida] = useState<LivelihoodCharacterization['importanciaPorMedioDeVida']>([]);
  const [destinoProduccion, setDestinoProduccion] = useState<LivelihoodCharacterization['destinoProduccion']>({
    local: false, regional: false, nacional: false, exportacion: false, noAplica: false
  });
  
  useEffect(() => {
    if (currentSystemItemsToCharacterize) {
      setImportanciaPorMedioDeVida(
        currentSystemItemsToCharacterize.map(l => ({
          medioDeVidaId: l.id,
          codigoMedioVida: l.codigoMedioVida,
          nombreMedioVida: l.nombreMedioVida,
          importancia: 0, 
          productoFinal: '',
        }))
      );
    } else {
      setImportanciaPorMedioDeVida([]); 
    }
  }, [currentSystemItemsToCharacterize]);


  const combinedCode = useMemo(() => {
    if (!currentSystemItemsToCharacterize || currentSystemItemsToCharacterize.length === 0) return '';
    return currentSystemItemsToCharacterize.map(l => l.codigoMedioVida).join('_');
  }, [currentSystemItemsToCharacterize]);

  const systemName = useMemo(() => {
    if (!currentSystemItemsToCharacterize || currentSystemItemsToCharacterize.length === 0) return 'Sistema Productivo Desconocido';
    if (currentSystemItemsToCharacterize.length === 1) return currentSystemItemsToCharacterize[0].nombreMedioVida;
    return currentSystemItemsToCharacterize.map(l => l.nombreMedioVida).join(' + ');
  }, [currentSystemItemsToCharacterize]);


  const calculateRanges = () => {
    const min = parseInt(minValor);
    const max = parseInt(maxValor);

    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
      setError('Por favor, ingrese valores numéricos positivos para las unidades.');
      return null;
    }
    if (min > max) {
      setError('La unidad productiva más pequeña no puede ser mayor que la más grande.');
      return null;
    }
    setError('');
    
    const unit = unidadTamanio.trim() || 'unidades';

    if (min === max) {
        return {
            pequeno: `${min} ${unit}`,
            mediano: `N/A`,
            grande: `N/A`,
        };
    }

    const diff = max - min;
    let pEnd = min + Math.floor(diff / 3);
    let mStart = pEnd + 1;
    let mEnd = min + Math.floor(2 * diff / 3);
    let gStart = mEnd + 1;

    if (diff < 2) { 
        pEnd = min;
        mStart = max;
        mEnd = max;
        gStart = max + 1; 
    } else if (diff === 2) { 
        pEnd = min; 
        mStart = min + 1; 
        mEnd = min + 1;
        gStart = max; 
    }

    return {
      pequeno: `${min} - ${pEnd} ${unit}`,
      mediano: (mStart <= mEnd && mStart <= max) ? `${mStart} - ${mEnd} ${unit}` : 'N/A',
      grande: (gStart <= max) ? `${gStart} - ${max} ${unit}` : 'N/A',
    };
  };

  const ranges = useMemo(calculateRanges, [minValor, maxValor, unidadTamanio]);

  const validateTenenciaPercentages = () => {
    const warnings: {pequeno?: string, mediano?: string, grande?: string} = {};
    const categories = [
      { name: 'pequeno', pcts: [tenenciaPequenoTipo1Pct, tenenciaPequenoTipo2Pct, tenenciaPequenoTipo3Pct] },
      { name: 'mediano', pcts: [tenenciaMedianoTipo1Pct, tenenciaMedianoTipo2Pct, tenenciaMedianoTipo3Pct] },
      { name: 'grande', pcts: [tenenciaGrandeTipo1Pct, tenenciaGrandeTipo2Pct, tenenciaGrandeTipo3Pct] },
    ] as const;

    categories.forEach(cat => {
      const numPcts = cat.pcts.map(p => p === '' ? 0 : parseFloat(p)).filter(n => !isNaN(n));
      if (numPcts.length > 0) { 
        const sum = numPcts.reduce((acc, curr) => acc + curr, 0);
        if (sum !== 100 && numPcts.some(p => p !== 0)) { 
          warnings[cat.name] = `La suma de los porcentajes (${sum}%) debe ser 100%.`;
        }
      }
    });
    setTenenciaWarnings(warnings);
  };

  useEffect(validateTenenciaPercentages, [
    tenenciaPequenoTipo1Pct, tenenciaPequenoTipo2Pct, tenenciaPequenoTipo3Pct,
    tenenciaMedianoTipo1Pct, tenenciaMedianoTipo2Pct, tenenciaMedianoTipo3Pct,
    tenenciaGrandeTipo1Pct, tenenciaGrandeTipo2Pct, tenenciaGrandeTipo3Pct,
  ]);

  if (!currentSystemItemsToCharacterize || !initialPrioritizedLivelihoodsFromH32 || !previouslyCharacterizedSystems) {
    return (
      <ToolCard title="Error en Caracterización">
        <p className="text-gray-700 mb-4">
          Faltan datos para caracterizar el sistema productivo. Por favor, vuelva a la selección.
        </p>
        <Button onClick={() => navigate('/paso3/herramienta3_3')} variant="primary">
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Volver a Selección (H3.3)
        </Button>
      </ToolCard>
    );
  }
  
  const handleImportanciaChange = (medioDeVidaId: string, newValue: 0 | 1 | 2 | 3) => {
    setImportanciaPorMedioDeVida(prev => 
      prev.map(item => 
        item.medioDeVidaId === medioDeVidaId ? { ...item, importancia: newValue } : item
      )
    );
  };

  const handleProductoFinalChange = (medioDeVidaId: string, newText: string) => {
    setImportanciaPorMedioDeVida(prev =>
      prev.map(item =>
        item.medioDeVidaId === medioDeVidaId ? { ...item, productoFinal: newText } : item
      )
    );
  };

  const handleDestinoProduccionChange = (name: keyof LivelihoodCharacterization['destinoProduccion'], checked: boolean) => {
    setDestinoProduccion(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSaveAndReturn = () => {
    if (!currentSystemItemsToCharacterize || !ranges) return;

    if (error) {
        alert(`Error en rangos de tamaño: ${error}`);
        return;
    }
    if (Object.values(tenenciaWarnings).some(w => w)) {
        alert(`Error en porcentajes de tenencia: ${Object.values(tenenciaWarnings).filter(Boolean).join('; ')}`);
        return;
    }

    const newCharacterization: LivelihoodCharacterization = {
      id: combinedCode + '_' + Date.now(), 
      sistemaProductivoId: combinedCode,
      livelihoodIdsInSystem: currentSystemItemsToCharacterize.map(l => l.id),
      
      unidadTamanio: unidadTamanio,
      minArea: minValor ? parseFloat(minValor) : null,
      maxArea: maxValor ? parseFloat(maxValor) : null,
      rangoPequenoCalculado: ranges.pequeno,
      rangoMedianoCalculado: ranges.mediano,
      rangoGrandeCalculado: ranges.grande,
      
      tenenciaTipo1Nombre,
      tenenciaTipo2Nombre,
      tenenciaTipo3Nombre,
      
      tenenciaPequenoTipo1Pct: tenenciaPequenoTipo1Pct ? parseFloat(tenenciaPequenoTipo1Pct) : null,
      tenenciaPequenoTipo2Pct: tenenciaPequenoTipo2Pct ? parseFloat(tenenciaPequenoTipo2Pct) : null,
      tenenciaPequenoTipo3Pct: tenenciaPequenoTipo3Pct ? parseFloat(tenenciaPequenoTipo3Pct) : null,
      
      tenenciaMedianoTipo1Pct: tenenciaMedianoTipo1Pct ? parseFloat(tenenciaMedianoTipo1Pct) : null,
      tenenciaMedianoTipo2Pct: tenenciaMedianoTipo2Pct ? parseFloat(tenenciaMedianoTipo2Pct) : null,
      tenenciaMedianoTipo3Pct: tenenciaMedianoTipo3Pct ? parseFloat(tenenciaMedianoTipo3Pct) : null,
      
      tenenciaGrandeTipo1Pct: tenenciaGrandeTipo1Pct ? parseFloat(tenenciaGrandeTipo1Pct) : null,
      tenenciaGrandeTipo2Pct: tenenciaGrandeTipo2Pct ? parseFloat(tenenciaGrandeTipo2Pct) : null,
      tenenciaGrandeTipo3Pct: tenenciaGrandeTipo3Pct ? parseFloat(tenenciaGrandeTipo3Pct) : null,
      
      importanciaPorMedioDeVida,
      destinoProduccion,
    };

    const updatedAllSystems = [...previouslyCharacterizedSystems, newCharacterization];

    navigate('/paso3/herramienta3_3', { 
      state: { 
        prioritizations: initialPrioritizedLivelihoodsFromH32, 
        allCharacterizedSystems: updatedAllSystems 
      } 
    });
  };

  const destinoOptions: Array<{ name: keyof LivelihoodCharacterization['destinoProduccion']; label: string }> = [
    { name: 'local', label: 'Local (para consumo o venta dentro de la comunidad/municipio)' },
    { name: 'regional', label: 'Regional (para venta en mercados o centros de acopio cercanos)' },
    { name: 'nacional', label: 'Nacional (para venta en otras regiones del país)' },
    { name: 'exportacion', label: 'Exportación (para venta fuera del país)' },
    { name: 'noAplica', label: 'No aplica (ej. sistema solo para autoconsumo)' },
  ];
  
  const importanciaOptions = [
    { value: 0, display: '0 (Nula)' },
    { value: 1, display: '1 (Baja)' },
    { value: 2, display: '2 (Media)' },
    { value: 3, display: '3 (Alta)' },
  ];


  return (
    <ToolCard 
      title={`Caracterizar Sistema Productivo: ${systemName}`}
      objetivo="Detallar tamaño, tenencia, importancia y cadena de valor para el sistema productivo seleccionado."
    >
      <Button 
        onClick={() => navigate('/paso3/herramienta3_3', { 
          state: { 
            prioritizations: initialPrioritizedLivelihoodsFromH32,
            allCharacterizedSystems: previouslyCharacterizedSystems 
          } 
        })} 
        variant="outline" 
        size="sm" 
        className="mb-6"
      >
        <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
        Volver a Selección de Sistemas
      </Button>

      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold text-[#001F89] mb-1">Sistema Productivo Seleccionado:</h3>
        <p className="text-gray-700 font-bold text-lg">{systemName}</p>
        <p className="text-sm text-gray-500 font-mono">Código Combinado: {combinedCode}</p>
        <div className="flex flex-wrap gap-2 mt-3">
            {currentSystemItemsToCharacterize.map(item => {
                return (
                    <div key={item.id} className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200 text-xs">
                        <span>{item.nombreMedioVida} ({item.codigoMedioVida})</span>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Section 1: Tamaño */}
      <div className="p-5 border border-gray-200 rounded-xl shadow-lg bg-white mb-8">
        <div className="flex items-center text-[#001F89] mb-4">
          <ScaleIcon className="h-7 w-7 mr-2" />
          <h3 className="text-xl font-bold">1. Tamaño de las Unidades Productivas</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Defina la unidad de medida (ej. hectáreas, cabezas de ganado, etc.) e ingrese el rango de tamaño para las unidades productivas típicas de este sistema.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-3">
          <Input 
            label="Unidad de Medida"
            value={unidadTamanio}
            onChange={e => setUnidadTamanio(e.target.value)}
            placeholder="Ej: hectáreas"
          />
          <Input 
            label="Unidad productiva más pequeña"
            type="number" 
            value={minValor} 
            onChange={e => setMinValor(e.target.value)}
            placeholder="Ej: 1"
            min="0.1"
            step="0.1"
          />
          <Input 
            label="Unidad productiva más grande"
            type="number" 
            value={maxValor} 
            onChange={e => setMaxValor(e.target.value)}
            placeholder="Ej: 50"
            min="0.1"
            step="0.1"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {ranges && !error && (
          <div className="grid md:grid-cols-3 gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div><span className="font-semibold text-blue-700">Pequeño:</span> {ranges.pequeno}</div>
            <div><span className="font-semibold text-blue-700">Mediano:</span> {ranges.mediano}</div>
            <div><span className="font-semibold text-blue-700">Grande:</span> {ranges.grande}</div>
          </div>
        )}
      </div>

      {/* Section 2: Tenencia y Porcentaje */}
      <div className="p-5 border border-gray-200 rounded-xl shadow-lg bg-white mb-8">
        <div className="flex items-center text-[#001F89] mb-4">
          <ClipboardIcon className="h-7 w-7 mr-2" />
          <h3 className="text-xl font-bold">2. Tenencia y Porcentaje</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Identifique hasta 3 tipos principales de tenencia de la tierra para este sistema. Luego, para cada tamaño de unidad productiva (Pequeño, Mediano, Grande), estime el porcentaje (%) de cada tipo de tenencia. 
          <span className="font-semibold">La suma de porcentajes por tamaño debe ser 100%.</span>
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Input label="Tipo de Tenencia 1" value={tenenciaTipo1Nombre} onChange={e => setTenenciaTipo1Nombre(e.target.value)} placeholder="Ej: Propia"/>
            <Input label="Tipo de Tenencia 2" value={tenenciaTipo2Nombre} onChange={e => setTenenciaTipo2Nombre(e.target.value)} placeholder="Ej: Arrendada"/>
            <Input label="Tipo de Tenencia 3" value={tenenciaTipo3Nombre} onChange={e => setTenenciaTipo3Nombre(e.target.value)} placeholder="Ej: Comunal"/>
        </div>

        {ranges && !error && ['pequeno', 'mediano', 'grande'].map(sizeKey => {
          const sizeLabel = sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1);
          const rangeText = ranges[sizeKey as keyof typeof ranges];
          if (rangeText === 'N/A') return null;

          let pcts: [string, React.Dispatch<React.SetStateAction<string>>][];
          if (sizeKey === 'pequeno') {
            pcts = [
              [tenenciaPequenoTipo1Pct, setTenenciaPequenoTipo1Pct], 
              [tenenciaPequenoTipo2Pct, setTenenciaPequenoTipo2Pct], 
              [tenenciaPequenoTipo3Pct, setTenenciaPequenoTipo3Pct]
            ];
          } else if (sizeKey === 'mediano') {
            pcts = [
              [tenenciaMedianoTipo1Pct, setTenenciaMedianoTipo1Pct], 
              [tenenciaMedianoTipo2Pct, setTenenciaMedianoTipo2Pct], 
              [tenenciaMedianoTipo3Pct, setTenenciaMedianoTipo3Pct]
            ];
          } else { // grande
            pcts = [
              [tenenciaGrandeTipo1Pct, setTenenciaGrandeTipo1Pct], 
              [tenenciaGrandeTipo2Pct, setTenenciaGrandeTipo2Pct], 
              [tenenciaGrandeTipo3Pct, setTenenciaGrandeTipo3Pct]
            ];
          }
          
          const typeNames = [tenenciaTipo1Nombre, tenenciaTipo2Nombre, tenenciaTipo3Nombre];

          return (
            <div key={sizeKey} className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
              <h5 className="font-semibold text-md text-gray-800 mb-1">
                {sizeLabel} ({rangeText})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pcts.map(([pctVal, setPctVal], index) => (
                  <Input
                    key={index}
                    label={`${typeNames[index] || `Tipo ${index + 1}`}${typeNames[index] ? '' : ' (no definido)' } (%)`}
                    type="number"
                    value={pctVal}
                    onChange={e => setPctVal(e.target.value)}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    disabled={!typeNames[index]} 
                    className={!typeNames[index] ? "bg-gray-200" : ""}
                  />
                ))}
              </div>
              {tenenciaWarnings[sizeKey as keyof typeof tenenciaWarnings] && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1"/>
                  {tenenciaWarnings[sizeKey as keyof typeof tenenciaWarnings]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Section 3: Importancia y Cadena de Valor */}
      <div className="p-5 border border-gray-200 rounded-xl shadow-lg bg-white mb-8">
        <div className="flex items-center text-[#001F89] mb-4">
          <BriefcaseIcon className="h-7 w-7 mr-2" />
          <h3 className="text-xl font-bold">3. Importancia y Cadena de Valor</h3>
        </div>
        <p className="text-sm text-gray-600 mb-1">
            Para cada medio de vida dentro de este sistema productivo, califique su importancia y describa su producto final.
        </p>        
        <p className="text-xs text-gray-500 mb-4">Importancia: 0 (Nula), 1 (Baja), 2 (Media), 3 (Alta).</p>

        <div className="space-y-6">
            {importanciaPorMedioDeVida && importanciaPorMedioDeVida.length > 0 ? (
                importanciaPorMedioDeVida.map(item => (
                    <div 
                      key={item.medioDeVidaId} 
                      className="p-4 border border-gray-100 rounded-lg bg-gray-50/50"
                      style={{ contain: 'layout' }} // Apply contain:layout here
                    >
                        <h4 className="font-semibold text-md text-gray-800 mb-2">
                            {item.nombreMedioVida} ({item.codigoMedioVida})
                        </h4>
                        <StyledRadioSelect
                            label="Importancia para el sistema productivo:"
                            name={`importancia-${item.medioDeVidaId}`}
                            value={item.importancia}
                            options={importanciaOptions}
                            onChange={(val) => handleImportanciaChange(item.medioDeVidaId, val as 0 | 1 | 2 | 3)}
                            inline={true}
                        />
                        <Textarea
                            label="Producto(s) final(es) que aporta al sistema:"
                            value={item.productoFinal}
                            onChange={(e) => handleProductoFinalChange(item.medioDeVidaId, e.target.value)}
                            placeholder="Ej: Granos para venta, leche para quesos, etc."
                            rows={2}
                            className="text-sm mt-2"
                        />
                    </div>
                ))
            ) : (
                <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 text-center">
                    <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                        No hay elementos de medios de vida para detallar en esta sección.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Esto puede ocurrir si no se seleccionaron medios de vida para este sistema productivo en el paso anterior, o si los datos no se cargaron correctamente.
                    </p>
                </div>
            )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
             <CheckboxGroup
                label="Destino Principal de la Producción del Sistema Productivo:"
                options={destinoOptions}
                values={destinoProduccion}
                onChange={handleDestinoProduccionChange}
                helpText="Seleccione todos los que apliquen."
            />
        </div>
      </div>
      
      {/* Save Button */}
      <div className="mt-8 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSaveAndReturn}
          aria-label="Guardar caracterización y volver a la selección de sistemas"
        >
          <CheckIcon className="h-5 w-5 mr-2 inline-block" />
          Guardar Caracterización y Volver
        </Button>
      </div>

    </ToolCard>
  );
};