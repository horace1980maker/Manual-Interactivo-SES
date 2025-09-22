
import React from 'react';
import { PasoNLayout } from './PasoNLayout';
import { STEPS_DATA } from '../constants';

const paso7Data = STEPS_DATA.find(step => step.path === '/paso7');

export const Paso7_CaracterizacionCapacidadAdaptativa: React.FC = () => {
  if (!paso7Data) return <div>Error: Paso 7 data no encontrada.</div>;

  return (
    <PasoNLayout
      pasoNumber={7}
      pasoTitle="Paso 7: Caracterización de la Capacidad Adaptativa"
      pasoDescription="Este Paso tiene como objetivo analizar la capacidad de adaptación de los hogares y sus unidades productivas en los medios de vida priorizados. Más allá de los aspectos climáticos, esta capacidad incluye factores de fragilidad relacionados con dimensiones socioeconómicas, gobernanza, políticas públicas y dinámicas ambientales, proporcionando una visión integral del contexto."
      tools={paso7Data.tools}
      currentPathBase="/paso7"
    />
  );
};