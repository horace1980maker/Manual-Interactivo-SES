
import React from 'react';
import { PasoNLayout } from './PasoNLayout';
import { STEPS_DATA } from '../constants';

const paso3Data = STEPS_DATA.find(step => step.path === '/paso3');

export const Paso3_IdentificacionMediosVida: React.FC = () => {
  if (!paso3Data) return <div>Error: Paso 3 data no encontrada.</div>;

  return (
    <PasoNLayout
      pasoNumber={3}
      pasoTitle="Paso 3: Identificación de Medios de Vida, Ecosistemas y Servicios Ecosistémicos"
      pasoDescription="El propósito de este Paso es identificar y caracterizar los medios de vida, ecosistemas y servicios ecosistémicos presentes en el paisaje, asegurando un análisis que permita reconocer la relación entre la actividad humana y los servicios que proveen los ecosistemas. Este Paso es clave para comprender las dinámicas socio ecológicas del territorio, identificar oportunidades y desafíos, y establecer la base para la identificación de soluciones basadas en la naturaleza."
      tools={paso3Data.tools}
      currentPathBase="/paso3"
    />
  );
};