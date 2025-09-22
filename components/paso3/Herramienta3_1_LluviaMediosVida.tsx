
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { SelectableCard } from '../common/SelectableCard';
import { LivelihoodItem, EcosystemItem } from '../../types';
import { ArrowRightIcon, ExclamationTriangleIcon, DocumentArrowUpIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '../common/Input';

const SESSION_KEY_UPLOADED_LIVELIHOODS = 'H31_UPLOADED_LIVELIHOODS';
const SESSION_KEY_UPLOADED_ECOSYSTEMS = 'H31_UPLOADED_ECOSYSTEMS';
const SESSION_KEY_SELECTED_LIVELIHOOD_IDS = 'H31_SELECTED_LIVELIHOOD_IDS';
const SESSION_KEY_SELECTED_ECOSYSTEM_IDS = 'H31_SELECTED_ECOSYSTEM_IDS';
const SESSION_KEY_FILE_NAME = 'H31_FILE_NAME';
const SESSION_KEY_FECHA = 'H31_PAISAJE_FECHA';
const SESSION_KEY_PAIS = 'H31_PAISAJE_PAIS';
const SESSION_KEY_GRUPO = 'H31_PAISAJE_GRUPO';


// Helper function to generate a unique code from a name
const generateCode = (name: string, existingCodes: Set<string>): string => {
  let code = name.substring(0, 2).toUpperCase();
  if (name.includes(' ')) {
      const parts = name.split(' ');
      if (parts.length > 1 && parts[0] && parts[1]) {
        code = (parts[0].substring(0,1) + parts[1].substring(0,1)).toUpperCase();
      }
  }
  let counter = 1;
  let finalCode = code;
  while (existingCodes.has(finalCode)) {
    finalCode = `${code}${counter}`;
    counter++;
  }
  return finalCode;
};

// Helper function to find a column by possible names (case-insensitive)
const findColumnName = (header: string[], possibleNames: string[]): string | undefined => {
  const lowerCaseNames = possibleNames.map(name => name.toLowerCase());
  return header.find(h => lowerCaseNames.includes(h.toLowerCase()));
};


export const Herramienta3_1_LluviaMediosVida: React.FC = () => {
  const navigate = useNavigate();
  
  const [uploadedLivelihoods, setUploadedLivelihoods] = useState<LivelihoodItem[]>([]);
  const [uploadedEcosystems, setUploadedEcosystems] = useState<EcosystemItem[]>([]);
  const [selectedLivelihoodIds, setSelectedLivelihoodIds] = useState<string[]>([]);
  const [selectedEcosystemIds, setSelectedEcosystemIds] = useState<string[]>([]);

  const [fileName, setFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [fecha, setFecha] = useState<string>('');
  const [pais, setPais] = useState<string>('');
  const [grupo, setGrupo] = useState<string>('');

  // Load all data from session storage on initial mount
  useEffect(() => {
    try {
      const storedLivelihoods = sessionStorage.getItem(SESSION_KEY_UPLOADED_LIVELIHOODS);
      if (storedLivelihoods) setUploadedLivelihoods(JSON.parse(storedLivelihoods));
      
      const storedEcosystems = sessionStorage.getItem(SESSION_KEY_UPLOADED_ECOSYSTEMS);
      if (storedEcosystems) setUploadedEcosystems(JSON.parse(storedEcosystems));
      
      const storedLivelihoodIds = sessionStorage.getItem(SESSION_KEY_SELECTED_LIVELIHOOD_IDS);
      if (storedLivelihoodIds) setSelectedLivelihoodIds(JSON.parse(storedLivelihoodIds));
      
      const storedEcosystemIds = sessionStorage.getItem(SESSION_KEY_SELECTED_ECOSYSTEM_IDS);
      if (storedEcosystemIds) setSelectedEcosystemIds(JSON.parse(storedEcosystemIds));

      const storedFileName = sessionStorage.getItem(SESSION_KEY_FILE_NAME);
      if (storedFileName) setFileName(storedFileName);
      
      const storedFecha = sessionStorage.getItem(SESSION_KEY_FECHA);
      if (storedFecha) setFecha(storedFecha);
      
      const storedPais = sessionStorage.getItem(SESSION_KEY_PAIS);
      if (storedPais) setPais(storedPais);
      
      const storedGrupo = sessionStorage.getItem(SESSION_KEY_GRUPO);
      if (storedGrupo) setGrupo(storedGrupo);

    } catch (e) {
      console.error("Error parsing data from sessionStorage", e);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_FECHA, fecha);
  }, [fecha]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_PAIS, pais);
  }, [pais]);
  
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_GRUPO, grupo);
  }, [grupo]);

  const handleClearData = useCallback(() => {
    // Clear state
    setUploadedLivelihoods([]);
    setUploadedEcosystems([]);
    setSelectedLivelihoodIds([]);
    setSelectedEcosystemIds([]);
    setUploadError(null);
    setFileName('');
    setFecha('');
    setPais('');
    setGrupo('');
    // Clear session storage
    sessionStorage.removeItem(SESSION_KEY_UPLOADED_LIVELIHOODS);
    sessionStorage.removeItem(SESSION_KEY_UPLOADED_ECOSYSTEMS);
    sessionStorage.removeItem(SESSION_KEY_SELECTED_LIVELIHOOD_IDS);
    sessionStorage.removeItem(SESSION_KEY_SELECTED_ECOSYSTEM_IDS);
    sessionStorage.removeItem(SESSION_KEY_FILE_NAME);
    sessionStorage.removeItem(SESSION_KEY_FECHA);
    sessionStorage.removeItem(SESSION_KEY_PAIS);
    sessionStorage.removeItem(SESSION_KEY_GRUPO);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = ''; // Allow re-uploading the same file
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
      processFile(file);
    } else {
      setUploadError('Por favor, suelte un archivo Excel (.xlsx, .xls).');
    }
  };

  const processFile = (file: File) => {
    handleClearData(); // Clear all previous data upon new file upload
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
            setUploadError('El archivo Excel está vacío o tiene un formato incorrecto.');
            return;
        }

        const header = Object.keys(json[0]);
        const livelihoodColName = findColumnName(header, ['Medios de Vida', 'medios de vida', 'medio de vida']);
        const ecosystemColName = findColumnName(header, ['Ecosistemas', 'ecosistemas', 'ecosistema']);

        if (!livelihoodColName && !ecosystemColName) {
          setUploadError('El archivo debe contener al menos una columna llamada "Medios de Vida" o "Ecosistemas".');
          return;
        }

        const parsedLivelihoods: LivelihoodItem[] = [];
        const livelihoodNames = new Set<string>();
        const livelihoodCodes = new Set<string>();

        const parsedEcosystems: EcosystemItem[] = [];
        const ecosystemNames = new Set<string>();
        const ecosystemCodes = new Set<string>();

        json.forEach((row, index) => {
          if (livelihoodColName) {
            const name = row[livelihoodColName]?.toString().trim();
            if (name && !livelihoodNames.has(name)) {
              livelihoodNames.add(name);
              const code = generateCode(name, livelihoodCodes);
              livelihoodCodes.add(code);
              parsedLivelihoods.push({ id: `livelihood-${index}`, nombre: name, codigo: code, categoria: 'medioDeVida' });
            }
          }
          if (ecosystemColName) {
            const name = row[ecosystemColName]?.toString().trim();
            if (name && !ecosystemNames.has(name)) {
              ecosystemNames.add(name);
              const code = generateCode(name, ecosystemCodes);
              ecosystemCodes.add(code);
              parsedEcosystems.push({ id: `ecosystem-${index}`, nombre: name, codigo: code, categoria: 'ecosistema', salud: 2 });
            }
          }
        });
        
        setUploadedLivelihoods(parsedLivelihoods);
        sessionStorage.setItem(SESSION_KEY_UPLOADED_LIVELIHOODS, JSON.stringify(parsedLivelihoods));
        setUploadedEcosystems(parsedEcosystems);
        sessionStorage.setItem(SESSION_KEY_UPLOADED_ECOSYSTEMS, JSON.stringify(parsedEcosystems));
        
        setFileName(file.name);
        sessionStorage.setItem(SESSION_KEY_FILE_NAME, file.name);
        setUploadError(null);
      } catch (err) {
        console.error('Error al procesar el archivo Excel:', err);
        setUploadError('Hubo un error al procesar el archivo. Asegúrese de que es un archivo Excel válido.');
      }
    };
    reader.onerror = () => {
      setUploadError('No se pudo leer el archivo.');
    };
    reader.readAsArrayBuffer(file);
  };
  
  const handleToggleSelect = (id: string, categoria: 'medioDeVida' | 'ecosistema') => {
    if (categoria === 'medioDeVida') {
      const newSelection = selectedLivelihoodIds.includes(id)
        ? selectedLivelihoodIds.filter(i => i !== id)
        : [...selectedLivelihoodIds, id];
      setSelectedLivelihoodIds(newSelection);
      sessionStorage.setItem(SESSION_KEY_SELECTED_LIVELIHOOD_IDS, JSON.stringify(newSelection));
    } else { // Ecosistema
      const newSelection = selectedEcosystemIds.includes(id)
        ? selectedEcosystemIds.filter(i => i !== id)
        : [...selectedEcosystemIds, id];
      setSelectedEcosystemIds(newSelection);
      sessionStorage.setItem(SESSION_KEY_SELECTED_ECOSYSTEM_IDS, JSON.stringify(newSelection));
    }
  };

  const handleProceedToDetail = () => {
    const selectedLivelihoods = uploadedLivelihoods.filter(item => selectedLivelihoodIds.includes(item.id));
    const selectedEcosystems = uploadedEcosystems.filter(item => selectedEcosystemIds.includes(item.id));
    
    navigate('detalle', { 
      state: { 
        selectedLivelihoods, 
        selectedEcosystems 
      } 
    });
  };
  
  const isSelectionMade = selectedLivelihoodIds.length > 0 || selectedEcosystemIds.length > 0;
  const isDataLoaded = uploadedLivelihoods.length > 0 || uploadedEcosystems.length > 0;

  return (
    <ToolCard 
      title="H3.1 Lluvia de Medios de Vida y Ecosistemas"
      objetivo="Cargar un archivo Excel para identificar y seleccionar los principales medios de vida y ecosistemas presentes en el paisaje, que serán la base para los análisis posteriores."
    >
        <div
            className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                ${isDragOver ? 'border-[#009EE2] bg-[#EBF5FF]' : 'border-gray-300 bg-gray-50 hover:border-[#001F89]'}
            `}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload-h31')?.click()}
        >
            <input id="file-upload-h31" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls" />
            <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-2"/>
            <p className="text-sm text-gray-600">Arrastre y suelte su archivo Excel aquí, o <span className="font-semibold text-[#001F89]">haga clic para seleccionar</span>.</p>
            <p className="text-xs text-gray-500 mt-1">El archivo debe contener las columnas "Medios de Vida" y/o "Ecosistemas".</p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <InformationCircleIcon className="h-5 w-5 inline-block mr-1 text-yellow-600" />
            Cuando suba un nuevo archivo, los datos existentes serán limpiados.
        </p>
        
        {uploadError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-sm text-red-700 flex items-center">
                <XCircleIcon className="h-5 w-5 mr-2" />
                <span>{uploadError}</span>
            </div>
        )}

        {isDataLoaded && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4 text-center">Archivo Cargado: <span className="font-normal">{fileName}</span></h3>
            
            <div className="my-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
                <h3 className="text-xl font-semibold text-[#001F89] mb-3">Información del Paisaje</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                    label="Fecha (dd/mm/aaaa)"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    placeholder="dd/mm/aaaa"
                    />
                    <Input
                    label="País"
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    placeholder="Nombre del país"
                    />
                    <Input
                    label="Grupo"
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                    placeholder="Nombre del grupo participante"
                    />
                </div>
            </div>

            {uploadedLivelihoods.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#001F89] mb-3">1. Seleccione los Medios de Vida</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedLivelihoods.map(item => (
                        <SelectableCard
                        key={item.id}
                        item={item}
                        isSelected={selectedLivelihoodIds.includes(item.id)}
                        onToggleSelect={handleToggleSelect}
                        />
                    ))}
                    </div>
                </div>
            )}

            {uploadedEcosystems.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#001F89] mb-3">2. Seleccione los Ecosistemas</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedEcosystems.map(item => (
                        <SelectableCard
                        key={item.id}
                        item={item}
                        isSelected={selectedEcosystemIds.includes(item.id)}
                        onToggleSelect={handleToggleSelect}
                        />
                    ))}
                    </div>
                </div>
            )}
          </div>
        )}
        
        {isDataLoaded && (
            <div className="mt-10 pt-6 border-t border-gray-300 text-center">
                {!isSelectionMade && (
                    <div className="inline-block p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-700 mb-4">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2 inline-block" />
                    Por favor, seleccione al menos un medio de vida o ecosistema para continuar.
                    </div>
                )}
                <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToDetail}
                disabled={!isSelectionMade}
                aria-label="Continuar para especificar detalles"
                >
                Especificar Detalles
                <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
                </Button>
            </div>
        )}
    </ToolCard>
  );
};
