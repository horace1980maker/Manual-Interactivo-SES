
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { PrioritizedLivelihood, LivelihoodItem } from '../../types'; 
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const SESSION_KEY_H32_PRIORITIZATIONS = 'prioritizedLivelihoods_H32';
const SESSION_KEY_H31_DETAILED_LIVELIHOODS = 'detailedLivelihoodsForH34';

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (score: number) => void;
  namePrefix: string;
  criterionKey: string;
  helpText?: string;
}

const RatingInput: React.FC<RatingInputProps> = ({ label, value, onChange, namePrefix, criterionKey, helpText }) => (
  <div className="mb-3">
    <label htmlFor={`${namePrefix}-${criterionKey}-label`} className="block text-sm font-medium text-gray-700">{label}</label>
    {helpText && <p className="text-xs text-gray-500 mb-1">{helpText}</p>}
    <div className="flex space-x-1 sm:space-x-2 mt-1" role="radiogroup" id={`${namePrefix}-${criterionKey}-label`}>
      {[0, 1, 2, 3].map(score => (
        <label 
          key={score} 
          className={`cursor-pointer px-2.5 py-1.5 sm:px-3 border rounded-md text-sm font-medium transition-colors w-full text-center
          ${value === score 
            ? 'bg-[#009EE2] text-white border-[#008ACE]' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`
        }>
          <input
            type="radio"
            name={`${namePrefix}-${criterionKey}`}
            value={score}
            checked={value === score}
            onChange={() => {
              requestAnimationFrame(() => {
                onChange(score);
              });
            }}
            className="sr-only" 
            aria-label={`${label} ${score}`}
          />
          {score}
        </label>
      ))}
    </div>
  </div>
);

export const Herramienta3_2_PriorizacionMediosVida: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [prioritizations, setPrioritizations] = useState<PrioritizedLivelihood[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This effect loads the initial data from various sources for robustness
  useEffect(() => {
    setIsLoading(true);

    const mapLivelihoodsToPrioritizations = (livelihoods: LivelihoodItem[]): PrioritizedLivelihood[] => {
      return livelihoods.map(lv => ({
        id: lv.id,
        nombreMedioVida: lv.nombre,
        codigoMedioVida: lv.codigo,
        productosPrincipales: '',
        seguridadAlimentaria: 0,
        area: 0,
        desarrolloLocal: 0,
        ambiente: 0,
        inclusion: 0,
        total: 0,
      }));
    };

    // Priority 1: Data passed directly in navigation state
    const prioritizationsFromH31 = location.state?.livelihoodsToPrioritize as PrioritizedLivelihood[] | undefined;
    if (prioritizationsFromH31 && prioritizationsFromH31.length > 0) {
        // Data from H3.1 Detail is already in the correct PrioritizedLivelihood format.
        setPrioritizations(prioritizationsFromH31);
        setIsLoading(false);
        return;
    }

    const prioritizationsFromResumen = location.state?.prioritizations as PrioritizedLivelihood[] | undefined;
    if (prioritizationsFromResumen) {
        setPrioritizations(prioritizationsFromResumen);
        setIsLoading(false);
        return;
    }

    // Priority 2: Try to load existing work-in-progress from session storage
    try {
      const storedDataRaw = sessionStorage.getItem(SESSION_KEY_H32_PRIORITIZATIONS);
      if (storedDataRaw) {
        const storedData = JSON.parse(storedDataRaw);
        if (Array.isArray(storedData) && storedData.length > 0) {
          setPrioritizations(storedData);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Error loading H3.2 data from session storage", e);
    }
    
    // Priority 3: Fallback - try to initialize from H3.1's output if no WIP exists
    try {
        const storedH31Raw = sessionStorage.getItem(SESSION_KEY_H31_DETAILED_LIVELIHOODS);
        if (storedH31Raw) {
            const h31Livelihoods: LivelihoodItem[] = JSON.parse(storedH31Raw);
            if(h31Livelihoods && h31Livelihoods.length > 0) {
                setPrioritizations(mapLivelihoodsToPrioritizations(h31Livelihoods));
                setIsLoading(false);
                return;
            }
        }
    } catch(e) { console.error("Error loading H3.1 data as fallback for H3.2", e); }


    // Final state if no data is found
    setPrioritizations([]);
    setIsLoading(false);
  }, [location.state]);
  
  // This effect persists the data whenever it changes
  useEffect(() => {
    // Only save if there's actual data, prevents overwriting on initial load before data is set.
    if (prioritizations.length > 0 && !isLoading) {
        try {
            sessionStorage.setItem(SESSION_KEY_H32_PRIORITIZATIONS, JSON.stringify(prioritizations));
        } catch (error) {
            console.error("Error saving H3.2 prioritizations to session storage", error);
        }
    }
  }, [prioritizations, isLoading]);

  const updatePrioritization = (id: string, field: keyof PrioritizedLivelihood, value: any) => {
    setPrioritizations(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updatedP = { ...p, [field]: value };
          if (['seguridadAlimentaria', 'area', 'desarrolloLocal', 'ambiente', 'inclusion'].includes(field as string)) {
            updatedP.total = (updatedP.seguridadAlimentaria || 0) + 
                             (updatedP.area || 0) + 
                             (updatedP.desarrolloLocal || 0) + 
                             (updatedP.ambiente || 0) + 
                             (updatedP.inclusion || 0);
          }
          return updatedP;
        }
        return p;
      })
    );
  };

  if (isLoading) {
    return (
        <ToolCard title="Herramienta 3.2 - Priorización de Medios de Vida">
            <p className="text-gray-700">Cargando datos de medios de vida...</p>
        </ToolCard>
    );
  }

  if (!isLoading && prioritizations.length === 0) {
    return (
      <ToolCard 
        title="Herramienta 3.2 - Priorización de Medios de Vida"
        objetivo="Priorizar los medios de vida en función de su importancia para la seguridad alimentaria, la economía local, la inclusión social, el medio ambiente y el área de influencia."
      >
        <p className="text-gray-700 mb-4">
          No se han seleccionado medios de vida para priorizar. Por favor, complete la Herramienta 3.1 y su pantalla de detalles primero.
        </p>
        <Button onClick={() => navigate('/paso3/herramienta3_1')} variant="primary">
          <ChevronLeftIcon className="h-5 w-5 mr-2 inline-block" />
          Ir a Selección de Medios de Vida (H3.1)
        </Button>
      </ToolCard>
    );
  }

  return (
    <ToolCard 
      title="Herramienta 3.2 - Priorización de Medios de Vida"
      objetivo="Priorizar los medios de vida en función de su importancia para la seguridad alimentaria, la economía local, la inclusión social, el medio ambiente y el área de influencia."
    >
      <p className="text-sm text-gray-600 mb-6">
        Para cada medio de vida seleccionado, liste sus productos principales y califique su importancia según los criterios (0 = Nula, 1 = Baja, 2 = Media, 3 = Alta).
      </p>
      <div className="space-y-8">
        {prioritizations.map(item => {
          return (
            <div 
              key={item.id} 
              className="p-5 border border-gray-200 rounded-xl shadow-lg bg-white"
              style={{ contain: 'layout' }} 
            >
              <div className="flex items-center mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#001F89]">
                  {item.nombreMedioVida} <span className="text-lg font-mono text-[#009EE2]">({item.codigoMedioVida})</span>
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:pr-4">
                  <Textarea
                    label="PRODUCTOS PRINCIPALES"
                    value={item.productosPrincipales}
                    onChange={(e) => updatePrioritization(item.id, 'productosPrincipales', e.target.value)}
                    rows={7}
                    className="text-sm bg-gray-50 focus:bg-white"
                    placeholder="Listar productos principales, ej:\n* Harina\n* Trigo pelado..."
                    wrapperClassName="mb-0"
                  />
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-2 uppercase tracking-wide">IMPORTANCIA</h4>
                  <RatingInput
                    label="Seguridad Alimentaria"
                    value={item.seguridadAlimentaria}
                    onChange={(score) => updatePrioritization(item.id, 'seguridadAlimentaria', score)}
                    namePrefix={item.id}
                    criterionKey="sa"
                  />
                  <RatingInput
                    label="Área (Extensión/Cobertura)"
                    value={item.area}
                    onChange={(score) => updatePrioritization(item.id, 'area', score)}
                    namePrefix={item.id}
                    criterionKey="ar"
                  />
                  <RatingInput
                    label="Desarrollo Local (Economía/Empleo)"
                    value={item.desarrolloLocal}
                    onChange={(score) => updatePrioritization(item.id, 'desarrolloLocal', score)}
                    namePrefix={item.id}
                    criterionKey="dl"
                  />
                  <RatingInput
                    label="Ambiente (Impacto/Sostenibilidad)"
                    value={item.ambiente}
                    onChange={(score) => updatePrioritization(item.id, 'ambiente', score)}
                    namePrefix={item.id}
                    criterionKey="am"
                  />
                  <RatingInput
                    label="Inclusión (Participación equitativa)"
                    value={item.inclusion}
                    onChange={(score) => updatePrioritization(item.id, 'inclusion', score)}
                    namePrefix={item.id}
                    criterionKey="in"
                  />
                  
                  <div className="mt-5 pt-3 border-t border-gray-300 flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <span className="text-lg font-bold text-gray-800">TOTAL</span>
                    <span className="text-3xl font-extrabold text-[#001F89] px-4 py-1.5 bg-white border-2 border-[#001F89] rounded-lg shadow-sm">
                      {item.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
       <div className="mt-6 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-700">
        <strong>Nota:</strong> Los datos ingresados aquí se guardan automáticamente en la sesión de su navegador.
      </div>

      {prioritizations.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('resumen', { state: { prioritizations } })}
            aria-label="Ver la priorización de medios de vida"
          >
            Ver la Priorización
          </Button>
        </div>
      )}

    </ToolCard>
  );
};
