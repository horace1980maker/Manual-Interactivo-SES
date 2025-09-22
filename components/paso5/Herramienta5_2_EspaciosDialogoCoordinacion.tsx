
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { StyledRadioSelect } from '../common/StyledRadioSelect';
import { EspacioDialogo, ActorPaisaje } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon, ChevronLeftIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const SESSION_STORAGE_H51_ACTORES_KEY = 'H51_ACTORES_PAISAJE_KEY';
const SESSION_STORAGE_H52_ESPACIOS_KEY = 'H52_ESPACIOS_DIALOGO_KEY';

const initialEspacioFormState: Omit<EspacioDialogo, 'id'> = {
  nombre: '',
  tipo: '',
  alcance: '',
  actoresInvolucrados: '', // Will store comma-separated actor names
  funcionPrincipal: '',
  nivelIncidencia: '',
  fortalezas: '',
  debilidades: '',
};

type StageH52 = 'viewList' | 'addEditForm';

export const Herramienta5_2_EspaciosDialogoCoordinacion: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState<StageH52>('viewList');
  const [espaciosDialogoList, setEspaciosDialogoList] = useState<EspacioDialogo[]>([]);
  const [currentEspacioForm, setCurrentEspacioForm] = useState<Partial<EspacioDialogo>>(initialEspacioFormState);
  const [editingEspacioId, setEditingEspacioId] = useState<string | null>(null);
  
  const [availableActors, setAvailableActors] = useState<ActorPaisaje[]>([]);
  const [selectedActorNamesInForm, setSelectedActorNamesInForm] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedEspacios = sessionStorage.getItem(SESSION_STORAGE_H52_ESPACIOS_KEY);
      if (storedEspacios) {
        setEspaciosDialogoList(JSON.parse(storedEspacios));
      }
      const storedActors = sessionStorage.getItem(SESSION_STORAGE_H51_ACTORES_KEY);
      if (storedActors) {
        setAvailableActors(JSON.parse(storedActors));
      }
    } catch (error) {
      console.error("Error loading data for H5.2 from sessionStorage:", error);
    }
  }, []);

  const saveEspaciosToSessionStorage = (updatedList: EspacioDialogo[]) => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_H52_ESPACIOS_KEY, JSON.stringify(updatedList));
    } catch (error) {
      console.error("Error saving H5.2 Espacios to sessionStorage:", error);
    }
  };

  const handleInputChange = (field: keyof Omit<EspacioDialogo, 'id' | 'actoresInvolucrados' | 'tipo' | 'nivelIncidencia'>, value: string) => {
    setCurrentEspacioForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRadioChange = (field: 'tipo' | 'nivelIncidencia', value: string) => {
    setCurrentEspacioForm(prev => ({ ...prev, [field]: value as any }));
  };

  const handleActorInvolucradoChange = (actorName: string) => {
    setSelectedActorNamesInForm(prev =>
      prev.includes(actorName)
        ? prev.filter(name => name !== actorName)
        : [...prev, actorName]
    );
  };

  const handleAddNewEspacio = () => {
    setEditingEspacioId(null);
    setCurrentEspacioForm(initialEspacioFormState);
    setSelectedActorNamesInForm([]);
    setCurrentStage('addEditForm');
  };

  const handleEditEspacio = (espacio: EspacioDialogo) => {
    setEditingEspacioId(espacio.id);
    setCurrentEspacioForm({ ...espacio });
    setSelectedActorNamesInForm(espacio.actoresInvolucrados ? espacio.actoresInvolucrados.split(',').map(s => s.trim()) : []);
    setCurrentStage('addEditForm');
  };

  const handleSaveEspacio = () => {
    if (!currentEspacioForm.nombre?.trim()) {
      alert('El nombre del espacio de diálogo es obligatorio.');
      return;
    }

    const processedForm: EspacioDialogo = {
      ...initialEspacioFormState, // Ensure all fields are present
      ...currentEspacioForm,
      actoresInvolucrados: selectedActorNamesInForm.join(', '),
      id: editingEspacioId || Date.now().toString(),
    } as EspacioDialogo;


    let updatedList;
    if (editingEspacioId) {
      updatedList = espaciosDialogoList.map(e => e.id === editingEspacioId ? processedForm : e);
    } else {
      updatedList = [...espaciosDialogoList, processedForm];
    }
    setEspaciosDialogoList(updatedList);
    saveEspaciosToSessionStorage(updatedList);
    setCurrentStage('viewList');
  };

  const handleDeleteEspacio = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este espacio de diálogo?')) {
      const updatedList = espaciosDialogoList.filter(e => e.id !== id);
      setEspaciosDialogoList(updatedList);
      saveEspaciosToSessionStorage(updatedList);
    }
  };

  const handleCancelEdit = () => {
    setCurrentStage('viewList');
    setEditingEspacioId(null);
    setCurrentEspacioForm(initialEspacioFormState);
    setSelectedActorNamesInForm([]);
  };

  const tipoOptions: Array<{ value: 'Formal' | 'Informal'; display: string }> = [
    { value: 'Formal', display: 'Formal' },
    { value: 'Informal', display: 'Informal' },
  ];

  const nivelIncidenciaOptions: Array<{ value: 'Bajo' | 'Medio' | 'Alto'; display: string }> = [
    { value: 'Bajo', display: 'Bajo' },
    { value: 'Medio', display: 'Medio' },
    { value: 'Alto', display: 'Alto' },
  ];

  if (currentStage === 'addEditForm') {
    return (
      <ToolCard title={editingEspacioId ? "Editar Espacio de Diálogo" : "Añadir Nuevo Espacio de Diálogo"}>
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <Input
            label="Nombre del Espacio de Diálogo"
            value={currentEspacioForm.nombre || ''}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            placeholder="Ej: Mesa Técnica del Agua"
          />
          <StyledRadioSelect
            label="Tipo"
            name="tipoEspacio"
            options={tipoOptions}
            value={currentEspacioForm.tipo || ''}
            onChange={(val) => handleRadioChange('tipo', val as string)}
            inline
          />
          <Input
            label="Alcance"
            value={currentEspacioForm.alcance || ''}
            onChange={(e) => handleInputChange('alcance', e.target.value)}
            placeholder="Ej: Municipal, Comunitario, Regional"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Actores Involucrados (seleccione de H5.1):</label>
            <div className="max-h-40 overflow-y-auto p-2 border rounded-md bg-white space-y-1">
              {availableActors.length > 0 ? availableActors.map(actor => (
                <label key={actor.id} className="flex items-center space-x-2 text-sm text-gray-700 p-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedActorNamesInForm.includes(actor.nombre)}
                    onChange={() => handleActorInvolucradoChange(actor.nombre)}
                  />
                  <span>{actor.nombre}</span>
                </label>
              )) : <p className="text-xs text-gray-500 italic">No hay actores definidos en H5.1.</p>}
            </div>
          </div>
          <Textarea
            label="Función Principal"
            value={currentEspacioForm.funcionPrincipal || ''}
            onChange={(e) => handleInputChange('funcionPrincipal', e.target.value)}
            placeholder="Describa la función principal del espacio"
            rows={3}
          />
          <StyledRadioSelect
            label="Nivel de Incidencia"
            name="nivelIncidencia"
            options={nivelIncidenciaOptions}
            value={currentEspacioForm.nivelIncidencia || ''}
            onChange={(val) => handleRadioChange('nivelIncidencia', val as string)}
            inline
          />
          <Textarea
            label="Fortalezas"
            value={currentEspacioForm.fortalezas || ''}
            onChange={(e) => handleInputChange('fortalezas', e.target.value)}
            placeholder="Principales fortalezas del espacio"
            rows={3}
          />
          <Textarea
            label="Debilidades"
            value={currentEspacioForm.debilidades || ''}
            onChange={(e) => handleInputChange('debilidades', e.target.value)}
            placeholder="Principales debilidades o desafíos"
            rows={3}
          />
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={handleCancelEdit}>
            <ChevronLeftIcon className="h-5 w-5 mr-1" /> Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEspacio}>
            <CheckIcon className="h-5 w-5 mr-1" /> {editingEspacioId ? 'Guardar Cambios' : 'Añadir Espacio'}
          </Button>
        </div>
      </ToolCard>
    );
  }

  return (
    <ToolCard
      title="Herramienta 5.2 - Espacios de Diálogo y Coordinación"
      objetivo="Identificar y analizar los espacios existentes de diálogo y coordinación multiactor en el paisaje."
    >
      <div className="mb-6 flex justify-between items-center">
         <Button onClick={() => navigate('/paso5/herramienta5_1')} variant="outline" size="sm">
            <ChevronLeftIcon className="h-4 w-4 mr-1 inline-block" />
            Volver a H5.1
        </Button>
        <Button onClick={handleAddNewEspacio} variant="primary">
          <PlusIcon className="h-5 w-5 mr-1" /> Añadir Nuevo Espacio de Diálogo
        </Button>
      </div>

      {espaciosDialogoList.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No se han añadido espacios de diálogo todavía.</p>
      ) : (
        <div className="space-y-3">
          {espaciosDialogoList.map(espacio => (
            <div key={espacio.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-md font-semibold text-[#001F89]">{espacio.nombre}</h4>
                <div className="space-x-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleEditEspacio(espacio)} className="border-gray-300 hover:bg-gray-100"><PencilIcon className="h-4 w-4" /></Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteEspacio(espacio.id)}><TrashIcon className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="text-sm text-gray-600"><strong>Tipo:</strong> {espacio.tipo} - <strong>Alcance:</strong> {espacio.alcance}</p>
              <p className="text-sm text-gray-600"><strong>Nivel Incidencia:</strong> {espacio.nivelIncidencia}</p>
              <details className="text-xs mt-1">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Ver más detalles...</summary>
                <div className="mt-1 p-2 bg-gray-50 rounded text-gray-700 space-y-1">
                  <p><strong>Actores:</strong> {espacio.actoresInvolucrados || "N/A"}</p>
                  <p><strong>Función:</strong> {espacio.funcionPrincipal || "N/A"}</p>
                  <p><strong>Fortalezas:</strong> {espacio.fortalezas || "N/A"}</p>
                  <p><strong>Debilidades:</strong> {espacio.debilidades || "N/A"}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
       <div className="mt-10 text-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/paso6')} // Assuming H6.1 is the start of Paso 6
              aria-label="Continuar al Paso 6"
            >
              Continuar al Paso 6 <ArrowRightIcon className="h-5 w-5 ml-2 inline-block" />
            </Button>
        </div>
    </ToolCard>
  );
};
