
import React from 'react';
import { PasoNLayout } from './PasoNLayout';
import { STEPS_DATA } from '../constants';

const paso5Data = STEPS_DATA.find(step => step.path === '/paso5');

export const Paso5_CaracterizacionGobernanza: React.FC = () => {
  if (!paso5Data) return <div>Error: Paso 5 data no encontrada.</div>;

  return (
    <PasoNLayout
      pasoNumber={5}
      pasoTitle="Paso 5: Caracterización de la Gobernanza"
      pasoDescription="Este Paso tiene como objetivo analizar la gobernanza del paisaje a través de la identificación de actores y espacios de articulación multi actor. Se busca comprender las dinámicas de poder, colaboración y conflicto, así como los marcos normativos y los mecanismos de coordinación existentes. Este análisis permite generar estrategias informadas para fortalecer la gobernanza en función de la resiliencia y sostenibilidad del paisaje."
      tools={paso5Data.tools}
      currentPathBase="/paso5"
    />
  );
};