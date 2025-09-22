
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToolCard } from '../ToolCard';
import { Button } from '../common/Button';
import { EditableTable, ColumnConfig } from '../common/EditableTable';
import { Actor } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { PlusIcon } from '@heroicons/react/24/outline';

const SESSION_KEY = 'H21_ACTORES_KEY';

const newRowTemplate: Actor = {
  id: '',
  nombre: '',
  tipo: '',
  rol: '',
  conflictoCon: '',
  colaboracionCon: '',
  poder: 0,
  interes: 0,
};

export const Herramienta2_1_IdentificacionActores: React.FC = () => {
  const [actores, setActores] = useState<Actor[]>([]);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(SESSION_KEY);
      if (storedData) {
        setActores(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error parsing actors from session storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(actores));
    } catch (error) {
      console.error("Error saving actors to session storage:", error);
    }
  }, [actores]);

  const handleAddRow = () => {
    setActores([...actores, { ...newRowTemplate, id: uuidv4() }]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    setActores(actores.filter((_, index) => index !== rowIndex));
  };
  
  const columns: ColumnConfig<Actor>[] = [
    {
      header: 'Actor Clave',
      accessor: 'nombre',
      render: (row: Actor, rowIndex: number, onChange: (rowIndex: number, field: keyof Actor, value: any) => void) => (
        <Input
          type="text"
          value={row.nombre}
          onChange={(e) => onChange(rowIndex, 'nombre', e.target.value)}
          className="w-full"
          wrapperClassName="m-0"
        />
      ),
    },
    {
      header: 'Tipo de Actor',
      accessor: 'tipo',
      render: (row: Actor, rowIndex: number, onChange: (rowIndex: number, field: keyof Actor, value: any) => void) => (
        <Input
          type="text"
          value={row.tipo}
          onChange={(e) => onChange(rowIndex, 'tipo', e.target.value)}
          placeholder="Ej: Org. Comunitaria"
          className="w-full"
          wrapperClassName="m-0"
        />
      ),
    },
    {
      header: 'Rol en el Territorio',
      accessor: 'rol',
      render: (row: Actor, rowIndex: number, onChange: (rowIndex: number, field: keyof Actor, value: any) => void) => (
        <Input
          type="text"
          value={row.rol}
          onChange={(e) => onChange(rowIndex, 'rol', e.target.value)}
          placeholder="Ej: Productor, Autoridad"
          className="w-full"
          wrapperClassName="m-0"
        />
      ),
    },
    {
      header: 'Poder (0-10)',
      accessor: 'poder',
      className: 'w-24',
      render: (row: Actor, rowIndex: number, onChange: (rowIndex: number, field: keyof Actor, value: any) => void) => (
        <Input
          type="number"
          min="0"
          max="10"
          value={row.poder}
          onChange={(e) => onChange(rowIndex, 'poder', parseInt(e.target.value, 10))}
          className="w-full text-center"
          wrapperClassName="m-0"
        />
      ),
    },
    {
      header: 'Interés (0-10)',
      accessor: 'interes',
      className: 'w-24',
      render: (row: Actor, rowIndex: number, onChange: (rowIndex: number, field: keyof Actor, value: any) => void) => (
        <Input
          type="number"
          min="0"
          max="10"
          value={row.interes}
          onChange={(e) => onChange(rowIndex, 'interes', parseInt(e.target.value, 10))}
          className="w-full text-center"
          wrapperClassName="m-0"
        />
      ),
    },
  ];

  return (
    <ToolCard 
      title="Herramienta 2.1 - Identificación de Actores a Convocar"
      objetivo="Identificar y listar los actores clave del territorio, evaluando su tipo, rol, poder e interés para asegurar una convocatoria representativa e informada para los talleres."
    >
      <p className="text-sm text-gray-600 mb-4">
        Utilice la siguiente tabla para registrar a los actores clave. Puede añadir o eliminar filas según sea necesario. Los datos se guardarán automáticamente en su sesión.
      </p>
      <EditableTable
        columns={columns}
        data={actores}
        setData={setActores}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        newRowTemplate={{ ...newRowTemplate, id: uuidv4() }}
        caption="Tabla de Identificación de Actores"
      />
    </ToolCard>
  );
};