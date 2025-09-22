
import React from 'react';
import { PasoNLayout } from './PasoNLayout';
import { STEPS_DATA } from '../constants';

const paso4Data = STEPS_DATA.find(step => step.path === '/paso4');

export const Paso4_IdentificacionAmenazasImpactos: React.FC = () => {
  if (!paso4Data) return <div>Error: Paso 4 data no encontrada.</div>;

  return (
    <PasoNLayout
      pasoNumber={4}
      pasoTitle="Paso 4: Identificación de Amenazas e Impactos"
      pasoDescription="Este Paso tiene como objetivo analizar las amenazas climáticas y no climáticas que afectan los medios de vida, ecosistemas y servicios ecosistémicos en el paisaje. A través de herramientas de diagnóstico participativo, se busca identificar los factores de presión que generan impactos en la población y el entorno, así como visualizar los principales motores de cambio y sus efectos en cascada."
      tools={paso4Data.tools}
      currentPathBase="/paso4"
    />
  );
};