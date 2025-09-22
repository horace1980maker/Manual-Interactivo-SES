
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToolCard } from '../ToolCard';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { EditableTable, ColumnConfig } from '../common/EditableTable';
import { AgendaItem } from '../../types';

type AgendaItemWithId = AgendaItem & { id: string };

const SESSION_KEY_LOGISTICA = 'H23_LOGISTICA_KEY';
const SESSION_KEY_AGENDA_DIA1 = 'H23_AGENDA_DIA1_KEY';
const SESSION_KEY_AGENDA_DIA2 = 'H23_AGENDA_DIA2_KEY';

interface LogisticaState {
  fecha: string;
  ubicacion: string;
  facilitador: string;
  apoyo: string;
  sistematizacion: string;
  logisticaResponsable: string;
}

const initialLogisticaState: LogisticaState = {
  fecha: '',
  ubicacion: '',
  facilitador: '',
  apoyo: '',
  sistematizacion: '',
  logisticaResponsable: '',
};

const newAgendaRow: AgendaItem = { hora: '', actividad: '' };

export const Herramienta2_3_DisenoFlujoTaller: React.FC = () => {
  const [logistica, setLogistica] = useState<LogisticaState>(initialLogisticaState);
  const [agendaDia1, setAgendaDia1] = useState<AgendaItemWithId[]>([]);
  const [agendaDia2, setAgendaDia2] = useState<AgendaItemWithId[]>([]);

  useEffect(() => {
    const storedLogistica = sessionStorage.getItem(SESSION_KEY_LOGISTICA);
    if (storedLogistica) setLogistica(JSON.parse(storedLogistica));

    const storedAgenda1 = sessionStorage.getItem(SESSION_KEY_AGENDA_DIA1);
    if (storedAgenda1) {
        const parsedAgenda1: (AgendaItem & { id?: string })[] = JSON.parse(storedAgenda1);
        setAgendaDia1(parsedAgenda1.map(item => ({ ...item, id: item.id || uuidv4() })));
    }

    const storedAgenda2 = sessionStorage.getItem(SESSION_KEY_AGENDA_DIA2);
    if (storedAgenda2) {
        const parsedAgenda2: (AgendaItem & { id?: string })[] = JSON.parse(storedAgenda2);
        setAgendaDia2(parsedAgenda2.map(item => ({ ...item, id: item.id || uuidv4() })));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_LOGISTICA, JSON.stringify(logistica));
  }, [logistica]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_AGENDA_DIA1, JSON.stringify(agendaDia1));
  }, [agendaDia1]);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY_AGENDA_DIA2, JSON.stringify(agendaDia2));
  }, [agendaDia2]);

  const handleLogisticaChange = (field: keyof LogisticaState, value: string) => {
    setLogistica(prev => ({ ...prev, [field]: value }));
  };

  const agendaColumns: ColumnConfig<AgendaItemWithId>[] = [
    {
      header: 'Hora',
      accessor: 'hora',
      className: 'w-32',
      render: (row, rowIndex, onChange) => (
        <Input type="text" value={row.hora} onChange={(e) => onChange(rowIndex, 'hora', e.target.value)} placeholder="Ej: 08:00" wrapperClassName="m-0" />
      ),
    },
    {
      header: 'Actividad',
      accessor: 'actividad',
      render: (row, rowIndex, onChange) => (
        <Textarea value={row.actividad} onChange={(e) => onChange(rowIndex, 'actividad', e.target.value)} rows={2} wrapperClassName="m-0" />
      ),
    },
  ];

  return (
    <ToolCard 
      title="Herramienta 2.3 - Diseño de Flujo de Taller y Logística"
      objetivo="Establecer la información logística, los roles del equipo facilitador y la agenda detallada para cada día del taller participativo."
    >
      <div className="space-y-8">
        {/* Información General y Roles */}
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold text-[#001F89] mb-3">Información General y Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fecha del Taller" value={logistica.fecha} onChange={e => handleLogisticaChange('fecha', e.target.value)} />
            <Input label="Ubicación" value={logistica.ubicacion} onChange={e => handleLogisticaChange('ubicacion', e.target.value)} />
            <Input label="Facilitador Principal" value={logistica.facilitador} onChange={e => handleLogisticaChange('facilitador', e.target.value)} />
            <Input label="Apoyo en Facilitación" value={logistica.apoyo} onChange={e => handleLogisticaChange('apoyo', e.target.value)} />
            <Input label="Sistematización" value={logistica.sistematizacion} onChange={e => handleLogisticaChange('sistematizacion', e.target.value)} />
            <Input label="Logística" value={logistica.logisticaResponsable} onChange={e => handleLogisticaChange('logisticaResponsable', e.target.value)} />
          </div>
        </div>

        {/* Agenda Día 1 */}
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
           <EditableTable
              columns={agendaColumns}
              data={agendaDia1}
              setData={setAgendaDia1}
              onAddRow={() => setAgendaDia1(prev => [...prev, { ...newAgendaRow, id: uuidv4() }])}
              onDeleteRow={(rowIndex) => setAgendaDia1(prev => prev.filter((_, i) => i !== rowIndex))}
              newRowTemplate={{ ...newAgendaRow, id: uuidv4() }}
              caption="Agenda Detallada - Día 1"
           />
        </div>

        {/* Agenda Día 2 */}
        <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
           <EditableTable
              columns={agendaColumns}
              data={agendaDia2}
              setData={setAgendaDia2}
              onAddRow={() => setAgendaDia2(prev => [...prev, { ...newAgendaRow, id: uuidv4() }])}
              onDeleteRow={(rowIndex) => setAgendaDia2(prev => prev.filter((_, i) => i !== rowIndex))}
              newRowTemplate={{ ...newAgendaRow, id: uuidv4() }}
              caption="Agenda Detallada - Día 2"
           />
        </div>
      </div>
    </ToolCard>
  );
};